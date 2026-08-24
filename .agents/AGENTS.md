# Boodoo Framework - Project Rules & Publishing Workflow

## Automatic Version Bumping & Publishing Rule
Whenever modifications, feature updates, or bug fixes are made to the core framework (`scss/`, `less/`, `js/`):

1. **Version Bump**: Bump the patch version in `package.json` (e.g. `1.0.1` → `1.0.2`). Note: Do NOT bump package.json version if changes are made solely to the website/documentation (`site/`).
2. **Framework Build**: Execute `npm run build` to re-compile all Sass, Less, and JavaScript distribution assets into `dist/`.
3. **Web Distribution & Sitemap**: Execute `npm run www` to rebuild static HTML pages, update `sitemap.xml`, and assemble the ready-to-deploy static website in `www/`.
4. **Package Publishing**: Automatically publish the updated package to npm with `npm publish` so CDN and package manager consumers immediately receive the latest release.
