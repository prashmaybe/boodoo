// =====================================================================
// BOODOO JS — Context Menu Component
// Right-click or trigger-based floating context menu.
// =====================================================================

import { BaseComponent } from './base-component.js';
import { triggerEvent } from './util.js';

let activeContextMenu = null;

export class ContextMenu extends BaseComponent {
  static get NAME() {
    return 'contextMenu';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._menu = this._resolveMenu();
    this._isOpen = false;
    this._bindEvents();
  }

  _resolveMenu() {
    const targetSelector = this._element.getAttribute('data-boodoo-target') || this._element.getAttribute('href');
    if (targetSelector) {
      return document.querySelector(targetSelector);
    }
    // If element itself is .context-menu
    if (this._element.classList.contains('context-menu')) {
      return this._element;
    }
    return document.querySelector('.context-menu');
  }

  _bindEvents() {
    if (this._element !== this._menu) {
      // Right click on target trigger container
      this._element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.show(e.clientX, e.clientY);
      });
    }

    // Dismiss on outside click or escape
    document.addEventListener('click', (e) => {
      if (this._isOpen && this._menu && !this._menu.contains(e.target)) {
        this.hide();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this._isOpen) {
        this.hide();
      }
    });

    // Dismiss when selecting an item
    if (this._menu) {
      this._menu.addEventListener('click', (e) => {
        if (e.target.closest('.context-menu-link:not(.disabled)')) {
          this.hide();
        }
      });
    }
  }

  show(x, y) {
    if (!this._menu) return;
    if (activeContextMenu && activeContextMenu !== this) {
      activeContextMenu.hide();
    }

    // Calculate boundary limits
    this._menu.style.visibility = 'hidden';
    this._menu.classList.add('show');
    const menuWidth = this._menu.offsetWidth || 180;
    const menuHeight = this._menu.offsetHeight || 160;

    let posX = x;
    let posY = y;

    if (posX + menuWidth > window.innerWidth) {
      posX = Math.max(0, window.innerWidth - menuWidth - 10);
    }
    if (posY + menuHeight > window.innerHeight) {
      posY = Math.max(0, window.innerHeight - menuHeight - 10);
    }

    this._menu.style.left = `${posX}px`;
    this._menu.style.top = `${posY}px`;
    this._menu.style.visibility = 'visible';

    this._isOpen = true;
    activeContextMenu = this;
    triggerEvent(this._element, 'boodoo.contextmenu.show', { x: posX, y: posY });
  }

  hide() {
    if (!this._menu || !this._isOpen) return;
    this._menu.classList.remove('show');
    this._isOpen = false;
    if (activeContextMenu === this) {
      activeContextMenu = null;
    }
    triggerEvent(this._element, 'boodoo.contextmenu.hide');
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-boodoo-toggle="context-menu"]').forEach((el) => {
      ContextMenu.getOrCreateInstance(el);
    });
  });
}
