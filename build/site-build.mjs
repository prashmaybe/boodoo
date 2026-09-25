// BOODOO Docs site builder
// Assembles static HTML pages from a shared layout + per-page content
// fragments + a sidebar nav tree. Run: node build/site-build.mjs
//
// Content fragment files live in site/src/**/*.html. Each optional first
// HTML comment carries frontmatter:
//   <!--
//   title: ...
//   description: ...
//   section: components|getting-started|...
//   order: N
//   -->

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'site', 'src');
const layoutFile = path.join(root, 'site', 'layout.html');
const navFile = path.join(root, 'site', 'data', 'docs-nav.json');
const outDir = path.join(root, 'site', 'docs');
const distDir = path.join(root, 'dist');

// Helper to get formatted file sizes in KB
export function getDistSizes() {
  const getKb = (rel) => {
    const file = path.join(distDir, rel);
    if (!fs.existsSync(file)) return '0';
    const bytes = fs.statSync(file).size;
    return Math.round(bytes / 1024).toString();
  };

  return {
    cssRaw: getKb('css/boodoo.css'),
    cssMin: getKb('css/boodoo.min.css'),
    jsRaw: getKb('js/boodoo.js'),
    jsMin: getKb('js/boodoo.min.js'),
    jsEsm: getKb('js/boodoo.esm.js'),
    gridRaw: getKb('css/boodoo-grid.css'),
    gridMin: getKb('css/boodoo-grid.min.css'),
    rebootRaw: getKb('css/boodoo-reboot.css'),
    rebootMin: getKb('css/boodoo-reboot.min.css'),
    utilsRaw: getKb('css/boodoo-utilities.css'),
    utilsMin: getKb('css/boodoo-utilities.min.css'),
    animRaw: getKb('css/boodoo-animations.css'),
  };
}

// Helper to provide CDN URLs for all downloadable archives
export function getArchiveCdnUrls(version) {
  const cdnBase = `https://cdn.jsdelivr.net/gh/prashmaybe/budu@main/site/archives`;
  return {
    latestZip: `${cdnBase}/boodoo-latest.zip`,
    frameworkZip: `${cdnBase}/boodoo-v${version}.zip`,
    examplesZip: `${cdnBase}/boodoo-examples-v${version}.zip`,
    starterReact: `${cdnBase}/boodoo-react-vite-starter.zip`,
    starterVue: `${cdnBase}/boodoo-vue-vite-starter.zip`,
    starterNext: `${cdnBase}/boodoo-nextjs-starter.zip`,
    starterHtml: `${cdnBase}/boodoo-html-starter.zip`
  };
}

if (!fs.existsSync(layoutFile)) {
  console.error('Missing layout:', layoutFile);
  process.exit(1);
}

const layout = fs.readFileSync(layoutFile, 'utf8');
const nav = JSON.parse(fs.readFileSync(navFile, 'utf8'));

// Current year for footer
const YEAR = new Date().getFullYear();

// Collect all content fragments
function walk(dir, base = '') {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full, path.posix.join(base, entry.name)));
    } else if (entry.name.endsWith('.html')) {
      const route = path.posix.join(base, entry.name).replace(/\.html$/, '');
      results.push({ full, route });
    }
  }
  return results;
}

function parseFrontmatter(content) {
  const m = content.match(/^<!--([\s\S]*?)-->/);
  const meta = { title: '', description: '', section: '', order: 999 };
  if (m) {
    for (const line of m[1].split('\n')) {
      const idx = line.indexOf(':');
      if (idx > -1) {
        const key = line.slice(0, idx).trim().toLowerCase();
        const val = line.slice(idx + 1).trim();
        if (key in meta) meta[key] = val;
      }
    }
  }
  // strip the frontmatter comment
  const body = m ? content.slice(m[0].length).trim() : content.trim();
  return { meta, body };
}

// Build sidebar HTML from nav tree + active section
function renderSidebar(sections, activeRoute, titleMap) {
  const activeDepth = activeRoute.split('/').length; // e.g., 'getting-started/introduction' -> 2
  const prefix = '../'.repeat(activeDepth - 1);
  const parts = [];
  for (const section of sections) {
    const items = section.pages.filter((p) => titleMap[p.route]);
    if (!items.length) continue;
    parts.push(`<h6 class="docs-nav-section">${section.title}</h6>`);
    parts.push(`<ul class="docs-nav-list">`);
    for (const item of items) {
      const href = item.route === 'index' ? prefix + '../index.html' : prefix + item.route + '.html';
      const active = item.route === activeRoute ? ' class="active"' : '';
      parts.push(`<li><a href="${href}"${active}>${titleMap[item.route]}</a></li>`);
    }
    parts.push(`</ul>`);
  }
  return parts.join('\n');
}

// Render a breadcrumb from the active route
function renderBreadcrumb(sections, activeRoute, title) {
  const activeDepth = activeRoute.split('/').length;
  const prefix = '../'.repeat(activeDepth);
  let sectionTitle = '';
  for (const s of sections) {
    if (s.pages.some((p) => p.route === activeRoute)) sectionTitle = s.title;
  }
  return `
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="${prefix}index.html">Home</a></li>
        ${sectionTitle ? `<li class="breadcrumb-item">${sectionTitle}</li>` : ''}
        <li class="breadcrumb-item active" aria-current="page">${title}</li>
      </ol>
    </nav>`;
}

// Render previous/next navigation
function prevNext(sections, activeRoute, titleMap) {
  const activeDepth = activeRoute.split('/').length;
  const prefix = '../'.repeat(activeDepth - 1);
  const flat = [];
  for (const s of sections) {
    for (const p of s.pages) {
      if (!titleMap[p.route]) continue;
      flat.push({ route: p.route, title: titleMap[p.route], section: s.title });
    }
  }
  const idx = flat.findIndex((p) => p.route === activeRoute);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx < flat.length - 1 ? flat[idx + 1] : null;
  const link = (item) =>
    item ? `
    <div class="docs-pager-item">
      <span class="docs-pager-label">${item.section}</span>
      <a class="docs-pager-link" href="${item.route === 'index' ? prefix + '../index.html' : prefix + item.route + '.html'}">${item.title}</a>
    </div>` : '<div></div>';
  return `
  <nav class="docs-pager" aria-label="Previous and next navigation">
    ${link(prev)}
    ${link(next)}
  </nav>`;
}

// Build table of contents from headings in body
function renderToc(body) {
  const headings = [];
  const re = /<h([23])\s+id="([^"]+)"[^>]*>(.*?)<\/h\1>/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    headings.push({ level: Number(m[1]), id: m[2], text: m[3].replace(/<[^>]+>/g, '') });
  }
  if (!headings.length) return '';
  const items = headings
    .map((h) => `<li class="toc-${h.level}"><a href="#${h.id}">${h.text}</a></li>`)
    .join('\n');
  return `
    <div class="docs-toc d-none d-lg-block">
      <h6 class="docs-toc-title">On this page</h6>
      <ul>${items}</ul>
    </div>`;
}

// Escape CSS-valid heading IDs
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Build a page
function buildPage(sectionDef, { route, full }) {
  const source = fs.readFileSync(full, 'utf8');
  const { meta, body } = parseFrontmatter(source);
  const title = meta.title;

  // Ensure headings have ids for TOC + anchor links
  const bodyWithIds = body.replace(
    /<(h[23])([^>]*)>/g,
    (fullTag, tag, attrs) => {
      if (/\sid=/.test(attrs)) return fullTag;
      const text = (fullTag.replace(/<[^>]+>/g, '') || '').trim();
      const id = slugify(text);
      return `<${tag}${attrs} id="${id}">`;
    }
  );

  // title map for sidebar
  const titleMap = { [route]: meta.title };
  for (const s of nav) {
    for (const p of s.pages) {
      if (p.route === route) continue; // avoid overwrite of self; fine
    }
  }

  // Build a full title map from all pages
  const allPages = [];
  for (const s of nav) for (const p of s.pages) allPages.push(p);
  const fullTitleMap = {};
  allPages.forEach((p) => { fullTitleMap[p.route] = p.title; });
  // override with actual frontmatter where available
  for (const fileDef of walk(srcDir)) {
    const data = parseFrontmatter(fs.readFileSync(fileDef.full, 'utf8'));
    fullTitleMap[path.posix.join(path.relative(srcDir, fileDef.full)).replace(/\.html$/, '')] = data.meta.title;
  }

  const sidebar = renderSidebar(nav, route, fullTitleMap);
  const breadcrumb = renderBreadcrumb(nav, route, title);
  const pager = prevNext(nav, route, fullTitleMap);
  const toc = renderToc(bodyWithIds);
  const hasToc = Boolean(toc.trim());
  const mainColClass = hasToc ? 'col-lg-6 col-xl-7' : 'col-lg-9 col-xl-10';
  const tocAside = hasToc ? `<aside class="col-lg-3 col-xl-3">\n${toc}\n</aside>` : '';

  const activeDepth = route.split('/').length;
  const rootPrefix = '../'.repeat(activeDepth);

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const VERSION = pkg.version;
const sizes = getDistSizes();
const cdnUrlsFile = path.join(root, 'site', 'data', 'cdn-urls.json');
const cdnUrls = fs.existsSync(cdnUrlsFile) ? JSON.parse(fs.readFileSync(cdnUrlsFile, 'utf8')) : {};
const archiveUrls = getArchiveCdnUrls(VERSION);

  let bodyRendered = bodyWithIds
    .replaceAll('{{version}}', VERSION)
    .replaceAll('{{cssRawKb}}', sizes.cssRaw)
    .replaceAll('{{cssMinKb}}', sizes.cssMin)
    .replaceAll('{{jsRawKb}}', sizes.jsRaw)
    .replaceAll('{{jsMinKb}}', sizes.jsMin)
    .replaceAll('{{jsEsmKb}}', sizes.jsEsm)
    .replaceAll('{{gridRawKb}}', sizes.gridRaw)
    .replaceAll('{{gridMinKb}}', sizes.gridMin)
    .replaceAll('{{rebootRawKb}}', sizes.rebootRaw)
    .replaceAll('{{rebootMinKb}}', sizes.rebootMin)
    .replaceAll('{{utilsRawKb}}', sizes.utilsRaw)
    .replaceAll('{{utilsMinKb}}', sizes.utilsMin)
    .replaceAll('{{animRawKb}}', sizes.animRaw)
    .replaceAll('{{animMinKb}}', sizes.animMin)
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
    .replaceAll('{{archiveStarterHtml}}', archiveUrls.starterHtml);

  let html = layout
    .replaceAll('{{rootPrefix}}', rootPrefix)
    .replaceAll('{{title}}', title)
    .replaceAll('{{description}}', meta.description || `${title} — boodoo docs`)
    .replaceAll('{{sidebar}}', sidebar)
    .replaceAll('{{breadcrumb}}', breadcrumb)
    .replaceAll('{{mainColClass}}', mainColClass)
    .replaceAll('{{tocAside}}', tocAside)
    .replaceAll('{{toc}}', toc)
    .replaceAll('{{content}}', bodyRendered)
    .replaceAll('{{prevnext}}', pager)
    .replaceAll('{{year}}', String(YEAR))
    .replaceAll('{{version}}', VERSION)
    .replaceAll('{{cssRawKb}}', sizes.cssRaw)
    .replaceAll('{{cssMinKb}}', sizes.cssMin)
    .replaceAll('{{jsRawKb}}', sizes.jsRaw)
    .replaceAll('{{jsMinKb}}', sizes.jsMin)
    .replaceAll('{{jsEsmKb}}', sizes.jsEsm)
    .replaceAll('{{gridRawKb}}', sizes.gridRaw)
    .replaceAll('{{gridMinKb}}', sizes.gridMin)
    .replaceAll('{{rebootRawKb}}', sizes.rebootRaw)
    .replaceAll('{{rebootMinKb}}', sizes.rebootMin)
    .replaceAll('{{utilsRawKb}}', sizes.utilsRaw)
    .replaceAll('{{utilsMinKb}}', sizes.utilsMin)
    .replaceAll('{{animRawKb}}', sizes.animRaw)
    .replaceAll('{{animMinKb}}', sizes.animMin)
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
    .replaceAll('{{docstitle}}', title);

  return html;
}

// Build all pages
const files = walk(srcDir);
fs.mkdirSync(outDir, { recursive: true });
let count = 0;
for (const fileDef of files) {
  const outPath = path.join(outDir, fileDef.route + '.html');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const html = buildPage(null, fileDef);
  fs.writeFileSync(outPath, html);
  count++;
}
console.log(`Built ${count} docs pages → site/docs/`);

// Copy static assets (site CSS writes are inline in layout; keep future-proof)
const staticSrc = path.join(root, 'site', 'assets');
const staticDst = path.join(root, 'site', 'docs', 'assets');
if (fs.existsSync(staticSrc)) {
  fs.cpSync(staticSrc, staticDst, { recursive: true });
  console.log('Copied site assets');
}