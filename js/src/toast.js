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
    if (this._element.classList.contains('show')) {
      this._isShown = true;
    }
  }

  static showToast(el) {
    const toast = Toast.getOrCreateInstance(el);
    toast.show();
  }

  show() {
    const el = this._element;
    if (this._isShown && el.classList.contains('show')) return;
    el.classList.remove('hide');
    el.classList.add('showing');
    triggerEvent(el, 'boodoo.show.toast');

    setTimeout(() => {
      el.classList.remove('showing');
      el.classList.add('show');
      this._isShown = true;

      // Smart progress bar
      if (this._config.autohide && this._config.progress !== false) {
        let bar = el.querySelector('.toast-progress');
        if (!bar) {
          bar = document.createElement('div');
          bar.className = 'toast-progress';
          el.appendChild(bar);
        }
        bar.style.animationDuration = `${this._config.delay}ms`;
      }

      triggerEvent(el, 'boodoo.shown.toast');

      if (this._config.autohide) {
        this._scheduleHide();
      }
    }, 10);
  }


  hide() {
    const el = this._element;
    if (!this._isShown && !el.classList.contains('show')) return;
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

// Data API: dismiss handling and autohide on load
if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    const closer = event.target.closest('[data-boodoo-dismiss="toast"]');
    if (closer) {
      const toastEl = closer.closest('.toast');
      if (toastEl) {
        const toast = Toast.getOrCreateInstance(toastEl);
        if (toast) toast.hide();
      }
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToasts);
  } else {
    initToasts();
  }
}

function initToasts() {
  const autohideToasts = document.querySelectorAll('.toast[data-boodoo-autohide="true"], .toast.show[data-boodoo-delay]');
  autohideToasts.forEach((el) => {
    Toast.getOrCreateInstance(el);
  });
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