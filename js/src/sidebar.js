// =====================================================================
// BOODOO JS — Sidebar Component
// Persistent sidebar toggling, collapse/expand mode, submenu handling.
// =====================================================================

import { BaseComponent } from './base-component.js';
import { triggerEvent } from './util.js';

export class Sidebar extends BaseComponent {
  static get NAME() {
    return 'sidebar';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._bindEvents();
  }

  _bindEvents() {
    // 1. Submenu toggles
    this._element.addEventListener('click', (e) => {
      const toggle = e.target.closest('[data-boodoo-toggle="sidebar-submenu"]');
      if (toggle) {
        e.preventDefault();
        const parentItem = toggle.closest('.sidebar-item');
        if (parentItem) {
          const submenu = parentItem.querySelector('.sidebar-submenu');
          if (submenu) {
            const isShown = submenu.classList.toggle('show');
            toggle.setAttribute('aria-expanded', isShown ? 'true' : 'false');
            triggerEvent(this._element, 'boodoo.sidebar.submenuToggle', { submenu, isShown });
          }
        }
      }
    });

    // 2. Global toggler buttons targeting this sidebar
    document.addEventListener('click', (e) => {
      const toggler = e.target.closest('[data-boodoo-toggle="sidebar"]');
      if (toggler) {
        const targetId = toggler.getAttribute('data-boodoo-target') || toggler.getAttribute('href');
        const target = targetId ? document.querySelector(targetId) : document.querySelector('.sidebar');
        if (target === this._element) {
          e.preventDefault();
          this.toggleCollapse();
        }
      }
    });
  }

  toggleCollapse() {
    const isCollapsed = this._element.classList.toggle('sidebar-collapsed');
    triggerEvent(this._element, 'boodoo.sidebar.collapseToggle', { isCollapsed });
  }

  collapse() {
    this._element.classList.add('sidebar-collapsed');
    triggerEvent(this._element, 'boodoo.sidebar.collapseToggle', { isCollapsed: true });
  }

  expand() {
    this._element.classList.remove('sidebar-collapsed');
    triggerEvent(this._element, 'boodoo.sidebar.collapseToggle', { isCollapsed: false });
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.sidebar, [data-boodoo="sidebar"]').forEach((el) => {
      Sidebar.getOrCreateInstance(el);
    });
  });
}
