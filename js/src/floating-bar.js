// =====================================================================
// BOODOO JS — Floating Action Bar
// Controls the display and dismissal of contextual floating action bars.
// =====================================================================

import { BaseComponent } from './base-component.js';
import { triggerEvent } from './util.js';

export class FloatingBar extends BaseComponent {
  static get NAME() {
    return 'floatingBar';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._countSpan = this._element.querySelector('.floating-bar-count');
    this._dismissBtn = this._element.querySelector('[data-boodoo-dismiss="floating-bar"]');

    if (this._dismissBtn) {
      this._dismissBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.hide();
      });
    }
  }

  show(count) {
    if (count !== undefined && this._countSpan) {
      this._countSpan.textContent = String(count);
    }
    this._element.classList.add('show');
    triggerEvent(this._element, 'boodoo.floatingbar.show', { count });
  }

  hide() {
    this._element.classList.remove('show');
    triggerEvent(this._element, 'boodoo.floatingbar.hide');
  }

  toggle() {
    if (this._element.classList.contains('show')) {
      this.hide();
    } else {
      this.show();
    }
  }

  setCount(count) {
    if (this._countSpan) {
      this._countSpan.textContent = String(count);
    }
    if (count > 0 && !this._element.classList.contains('show')) {
      this.show();
    } else if (count === 0 && this._element.classList.contains('show')) {
      this.hide();
    }
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.floating-bar, [data-boodoo="floating-bar"]').forEach((el) => {
      FloatingBar.getOrCreateInstance(el);
    });
  });
}
