#!/usr/bin/env node

/**
 * Boodoo MCP (Model Context Protocol) Server
 * Exposes authoritative Boodoo framework components, documentation, utilities,
 * tokens, and runnable examples to compatible AI clients.
 *
 * Runs via standard stdio JSON-RPC protocol without external runtime dependencies.
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// Load component catalogue
const catalogFile = path.join(root, 'docs', 'ai', 'component-index.json');
let componentCatalog = [];
if (fs.existsSync(catalogFile)) {
  try {
    const data = JSON.parse(fs.readFileSync(catalogFile, 'utf8'));
    componentCatalog = data.components || [];
  } catch (err) {
    componentCatalog = [];
  }
}

// Load design tokens
const tokensFile = path.join(root, 'tokens', 'tokens.json');
let designTokens = {};
if (fs.existsSync(tokensFile)) {
  try {
    designTokens = JSON.parse(fs.readFileSync(tokensFile, 'utf8'));
  } catch (err) {
    designTokens = {};
  }
}

const TOOLS = [
  {
    name: 'search_components',
    description:
      'Find Boodoo components by name, keyword, or category (e.g. "modal", "toast", "overlay", "form").',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search keyword or component name',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_component_docs',
    description:
      'Retrieve detailed documentation, CSS classes, and accessibility features for a specific Boodoo component.',
    inputSchema: {
      type: 'object',
      properties: {
        componentName: {
          type: 'string',
          description: 'Exact or partial name of the component (e.g. "Modal", "Toast")',
        },
      },
      required: ['componentName'],
    },
  },
  {
    name: 'get_component_example',
    description:
      'Return runnable, authoritative implementation code for a Boodoo component across Vanilla JS, React, Vue, or React Native.',
    inputSchema: {
      type: 'object',
      properties: {
        component: {
          type: 'string',
          description: 'Name of the component (e.g. "modal", "dropdown", "button")',
        },
        framework: {
          type: 'string',
          description: 'Framework target: "vanilla-js", "react", "vue", or "react-native"',
          enum: ['vanilla-js', 'react', 'vue', 'react-native'],
        },
      },
      required: ['component'],
    },
  },
  {
    name: 'search_utilities',
    description:
      'Find responsive utility classes for spacing, flexbox, layout, elevation, and display in Boodoo.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Category to search: "spacing", "flex", "elevation", "grid", "display"',
        },
      },
      required: ['category'],
    },
  },
  {
    name: 'get_design_tokens',
    description: 'Retrieve universal design tokens (colors, spacing scale, border radii, shadows).',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Token category: "colors", "spacing", "radii", "shadows", or "all"',
        },
      },
    },
  },
  {
    name: 'get_design_token',
    description:
      'Retrieve a specific design token value by name or token path (e.g. "colors.primary", "primary", "spacing.1", "radii.md").',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Token name or category.key (e.g. "primary", "colors.primary", "spacing.1", "1")',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'validate_component_usage',
    description:
      'Validate a code snippet against Boodoo architectural guidelines (checks form control id/name, raw text node containment, CSS token usage, and React Native style purity).',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'HTML, JSX, or Vue code snippet to validate',
        },
        framework: {
          type: 'string',
          description: 'Framework: "html", "react", "vue", or "react-native"',
          enum: ['html', 'react', 'vue', 'react-native'],
        },
      },
      required: ['code'],
    },
  },
  {
    name: 'get_installation_guide',
    description:
      'Return framework-specific installation and setup instructions for Boodoo (npm, CDN, React, Vue, React Native, Vite).',
    inputSchema: {
      type: 'object',
      properties: {
        target: {
          type: 'string',
          description: 'Installation target: "npm", "cdn", "react", "vue", "react-native"',
        },
      },
      required: ['target'],
    },
  },
];

function handleToolCall(name, args = {}) {
  switch (name) {
    case 'search_components': {
      const q = (args.query || '').toLowerCase();
      const matches = componentCatalog.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          (c.features && c.features.some((f) => f.toLowerCase().includes(q)))
      );
      return {
        results: matches.map((m) => ({
          name: m.name,
          category: m.category,
          frameworks: m.frameworks,
          documentation: m.documentation,
        })),
      };
    }

    case 'get_component_docs': {
      const nameQuery = (args.componentName || '').toLowerCase();
      const comp = componentCatalog.find(
        (c) => c.name.toLowerCase() === nameQuery || c.name.toLowerCase().includes(nameQuery)
      );
      if (!comp) {
        return { error: `Component "${args.componentName}" not found in catalogue.` };
      }
      return comp;
    }

    case 'get_component_example': {
      const compName = (args.component || '').toLowerCase().trim();
      const fw = (args.framework || 'vanilla-js').toLowerCase().trim();

      // Allowed framework directories
      const allowedFw = ['vanilla-js', 'react', 'vue', 'react-native'];
      if (!allowedFw.includes(fw)) {
        return { error: `Invalid framework "${args.framework}". Allowed: ${allowedFw.join(', ')}` };
      }

      // Prevent path traversal
      const sanitizedComp = path.basename(compName);
      if (!sanitizedComp || sanitizedComp !== compName || compName.includes('..') || compName.includes('/') || compName.includes('\\')) {
        return { error: 'Invalid component name.' };
      }

      const examplesBase = path.resolve(root, 'examples');
      const exampleDir = path.resolve(examplesBase, fw, sanitizedComp);

      // Verify resolved path stays strictly within examplesBase
      if (!exampleDir.startsWith(examplesBase + path.sep)) {
        return { error: 'Invalid component path.' };
      }

      if (fs.existsSync(exampleDir) && fs.statSync(exampleDir).isDirectory()) {
        const files = {};
        for (const file of fs.readdirSync(exampleDir)) {
          const filePath = path.join(exampleDir, file);
          if (fs.statSync(filePath).isFile()) {
            files[file] = fs.readFileSync(filePath, 'utf8');
          }
        }
        return { framework: fw, component: sanitizedComp, files };
      }

      return {
        message: `Direct runnable example not found for ${fw}/${sanitizedComp}. See docs at https://boodooframework.com/docs/components/${sanitizedComp}.html`,
      };
    }

    case 'search_utilities': {
      const cat = (args.category || '').toLowerCase();
      const utilities = {
        spacing: {
          scale: '0: 0, 0.5: 8px, 1: 20px, 2: 36px, 3: 52px, 4: 68px, 5: 84px',
          classes: ['.m-0 to .m-5', '.p-0 to .p-5', '.mx-*', '.my-*', '.gap-1 to .gap-5'],
        },
        flex: {
          classes: [
            '.d-flex',
            '.d-inline-flex',
            '.flex-column',
            '.align-items-center',
            '.justify-content-between',
            '.flex-wrap',
          ],
        },
        elevation: {
          classes: ['.elevation-1 to .elevation-5 (layered Material Design depth shadows)'],
        },
        grid: {
          classes: [
            '.container',
            '.container-fluid',
            '.row',
            '.col',
            '.col-1 to .col-12',
            '.col-md-*',
            '.col-lg-*',
          ],
        },
        display: {
          classes: ['.d-none', '.d-block', '.d-inline', '.d-grid', '.visually-hidden'],
        },
      };
      return utilities[cat] || { availableCategories: Object.keys(utilities) };
    }

    case 'get_design_tokens': {
      const cat = args.category || 'all';
      if (cat === 'all' || !designTokens[cat]) {
        return designTokens;
      }
      return { [cat]: designTokens[cat] };
    }

    case 'get_design_token': {
      const query = (args.name || '').trim();
      if (!query) {
        return { error: 'Token name is required.' };
      }

      // Check category.key format (e.g. "colors.primary", "spacing.1")
      if (query.includes('.')) {
        const [cat, key] = query.split('.');
        if (designTokens[cat] && designTokens[cat][key] !== undefined) {
          return { category: cat, token: key, value: designTokens[cat][key] };
        }
      }

      // Search across all token categories
      for (const [cat, tokens] of Object.entries(designTokens)) {
        if (tokens && typeof tokens === 'object' && tokens[query] !== undefined) {
          return { category: cat, token: query, value: tokens[query] };
        }
      }

      return {
        error: `Token "${query}" not found in design tokens. Available categories: ${Object.keys(designTokens).join(', ')}`,
      };
    }

    case 'validate_component_usage': {
      const code = args.code || '';
      const fw = (args.framework || 'html').toLowerCase();
      const issues = [];
      const suggestions = [];

      // Check for form inputs missing id or name
      const inputTagRegex = /<(?:input|select|textarea)\b([^>]*)>/gi;
      let match;
      while ((match = inputTagRegex.exec(code)) !== null) {
        const attrs = match[1];
        const hasId = /\bid\s*=\s*["'][^"']+["']/i.test(attrs);
        const hasName = /\bname\s*=\s*["'][^"']+["']/i.test(attrs);
        if (!hasId && !hasName) {
          issues.push({
            rule: 'Form Field Element Identification',
            element: match[0],
            message: 'Form controls must include an id or name attribute for accessibility and browser autofill.',
          });
        }
      }

      // Check for raw text inside div / section layout blocks (HTML/JSX)
      if (fw === 'html' || fw === 'react' || fw === 'vue') {
        const rawDivText = /<(?:div|section|article|nav|header|footer)[^>]*>([a-zA-Z0-9\s]{3,})</g;
        let divMatch;
        while ((divMatch = rawDivText.exec(code)) !== null) {
          const inner = divMatch[1].trim();
          if (inner && !inner.startsWith('<')) {
            issues.push({
              rule: 'Text Wrapping Rule',
              sample: divMatch[0],
              message: 'Raw text nodes must be wrapped in semantic elements (<p>, <span>, <strong>, <label>), never placed naked inside layout containers.',
            });
            break;
          }
        }
      }

      // Check for inline style literals in React Native
      if (fw === 'react-native') {
        if (/style\s*=\s*\{\s*\{/g.test(code)) {
          issues.push({
            rule: 'React Native StyleSheet-Only Rule',
            message: 'Avoid inline style object literals (style={{...}}) in React Native; declare styling via StyleSheet.create().',
          });
        }
      }

      // Check for hardcoded hex colors when custom properties should be used
      if (/#(?:[0-9a-fA-F]{3}){1,2}\b/.test(code) && (fw === 'html' || fw === 'react' || fw === 'vue')) {
        suggestions.push({
          rule: 'Dynamic CSS Custom Property Theming',
          message: 'Found hardcoded hex color literals. Prefer dynamic theme tokens such as var(--boodoo-primary).',
        });
      }

      return {
        valid: issues.length === 0,
        issuesCount: issues.length,
        issues,
        suggestions,
      };
    }

    case 'get_installation_guide': {
      const target = (args.target || 'npm').toLowerCase();
      const guides = {
        npm: 'npm install boodoo\nimport "boodoo/css";\nimport boodoo, { Modal, Toast } from "boodoo";\nboodoo.init();',
        cdn: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boodoo@1.3.2/dist/css/boodoo.min.css">\n<script src="https://cdn.jsdelivr.net/npm/boodoo@1.3.2/dist/js/boodoo.min.js" defer></script>',
        react:
          'npm install boodoo\nimport "boodoo/css";\nimport { useDisclosure, useCombobox } from "boodoo/react";',
        vue: 'npm install boodoo\nimport "boodoo/css";\nimport { useDisclosure, useCombobox } from "boodoo/vue";',
        'react-native':
          'npm install boodoo\nimport { Button, Card, BoodooProvider } from "boodoo/react-native";',
      };
      return { target, instructions: guides[target] || guides.npm };
    }

    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// JSON-RPC stdio server loop
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const request = JSON.parse(line);
    const { id, method, params } = request;

    if (method === 'initialize') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: 'boodoo-mcp-server',
            version: '1.3.2',
          },
        },
      };
      process.stdout.write(JSON.stringify(response) + '\n');
      return;
    }

    if (method === 'tools/list') {
      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          tools: TOOLS,
        },
      };
      process.stdout.write(JSON.stringify(response) + '\n');
      return;
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      const output = handleToolCall(toolName, toolArgs);

      const response = {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(output, null, 2),
            },
          ],
        },
      };
      process.stdout.write(JSON.stringify(response) + '\n');
      return;
    }

    // Default response for unhandled notifications or unknown methods
    if (id !== undefined) {
      process.stdout.write(
        JSON.stringify({
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` },
        }) + '\n'
      );
    }
  } catch (err) {
    process.stderr.write(`Error processing line: ${err.message}\n`);
  }
});
