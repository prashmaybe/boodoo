// BOODOO — Dropdown
// Toggle dropdown menus, handle outside clicks & Escape.

import { BaseComponent, initDataApi } from './base-component.js';
import { getElementFromSelector, triggerEvent, isVisible } from './util.js';

const getParent = (el) => el.closest('.dropdown') || el.parentElement;

export class Dropdown extends BaseComponent {
  static get NAME() { return 'dropdown'; }

  static get selector() { return '[data-boodoo-toggle="dropdown"]'; }

  constructor(target, config = {}) {
    super(target, config);
    this._menu = getElementFromSelector(target) || target.nextElementSibling;
    this._popperElement = null;
  }

  static toggleVia(toggler) {
    const instance = Dropdown.getOrCreateInstance(toggler);
    if (toggler.getAttribute('aria-expanded') === 'true') instance.hide();
    else instance.show();
  }

  toggle() {
    if (this._element.getAttribute('aria-expanded') === 'true') this.hide();
    else this.show();
  }

  show() {
    const toggler = this._element;
    const menu = this._menu;
    if (!menu) return;
    if (!triggerEvent(toggler, 'boodoo.show.dropdown')) return;

    // Close other open dropdowns
    DocumentDropdownOpener._openDropdowns.forEach((d) => {
      if (d !== this) d.hide();
    });

    menu.classList.add('show');
    menu.setAttribute('data-boodoo-popper', '');
    toggler.setAttribute('aria-expanded', 'true');
    toggler.classList.add('active');
    this._isShown = true;
    DocumentDropdownOpener._register(this);
    triggerEvent(toggler, 'boodoo.shown.dropdown');
  }

  hide() {
    const toggler = this._element;
    const menu = this._menu;
    if (!this._isShown) return;
    if (!triggerEvent(toggler, 'boodoo.hide.dropdown')) return;

    menu.classList.remove('show');
    toggler.setAttribute('aria-expanded', 'false');
    toggler.classList.remove('active');
    menu.removeAttribute('data-boodoo-popper');
    this._isShown = false;
    DocumentDropdownOpener._unregister(this);
    triggerEvent(toggler, 'boodoo.hidden.dropdown');
  }
}

// Singleton opener handling document-level outside click & escape
class DropdownOpener {
  constructor() {
    this._openDropdowns = [];
    this._boundOnClick = (event) => this._onClick(event);
    this._boundOnKeydown = (event) => this._onKeydown(event);
    this._boundOnTouch = () => this._onTouch();
    if (typeof document === 'undefined') return;
    document.addEventListener('click', this._boundOnClick, true);
    document.addEventListener('keydown', this._boundOnKeydown, true);
  }

  _register(instance) {
    if (!this._openDropdowns.includes(instance)) {
      this._openDropdowns.push(instance);
    }
    if (this._openDropdowns.length === 1) {
      document.addEventListener('touchstart', this._boundOnTouch, true);
    }
  }

  _unregister(instance) {
    this._openDropdowns = this._openDropdowns.filter((d) => d !== instance);
    if (this._openDropdowns.length === 0) {
      document.removeEventListener('touchstart', this._boundOnTouch, true);
    }
  }

  _onClick(event) {
    // Toggle via data-api
    const toggler = event.target.closest(Dropdown.selector);
    if (toggler) {
      event.preventDefault();
      Dropdown.toggleVia(toggler);
      return;
    }
    // Outside click closes
    if (this._openDropdowns.length) {
      const clickedInside = this._openDropdowns.some((d) =>
        d._element.contains(event.target) || (d._menu && d._menu.contains(event.target))
      );
      if (!clickedInside) {
        this._openDropdowns.slice().forEach((d) => d.hide());
      }
    }
  }

  _onKeydown(event) {
    if (event.key === 'Escape' && this._openDropdowns.length) {
      this._openDropdowns.slice().forEach((d) => d.hide());
      const toggler = this._openDropdowns[0]?._element;
      toggler?.focus();
    }
  }

  _onTouch() {
    // close menus when tapping outside on touch devices
    const active = this._openDropdowns[0];
    if (active) {
      const touch = event.touches[0];
      const x = touch.clientX, y = touch.clientY;
      const inside = active._element.contains(document.elementFromPoint(x, y)) ||
        (active._menu && active._menu.contains(document.elementFromPoint(x, y)));
      if (!inside) active.hide();
    }
  }
}

const DocumentDropdownOpener = new DropdownOpener();

// Data API
if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    const toggler = event.target.closest(Dropdown.selector);
    if (toggler) {
      event.preventDefault();
      Dropdown.toggleVia(toggler);
    }
  }, true);
}

export default Dropdown;