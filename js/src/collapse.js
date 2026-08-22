// BUDU — Collapse
// Expand/collapse toggling with smooth height animation.

import { BaseComponent, initDataApi } from './base-component.js';
import {
  isVisible, reflow, getTransitionDuration, emulateTransitionEnd,
  getElementFromSelector, triggerEvent, elements,
} from './util.js';

export class Collapse extends BaseComponent {
  static get NAME() { return 'collapse'; }

  static get selector() { return '[data-budu-toggle="collapse"]'; }

  constructor(target, config = {}) {
    super(target, config);
    const trigger = config.trigger;
    if (trigger) {
      this._trigger = trigger;
      this._updateState();
    }
  }

  static toggleVia(dataToggler) {
    const target = getElementFromSelector(dataToggler) || dataToggler.closest('.collapse');
    if (!target) return;
    const collapse = Collapse.getOrCreateInstance(target, { trigger: dataToggler });
    collapse.toggle();
  }

  _updateState() {
    if (this._element.classList.contains('show')) {
      this._isShown = true;
      if (this._trigger) {
        this._trigger.classList.remove('collapsed');
        this._trigger.setAttribute('aria-expanded', 'true');
      }
    } else if (this._trigger) {
      this._trigger.classList.add('collapsed');
      this._trigger.setAttribute('aria-expanded', 'false');
    }
  }

  toggle() {
    if (this._isShown) this.hide();
    else this.show();
  }

  show() {
    const el = this._element;
    if (this._isShown || el.classList.contains('show')) return;
    if (!triggerEvent(el, 'budu.show.collapse')) return;

    this._isTransitioning = true;
    el.classList.remove('collapse');
    el.classList.add('collapsing');
    el.style.height = 0;
    reflow(el);

    const height = el.scrollHeight;
    el.style.height = `${height}px`;

    const duration = getTransitionDuration(el);
    emulateTransitionEnd(el, duration).then(() => {
      el.classList.remove('collapsing');
      el.classList.add('collapse', 'show');
      el.style.height = '';
      this._isTransitioning = false;
      this._isShown = true;
      this._updateState();
      triggerEvent(el, 'budu.shown.collapse');
    });
  }

  hide() {
    const el = this._element;
    if (!this._isShown && !el.classList.contains('show')) return;
    if (!triggerEvent(el, 'budu.hide.collapse')) return;

    this._isTransitioning = true;
    el.style.height = `${el.getBoundingClientRect().height}px`;
    void reflow(el);
    el.classList.remove('collapse', 'show');
    el.classList.add('collapsing');
    el.style.height = '';

    const duration = getTransitionDuration(el);
    emulateTransitionEnd(el, duration).then(() => {
      el.classList.remove('collapsing');
      el.classList.add('collapse');
      el.style.height = '';
      this._isTransitioning = false;
      this._isShown = false;
      this._updateState();
      triggerEvent(el, 'budu.hidden.collapse');
    });
  }

  static collapseAll(root, targetSelector, doTransition = true) {
    const collapsibles = elements(`${root} [data-budu-toggle="collapse"]`).filter((t) => {
      const target = getElementFromSelector(t);
      return target && target.matches(targetSelector);
    });
    collapsibles.forEach((t) => {
      const target = getElementFromSelector(t);
      if (target.classList.contains('show')) {
        const instance = Collapse.getInstance(target);
        if (instance) instance.hide();
      }
    });
  }
}

// Data API
initDataApi(Collapse, Collapse.selector);

if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    const toggler = event.target.closest(Collapse.selector);
    if (toggler) {
      event.preventDefault();
      Collapse.toggleVia(toggler);
    }
  }, true);
}

export default Collapse;