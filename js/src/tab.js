// BUDU — Tab
// Tab & pill switching (nav-tabs, nav-pills, nav-underline).

import { BaseComponent } from './base-component.js';
import { getElementFromSelector, triggerEvent, getNextElement } from './util.js';

export class Tab extends BaseComponent {
  static get NAME() { return 'tab'; }

  static get selector() { return '[data-budu-toggle="tab"], [data-budu-toggle="pill"]'; }

  static toggleVia(source) {
    const instance = Tab.getOrCreateInstance(source);
    instance.show();
  }

  show() {
    const tabEl = this._element;
    const isActive = tabEl.classList.contains('active');
    if (isActive) return;
    if (!triggerEvent(tabEl, 'budu.show.tab')) return;

    const targetEl = getElementFromSelector(tabEl);
    const nav = tabEl.closest('.nav');
    const prevActive = nav ? nav.querySelector('.nav-link.active') : null;
    const prevContent = prevActive ? getElementFromSelector(prevActive) : null;

    // Deactivate old
    if (prevActive) {
      prevActive.classList.remove('active');
      prevActive.setAttribute('aria-selected', 'false');
    }
    if (prevContent) {
      prevContent.classList.remove('active', 'show');
      prevContent.classList.add('fade');
    }

    // Activate new tab
    tabEl.classList.add('active');
    tabEl.setAttribute('aria-selected', 'true');

    if (targetEl) {
      targetEl.classList.add('active', 'show');
      targetEl.classList.remove('fade');
    }

    // Trigger fade-in animation on content
    setTimeout(() => {
      triggerEvent(tabEl, 'budu.shown.tab');
    }, 10);
  }
}

// Data API
if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    const tab = event.target.closest(Tab.selector);
    if (tab) {
      event.preventDefault();
      Tab.toggleVia(tab);
    }
  }, true);
}

export default Tab;