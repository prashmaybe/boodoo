import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const rootDir = resolve(import.meta.dirname, '..');

test('Boodoo website www to non-www redirection and canonical URL integrity', () => {
  // 1. Verify .htaccess contains www-to-non-www 301 redirection
  // 1. Verify .htaccess contains www-to-non-www 301 redirection and HTTPS enforcement
  const htaccessPath = resolve(rootDir, 'site/.htaccess');
  assert.ok(existsSync(htaccessPath), 'site/.htaccess must exist');
  const htaccess = readFileSync(htaccessPath, 'utf8');
  assert.ok(htaccess.includes('RewriteCond %{HTTP_HOST} ^www\\.'), '.htaccess must match www host condition');
  assert.ok(htaccess.includes('RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]'), '.htaccess must redirect www to non-www via 301');
  assert.ok(htaccess.includes('RewriteCond %{HTTPS} off'), '.htaccess must enforce HTTPS');
  assert.ok(htaccess.includes('RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]'), '.htaccess must redirect HTTP to HTTPS via 301');

  // 2. Verify _redirects contains www-to-non-www rules
  const redirectsPath = resolve(rootDir, 'site/_redirects');
  assert.ok(existsSync(redirectsPath), 'site/_redirects must exist');
  const redirects = readFileSync(redirectsPath, 'utf8');
  assert.ok(redirects.includes('https://www.boodooframework.com/* https://boodooframework.com/:splat 301!'), '_redirects must redirect www to non-www');

  // 3. Verify canonical tags across all HTML pages in site/
  function walkHtml(dir) {
    const results = [];
    if (!existsSync(dir)) return results;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('_')) continue;
      const full = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...walkHtml(full));
      } else if (entry.name.endsWith('.html')) {
        results.push(full);
      }
    }
    return results;
  }

  const siteHtml = walkHtml(resolve(rootDir, 'site'));
  const checkedPages = [];

  for (const file of siteHtml) {
    // Skip template layout and src fragments (they are compiled into site/docs)
    const rel = relative(resolve(rootDir, 'site'), file).replace(/\\/g, '/');
    if (rel === 'layout.html' || rel.startsWith('src/')) continue;

    const content = readFileSync(file, 'utf8');

    // Canonical link tag must be present
    const canonicalMatch = content.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i);
    assert.ok(canonicalMatch, `${rel} must have a <link rel="canonical"> tag`);
    const hrefMatch = canonicalMatch[0].match(/href=["']([^"']+)["']/i);
    assert.ok(hrefMatch, `${rel} canonical tag must contain href`);
    const canonicalUrl = hrefMatch[1];

    // Canonical URL must be HTTPS and non-www
    const parsedCanonical = new URL(canonicalUrl);
    assert.strictEqual(parsedCanonical.protocol, 'https:', `${rel} canonical URL must use HTTPS: ${canonicalUrl}`);
    assert.strictEqual(parsedCanonical.hostname, 'boodooframework.com', `${rel} canonical URL hostname must be boodooframework.com: ${canonicalUrl}`);

    // og:url meta tag must match canonical URL
    const ogMatch = content.match(/<meta\s+[^>]*property=["']og:url["'][^>]*>/i);
    assert.ok(ogMatch, `${rel} must have a <meta property="og:url"> tag`);
    const ogHrefMatch = ogMatch[0].match(/content=["']([^"']+)["']/i);
    assert.ok(ogHrefMatch, `${rel} og:url must contain content attribute`);
    assert.equal(ogHrefMatch[1], canonicalUrl, `${rel} og:url must match canonical URL`);

    checkedPages.push(rel);
  }

  assert.ok(checkedPages.length >= 140, `Must verify canonicals across all site pages (checked ${checkedPages.length})`);
});


test('Privacy Policy and Terms and Conditions pages integrity and navigation', () => {
  // 1. Verify source fragments exist
  const privacySrc = resolve(rootDir, 'site/src/about/privacy.html');
  const termsSrc = resolve(rootDir, 'site/src/about/terms.html');
  assert.ok(existsSync(privacySrc), 'site/src/about/privacy.html must exist');
  assert.ok(existsSync(termsSrc), 'site/src/about/terms.html must exist');

  const privacyContent = readFileSync(privacySrc, 'utf8');
  const termsContent = readFileSync(termsSrc, 'utf8');

  // Verify titles and key sections
  assert.ok(privacyContent.includes('title: Privacy policy'), 'Privacy policy must declare title');
  assert.ok(privacyContent.includes('Core Privacy Philosophy'), 'Privacy policy must cover core philosophy');
  assert.ok(privacyContent.includes('Zero Framework Telemetry'), 'Privacy policy must affirm zero telemetry');
  assert.ok(privacyContent.includes('Cookies and Local Browser Storage'), 'Privacy policy must detail cookies and local storage');

  assert.ok(termsContent.includes('title: Terms and conditions'), 'Terms must declare title');
  assert.ok(termsContent.includes('Acceptance of Terms'), 'Terms must include Acceptance of Terms');
  assert.ok(termsContent.includes('Open-Source Software vs. Website Terms'), 'Terms must distinguish MIT license vs website terms');
  assert.ok(termsContent.includes('Disclaimer of Warranties'), 'Terms must include warranty disclaimer');

  // 2. Verify compiled pages exist
  const privacyCompiled = resolve(rootDir, 'site/docs/about/privacy.html');
  const termsCompiled = resolve(rootDir, 'site/docs/about/terms.html');
  assert.ok(existsSync(privacyCompiled), 'Compiled site/docs/about/privacy.html must exist');
  assert.ok(existsSync(termsCompiled), 'Compiled site/docs/about/terms.html must exist');

  const compiledPrivacyHtml = readFileSync(privacyCompiled, 'utf8');
  assert.ok(compiledPrivacyHtml.includes('<title>Privacy policy · boodoo</title>'), 'Compiled privacy page must have title');
  assert.ok(compiledPrivacyHtml.includes('https://boodooframework.com/docs/about/privacy.html'), 'Compiled privacy page must have canonical URL');

  const compiledTermsHtml = readFileSync(termsCompiled, 'utf8');
  assert.ok(compiledTermsHtml.includes('<title>Terms and conditions · boodoo</title>'), 'Compiled terms page must have title');
  assert.ok(compiledTermsHtml.includes('https://boodooframework.com/docs/about/terms.html'), 'Compiled terms page must have canonical URL');

  // 3. Verify docs-nav.json includes both routes
  const navPath = resolve(rootDir, 'site/data/docs-nav.json');
  const nav = JSON.parse(readFileSync(navPath, 'utf8'));
  const aboutSection = nav.find((s) => s.title === 'About');
  assert.ok(aboutSection, 'docs-nav.json must have About section');
  assert.ok(aboutSection.pages.some((p) => p.route === 'about/privacy'), 'docs-nav.json must include about/privacy');
  assert.ok(aboutSection.pages.some((p) => p.route === 'about/terms'), 'docs-nav.json must include about/terms');

  // 4. Verify footer links in layout and landing page
  const layoutHtml = readFileSync(resolve(rootDir, 'site/layout.html'), 'utf8');
  assert.ok(layoutHtml.includes('about/privacy.html'), 'site/layout.html footer must link to privacy.html');
  assert.ok(layoutHtml.includes('about/terms.html'), 'site/layout.html footer must link to terms.html');

  const indexHtml = readFileSync(resolve(rootDir, 'site/index.html'), 'utf8');
  assert.ok(indexHtml.includes('docs/about/privacy.html'), 'site/index.html footer must link to privacy.html');
  assert.ok(indexHtml.includes('docs/about/terms.html'), 'site/index.html footer must link to terms.html');

  // 5. Verify redirects in _redirects and .htaccess
  const redirects = readFileSync(resolve(rootDir, 'site/_redirects'), 'utf8');
  assert.ok(redirects.includes('/privacy'), '_redirects must redirect /privacy');
  assert.ok(redirects.includes('/terms'), '_redirects must redirect /terms');

  const htaccess = readFileSync(resolve(rootDir, 'site/.htaccess'), 'utf8');
  assert.ok(htaccess.includes('privacy'), '.htaccess must include privacy rule');
  assert.ok(htaccess.includes('terms'), '.htaccess must include terms rule');
});


test('Official Haticons integration, SCSS/LESS parity, and docs verification', () => {
  // 1. Verify SCSS & LESS compilation parity for .icon and .alert-icon
  const mainCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.css'), 'utf8');
  const lessCss = readFileSync(resolve(rootDir, 'dist/css/boodoo.less.css'), 'utf8');

  // .icon token rules
  assert.ok(mainCss.includes('.icon'), 'dist/css/boodoo.css must define .icon');
  assert.ok(lessCss.includes('.icon'), 'dist/css/boodoo.less.css must define .icon');
  assert.match(mainCss, /\.icon\s*\{[^}]*display:\s*inline-flex/);
  assert.match(lessCss, /\.icon\s*\{[^}]*display:\s*inline-flex/);

  // Sizing tokens
  ['icon-xs', 'icon-sm', 'icon-md', 'icon-lg', 'icon-xl', 'icon-2xl'].forEach(token => {
    assert.ok(mainCss.includes(`.${token}`), `dist/css/boodoo.css must define .${token}`);
    assert.ok(lessCss.includes(`.${token}`), `dist/css/boodoo.less.css must define .${token}`);
  });

  // .alert-icon
  assert.ok(mainCss.includes('.alert-icon'), 'dist/css/boodoo.css must define .alert-icon');
  assert.ok(lessCss.includes('.alert-icon'), 'dist/css/boodoo.less.css must define .alert-icon');

  // 2. Verify compiled Haticons documentation page
  const iconsCompiled = resolve(rootDir, 'site/docs/content/icons.html');
  assert.ok(existsSync(iconsCompiled), 'Compiled site/docs/content/icons.html must exist');
  const compiledIconsHtml = readFileSync(iconsCompiled, 'utf8');
  assert.ok(compiledIconsHtml.includes('Haticons'), 'Icons page must reference Haticons');
  assert.ok(compiledIconsHtml.includes('https://haticons.com/'), 'Icons page must link to haticons.com');
  assert.ok(compiledIconsHtml.includes('hi-haticons'), 'Icons page must showcase hi-haticons');
  assert.ok(compiledIconsHtml.includes('569+'), 'Icons page must state official 569+ icon count');

  // 3. Verify docs-nav.json includes content/icons
  const nav = JSON.parse(readFileSync(resolve(rootDir, 'site/data/docs-nav.json'), 'utf8'));
  const contentSection = nav.find(s => s.title === 'Content');
  assert.ok(contentSection, 'docs-nav.json must have Content section');
  assert.ok(contentSection.pages.some(p => p.route === 'content/icons'), 'docs-nav.json must include content/icons');

  // 4. Verify landing page promotion
  const indexHtml = readFileSync(resolve(rootDir, 'site/index.html'), 'utf8');
  assert.ok(indexHtml.includes('https://cdn.jsdelivr.net/npm/haticons'), 'site/index.html must load Haticons CDN');
  assert.ok(indexHtml.includes('id="icons"'), 'site/index.html must include #icons showcase section');
  assert.ok(indexHtml.includes('https://haticons.com/'), 'site/index.html must link to haticons.com');
  assert.ok(indexHtml.includes('hi-bolt'), 'site/index.html must use Haticons icon classes');
  assert.ok(indexHtml.includes('569+'), 'site/index.html must state official 569+ icon count');

  // 5. Verify layout.html integration
  const layoutHtml = readFileSync(resolve(rootDir, 'site/layout.html'), 'utf8');
  assert.ok(layoutHtml.includes('https://cdn.jsdelivr.net/npm/haticons'), 'site/layout.html must load Haticons CDN');
  assert.ok(layoutHtml.includes('https://haticons.com'), 'site/layout.html footer must link to haticons.com');

  // 6. Verify README.md documentation
  const readme = readFileSync(resolve(rootDir, 'README.md'), 'utf8');
  assert.ok(readme.includes('Haticons'), 'README.md must document Haticons support');
  assert.ok(readme.includes('https://haticons.com/'), 'README.md must link to haticons.com');
  assert.ok(readme.includes('569+'), 'README.md must state official 569+ icon count');
});

