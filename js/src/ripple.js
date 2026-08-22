// BUDU — Ripple (Material Design)
// Creates ink ripples on elements with the `.ripple` class or [data-budu-ripple].

export function initRipple(root = document) {
  const surfaces = Array.from(root.querySelectorAll ? root.querySelectorAll('.ripple, [data-budu-ripple]') : []);
  surfaces.forEach((surface) => {
    if (surface._buduRippleBound) return;
    surface._buduRippleBound = true;
    surface.addEventListener('pointerdown', (e) => {
      createRipple(surface, e);
    });
    surface.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && surface === document.activeElement) {
        const rect = surface.getBoundingClientRect();
        createRipple(surface, { clientX: rect.left + rect.width / 2, clientY: rect.top + rect.height / 2 });
      }
    });
  });
}

function createRipple(surface, event) {
  const rect = surface.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = (event.clientX || 0) - rect.left - size / 2;
  const y = (event.clientY || 0) - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  surface.appendChild(ripple);

  ripple.addEventListener('animationend', () => ripple.remove());
}

if (typeof document !== 'undefined' && document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initRipple());
} else if (typeof document !== 'undefined') {
  initRipple();
}

export default initRipple;