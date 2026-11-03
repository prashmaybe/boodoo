// =====================================================================
// BOODOO JS — Context Menu Component
// Right-click or trigger-based floating context menu.
// =====================================================================

import { BaseComponent, initDataApi } from './base-component.js';
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
    const targetSelector =
      this._element.getAttribute('data-boodoo-target') || this._element.getAttribute('href');
    if (targetSelector) {
      return document.querySelector(targetSelector);
    }
    // If element itself is .context-menu
    if (this._element.classList.contains('context-menu')) {
      return this._element;
    }
    // Scoped fallback: check descendants, adjacent sibling, or closest ancestor
    const scoped =
      this._element.querySelector('.context-menu') ||
      (this._element.nextElementSibling && this._element.nextElementSibling.matches('.context-menu')
        ? this._element.nextElementSibling
        : null) ||
      this._element.closest('.context-menu');
    if (scoped) {
      return scoped;
    }
    console.warn('[Boodoo ContextMenu] Unable to resolve target menu for trigger:', this._element);
    return null;
  }

  _bindEvents() {
    if (this._element !== this._menu) {
      // Right click on target trigger container
      this._onContextMenu = (e) => {
        e.preventDefault();
        this.show(e.clientX, e.clientY);
      };
      this._element.addEventListener('contextmenu', this._onContextMenu);
    }

    // Dismiss on outside click or escape
    this._onDocClick = (e) => {
      if (this._isOpen && this._menu && !this._menu.contains(e.target)) {
        this.hide();
      }
    };
    document.addEventListener('click', this._onDocClick);

    this._onDocKeydown = (e) => {
      if (e.key === 'Escape' && this._isOpen) {
        this.hide();
      }
    };
    document.addEventListener('keydown', this._onDocKeydown);

    // Dismiss when selecting an item
    if (this._menu) {
      this._onMenuClick = (e) => {
        if (e.target.closest('.context-menu-link:not(.disabled)')) {
          this.hide();
        }
      };
      this._menu.addEventListener('click', this._onMenuClick);
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

  dispose() {
    if (this._isOpen) this.hide();
    if (this._onContextMenu && this._element) {
      this._element.removeEventListener('contextmenu', this._onContextMenu);
      this._onContextMenu = null;
    }
    if (this._onDocClick) {
      document.removeEventListener('click', this._onDocClick);
      this._onDocClick = null;
    }
    if (this._onDocKeydown) {
      document.removeEventListener('keydown', this._onDocKeydown);
      this._onDocKeydown = null;
    }
    if (this._onMenuClick && this._menu) {
      this._menu.removeEventListener('click', this._onMenuClick);
      this._onMenuClick = null;
    }
    if (activeContextMenu === this) {
      activeContextMenu = null;
    }
    this._menu = null;
    super.dispose();
  }
}

initDataApi(ContextMenu, '[data-boodoo-toggle="context-menu"]');
