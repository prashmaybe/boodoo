// Budu deployable build.
// Assembles everything needed to host at https://budu.dihadiwala.com into a
// single `www/` folder: landing page, docs pages, assets, and compiled dist.
// Upload the CONTENTS of `www/` to your static host (root = domain root).
//
// Expected resulting layout served at the domain root:
//   /
//   ├── index.html          # landing
//   ├── docs/**             # generated documentation
//   ├── assets/docs.css
//   └── dist/**             # compiled framework (CDN-ready)
//
// Run: node build/www-build.mjs   (after `npm run build` + site-build)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const www = path.join(root, 'www');

console.log('Assembling deployable www/ …');

// 1. Compile CSS if missing
const cssOut = path.join(root, 'dist', 'css', 'budu.min.css');
if (!fs.existsSync(cssOut)) {
  console.log('Building CSS (dist missing)…');
  execSync('npx sass --style=compressed scss/budu.scss ' + path.join(root, 'dist', 'css', 'budu.min.css'), { cwd: root, stdio: 'inherit' });
}

// 2. Build docs if stale/missing
const docsOut = path.join(root, 'site', 'docs', 'index.html');
if (!fs.existsSync(docsOut)) {
  execSync('node build/site-build.mjs', { cwd: root, stdio: 'inherit' });
}

// 3. Clean & copy
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(www, { recursive: true });

const copy = (src, rel) => {
  if (!fs.existsSync(src)) return;
  fs.cpSync(src, path.join(www, rel), { recursive: true });
};

copy(path.join(root, 'site', 'index.html'), 'index.html');       // landing at /
copy(path.join(root, 'site', 'docs'), 'docs');                   // docs pages
copy(path.join(root, 'site', 'assets'), 'assets');               // docs.css
copy(path.join(root, 'dist'), 'dist');                           // compiled framework
copy(path.join(root, 'site', 'data'), 'assets/data');            // (optional) nav data

// 4. Write a tiny 404 redirect to keep clean URLs
fs.writeFileSync(
  path.join(www, '404.html'),
  '<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/"><title>Redirecting…</title></head><body><a href="/">Going home…</a></body></html>'
);

// 5. Manifest / meta
fs.writeFileSync(
  path.join(www, 'site.webmanifest'),
  JSON.stringify({
    name: 'Budu',
    short_name: 'Budu',
    description: 'A modular, mobile-first CSS design framework.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#7c3aed',
    icons: [
      { src: '/assets/brand/budu-icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/assets/brand/budu-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }, null, 2)
);

// Count built files
let total = 0;
(function count(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) count(path.join(dir, e.name));
    else total++;
  }
})(www);

console.log(`Done → www/ is ready to deploy (${total} files). Upload its contents to https://budu.dihadiwala.com/`);