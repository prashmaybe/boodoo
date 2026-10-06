#!/usr/bin/env node

/**
 * create-boodoo CLI
 * Instant project scaffolder with boodoo pre-configured
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const BOODOO_VERSION = '1.0.9';

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
  console.log('  5) Angular Starter (Standalone Components + Boodoo)');
  console.log('  6) Cordova & PhoneGap Hybrid Mobile App');
  console.log('  7) Meteor.js Full-Stack App');
  console.log('  8) Photon Desktop UI (Classic macOS / Electron Pane layout)');
  console.log('  9) React Native Web (Cross-Platform Web & Mobile)');
  
  const choice = await prompt('Choose template [1-9]', '1');

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

  } else if (choice === '5') {
    // Angular Starter template
    const pkg = {
      name: projectName,
      version: '0.0.0',
      scripts: {
        ng: 'ng',
        start: 'ng serve',
        build: 'ng build',
        watch: 'ng build --watch --configuration development',
      },
      dependencies: {
        '@angular/animations': '^18.0.0',
        '@angular/common': '^18.0.0',
        '@angular/compiler': '^18.0.0',
        '@angular/core': '^18.0.0',
        '@angular/forms': '^18.0.0',
        '@angular/platform-browser': '^18.0.0',
        '@angular/platform-browser-dynamic': '^18.0.0',
        '@angular/router': '^18.0.0',
        boodoo: `^${BOODOO_VERSION}`,
        rxjs: '~7.8.0',
        tslib: '^2.3.0',
        'zone.js': '~0.14.3',
      },
      devDependencies: {
        '@angular-devkit/build-angular': '^18.0.0',
        '@angular/cli': '^18.0.0',
        '@angular/compiler-cli': '^18.0.0',
        typescript: '~5.4.2',
      },
    };
    fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkg, null, 2));
    fs.mkdirSync(path.join(targetDir, 'src', 'app'), { recursive: true });

    const angularJson = {
      $schema: './node_modules/@angular/cli/lib/config/schema.json',
      version: 1,
      newProjectRoot: 'projects',
      projects: {
        [projectName]: {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          prefix: 'app',
          architect: {
            build: {
              builder: '@angular-devkit/build-angular:application',
              options: {
                outputPath: 'dist',
                index: 'src/index.html',
                browser: 'src/main.ts',
                styles: [
                  'node_modules/boodoo/dist/css/boodoo.min.css',
                  'src/styles.css',
                ],
                scripts: [
                  'node_modules/boodoo/dist/js/boodoo.js',
                ],
              },
            },
            serve: {
              builder: '@angular-devkit/build-angular:dev-server',
              configurations: {
                development: {
                  buildTarget: `${projectName}:build:development`,
                },
              },
              defaultConfiguration: 'development',
            },
          },
        },
      },
    };
    fs.writeFileSync(path.join(targetDir, 'angular.json'), JSON.stringify(angularJson, null, 2));

    const tsconfig = {
      compileOnSave: false,
      compilerOptions: {
        outDir: './dist/out-tsc',
        strict: true,
        noImplicitOverride: true,
        noPropertyAccessFromIndexSignature: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        skipLibCheck: true,
        isolatedModules: true,
        esModuleInterop: true,
        experimentalDecorators: true,
        moduleResolution: 'bundler',
        importHelpers: true,
        target: 'ES2022',
        module: 'ES2022',
      },
      angularCompilerOptions: {
        enableI18nLegacyMessageIdFormat: false,
        strictInjectionParameters: true,
        strictInputAccessModifiers: true,
        strictTemplates: true,
      },
    };
    fs.writeFileSync(path.join(targetDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2));

    const indexHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${projectName}</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body class="bg-light">
  <app-root></app-root>
</body>
</html>`;
    fs.writeFileSync(path.join(targetDir, 'src', 'index.html'), indexHtml);

    const mainTs = `import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';

declare const boodoo: any;

@Component({
  selector: 'app-root',
  standalone: true,
  template: \`
    <div class="container py-5">
      <div class="card p-5 text-center shadow-sm">
        <h1 class="text-primary mb-3">{{ title }}</h1>
        <p class="text-muted">Angular Standalone Component + boodoo design framework.</p>
        <div class="d-flex justify-content-center gap-2 mt-3">
          <button type="button" class="btn btn-primary" (click)="triggerToast()">Trigger Toast</button>
          <a href="https://boodoo.dihadiwala.com" target="_blank" rel="noopener" class="btn btn-outline-secondary">Docs</a>
        </div>
      </div>
    </div>
  \`,
})
export class AppComponent {
  title = '${projectName}';

  triggerToast() {
    if (typeof boodoo !== 'undefined') {
      boodoo.toast('Hello from Angular & boodoo!', { title: 'Angular App', variant: 'primary' });
    } else {
      alert('Hello from Angular & boodoo!');
    }
  }
}

bootstrapApplication(AppComponent).catch((err) => console.error(err));
`;
    fs.writeFileSync(path.join(targetDir, 'src', 'main.ts'), mainTs);
    fs.writeFileSync(path.join(targetDir, 'src', 'styles.css'), `/* App styles */\n`);

  } else if (choice === '6') {
    // Cordova & PhoneGap Hybrid Mobile App template
    const pkg = {
      name: projectName,
      version: '1.0.0',
      description: 'Hybrid mobile app for Cordova & PhoneGap powered by boodoo',
      main: 'index.js',
      scripts: {
        start: 'npx serve www',
        'build:android': 'cordova build android',
        'build:ios': 'cordova build ios',
      },
      dependencies: {
        boodoo: `^${BOODOO_VERSION}`,
      },
    };
    fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkg, null, 2));

    const configXml = `<?xml version='1.0' encoding='utf-8'?>
<widget id="com.boodoo.${projectName.replace(/[^a-zA-Z0-9]/g, '')}" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>${projectName}</name>
    <description>boodoo Cordova / PhoneGap Hybrid Mobile App</description>
    <author email="info@boodoo.dihadiwala.com" href="https://boodoo.dihadiwala.com">boodoo Team</author>
    <content src="index.html" />
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <preference name="DisallowOverscroll" value="true" />
    <preference name="Orientation" value="portrait" />
</widget>`;
    fs.writeFileSync(path.join(targetDir, 'config.xml'), configXml);

    fs.mkdirSync(path.join(targetDir, 'www', 'css'), { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'www', 'js'), { recursive: true });

    const cordovaHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="initial-scale=1, width=device-width, viewport-fit=cover">
  <title>${projectName}</title>
  <link rel="stylesheet" href="node_modules/boodoo/dist/css/boodoo.min.css">
  <style>
    body {
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
    }
  </style>
</head>
<body class="native-ios bg-light">
  <div class="native-navbar">
    <span class="fs-6 fw-bold">${projectName}</span>
    <span class="badge bg-primary" id="device-status">Ready</span>
  </div>

  <div class="container py-4">
    <div class="card p-3 shadow-sm mb-3">
      <h5 class="fw-semibold mb-1">Cordova & PhoneGap Hybrid</h5>
      <p class="text-muted small">Cross-platform mobile web app running inside WebViews with Boodoo UI styling.</p>
      <button type="button" class="btn btn-primary w-100 rounded-pill mb-2" id="btn-notify">Show Native Toast</button>
      <button type="button" class="btn btn-outline-secondary w-100 rounded-pill" id="btn-vibrate">Haptic Feedback</button>
    </div>
  </div>

  <script src="cordova.js"></script>
  <script src="node_modules/boodoo/dist/js/boodoo.js"></script>
  <script src="js/index.js"></script>
</body>
</html>`;
    fs.writeFileSync(path.join(targetDir, 'www', 'index.html'), cordovaHtml);

    const cordovaJs = `document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
  const statusEl = document.getElementById('device-status');
  if (statusEl) statusEl.textContent = 'Device Ready';

  document.getElementById('btn-notify')?.addEventListener('click', () => {
    window.boodoo?.toast?.success?.('Cordova & PhoneGap device bridges ready!', { title: 'Mobile Event' });
  });

  document.getElementById('btn-vibrate')?.addEventListener('click', () => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    window.boodoo?.toast?.('Haptic pulse sent!', { variant: 'info' });
  });
}
`;
    fs.writeFileSync(path.join(targetDir, 'www', 'js', 'index.js'), cordovaJs);

  } else if (choice === '7') {
    // Meteor.js Full-Stack App template
    const pkg = {
      name: projectName,
      private: true,
      scripts: {
        start: 'meteor run',
      },
      dependencies: {
        '@babel/runtime': '^7.24.0',
        meteor: '^2.0.0',
        boodoo: `^${BOODOO_VERSION}`,
      },
    };
    fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkg, null, 2));

    fs.mkdirSync(path.join(targetDir, 'client'), { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'server'), { recursive: true });

    const meteorHtml = `<head>
  <title>${projectName}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body class="bg-light">
  {{> app}}
</body>

<template name="app">
  <div class="container py-5">
    <div class="card p-4 shadow-sm text-center">
      <h1 class="text-primary mb-3">${projectName}</h1>
      <p class="text-muted">Meteor Full-Stack Reactive App + boodoo UI framework</p>
      <div class="d-flex justify-content-center align-items-center gap-3 my-3">
        <button type="button" class="btn btn-primary" id="counter-btn">Clicks: {{counter}}</button>
        <button type="button" class="btn btn-outline-secondary" id="toast-btn">Trigger Toast</button>
      </div>
    </div>
  </div>
</template>`;
    fs.writeFileSync(path.join(targetDir, 'client', 'main.html'), meteorHtml);

    const clientJs = `import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import 'boodoo/dist/css/boodoo.min.css';
import boodoo from 'boodoo';

import './main.html';

Template.app.onCreated(function helloOnCreated() {
  this.counter = new ReactiveVar(0);
});

Template.app.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.app.events({
  'click #counter-btn'(event, instance) {
    instance.counter.set(instance.counter.get() + 1);
  },
  'click #toast-btn'() {
    boodoo.toast('Reactive Meteor + Boodoo integration!', { title: 'Meteor Notification', variant: 'success' });
  },
});
`;
    fs.writeFileSync(path.join(targetDir, 'client', 'main.js'), clientJs);

    const serverJs = `import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  console.log('${projectName} started with Boodoo framework.');
});
`;
    fs.writeFileSync(path.join(targetDir, 'server', 'main.js'), serverJs);

  } else if (choice === '8') {
    // Photon Desktop UI template
    const pkg = {
      name: projectName,
      version: '1.0.0',
      description: 'Desktop application with Photon UI & Boodoo framework',
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

    const photonMainJs = `const { app, BrowserWindow } = require('electron');
const path = require('node:path');

function createWindow() {
  const win = new BrowserWindow({
    width: 960,
    height: 600,
    minWidth: 700,
    minHeight: 400,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
`;
    fs.writeFileSync(path.join(targetDir, 'main.js'), photonMainJs);

    const photonHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${projectName}</title>
  <link rel="stylesheet" href="node_modules/boodoo/dist/css/boodoo.min.css">
  <style>
    html, body { height: 100%; margin: 0; overflow: hidden; }
    .window { display: flex; flex-direction: column; height: 100vh; }
  </style>
</head>
<body class="native-photon">
  <div class="window">
    <header class="toolbar-header">
      <div class="toolbar-actions">
        <div class="btn-group">
          <button type="button" class="btn" title="Back"><span>◀</span></button>
          <button type="button" class="btn" title="Forward"><span>▶</span></button>
        </div>
      </div>
      <span class="title">${projectName}</span>
      <div class="toolbar-actions">
        <button type="button" class="btn btn-primary" id="btn-save"><span>Save</span></button>
      </div>
    </header>

    <div class="window-content">
      <div class="pane-group">
        <div class="pane pane-sidebar">
          <nav class="nav-group">
            <h6 class="nav-group-title">Navigation</h6>
            <a href="#" class="nav-group-item active"><span>🏠 Dashboard</span></a>
            <a href="#" class="nav-group-item"><span>📁 Projects</span></a>
            <a href="#" class="nav-group-item"><span>⚙️ Preferences</span></a>
          </nav>
        </div>
        <div class="pane p-3">
          <div class="tab-group mb-3">
            <div class="tab-item active">
              <span>Overview</span>
              <span class="icon-close-tab">✕</span>
            </div>
            <div class="tab-item">
              <span>Inspector</span>
            </div>
          </div>
          <h5 class="fw-semibold mb-2">Photon Desktop Pane</h5>
          <p class="text-muted small">Classic Electron & macOS desktop interface powered by Boodoo Photon styles.</p>
          <div class="btn-group mt-2">
            <button type="button" class="btn btn-positive" id="btn-commit">Commit</button>
            <button type="button" class="btn btn-negative" id="btn-revert">Revert</button>
          </div>
        </div>
      </div>
    </div>

    <footer class="toolbar-footer">
      <span>Ready — Photon Desktop initialized</span>
    </footer>
  </div>

  <script src="node_modules/boodoo/dist/js/boodoo.js"></script>
  <script>
    document.getElementById('btn-save')?.addEventListener('click', () => {
      window.boodoo?.toast?.success?.('Workspace saved in Photon UI!', { title: 'Desktop Save' });
    });
    document.getElementById('btn-commit')?.addEventListener('click', () => {
      window.boodoo?.toast?.('Changes committed successfully.', { variant: 'info' });
    });
  </script>
</body>
</html>`;
    fs.writeFileSync(path.join(targetDir, 'index.html'), photonHtml);

  } else if (choice === '9') {
    // React Native Web template
    const pkg = {
      name: projectName,
      version: '0.1.0',
      private: true,
      scripts: {
        start: 'expo start --web',
        dev: 'vite',
        build: 'vite build',
      },
      dependencies: {
        react: '^18.3.0',
        'react-dom': '^18.3.0',
        'react-native-web': '^0.19.0',
        boodoo: `^${BOODOO_VERSION}`,
      },
      devDependencies: {
        '@vitejs/plugin-react': '^4.3.0',
        vite: '^5.0.0',
      },
    };
    fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkg, null, 2));

    const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
});
`;
    fs.writeFileSync(path.join(targetDir, 'vite.config.js'), viteConfig);

    const rnIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${projectName}</title>
</head>
<body class="bg-light">
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`;
    fs.writeFileSync(path.join(targetDir, 'index.html'), rnIndexHtml);

    fs.mkdirSync(path.join(targetDir, 'src'), { recursive: true });

    const appJsx = `import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import 'boodoo/dist/css/boodoo.min.css';
import boodoo from 'boodoo';

export default function App() {
  const [count, setCount] = useState(0);

  const handlePress = () => {
    setCount(count + 1);
    boodoo.toast(\`Universal click count: \${count + 1}\`, { title: 'React Native Web', variant: 'primary' });
  };

  return (
    <View style={styles.container}>
      <div className="card p-5 text-center shadow-sm" style={{ maxWidth: 480, width: '100%' }}>
        <h1 className="text-primary mb-2">${projectName}</h1>
        <p className="text-muted mb-4">React Native Web with Boodoo Design System styling.</p>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Increment Count: {count}</Text>
        </TouchableOpacity>
      </div>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  button: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});
`;
    fs.writeFileSync(path.join(targetDir, 'src/App.jsx'), appJsx);

    const mainJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
    fs.writeFileSync(path.join(targetDir, 'src/main.jsx'), mainJsx);

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
  const startCmd = (choice === '2' || choice === '3' || choice === '9') ? '  npm run dev' : '  npm start';
  console.log(startCmd);
  console.log('');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
