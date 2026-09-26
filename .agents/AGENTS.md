# Boodoo Framework - Project Rules & Publishing Workflow


## Dynamic Dist Asset Size Tracking Rule
Whenever compiled framework dist files (`dist/css/*`, `dist/js/*`) or source files (`scss/`, `less/`, `js/`) are updated:

1. **Dynamic Size Injection**: Documentation fragments (`site/src/**/*.html`) and the landing page (`site/index.html`) must use dynamic template variables (e.g. `{{cssMinKb}}`, `{{cssRawKb}}`, `{{jsRawKb}}`, `{{jsMinKb}}`, `{{gridMinKb}}`, `{{rebootMinKb}}`, `{{utilsMinKb}}`, `{{animMinKb}}`) rather than hardcoded size numbers.
2. **Build Scripts**: `build/site-build.mjs` and `build/www-build.mjs` calculate real-time compiled file sizes from `dist/` via `getDistSizes()` and inject them across all generated HTML pages during `npm run www` / `npm run site`.
3. **README Accuracy**: Always ensure the performance tables and size highlights in `README.md` are updated to match the latest build measurements.

## Form Field Element Identification Rule
Form field elements (`<input>`, `<select>`, `<textarea>`) must always include an `id` or `name` attribute:

1. **Accessibility & Usability**: Every form field element must have an `id` (for `<label for="...">` association and accessibility tree mapping) and/or a `name` attribute (for form submission, serialization, and browser autofill).
2. **Examples & Documentation**: All form controls, snippets, components, and documentation examples across the framework (`site/src/**/*.html`, `site/**/*.html`, docs, test files) must strictly abide by this rule.

## Text Wrapping Rule
Text nodes must never be placed directly inside layout/container block elements like `<div>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<aside>`, or `<nav>`. Instead, text must always be wrapped in dedicated inline or semantic text elements:

1. **Semantic Text Elements**: Always wrap text in appropriate elements such as `<p>`, `<span>`, `<strong>`, `<em>`, `<h1>`–`<h6>`, `<small>`, `<kbd>`, `<code>`, `<label>`, or `<a>`.
2. **Container Purity**: Block containers such as `<div>` and `<section>` are strictly structural layouts (flex, grid, rows, cols, containers) and should only contain other elements, never raw/naked text strings.
3. **Consistency Across Framework**: All templates, HTML fragments, documentation examples, and component generation scripts across the project (`site/src/**/*.html`, `site/**/*.html`, `js/src/**/*.js`) must strictly follow this rule.

