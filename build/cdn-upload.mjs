// CDN Asset Upload and Sync Script
// Uploads compiled framework distribution files and brand assets to cdn.dihadiwala.com
// Run: node build/cdn-upload.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const APP_ID = process.env.CDN_APP_ID || 'app_299a167f351ab3de';
const APP_SECRET = process.env.CDN_APP_SECRET || 'sec_951a8d64f7c0e490d2bd2110e1dc913b';
const CDN_UPLOAD_URL = process.env.CDN_UPLOAD_URL || 'https://cdn.dihadiwala.com/api/v1/upload';

const items = [
  { key: 'cssRaw', file: 'dist/css/boodoo.css', type: 'text/css' },
  { key: 'cssMin', file: 'dist/css/boodoo.min.css', type: 'text/css' },
  { key: 'gridRaw', file: 'dist/css/boodoo-grid.css', type: 'text/css' },
  { key: 'gridMin', file: 'dist/css/boodoo-grid.min.css', type: 'text/css' },
  { key: 'rebootRaw', file: 'dist/css/boodoo-reboot.css', type: 'text/css' },
  { key: 'rebootMin', file: 'dist/css/boodoo-reboot.min.css', type: 'text/css' },
  { key: 'utilsRaw', file: 'dist/css/boodoo-utilities.css', type: 'text/css' },
  { key: 'utilsMin', file: 'dist/css/boodoo-utilities.min.css', type: 'text/css' },
  { key: 'animRaw', file: 'dist/css/boodoo-animations.css', type: 'text/css' },
  { key: 'animMin', file: 'dist/css/boodoo-animations.min.css', type: 'text/css' },
  { key: 'less', file: 'dist/css/boodoo.less.css', type: 'text/css' },
  { key: 'jsRaw', file: 'dist/js/boodoo.js', type: 'application/javascript' },
  { key: 'jsMin', file: 'dist/js/boodoo.min.js', type: 'application/javascript' },
  { key: 'jsEsm', file: 'dist/js/boodoo.esm.js', type: 'application/javascript' },
  { key: 'docsCss', file: 'site/assets/docs.css', type: 'text/css' },
  { key: 'brandSvg', file: 'site/assets/brand/boodoo-icon.svg', type: 'image/svg+xml' },
  { key: 'brandPng32', file: 'site/assets/brand/boodoo-icon-32.png', type: 'image/png' },
  { key: 'brandPng180', file: 'site/assets/brand/boodoo-icon-180.png', type: 'image/png' },
  { key: 'brandPng192', file: 'site/assets/brand/boodoo-icon-192.png', type: 'image/png' },
  { key: 'brandPng512', file: 'site/assets/brand/boodoo-icon-512.png', type: 'image/png' },
  { key: 'brandOg', file: 'site/assets/brand/boodoo-og-image.png', type: 'image/png' }
];

async function uploadFile(item) {
  const filePath = path.join(root, item.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`Skipping missing file: ${item.file}`);
    return null;
  }
  const data = fs.readFileSync(filePath);
  const blob = new Blob([data], { type: item.type });
  const form = new FormData();
  form.append('file', blob, path.basename(item.file));

  const res = await fetch(CDN_UPLOAD_URL, {
    method: 'POST',
    headers: {
      'X-App-Id': APP_ID,
      'X-App-Secret': APP_SECRET
    },
    body: form
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(`Upload failed for ${item.file}: ${JSON.stringify(json)}`);
  }
  return json.data.url;
}

export async function uploadAllAssets() {
  console.log('🚀 Uploading framework & brand assets to cdn.dihadiwala.com…');
  const urls = {};
  for (const item of items) {
    try {
      const url = await uploadFile(item);
      if (url) {
        urls[item.key] = url;
        console.log(`  ✓ ${item.file} → ${url}`);
      }
    } catch (err) {
      console.error(`  ✗ ${item.file}:`, err.message);
    }
  }

  const outJson = path.join(root, 'site', 'data', 'cdn-urls.json');
  fs.mkdirSync(path.dirname(outJson), { recursive: true });
  fs.writeFileSync(outJson, JSON.stringify(urls, null, 2), 'utf8');
  console.log(`✨ Saved active CDN URL mapping to site/data/cdn-urls.json`);
  return urls;
}

// Auto-run if executed directly via CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  uploadAllAssets().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
