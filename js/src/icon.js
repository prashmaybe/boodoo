// =====================================================================
// BOODOO — Icon Component Primitive
// Framework-agnostic SVG icon renderer for Haticons & SVG symbols
// =====================================================================

import { escapeHtml } from './util.js';

// Safe pattern for icon names and class names (alphanumeric, dashes, underscores, spaces)
const SAFE_NAME_PATTERN = /^[a-zA-Z0-9_-]+$/;
const sanitizeIconName = (name) => {
  const str = String(name || '').trim();
  return SAFE_NAME_PATTERN.test(str) ? str : '';
};

export class Icon {
  static render(name, options = {}) {
    const safeName = sanitizeIconName(name);
    if (!safeName) return '';
    const size = Number.isFinite(options.size) ? Math.max(0, options.size) : 20;
    const className = options.className ? ` ${escapeHtml(options.className)}` : '';
    const ariaLabel = options.label
      ? ` aria-label="${escapeHtml(options.label)}"`
      : ' aria-hidden="true"';
    const role = options.label ? ' role="img"' : '';

    return `<span class="boodoo-icon-wrapper${className}"${ariaLabel}${role} style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;"><i class="hi hi-${safeName}"></i></span>`;
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
    if (this._name && this._element) {
      const safeName = sanitizeIconName(this._name);
      if (!safeName) {
        this._element.replaceChildren();
        return;
      }
      const size = Number.isFinite(this._size) ? Math.max(0, this._size) : 20;
      const span = document.createElement('span');
      span.className = 'boodoo-icon-wrapper';
      span.style.cssText = `display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;`;
      if (this._label) {
        span.setAttribute('aria-label', this._label);
        span.setAttribute('role', 'img');
      } else {
        span.setAttribute('aria-hidden', 'true');
      }
      const icon = document.createElement('i');
      icon.className = `hi hi-${safeName}`;
      span.appendChild(icon);

      this._element.replaceChildren(span);
    }
  }

  setName(name) {
    this._name = name;
    this._init();
  }

  dispose() {
    if (this._element) {
      this._element.replaceChildren();
    }
  }
}

