// BOODOO — Offcanvas
// Slide-in panel (top/end/bottom/start) with backdrop.

import { BaseComponent } from './base-component.js';
import { getElementFromSelector, triggerEvent, getTransitionDuration, emulateTransitionEnd, reflow } from './util.js';

export class Offcanvas extends BaseComponent {
  static get NAME() { return 'offcanvas'; }

  static get selector() { return '.offcanvas'; }

  constructor(target, config = {}) {
    super(target, config);
    this._backdrop = null;
  }

  static toggleVia(source) {
    const target = getElementFromSelector(source);
    if (!target) return;
    const offcanvas = Offcanvas.getOrCreateInstance(target);
    offcanvas.toggle();
  }

  toggle() {
    if (this._isShown) this.hide();
    else this.show();
  }

  show() {
    if (this._isShown) return;
    if (!triggerEvent(this._element, 'boodoo.show.offcanvas')) return;
    this._isShown = true;

    document.body.classList.add('modal-open', 'offcanvas-open');
    document.body.style.overflow = 'hidden';

    this._element.classList.add('showing');
    void reflow(this._element);
    this._element.classList.add('show');
    // force reflow then remove 'showing'
    void reflow(this._element);
    this._element.classList.remove('showing');

    this._createBackdrop();
    setTimeout(() => {
      const focusable = this._element.querySelector('input, button, [tabindex]');
      if (focusable) focusable.focus();
      triggerEvent(this._element, 'boodoo.shown.offcanvas');
    }, 120);
  }

  hide() {
    if (!this._isShown) return;
    if (!triggerEvent(this._element, 'boodoo.hide.offcanvas')) return;
    this._isShown = false;

    this._element.classList.add('hiding');
    this._element.classList.remove('show');
    const duration = getTransitionDuration(this._element);
    emulateTransitionEnd(this._element, duration).then(() => {
      this._element.classList.remove('hiding');
      this._removeBackdrop();
      document.body.classList.remove('modal-open', 'offcanvas-open');
      document.body.style.overflow = '';
      triggerEvent(this._element, 'boodoo.hidden.offcanvas');
    });
  }

  _createBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.className = 'offcanvas-backdrop fade';
    document.body.appendChild(backdrop);
    this._backdrop = backdrop;
    void reflow(backdrop);
    backdrop.classList.add('show');
    backdrop.addEventListener('click', () => {
      if (this._config.scroll !== false && this._config.backdrop !== 'static') this.hide();
    });
  }

  _removeBackdrop() {
    if (this._backdrop) {
      this._backdrop.classList.remove('show');
      setTimeout(() => this._backdrop.parentNode && this._backdrop.parentNode.removeChild(this._backdrop), 200);
      this._backdrop = null;
    }
  }
}

// Data API
if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    const source = event.target.closest('[data-boodoo-toggle="offcanvas"]');
    if (source) {
      event.preventDefault();
      Offcanvas.toggleVia(source);
    }
    const closer = event.target.closest('[data-boodoo-dismiss="offcanvas"]');
    if (closer) {
      const offcanvas = Offcanvas.getInstance(closer.closest('.offcanvas'));
      if (offcanvas) offcanvas.hide();
    }
  }, true);
}

export default Offcanvas;