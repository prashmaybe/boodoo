// BOODOO — Accordion
// Pure markup pattern built on Collapse (no extra JS needed for basic use).
// This module wires data-boodoo-parent to close siblings like Bootstrap.

import { Collapse } from './collapse.js';
import { getElementFromSelector, elements } from './util.js';

export function initAccordion() {
  const parents = elements('[data-boodoo-accordion]');
  parents.forEach((parent) => {
    const togglers = elements(`${parent} [data-boodoo-toggle="collapse"]`);
    togglers.forEach((toggler) => {
      toggler.addEventListener('click', () => {
        const target = getElementFromSelector(toggler);
        if (target && target.classList.contains('show')) {
          // closing this one — reopen hasn't happened, skip
          return;
        }
        // Open one, close all siblings
        const siblings = elements(`${parent} [data-boodoo-toggle="collapse"]`).filter(
          (t) => t !== toggler
        );
        siblings.forEach((t) => {
          const siblingTarget = getElementFromSelector(t);
          if (siblingTarget && siblingTarget.classList.contains('show')) {
            const instance = Collapse.getInstance(siblingTarget);
            if (instance) instance.hide();
          }
        });
      });
    });
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordion);
  } else {
    initAccordion();
  }
}

export default initAccordion;