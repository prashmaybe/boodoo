// =====================================================================
// BOODOO — Icon Component Primitive
// Framework-agnostic SVG icon renderer for Haticons & SVG symbols
// =====================================================================

import { escapeHtml } from './util.js';

export class Icon {
  static render(name, options = {}) {
    if (!name) return '';
    const size = options.size || 20;
    const className = options.className || '';
    const ariaLabel = options.label ? ` aria-label="${escapeHtml(options.label)}"` : ' aria-hidden="true"';
    const role = options.label ? 'role="img"' : '';

    return `<span class="boodoo-icon-wrapper ${escapeHtml(className)}"${ariaLabel} ${role} style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;"><i class="hi hi-${escapeHtml(name)}"></i></span>`;
  }

  constructor(element, options = {}) {
    this._element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this._element) return;

    this._name = options.name || this._element.getAttribute('data-icon') || '';
    this._size = options.size || parseInt(this._element.getAttribute('data-size') || '20', 10);
    this._label = options.label || this._element.getAttribute('aria-label') || '';

    this._init();
  }

  _init() {
    if (this._name) {
      this._element.innerHTML = Icon.render(this._name, {
        size: this._size,
        label: this._label,
      });
    }
  }

  setName(name) {
    this._name = name;
    this._init();
  }

  dispose() {
    if (this._element) {
      this._element.innerHTML = '';
    }
  }
}
