// BUDU — Button
// Toggle active/loading states on buttons and checkbox/radio groups.

import { BaseComponent } from './base-component.js';
import { getElementFromSelector, triggerEvent } from './util.js';

export class Button extends BaseComponent {
  static get NAME() { return 'button'; }

  static get selector() { return '[data-budu-toggle="button"]'; }

  toggle() {
    const button = this._element;
    const isActive = button.classList.contains('active');
    if (!triggerEvent(button, 'budu.click.button', { isActive })) return;

    // In a group?
    const group = button.closest('[data-budu-group]') || button.closest('.btn-group');
    const isCheckbox = button.type === 'checkbox';
    const isRadio = button.type === 'radio' || (group && button.getAttribute('role') === 'radio');

    if (isCheckbox) {
      button.classList.toggle('active');
      button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
      // toggle the sibling checkbox input if present
      const input = button.querySelector('input[type="checkbox"]');
      if (input) input.checked = !input.checked;
    } else if (isRadio || group) {
      const buttons = Array.from(group ? group.querySelectorAll(':scope > [data-budu-toggle="button"], :scope > .btn-check + [data-budu-toggle="button"]') : [button]);
      buttons.forEach((b) => {
        b.classList.remove('active');
        const input = b.querySelector('input[type="radio"], input[type="checkbox"]');
        if (input) input.checked = false;
      });
      button.classList.add('active');
      const radio = button.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      button.setAttribute('aria-pressed', 'true');
    } else {
      button.classList.toggle('active');
      button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
    }
    triggerEvent(button, 'budu.toggled.button');
  }

  // Loading state helper
  setLoading(loading) {
    const el = this._element;
    el.classList.toggle('btn-loading', loading);
    el.setAttribute('aria-busy', String(loading));
    el.setAttribute('aria-disabled', String(loading));
  }
}

export default Button;