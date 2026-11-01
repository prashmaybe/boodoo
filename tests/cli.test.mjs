import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import readline from 'node:readline';

const rootDir = resolve(import.meta.dirname, '..');

test('Boodoo CLI component injector (npx boodoo add) and CSS migration codemod (npx boodoo migrate)', async () => {
  const { addComponent, listAvailableComponents, runMigration, handleAdd, handleMigrate, printHelp, runCli } = await import(
    pathToFileURL(resolve(rootDir, 'bin/boodoo.mjs')).href
  );

  // 1. Verify listAvailableComponents
  const available = listAvailableComponents();
  assert.ok(available.includes('modal'), 'available components must include modal');
  assert.ok(available.includes('command-palette'), 'available components must include command-palette');
  assert.ok(available.includes('dropzone'), 'available components must include dropzone');

  // 2. Verify addComponent extraction into temporary dir & error branch
  const tempTestDir = resolve(rootDir, 'tests', 'temp_add_test');
  try {
    const result = addComponent('modal', tempTestDir);
    assert.equal(result.name, 'modal');
    assert.ok(result.files.length > 0, 'addComponent should copy files');
    assert.equal(result.reactHook, 'useDisclosure');
    assert.ok(existsSync(resolve(tempTestDir, 'components/boodoo/_modal.scss')));
    assert.ok(existsSync(resolve(tempTestDir, 'components/boodoo/modal.js')));

    // Error branch when component name is unknown
    assert.throws(() => addComponent('non-existent-comp', tempTestDir), /not found/i);
  } finally {
    const { rmSync } = await import('node:fs');
    rmSync(tempTestDir, { recursive: true, force: true });
  }

  // 3. Verify Bootstrap migration codemod
  const bsSample = '<button data-bs-toggle="modal" data-bs-target="#myModal" class="btn btn-primary fs-2 fw-bold">Open</button>';
  const bsResult = runMigration(bsSample, 'bootstrap');
  assert.ok(bsResult.replacementsCount >= 4, 'Should replace multiple bootstrap attributes and classes');
  assert.ok(bsResult.output.includes('data-boodoo-toggle="modal"'), 'Should replace data-bs-toggle');
  assert.ok(bsResult.output.includes('data-boodoo-target="#myModal"'), 'Should replace data-bs-target');
  assert.ok(bsResult.output.includes('display-2'), 'Should replace fs-2 with display-2');
  assert.ok(bsResult.output.includes('font-weight-bold'), 'Should replace fw-bold with font-weight-bold');

  // 4. Verify Tailwind migration codemod
  const twSample = '<div class="flex flex-col items-center justify-between w-full font-bold max-w-7xl mx-auto"></div>';
  const twResult = runMigration(twSample, 'tailwind');
  assert.ok(twResult.replacementsCount >= 5, 'Should replace multiple tailwind utility chains');
  assert.ok(twResult.output.includes('flex-column'), 'Should replace flex flex-col with flex-column');
  assert.ok(twResult.output.includes('align-items-center'), 'Should replace items-center');
  assert.ok(twResult.output.includes('justify-content-between'), 'Should replace justify-between');
  assert.ok(twResult.output.includes('w-100'), 'Should replace w-full with w-100');
  assert.ok(twResult.output.includes('container'), 'Should replace max-w-7xl mx-auto with container');

  // 5. Test CLI Runners & Handlers: handleAdd
  const noCompRes = await handleAdd(['add']);
  assert.equal(noCompRes, undefined, 'handleAdd without component name prints list');

  const tempCliDir = resolve(rootDir, 'tests', 'temp_cli_test');
  try {
    const prevCwd = process.cwd();
    const { mkdirSync, writeFileSync, rmSync } = await import('node:fs');
    mkdirSync(tempCliDir, { recursive: true });
    process.chdir(tempCliDir);

    // Test successful handleAdd
    const addSuccess = await handleAdd(['add', 'toast']);
    assert.equal(addSuccess.name, 'toast');
    assert.ok(existsSync(resolve(tempCliDir, 'components/boodoo/_toasts.scss')));

    // Test handleAdd error branch
    await assert.rejects(async () => {
      await handleAdd(['add', 'invalid-widget']);
    });

    // Test handleMigrate empty directory
    const emptyMigrate = await handleMigrate(['migrate', tempCliDir]);
    assert.equal(emptyMigrate.filesScanned, 0);

    // Test handleMigrate on files
    const htmlFile = resolve(tempCliDir, 'index.html');
    writeFileSync(htmlFile, '<button data-bs-toggle="collapse" class="fs-1 fw-bold">Toggle</button>', 'utf8');
    const fileMigrate = await handleMigrate(['migrate', htmlFile, '--from=bootstrap']);
    assert.ok(fileMigrate.totalReplacements > 0);
    assert.ok(readFileSync(htmlFile, 'utf8').includes('data-boodoo-toggle="collapse"'));

    // Test handleMigrate on directory with Tailwind
    const twFile = resolve(tempCliDir, 'app.jsx');
    writeFileSync(twFile, '<div className="flex flex-col w-full text-center"></div>', 'utf8');
    const dirMigrate = await handleMigrate(['migrate', tempCliDir, '--from=tailwind']);
    assert.ok(dirMigrate.totalReplacements > 0);
    assert.ok(readFileSync(twFile, 'utf8').includes('flex-column'));

    // Test runCli routing for add (with reactHook coverage) and migrate
    const addViaRunCli = await runCli('add', ['add', 'modal']);
    assert.equal(addViaRunCli.name, 'modal');
    assert.equal(addViaRunCli.reactHook, 'useDisclosure');

    const migrateViaRunCli = await runCli('migrate', ['migrate', tempCliDir, '--from=tailwind']);
    assert.ok(migrateViaRunCli);

    // Test runCli routing for create / init with spawn handler
    let spawnCalled = false;
    const mockSpawn = (cmd, args, opts) => {
      spawnCalled = true;
      return {
        on(event, cb) {
          if (event === 'exit') cb(0);
        }
      };
    };
    const createArgs = ['create', 'test-app'];
    createArgs._spawnFn = mockSpawn;
    const createChild = await runCli('create', createArgs);
    assert.ok(spawnCalled);
    assert.ok(createChild);

    process.chdir(prevCwd);
  } finally {
    const { rmSync } = await import('node:fs');
    rmSync(tempCliDir, { recursive: true, force: true });
  }

  // 6. Test printHelp and runCli routing
  printHelp();
  await runCli('help', ['help']);
  await runCli('--help', ['--help']);
  await runCli('-h', ['-h']);
  const listRes = await runCli('list', ['list']);
  assert.ok(Array.isArray(listRes) && listRes.length > 0);
});


test('Boodoo CLI injector and migration coverage for all 8 v1.1.9 components', async () => {
  const { addComponent, listAvailableComponents } = await import(
    pathToFileURL(resolve(rootDir, 'bin/boodoo.mjs')).href
  );

  const available = listAvailableComponents();
  const newV119Components = [
    'chat-thread',
    'filter-bar',
    'kanban-board',
    'bento-grid',
    'transfer-list',
    'audio-player',
    'color-picker',
    'back-to-top'
  ];

  for (const comp of newV119Components) {
    assert.ok(available.includes(comp), `CLI must list ${comp} as available component`);
  }

  const tempDir = resolve(rootDir, 'tests', 'temp_v119_cli_test');
  try {
    for (const comp of newV119Components) {
      const res = addComponent(comp, tempDir);
      assert.equal(res.name, comp);
      assert.ok(res.files.length > 0, `addComponent for ${comp} should inject files`);
    }
  } finally {
    const { rmSync } = await import('node:fs');
    rmSync(tempDir, { recursive: true, force: true });
  }
});


test('create-boodoo CLI scaffolder supports JS and TS options across templates', async () => {
  const { parseArgs, scaffoldProject } = await import(pathToFileURL(resolve(rootDir, 'bin/create-boodoo.mjs')).href);
  const os = await import('node:os');
  const fs = await import('node:fs');

  // Test argument parser
  const p1 = parseArgs(['my-electron-app', '--template=electron', '--ts']);
  assert.equal(p1.projectName, 'my-electron-app');
  assert.equal(p1.template, '4');
  assert.equal(p1.isTs, true);

  const p2 = parseArgs(['my-react-app', '-t', 'react', '--js']);
  assert.equal(p2.projectName, 'my-react-app');
  assert.equal(p2.template, '3');
  assert.equal(p2.isTs, false);

  const tmpBase = fs.mkdtempSync(resolve(os.tmpdir(), 'boodoo-scaffold-test-'));

  try {
    // 1. Electron TS & JS
    const elTsDir = resolve(tmpBase, 'el-ts');
    scaffoldProject({ targetDir: elTsDir, projectName: 'el-ts', choice: '4', isTs: true });
    assert.ok(fs.existsSync(resolve(elTsDir, 'tsconfig.json')), 'Electron TS must have tsconfig.json');
    assert.ok(fs.existsSync(resolve(elTsDir, 'src/main.ts')), 'Electron TS must have src/main.ts');
    assert.ok(fs.existsSync(resolve(elTsDir, 'src/preload.ts')), 'Electron TS must have src/preload.ts');
    assert.ok(fs.existsSync(resolve(elTsDir, 'src/renderer.ts')), 'Electron TS must have src/renderer.ts');

    const elJsDir = resolve(tmpBase, 'el-js');
    scaffoldProject({ targetDir: elJsDir, projectName: 'el-js', choice: '4', isTs: false });
    assert.ok(fs.existsSync(resolve(elJsDir, 'main.js')), 'Electron JS must have main.js');
    assert.ok(fs.existsSync(resolve(elJsDir, 'preload.js')), 'Electron JS must have preload.js');
    assert.ok(fs.existsSync(resolve(elJsDir, 'renderer.js')), 'Electron JS must have renderer.js');

    // 2. React / Next.js TS & JS
    const reactTsDir = resolve(tmpBase, 'react-ts');
    scaffoldProject({ targetDir: reactTsDir, projectName: 'react-ts', choice: '3', isTs: true });
    assert.ok(fs.existsSync(resolve(reactTsDir, 'tsconfig.json')), 'React TS must have tsconfig.json');
    assert.ok(fs.existsSync(resolve(reactTsDir, 'app/layout.tsx')), 'React TS must have app/layout.tsx');
    assert.ok(fs.existsSync(resolve(reactTsDir, 'app/page.tsx')), 'React TS must have app/page.tsx');

    const reactJsDir = resolve(tmpBase, 'react-js');
    scaffoldProject({ targetDir: reactJsDir, projectName: 'react-js', choice: '3', isTs: false });
    assert.ok(fs.existsSync(resolve(reactJsDir, 'jsconfig.json')), 'React JS must have jsconfig.json');
    assert.ok(fs.existsSync(resolve(reactJsDir, 'app/layout.jsx')), 'React JS must have app/layout.jsx');
    assert.ok(fs.existsSync(resolve(reactJsDir, 'app/page.jsx')), 'React JS must have app/page.jsx');

    // 3. Angular TS & JS
    const ngTsDir = resolve(tmpBase, 'ng-ts');
    scaffoldProject({ targetDir: ngTsDir, projectName: 'ng-ts', choice: '5', isTs: true });
    assert.ok(fs.existsSync(resolve(ngTsDir, 'src/main.ts')), 'Angular TS must have src/main.ts');
    const ngTsConfig = JSON.parse(fs.readFileSync(resolve(ngTsDir, 'angular.json'), 'utf8'));
    assert.equal(ngTsConfig.projects['ng-ts'].architect.build.options.browser, 'src/main.ts');

    const ngJsDir = resolve(tmpBase, 'ng-js');
    scaffoldProject({ targetDir: ngJsDir, projectName: 'ng-js', choice: '5', isTs: false });
    assert.ok(fs.existsSync(resolve(ngJsDir, 'src/main.js')), 'Angular JS must have src/main.js');
    const ngJsConfig = JSON.parse(fs.readFileSync(resolve(ngJsDir, 'angular.json'), 'utf8'));
    assert.equal(ngJsConfig.projects['ng-js'].architect.build.options.browser, 'src/main.js');

    // 4. React Native Mobile (Expo) TS & JS
    const expoTsDir = resolve(tmpBase, 'expo-ts');
    scaffoldProject({ targetDir: expoTsDir, projectName: 'expo-ts', choice: '10', isTs: true });
    assert.ok(fs.existsSync(resolve(expoTsDir, 'tsconfig.json')), 'Expo TS must have tsconfig.json');
    assert.ok(fs.existsSync(resolve(expoTsDir, 'App.tsx')), 'Expo TS must have App.tsx');

    const expoJsDir = resolve(tmpBase, 'expo-js');
    scaffoldProject({ targetDir: expoJsDir, projectName: 'expo-js', choice: '10', isTs: false });
    assert.ok(fs.existsSync(resolve(expoJsDir, 'App.js')), 'Expo JS must have App.js');

    // 5. React Native Web TS & JS
    const rnwTsDir = resolve(tmpBase, 'rnw-ts');
    scaffoldProject({ targetDir: rnwTsDir, projectName: 'rnw-ts', choice: '9', isTs: true });
    assert.ok(fs.existsSync(resolve(rnwTsDir, 'src/App.tsx')), 'RNW TS must have src/App.tsx');
    assert.ok(fs.existsSync(resolve(rnwTsDir, 'vite.config.ts')), 'RNW TS must have vite.config.ts');

    const rnwJsDir = resolve(tmpBase, 'rnw-js');
    scaffoldProject({ targetDir: rnwJsDir, projectName: 'rnw-js', choice: '9', isTs: false });
    assert.ok(fs.existsSync(resolve(rnwJsDir, 'src/App.jsx')), 'RNW JS must have src/App.jsx');
    assert.ok(fs.existsSync(resolve(rnwJsDir, 'vite.config.js')), 'RNW JS must have vite.config.js');
  } finally {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  }
});


test('bin/boodoo.mjs comprehensive edge and branch coverage', async () => {
  const { handleAdd, handleMigrate, runMigration, runCli } = await import(pathToFileURL(resolve(rootDir, 'bin/boodoo.mjs')).href);

  // 1. handleAdd no component specified
  const noComp = await handleAdd(['add']);
  assert.equal(noComp, undefined);

  // 2. handleAdd scss-only component (card)
  const tempDir = resolve(rootDir, 'tests/temp_edge_test');
  rmSync(tempDir, { recursive: true, force: true });
  mkdirSync(tempDir, { recursive: true });
  const prevCwd = process.cwd();

  try {
    process.chdir(tempDir);
    const cardRes = await handleAdd(['add', 'card']);
    assert.equal(cardRes.name, 'card');
    assert.equal(cardRes.reactHook, null);

    // 3. handleMigrate edge cases: non-existent folder
    const noDir = await handleMigrate(['migrate', 'non_existent_path_12345']);
    assert.equal(noDir.filesScanned, 0);

    // 4. handleMigrate folder with skipped folders (.git, node_modules, dist) and valid .vue file
    mkdirSync(join(tempDir, 'node_modules'), { recursive: true });
    writeFileSync(join(tempDir, 'node_modules/test.html'), '<div class="fs-1"></div>', 'utf8');
    mkdirSync(join(tempDir, '.git'), { recursive: true });
    writeFileSync(join(tempDir, '.git/test.html'), '<div class="fs-1"></div>', 'utf8');
    mkdirSync(join(tempDir, 'dist'), { recursive: true });
    writeFileSync(join(tempDir, 'dist/test.html'), '<div class="fs-1"></div>', 'utf8');
    mkdirSync(join(tempDir, 'src'), { recursive: true });
    writeFileSync(join(tempDir, 'src/valid.vue'), '<template><div class="fs-1"></div></template>', 'utf8');

    const migrateSkip = await handleMigrate(['migrate', tempDir, '--from=bootstrap']);
    assert.equal(migrateSkip.filesScanned, 1);
    assert.equal(migrateSkip.modifiedFiles, 1);

    // 5. runMigration unknown source
    const unknownSource = runMigration('<div class="test"></div>', 'unknown-framework');
    assert.ok(unknownSource);

    // 6. runCli edge cases: default switch and init command
    const defRes = await runCli('unknown-command-xyz', ['unknown']);
    assert.equal(defRes, true);

    const initArgs = ['init', 'my-test'];
    let spawnHit = false;
    initArgs._spawnFn = (cmd, args, opts) => {
      spawnHit = true;
      return {};
    };
    await runCli('init', initArgs);
    assert.ok(spawnHit);
  } finally {
    process.chdir(prevCwd);
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test('bin/create-boodoo.mjs comprehensive edge, template, and interactive coverage', async () => {
  const { parseArgs, scaffoldProject, prompt, main } = await import(pathToFileURL(resolve(rootDir, 'bin/create-boodoo.mjs')).href);

  // 1. parseArgs across all flags and alias mappings
  assert.equal(parseArgs(['--ts']).isTs, true);
  assert.equal(parseArgs(['--typescript']).isTs, true);
  assert.equal(parseArgs(['--js']).isTs, false);
  assert.equal(parseArgs(['--javascript']).isTs, false);
  assert.equal(parseArgs(['-t', 'nextjs', 'my-app']).template, '3');
  assert.equal(parseArgs(['--template=react-native']).template, '10');
  assert.equal(parseArgs(['--template=angular']).template, '5');
  assert.equal(parseArgs(['--template=electron']).template, '4');
  assert.equal(parseArgs(['--template=cordova']).template, '6');
  assert.equal(parseArgs(['--template=meteor']).template, '7');
  assert.equal(parseArgs(['--template=photon']).template, '8');
  assert.equal(parseArgs(['--template=rnw']).template, '9');
  assert.equal(parseArgs(['--template=html5']).template, '1');
  assert.equal(parseArgs(['--template=custom']).template, 'custom');
  assert.equal(parseArgs([]).projectName, '');

  // 2. scaffoldProject across all 10 templates in both JS and TS
  const tempScaffold = resolve(rootDir, 'tests/temp_scaffold_test');
  rmSync(tempScaffold, { recursive: true, force: true });
  mkdirSync(tempScaffold, { recursive: true });

  try {
    for (let c = 1; c <= 10; c++) {
      const choice = String(c);
      const dirJs = join(tempScaffold, `t_${c}_js`);
      const dirTs = join(tempScaffold, `t_${c}_ts`);

      const resJs = scaffoldProject({ targetDir: dirJs, projectName: `app-${c}-js`, choice, isTs: false });
      assert.ok(resJs.templateName);
      assert.ok(existsSync(dirJs));

      const resTs = scaffoldProject({ targetDir: dirTs, projectName: `app-${c}-ts`, choice, isTs: true });
      assert.ok(resTs.templateName);
      assert.ok(existsSync(dirTs));
    }
  } finally {
    rmSync(tempScaffold, { recursive: true, force: true });
  }

  // 3. Test prompt() with mocked readline
  const origCreateInterface = readline.createInterface;
  readline.createInterface = () => ({
    question: (q, cb) => cb('custom-value'),
    close: () => {},
  });
  const promptVal = await prompt('Test question', 'default');
  assert.equal(promptVal, 'custom-value');

  readline.createInterface = () => ({
    question: (q, cb) => cb(''),
    close: () => {},
  });
  const promptDefault = await prompt('Test question 2', 'my-default');
  assert.equal(promptDefault, 'my-default');
  readline.createInterface = origCreateInterface;

  // 4. Test main() CLI execution path with pre-parsed arguments
  const origArgv = process.argv;
  const tempMainDir = resolve(rootDir, 'tests/temp_main_test');
  rmSync(tempMainDir, { recursive: true, force: true });
  mkdirSync(tempMainDir, { recursive: true });
  const prevCwd = process.cwd();

  try {
    process.chdir(tempMainDir);
    process.argv = ['node', 'create-boodoo.mjs', 'sample-app', '-t', '1', '--js'];
    await main();
    assert.ok(existsSync(join(tempMainDir, 'sample-app/index.html')));

    // Test interactive main() prompting for projectName, template, and isTs
    const origCreateInterface2 = readline.createInterface;
    const answers = ['interactive-app', '5', 'ts'];
    let aIdx = 0;
    readline.createInterface = () => ({
      question: (q, cb) => cb(answers[aIdx++] || ''),
      close: () => {},
    });
    process.argv = ['node', 'create-boodoo.mjs'];
    await main();
    assert.ok(existsSync(join(tempMainDir, 'interactive-app/angular.json')));
    readline.createInterface = origCreateInterface2;

    // Test directory already exists error path
    const origExit = process.exit;
    let exitCode = null;
    process.exit = (code) => { exitCode = code; };
    process.argv = ['node', 'create-boodoo.mjs', 'interactive-app', '-t', '1', '--js'];
    await main();
    assert.equal(exitCode, 1);
    process.exit = origExit;
  } finally {
    process.chdir(prevCwd);
    process.argv = origArgv;
    rmSync(tempMainDir, { recursive: true, force: true });
  }
});

