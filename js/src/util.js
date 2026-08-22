// BUDU JS — Utilities
// Safe, dependency-free DOM/event helpers.

export const element = (selector) =>
  typeof selector === 'string' ? document.querySelector(selector) : selector;

export const elements = (selector) =>
  typeof selector === 'string' ? Array.from(document.querySelectorAll(selector)) : [selector].filter(Boolean);

export const isVisible = (el) => {
  if (!el) return false;
  return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
};

export const reflow = (el) => el.offsetHeight;

export const getTransitionDuration = (el) => {
  if (!el) return 0;
  const values = window.getComputedStyle(el).transitionDuration.split(',').map(parseFloat);
  return Math.max(0, ...values) * 1000;
};

export const getTransitionDelay = (el) => {
  if (!el) return 0;
  const values = window.getComputedStyle(el).transitionDelay.split(',').map(parseFloat);
  return Math.max(0, ...values) * 1000;
};

export const emulateTransitionEnd = (el, duration) =>
  new Promise((resolve) => {
    let called = false;
    const done = () => {
      if (called) return;
      called = true;
      clearTimeout(timer);
      el.removeEventListener('transitionend', handler);
      resolve();
    };
    const handler = () => done();
    el.addEventListener('transitionend', handler);
    const timer = setTimeout(done, duration + 20);
  });

export const getElementFromSelector = (el) => {
  const selector = el.getAttribute('data-budu-target') || el.getAttribute('href');
  if (!selector || selector === '#') return null;
  if (selector.charAt(0) === '#') {
    // avoid :scope issues and getElementById side effects
    try {
      return document.querySelector(selector);
    } catch {
      return document.getElementById(selector.slice(1));
    }
  }
  return document.querySelector(selector);
};

export const getNextElement = (list, activeElement, direction = 'next') => {
  const items = Array.from(list.children).filter((el) => el.nodeType === Node.ELEMENT_NODE);
  const index = items.indexOf(activeElement);
  let nextIndex = direction === 'next' ? index + 1 : index - 1;
  if (nextIndex >= items.length) nextIndex = 0;
  if (nextIndex < 0) nextIndex = items.length - 1;
  return items[nextIndex];
};

export const triggerEvent = (el, name, payload) => {
  const event = new CustomEvent(name, {
    bubbles: true,
    cancelable: true,
    detail: payload || {},
  });
  el.dispatchEvent(event);
  return !event.defaultPrevented;
};

export const enableDismissTrigger = (component, onToggle) => {
  if (typeof document === 'undefined') return;
  const dismiss = (event) => {
    if (event.button !== 0) return; // ignore right/middle clicks
    const target = event.currentTarget || event.target;
    const instance = component.getOrCreateInstance(target);
    if (!instance) return;
    if (onToggle) onToggle(instance, event);
    else instance.hide?.();
  };
  document.addEventListener('click', (event) => {
    const toggler = event.target.closest('[data-budu-dismiss]');
    if (toggler) dismiss(event);
  }, true);
};

export const DATA_PREFIX = 'budu';
export const eventName = (suffix) => `${DATA_PREFIX}.${suffix}`;
export const toType = (obj) =>
  ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();

// Simple throttling for scroll/resize handlers
export const throttle = (fn, wait = 100) => {
  let last = 0;
  let timer = null;
  return function (...args) {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      if (timer) { clearTimeout(timer); timer = null; }
      last = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
};

export const debounce = (fn, wait = 100) => {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
};