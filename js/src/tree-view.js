// =====================================================================
// BOODOO JS — Tree View Component
// =====================================================================

import { BaseComponent } from './base-component.js';

const NAME = 'treeview';

export class TreeView extends BaseComponent {
  static get NAME() {
    return NAME;
  }

  constructor(element, config = {}) {
    super(element, config);
    this._bindEvents();
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
          }
        }
      }
    });
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tree-view, [data-boodoo="tree"]').forEach((el) => {
      TreeView.getOrCreateInstance(el);
    });
  });
}
