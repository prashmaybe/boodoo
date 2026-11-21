#!/usr/bin/env node
// =====================================================================
// BOODOO TOOLS — Figma Tokens Exporter & Synchronization Tool
// Transforms Boodoo universal design tokens (tokens.json) into Figma Tokens
// / Tokens Studio compliant JSON format for direct import into Figma.
// =====================================================================

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');

export function exportFigmaTokens() {
  const tokensPath = resolve(root, 'tokens/tokens.json');
  const tokens = JSON.parse(readFileSync(tokensPath, 'utf8'));

  const figmaTokens = {
    color: {},
    spacing: {},
    borderRadius: {},
    boxShadow: {},
    fontFamilies: {
      sans: {
        value: tokens.typography?.fontFamilySans || 'system-ui, -apple-system, sans-serif',
        type: 'fontFamilies',
      },
      monospace: {
        value: tokens.typography?.fontFamilyMonospace || 'ui-monospace, SFMono-Regular, Menlo, monospace',
        type: 'fontFamilies',
      },
    },
    version: '1.3.3',
  };

  // Convert Colors
  if (tokens.colors) {
    for (const [key, val] of Object.entries(tokens.colors)) {
      figmaTokens.color[key] = {
        value: val,
        type: 'color',
        description: `Boodoo design token: ${key}`,
      };
    }
  }

  // Convert Spacing
  if (tokens.spacing) {
    for (const [key, val] of Object.entries(tokens.spacing)) {
      figmaTokens.spacing[key] = {
        value: `${val}px`,
        type: 'spacing',
        description: `Boodoo spacing scale step ${key} (${val}px)`,
      };
    }
  }

  // Convert Radii
  if (tokens.radii) {
    for (const [key, val] of Object.entries(tokens.radii)) {
      figmaTokens.borderRadius[key] = {
        value: typeof val === 'number' ? `${val}px` : String(val),
        type: 'borderRadius',
        description: `Boodoo border radius token: ${key}`,
      };
    }
  }

  // Convert Shadows
  if (tokens.shadows) {
    for (const [key, val] of Object.entries(tokens.shadows)) {
      figmaTokens.boxShadow[key] = {
        value: val,
        type: 'boxShadow',
        description: `Boodoo elevation shadow token: ${key}`,
      };
    }
  }

  const outPath = resolve(root, 'tokens/figma-tokens.json');
  writeFileSync(outPath, JSON.stringify(figmaTokens, null, 2), 'utf8');
  return figmaTokens;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  exportFigmaTokens();
  console.log('✅ Generated tokens/figma-tokens.json successfully');
}
