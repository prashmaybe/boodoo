// =====================================================================
// BOODOO JS — OTP / PIN Code Input
// =====================================================================

import { BaseComponent } from './base-component.js';

export class OTP extends BaseComponent {
  static get NAME() {
    return 'otp';
  }


  constructor(element, config = {}) {
    super(element, config);
    this._inputs = Array.from(this._element.querySelectorAll('.form-otp-input, input'));
    this._bindEvents();
  }

  _bindEvents() {
    this._inputs.forEach((input, index) => {
      input.setAttribute('inputmode', 'numeric');
      input.setAttribute('maxlength', '1');

      input.addEventListener('input', (e) => {
        const val = e.target.value;
        if (val.length >= 1) {
          e.target.value = val.slice(-1);
          if (index < this._inputs.length - 1) {
            this._inputs[index + 1].focus();
            this._inputs[index + 1].select();
          }
        }
        this._triggerChange();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
          this._inputs[index - 1].focus();
          this._inputs[index - 1].value = '';
          this._triggerChange();
        } else if (e.key === 'ArrowLeft' && index > 0) {
          this._inputs[index - 1].focus();
        } else if (e.key === 'ArrowRight' && index < this._inputs.length - 1) {
          this._inputs[index + 1].focus();
        }
      });

      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
        if (!pasteData) return;

        pasteData.split('').slice(0, this._inputs.length).forEach((char, i) => {
          if (this._inputs[i]) {
            this._inputs[i].value = char;
          }
        });

        const nextIndex = Math.min(pasteData.length, this._inputs.length - 1);
        this._inputs[nextIndex].focus();
        this._triggerChange();
      });
    });
  }

  _triggerChange() {
    const value = this.getValue();
    this._element.dispatchEvent(new CustomEvent('boodoo.otp.change', {
      bubbles: true,
      detail: { value, isComplete: value.length === this._inputs.length }
    }));
  }

  getValue() {
    return this._inputs.map((input) => input.value).join('');
  }

  setValue(val) {
    const chars = String(val || '').split('');
    this._inputs.forEach((input, i) => {
      input.value = chars[i] || '';
    });
    this._triggerChange();
  }

  clear() {
    this._inputs.forEach((input) => { input.value = ''; });
    if (this._inputs[0]) this._inputs[0].focus();
    this._triggerChange();
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.form-otp, [data-boodoo="otp"]').forEach((el) => {
      OTP.getOrCreateInstance(el);
    });
  });
}
