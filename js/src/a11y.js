// =====================================================================
// BOODOO JS — Accessibility (a11y) & WAI-ARIA Depth Suite
// Screen-reader live announcer, roving tabindex manager, focus trap utilities,
// and accessible component attributes.
// =====================================================================

/**
 * Creates or retrieves a persistent aria-live polite region for screen readers.
 * @param {string} message - Announcement text
 * @param {'polite' | 'assertive'} politeness - Politeness level
 */
export function announce(message, politeness = 'polite') {
  if (typeof document === 'undefined') return;

  const id = `boodoo-a11y-live-${politeness}`;
  let liveRegion = document.getElementById(id);

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = id;
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.setAttribute('aria-atomic', 'true');
    // Visually hidden CSS properties
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.padding = '0';
    liveRegion.style.margin = '-1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    liveRegion.style.whiteSpace = 'nowrap';
    liveRegion.style.border = '0';

    document.body.appendChild(liveRegion);
  }

  // Clear and update to ensure screen readers announce updates reliably
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 50);
}

/**
 * Manages roving tabindex across a collection of interactive elements
 * (menus, comboboxes, tree items, tab bars, toolbars).
 * @param {HTMLElement[] | NodeListOf<HTMLElement>} items
 * @param {number} activeIndex
 */
export function setRovingTabindex(items, activeIndex = 0) {
  if (!items || !items.length) return;
  const list = Array.from(items);
  list.forEach((item, idx) => {
    if (idx === activeIndex) {
      item.setAttribute('tabindex', '0');
    } else {
      item.setAttribute('tabindex', '-1');
    }
  });
}

/**
 * Traps keyboard focus within a container element (for Dialogs, Modals, Drawers).
 * Returns a teardown function to restore focus and remove listeners.
 * @param {HTMLElement} container
 * @param {Object} options
 * @param {HTMLElement} [options.initialFocus]
 * @returns {() => void} Teardown function
 */
export function createFocusTrap(container, options = {}) {
  if (!container || typeof document === 'undefined') {
    return () => {};
  }

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'area[href]',
  ].join(', ');

  const previouslyFocused = document.activeElement;

  const getFocusable = () => {
    return Array.from(container.querySelectorAll(focusableSelector)).filter((el) => {
      return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    const focusable = getFocusable();
    if (!focusable.length) {
      e.preventDefault();
      container.focus?.();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first || !container.contains(document.activeElement)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last || !container.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  // Focus initial element or first focusable
  setTimeout(() => {
    if (options.initialFocus && container.contains(options.initialFocus)) {
      options.initialFocus.focus();
    } else {
      const focusable = getFocusable();
      if (focusable.length) {
        focusable[0].focus();
      } else {
        container.setAttribute('tabindex', '-1');
        container.focus();
      }
    }
  }, 20);

  return function releaseFocusTrap() {
    document.removeEventListener('keydown', handleKeyDown);
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus();
    }
  };
}

export const a11y = {
  announce,
  setRovingTabindex,
  createFocusTrap,
};
