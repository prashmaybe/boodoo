// =====================================================================
// BOODOO JS — Advanced Suite Components (v1.1.9)
// Includes: FilterBar, TransferList, ColorPicker, BackToTop
// =====================================================================

import { BaseComponent } from './base-component.js';
import { triggerEvent } from './util.js';

/**
 * FilterBar Component
 * Manages search keywords and filter tags/pills with add/remove events.
 */
export class FilterBar extends BaseComponent {
  static get NAME() {
    return 'filter-bar';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._pills = [];
    this._initEvents();
  }

  _initEvents() {
    if (!this._element) return;

    this._element.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.filter-pill-remove');
      if (removeBtn) {
        const pill = removeBtn.closest('.filter-pill');
        if (pill) {
          const key = pill.getAttribute('data-filter-key') || '';
          const value = pill.getAttribute('data-filter-value') || '';
          this.removePill(key, value, pill);
        }
      }

      const clearAll = e.target.closest('.filter-clear-all');
      if (clearAll) {
        this.clearAll();
      }
    });

    const searchInput = this._element.querySelector('.filter-search');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = searchInput.value.trim();
          if (val) {
            triggerEvent(this._element, 'search.boodoo.filter', { query: val });
          }
        }
      });
    }
  }

  addPill(label, value, key = '') {
    const wrap = this._element.querySelector('.filter-pills-wrap');
    if (!wrap) return;

    const pill = document.createElement('span');
    pill.className = 'filter-pill';
    if (key) pill.setAttribute('data-filter-key', key);
    if (value) pill.setAttribute('data-filter-value', value);

    const labelSpan = document.createElement('span');
    labelSpan.className = 'filter-pill-label';
    labelSpan.textContent = key ? `${key}:` : '';

    const valSpan = document.createElement('span');
    valSpan.textContent = ` ${value}`;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'filter-pill-remove';
    removeBtn.setAttribute('aria-label', `Remove ${label || value}`);
    removeBtn.textContent = '×';

    pill.appendChild(labelSpan);
    pill.appendChild(valSpan);
    pill.appendChild(removeBtn);

    wrap.appendChild(pill);
    triggerEvent(this._element, 'add.boodoo.filter', { key, value, label });
  }

  removePill(key, value, pillElement) {
    if (pillElement && pillElement.parentNode) {
      pillElement.parentNode.removeChild(pillElement);
    }
    triggerEvent(this._element, 'remove.boodoo.filter', { key, value });
  }

  clearAll() {
    const wrap = this._element.querySelector('.filter-pills-wrap');
    if (wrap) {
      wrap.replaceChildren();
    }
    const searchInput = this._element.querySelector('.filter-search');
    if (searchInput) {
      searchInput.value = '';
    }
    triggerEvent(this._element, 'clear.boodoo.filter');
  }
}

/**
 * TransferList Component
 * Dual-column item selection and movement.
 */
export class TransferList extends BaseComponent {
  static get NAME() {
    return 'transfer-list';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._leftPanel = this._element.querySelector('.transfer-panel-source, .transfer-panel:first-child');
    this._rightPanel = this._element.querySelector('.transfer-panel-target, .transfer-panel:last-child');
    this._initEvents();
  }

  _initEvents() {
    if (!this._element) return;

    this._element.addEventListener('click', (e) => {
      const item = e.target.closest('.transfer-item');
      if (item) {
        item.classList.toggle('selected');
        return;
      }

      const moveRight = e.target.closest('.transfer-btn-right');
      if (moveRight) {
        this.moveSelected(this._leftPanel, this._rightPanel);
        return;
      }

      const moveLeft = e.target.closest('.transfer-btn-left');
      if (moveLeft) {
        this.moveSelected(this._rightPanel, this._leftPanel);
        return;
      }

      const moveAllRight = e.target.closest('.transfer-btn-all-right');
      if (moveAllRight) {
        this.moveAll(this._leftPanel, this._rightPanel);
        return;
      }

      const moveAllLeft = e.target.closest('.transfer-btn-all-left');
      if (moveAllLeft) {
        this.moveAll(this._rightPanel, this._leftPanel);
        return;
      }
    });
  }

  moveSelected(sourcePanel, targetPanel) {
    if (!sourcePanel || !targetPanel) return;
    const sourceList = sourcePanel.querySelector('.transfer-items');
    const targetList = targetPanel.querySelector('.transfer-items');
    if (!sourceList || !targetList) return;

    const selectedItems = Array.from(sourceList.querySelectorAll('.transfer-item.selected'));
    selectedItems.forEach((item) => {
      item.classList.remove('selected');
      targetList.appendChild(item);
    });

    if (selectedItems.length) {
      triggerEvent(this._element, 'change.boodoo.transfer', { moved: selectedItems.length });
    }
  }

  moveAll(sourcePanel, targetPanel) {
    if (!sourcePanel || !targetPanel) return;
    const sourceList = sourcePanel.querySelector('.transfer-items');
    const targetList = targetPanel.querySelector('.transfer-items');
    if (!sourceList || !targetList) return;

    const items = Array.from(sourceList.querySelectorAll('.transfer-item'));
    items.forEach((item) => {
      item.classList.remove('selected');
      targetList.appendChild(item);
    });

    if (items.length) {
      triggerEvent(this._element, 'change.boodoo.transfer', { moved: items.length });
    }
  }
}

/**
 * ColorPicker Component
 * Swatch selection and hex input bindings.
 */
export class ColorPicker extends BaseComponent {
  static get NAME() {
    return 'color-picker';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._value = config.value || '#7c3aed';
    this._initEvents();
  }

  _initEvents() {
    if (!this._element) return;

    this._element.addEventListener('click', (e) => {
      const swatch = e.target.closest('.color-swatch');
      if (swatch) {
        const color = swatch.getAttribute('data-color') || swatch.style.backgroundColor;
        if (color) {
          this.setValue(color);
        }
      }
    });

    const hexInput = this._element.querySelector('.color-hex-input');
    if (hexInput) {
      hexInput.addEventListener('input', () => {
        const val = hexInput.value.trim();
        if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val)) {
          this.setValue(val, false);
        }
      });
    }
  }

  setValue(color, updateInput = true) {
    this._value = color;

    const swatches = this._element.querySelectorAll('.color-swatch');
    swatches.forEach((s) => {
      const c = s.getAttribute('data-color') || s.style.backgroundColor;
      if (c && c.toLowerCase() === color.toLowerCase()) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    const preview = this._element.querySelector('.color-preview');
    if (preview) {
      preview.style.backgroundColor = color;
    }

    if (updateInput) {
      const hexInput = this._element.querySelector('.color-hex-input');
      if (hexInput) hexInput.value = color;
    }

    triggerEvent(this._element, 'change.boodoo.color', { color });
  }

  getValue() {
    return this._value;
  }

  setColor(color) {
    this.setValue(color);
  }

  getColor() {
    return this.getValue();
  }
}

/**
 * BackToTop Component
 * Smooth floating button revealed on window scroll.
 */
export class BackToTop extends BaseComponent {
  static get NAME() {
    return 'back-to-top';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._threshold = config.threshold || 250;
    this._onScroll = this._onScroll.bind(this);
    this._onClick = this._onClick.bind(this);
    this._init();
  }

  _init() {
    if (typeof window === 'undefined') return;
    window.addEventListener('scroll', this._onScroll, { passive: true });
    if (this._element) {
      this._element.addEventListener('click', this._onClick);
    }
    this._onScroll();
  }

  _onScroll() {
    if (typeof window === 'undefined' || !this._element) return;
    if (window.scrollY > this._threshold) {
      this._element.classList.add('visible');
    } else {
      this._element.classList.remove('visible');
    }
  }

  _onClick(e) {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      triggerEvent(this._element, 'scrolltop.boodoo');
    }
  }

  dispose() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this._onScroll);
    }
    if (this._element) {
      this._element.removeEventListener('click', this._onClick);
    }
    super.dispose();
  }
}
