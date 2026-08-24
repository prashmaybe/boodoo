# Boodoo Framework - Project Rules & Publishing Workflow

## Automatic Version Bumping & Publishing Rule
Whenever modifications, feature updates, bug fixes, or documentation enhancements are made to the codebase:

1. **Version Bump**: Always bump the patch version in `package.json` (e.g. `1.0.1` → `1.0.1`).
2. **Framework Build**: Execute `npm run build` to re-compile all Sass, Less, and JavaScript distribution assets into `dist/`.
3. **Web Distribution & Sitemap**: Execute `npm run www` to rebuild static HTML pages, update `sitemap.xml`, and assemble the ready-to-deploy static website in `www/`.
4. **Package Publishing**: Automatically publish the updated package to npm with `npm publish` so CDN and package manager consumers immediately receive the latest release.
