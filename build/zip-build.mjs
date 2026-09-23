// boodoo versioned zip & starter archive builder
// Creates boodoo-v{version}.zip containing source code, dist, scss, less, js, docs
// and creates standalone starter zip packages with zero external dependencies.
// Run: node build/zip-build.mjs

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version;

const outDir = path.join(root, 'site', 'archives');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Compute CRC32 checksum for standard zip entries
const makeCrcTable = () => {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
};

const CRC_TABLE = makeCrcTable();

function crc32(buffer) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buffer.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buffer[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

// Convert Date to DOS time/date format
function dosDateTime(date = new Date()) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const d = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, date: d };
}

/**
 * Minimal zero-dependency ZIP archive generator supporting deflate compression.
 */
class ZipArchive {
  constructor() {
    this.entries = [];
  }

  addFile(name, content, mtime = new Date()) {
    const dataBuf = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
    const normName = name.replace(/\\/g, '/').replace(/^\/+/, '');
    const deflated = zlib.deflateRawSync(dataBuf, { level: 9 });
    const useDeflate = deflated.length < dataBuf.length;
    
    this.entries.push({
      name: normName,
      compressed: useDeflate ? deflated : dataBuf,
      uncompressedSize: dataBuf.length,
      compressedSize: useDeflate ? deflated.length : dataBuf.length,
      method: useDeflate ? 8 : 0,
      crc: crc32(dataBuf),
      mtime
    });
  }

  toBuffer() {
    const localHeaders = [];
    const centralHeaders = [];
    let offset = 0;

    for (const entry of this.entries) {
      const nameBuf = Buffer.from(entry.name, 'utf8');
      const { time, date } = dosDateTime(entry.mtime);

      // Local file header (30 bytes + nameBuf.length)
      const lh = Buffer.alloc(30 + nameBuf.length);
      lh.writeUInt32LE(0x04034b50, 0); // signature
      lh.writeUInt16LE(20, 4);         // version needed to extract (2.0)
      lh.writeUInt16LE(0x0800, 6);     // flags (UTF-8)
      lh.writeUInt16LE(entry.method, 8); // compression method
      lh.writeUInt16LE(time, 10);
      lh.writeUInt16LE(date, 12);
      lh.writeUInt32LE(entry.crc, 14);
      lh.writeUInt32LE(entry.compressedSize, 18);
      lh.writeUInt32LE(entry.uncompressedSize, 22);
      lh.writeUInt16LE(nameBuf.length, 26);
      lh.writeUInt16LE(0, 28); // extra field length
      nameBuf.copy(lh, 30);

      localHeaders.push(lh);
      localHeaders.push(entry.compressed);

      // Central directory header (46 bytes + nameBuf.length)
      const cd = Buffer.alloc(46 + nameBuf.length);
      cd.writeUInt32LE(0x02014b50, 0); // signature
      cd.writeUInt16LE(20, 4);         // version made by
      cd.writeUInt16LE(20, 6);         // version needed to extract
      cd.writeUInt16LE(0x0800, 8);     // flags (UTF-8)
      cd.writeUInt16LE(entry.method, 10);
      cd.writeUInt16LE(time, 12);
      cd.writeUInt16LE(date, 14);
      cd.writeUInt32LE(entry.crc, 16);
      cd.writeUInt32LE(entry.compressedSize, 20);
      cd.writeUInt32LE(entry.uncompressedSize, 24);
      cd.writeUInt16LE(nameBuf.length, 28);
      cd.writeUInt16LE(0, 30); // extra field length
      cd.writeUInt16LE(0, 32); // comment length
      cd.writeUInt16LE(0, 34); // disk number start
      cd.writeUInt16LE(0, 36); // internal file attributes
      cd.writeUInt32LE(0x81a40000, 38); // external file attributes (-rw-r--r--)
      cd.writeUInt32LE(offset, 42); // relative offset of local header
      nameBuf.copy(cd, 46);

      centralHeaders.push(cd);

      offset += lh.length + entry.compressed.length;
    }

    const cdOffset = offset;
    const cdSize = centralHeaders.reduce((acc, b) => acc + b.length, 0);

    // End of central directory record (22 bytes)
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0); // signature
    eocd.writeUInt16LE(0, 4);          // disk number
    eocd.writeUInt16LE(0, 6);          // disk where cd starts
    eocd.writeUInt16LE(this.entries.length, 8);  // entries on disk
    eocd.writeUInt16LE(this.entries.length, 10); // total entries
    eocd.writeUInt32LE(cdSize, 12);    // cd size
    eocd.writeUInt32LE(cdOffset, 16);  // offset of cd
    eocd.writeUInt16LE(0, 20);         // comment length

    return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
  }
}

// Add recursive folder to zip archive
function addDirectoryToZip(zip, srcDir, zipPrefix = '') {
  if (!fs.existsSync(srcDir)) return;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.DS_Store' || entry.name.endsWith('.zip')) continue;
    const fullPath = path.join(srcDir, entry.name);
    const zipPath = path.posix.join(zipPrefix, entry.name);
    if (entry.isDirectory()) {
      addDirectoryToZip(zip, fullPath, zipPath);
    } else {
      const content = fs.readFileSync(fullPath);
      const stat = fs.statSync(fullPath);
      zip.addFile(zipPath, content, stat.mtime);
    }
  }
}

console.log(`📦 Generating framework zip archives for boodoo v${version}...`);

// 1. Full framework source & dist archive
const fullZip = new ZipArchive();
const zipRoot = `boodoo-${version}`;

for (const file of ['package.json', 'README.md', 'CHANGELOG.md', 'LICENSE']) {
  const filePath = path.join(root, file);
  if (fs.existsSync(filePath)) {
    fullZip.addFile(path.posix.join(zipRoot, file), fs.readFileSync(filePath));
  }
}

addDirectoryToZip(fullZip, path.join(root, 'dist'), path.posix.join(zipRoot, 'dist'));
addDirectoryToZip(fullZip, path.join(root, 'scss'), path.posix.join(zipRoot, 'scss'));
addDirectoryToZip(fullZip, path.join(root, 'less'), path.posix.join(zipRoot, 'less'));
addDirectoryToZip(fullZip, path.join(root, 'js'), path.posix.join(zipRoot, 'js'));

const fullZipBuffer = fullZip.toBuffer();
const versionedZipFile = path.join(outDir, `boodoo-v${version}.zip`);
const latestZipFile = path.join(outDir, 'boodoo-latest.zip');
fs.writeFileSync(versionedZipFile, fullZipBuffer);
fs.writeFileSync(latestZipFile, fullZipBuffer);
console.log(`✔ Framework source archive created: boodoo-v${version}.zip (${Math.round(fullZipBuffer.length / 1024)} KB)`);

// 2. All Examples Archive (contains all HTML templates and starters)
const examplesZip = new ZipArchive();
addDirectoryToZip(examplesZip, path.join(root, 'site', 'examples'), `boodoo-examples-${version}`);
const examplesZipBuffer = examplesZip.toBuffer();
fs.writeFileSync(path.join(outDir, `boodoo-examples-v${version}.zip`), examplesZipBuffer);
fs.writeFileSync(path.join(outDir, 'boodoo-examples.zip'), examplesZipBuffer);
console.log(`✔ Examples archive created: boodoo-examples-v${version}.zip (${Math.round(examplesZipBuffer.length / 1024)} KB)`);

// 3. React Starter Zip
const reactZip = new ZipArchive();
addDirectoryToZip(reactZip, path.join(root, 'site', 'examples', 'starters', 'react-vite'), 'boodoo-react-vite-starter');
fs.writeFileSync(path.join(outDir, 'boodoo-react-vite-starter.zip'), reactZip.toBuffer());

// 4. Vue Starter Zip
const vueZip = new ZipArchive();
addDirectoryToZip(vueZip, path.join(root, 'site', 'examples', 'starters', 'vue-vite'), 'boodoo-vue-vite-starter');
fs.writeFileSync(path.join(outDir, 'boodoo-vue-vite-starter.zip'), vueZip.toBuffer());

// 5. Next.js Starter Zip
const nextZip = new ZipArchive();
addDirectoryToZip(nextZip, path.join(root, 'site', 'examples', 'starters', 'nextjs'), 'boodoo-nextjs-starter');
fs.writeFileSync(path.join(outDir, 'boodoo-nextjs-starter.zip'), nextZip.toBuffer());

// 6. HTML5 Starter Zip
const htmlZip = new ZipArchive();
addDirectoryToZip(htmlZip, path.join(root, 'site', 'examples', 'starters', 'html-starter'), 'boodoo-html-starter');
fs.writeFileSync(path.join(outDir, 'boodoo-html-starter.zip'), htmlZip.toBuffer());

// Archive information manifest
const archiveManifest = {
  version,
  generatedAt: new Date().toISOString(),
  frameworkZip: `boodoo-v${version}.zip`,
  frameworkZipSizeKb: Math.round(fullZipBuffer.length / 1024),
  frameworkZipBytes: fullZipBuffer.length,
  latestZip: 'boodoo-latest.zip',
  examplesZip: `boodoo-examples-v${version}.zip`,
  examplesZipSizeKb: Math.round(examplesZipBuffer.length / 1024),
  starters: [
    { id: 'react-vite', file: 'boodoo-react-vite-starter.zip' },
    { id: 'vue-vite', file: 'boodoo-vue-vite-starter.zip' },
    { id: 'nextjs', file: 'boodoo-nextjs-starter.zip' },
    { id: 'html-starter', file: 'boodoo-html-starter.zip' }
  ]
};
fs.writeFileSync(path.join(outDir, 'archives.json'), JSON.stringify(archiveManifest, null, 2), 'utf8');

export { ZipArchive, addDirectoryToZip };
