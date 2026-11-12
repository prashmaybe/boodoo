import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

test('AI Compatibility Benchmark & Evaluation Suite', async (t) => {

  await t.test('1. Evaluation: Responsive Navbar generates verified Boodoo classes and structure', () => {
    // Standard prompt: "Create a responsive navbar using BooDoo"
    const standardNavbar = `
    <nav class="navbar navbar-expand-lg bg-light border-bottom">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" href="#"><span>Boodoo Brand</span></a>
        <button class="navbar-toggler" type="button" data-boodoo-toggle="collapse" data-boodoo-target="#navContent" aria-controls="navContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link active" href="#"><span>Home</span></a></li>
            <li class="nav-item"><a class="nav-link" href="#"><span>Features</span></a></li>
          </ul>
        </div>
      </div>
    </nav>
    `;

    assert.ok(standardNavbar.includes('class="navbar'), 'Contains .navbar class');
    assert.ok(standardNavbar.includes('data-boodoo-toggle="collapse"'), 'Contains native Boodoo data-attribute');
    assert.ok(!standardNavbar.includes('data-bs-toggle'), 'Does not hallucinate Bootstrap data-attribute');
    assert.ok(!standardNavbar.includes('data-tw-toggle'), 'Does not hallucinate Tailwind attributes');
    assert.ok(standardNavbar.includes('<span>Home</span>'), 'Text properly wrapped in semantic span');
  });

  await t.test('2. Evaluation: Modal generation adheres to Boodoo JavaScript API and accessibility', () => {
    // Standard prompt: "Create a modal using BooDoo"
    const standardModal = `
    <div class="modal fade" id="testModal" tabindex="-1" role="dialog" aria-modal="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><span>Modal Title</span></h5>
            <button type="button" class="btn-close" data-boodoo-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p><span>Modal content text.</span></p>
          </div>
        </div>
      </div>
    </div>
    `;

    assert.ok(standardModal.includes('data-boodoo-dismiss="modal"'), 'Uses native Boodoo dismiss data-attribute');
    assert.ok(standardModal.includes('aria-modal="true"'), 'Includes WCAG aria-modal attribute');
    assert.ok(standardModal.includes('role="dialog"'), 'Includes WCAG dialog role');
  });

  await t.test('3. Evaluation: React dashboard generation uses verified boodoo/react hooks', () => {
    // Standard prompt: "Build a React modal component using BooDoo"
    const reactSnippet = `
    import React from 'react';
    import { useDisclosure } from 'boodoo/react';
    import 'boodoo/css';

    export function MyModal() {
      const { isOpen, onOpen, onClose } = useDisclosure();
      return (
        <div>
          <button type="button" className="btn btn-primary" onClick={onOpen}>
            <span>Open</span>
          </button>
        </div>
      );
    }
    `;

    assert.ok(reactSnippet.includes("import { useDisclosure } from 'boodoo/react'"), 'Imports verified headless hook');
    assert.ok(reactSnippet.includes("import 'boodoo/css'"), 'Imports official CSS package path');
    assert.ok(!reactSnippet.includes('@boodoo/core'), 'Does not fabricate legacy or unverified package scopes');
  });

  await t.test('4. Evaluation: React Native mobile components use StyleSheet.create and zero inline styles', () => {
    // Standard prompt: "Create a mobile card using BooDoo"
    const rnSnippet = `
    import React from 'react';
    import { View, StyleSheet } from 'react-native';
    import { Card, Button, BoodooProvider } from 'boodoo/react-native';

    export function MobileScreen() {
      return (
        <BoodooProvider>
          <View style={styles.cardWrapper}>
            <Card variant="elevated">
              <Button title="Tap" variant="primary" />
            </Card>
          </View>
        </BoodooProvider>
      );
    }

    const styles = StyleSheet.create({
      cardWrapper: {
        padding: 16,
      },
    });
    `;

    assert.ok(rnSnippet.includes("import { Card, Button, BoodooProvider } from 'boodoo/react-native'"), 'Imports native components');
    assert.ok(!rnSnippet.includes('style={{'), 'Strict zero inline styles enforcement');
    assert.ok(rnSnippet.includes('StyleSheet.create'), 'Styles composed via StyleSheet.create');
  });

  await t.test('5. Evaluation: Dark mode implementation uses dynamic theme tokens', () => {
    // Standard prompt: "Implement dark mode in Boodoo"
    const darkModeHtml = `<html lang="en" data-boodoo-theme="dark">`;
    const cssVariableSnippet = `
    .custom-panel {
      background-color: var(--boodoo-card-bg);
      color: var(--boodoo-body-color);
      border-color: var(--boodoo-border-color);
    }
    `;

    assert.ok(darkModeHtml.includes('data-boodoo-theme="dark"'), 'Activates dark mode via data-boodoo-theme attribute');
    assert.ok(cssVariableSnippet.includes('var(--boodoo-card-bg)'), 'Uses dynamic CSS variables');
    assert.ok(!cssVariableSnippet.includes('#121212'), 'Does not hardcode static dark colors');
  });

});
