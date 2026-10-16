// BOODOO JS — Base Component
// Shared class with instance registry & get/create API (Bootstrap-like).

import { element, DATA_PREFIX } from './util.js';

// Component-namespaced registry: Map<ComponentClass, WeakMap<Element, Instance>>
const componentRegistries = new Map();

function getComponentRegistry(componentClass) {
  let reg = componentRegistries.get(componentClass);
  if (!reg) {
    reg = new Map();
    componentRegistries.set(componentClass, reg);
  }
  return reg;
}

export class BaseComponent {
  constructor(target, config = {}) {
    this._element = element(target);
    this._config = config;
    if (!this._element) throw new Error('Invalid target element for ' + this.constructor.name);
    this._isTransitioning = false;
    this._isShown = false;
    if (this.constructor === BaseComponent) {
      throw new TypeError('BaseComponent is abstract');
    }
  }

  static get NAME() {
    return 'boodoo';
  }

  // ----- Registry -----
  static getInstance(target) {
    const el = element(target);
    if (!el) return null;
    return getComponentRegistry(this).get(el) || null;
  }

  static getOrCreateInstance(target, config) {
    const el = element(target);
    if (!el) return null;
    const reg = getComponentRegistry(this);
    let instance = reg.get(el);
    if (!instance) {
      instance = new this(el, config);
      reg.set(el, instance);
    }
    return instance;
  }

  static getAll() {
    return Array.from(getComponentRegistry(this).values());
  }

  dispose() {
    const reg = getComponentRegistry(this.constructor);
    if (this._element) {
      reg.delete(this._element);
    }
    this._element = null;
  }

  // ----- Lifecycle hooks (overridden by subclasses) -----
  hide() {}
  show() {}
  toggle() {}

  // Touch / pointer guard for mobile-friendly dismissal
  _onTouchEnd(event) {
    const target = event.target;
    if (!this._element.contains(target)) this.hide();
  }

  _getConfig(config, defaults) {
    return { ...defaults, ...(config || {}) };
  }

  static _dataAttrConfig(el, prefix = 'boodoo') {
    const result = {};
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith(`data-${prefix}-`)) {
        const key = attr.name.slice(`data-${prefix}-`.length);
        let value = attr.value;
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (value === 'null') value = null;
        else if (value !== '' && !Number.isNaN(Number(value))) value = Number(value);
        result[key] = value;
      }
    }
    return result;
  }
}

// Auto-bind data-api initializers per component
export function initDataApi(component, selector) {
  if (typeof document === 'undefined') return;
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', () => initDataApi(component, selector));
    return;
  }
  const els = Array.from(document.querySelectorAll(selector));
  for (const el of els) {
    if (!component.getInstance(el)) {
      try {
        component.getOrCreateInstance(el);
      } catch (e) {
        // ignore — some components need explicit config
      }
    }
  }
}