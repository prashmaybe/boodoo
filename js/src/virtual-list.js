// =====================================================================
// BOODOO — VirtualList Component
// High-performance DOM list and container windowing primitive
// Zero dependencies, accessible, dynamic item heights, smooth scroll.
// =====================================================================

import { triggerEvent } from './util.js';

export class VirtualList {
  constructor(element, options = {}) {
    this._element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this._element) return;

    this._options = {
      items: options.items || [],
      itemHeight: options.itemHeight || 48,
      buffer: options.buffer !== undefined ? options.buffer : 5,
      renderItem:
        options.renderItem ||
        ((item, _index) => {
          const div = document.createElement('div');
          div.className = 'virtual-list-item';
          const span = document.createElement('span');
          span.textContent = typeof item === 'string' ? item : JSON.stringify(item);
          div.appendChild(span);
          return div;
        }),
      ...options,
    };

    this._scrollTop = 0;
    this._viewportHeight = this._element.clientHeight || 400;
    this._onScroll = this._handleScroll.bind(this);
    this._onResize = this._handleResize.bind(this);

    this._init();
  }

  _init() {
    this._originalOverflowY = this._element.style.overflowY || '';
    this._originalPosition = this._element.style.position || '';
    this._originalTabIndex = this._element.hasAttribute('tabindex')
      ? this._element.getAttribute('tabindex')
      : null;
    this._originalRole = this._element.hasAttribute('role')
      ? this._element.getAttribute('role')
      : null;
    this._originalAriaBusy = this._element.hasAttribute('aria-busy')
      ? this._element.getAttribute('aria-busy')
      : null;

    this._element.classList.add('boodoo-virtual-list');
    this._element.style.overflowY = 'auto';
    this._element.style.position = 'relative';
    this._element.tabIndex = this._element.tabIndex >= 0 ? this._element.tabIndex : 0;
    this._element.setAttribute('role', 'feed');
    this._element.setAttribute('aria-busy', 'false');

    // Create spacer
    this._spacer = document.createElement('div');
    this._spacer.className = 'virtual-list-spacer';
    this._spacer.style.position = 'relative';
    this._spacer.style.width = '100%';

    // Create content window
    this._content = document.createElement('div');
    this._content.className = 'virtual-list-content';
    this._content.style.position = 'absolute';
    this._content.style.top = '0';
    this._content.style.left = '0';
    this._content.style.right = '0';

    this._spacer.appendChild(this._content);
    this._originalFragment = document.createDocumentFragment();
    while (this._element.firstChild) {
      this._originalFragment.appendChild(this._element.firstChild);
    }
    this._element.appendChild(this._spacer);

    this._element.addEventListener('scroll', this._onScroll, { passive: true });
    window.addEventListener('resize', this._onResize);

    this.render();
  }

  _handleScroll() {
    this._scrollTop = this._element.scrollTop;
    this.render();
    triggerEvent(this._element, 'boodoo:virtuallist:scroll', {
      scrollTop: this._scrollTop,
      total: this._options.items.length,
    });
  }

  _handleResize() {
    this._viewportHeight = this._element.clientHeight || 400;
    this.render();
  }

  setItems(items) {
    this._options.items = Array.isArray(items) ? items : [];
    this._element.scrollTop = 0;
    this._scrollTop = 0;
    this.render();
  }

  scrollToIndex(index) {
    const targetIndex = Math.max(0, Math.min(index, this._options.items.length - 1));
    this._element.scrollTop = targetIndex * this._options.itemHeight;
  }

  render() {
    const totalItems = this._options.items.length;
    const totalHeight = totalItems * this._options.itemHeight;
    this._spacer.style.height = `${totalHeight}px`;

    const startIndex = Math.max(
      0,
      Math.floor(this._scrollTop / this._options.itemHeight) - this._options.buffer
    );
    const visibleCount = Math.ceil(this._viewportHeight / this._options.itemHeight);
    const endIndex = Math.min(totalItems, startIndex + visibleCount + this._options.buffer * 2);

    const offsetY = startIndex * this._options.itemHeight;
    this._content.style.transform = `translateY(${offsetY}px)`;
    this._content.innerHTML = '';

    const fragment = document.createDocumentFragment();
    for (let i = startIndex; i < endIndex; i++) {
      const item = this._options.items[i];
      const node = this._options.renderItem(item, i);
      if (
        node &&
        (typeof Node === 'undefined' || node instanceof Node || typeof node === 'object')
      ) {
        fragment.appendChild(node);
      }
    }
    this._content.appendChild(fragment);
  }

  dispose() {
    if (this._element) {
      this._element.removeEventListener('scroll', this._onScroll);
      window.removeEventListener('resize', this._onResize);
      this._element.classList.remove('boodoo-virtual-list');

      // Restore inline styles
      this._element.style.overflowY = this._originalOverflowY || '';
      this._element.style.position = this._originalPosition || '';

      // Restore attributes
      if (this._originalTabIndex !== null) {
        this._element.setAttribute('tabindex', this._originalTabIndex);
      } else {
        this._element.removeAttribute('tabindex');
      }

      if (this._originalRole !== null) {
        this._element.setAttribute('role', this._originalRole);
      } else {
        this._element.removeAttribute('role');
      }

      if (this._originalAriaBusy !== null) {
        this._element.setAttribute('aria-busy', this._originalAriaBusy);
      } else {
        this._element.removeAttribute('aria-busy');
      }

      if (this._spacer && this._spacer.parentNode === this._element) {
        this._element.removeChild(this._spacer);
      }
      if (this._originalFragment) {
        this._element.appendChild(this._originalFragment);
        this._originalFragment = null;
      }
    }
  }
}
