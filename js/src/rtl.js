// =====================================================================
// BOODOO JS — RTL & Layout Direction Manager
// Dynamic RTL/LTR switching, OS/HTML sync, and localStorage persistence.
// =====================================================================

const STORAGE_KEY = 'boodoo-direction';

export const rtl = {
  /**
   * Get the current document layout direction ('ltr' or 'rtl').
   * @returns {'ltr' | 'rtl'}
   */
  get() {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'rtl' || stored === 'ltr') return stored;
    }
    if (typeof document !== 'undefined') {
      const htmlDir = document.documentElement.getAttribute('dir');
      if (htmlDir === 'rtl' || htmlDir === 'ltr') return htmlDir;
      const bodyDir = document.body ? document.body.getAttribute('dir') : null;
      if (bodyDir === 'rtl' || bodyDir === 'ltr') return bodyDir;
    }
    return 'ltr';
  },

  /**
   * Whether the active layout is right-to-left.
   * @returns {boolean}
   */
  isRtl() {
    return this.get() === 'rtl';
  },

  /**
   * Set explicit layout direction ('ltr' | 'rtl' | 'auto').
   * @param {'ltr' | 'rtl' | 'auto'} val
   */
  set(val) {
    if (typeof document === 'undefined') return;
    const resolved =
      val === 'auto'
        ? typeof navigator !== 'undefined' && /^(ar|he|fa|ur|ps|sd|ug|yi)/i.test(navigator.language)
          ? 'rtl'
          : 'ltr'
        : val;

    document.documentElement.setAttribute('dir', resolved);
    if (document.body) {
      document.body.setAttribute('dir', resolved);
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, val);
    }

    document.dispatchEvent(
      new CustomEvent('boodoo.direction.change', { detail: { dir: val, resolved } })
    );
  },

  /**
   * Toggle between 'ltr' and 'rtl'.
   * @returns {'ltr' | 'rtl'}
   */
  toggle() {
    const next = this.isRtl() ? 'ltr' : 'rtl';
    this.set(next);
    return next;
  },

  /**
   * Initialize layout direction from storage or markup, and bind triggers.
   */
  init() {
    if (typeof document === 'undefined') return;
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      this.set(stored);
    }

    // Auto-bind toggle buttons with [data-boodoo-toggle="direction"]
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-boodoo-toggle="direction"]');
      if (btn) {
        e.preventDefault();
        const targetDir = btn.getAttribute('data-boodoo-direction-value');
        if (targetDir) {
          this.set(targetDir);
        } else {
          this.toggle();
        }
      }
    });
  },
};

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => rtl.init());
  } else {
    rtl.init();
  }
}
