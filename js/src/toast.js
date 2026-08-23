// BOODOO — Toast
// Auto-dismiss toast notifications.

import { BaseComponent } from './base-component.js';
import { triggerEvent, getTransitionDuration, emulateTransitionEnd } from './util.js';

export class Toast extends BaseComponent {
  static get NAME() { return 'toast'; }

  static get selector() { return '.toast'; }

  constructor(target, config = {}) {
    super(target, config);
    this._config = this._getConfig(config, { delay: 5000, autohide: true });
    if (target.hasAttribute('data-boodoo-delay')) {
      this._config.delay = Number(target.getAttribute('data-boodoo-delay')) || 5000;
    }
    if (target.hasAttribute('data-boodoo-autohide') && target.getAttribute('data-boodoo-autohide') === 'false') {
      this._config.autohide = false;
    }
    this._timeout = null;
  }

  static showToast(el) {
    const toast = Toast.getOrCreateInstance(el);
    toast.show();
  }

  show() {
    const el = this._element;
    if (this._isShown) return;
    el.classList.remove('hide');
    el.classList.add('showing');
    triggerEvent(el, 'boodoo.show.toast');

    setTimeout(() => {
      el.classList.remove('showing');
      el.classList.add('show');
      this._isShown = true;
      triggerEvent(el, 'boodoo.shown.toast');

      if (this._config.autohide) {
        this._scheduleHide();
      }
    }, 10);
  }

  hide() {
    const el = this._element;
    if (!this._isShown) return;
    if (!triggerEvent(el, 'boodoo.hide.toast')) return;
    el.classList.remove('show');
    el.classList.add('hide');
    clearTimeout(this._timeout);
    const duration = getTransitionDuration(el);
    emulateTransitionEnd(el, duration).then(() => {
      el.classList.remove('hide');
      this._isShown = false;
      // remove from DOM if it has [data-boodoo-autohide] remove behavior? keep simple: leave in DOM
      triggerEvent(el, 'boodoo.hidden.toast');
    });
  }

  _scheduleHide() {
    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => this.hide(), this._config.delay);
  }

  dispose() {
    clearTimeout(this._timeout);
    super.dispose();
  }
}

// Data API: show toasts with `.toast[data-boodoo-autohide]` on load
if (typeof document !== 'undefined') {
  initToasts();
  document.addEventListener('DOMContentLoaded', initToasts);
}

function initToasts() {
  // Toast visibility is triggered manually; kept for parity with data-api.
}

// Expose a ShowAll helper
Toast.showAll = function showAll(container) {
  const toasts = Array.from((container || document).querySelectorAll(':scope .toast, .toast'));
  toasts.forEach((t) => {
    if (!t.classList.contains('show') && !t.classList.contains('hide')) {
      Toast.getOrCreateInstance(t).show();
    }
  });
};

export default Toast;