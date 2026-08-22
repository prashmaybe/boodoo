// =====================================================================
// BUDU JS — Main entry (bundle)
// =====================================================================
import './base-component.js';
import { Alert } from './alert.js';
import { Button } from './button.js';
import { Collapse } from './collapse.js';
import './accordion.js';
import { Dropdown } from './dropdown.js';
import { Modal } from './modal.js';
import { Offcanvas } from './offcanvas.js';
import { Tab } from './tab.js';
import { Toast } from './toast.js';
import { Tooltip, Popover } from './tooltip.js';
import { Carousel } from './carousel.js';
import { ScrollSpy } from './scrollspy.js';
import { initRipple } from './ripple.js';
import { initDataApi } from './base-component.js';
import { enableDismissTrigger } from './util.js';

// Wire up generic data-budu-dismiss triggers
enableDismissTrigger(Alert, (instance) => {
  const type = instance._element.getAttribute('data-budu-dismiss');
  if (type === 'alert') instance.hide();
});

// Global API
const budu = {
  Alert,
  Button,
  Collapse,
  Dropdown,
  Modal,
  Offcanvas,
  Tab,
  Toast,
  Tooltip,
  Popover,
  Carousel,
  ScrollSpy,
  initRipple,
  initDataApi,
};

// Set up a convenience for showing toasts from JS: budu.toast(message, options)
budu.toast = function toast(message, options = {}) {
  const opts = {
    title: '',
    delay: 5000,
    ...options,
    className: options.className || '',
  };
  const container = document.querySelector(opts.container || '.toast-container.top-0.end-0') || {
    appendChild() { },
  };
  const wrapper = document.createElement('div');
  wrapper.className = 'toast show';
  wrapper.setAttribute('role', 'alert');
  wrapper.setAttribute('aria-live', 'assertive');
  wrapper.setAttribute('aria-atomic', 'true');
  wrapper.innerHTML = `
    <div class="toast-header"></div>
    <div class="toast-body"></div>
  `;
  if (opts.title) wrapper.querySelector('.toast-header').textContent = opts.title;
  else wrapper.querySelector('.toast-header').remove();
  wrapper.querySelector('.toast-body').textContent = message;
  (container.appendChild ? container : document.body).appendChild(wrapper);
  const instance = Toast.getOrCreateInstance(wrapper, { delay: opts.delay, autohide: true });
  instance.show();
  return wrapper;
};

// Auto-initialize common data-api components
function autoInit() {
  if (typeof document === 'undefined') return;
  // Buttons
  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-budu-toggle="button"]');
    if (btn) {
      const instance = Button.getOrCreateInstance(btn);
      instance.toggle();
    }
  }, true);
  // Ripple on dynamic content is initialized on DOM mutations
}

if (typeof document === 'undefined') {
  // SSR-safe: no auto-init
} else if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit);
} else {
  autoInit();
}

// Public default export
export default budu;
if (typeof window !== 'undefined') {
  window.budu = budu;
}