// BOODOO — Tooltip & Popover
// Lightweight positioning (no Popper dependency) with arrow support.

import { BaseComponent } from './base-component.js';
import { triggerEvent, getTransitionDuration, emulateTransitionEnd, throttle } from './util.js';

const ARROW_SHIFT = 8;

class AbstractTrigger extends BaseComponent {
  constructor(target, config = {}) {
    super(target, config);
    this._config = this._getConfig(config, this.constructor.Default);
    this._tip = null;
    this._popper = null;
    this._hideTimeout = null;
    this._showTimeout = null;
    this._bound = {
      show: this.show.bind(this),
      hide: this.hide.bind(this),
      toggle: this.toggle.bind(this),
      onScroll: throttle(() => this._popper && this._updatePosition(), 100),
      onResize: () => this._popper && this._updatePosition(),
    };
    this._bindEvents();
  }

  static get Default() {
    return {
      trigger: 'hover focus',
      placement: 'top',
      title: null,
      html: false,
      delay: 0,
      offset: [0, 6],
      container: null,
      boundary: 'clippingParents',
      sanitize: false,
    };
  }

  _bindEvents() {
    const triggers = this._config.trigger.split(' ');
    if (triggers.includes('hover')) {
      this._element.addEventListener('mouseenter', this._bound.show);
      this._element.addEventListener('mouseleave', this._bound.hide);
    }
    if (triggers.includes('focus')) {
      this._element.addEventListener('focusin', this._bound.show);
      this._element.addEventListener('focusout', this._bound.hide);
    }
    if (triggers.includes('click')) {
      this._element.addEventListener('click', this._bound.toggle);
    }
    if (this._config.manual) {
      // no automatic binding
    }
  }

  setContent(tip) {
    const title = this._getTitle();
    if (this.constructor.NAME === 'tooltip') {
      const inner = tip.querySelector('.tooltip-inner');
      if (inner) inner.textContent = title;
    } else {
      const header = tip.querySelector('.popover-header');
      const body = tip.querySelector('.popover-body');
      if (header && this._config.title) header.textContent = this._config.title;
      if (body) body.innerHTML = title;
    }
  }

  _getTitle() {
    const element = this._element;
    const title = this._config.title || element.getAttribute('data-boodoo-title') || element.getAttribute('title') || '';
    if (element.title === title && element.removeAttribute) element.removeAttribute('title');
    return title;
  }

  toggle() {
    if (this._isShown) this.hide();
    else this.show();
  }

  show() {
    if (this._isShown || this._isTransitioning) return;
    clearTimeout(this._hideTimeout);
    const delay = this._config.delay.show || this._config.delay;
    this._showTimeout = setTimeout(() => this._show(), typeof delay === 'number' ? delay : 0);
  }

  _show() {
    if (this._isShown) return;
    if (!triggerEvent(this._element, 'boodoo.show.' + this.constructor.NAME)) return;
    this._isTransitioning = true;

    this._createTip();
    document.body.appendChild(this._tip);
    void this._tip.offsetHeight; // reflow
    this._tip.classList.add('show');
    window.addEventListener('scroll', this._bound.onScroll, true);
    window.addEventListener('resize', this._bound.onResize);
    this._isShown = true;
    this._isTransitioning = false;
    this._updatePosition();
    triggerEvent(this._element, 'boodoo.shown.' + this.constructor.NAME);
  }

  hide() {
    if (!this._isShown) return;
    clearTimeout(this._showTimeout);
    const delay = this._config.delay.hide || this._config.delay;
    this._hideTimeout = setTimeout(() => this._hide(), typeof delay === 'number' ? delay : 0);
  }

  _hide() {
    if (!this._isShown) return;
    if (!triggerEvent(this._element, 'boodoo.hide.' + this.constructor.NAME)) return;
    window.removeEventListener('scroll', this._bound.onScroll, true);
    window.removeEventListener('resize', this._bound.onResize);
    this._tip.classList.remove('show');
    const duration = getTransitionDuration(this._tip);
    emulateTransitionEnd(this._tip, duration).then(() => {
      if (this._tip) this._tip.parentNode && this._tip.parentNode.removeChild(this._tip);
      this._tip = null;
      this._isShown = false;
      this._popper = null;
      triggerEvent(this._element, 'boodoo.hidden.' + this.constructor.NAME);
    });
  }

  _createTip() {
    if (this._tip) return this._tip;
    if (this.constructor.NAME === 'tooltip') {
      this._tip = document.createElement('div');
      this._tip.className = 'tooltip';
      this._tip.setAttribute('role', 'tooltip');
      this._tip.innerHTML = '<div class="tooltip-arrow"></div><div class="tooltip-inner"></div>';
    } else {
      this._tip = document.createElement('div');
      this._tip.className = 'popover';
      this._tip.setAttribute('role', 'tooltip');
      this._tip.innerHTML = '<div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div>';
    }
    this.setContent(this._tip);
    this._tip.classList.add('bs-popover-auto', 'bs-tooltip-auto');
    this._tip._boodooInstance = this;
    return this._tip;
  }

  _updatePosition() {
    const tip = this._tip;
    if (!tip) return;
    const el = this._element;
    const rect = el.getBoundingClientRect();
    const scrollY = window.scrollY || 0;
    const scrollX = window.scrollX || 0;
    const offset = this._config.offset || [0, 6];
    const placement = this._config.placement;

    // Resolve 'auto' to a concrete placement
    const spaceTop = rect.top;
    const spaceBottom = window.innerHeight - rect.bottom;
    const spaceStart = rect.left;
    const spaceEnd = window.innerWidth - rect.right;
    let resolved = placement;
    if (placement === 'auto' || placement === 'auto-start' || placement === 'auto-end') {
      resolved = spaceTop >= spaceBottom ? (rect.left + rect.width / 2 < window.innerWidth / 2 ? (placement.includes('start') ? 'bottom-start' : 'bottom') : (placement.includes('end') ? 'bottom-end' : 'bottom')) : (rect.left + rect.width / 2 < window.innerWidth / 2 ? (placement.includes('start') ? 'top-start' : 'top') : (placement.includes('end') ? 'top-end' : 'top'));
    }

    const tipWidth = tip.offsetWidth;
    const tipHeight = tip.offsetHeight;
    const gap = (offset[1] || 6);
    let left = 0, top = 0;

    switch (resolved) {
      case 'top': case 'top-start': case 'top-end':
        left = rect.left + rect.width / 2 - tipWidth / 2;
        top = rect.top - tipHeight - gap;
        if (resolved === 'top-start') left = rect.left;
        if (resolved === 'top-end') left = rect.right - tipWidth;
        break;
      case 'bottom': case 'bottom-start': case 'bottom-end':
        left = rect.left + rect.width / 2 - tipWidth / 2;
        top = rect.bottom + gap;
        if (resolved === 'bottom-start') left = rect.left;
        if (resolved === 'bottom-end') left = rect.right - tipWidth;
        break;
      case 'start': case 'start-top': case 'start-bottom':
        left = rect.left - tipWidth - gap;
        top = rect.top + rect.height / 2 - tipHeight / 2;
        if (resolved === 'start-top') top = rect.top;
        if (resolved === 'start-bottom') top = rect.bottom - tipHeight;
        break;
      case 'end': case 'end-top': case 'end-bottom':
        left = rect.right + gap;
        top = rect.top + rect.height / 2 - tipHeight / 2;
        if (resolved === 'end-top') top = rect.top;
        if (resolved === 'end-bottom') top = rect.bottom - tipHeight;
        break;
    }

    // Clamp to viewport
    left = Math.max(8, Math.min(window.innerWidth - tipWidth - 8, left));
    top = Math.max(8, Math.min(window.innerHeight - tipHeight - 8, top));

    tip.style.left = (left + scrollX) + 'px';
    tip.style.top = (top + scrollY) + 'px';
    tip.setAttribute('data-popper-placement', resolved);

    // Position the arrow
    const isTooltip = this.constructor.NAME === 'tooltip';
    const prefix = isTooltip ? 'tooltip' : 'popover';
    const arrow = tip.querySelector('.' + prefix + '-arrow');
    if (!arrow) return;
    arrow.style.margin = '0';

    // Reset arrow classes
    tip.className = tip.className.replace(/\bbs-(tooltip|popover)-(top|end|bottom|start)[^\s]*/g, '');
    tip.className += ' bs-' + prefix + '-' + resolved.split('-')[0];

    if (resolved.startsWith('top') || resolved.startsWith('bottom')) {
      arrow.style.left = (rect.left + rect.width / 2 - left - scrollX) + 'px';
      arrow.style.top = 'auto';
      arrow.style.right = 'auto';
      if (resolved.includes('-start')) arrow.style.left = (rect.left - left - scrollX + ARROW_SHIFT) + 'px';
      else if (resolved.includes('-end')) arrow.style.right = (left + tipWidth - rect.right - scrollX + ARROW_SHIFT) + 'px';
    } else {
      arrow.style.top = (rect.top + rect.height / 2 - top - scrollY) + 'px';
      arrow.style.left = 'auto';
      arrow.style.bottom = 'auto';
      if (resolved.includes('-top')) arrow.style.top = (rect.top - top - scrollY + ARROW_SHIFT) + 'px';
      else if (resolved.includes('-bottom')) arrow.style.bottom = (top + tipHeight - rect.bottom - scrollY + ARROW_SHIFT) + 'px';
    }
  }

  dispose() {
    if (this._tip) {
      this._tip.parentNode && this._tip.parentNode.removeChild(this._tip);
      this._tip = null;
    }
    clearTimeout(this._showTimeout);
    clearTimeout(this._hideTimeout);
    super.dispose();
  }
}

// ---- Tooltip ----
export class Tooltip extends AbstractTrigger {
  static get NAME() { return 'tooltip'; }
  static get selector() { return '[data-boodoo-toggle="tooltip"]'; }
}

// ---- Popover ----
export class Popover extends AbstractTrigger {
  static get NAME() { return 'popover'; }
  static get selector() { return '[data-boodoo-toggle="popover"]'; }
}

// Data API
if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    const tooltipToggler = event.target.closest(Tooltip.selector);
    if (tooltipToggler) {
      event.preventDefault();
      const tt = Tooltip.getOrCreateInstance(tooltipToggler);
      tt.toggle();
      return;
    }
    const popoverToggler = event.target.closest(Popover.selector);
    if (popoverToggler) {
      event.preventDefault();
      const pp = Popover.getOrCreateInstance(popoverToggler);
      pp.toggle();
    }
  }, true);
}

// Auto-init hover/focus triggers from data attributes
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTriggers);
  } else {
    initTriggers();
  }
}

function initTriggers() {
  document.querySelectorAll(Tooltip.selector).forEach((el) => {
    if (!Tooltip.getInstance(el)) Tooltip.getOrCreateInstance(el);
  });
  document.querySelectorAll(Popover.selector).forEach((el) => {
    if (!Popover.getInstance(el)) Popover.getOrCreateInstance(el);
  });
}

export default { Tooltip, Popover };