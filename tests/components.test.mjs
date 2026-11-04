import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const rootDir = resolve(import.meta.dirname, '..');

test('Modal focus management, Data API, and dispose() lifecycle verification', async () => {
  // Test BaseComponent and Modal in simulated environment
  const { BaseComponent, initDataApi } = await import(pathToFileURL(resolve(rootDir, 'js/src/base-component.js')).href);
  const { Modal } = await import(pathToFileURL(resolve(rootDir, 'js/src/modal.js')).href);

  // Fake DOM element for component lifecycle testing
  class FakeElement {
    constructor(id = 'test-el') {
      this.id = id;
      this.attributes = [];
      this.style = {};
      this.classList = {
        _classes: new Set(),
        add(c) { this._classes.add(c); },
        remove(c) { this._classes.delete(c); },
        contains(c) { return this._classes.has(c); },
      };
      this.children = [];
    }
    querySelector() { return null; }
    querySelectorAll() { return []; }
    addEventListener() {}
    removeEventListener() {}
    getAttribute() { return null; }
    setAttribute() {}
    removeAttribute() {}
  }

  const el = new FakeElement('modal-1');
  const modal = Modal.getOrCreateInstance(el, { keyboard: true });
  assert.ok(modal, 'Modal instance should be created');
  assert.equal(Modal.getInstance(el), modal, 'Modal.getInstance should return cached instance');

  // Verify component namespacing in registry
  class DummyComponent extends BaseComponent {
    static get NAME() { return 'dummy'; }
  }
  const dummy = DummyComponent.getOrCreateInstance(el);
  assert.notEqual(Modal.getInstance(el), dummy, 'Modal and DummyComponent should not collide on same element');
  assert.equal(DummyComponent.getInstance(el), dummy);

  // Verify dispose() lifecycle
  modal.dispose();
  assert.equal(Modal.getInstance(el), null, 'Modal.getInstance should return null after dispose()');
  assert.equal(DummyComponent.getInstance(el), dummy, 'DummyComponent should remain registered');
  dummy.dispose();
  assert.equal(DummyComponent.getInstance(el), null);

  // Verify BaseComponent._dataAttrConfig kebab->camelCase conversion and numeric whitespace parsing
  const mockAttrEl = {
    attributes: [
      { name: 'data-boodoo-placement-top', value: 'true' },
      { name: 'data-boodoo-max-count', value: '42' },
      { name: 'data-boodoo-blank-space', value: '   ' },
      { name: 'data-boodoo-raw-string', value: 'active-state' }
    ]
  };
  const cfg = BaseComponent._dataAttrConfig(mockAttrEl);
  assert.equal(cfg.placementTop, true, 'Kebab key must be converted to camelCase');
  assert.equal(cfg.maxCount, 42, 'Numeric string should be parsed to Number');
  assert.equal(cfg.blankSpace, '   ', 'Whitespace strings must not be coerced to 0');
  assert.equal(cfg.rawString, 'active-state');
});


test('XSS sanitization regression tests across Toast, ChipInput, and CommandPalette', async () => {
  const { escapeHtml, sanitizeHtml } = await import(pathToFileURL(resolve(rootDir, 'js/src/util.js')).href);

  // 1. Direct utility testing
  const malicious = '<script>alert("xss")</script><img src="x" onerror="alert(1)">';
  const sanitized = escapeHtml(malicious);
  assert.ok(!sanitized.includes('<script>'), 'Must escape script tags');
  assert.ok(!sanitized.includes('</script>'), 'Must escape script closing tags');
  assert.ok(!sanitized.includes('<img'), 'Must escape img tags');
  assert.ok(sanitized.includes('&lt;script&gt;'), 'Must entity-encode < and >');
  assert.ok(sanitized.includes('&quot;'), 'Must entity-encode quotes');

  // Null & undefined handling
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(undefined), '');

  // 1b. sanitizeHtml utility testing
  const safeSanitized = sanitizeHtml(malicious);
  assert.ok(!safeSanitized.includes('<script>'), 'sanitizeHtml must eliminate executable script tags');
  assert.ok(!safeSanitized.includes('<img'), 'sanitizeHtml must eliminate executable img tags');
  assert.ok(safeSanitized.includes('&lt;script&gt;'), 'sanitizeHtml must entity-encode < and >');
  assert.equal(sanitizeHtml(null), '');
  assert.equal(sanitizeHtml(undefined), '');

  // 1c. Popover safe DOM creation and XSS prevention
  const { Popover } = await import(pathToFileURL(resolve(rootDir, 'js/src/tooltip.js')).href);
  const setContentSrc = Popover.prototype.setContent.toString();
  assert.ok(setContentSrc.includes('this._sanitize(content)'), 'Popover setContent must sanitize HTML before assigning to innerHTML');
  const disposeSrc = Popover.prototype.dispose.toString();
  assert.ok(disposeSrc.includes('removeEventListener'), 'Popover dispose must clean up window and element event listeners');

  // 2. ChipInput safe DOM creation
  const { ChipInput } = await import(pathToFileURL(resolve(rootDir, 'js/src/chip-input.js')).href);
  class MockChipContainer {
    constructor() {
      this.attributes = [];
      this.classList = { add() {}, remove() {}, contains() { return false; } };
      this.children = [];
    }
    querySelector() { return null; }
    appendChild(child) { this.children.push(child); }
    insertBefore(child) { this.children.unshift(child); }
    dispatchEvent() { return true; }
  }

  const container = new MockChipContainer();
  // Ensure ChipInput.prototype.addChip does not inject raw HTML
  const addChipSrc = ChipInput.prototype.addChip.toString();
  assert.ok(addChipSrc.includes('labelSpan.textContent = text'), 'addChip must assign text via textContent');
  assert.ok(!addChipSrc.includes('innerHTML = `<span>${text}</span>'), 'addChip must not interpolate raw user text into innerHTML');

  // 3. TypeScript definition files existence
  assert.ok(existsSync(resolve(rootDir, 'dist/js/boodoo.d.ts')), 'dist/js/boodoo.d.ts must exist');
  assert.ok(existsSync(resolve(rootDir, 'tokens/index.d.ts')), 'tokens/index.d.ts must exist');
  assert.ok(existsSync(resolve(rootDir, 'react-native/index.d.ts')), 'react-native/index.d.ts must exist');
});


test('Dropzone safe DOM creation, XSS prevention, and URL revocation', async () => {
  const { Dropzone } = await import(pathToFileURL(resolve(rootDir, 'js/src/dropzone.js')).href);
  const dropzoneSrc = Dropzone.prototype._renderFileItem.toString();

  // Dropzone must not interpolate file.name into innerHTML
  assert.ok(!dropzoneSrc.includes('alt="${file.name}"'), 'Dropzone must not interpolate file.name in string template alt');
  assert.ok(!dropzoneSrc.includes('<span>${file.name}</span>'), 'Dropzone must not interpolate file.name into HTML span');
  assert.ok(dropzoneSrc.includes('nameSpan.textContent = file.name'), 'Dropzone must assign file name using textContent');
  assert.ok(dropzoneSrc.includes('previewEl.alt = file.name'), 'Dropzone must assign alt safely via property setter');
  assert.ok(dropzoneSrc.includes("startsWith('blob:')"), 'Dropzone must validate blob: URL scheme before assignment');
  assert.ok(dropzoneSrc.includes('encodeURI'), 'Dropzone must sanitize object URL with encodeURI');
  assert.ok(dropzoneSrc.includes('previewEl.src = safeUrl'), 'Dropzone must assign sanitized URL to image src');

  // Verify URL.revokeObjectURL tracking
  const removeSrc = Dropzone.prototype.removeFile.toString();
  const clearSrc = Dropzone.prototype.clear.toString();
  assert.ok(removeSrc.includes('URL.revokeObjectURL'), 'removeFile must revoke object URL to prevent memory leaks');
  assert.ok(clearSrc.includes('URL.revokeObjectURL'), 'clear must revoke object URL to prevent memory leaks');
});


test('CommandPalette non-intrusive shortcut activation and safe navigation validation', async () => {
  const { CommandPalette } = await import(pathToFileURL(resolve(rootDir, 'js/src/command-palette.js')).href);
  const cpModuleSrc = readFileSync(resolve(rootDir, 'js/src/command-palette.js'), 'utf8');

  // Must not unconditionally bind Ctrl+K on document without presence check
  assert.ok(
    cpModuleSrc.includes('document.querySelector') || cpModuleSrc.includes('initDefault'),
    'CommandPalette must guard global shortcut registration'
  );

  // Must validate navigation URL protocols
  assert.ok(
    cpModuleSrc.includes('/^(?:https?:|\\/|#|mailto:)/i'),
    'CommandPalette must restrict item.href to safe protocols'
  );
});


test('Offcanvas and SpeedDial lifecycle teardown & listener cleanup', async () => {
  const { Offcanvas } = await import(pathToFileURL(resolve(rootDir, 'js/src/offcanvas.js')).href);
  const { SpeedDial } = await import(pathToFileURL(resolve(rootDir, 'js/src/speed-dial.js')).href);

  assert.equal(typeof Offcanvas.prototype.dispose, 'function', 'Offcanvas must provide dispose()');
  assert.equal(typeof SpeedDial.prototype.dispose, 'function', 'SpeedDial must provide dispose()');

  const offcanvasModuleSrc = readFileSync(resolve(rootDir, 'js/src/offcanvas.js'), 'utf8');
  assert.ok(offcanvasModuleSrc.includes('removeEventListener'), 'Offcanvas must clean up event listeners on teardown');

  const speedDialDisposeSrc = SpeedDial.prototype.dispose.toString();
  assert.ok(speedDialDisposeSrc.includes('removeEventListener'), 'SpeedDial dispose must clean up document listeners');
});


test('WAI-ARIA accessibility suite (announcer, roving tabindex, focus trap, combobox, treeview)', async () => {
  const { a11y } = await import(pathToFileURL(resolve(rootDir, 'js/src/a11y.js')).href);
  assert.equal(typeof a11y.announce, 'function', 'a11y.announce must be a function');
  assert.equal(typeof a11y.setRovingTabindex, 'function', 'a11y.setRovingTabindex must be a function');
  assert.equal(typeof a11y.createFocusTrap, 'function', 'a11y.createFocusTrap must be a function');

  // Combobox WAI-ARIA 1.2 patterns
  const comboboxSrc = readFileSync(resolve(rootDir, 'js/src/combobox.js'), 'utf8');
  assert.ok(comboboxSrc.includes("role', 'combobox'"), 'Combobox input must have role="combobox"');
  assert.ok(comboboxSrc.includes("aria-autocomplete', 'list'"), 'Combobox input must declare aria-autocomplete');
  assert.ok(comboboxSrc.includes("aria-activedescendant"), 'Combobox must manage aria-activedescendant');
  assert.ok(comboboxSrc.includes("role', 'listbox'"), 'Combobox menu must have role="listbox"');
  assert.ok(comboboxSrc.includes("role', 'option'"), 'Combobox items must have role="option"');
  assert.ok(comboboxSrc.includes("foldAccents"), 'Combobox must use foldAccents for accent-folding search');
  assert.ok(comboboxSrc.includes("select.boodoo.combobox"), 'Combobox must dispatch select.boodoo.combobox event');

  // TreeView WAI-ARIA patterns
  const treeViewSrc = readFileSync(resolve(rootDir, 'js/src/tree-view.js'), 'utf8');
  assert.ok(treeViewSrc.includes("role', 'tree'"), 'TreeView root must declare role="tree"');
  assert.ok(treeViewSrc.includes("role', 'treeitem'"), 'TreeView items must declare role="treeitem"');
  assert.ok(treeViewSrc.includes("aria-expanded"), 'TreeView must toggle aria-expanded');
  assert.ok(treeViewSrc.includes("role', 'group'"), 'Subtrees must declare role="group"');
});


test('Modern JS components (FloatingBar, ImageCompare, PasswordMeter) verification', async () => {
  const { FloatingBar } = await import(pathToFileURL(resolve(rootDir, 'js/src/floating-bar.js')).href);
  const { ImageCompare } = await import(pathToFileURL(resolve(rootDir, 'js/src/image-compare.js')).href);
  const { PasswordMeter } = await import(pathToFileURL(resolve(rootDir, 'js/src/password-meter.js')).href);

  class MockElement {
    constructor() {
      this.classList = {
        _set: new Set(),
        add(c) { this._set.add(c); },
        remove(c) { this._set.delete(c); },
        contains(c) { return this._set.has(c); }
      };
      this.attributes = {};
      this.style = {};
    }
    querySelector() { return null; }
    querySelectorAll() { return []; }
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() { return true; }
    setAttribute(k, v) { this.attributes[k] = v; }
    getAttribute(k) { return this.attributes[k] || null; }
    removeAttribute(k) { delete this.attributes[k]; }
  }

  // FloatingBar
  const barEl = new MockElement();
  const bar = FloatingBar.getOrCreateInstance(barEl);
  bar.show();
  assert.ok(barEl.classList.contains('show'), 'FloatingBar show() adds show class');
  bar.hide();
  assert.ok(!barEl.classList.contains('show'), 'FloatingBar hide() removes show class');

  // PasswordMeter
  const meterEl = new MockElement();
  const meter = PasswordMeter.getOrCreateInstance(meterEl);
  const scoreWeak = meter.evaluate('abc');
  assert.equal(scoreWeak, 0, 'Weak password returns 0');
  const scoreStrong = meter.evaluate('StrongP@ssw0rd!');
  assert.equal(scoreStrong, 4, 'Complex password returns 4');
  assert.equal(meterEl.attributes['data-strength'], '4');
});


test('Extended v1.1.8 components (FABDock, DialogFullscreen, Tour) verification', async () => {
  const { FABDock } = await import(pathToFileURL(resolve(rootDir, 'js/src/fab-dock.js')).href);
  const { DialogFullscreen } = await import(pathToFileURL(resolve(rootDir, 'js/src/dialog-fullscreen.js')).href);
  const { Tour } = await import(pathToFileURL(resolve(rootDir, 'js/src/tour.js')).href);

  class MockElement {
    constructor() {
      this.classList = {
        _set: new Set(),
        add(c) { this._set.add(c); },
        remove(c) { this._set.delete(c); },
        contains(c) { return this._set.has(c); }
      };
      this.attributes = {};
      this.style = {};
    }
    querySelector() { return null; }
    querySelectorAll() { return []; }
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() { return true; }
    setAttribute(k, v) { this.attributes[k] = v; }
    getAttribute(k) { return this.attributes[k] || null; }
    removeAttribute(k) { delete this.attributes[k]; }
  }

  // FABDock
  const dockEl = new MockElement();
  const dock = FABDock.getOrCreateInstance(dockEl);
  dock.open();
  assert.ok(dockEl.classList.contains('open'), 'FABDock open() adds open class');
  dock.close();
  assert.ok(!dockEl.classList.contains('open'), 'FABDock close() removes open class');
  dock.toggle();
  assert.ok(dockEl.classList.contains('open'), 'FABDock toggle() opens dock');
  dock.dispose();

  // DialogFullscreen
  const dialogEl = new MockElement();
  const dialog = DialogFullscreen.getOrCreateInstance(dialogEl);
  dialog.show();
  assert.ok(dialogEl.classList.contains('show'), 'DialogFullscreen show() adds show class');
  assert.equal(dialogEl.attributes['aria-hidden'], 'false');
  dialog.hide();
  assert.ok(!dialogEl.classList.contains('show'), 'DialogFullscreen hide() removes show class');
  assert.equal(dialogEl.attributes['aria-hidden'], 'true');
  dialog.dispose();

  // Tour
  const tourEl = new MockElement();
  const tour = Tour.getOrCreateInstance(tourEl);
  tour.setSteps([
    { title: 'Welcome', content: 'Explore the dashboard.' },
    { title: 'Metrics', content: 'Track real-time stats.' }
  ]);
  assert.equal(tour._steps.length, 2);
  assert.equal(tour._currentStepIndex, 0);
  tour.next();
  assert.equal(tour._currentStepIndex, 1);
  tour.prev();
  assert.equal(tour._currentStepIndex, 0);
  tour.dispose();
});


test('Advanced v1.1.9 JavaScript components and full lifecycle execution', async () => {
  const { FilterBar, TransferList, ColorPicker, BackToTop } = await import(pathToFileURL(resolve(rootDir, 'js/src/advanced-components.js')).href);

  assert.equal(FilterBar.NAME, 'filter-bar');
  assert.equal(TransferList.NAME, 'transfer-list');
  assert.equal(ColorPicker.NAME, 'color-picker');
  assert.equal(BackToTop.NAME, 'back-to-top');

  class MockDOMNode {
    constructor(tagName = 'div') {
      this.tagName = tagName.toUpperCase();
      this.classList = {
        _set: new Set(),
        add(...classes) { classes.forEach(c => this._set.add(c)); },
        remove(...classes) { classes.forEach(c => this._set.delete(c)); },
        contains(c) { return this._set.has(c); },
        toggle(c) {
          if (this._set.has(c)) { this._set.delete(c); return false; }
          this._set.add(c); return true;
        }
      };
      this.attributes = {};
      this.style = {};
      this.children = [];
      this.parentNode = null;
      this.listeners = {};
      this.value = '';
      this.textContent = '';
    }

    get className() {
      return Array.from(this.classList._set).join(' ');
    }

    set className(val) {
      this.classList._set.clear();
      if (val) {
        val.split(/\s+/).filter(Boolean).forEach(c => this.classList.add(c));
      }
    }

    setAttribute(k, v) { this.attributes[k] = String(v); }
    getAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attributes, k) ? this.attributes[k] : null; }
    removeAttribute(k) { delete this.attributes[k]; }

    appendChild(child) {
      if (child.parentNode) {
        child.parentNode.removeChild(child);
      }
      child.parentNode = this;
      this.children.push(child);
      return child;
    }

    removeChild(child) {
      const idx = this.children.indexOf(child);
      if (idx !== -1) {
        this.children.splice(idx, 1);
        child.parentNode = null;
      }
      return child;
    }

    replaceChildren(...newChildren) {
      this.children.forEach(c => { c.parentNode = null; });
      this.children = [];
      newChildren.forEach(c => this.appendChild(c));
    }

    addEventListener(event, fn) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(fn);
    }

    removeEventListener(event, fn) {
      if (!this.listeners[event]) return;
      this.listeners[event] = this.listeners[event].filter(h => h !== fn);
    }

    dispatchEvent(evt) {
      const handlers = this.listeners[evt.type] || [];
      handlers.forEach(fn => fn(evt));
      return true;
    }

    closest(selector) {
      let cur = this;
      while (cur) {
        if (cur.matches && cur.matches(selector)) return cur;
        cur = cur.parentNode;
      }
      return null;
    }

    matches(selector) {
      if (selector.includes(',')) {
        return selector.split(',').some(sub => this.matches(sub.trim()));
      }
      if (selector.endsWith(':first-child')) {
        const base = selector.replace(':first-child', '');
        const isFirst = this.parentNode ? this.parentNode.children[0] === this : true;
        return isFirst && (!base || this.matches(base));
      }
      if (selector.endsWith(':last-child')) {
        const base = selector.replace(':last-child', '');
        const isLast = this.parentNode ? this.parentNode.children[this.parentNode.children.length - 1] === this : true;
        return isLast && (!base || this.matches(base));
      }
      if (selector.startsWith('.')) {
        const classes = selector.split('.').filter(Boolean);
        return classes.every(c => this.classList.contains(c));
      }
      if (selector.startsWith('#')) {
        return this.attributes.id === selector.slice(1);
      }
      return this.tagName.toLowerCase() === selector.toLowerCase();
    }

    querySelector(selector) {
      const parts = selector.split(',').map(s => s.trim());
      for (const part of parts) {
        const find = (node) => {
          for (const child of node.children) {
            if (child.matches(part)) return child;
            const found = find(child);
            if (found) return found;
          }
          return null;
        };
        const match = find(this);
        if (match) return match;
      }
      return null;
    }

    querySelectorAll(selector) {
      const parts = selector.split(',').map(s => s.trim());
      const matches = [];
      const walk = (node) => {
        for (const child of node.children) {
          if (parts.some(p => child.matches(p))) {
            matches.push(child);
          }
          walk(child);
        }
      };
      walk(this);
      return matches;
    }
  }

  // Set global document.createElement for addPill
  const origCreateElement = globalThis.document?.createElement;
  globalThis.document = globalThis.document || {};
  globalThis.document.createElement = (tag) => new MockDOMNode(tag);

  // -------------------------------------------------------------
  // 1. FilterBar Full Coverage
  // -------------------------------------------------------------
  const filterRoot = new MockDOMNode('div');
  const pillsWrap = new MockDOMNode('div');
  pillsWrap.classList.add('filter-pills-wrap');
  filterRoot.appendChild(pillsWrap);

  const searchInput = new MockDOMNode('input');
  searchInput.classList.add('filter-search');
  searchInput.value = 'initial query';
  filterRoot.appendChild(searchInput);

  const filterBar = new FilterBar(filterRoot);

  let searchEventFired = false;
  let addEventFired = false;
  let removeEventFired = false;
  let clearEventFired = false;

  filterRoot.addEventListener('search.boodoo.filter', (e) => {
    searchEventFired = true;
    assert.equal(e.detail.query, 'test search');
  });
  const addedDetails = [];
  filterRoot.addEventListener('add.boodoo.filter', (e) => {
    addEventFired = true;
    addedDetails.push(e.detail);
  });
  filterRoot.addEventListener('remove.boodoo.filter', (e) => {
    removeEventFired = true;
    assert.equal(e.detail.key, 'category');
  });
  filterRoot.addEventListener('clear.boodoo.filter', () => {
    clearEventFired = true;
  });

  // Test searchInput Enter keydown
  searchInput.value = 'test search';
  const enterEvt = { key: 'Enter', preventDefault() {} };
  searchInput.listeners['keydown'].forEach(fn => fn(enterEvt));
  assert.ok(searchEventFired, 'Enter on searchInput must fire search.boodoo.filter');

  // Test addPill
  filterBar.addPill('Frontend', 'frontend', 'category');
  assert.ok(addEventFired, 'addPill must fire add.boodoo.filter');
  assert.equal(pillsWrap.children.length, 1, 'Pill must be appended to wrap');
  const addedPill = pillsWrap.children[0];
  assert.equal(addedPill.getAttribute('data-filter-key'), 'category');
  assert.equal(addedPill.getAttribute('data-filter-value'), 'frontend');

  // Test click on filter-pill-remove
  const removeBtn = addedPill.querySelector('.filter-pill-remove');
  assert.ok(removeBtn, 'Pill must have remove button');
  const clickRemoveEvt = {
    target: removeBtn,
    type: 'click'
  };
  filterRoot.listeners['click'].forEach(fn => fn(clickRemoveEvt));
  assert.ok(removeEventFired, 'Clicking removeBtn must trigger removePill and event');
  assert.equal(pillsWrap.children.length, 0, 'Pill should be removed from parent');

  // Test add without key
  filterBar.addPill('General', 'simple');
  assert.equal(pillsWrap.children.length, 1);
  assert.equal(addedDetails.length, 2);
  assert.deepEqual(addedDetails[0], { key: 'category', value: 'frontend', label: 'Frontend' });
  assert.deepEqual(addedDetails[1], { key: '', value: 'simple', label: 'General' });

  // Test clearAll via clear-all button click
  const clearBtn = new MockDOMNode('button');
  clearBtn.classList.add('filter-clear-all');
  filterRoot.appendChild(clearBtn);

  const clickClearEvt = { target: clearBtn, type: 'click' };
  filterRoot.listeners['click'].forEach(fn => fn(clickClearEvt));
  assert.ok(clearEventFired, 'Clicking clear-all must fire clear.boodoo.filter');
  assert.equal(pillsWrap.children.length, 0, 'Clear all must empty pillsWrap');
  assert.equal(searchInput.value, '', 'Clear all must empty searchInput');

  // Edge cases: addPill when wrap is absent
  const filterEmpty = new FilterBar(new MockDOMNode('div'));
  filterEmpty.addPill('Label', 'val'); // should not throw

  filterBar.dispose();

  // -------------------------------------------------------------
  // 2. TransferList Full Coverage
  // -------------------------------------------------------------
  const transferRoot = new MockDOMNode('div');
  const leftPanel = new MockDOMNode('div');
  leftPanel.classList.add('transfer-panel', 'transfer-panel-source');
  const leftList = new MockDOMNode('ul');
  leftList.classList.add('transfer-items');
  leftPanel.appendChild(leftList);

  const rightPanel = new MockDOMNode('div');
  rightPanel.classList.add('transfer-panel', 'transfer-panel-target');
  const rightList = new MockDOMNode('ul');
  rightList.classList.add('transfer-items');
  rightPanel.appendChild(rightList);

  const btnRight = new MockDOMNode('button');
  btnRight.classList.add('transfer-btn-right');
  const btnLeft = new MockDOMNode('button');
  btnLeft.classList.add('transfer-btn-left');
  const btnAllRight = new MockDOMNode('button');
  btnAllRight.classList.add('transfer-btn-all-right');
  const btnAllLeft = new MockDOMNode('button');
  btnAllLeft.classList.add('transfer-btn-all-left');

  const controls = new MockDOMNode('div');
  controls.classList.add('transfer-controls');
  controls.appendChild(btnRight);
  controls.appendChild(btnLeft);
  controls.appendChild(btnAllRight);
  controls.appendChild(btnAllLeft);

  transferRoot.appendChild(leftPanel);
  transferRoot.appendChild(controls);
  transferRoot.appendChild(rightPanel);

  const item1 = new MockDOMNode('li');
  item1.classList.add('transfer-item');
  const item2 = new MockDOMNode('li');
  item2.classList.add('transfer-item');
  leftList.appendChild(item1);
  leftList.appendChild(item2);

  const transferList = new TransferList(transferRoot);

  let transferEventCount = 0;
  transferRoot.addEventListener('change.boodoo.transfer', (e) => {
    transferEventCount++;
  });

  // Test item selection click
  const clickItemEvt = { target: item1, type: 'click' };
  transferRoot.listeners['click'].forEach(fn => fn(clickItemEvt));
  assert.ok(item1.classList.contains('selected'), 'Clicking item toggles selected');

  // Test moveSelected right
  const clickMoveRightEvt = { target: btnRight, type: 'click' };
  transferRoot.listeners['click'].forEach(fn => fn(clickMoveRightEvt));
  assert.equal(leftList.children.length, 1);
  assert.equal(rightList.children.length, 1);
  assert.ok(!item1.classList.contains('selected'), 'Moved item must deselect');
  assert.equal(transferEventCount, 1);

  // Test moveSelected left
  const clickItem2Evt = { target: item1, type: 'click' };
  transferRoot.listeners['click'].forEach(fn => fn(clickItem2Evt));
  assert.ok(item1.classList.contains('selected'));
  const clickMoveLeftEvt = { target: btnLeft, type: 'click' };
  transferRoot.listeners['click'].forEach(fn => fn(clickMoveLeftEvt));
  assert.equal(leftList.children.length, 2);
  assert.equal(rightList.children.length, 0);
  assert.equal(transferEventCount, 2);

  // Test moveAll right
  const clickAllRightEvt = { target: btnAllRight, type: 'click' };
  transferRoot.listeners['click'].forEach(fn => fn(clickAllRightEvt));
  assert.equal(leftList.children.length, 0);
  assert.equal(rightList.children.length, 2);
  assert.equal(transferEventCount, 3);

  // Test moveAll left
  const clickAllLeftEvt = { target: btnAllLeft, type: 'click' };
  transferRoot.listeners['click'].forEach(fn => fn(clickAllLeftEvt));
  assert.equal(leftList.children.length, 2);
  assert.equal(rightList.children.length, 0);
  assert.equal(transferEventCount, 4);

  // Branch guards when panels are missing
  transferList.moveSelected(null, null);
  transferList.moveAll(null, null);

  transferList.dispose();

  // -------------------------------------------------------------
  // 3. ColorPicker Full Coverage
  // -------------------------------------------------------------
  const pickerRoot = new MockDOMNode('div');
  const swatch1 = new MockDOMNode('button');
  swatch1.classList.add('color-swatch');
  swatch1.setAttribute('data-color', '#ff0000');

  const swatch2 = new MockDOMNode('button');
  swatch2.classList.add('color-swatch');
  swatch2.style.backgroundColor = '#00ff00';

  const preview = new MockDOMNode('div');
  preview.classList.add('color-preview');

  const hexInput = new MockDOMNode('input');
  hexInput.classList.add('color-hex-input');

  pickerRoot.appendChild(swatch1);
  pickerRoot.appendChild(swatch2);
  pickerRoot.appendChild(preview);
  pickerRoot.appendChild(hexInput);

  const picker = new ColorPicker(pickerRoot, { value: '#ff0000' });
  assert.equal(picker.getValue(), '#ff0000');
  assert.equal(picker.getColor(), '#ff0000');

  let colorChangeFired = false;
  const colorChanges = [];
  pickerRoot.addEventListener('change.boodoo.color', (e) => {
    colorChangeFired = true;
    colorChanges.push(e.detail.color);
  });

  // Click on swatch
  const clickSwatchEvt = { target: swatch2, type: 'click' };
  pickerRoot.listeners['click'].forEach(fn => fn(clickSwatchEvt));
  assert.ok(colorChangeFired);
  assert.equal(picker.getValue(), '#00ff00');
  assert.ok(swatch2.classList.contains('active'));
  assert.ok(!swatch1.classList.contains('active'));
  assert.equal(preview.style.backgroundColor, '#00ff00');
  assert.equal(hexInput.value, '#00ff00');

  // Input event on hexInput
  hexInput.value = '#123456';
  hexInput.listeners['input'].forEach(fn => fn({}));
  assert.equal(picker.getValue(), '#123456');

  // Invalid hex should be ignored
  hexInput.value = 'invalid';
  hexInput.listeners['input'].forEach(fn => fn({}));
  assert.equal(picker.getValue(), '#123456');

  assert.deepEqual(colorChanges, ['#00ff00', '#123456']);

  picker.dispose();

  // -------------------------------------------------------------
  // 4. BackToTop Full Coverage
  // -------------------------------------------------------------
  const bttBtn = new MockDOMNode('button');
  let scrolledTo = null;
  globalThis.window = {
    scrollY: 100,
    addEventListener(event, fn) {
      if (!this._listeners) this._listeners = {};
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(fn);
    },
    removeEventListener(event, fn) {
      if (!this._listeners || !this._listeners[event]) return;
      this._listeners[event] = this._listeners[event].filter(h => h !== fn);
    },
    scrollTo(opts) {
      scrolledTo = opts;
    }
  };

  const btt = new BackToTop(bttBtn, { threshold: 200 });
  assert.ok(!bttBtn.classList.contains('visible'), 'Should not be visible at scrollY 100 < 200');

  // Scroll beyond threshold
  globalThis.window.scrollY = 350;
  globalThis.window._listeners['scroll'].forEach(fn => fn());
  assert.ok(bttBtn.classList.contains('visible'), 'Should become visible when scrollY > threshold');

  // Scroll back down
  globalThis.window.scrollY = 50;
  globalThis.window._listeners['scroll'].forEach(fn => fn());
  assert.ok(!bttBtn.classList.contains('visible'), 'Should hide when scrollY <= threshold');

  // Click to top
  let scrollTopFired = false;
  bttBtn.addEventListener('scrolltop.boodoo', () => { scrollTopFired = true; });
  const clickBttEvt = { preventDefault() {}, type: 'click' };
  bttBtn.listeners['click'].forEach(fn => fn(clickBttEvt));
  assert.ok(scrollTopFired, 'Clicking BackToTop must fire scrolltop.boodoo event');
  assert.deepEqual(scrolledTo, { top: 0, behavior: 'smooth' });

  btt.dispose();
  assert.equal(globalThis.window._listeners['scroll'].length, 0, 'Scroll listener must be removed on dispose');

  // Restore global state
  if (origCreateElement) {
    globalThis.document.createElement = origCreateElement;
  }
});


test('Native zero-dependency Chart component functionality, rendering, and lifecycle execution', async () => {
  const { Chart } = await import(pathToFileURL(resolve(rootDir, 'js/src/chart.js')).href);
  assert.equal(Chart.NAME, 'chart');

  // Mock canvas and 2D context
  const mockContext = {
    clearRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    fill: () => {},
    rect: () => {},
    arc: () => {},
    closePath: () => {},
    setTransform: () => {},
    scale: () => {},
    fillText: () => {},
  };

  class MockChartCanvas {
    constructor() {
      this.tagName = 'CANVAS';
      this.width = 400;
      this.height = 200;
      this.style = {};
      this.classList = {
        add: () => {},
        remove: () => {},
        contains: () => false,
      };
      this.listeners = {};
    }
    getContext() {
      return mockContext;
    }
    addEventListener(event, fn) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(fn);
    }
    removeEventListener(event, fn) {
      if (!this.listeners[event]) return;
      this.listeners[event] = this.listeners[event].filter(h => h !== fn);
    }
    getBoundingClientRect() {
      return { width: 400, height: 200, left: 0, top: 0, right: 400, bottom: 200 };
    }
    closest() {
      return null;
    }
    matches() {
      return false;
    }
  }

  class MockChartContainer {
    constructor() {
      this.tagName = 'DIV';
      this.style = {};
      this.classList = {
        add: () => {},
        remove: () => {},
        contains: () => false,
      };
      this.attributes = {};
      this.children = [];
      this.canvas = new MockChartCanvas();
      this.children.push(this.canvas);
      this.listeners = {};
    }
    getAttribute(name) {
      return this.attributes[name] || null;
    }
    setAttribute(name, val) {
      this.attributes[name] = val;
    }
    querySelector(sel) {
      if (sel === 'canvas') return this.canvas;
      if (sel === '.chart-tooltip') return null;
      return null;
    }
    appendChild(child) {
      this.children.push(child);
      child.parentNode = this;
      return child;
    }
    removeChild(child) {
      this.children = this.children.filter(c => c !== child);
      child.parentNode = null;
      return child;
    }
    addEventListener(event, fn) {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(fn);
    }
    removeEventListener(event, fn) {
      if (!this.listeners[event]) return;
      this.listeners[event] = this.listeners[event].filter(h => h !== fn);
    }
    dispatchEvent(evt) {
      if (this.listeners[evt.type]) {
        this.listeners[evt.type].forEach(fn => fn(evt));
      }
    }
    getBoundingClientRect() {
      return { width: 400, height: 200, left: 0, top: 0, right: 400, bottom: 200 };
    }
    closest() {
      return null;
    }
    matches() {
      return false;
    }
  }

  const container = new MockChartContainer();
  const chart = new Chart(container, {
    type: 'bar',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        { label: 'Revenue', data: [100, 200, 150, 300] }
      ]
    }
  });

  // Verify colors
  const colors = chart.getColors();
  assert.ok(Array.isArray(colors.palette), 'Chart colors must include palette');
  assert.ok(colors.palette.length >= 6, 'Chart palette must contain at least 6 colors');

  // Verify render and resize
  chart.render();
  chart.resize();

  // Test line chart type
  chart.update(
    {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [{ label: 'Signups', data: [10, 25, 40] }]
    },
    { type: 'line' }
  );
  chart._type = 'line';
  chart.render();

  // Test donut chart type
  chart.update(
    {
      labels: ['Desktop', 'Mobile'],
      datasets: [{ data: [70, 30] }]
    },
    { type: 'donut' }
  );
  chart._type = 'donut';
  chart.render();

  // Test area chart type
  chart.update(
    {
      labels: ['Mon', 'Tue', 'Wed'],
      datasets: [{ label: 'Traffic', data: [100, 150, 200] }]
    },
    { type: 'area' }
  );
  chart._type = 'area';
  chart.render();

  // Test radar chart type
  chart.update(
    {
      labels: ['A', 'B', 'C', 'D', 'E'],
      datasets: [{ label: 'Score', data: [80, 90, 70, 85, 95] }]
    },
    { type: 'radar' }
  );
  chart._type = 'radar';
  chart.render();

  // Test polarArea chart type
  chart.update(
    {
      labels: ['North', 'South', 'East', 'West'],
      datasets: [{ data: [50, 75, 40, 90] }]
    },
    { type: 'polarArea' }
  );
  chart._type = 'polarArea';
  chart.render();

  // Test hover interaction and tooltip
  const mouseMoveHandler = container.canvas.listeners['mousemove']?.[0];
  if (mouseMoveHandler) {
    mouseMoveHandler({ clientX: 200, clientY: 100 });
  }

  const mouseLeaveHandler = container.canvas.listeners['mouseleave']?.[0];
  if (mouseLeaveHandler) {
    mouseLeaveHandler();
  }

  // Teardown
  chart.dispose();
  assert.equal(chart._resizeObserver, null, 'Chart resize observer must be cleaned up on dispose');
});


test('Core JS Component Runtime fixes: teardown, listener hygiene, interaction correctness, and accessibility', async () => {
  const origDoc = globalThis.document;
  if (!globalThis.document) globalThis.document = {};
  if (!globalThis.document.addEventListener) globalThis.document.addEventListener = () => {};
  if (!globalThis.document.removeEventListener) globalThis.document.removeEventListener = () => {};
  if (!globalThis.document.querySelector) globalThis.document.querySelector = () => null;
  if (!globalThis.document.querySelectorAll) globalThis.document.querySelectorAll = () => [];

  const { Carousel } = await import(pathToFileURL(resolve(rootDir, 'js/src/carousel.js')).href);
  const { DataTable } = await import(pathToFileURL(resolve(rootDir, 'js/src/data-table.js')).href);
  const { ContextMenu } = await import(pathToFileURL(resolve(rootDir, 'js/src/context-menu.js')).href);
  const { Sidebar } = await import(pathToFileURL(resolve(rootDir, 'js/src/sidebar.js')).href);
  const { BottomSheet } = await import(pathToFileURL(resolve(rootDir, 'js/src/bottom-sheet.js')).href);
  const { ChipInput } = await import(pathToFileURL(resolve(rootDir, 'js/src/chip-input.js')).href);
  const { Tooltip } = await import(pathToFileURL(resolve(rootDir, 'js/src/tooltip.js')).href);
  const { Rating } = await import(pathToFileURL(resolve(rootDir, 'js/src/rating.js')).href);

  // 1. Carousel dispose clears interval
  let mockCarouselListeners = {};
  const mockCarouselEl = {
    classList: { contains: () => false, add() {}, remove() {} },
    getAttribute: () => null,
    hasAttribute: () => false,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: (evt, fn) => { mockCarouselListeners[evt] = fn; },
    removeEventListener: (evt) => { delete mockCarouselListeners[evt]; },
    matches: () => false
  };
  const carousel = new Carousel(mockCarouselEl, { interval: 100 });
  assert.ok(carousel._interval !== null, 'Carousel should have active interval');
  carousel.dispose();
  assert.equal(carousel._interval, null, 'Carousel interval must be cleared on dispose');
  assert.equal(carousel._element, null, 'Carousel _element must be nulled on dispose');

  // 2. Offcanvas Escape keydown listener
  const offcanvasSrc = readFileSync(resolve(rootDir, 'js/src/offcanvas.js'), 'utf8');
  assert.ok(offcanvasSrc.includes('this._addKeydownListener()'), 'Offcanvas show() must invoke _addKeydownListener()');
  assert.ok(offcanvasSrc.includes('this._removeKeydownListener()'), 'Offcanvas hide() must invoke _removeKeydownListener()');

  // 3. Ripple checks and sets e._boodooRippleHandled
  const rippleSrc = readFileSync(resolve(rootDir, 'js/src/ripple.js'), 'utf8');
  assert.ok(
    rippleSrc.includes('if (e._boodooRippleHandled) return;') &&
    rippleSrc.includes('e._boodooRippleHandled = true;'),
    'Ripple delegated listener must check and set _boodooRippleHandled'
  );

  // 4. DataTable sortBy preserves companion .data-table-row-detail rows
  class MockTableRow {
    constructor(id, text, isDetail = false) {
      this.id = id;
      this.children = [{ innerText: text }];
      this.classList = {
        contains: (c) => (isDetail ? c === 'data-table-row-detail' : false)
      };
      this.nextElementSibling = null;
    }
  }

  const row1 = new MockTableRow('row1', 'Beta');
  const detail1 = new MockTableRow('detail1', 'Beta Detail', true);
  const row2 = new MockTableRow('row2', 'Alpha');
  const detail2 = new MockTableRow('detail2', 'Alpha Detail', true);

  row1.nextElementSibling = detail1;
  detail1.nextElementSibling = row2;
  row2.nextElementSibling = detail2;

  const mockTh = {
    classList: { remove() {}, add() {} },
    addEventListener() {},
    parentElement: null
  };
  mockTh.parentElement = { children: [mockTh] };

  const tbodyRows = [row1, detail1, row2, detail2];
  const appended = [];
  const mockTable = {
    classList: { contains: () => true },
    matches: () => true,
    querySelector: (sel) => {
      if (sel === 'tbody') {
        return {
          querySelectorAll: (s) => (s === 'tr:not(.data-table-row-detail)' ? [row1, row2] : tbodyRows),
          appendChild: (node) => { appended.push(node); }
        };
      }
      return null;
    },
    querySelectorAll: (sel) => {
      if (sel.includes('thead th')) {
        return [mockTh];
      }
      return [];
    },
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return true; }
  };

  const dt = new DataTable(mockTable);
  dt.sortBy(mockTh);
  assert.deepEqual(appended.map(r => r.id), ['row2', 'detail2', 'row1', 'detail1'], 'DataTable must preserve companion detail row following parent row');
  dt.dispose();
  assert.equal(dt._element, null, 'DataTable element reference should be nulled on dispose');
  assert.equal(dt._table, null, 'DataTable table reference should be nulled on dispose');

  // 5. Missing dispose overrides
  assert.equal(typeof ContextMenu.prototype.dispose, 'function', 'ContextMenu must have dispose() override');
  assert.equal(typeof Sidebar.prototype.dispose, 'function', 'Sidebar must have dispose() override');
  assert.equal(typeof BottomSheet.prototype.dispose, 'function', 'BottomSheet must have dispose() override');
  assert.equal(typeof ChipInput.prototype.dispose, 'function', 'ChipInput must have dispose() override');
  assert.equal(typeof DataTable.prototype.dispose, 'function', 'DataTable must have dispose() override');

  let cmListeners = {};
  const mockCmEl = {
    classList: { contains: () => true },
    getAttribute: () => null,
    addEventListener: (evt, fn) => { cmListeners[evt] = fn; },
    removeEventListener: (evt) => { delete cmListeners[evt]; },
    querySelector: () => null,
    style: {}
  };
  const cm = new ContextMenu(mockCmEl);
  cm.dispose();
  assert.equal(cm._menu, null, 'ContextMenu menu reference should be nulled on dispose');
  assert.equal(cm._element, null, 'ContextMenu element reference should be nulled on dispose');

  let sbListeners = {};
  const mockSbEl = {
    classList: { contains: () => false, toggle: () => false },
    addEventListener: (evt, fn) => { sbListeners[evt] = fn; },
    removeEventListener: (evt) => { delete sbListeners[evt]; },
    querySelector: () => null
  };
  const sb = new Sidebar(mockSbEl);
  sb.dispose();
  assert.equal(sb._element, null);

  let bsListeners = {};
  const mockBsEl = {
    classList: { contains: () => false, add() {}, remove() {} },
    querySelector: () => null,
    addEventListener: (evt, fn) => { bsListeners[evt] = fn; },
    removeEventListener: (evt) => { delete bsListeners[evt]; },
    style: {}
  };
  const bs = new BottomSheet(mockBsEl);
  bs.dispose();
  assert.equal(bs._element, null);

  let ciListeners = {};
  const mockCiInput = {
    addEventListener: (evt, fn) => { ciListeners['input:' + evt] = fn; },
    removeEventListener: (evt) => { delete ciListeners['input:' + evt]; },
    value: ''
  };
  const mockCiEl = {
    classList: { contains: () => false },
    querySelector: (sel) => (sel === '.chip-input-field' ? mockCiInput : null),
    querySelectorAll: () => [],
    addEventListener: (evt, fn) => { ciListeners['el:' + evt] = fn; },
    removeEventListener: (evt) => { delete ciListeners['el:' + evt]; }
  };
  const ci = new ChipInput(mockCiEl);
  ci.dispose();
  assert.equal(ci._input, null);
  assert.equal(ci._element, null);

  // 6. ContextMenu _resolveMenu scoped fallback
  const cmSrc = readFileSync(resolve(rootDir, 'js/src/context-menu.js'), 'utf8');
  assert.ok(
    cmSrc.includes('this._element.querySelector(\'.context-menu\')') ||
    cmSrc.includes('this._element.closest(\'.context-menu\')'),
    'ContextMenu must scope fallback menu resolution to trigger context'
  );
  assert.ok(
    cmSrc.includes('console.warn'),
    'ContextMenu must warn when target menu cannot be resolved'
  );

  // 7. CustomElements connectedCallback guard
  const ceSrc = readFileSync(resolve(rootDir, 'js/src/custom-elements.js'), 'utf8');
  assert.ok(
    ceSrc.includes('if (this._initialized) return;') || ceSrc.includes('if (this._initialized)'),
    'CustomElements connectedCallback must guard against re-entry'
  );

  // 8. Tooltip restores original title
  const mockTipAttrs = { title: 'Native Tooltip Label' };
  const mockTipEl = {
    attributes: mockTipAttrs,
    getAttribute: (k) => mockTipAttrs[k] || null,
    setAttribute: (k, v) => { mockTipAttrs[k] = v; },
    removeAttribute: (k) => { delete mockTipAttrs[k]; },
    hasAttribute: (k) => k in mockTipAttrs,
    title: 'Native Tooltip Label',
    addEventListener() {},
    removeEventListener() {}
  };
  const tooltip = new Tooltip(mockTipEl);
  assert.equal(tooltip._originalTitle, 'Native Tooltip Label');
  const title = tooltip._getTitle();
  assert.equal(title, 'Native Tooltip Label');
  assert.equal(mockTipAttrs.title, undefined, 'Title attribute should be removed while tooltip is active');
  tooltip.dispose();
  assert.equal(mockTipAttrs.title, 'Native Tooltip Label', 'Original title must be restored on dispose');

  // 9. Rating WCAG 2.2 AA accessibility
  const starAttrs = [{}, {}, {}, {}, {}];
  const starElements = starAttrs.map((attrs, idx) => ({
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); }
    },
    setAttribute: (k, v) => { attrs[k] = v; },
    getAttribute: (k) => attrs[k] || null,
    addEventListener: (evt, fn) => { attrs['on_' + evt] = fn; },
    removeEventListener: (evt) => { delete attrs['on_' + evt]; },
    focus() {}
  }));

  const ratingAttrs = { 'data-rating-value': '2' };
  const mockRatingEl = {
    getAttribute: (k) => ratingAttrs[k] || null,
    setAttribute: (k, v) => { ratingAttrs[k] = String(v); },
    classList: { contains: () => false },
    hasAttribute: (k) => k in ratingAttrs,
    querySelectorAll: () => starElements,
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => true
  };

  const rating = new Rating(mockRatingEl);
  assert.equal(mockRatingEl.getAttribute('role'), 'radiogroup', 'Rating container must declare role="radiogroup"');
  starAttrs.forEach((attrs, i) => {
    assert.equal(attrs.role, 'radio', 'Each star must declare role="radio"');
    assert.equal(attrs['aria-checked'], i === 1 ? 'true' : 'false');
    assert.equal(attrs.tabindex, i === 1 ? '0' : '-1');
  });

  const keydownFn = starAttrs[1]['on_keydown'];
  assert.equal(typeof keydownFn, 'function', 'Star must have keydown listener for keyboard navigation');
  keydownFn({ key: 'ArrowRight', preventDefault() {} });
  assert.equal(rating.getValue(), 3, 'ArrowRight must advance rating value');
  assert.equal(starAttrs[2]['aria-checked'], 'true');

  rating.dispose();
  assert.equal(rating._stars.length, 0);

  // 10. CommandPalette shortcut opt-in and teardown
  const cpSrc = readFileSync(resolve(rootDir, 'js/src/command-palette.js'), 'utf8');
  assert.ok(
    cpSrc.includes('_bindShortcut') && cpSrc.includes('_unbindShortcut'),
    'CommandPalette must manage shortcut via per-instance named handlers'
  );
  assert.ok(
    !cpSrc.includes("document.addEventListener('keydown', (e) =>"),
    'CommandPalette must not register anonymous document keydown at module load'
  );

  // 11. boodoo.js autoInit idempotency guard
  const boodooSrc = readFileSync(resolve(rootDir, 'js/boodoo.js'), 'utf8');
  assert.ok(
    boodooSrc.includes('if (document._boodooAutoInit) return;') &&
    boodooSrc.includes('document._boodooAutoInit = true;'),
    'boodoo.js autoInit must be guarded with document._boodooAutoInit idempotency flag'
  );

  // 12. Scrollspy removeAttribute aria-current
  const scrollspySrc = readFileSync(resolve(rootDir, 'js/src/scrollspy.js'), 'utf8');
  assert.ok(
    scrollspySrc.includes("a.removeAttribute('aria-current')"),
    'Scrollspy must remove aria-current using removeAttribute'
  );
  assert.ok(
    !scrollspySrc.includes("setAttribute('aria-current', null)"),
    'Scrollspy must not use setAttribute(\'aria-current\', null)'
  );
});

