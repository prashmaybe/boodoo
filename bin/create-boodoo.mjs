#!/usr/bin/env node

/**
 * create-boodoo CLI
 * Instant project scaffolder with boodoo pre-configured
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const BOODOO_VERSION = '1.0.8';

function prompt(question, defaultVal = '') {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${question} ${defaultVal ? `(${defaultVal}): ` : ': '}`, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultVal);
    });
  });
}

async function main() {
  console.log(`\n\x1b[35m✨ create-boodoo v${BOODOO_VERSION}\x1b[0m — Instant Boodoo Project Scaffolder\n`);

  const projectName = await prompt('Project name', 'my-boodoo-app');
  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    console.error(`\x1b[31mError: Target directory '${projectName}' already exists and is not empty.\x1b[0m`);
    process.exit(1);
  }

  console.log('\nSelect a template:');
  console.log('  1) HTML5 + Sass Starter (Vanilla, Fast & Clean)');
  console.log('  2) Vite + Vanilla (Modern dev server & HMR)');
  console.log('  3) Next.js / React (App Router + Boodoo CSS)');
  console.log('  4) Electron Desktop App (Cross-Platform Native UI)');
  
  const choice = await prompt('Choose template [1-4]', '1');

  fs.mkdirSync(targetDir, { recursive: true });

  if (choice === '2') {
    // Vite template
    const pkg = {
      name: projectName,
      private: true,
      version: '0.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: {
        boodoo: `^${BOODOO_VERSION}`,
      },
      devDependencies: {
        vite: '^5.0.0',
      },
    };
    fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkg, null, 2));

    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div class="container py-5">
      <div class="card p-4 shadow-sm text-center">
        <h1 class="text-primary mb-3">Welcome to ${projectName}!</h1>
        <p class="text-muted">Built with boodoo design system and Vite.</p>
        <div class="d-flex justify-content-center gap-2 mt-3">
          <button type="button" class="btn btn-primary" id="btn-demo">Click Me</button>
          <a href="https://boodoo.dihadiwala.com" target="_blank" rel="noopener" class="btn btn-outline-secondary">Documentation</a>
        </div>
      </div>
    </div>
    <script type="module" src="/main.js"></script>
  </body>
</html>`;
    fs.writeFileSync(path.join(targetDir, 'index.html'), html);

    const mainJs = `import 'boodoo/dist/css/boodoo.min.css';
import boodoo from 'boodoo';

document.getElementById('btn-demo')?.addEventListener('click', () => {
  boodoo.toast('Hello from boodoo!', { title: 'Notification', variant: 'primary' });
});
`;
    fs.writeFileSync(path.join(targetDir, 'main.js'), mainJs);

  } else if (choice === '3') {
    // Next.js template config
    const pkg = {
      name: projectName,
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
      },
      dependencies: {
        boodoo: `^${BOODOO_VERSION}`,
        next: '^14.2.0',
        react: '^18.3.0',
        'react-dom': '^18.3.0',
      },
    };
    fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkg, null, 2));
    fs.mkdirSync(path.join(targetDir, 'app'), { recursive: true });

    const layout = `import 'boodoo/dist/css/boodoo.min.css';

export const metadata = {
  title: '${projectName}',
  description: 'Built with boodoo framework',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;
    fs.writeFileSync(path.join(targetDir, 'app', 'layout.jsx'), layout);

    const page = `export default function Home() {
  return (
    <main className="container py-5">
      <div className="card p-5 text-center shadow-sm">
        <h1 className="text-primary mb-3">${projectName}</h1>
        <p className="text-muted">Next.js + boodoo UI framework</p>
      </div>
    </main>
  );
}
`;
    fs.writeFileSync(path.join(targetDir, 'app', 'page.jsx'), page);

  } else if (choice === '4') {
    // Electron Desktop App template
    const pkg = {
      name: projectName,
      version: '1.0.0',
      description: 'Cross-platform Electron desktop app powered by Boodoo design framework',
      main: 'main.js',
      scripts: {
        start: 'electron .',
        dev: 'electron .',
      },
      dependencies: {
        boodoo: `^${BOODOO_VERSION}`,
      },
      devDependencies: {
        electron: '^32.0.0',
      },
    };
    fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkg, null, 2));

    const mainJs = `const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1040,
    height: 720,
    minWidth: 800,
    minHeight: 500,
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile('index.html');

  ipcMain.on('window-minimize', () => win.minimize());
  ipcMain.on('window-maximize', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  ipcMain.on('window-close', () => win.close());
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
`;
    fs.writeFileSync(path.join(targetDir, 'main.js'), mainJs);

    const preloadJs = `const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  platform: process.platform,
});
`;
    fs.writeFileSync(path.join(targetDir, 'preload.js'), preloadJs);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self';">
  <title>${projectName}</title>
  <!-- Boodoo CSS -->
  <link rel="stylesheet" href="node_modules/boodoo/dist/css/boodoo.min.css">
</head>
<body class="bg-light">

  <div class="native-window" id="app-window" data-boodoo-platform="windows">
    <!-- Draggable Custom Titlebar -->
    <header class="native-titlebar bg-white border-bottom">
      <div class="d-flex align-items-center gap-2">
        <span class="avatar avatar-xs bg-primary text-white"><span>B</span></span>
        <span class="fw-semibold fs-7">${projectName}</span>
      </div>
      <div class="native-titlebar-controls" id="titlebar-controls">
        <button type="button" class="native-titlebar-btn" id="btn-win-min" title="Minimize">—</button>
        <button type="button" class="native-titlebar-btn" id="btn-win-max" title="Maximize">▢</button>
        <button type="button" class="native-titlebar-btn native-titlebar-close" id="btn-win-close" title="Close">✕</button>
      </div>
    </header>

    <!-- Main Workspace Content -->
    <div class="native-window-content d-flex flex-grow-1">
      <!-- Boodoo Desktop Sidebar -->
      <aside class="sidebar" data-boodoo="sidebar" style="width: 240px; min-width: 240px;">
        <div class="sidebar-header">
          <span class="fw-bold">Desktop Navigation</span>
        </div>
        <ul class="sidebar-nav">
          <li class="sidebar-heading"><span>Overview</span></li>
          <li class="sidebar-item">
            <a href="#" class="sidebar-link active">
              <span class="sidebar-icon">📊</span>
              <span class="sidebar-text">Dashboard</span>
            </a>
          </li>
          <li class="sidebar-item">
            <a href="#" class="sidebar-link">
              <span class="sidebar-icon">📁</span>
              <span class="sidebar-text">Projects</span>
            </a>
          </li>
          <li class="sidebar-heading"><span>Preferences</span></li>
          <li class="sidebar-item">
            <a href="#" class="sidebar-link">
              <span class="sidebar-icon">⚙️</span>
              <span class="sidebar-text">Settings</span>
            </a>
          </li>
        </ul>
      </aside>

      <!-- Main Panel -->
      <main class="flex-grow-1 p-4 bg-light overflow-auto">
        <div class="container-fluid">
          <div class="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h1 class="h4 fw-bold mb-1">Welcome to ${projectName}</h1>
              <p class="text-muted mb-0">Cross-platform desktop application built with Electron &amp; Boodoo UI.</p>
            </div>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-sm btn-outline-secondary" data-boodoo-theme-toggle>Toggle Theme</button>
            </div>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <div class="card p-3 shadow-sm">
                <span class="text-muted fs-7">Active Engine</span>
                <h5 class="fw-bold mt-1 mb-0">Electron + Chromium</h5>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card p-3 shadow-sm">
                <span class="text-muted fs-7">UI Framework</span>
                <h5 class="fw-bold mt-1 mb-0">Boodoo v${BOODOO_VERSION}</h5>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card p-3 shadow-sm">
                <span class="text-muted fs-7">Native Tokens</span>
                <h5 class="fw-bold mt-1 mb-0">Mica &amp; Fluent Design</h5>
              </div>
            </div>
          </div>

          <div class="card p-4 shadow-sm mb-4">
            <h5 class="fw-bold mb-3">Interactive Components</h5>
            <p class="text-muted">Test Boodoo's pure vanilla JS components directly inside your Electron renderer.</p>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-primary" id="btn-toast">Trigger Toast Notification</button>
              <a href="https://boodoo.dihadiwala.com" target="_blank" rel="noopener" class="btn btn-outline-primary">Online Documentation</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

  <!-- Boodoo JS -->
  <script src="node_modules/boodoo/dist/js/boodoo.js"></script>
  <script src="renderer.js"></script>
</body>
</html>
`;
    fs.writeFileSync(path.join(targetDir, 'index.html'), html);

    const rendererJs = `// Electron Desktop Renderer
document.addEventListener('DOMContentLoaded', () => {
  // Sync detected platform attribute with OS
  if (window.electronAPI?.platform) {
    const platform = window.electronAPI.platform === 'darwin' ? 'macos' : (window.electronAPI.platform === 'win32' ? 'windows' : 'linux');
    document.getElementById('app-window')?.setAttribute('data-boodoo-platform', platform);
  }

  // Titlebar window controls
  document.getElementById('btn-win-min')?.addEventListener('click', () => {
    window.electronAPI?.minimize();
  });
  document.getElementById('btn-win-max')?.addEventListener('click', () => {
    window.electronAPI?.maximize();
  });
  document.getElementById('btn-win-close')?.addEventListener('click', () => {
    window.electronAPI?.close();
  });

  // Toast trigger demo
  document.getElementById('btn-toast')?.addEventListener('click', () => {
    window.boodoo?.toast?.success?.('Electron desktop app connected to Boodoo UI!', { title: 'Desktop Event' });
  });
});
`;
    fs.writeFileSync(path.join(targetDir, 'renderer.js'), rendererJs);

  } else {
    // Vanilla HTML + CDN / NPM Starter
    const pkg = {
      name: projectName,
      version: '1.0.0',
      scripts: {
        start: 'npx serve .',
      },
      dependencies: {
        boodoo: `^${BOODOO_VERSION}`,
      },
    };
    fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkg, null, 2));

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <!-- boodoo CSS -->
  <link rel="stylesheet" href="node_modules/boodoo/dist/css/boodoo.min.css">
</head>
<body class="bg-light">
  <div class="container py-5">
    <header class="text-center mb-5">
      <h1 class="display-4 fw-bold text-primary">${projectName}</h1>
      <p class="lead text-muted">A clean, responsive web application powered by boodoo.</p>
    </header>

    <div class="row g-4 justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm p-4">
          <h2 class="h5 mb-3">Quick Component Test</h2>
          <div class="mb-3">
            <label class="form-label" for="sample-input">Sample Input</label>
            <input type="text" class="form-control" id="sample-input" name="sample-input" placeholder="Type something...">
          </div>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-primary" id="toast-trigger">Trigger Toast</button>
            <button type="button" class="btn btn-outline-secondary" data-boodoo-theme-toggle>Toggle Theme</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- boodoo JS -->
  <script src="node_modules/boodoo/dist/js/boodoo.js"></script>
  <script>
    document.getElementById('toast-trigger')?.addEventListener('click', () => {
      window.boodoo?.toast?.('Welcome to your new boodoo application!', { title: 'Success', variant: 'success' });
    });
  </script>
</body>
</html>
`;
    fs.writeFileSync(path.join(targetDir, 'index.html'), html);
  }

  // Create README
  const readme = `# ${projectName}

Powered by **boodoo v${BOODOO_VERSION}**.

## Getting Started

\`\`\`bash
cd ${projectName}
npm install
npm run dev # or npm start
\`\`\`

## Documentation
Visit [https://boodoo.dihadiwala.com](https://boodoo.dihadiwala.com) for components, utility classes, and theming guide.
`;
  fs.writeFileSync(path.join(targetDir, 'README.md'), readme);

  console.log(`\n\x1b[32m✔ Project successfully created at ${targetDir}\x1b[0m\n`);
  console.log('Next steps:');
  console.log(`  cd ${projectName}`);
  console.log('  npm install');
  console.log(choice === '2' ? '  npm run dev' : (choice === '3' ? '  npm run dev' : (choice === '4' ? '  npm start' : '  npm start')));
  console.log('');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
