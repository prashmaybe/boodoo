# Boodoo Framework - Project Rules & Publishing Workflow

## Automatic Version Bumping & Publishing Rule
Whenever modifications, feature updates, or bug fixes are made to the core framework (`scss/`, `less/`, `js/`):

1. **Version Bump**: Bump the patch version in `package.json` (e.g. `1.0.1` → `1.0.2`). Note: Do NOT bump package.json version if changes are made solely to the website/documentation (`site/`).
2. **Framework Build**: Execute `npm run build` to re-compile all Sass, Less, and JavaScript distribution assets into `dist/`.
3. **Web Distribution & Sitemap**: Execute `npm run www` to rebuild static HTML pages, update `sitemap.xml`, and assemble the ready-to-deploy static website in `www/`.
4. **Package Publishing**: Automatically publish the updated package to npm with `npm publish` so CDN and package manager consumers immediately receive the latest release.

## Dynamic Dist Asset Size Tracking Rule
Whenever compiled framework dist files (`dist/css/*`, `dist/js/*`) or source files (`scss/`, `less/`, `js/`) are updated:

1. **Dynamic Size Injection**: Documentation fragments (`site/src/**/*.html`) and the landing page (`site/index.html`) must use dynamic template variables (e.g. `{{cssMinKb}}`, `{{cssRawKb}}`, `{{jsRawKb}}`, `{{jsMinKb}}`, `{{gridMinKb}}`, `{{rebootMinKb}}`, `{{utilsMinKb}}`, `{{animMinKb}}`) rather than hardcoded size numbers.
2. **Build Scripts**: `build/site-build.mjs` and `build/www-build.mjs` calculate real-time compiled file sizes from `dist/` via `getDistSizes()` and inject them across all generated HTML pages during `npm run www` / `npm run site`.
3. **README Accuracy**: Always ensure the performance tables and size highlights in `README.md` are updated to match the latest build measurements.

