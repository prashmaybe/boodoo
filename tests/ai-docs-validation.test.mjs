import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

test('AI Documentation and Specification Validation', async (t) => {

  await t.test('1. Version in llms.txt, llms-full.txt, and component index matches package.json', () => {
    const llmsTxt = fs.readFileSync(path.join(root, 'llms.txt'), 'utf8');
    const llmsFull = fs.readFileSync(path.join(root, 'llms-full.txt'), 'utf8');
    const compIndex = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'ai', 'component-index.json'), 'utf8'));

    assert.ok(llmsTxt.includes(pkg.version), `llms.txt contains current version ${pkg.version}`);
    assert.ok(llmsFull.includes(pkg.version), `llms-full.txt contains current version ${pkg.version}`);
    assert.equal(compIndex.version, pkg.version, `component-index.json version matches package.json`);
  });

  await t.test('2. Every documented package export exists in package.json exports mapping', () => {
    const documentedExports = [
      '.',
      './css',
      './css/grid',
      './css/reboot',
      './css/utilities',
      './css/animations',
      './tokens',
      './react',
      './vue',
      './react-native'
    ];

    for (const exp of documentedExports) {
      assert.ok(pkg.exports[exp], `package.json exports mapping must include "${exp}"`);
    }
  });

  await t.test('3. Component catalogue references valid documentation URLs and categories', () => {
    const compIndex = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'ai', 'component-index.json'), 'utf8'));
    assert.ok(Array.isArray(compIndex.components) && compIndex.components.length > 0, 'Component list is populated');

    for (const comp of compIndex.components) {
      assert.ok(comp.name, 'Component has a name');
      assert.ok(comp.category, 'Component has a category');
      assert.ok(comp.documentation.startsWith('https://boodooframework.com/docs/'), 'Valid docs URL format');
      assert.ok(Array.isArray(comp.frameworks) && comp.frameworks.length > 0, 'Framework array defined');
    }
  });

  await t.test('4. All runnable example folders exist and contain complete, non-empty code', () => {
    const compIndex = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'ai', 'component-index.json'), 'utf8'));
    for (const comp of compIndex.components) {
      if (comp.examples) {
        for (const exPath of comp.examples) {
          const fullExPath = path.join(root, exPath);
          assert.ok(fs.existsSync(fullExPath), `Example directory exists: ${exPath}`);
          const files = fs.readdirSync(fullExPath);
          assert.ok(files.length > 0, `Example directory ${exPath} is not empty`);
        }
      }
    }
  });

  await t.test('5. AI instruction files contain verified installation and framework references', () => {
    const instructionFiles = [
      'CLAUDE.md',
      'GEMINI.md',
      '.windsurfrules',
      '.clinerules',
      '.cursor/rules/boodoo.mdc',
      '.github/copilot-instructions.md'
    ];

    for (const file of instructionFiles) {
      const fullPath = path.join(root, file);
      assert.ok(fs.existsSync(fullPath), `Instruction file ${file} exists`);
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.ok(content.includes('boodoo'), `${file} references boodoo`);
      assert.ok(!content.includes('@boodoo/core'), `${file} must not contain deprecated/non-existent package names`);
    }
  });

  await t.test('6. MCP Server responds properly to tools/list and schema validation', async () => {
    const { execSync } = await import('node:child_process');
    const input = JSON.stringify({ jsonrpc: '2.0', id: 100, method: 'tools/list' }) + '\n';
    const output = execSync('node mcp/server.mjs', { cwd: root, input, encoding: 'utf8' });
    const parsed = JSON.parse(output);
    assert.equal(parsed.jsonrpc, '2.0');
    assert.equal(parsed.id, 100);
    assert.ok(Array.isArray(parsed.result.tools));
    const toolNames = parsed.result.tools.map(t => t.name);
    assert.ok(toolNames.includes('search_components'));
    assert.ok(toolNames.includes('get_component_docs'));
    assert.ok(toolNames.includes('get_component_example'));
    assert.ok(toolNames.includes('get_design_tokens'));
    assert.ok(toolNames.includes('get_design_token'));
    assert.ok(toolNames.includes('validate_component_usage'));
  });

  await t.test('7. MCP Server prevents path traversal attacks in get_component_example', async () => {
    const { execSync } = await import('node:child_process');

    const runCall = (args) => {
      const input = JSON.stringify({
        jsonrpc: '2.0',
        id: 101,
        method: 'tools/call',
        params: {
          name: 'get_component_example',
          arguments: args,
        },
      }) + '\n';
      const output = execSync('node mcp/server.mjs', { cwd: root, input, encoding: 'utf8' });
      const parsed = JSON.parse(output);
      const textContent = parsed.result.content[0].text;
      return JSON.parse(textContent);
    };

    // Test dot-dot traversal
    const resTraversal = runCall({ component: '../../package.json', framework: 'vanilla-js' });
    assert.ok(resTraversal.error, 'Path traversal in component name must be blocked');

    // Test invalid framework traversal
    const resFw = runCall({ component: 'modal', framework: '../..' });
    assert.ok(resFw.error, 'Path traversal in framework must be blocked');

    // Test valid component example retrieval
    const resValid = runCall({ component: 'modal', framework: 'vanilla-js' });
    assert.ok(resValid.files, 'Valid component example should return files object');
    assert.ok(resValid.files['index.html'], 'Modal example should contain index.html');
  });

  await t.test('8. MCP Server get_design_token and validate_component_usage tools work correctly', async () => {
    const { execSync } = await import('node:child_process');

    const callMcp = (name, args) => {
      const input = JSON.stringify({
        jsonrpc: '2.0',
        id: 102,
        method: 'tools/call',
        params: { name, arguments: args },
      }) + '\n';
      const output = execSync('node mcp/server.mjs', { cwd: root, input, encoding: 'utf8' });
      const parsed = JSON.parse(output);
      return JSON.parse(parsed.result.content[0].text);
    };

    // get_design_token
    const tokenPrimary = callMcp('get_design_token', { name: 'colors.primary' });
    assert.equal(tokenPrimary.value, '#7c3aed');
    const tokenSpacing = callMcp('get_design_token', { name: '1' });
    assert.equal(tokenSpacing.value, 20);

    // validate_component_usage catches missing input id/name
    const invalidInput = callMcp('validate_component_usage', {
      code: '<form><input type="text" class="form-control"></form>',
      framework: 'html',
    });
    assert.equal(invalidInput.valid, false);
    assert.ok(invalidInput.issues.some((i) => i.rule.includes('Form Field')));

    // validate_component_usage passes compliant snippet
    const validInput = callMcp('validate_component_usage', {
      code: '<form><label for="user"><span>Name</span></label><input id="user" name="user" type="text" class="form-control"></form>',
      framework: 'html',
    });
    assert.equal(validInput.valid, true);
  });

});

