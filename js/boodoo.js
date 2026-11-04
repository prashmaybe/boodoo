// =====================================================================
// BOODOO JS — Main entry (bundle)
// =====================================================================
import { Alert } from './src/alert.js';
import { Button } from './src/button.js';
import { Collapse } from './src/collapse.js';
import './src/accordion.js';
import { Dropdown } from './src/dropdown.js';
import { Modal } from './src/modal.js';
import { Offcanvas } from './src/offcanvas.js';
import { Tab } from './src/tab.js';
import { Toast } from './src/toast.js';
import { Tooltip, Popover } from './src/tooltip.js';
import { Carousel } from './src/carousel.js';
import { ScrollSpy } from './src/scrollspy.js';
import { initRipple } from './src/ripple.js';
import { initDataApi } from './src/base-component.js';
import { enableDismissTrigger, escapeHtml, foldAccents } from './src/util.js';
import { theme } from './src/theme.js';
import { OTP } from './src/otp.js';
import { Rating } from './src/rating.js';
import { TreeView } from './src/tree-view.js';
import { clipboard } from './src/clipboard.js';
import { CommandPalette } from './src/command-palette.js';
import { BottomSheet } from './src/bottom-sheet.js';
import { registerCustomElements } from './src/custom-elements.js';
import { DataTable } from './src/data-table.js';
import { Sidebar } from './src/sidebar.js';
import { ContextMenu } from './src/context-menu.js';
import { ChipInput } from './src/chip-input.js';
import { Stepper } from './src/stepper.js';
import { Combobox } from './src/combobox.js';
import { Splitter } from './src/splitter.js';
import { SpeedDial } from './src/speed-dial.js';
import { Lightbox } from './src/lightbox.js';
import { Banner } from './src/banner.js';
import { Dropzone } from './src/dropzone.js';
import { a11y } from './src/a11y.js';
import { FloatingBar } from './src/floating-bar.js';
import { ImageCompare } from './src/image-compare.js';
import { PasswordMeter } from './src/password-meter.js';
import { FABDock } from './src/fab-dock.js';
import { DialogFullscreen } from './src/dialog-fullscreen.js';
import { Tour } from './src/tour.js';
import { Chart } from './src/chart.js';
import { FilterBar, TransferList, ColorPicker, BackToTop } from './src/advanced-components.js';

// Wire up generic data-boodoo-dismiss triggers
enableDismissTrigger(Alert, (instance, event, toggler) => {
  const type = toggler
    ? toggler.getAttribute('data-boodoo-dismiss')
    : instance._element.getAttribute('data-boodoo-dismiss');
  if (type === 'alert') instance.hide();
});

enableDismissTrigger(Banner, (instance, event, toggler) => {
  const type = toggler
    ? toggler.getAttribute('data-boodoo-dismiss')
    : instance._element.getAttribute('data-boodoo-dismiss');
  if (type === 'banner') instance.hide();
});

enableDismissTrigger(BottomSheet, (instance, event, toggler) => {
  const type = toggler
    ? toggler.getAttribute('data-boodoo-dismiss')
    : instance._element.getAttribute('data-boodoo-dismiss');
  if (type === 'bottom-sheet') instance.hide();
});

enableDismissTrigger(DialogFullscreen, (instance, event, toggler) => {
  const type = toggler
    ? toggler.getAttribute('data-boodoo-dismiss')
    : instance._element.getAttribute('data-boodoo-dismiss');
  if (type === 'dialog-fullscreen') instance.hide();
});

enableDismissTrigger(Toast, (instance, event, toggler) => {
  const type = toggler
    ? toggler.getAttribute('data-boodoo-dismiss')
    : instance._element.getAttribute('data-boodoo-dismiss');
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
  Stepper,
  Combobox,
  Splitter,
  SpeedDial,
  Lightbox,
  Banner,
  Dropzone,
  FloatingBar,
  ImageCompare,
  PasswordMeter,
  FABDock,
  DialogFullscreen,
  Tour,
  Chart,
  a11y,
  registerCustomElements,
  FilterBar,
  TransferList,
  ColorPicker,
  BackToTop,
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

  let container = opts.container
    ? document.querySelector(opts.container)
    : document.querySelector('#landingToasts') || document.querySelector('.toast-container');
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

  const safeTitle = escapeHtml(opts.title);
  const safeMessage = escapeHtml(message);

  if (opts.title) {
    wrapper.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto"><span>${safeTitle}</span></strong>
        <button type="button" class="btn-close" data-boodoo-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body"><span>${safeMessage}</span></div>
    `;
  } else {
    wrapper.innerHTML = `
      <div class="d-flex">
        <div class="toast-body"><span>${safeMessage}</span></div>
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
boodoo.toast.success = (message, options = {}) =>
  createToast(message, { ...options, variant: 'success' });
boodoo.toast.danger = (message, options = {}) =>
  createToast(message, { ...options, variant: 'danger' });
boodoo.toast.error = boodoo.toast.danger;
boodoo.toast.warning = (message, options = {}) =>
  createToast(message, { ...options, variant: 'warning' });
boodoo.toast.info = (message, options = {}) =>
  createToast(message, { ...options, variant: 'info' });

// Auto-initialize common data-api components
function autoInit() {
  if (typeof document === 'undefined') return;
  if (document._boodooAutoInit) return;
  document._boodooAutoInit = true;
  // Buttons
  document.addEventListener(
    'click',
    (event) => {
      const btn = event.target.closest('[data-boodoo-toggle="button"]');
      if (btn) {
        const instance = Button.getOrCreateInstance(btn);
        instance.toggle();
      }
    },
    true
  );
  // Ripple on dynamic content is initialized on DOM mutations
}

if (typeof document === 'undefined') {
  // SSR-safe / React Native headless: no auto-init
} else {
  // Support standard Web, Cordova, and PhoneGap lifecycles
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
  // Re-run or hook initialization on Cordova / PhoneGap device readiness
  document.addEventListener('deviceready', autoInit, false);
}

// Public default export
export default boodoo;
export {
  Alert,
  Banner,
  BottomSheet,
  Button,
  ChipInput,
  Collapse,
  Combobox,
  CommandPalette,
  ContextMenu,
  DataTable,
  DialogFullscreen,
  Dropdown,
  Dropzone,
  FABDock,
  FloatingBar,
  ImageCompare,
  Lightbox,
  Modal,
  Offcanvas,
  OTP,
  PasswordMeter,
  Popover,
  Rating,
  ScrollSpy,
  Sidebar,
  SpeedDial,
  Splitter,
  Stepper,
  Tab,
  Toast,
  Tooltip,
  Tour,
  Chart,
  TreeView,
  Carousel,
  clipboard,
  initDataApi,
  initRipple,
  registerCustomElements,
  theme,
  a11y,
  FilterBar,
  TransferList,
  ColorPicker,
  BackToTop,
  foldAccents,
};
