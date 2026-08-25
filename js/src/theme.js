// =====================================================================
// BOODOO JS — Theme Manager
// Light/Dark mode toggler, OS sync, and local storage persistence.
// =====================================================================

const STORAGE_KEY = 'boodoo-theme';

export const theme = {
  get() {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  },

  set(val) {
    if (typeof document === 'undefined') return;
    const resolved = val === 'auto'
      ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : val;

    document.documentElement.setAttribute('data-boodoo-theme', resolved);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, val);
    }
    document.dispatchEvent(new CustomEvent('boodoo.theme.change', { detail: { theme: val, resolved } }));
  },

  toggle() {
    const current = this.get();
    const next = current === 'dark' ? 'light' : 'dark';
    this.set(next);
    return next;
  },

  init() {
    if (typeof document === 'undefined') return;
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      this.set(stored);
    }

    // Auto-bind toggle buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-boodoo-toggle="theme"]');
      if (btn) {
        e.preventDefault();
        const targetTheme = btn.getAttribute('data-boodoo-theme-value');
        if (targetTheme) {
          this.set(targetTheme);
        } else {
          this.toggle();
        }
      }
    });

    // Listen for OS scheme change
    if (typeof window !== 'undefined' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const current = localStorage.getItem(STORAGE_KEY);
        if (!current || current === 'auto') {
          this.set('auto');
        }
      });
    }
  }
};

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => theme.init());
  } else {
    theme.init();
  }
}
