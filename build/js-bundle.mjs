// BOODOO JS bundle builder (powered by esbuild)
// Generates ESM, CommonJS, browser UMD, and minified bundles with real source maps.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const entry = path.join(root, 'js', 'boodoo.js');
const outDir = path.join(root, 'dist', 'js');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const banner = `/*!
 * boodoo v${pkg.version} | (c) Pebble Benders | MIT License
 * A modular, mobile-first CSS design framework
 */`;

const umdBanner = `${banner}
(function (global, factory) {
  "use strict";
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define([], factory);
  } else {
    global = typeof globalThis !== "undefined" ? globalThis : global || self;
    global.boodoo = factory();
  }
})(this, (function () {
  "use strict";
`;

const umdFooter = `
  return typeof __boodoo_lib !== "undefined" ? __boodoo_lib : {};
}));
`;

fs.mkdirSync(outDir, { recursive: true });

async function build() {
  // 1. ESM bundle (format: 'esm')
  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    outfile: path.join(outDir, 'boodoo.esm.js'),
    banner: { js: banner },
    sourcemap: true,
  });
  const esmSize = fs.statSync(path.join(outDir, 'boodoo.esm.js')).size;
  console.log('Bundled boodoo.esm.js (' + esmSize + ' bytes)');

  // 2. Browser UMD bundle (format: 'iife')
  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: 'iife',
    globalName: '__boodoo_lib',
    outfile: path.join(outDir, 'boodoo.js'),
    banner: { js: umdBanner },
    footer: { js: umdFooter },
    sourcemap: true,
  });
  const jsSize = fs.statSync(path.join(outDir, 'boodoo.js')).size;
  console.log('Bundled boodoo.js (' + jsSize + ' bytes)');

  // 3. CommonJS bundle (format: 'cjs')
  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: 'cjs',
    outfile: path.join(outDir, 'boodoo.cjs'),
    banner: { js: banner },
    sourcemap: true,
  });
  const cjsSize = fs.statSync(path.join(outDir, 'boodoo.cjs')).size;
  console.log('Bundled boodoo.cjs (' + cjsSize + ' bytes)');

  // 4. Minified browser bundle (format: 'iife', minified with real source map)
  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: 'iife',
    globalName: '__boodoo_lib',
    outfile: path.join(outDir, 'boodoo.min.js'),
    banner: { js: umdBanner },
    footer: { js: umdFooter },
    minify: true,
    sourcemap: true,
  });
  const minSize = fs.statSync(path.join(outDir, 'boodoo.min.js')).size;
  console.log('Bundled boodoo.min.js (' + minSize + ' bytes)');

  // 5. Emit TypeScript definitions
  const dtsSrc = path.join(root, 'js', 'boodoo.d.ts');
  if (fs.existsSync(dtsSrc)) {
    fs.copyFileSync(dtsSrc, path.join(outDir, 'boodoo.d.ts'));
    console.log('Emitted dist/js/boodoo.d.ts');
  }
}

build().catch((err) => {
  console.error('JS Build Error:', err);
  process.exit(1);
});
