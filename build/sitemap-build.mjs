// boodoo sitemap generator
// Generates site/sitemap.xml dynamically from docs-nav.json and site pages
// Run: node build/sitemap-build.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const navFile = path.join(root, 'site', 'data', 'docs-nav.json');
const sitemapFile = path.join(root, 'site', 'sitemap.xml');
const srcDir = path.join(root, 'site', 'src');

const BASE_URL = 'https://boodoo.dihadiwala.com';
const TODAY = new Date().toISOString().split('T')[0];

function walkHtml(dir, base = '') {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkHtml(full, path.posix.join(base, entry.name)));
    } else if (entry.name.endsWith('.html')) {
      const route = path.posix.join(base, entry.name);
      results.push(route);
    }
  }
  return results;
}

const docsPages = walkHtml(srcDir);

const urls = [
  { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'weekly' },
  { loc: `${BASE_URL}/llms.txt`, priority: '0.5', changefreq: 'monthly' }
];

for (const relPath of docsPages) {
  let priority = '0.7';
  if (relPath.startsWith('getting-started/')) priority = '0.8';
  if (relPath.startsWith('components/')) priority = '0.8';
  if (relPath.startsWith('about/vs-')) priority = '0.9'; // high intent SEO
  if (relPath === 'getting-started/introduction.html') priority = '0.9';

  urls.push({
    loc: `${BASE_URL}/docs/${relPath}`,
    priority,
    changefreq: 'monthly'
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(sitemapFile, xml, 'utf8');
console.log(`✅ Generated ${urls.length} URLs in site/sitemap.xml`);
