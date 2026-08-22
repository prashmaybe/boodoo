// BUDU — Modal
// Modal dialog with backdrop, Escape/backdrop dismissal, scroll locking.

import { BaseComponent } from './base-component.js';
import { getElementFromSelector, triggerEvent, getTransitionDuration, emulateTransitionEnd, reflow } from './util.js';

export class Modal extends BaseComponent {
  static get NAME() { return 'modal'; }

  static get selector() { return '.modal'; }

  constructor(target, config = {}) {
    super(target, config);
    this._dialog = this._element.querySelector('.modal-dialog');
    this._backdrop = null;
    this._focussedBefore = null;
    this._preventScrollBinds = this._bindKeydown = null;
  }

  static toggleVia(source) {
    const target = getElementFromSelector(source);
    if (!target) return;
    const modal = Modal.getOrCreateInstance(target);
    modal.toggle();
  }

  toggle() {
    if (this._isShown) this.hide();
    else this.show();
  }

  show() {
    if (this._isShown) return;
    if (!triggerEvent(this._element, 'budu.show.modal')) return;

    this._isShown = true;
    this._focussedBefore = document.activeElement;

    // Lock body scroll
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = this._scrollBarWidth() + 'px';

    this._element.style.display = 'block';
    this._element.classList.add('show');
    this._createBackdrop().then(() => this._showModal());
  }

  _showModal() {
    const el = this._element;
    el.style.display = 'none';
    void reflow(el);
    el.style.display = 'block';
    el.classList.add('show');
    this._addKeydownListener();

    const focusable = this._element.querySelectorAll(focusableSelector);
    this._preventScrollBinds = this._handleScroll();
    const first = focusable[0];
    if (first) first.focus();
    else el.focus();
    triggerEvent(el, 'budu.shown.modal');
  }

  hide() {
    if (!this._isShown) return;
    if (!triggerEvent(this._element, 'budu.hide.modal')) return;

    this._element.classList.remove('show');
    const duration = getTransitionDuration(this._element);
    this._removeKeydownListener();

    emulateTransitionEnd(this._element, duration).then(() => {
      this._isShown = false;
      this._element.style.display = 'none';
      this._removeBackdrop();
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      if (this._focussedBefore) this._focussedBefore.focus?.();
      triggerEvent(this._element, 'budu.hidden.modal');
    });
  }

  _createBackdrop() {
    return new Promise((resolve) => {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade';
      document.body.appendChild(backdrop);
      this._backdrop = backdrop;
      void reflow(backdrop);
      backdrop.classList.add('show');
      backdrop.addEventListener('click', () => {
        if (!this._config.backdrop && this._config.backdrop !== 'static') {
          this.hide();
        }
      });
      setTimeout(resolve, 20);
    });
  }

  _removeBackdrop() {
    if (this._backdrop) {
      const backdrop = this._backdrop;
      backdrop.classList.remove('show');
      setTimeout(() => backdrop.parentNode && backdrop.parentNode.removeChild(backdrop), 200);
      this._backdrop = null;
    }
  }

  _addKeydownListener() {
    this._bindKeydown = (event) => {
      if (event.key === 'Escape' && this._config.keyboard !== false) this.hide();
      if (event.key === 'Tab') this._traverseTab(event);
    };
    document.addEventListener('keydown', this._bindKeydown);
  }

  _removeKeydownListener() {
    if (this._bindKeydown) document.removeEventListener('keydown', this._bindKeydown);
  }

  _traverseTab(event) {
    const focusable = Array.from(this._element.querySelectorAll(focusableSelector));
    if (!focusable.length) return;
    const firstEl = focusable[0];
    const lastEl = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === firstEl) {
      event.preventDefault();
      lastEl.focus();
    } else if (!event.shiftKey && document.activeElement === lastEl) {
      event.preventDefault();
      firstEl.focus();
    }
  }

  _scrollBarWidth() {
    const scrollDiv = document.createElement('div');
    scrollDiv.style.cssText = 'width:100px;height:100px;overflow:scroll;position:absolute;top:-9999px;';
    document.body.appendChild(scrollDiv);
    const width = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return width;
  }

  _handleScroll() {
    // Keep modal scroll within the modal itself
    const modal = this._element;
    const onWheel = (e) => {
      if (!modal.contains(e.target)) e.preventDefault();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }
}

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Data API
if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    const source = event.target.closest('[data-budu-toggle="modal"]');
    if (source) {
      event.preventDefault();
      Modal.toggleVia(source);
    }
    // close bound via [data-budu-dismiss="modal"]
    const closer = event.target.closest('[data-budu-dismiss="modal"]');
    if (closer) {
      const modal = Modal.getInstance(closer.closest('.modal'));
      if (modal) modal.hide();
    }
  }, true);
}

export default Modal;