// =====================================================================
// BOODOO JS — Fullscreen Dialog Component
// Handles mobile & desktop modal full-screen immersive viewports.
// =====================================================================

import { BaseComponent } from './base-component.js';
import { triggerEvent } from './util.js';

export class DialogFullscreen extends BaseComponent {
  static get NAME() {
    return 'dialogFullscreen';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._isOpen = this._element.classList.contains('show');
    this._closeButtons = this._element.querySelectorAll('[data-boodoo-dismiss="dialog-fullscreen"], .btn-close');
    this._onKeyDown = this._onKeyDown.bind(this);

    this._bindEvents();
  }

  _bindEvents() {
    this._closeButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.hide();
      });
    });

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this._onKeyDown);
    }
  }

  _onKeyDown(e) {
    if (e.key === 'Escape' && this._isOpen) {
      e.preventDefault();
      this.hide();
    }
  }

  show() {
    if (this._isOpen) return;
    this._isOpen = true;
    this._element.classList.add('show');
    this._element.setAttribute('aria-hidden', 'false');
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = 'hidden';
    }
    triggerEvent(this._element, 'boodoo.shown.dialogfullscreen');
  }

  hide() {
    if (!this._isOpen) return;
    this._isOpen = false;
    this._element.classList.remove('show');
    this._element.setAttribute('aria-hidden', 'true');
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = '';
    }
    triggerEvent(this._element, 'boodoo.hidden.dialogfullscreen');
  }

  toggle() {
    if (this._isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  dispose() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this._onKeyDown);
      if (this._isOpen && document.body) {
        document.body.style.overflow = '';
      }
    }
    super.dispose();
  }
}
