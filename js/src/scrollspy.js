// BOODOO — Scrollspy
// Highlights nav links based on scroll position.

import { BaseComponent } from './base-component.js';
import { getElementFromSelector, throttle } from './util.js';

export class ScrollSpy extends BaseComponent {
  static get NAME() { return 'scrollspy'; }

  static get selector() { return '[data-boodoo-spy="scroll"]'; }

  constructor(target, config = {}) {
    super(target, config);
    this._config = this._getConfig(config, { target: null, offset: 10, rootMargin: '0px 0px -40% 0px' });
    this._nav = null;
    this._links = [];
    this._sections = [];
    this._active = null;

    const navSelector = this._element.getAttribute('data-boodoo-target') || this._config.target;
    if (navSelector) {
      this._nav = document.querySelector(navSelector) || getElementFromSelector(this._element);
    }
    if (!this._nav) return;
    this._links = Array.from(this._nav.querySelectorAll('a[href^="#"]')).filter(
      (a) => a.getAttribute('href') !== '#' && document.querySelector(a.getAttribute('href'))
    );
    this._sections = this._links.map((a) => document.querySelector(a.getAttribute('href')));

    this._bound = throttle(() => this._onScroll(), 100);
    window.addEventListener('scroll', this._bound, { passive: true });
    this._onScroll();
  }

  _onScroll() {
    const pos = window.scrollY + (this._config.offset || 10);
    const sections = this._sections.filter(Boolean);
    let current = null;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (section.offsetTop <= pos) {
        current = section;
      }
    }

    // If we're at the bottom, activate the last section
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5) {
      current = sections[sections.length - 1];
    }

    if (current === this._active) return;
    this._active = current;

    // Deactivate all
    this._links.forEach((a) => {
      a.classList.remove('active');
      a.setAttribute('aria-current', null);
    });

    if (current) {
      const idx = sections.indexOf(current);
      const link = this._links[idx];
      if (link) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'true');
        const li = link.parentElement;
        if (li && li.classList.contains('nav-item')) {
          // scroll the nav into view (for sidebar)
          const parentList = li.closest('.nav');
          const parentNav = li.parentElement.closest('.nav-item')?.querySelector('.nav') || null;
          if (link.scrollIntoViewIfNeeded) link.scrollIntoViewIfNeeded({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  }

  dispose() {
    window.removeEventListener('scroll', this._bound);
    super.dispose();
  }
}

// Data API
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollSpy);
  } else {
    initScrollSpy();
  }
}

function initScrollSpy() {
  document.querySelectorAll(ScrollSpy.selector).forEach((el) => {
    if (!ScrollSpy.getInstance(el)) ScrollSpy.getOrCreateInstance(el);
  });
}

export default ScrollSpy;