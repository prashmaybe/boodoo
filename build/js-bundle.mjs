// BUDU JS bundle builder (no external deps)
// Concatenates ESM modules in js/src into a single UMD-ish bundle.
// Handles named imports/exports and re-exports (no bundler installed).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'js', 'src');
const entry = path.join(root, 'js', 'budu.js');
const outDir = path.join(root, 'dist', 'js');

// resolve a module specifier to absolute file
function resolveModule(specifier, importerDir) {
  const candidates = [];
  candidates.push(path.resolve(importerDir, specifier));
  // fallback: base file in js/src (entry imports like './alert.js' point at src)
  if (!specifier.startsWith('.')) {
    candidates.push(path.join(srcDir, specifier));
  } else {
    // try src/<base> for entry-level imports
    const base = path.basename(specifier);
    if (!path.extname(base)) {
      candidates.push(path.join(srcDir, base + '.js'));
    }
  }
  for (const p of candidates) {
    let full = p;
    if (!fs.existsSync(full) && !path.extname(full)) full = full + '.js';
    if (fs.existsSync(full)) return path.normalize(full);
  }
  throw new Error(`Cannot resolve module '${specifier}' from ${importerDir}`);
}

// Simple static analysis for imports/exports in a module
function analyzeModule(file) {
  const code = fs.readFileSync(file, 'utf8');
  const body = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

  const imports = [];
  // import { a, b as c } from 'x';  /  import 'x';  /  import x from 'x';
  const importRe = /import\s+(?:(?:([A-Za-z_$][\w$]*)\s*,?\s*)?(?:\{([^}]*)\})?|([A-Za-z_$][\w$]*))?\s*from\s*['"]([^'"]+)['"];?/g;
  let m;
  while ((m = importRe.exec(body)) !== null) {
    imports.push({
      specifier: m[4],
      defaultName: m[1] || m[3] || null,
      named: m[2] ? m[2].split(',').map((s) => s.trim()).filter(Boolean).map((pair) => {
        const parts = pair.split(/\s+as\s+/).map((s) => s.trim());
        return { local: parts[0], imported: parts[1] || parts[0] };
      }) : [],
    });
  }

  // export function/class/const NAME / export default NAME
  const exportsLocal = [];
  const exportDeclRe = /export\s+(?:default\s+)?(?:function\s+|class\s+|const\s+|let\s+|var\s+)([A-Za-z_$][\w$]*)/g;
  while ((m = exportDeclRe.exec(body)) !== null) exportsLocal.push(m[1]);

  const exportListRe = /export\s*\{([^}]+)\};?/g;
  while ((m = exportListRe.exec(body)) !== null) {
    m[1].split(',').map((s) => s.trim()).filter(Boolean).forEach((pair) => {
      const parts = pair.split(/\s+as\s+/).map((s) => s.trim());
      exportsLocal.push(parts[0]);
    });
  }

  const hasDefaultExport = /\bexport\s+default\b/.test(body);
  const statements = [];
  // Strip import statements (may span lines) and export keywords so the
  // module bodies can be concatenated safely.
  const stripped = code
    .replace(/import[\s\S]*?from\s*['"][^'"]+['"];?/g, '')
    .replace(/\bimport\s*['"][^'"]+['"];?/g, '')
    .replace(/^export\s+default\s+/gm, '')
    .replace(/^export\s+(?=(?:(?:function|class|const|let|var|async)\s+))/gm, '')
    .replace(/export\s*\{[^}]*\};?/g, '');
  statements.push(stripped);

  return { imports, exportsLocal, hasDefaultExport, statements };
}

// Build list of modules in dependency-safe order via DFS with cycle guard
const moduleCache = new Map();
const bundledBodies = [];
const seen = new Set();

function collect(file, fromDir) {
  file = resolveModule(file, fromDir);
  file = path.normalize(file);
  if (seen.has(file)) return;
  seen.add(file);

  const { imports, statements } = analyzeModule(file);
  // order: dependencies first
  imports.forEach((imp) => {
    if (imp.specifier.startsWith('.')) {
      // The entry (js/budu.js) lists imports as if they were src siblings.
      // Resolve from srcDir for bare relative basenames to keep it simple.
      const fromDir = path.basename(file) === path.basename(entry) ? srcDir : path.dirname(file);
      collect(imp.specifier, fromDir);
    }
  });
  bundledBodies.push(statements[0]);
}

// entries
collect(entry, path.dirname(entry));

const banner = `/*!
* Budu ${'1.0.0'} | (c) Dilshad I Hadiwala | MIT License
* A modular, mobile-first CSS design framework
*/`;
const footer = `window.Budu = window.Budu || Budu;`;

const bundle = `${banner}
(function (global, factory) {
  "use strict";
  if (typeof module === "object" && typeof module.exports !== "undefined") {
    module.exports = factory();
  } else {
    global = typeof globalThis !== "undefined" ? globalThis : global || self;
    const api = factory();
    global.Budu = api;
  }
})(this, (function () {
  "use strict";
${bundledBodies.join('\n\n')}
  return (typeof Budu !== "undefined" ? Budu : (globalThis && globalThis.Budu) || {});
}));
`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'budu.js'), bundle);
fs.writeFileSync(path.join(outDir, 'budu.min.js'), bundle); // placeholder; real minification via esbuild/terser optional
console.log('Bundled budu.js (' + Buffer.byteLength(bundle) + ' bytes)');

// ESM build (keeps exports)
const esmBody = bundledBodies.join('\n\n');
const esmBundle = `${banner}
${esmBody}
export default Budu;
export { Alert, Button, Collapse, Dropdown, Modal, Offcanvas, Tab, Toast, Tooltip, Popover, Carousel, ScrollSpy, initRipple, initDataApi };
`;
fs.writeFileSync(path.join(outDir, 'budu.esm.js'), esmBundle);
console.log('Bundled budu.esm.js (' + Buffer.byteLength(esmBundle) + ' bytes)');