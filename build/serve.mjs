// budu site local static server. Run: node build/serve.mjs
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.map': 'application/json',
  '.ico': 'image/x-icon',
};

// Serves the deployable `www/` folder (build it first with www-build.mjs).
// Previews http://localhost:8080 exactly as the deployed domain will look.
console.log('Hint: run `node build/www-build.mjs` once before serving.');

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  // Prefer serving from www/ (deploy root), fall back to site/ for source docs
  const docRoot = fs.existsSync(path.join(root, 'www')) ? path.join(root, 'www') : path.join(root, 'site');
  if (urlPath === '/') urlPath = '/index.html';
  if (!path.extname(urlPath)) {
    // prettify doc routes
    const tryFiles = [
      path.join(docRoot, urlPath + '.html'),
      path.join(docRoot, urlPath, 'index.html'),
    ];
    const found = tryFiles.find((f) => fs.existsSync(f));
    if (found) urlPath = path.relative(docRoot, found).replace(/\\/g, '/');
  }
  const file = path.join(docRoot, urlPath);
  if (!file.startsWith(root)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + urlPath);
      return;
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`budu docs server running at http://localhost:${PORT}`);
});