// =====================================================================
// BOODOO JS — Main entry (bundle)
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
import { theme } from './theme.js';
import { OTP } from './otp.js';
import { Rating } from './rating.js';
import { TreeView } from './tree-view.js';
import { clipboard } from './clipboard.js';
import { CommandPalette } from './command-palette.js';
import { BottomSheet } from './bottom-sheet.js';
import { registerCustomElements } from './custom-elements.js';
import { DataTable } from './data-table.js';
import { Sidebar } from './sidebar.js';
import { ContextMenu } from './context-menu.js';
import { ChipInput } from './chip-input.js';

// Wire up generic data-boodoo-dismiss triggers
enableDismissTrigger(Alert, (instance) => {
  const type = instance._element.getAttribute('data-boodoo-dismiss');
  if (type === 'alert') instance.hide();
});

enableDismissTrigger(BottomSheet, (instance) => {
  const type = instance._element.getAttribute('data-boodoo-dismiss');
  if (type === 'bottom-sheet') instance.hide();
});

enableDismissTrigger(Toast, (instance) => {
  const type = instance._element.getAttribute('data-boodoo-dismiss');
  if (type === 'toast') instance.hide();
});

// Global API
const boodoo = {
  Alert,
  BottomSheet,
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
  theme,
  OTP,
  Rating,
  TreeView,
  clipboard,
  CommandPalette,
  DataTable,
  Sidebar,
  ContextMenu,
  ChipInput,
  registerCustomElements,
};

// Programmatic Toast API: boodoo.toast(message, options) / boodoo.toast.show() / .success() / etc.
function createToast(message, options = {}) {
  const opts = {
    title: '',
    variant: 'default',
    delay: 4500,
    container: null,
    ...options,
  };

  let container = opts.container ? document.querySelector(opts.container) : (document.querySelector('#landingToasts') || document.querySelector('.toast-container'));
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '1090';
    document.body.appendChild(container);
  }

  const variantClass = opts.variant && opts.variant !== 'default' ? `text-bg-${opts.variant}` : '';
  const wrapper = document.createElement('div');
  wrapper.className = `toast align-items-center shadow-lg ${variantClass}`.trim();
  wrapper.setAttribute('role', 'alert');
  wrapper.setAttribute('aria-live', 'assertive');
  wrapper.setAttribute('aria-atomic', 'true');

  if (opts.title) {
    wrapper.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto"><span>${opts.title}</span></strong>
        <button type="button" class="btn-close" data-boodoo-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body"><span>${message}</span></div>
    `;
  } else {
    wrapper.innerHTML = `
      <div class="d-flex">
        <div class="toast-body"><span>${message}</span></div>
        <button type="button" class="btn-close ${opts.variant && opts.variant !== 'light' ? 'btn-close-white' : ''} me-2 m-auto" data-boodoo-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
  }

  let instance = null;
  const closeBtn = wrapper.querySelector('.btn-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (instance) {
        instance.hide();
      }
    });
  }

  container.appendChild(wrapper);
  instance = Toast.getOrCreateInstance(wrapper, { delay: opts.delay, autohide: true });
  instance.show();

  wrapper.addEventListener('boodoo.hidden.toast', () => {
    if (wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
  });

  return instance;
}

boodoo.toast = function toast(message, options) {
  return createToast(message, options);
};
boodoo.toast.show = (message, options) => createToast(message, options);
boodoo.toast.success = (message, options = {}) => createToast(message, { ...options, variant: 'success' });
boodoo.toast.danger = (message, options = {}) => createToast(message, { ...options, variant: 'danger' });
boodoo.toast.error = boodoo.toast.danger;
boodoo.toast.warning = (message, options = {}) => createToast(message, { ...options, variant: 'warning' });
boodoo.toast.info = (message, options = {}) => createToast(message, { ...options, variant: 'info' });


// Auto-initialize common data-api components
function autoInit() {
  if (typeof document === 'undefined') return;
  // Buttons
  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-boodoo-toggle="button"]');
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
export default boodoo;
export { theme, OTP, Rating, TreeView, clipboard, CommandPalette, BottomSheet, registerCustomElements };

if (typeof window !== 'undefined') {
  window.boodoo = boodoo;
}