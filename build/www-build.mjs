// boodoo deployable build.
// Assembles everything needed to host at https://boodoo.dihadiwala.com into a
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

// 2. Build documentation site pages & sitemap
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

// 4. Copy static site contents to www/
copy(path.join(root, 'site', 'index.html'), 'index.html');       // Landing page at /
copy(path.join(root, 'site', 'docs'), 'docs');                   // Docs pages
copy(path.join(root, 'site', 'assets'), 'assets');               // docs.css & brand assets
copy(path.join(root, 'dist'), 'dist');                           // Compiled framework dist
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