// boodoo deployable build.
// Assembles everything needed to host at https://boodooframework.com into a
// single `www/` folder: landing page, docs pages, assets, and compiled dist.
// Upload the CONTENTS of `www/` to your static host (root = domain root).
//
// Expected resulting layout served at the domain root:
//   /
//   ├── index.html          # landing
//   ├── docs/**             # generated documentation
//   ├── assets/**           # docs.css + brand assets
//   ├── dist/**             # compiled framework (CSS & JS)
//   ├── 404.html
//   └── site.webmanifest
//
// Run: node build/www-build.mjs   (or npm run www / npm run deploy)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const www = path.join(root, 'www');

console.log('📦 Assembling deployable www/ distribution folder…');

// 1. Build framework dist assets (CSS & JS)
console.log('⚙️  Building framework CSS & JS dist…');
try {
  execSync('npm run build', { cwd: root, stdio: 'inherit' });
} catch (err) {
  console.error('Failed to run npm run build:', err.message);
  process.exit(1);
}

// 2. Build archives, documentation site pages & sitemap
console.log('📦 Building source code & examples zip archives…');
try {
  execSync('node build/zip-build.mjs', { cwd: root, stdio: 'inherit' });
} catch (err) {
  console.error('Failed to run zip-build:', err.message);
  process.exit(1);
}

console.log('📄 Generating static documentation pages & sitemap…');
try {
  execSync('node build/site-build.mjs', { cwd: root, stdio: 'inherit' });
  execSync('node build/sitemap-build.mjs', { cwd: root, stdio: 'inherit' });
} catch (err) {
  console.error('Failed to run site-build:', err.message);
  process.exit(1);
}

// 3. Clean & recreate www/ target directory
if (fs.existsSync(www)) {
  fs.rmSync(www, { recursive: true, force: true });
}
fs.mkdirSync(www, { recursive: true });

const copy = (src, rel) => {
  if (!fs.existsSync(src)) {
    console.warn(`Warning: Source path does not exist for copy: ${src}`);
    return;
  }
  fs.cpSync(src, path.join(www, rel), { recursive: true });
};

// 4. Copy static site contents to www/ & inject current package version and bundle sizes
import { getDistSizes, getArchiveCdnUrls } from './site-build.mjs';
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const sizes = getDistSizes();
const cdnUrlsFile = path.join(root, 'site', 'data', 'cdn-urls.json');
const cdnUrls = fs.existsSync(cdnUrlsFile) ? JSON.parse(fs.readFileSync(cdnUrlsFile, 'utf8')) : {};
const archiveUrls = getArchiveCdnUrls(pkg.version);
let indexContent = fs.readFileSync(path.join(root, 'site', 'index.html'), 'utf8');
indexContent = indexContent
  .replaceAll('{{version}}', pkg.version)
  .replaceAll('{{cssRawKb}}', sizes.cssRaw)
  .replaceAll('{{cssMinKb}}', sizes.cssMin)
  .replaceAll('{{cssGzKb}}', sizes.cssGz)
  .replaceAll('{{cssBrKb}}', sizes.cssBr)
  .replaceAll('{{jsRawKb}}', sizes.jsRaw)
  .replaceAll('{{jsMinKb}}', sizes.jsMin)
  .replaceAll('{{jsGzKb}}', sizes.jsGz)
  .replaceAll('{{jsBrKb}}', sizes.jsBr)
  .replaceAll('{{jsEsmKb}}', sizes.jsEsm)
  .replaceAll('{{gridRawKb}}', sizes.gridRaw)
  .replaceAll('{{gridMinKb}}', sizes.gridMin)
  .replaceAll('{{gridGzKb}}', sizes.gridGz)
  .replaceAll('{{gridBrKb}}', sizes.gridBr)
  .replaceAll('{{rebootRawKb}}', sizes.rebootRaw)
  .replaceAll('{{rebootMinKb}}', sizes.rebootMin)
  .replaceAll('{{rebootGzKb}}', sizes.rebootGz)
  .replaceAll('{{rebootBrKb}}', sizes.rebootBr)
  .replaceAll('{{utilsRawKb}}', sizes.utilsRaw)
  .replaceAll('{{utilsMinKb}}', sizes.utilsMin)
  .replaceAll('{{utilsGzKb}}', sizes.utilsGz)
  .replaceAll('{{utilsBrKb}}', sizes.utilsBr)
  .replaceAll('{{animRawKb}}', sizes.animRaw)
  .replaceAll('{{animMinKb}}', sizes.animMin)
  .replaceAll('{{animGzKb}}', sizes.animGz)
  .replaceAll('{{animBrKb}}', sizes.animBr)
  .replaceAll('{{cdnCssMin}}', cdnUrls.cssMin || '')
  .replaceAll('{{cdnJsRaw}}', cdnUrls.jsRaw || '')
  .replaceAll('{{cdnJsMin}}', cdnUrls.jsMin || '')
  .replaceAll('{{cdnJsEsm}}', cdnUrls.jsEsm || '')
  .replaceAll('{{cdnGridMin}}', cdnUrls.gridMin || '')
  .replaceAll('{{cdnRebootMin}}', cdnUrls.rebootMin || '')
  .replaceAll('{{cdnUtilsMin}}', cdnUrls.utilsMin || '')
  .replaceAll('{{cdnAnimMin}}', cdnUrls.animMin || '')
  .replaceAll('{{archiveLatestZip}}', archiveUrls.latestZip)
  .replaceAll('{{archiveFrameworkZip}}', archiveUrls.frameworkZip)
  .replaceAll('{{archiveExamplesZip}}', archiveUrls.examplesZip)
  .replaceAll('{{archiveStarterReact}}', archiveUrls.starterReact)
  .replaceAll('{{archiveStarterVue}}', archiveUrls.starterVue)
  .replaceAll('{{archiveStarterNext}}', archiveUrls.starterNext)
  .replaceAll('{{archiveStarterHtml}}', archiveUrls.starterHtml)
  .replaceAll('{{archiveStarterReactNative}}', archiveUrls.starterReactNative);
fs.writeFileSync(path.join(www, 'index.html'), indexContent, 'utf8');

copy(path.join(root, 'site', 'docs'), 'docs');                   // Docs pages
copy(path.join(root, 'site', 'examples'), 'examples');           // Examples & templates
// Copy archives metadata (JSON manifest only, exclude local zip files)
const archivesOutDir = path.join(www, 'archives');
fs.mkdirSync(archivesOutDir, { recursive: true });
const manifestFile = path.join(root, 'site', 'archives', 'archives.json');
if (fs.existsSync(manifestFile)) {
  fs.copyFileSync(manifestFile, path.join(archivesOutDir, 'archives.json'));
}
copy(path.join(root, 'site', 'assets'), 'assets');               // docs.css & brand assets
copy(path.join(root, 'dist'), 'dist');                           // Compiled framework dist

// Also inject dynamic version and archive CDN URLs into all example HTML pages
function injectArchiveUrlsInDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      injectArchiveUrlsInDir(full);
    } else if (entry.name.endsWith('.html')) {
      let content = fs.readFileSync(full, 'utf8');
      content = content
        .replaceAll('{{version}}', pkg.version)
        .replaceAll('{{cssMinKb}}', sizes.cssMin)
        .replaceAll('{{jsMinKb}}', sizes.jsMin)
        .replaceAll('{{archiveLatestZip}}', archiveUrls.latestZip)
        .replaceAll('{{archiveFrameworkZip}}', archiveUrls.frameworkZip)
        .replaceAll('{{archiveExamplesZip}}', archiveUrls.examplesZip)
        .replaceAll('{{archiveStarterReact}}', archiveUrls.starterReact)
        .replaceAll('{{archiveStarterVue}}', archiveUrls.starterVue)
        .replaceAll('{{archiveStarterNext}}', archiveUrls.starterNext)
        .replaceAll('{{archiveStarterHtml}}', archiveUrls.starterHtml)
        .replaceAll('{{archiveStarterReactNative}}', archiveUrls.starterReactNative);
      fs.writeFileSync(full, content, 'utf8');
    }
  }
}
injectArchiveUrlsInDir(path.join(www, 'examples'));
copy(path.join(root, 'site', 'data'), 'assets/data');            // Navigation data
copy(path.join(root, 'site', 'robots.txt'), 'robots.txt');
copy(path.join(root, 'site', 'sitemap.xml'), 'sitemap.xml');
copy(path.join(root, 'site', 'llms.txt'), 'llms.txt');
copy(path.join(root, 'site', '404.html'), '404.html');
copy(path.join(root, 'site', '404.html'), 'error.html');
copy(path.join(root, 'site', '.htaccess'), '.htaccess');

// 6. Write site webmanifest
fs.writeFileSync(
  path.join(www, 'site.webmanifest'),
  JSON.stringify(
    {
      name: 'boodoo Framework',
      short_name: 'boodoo',
      description: 'A modular, mobile-first CSS design framework.',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#7c3aed',
      icons: [
        { src: '/assets/brand/boodoo-icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/assets/brand/boodoo-icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2
  )
);

// Count built files
let total = 0;
(function count(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) count(path.join(dir, e.name));
    else total++;
  }
})(www);

console.log(`✅ Build complete! www/ is ready to deploy (${total} files). Upload contents to static host.`);