// =====================================================================
// BOODOO — Svelte 5 / Svelte 4 Headless & Action Primitives
// Zero-dependency actions and component wrappers for Svelte applications
// =====================================================================

export function disclosure(node, options = {}) {
  let isOpen = Boolean(options.defaultOpen);

  function updateAria() {
    node.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  function toggle() {
    isOpen = !isOpen;
    updateAria();
    node.dispatchEvent(new CustomEvent('boodoo:toggle', { detail: { isOpen } }));
  }

  node.addEventListener('click', toggle);
  updateAria();

  return {
    update(newOptions = {}) {
      if (newOptions.open !== undefined) {
        isOpen = Boolean(newOptions.open);
        updateAria();
      }
    },
    destroy() {
      node.removeEventListener('click', toggle);
    },
  };
}

export function tooltip(node, options = {}) {
  const content = typeof options === 'string' ? options : options.content || '';
  if (!content) return;

  node.setAttribute('title', content);
  node.setAttribute('data-boodoo-tooltip', 'true');

  return {
    update(newContent) {
      const text = typeof newContent === 'string' ? newContent : newContent.content || '';
      node.setAttribute('title', text);
    },
    destroy() {
      node.removeAttribute('data-boodoo-tooltip');
    },
  };
}
