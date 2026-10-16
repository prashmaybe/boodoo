// =====================================================================
// BOODOO JS — Tree View Component
// =====================================================================

import { BaseComponent } from './base-component.js';

export class TreeView extends BaseComponent {
  static get NAME() {
    return 'treeview';
  }


  constructor(element, config = {}) {
    super(element, config);
    this._setupAria();
    this._bindEvents();
  }

  _setupAria() {
    this._element.setAttribute('role', 'tree');
    const items = this._element.querySelectorAll('li');
    items.forEach((li, idx) => {
      li.setAttribute('role', 'treeitem');
      li.setAttribute('tabindex', idx === 0 ? '0' : '-1');

      const subTree = li.querySelector('ul');
      if (subTree) {
        subTree.setAttribute('role', 'group');
        const isHidden = subTree.style.display === 'none';
        li.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
      }
    });
  }

  _bindEvents() {
    this._element.addEventListener('click', (e) => {
      const toggle = e.target.closest('.tree-toggle, [data-boodoo-toggle="tree-node"]');
      if (toggle) {
        e.preventDefault();
        const parentLi = toggle.closest('li');
        if (parentLi) {
          const subTree = parentLi.querySelector('ul');
          if (subTree) {
            const isHidden = subTree.style.display === 'none';
            subTree.style.display = isHidden ? '' : 'none';
            toggle.classList.toggle('expanded', isHidden);
            parentLi.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
          }
        }
      }
    });

    this._element.addEventListener('keydown', (e) => {
      const activeLi = document.activeElement ? document.activeElement.closest('li[role="treeitem"]') : null;
      if (!activeLi || !this._element.contains(activeLi)) return;

      const visibleItems = Array.from(this._element.querySelectorAll('li[role="treeitem"]')).filter((li) => {
        const parentUl = li.parentElement.closest('ul');
        if (!parentUl || parentUl === this._element) return true;
        return parentUl.style.display !== 'none';
      });

      const currentIndex = visibleItems.indexOf(activeLi);
      if (currentIndex === -1) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = visibleItems[(currentIndex + 1) % visibleItems.length];
        this._focusTreeItem(next, visibleItems);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = visibleItems[(currentIndex - 1 + visibleItems.length) % visibleItems.length];
        this._focusTreeItem(prev, visibleItems);
      } else if (e.key === 'ArrowRight') {
        const subTree = activeLi.querySelector('ul');
        if (subTree && subTree.style.display === 'none') {
          e.preventDefault();
          subTree.style.display = '';
          activeLi.setAttribute('aria-expanded', 'true');
          const toggle = activeLi.querySelector('.tree-toggle, [data-boodoo-toggle="tree-node"]');
          if (toggle) toggle.classList.add('expanded');
        }
      } else if (e.key === 'ArrowLeft') {
        const subTree = activeLi.querySelector('ul');
        if (subTree && subTree.style.display !== 'none') {
          e.preventDefault();
          subTree.style.display = 'none';
          activeLi.setAttribute('aria-expanded', 'false');
          const toggle = activeLi.querySelector('.tree-toggle, [data-boodoo-toggle="tree-node"]');
          if (toggle) toggle.classList.remove('expanded');
        }
      }
    });
  }

  _focusTreeItem(target, allItems) {
    if (!target) return;
    allItems.forEach((item) => item.setAttribute('tabindex', '-1'));
    target.setAttribute('tabindex', '0');
    target.focus();
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tree-view, [data-boodoo="tree"]').forEach((el) => {
      TreeView.getOrCreateInstance(el);
    });
  });
}
