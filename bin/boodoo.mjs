#!/usr/bin/env node

/**
 * boodoo CLI
 * - npx boodoo (or npx boodoo create): Scaffold a new project
 * - npx boodoo add <component>: Copy component source code directly into your project
 * - npx boodoo migrate --from=bootstrap|tailwind: Codemod CSS classes to boodoo
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const command = args[0] || 'help';

const COMPONENT_MAP = {
  modal: {
    scss: 'scss/components/_modal.scss',
    js: 'js/src/modal.js',
    react: 'useDisclosure',
  },
  dialog: {
    scss: 'scss/components/_modal.scss',
    js: 'js/src/modal.js',
    react: 'useDisclosure',
  },
  toast: {
    scss: 'scss/components/_toasts.scss',
    js: 'js/src/toast.js',
  },
  collapse: {
    scss: 'scss/components/_collapse.scss',
    js: 'js/src/collapse.js',
    react: 'useDisclosure',
  },
  accordion: {
    scss: 'scss/components/_accordion.scss',
    js: 'js/src/accordion.js',
    react: 'useAccordion',
  },
  combobox: {
    scss: 'scss/components/_combobox.scss',
    js: 'js/src/combobox.js',
    react: 'useCombobox',
  },
  'command-palette': {
    scss: 'scss/components/_command-palette.scss',
    js: 'js/src/command-palette.js',
  },
  dropdown: {
    scss: 'scss/components/_dropdown.scss',
    js: 'js/src/dropdown.js',
  },
  offcanvas: {
    scss: 'scss/components/_offcanvas.scss',
    js: 'js/src/offcanvas.js',
  },
  'bottom-sheet': {
    scss: 'scss/components/_bottom-sheet.scss',
    js: 'js/src/bottom-sheet.js',
  },
  dropzone: {
    scss: 'scss/forms/_dropzone.scss',
    js: 'js/src/dropzone.js',
  },
  stepper: {
    scss: 'scss/components/_stepper.scss',
    js: 'js/src/stepper.js',
  },
  'speed-dial': {
    scss: 'scss/components/_speed-dial.scss',
    js: 'js/src/speed-dial.js',
  },
  splitter: {
    scss: 'scss/components/_splitter.scss',
    js: 'js/src/splitter.js',
  },
  'data-table': {
    scss: 'scss/components/_data-table.scss',
    js: 'js/src/data-table.js',
  },
  sidebar: {
    scss: 'scss/components/_sidebar.scss',
    js: 'js/src/sidebar.js',
  },
  'chip-input': {
    scss: 'scss/components/_chip.scss',
    js: 'js/src/chip-input.js',
  },
  rating: {
    scss: 'scss/components/_rating.scss',
    js: 'js/src/rating.js',
  },
  'tree-view': {
    scss: 'scss/components/_tree-view.scss',
    js: 'js/src/tree-view.js',
  },
  carousel: {
    scss: 'scss/components/_carousel.scss',
    js: 'js/src/carousel.js',
  },
  lightbox: {
    scss: 'scss/components/_lightbox.scss',
    js: 'js/src/lightbox.js',
  },
  ripple: {
    scss: 'scss/components/_ripple.scss',
    js: 'js/src/ripple.js',
  },
  banner: {
    scss: 'scss/components/_banner.scss',
    js: 'js/src/banner.js',
  },
  alert: {
    scss: 'scss/components/_alerts.scss',
    js: 'js/src/alert.js',
  },
  button: {
    scss: 'scss/components/_buttons.scss',
    js: 'js/src/button.js',
  },
  card: {
    scss: 'scss/components/_card.scss',
  },
  badge: {
    scss: 'scss/components/_badge.scss',
  },
  avatar: {
    scss: 'scss/components/_avatar.scss',
  },
  progress: {
    scss: 'scss/components/_progress.scss',
  },
  skeleton: {
    scss: 'scss/components/_skeleton.scss',
  },
  tooltip: {
    scss: 'scss/components/_tooltip.scss',
    js: 'js/src/tooltip.js',
  },
  popover: {
    scss: 'scss/components/_popover.scss',
    js: 'js/src/tooltip.js',
  },
  'stat-widget': {
    scss: 'scss/components/_extended-components.scss',
  },
  'activity-feed': {
    scss: 'scss/components/_extended-components.scss',
  },
  'mega-menu': {
    scss: 'scss/components/_extended-components.scss',
  },
  'fab-dock': {
    scss: 'scss/components/_extended-components.scss',
    js: 'js/src/fab-dock.js',
  },
  'dialog-fullscreen': {
    scss: 'scss/components/_extended-components.scss',
    js: 'js/src/dialog-fullscreen.js',
  },
  tour: {
    scss: 'scss/components/_extended-components.scss',
    js: 'js/src/tour.js',
  },
  'chat-thread': {
    scss: 'scss/components/_advanced-components.scss',
  },
  'filter-bar': {
    scss: 'scss/components/_advanced-components.scss',
    js: 'js/src/advanced-components.js',
  },
  'kanban-board': {
    scss: 'scss/components/_advanced-components.scss',
  },
  'bento-grid': {
    scss: 'scss/components/_advanced-components.scss',
  },
  'transfer-list': {
    scss: 'scss/components/_advanced-components.scss',
    js: 'js/src/advanced-components.js',
  },
  'audio-player': {
    scss: 'scss/components/_advanced-components.scss',
  },
  'color-picker': {
    scss: 'scss/components/_advanced-components.scss',
    js: 'js/src/advanced-components.js',
  },
  'back-to-top': {
    scss: 'scss/components/_advanced-components.scss',
    js: 'js/src/advanced-components.js',
  },
  chart: {
    scss: 'scss/components/_chart.scss',
    js: 'js/src/chart.js',
  },
};

const BOOTSTRAP_TO_BOODOO = [
  // Attributes
  { regex: /data-bs-toggle=/g, replace: 'data-boodoo-toggle=' },
  { regex: /data-bs-target=/g, replace: 'data-boodoo-target=' },
  { regex: /data-bs-dismiss=/g, replace: 'data-boodoo-dismiss=' },
  { regex: /data-bs-theme=/g, replace: 'data-boodoo-theme=' },
  { regex: /data-bs-slide=/g, replace: 'data-boodoo-slide=' },
  { regex: /data-bs-ride=/g, replace: 'data-boodoo-ride=' },
  { regex: /data-bs-spy=/g, replace: 'data-boodoo-spy=' },

  // Typography & Display
  { regex: /\bfs-1\b/g, replace: 'display-1' },
  { regex: /\bfs-2\b/g, replace: 'display-2' },
  { regex: /\bfs-3\b/g, replace: 'display-3' },
  { regex: /\bfs-4\b/g, replace: 'display-4' },
  { regex: /\bfs-5\b/g, replace: 'display-5' },
  { regex: /\bfs-6\b/g, replace: 'display-6' },
  { regex: /\bfw-bold\b/g, replace: 'font-weight-bold' },
  { regex: /\bfw-semibold\b/g, replace: 'font-weight-semibold' },
  { regex: /\bfw-normal\b/g, replace: 'font-weight-normal' },
  { regex: /\bfw-light\b/g, replace: 'font-weight-light' },
  { regex: /\bfst-italic\b/g, replace: 'font-italic' },

  // Colors & Backgrounds
  { regex: /\bbg-body\b/g, replace: 'bg-surface' },
  { regex: /\bbg-body-secondary\b/g, replace: 'bg-surface-secondary' },
  { regex: /\bbg-body-tertiary\b/g, replace: 'bg-surface-tertiary' },

  // Borders & Rounded
  { regex: /\brounded-circle\b/g, replace: 'rounded-pill' },

  // Floating labels & controls
  { regex: /\bform-floating\b/g, replace: 'form-floating' },
];

const TAILWIND_TO_BOODOO = [
  // Flexbox & Grid
  { regex: /\bflex flex-col\b/g, replace: 'flex-column' },
  { regex: /\bflex flex-row\b/g, replace: 'flex-row' },
  { regex: /\bitems-center\b/g, replace: 'align-items-center' },
  { regex: /\bitems-start\b/g, replace: 'align-items-start' },
  { regex: /\bitems-end\b/g, replace: 'align-items-end' },
  { regex: /\bjustify-between\b/g, replace: 'justify-content-between' },
  { regex: /\bjustify-center\b/g, replace: 'justify-content-center' },
  { regex: /\bjustify-end\b/g, replace: 'justify-content-end' },
  { regex: /\bjustify-start\b/g, replace: 'justify-content-start' },
  { regex: /\bgrid grid-cols-1 md:grid-cols-2 lg:grid-cols-3\b/g, replace: 'row row-cols-1 row-cols-md-2 row-cols-lg-3' },
  { regex: /\bgrid grid-cols-1 md:grid-cols-3\b/g, replace: 'row row-cols-1 row-cols-md-3' },
  { regex: /\bgrid grid-cols-2\b/g, replace: 'row row-cols-2' },
  { regex: /\bgrid grid-cols-3\b/g, replace: 'row row-cols-3' },
  { regex: /\bgrid grid-cols-4\b/g, replace: 'row row-cols-4' },

  // Spacing & Layout
  { regex: /\bw-full\b/g, replace: 'w-100' },
  { regex: /\bh-full\b/g, replace: 'h-100' },
  { regex: /\bmax-w-7xl mx-auto\b/g, replace: 'container' },
  { regex: /\bmax-w-5xl mx-auto\b/g, replace: 'container' },
  { regex: /\bmx-auto\b/g, replace: 'mx-auto' },

  // Text
  { regex: /\btext-center\b/g, replace: 'text-center' },
  { regex: /\btext-right\b/g, replace: 'text-end' },
  { regex: /\btext-left\b/g, replace: 'text-start' },
  { regex: /\bfont-bold\b/g, replace: 'font-weight-bold' },
  { regex: /\bfont-semibold\b/g, replace: 'font-weight-semibold' },
  { regex: /\btext-sm\b/g, replace: 'text-small' },
  { regex: /\btext-xs\b/g, replace: 'text-small' },
];

export function runMigration(inputContent, sourceFramework = 'bootstrap') {
  let output = inputContent;
  const mappings = sourceFramework.toLowerCase() === 'tailwind' ? TAILWIND_TO_BOODOO : BOOTSTRAP_TO_BOODOO;
  let replacementsCount = 0;

  for (const { regex, replace } of mappings) {
    const matches = output.match(regex);
    if (matches) {
      replacementsCount += matches.length;
      output = output.replace(regex, replace);
    }
  }

  return { output, replacementsCount };
}

export function listAvailableComponents() {
  return Object.keys(COMPONENT_MAP).sort();
}

export function addComponent(componentName, targetDir = process.cwd()) {
  const normName = componentName.toLowerCase();
  const entry = COMPONENT_MAP[normName];

  if (!entry) {
    throw new Error(`Component '${componentName}' not found. Available components: ${listAvailableComponents().join(', ')}`);
  }

  const outComponentsDir = path.join(targetDir, 'components', 'boodoo');
  fs.mkdirSync(outComponentsDir, { recursive: true });

  const addedFiles = [];

  // Copy SCSS if present
  if (entry.scss) {
    const srcScss = path.join(root, entry.scss);
    if (fs.existsSync(srcScss)) {
      const destScss = path.join(outComponentsDir, path.basename(entry.scss));
      fs.copyFileSync(srcScss, destScss);
      addedFiles.push(path.relative(targetDir, destScss));
    }
  }

  // Copy JS if present
  if (entry.js) {
    const srcJs = path.join(root, entry.js);
    if (fs.existsSync(srcJs)) {
      const destJs = path.join(outComponentsDir, path.basename(entry.js));
      fs.copyFileSync(srcJs, destJs);
      addedFiles.push(path.relative(targetDir, destJs));
    }
  }

  return { name: normName, files: addedFiles, reactHook: entry.react || null };
}

export async function handleAdd(cmdArgs = args) {
  const comp = cmdArgs[1];
  if (!comp) {
    console.log('\n\x1b[36m📦 Available Boodoo Components to Add:\x1b[0m\n');
    console.log(listAvailableComponents().map((c) => `  - ${c}`).join('\n'));
    console.log('\n\x1b[90mUsage: npx boodoo add <component-name>\x1b[0m\n');
    return;
  }

  try {
    const result = addComponent(comp);
    console.log(`\n\x1b[32m✔ Added '${result.name}' into components/boodoo/\x1b[0m`);
    result.files.forEach((f) => console.log(`  + ${f}`));
    if (result.reactHook) {
      console.log(`\n\x1b[35mTip: Declarative headless hook available: import { ${result.reactHook} } from 'boodoo/react'\x1b[0m`);
    }
    console.log('');
    return result;
  } catch (err) {
    console.error(`\x1b[31mError: ${err.message}\x1b[0m`);
    throw err;
  }
}

export async function handleMigrate(cmdArgs = args) {
  const fromFlag = cmdArgs.find((a) => a.startsWith('--from='));
  const source = fromFlag ? fromFlag.split('=')[1] : 'bootstrap';
  const targetPath = cmdArgs[1] && !cmdArgs[1].startsWith('--') ? cmdArgs[1] : '.';

  console.log(`\n\x1b[35m🔄 Boodoo Automated CSS Migration Codemod\x1b[0m`);
  console.log(`Migrating files from: \x1b[36m${source}\x1b[0m at \x1b[33m${targetPath}\x1b[0m\n`);

  const resolved = path.resolve(process.cwd(), targetPath);
  const filesToScan = [];

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const stat = fs.statSync(dir);
    if (stat.isFile()) {
      if (/\.(html|jsx|tsx|vue|svelte|php|erb)$/i.test(dir)) {
        filesToScan.push(dir);
      }
      return;
    }
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(html|jsx|tsx|vue|svelte|php|erb)$/i.test(entry.name)) {
        filesToScan.push(full);
      }
    }
  }

  walk(resolved);

  if (filesToScan.length === 0) {
    console.log(`No applicable HTML/JSX/Vue template files found at '${targetPath}'.`);
    return { filesScanned: 0, totalReplacements: 0, modifiedFiles: 0 };
  }

  let totalReplacements = 0;
  let modifiedFiles = 0;

  for (const file of filesToScan) {
    const raw = fs.readFileSync(file, 'utf8');
    const { output, replacementsCount } = runMigration(raw, source);
    if (replacementsCount > 0) {
      fs.writeFileSync(file, output, 'utf8');
      console.log(`  \x1b[32m✔\x1b[0m ${path.relative(process.cwd(), file)} (${replacementsCount} classes converted)`);
      totalReplacements += replacementsCount;
      modifiedFiles++;
    }
  }

  console.log(`\n\x1b[32mMigration complete:\x1b[0m Converted ${totalReplacements} classes across ${modifiedFiles} files.\n`);
  return { filesScanned: filesToScan.length, totalReplacements, modifiedFiles };
}

export function printHelp() {
  console.log(`
\x1b[35m✨ Boodoo Developer CLI\x1b[0m

\x1b[36mUsage:\x1b[0m
  npx boodoo <command> [options]

\x1b[36mCommands:\x1b[0m
  \x1b[33mcreate [project-name]\x1b[0m                  Scaffold a full starter app (Next.js, Vite, HTML5, React Native, Electron)
  \x1b[33madd <component>\x1b[0m                        Directly inject component source into your project (shadcn-style)
  \x1b[33mmigrate --from=bootstrap|tailwind [dir]\x1b[0m Codemod existing HTML/JSX templates to Boodoo classes and data attributes
  \x1b[33mlist\x1b[0m                                   List all copy-pasteable components available in Boodoo
  \x1b[33mhelp\x1b[0m                                   Show this help message

\x1b[36mExamples:\x1b[0m
  npx boodoo add modal
  npx boodoo add command-palette
  npx boodoo migrate --from=bootstrap ./src
  npx boodoo migrate --from=tailwind index.html
`);
}

export async function runCli(cmd = command, cmdArgs = args) {
  switch (cmd) {
    case 'add':
      return await handleAdd(cmdArgs);
    case 'migrate':
      return await handleMigrate(cmdArgs);
    case 'list':
      console.log('\n\x1b[36mAvailable Boodoo Components:\x1b[0m\n');
      console.log(listAvailableComponents().map((c) => `  - ${c}`).join('\n'));
      console.log('');
      return listAvailableComponents();
    case 'create':
    case 'init': {
      const createScript = path.join(root, 'bin', 'create-boodoo.mjs');
      const { spawn: defaultSpawn } = await import('node:child_process');
      const spawnFn = cmdArgs._spawnFn || defaultSpawn;
      const child = spawnFn(process.execPath, [createScript, ...cmdArgs.slice(1)], { stdio: 'inherit' });
      if (child && typeof child.on === 'function') {
        child.on('exit', (code) => {
          /* node:coverage disable */
          if (process.argv[1] === fileURLToPath(import.meta.url)) {
            process.exit(code || 0);
          }
          /* node:coverage enable */
        });
      }
      return child;
    }
    case 'help':
    case '--help':
    case '-h':
    default:
      printHelp();
      return true;
  }
}

// Only execute directly when run as CLI
/* node:coverage disable */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
/* node:coverage enable */



