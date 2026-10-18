// =====================================================================
// BOODOO JS — Floating Action Button Dock
// Controls collapsible FAB action dock with micro-animations & a11y.
// =====================================================================

import { BaseComponent } from './base-component.js';
import { triggerEvent } from './util.js';

export class FABDock extends BaseComponent {
  static get NAME() {
    return 'fabDock';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._isOpen = this._element.classList.contains('open');
    this._trigger = this._element.querySelector('.fab-dock-trigger');
    this._items = this._element.querySelectorAll('.fab-dock-item');
    this._onDocumentClick = this._onDocumentClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);

    this._bindEvents();
  }

  _bindEvents() {
    if (this._trigger) {
      this._trigger.setAttribute('aria-expanded', this._isOpen ? 'true' : 'false');
      this._trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    }

    this._element.addEventListener('keydown', this._onKeyDown);
  }

  _onDocumentClick(e) {
    if (!this._isOpen) return;
    if (!this._element.contains(e.target)) {
      this.close();
    }
  }

  _onKeyDown(e) {
    if (e.key === 'Escape' && this._isOpen) {
      e.stopPropagation();
      this.close();
      if (this._trigger) this._trigger.focus();
    }
  }

  open() {
    if (this._isOpen) return;
    this._isOpen = true;
    this._element.classList.add('open');
    if (this._trigger) this._trigger.setAttribute('aria-expanded', 'true');
    if (typeof document !== 'undefined') {
      document.addEventListener('click', this._onDocumentClick);
    }
    triggerEvent(this._element, 'boodoo.opened.fabdock');
  }

  close() {
    if (!this._isOpen) return;
    this._isOpen = false;
    this._element.classList.remove('open');
    if (this._trigger) this._trigger.setAttribute('aria-expanded', 'false');
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this._onDocumentClick);
    }
    triggerEvent(this._element, 'boodoo.closed.fabdock');
  }

  toggle() {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  dispose() {
    if (typeof document !== 'undefined') {
      document.removeEventListener('click', this._onDocumentClick);
    }
    this._element.removeEventListener('keydown', this._onKeyDown);
    super.dispose();
  }
}
