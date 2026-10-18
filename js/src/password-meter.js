// =====================================================================
// BOODOO JS — Password Strength Meter
// Evaluates password strength and updates visual indicators dynamically.
// =====================================================================

import { BaseComponent } from './base-component.js';
import { triggerEvent } from './util.js';

export class PasswordMeter extends BaseComponent {
  static get NAME() {
    return 'passwordMeter';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._targetInput = this._config.target
      ? (typeof document !== 'undefined' ? document.querySelector(this._config.target) : null)
      : (this._element.parentElement ? this._element.parentElement.querySelector('input[type="password"]') : null);

    this._onInput = this._onInput.bind(this);
    if (this._targetInput) {
      this._targetInput.addEventListener('input', this._onInput);
      this.evaluate(this._targetInput.value);
    }
  }

  _onInput(e) {
    this.evaluate(e.target.value);
  }

  evaluate(password = '') {
    let score = 0;
    if (!password) {
      this._element.removeAttribute('data-strength');
      const label = this._element.querySelector('.password-meter-label');
      if (label) label.textContent = '';
      return 0;
    }

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    this._element.setAttribute('data-strength', String(score));
    const label = this._element.querySelector('.password-meter-label');
    if (label) {
      const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
      label.textContent = labels[score] || '';
    }

    triggerEvent(this._element, 'boodoo.passwordmeter.change', { score, password });
    return score;
  }

  dispose() {
    if (this._targetInput) {
      this._targetInput.removeEventListener('input', this._onInput);
    }
    super.dispose();
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.password-meter, [data-boodoo="password-meter"]').forEach((el) => {
      PasswordMeter.getOrCreateInstance(el);
    });
  });
}
