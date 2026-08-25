// =====================================================================
// BOODOO JS — Rating Component
// =====================================================================

import { BaseComponent } from './base-component.js';

export class Rating extends BaseComponent {
  static get NAME() {
    return 'rating';
  }


  constructor(element, config = {}) {
    super(element, config);
    this._stars = Array.from(this._element.querySelectorAll('.rating-star, [data-rating-value]'));
    this._value = parseInt(this._element.getAttribute('data-rating-value') || '0', 10);
    this._isReadonly = this._element.classList.contains('rating-readonly') || this._element.hasAttribute('data-readonly');
    this._init();
  }

  _init() {
    this._renderStars(this._value);
    if (!this._isReadonly) {
      this._bindEvents();
    }
  }

  _bindEvents() {
    this._stars.forEach((star, index) => {
      const val = index + 1;
      star.addEventListener('mouseenter', () => {
        this._renderStars(val);
      });

      star.addEventListener('click', () => {
        this._value = val;
        this._renderStars(this._value);
        this._element.setAttribute('data-rating-value', this._value);
        this._element.dispatchEvent(new CustomEvent('boodoo.rating.change', {
          bubbles: true,
          detail: { value: this._value }
        }));
      });
    });

    this._element.addEventListener('mouseleave', () => {
      this._renderStars(this._value);
    });
  }

  _renderStars(rating) {
    this._stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('filled', 'active');
      } else {
        star.classList.remove('filled', 'active');
      }
    });
  }

  getValue() {
    return this._value;
  }

  setValue(val) {
    this._value = parseInt(val, 10) || 0;
    this._renderStars(this._value);
    this._element.setAttribute('data-rating-value', this._value);
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.rating, [data-boodoo="rating"]').forEach((el) => {
      Rating.getOrCreateInstance(el);
    });
  });
}
