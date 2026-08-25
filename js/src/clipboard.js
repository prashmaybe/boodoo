// =====================================================================
// BOODOO JS — Clipboard Helper
// =====================================================================

export const clipboard = {
  async copy(text) {
    if (!navigator.clipboard) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
      } catch (err) {
        document.body.removeChild(textarea);
        return false;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      return false;
    }
  },

  init() {
    if (typeof document === 'undefined') return;
    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-boodoo-copy], .btn-copy, .btn-clipboard');
      if (btn) {
        e.preventDefault();
        const targetSelector = btn.getAttribute('data-boodoo-copy-target');
        let text = btn.getAttribute('data-boodoo-copy');

        if (targetSelector) {
          const targetEl = document.querySelector(targetSelector);
          if (targetEl) {
            text = targetEl.value || targetEl.textContent || '';
          }
        }

        if (text) {
          const success = await clipboard.copy(text);
          if (success) {
            const originalText = btn.getAttribute('data-original-title') || btn.innerText;
            btn.setAttribute('data-original-title', originalText);
            btn.classList.add('copied');

            const feedback = btn.getAttribute('data-boodoo-copy-feedback') || 'Copied!';
            const icon = btn.querySelector('.copy-icon');
            if (icon) {
              icon.textContent = '✓';
            }

            setTimeout(() => {
              btn.classList.remove('copied');
              if (icon) icon.textContent = '';
            }, 2000);

            btn.dispatchEvent(new CustomEvent('boodoo.clipboard.copied', {
              bubbles: true,
              detail: { text }
            }));
          }
        }
      }
    });
  }
};

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => clipboard.init());
  } else {
    clipboard.init();
  }
}
