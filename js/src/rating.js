// =====================================================================
// BOODOO JS — Rating Component
// =====================================================================

import { BaseComponent, initDataApi } from './base-component.js';

export class Rating extends BaseComponent {
  static get NAME() {
    return 'rating';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._stars = Array.from(this._element.querySelectorAll('.rating-star, [data-rating-value]'));
    this._value = parseInt(this._element.getAttribute('data-rating-value') || '0', 10);
    this._isReadonly =
      this._element.classList.contains('rating-readonly') ||
      this._element.hasAttribute('data-readonly');
    this._starHandlers = [];
    this._init();
  }

  _init() {
    if (!this._element.getAttribute('role')) {
      this._element.setAttribute('role', 'radiogroup');
    }
    if (!this._element.getAttribute('aria-label')) {
      this._element.setAttribute('aria-label', 'Rating');
    }
    this._updateAccessibility();
    this._renderStars(this._value);
    if (!this._isReadonly) {
      this._bindEvents();
    }
  }

  _updateAccessibility() {
    const total = this._stars.length;
    this._stars.forEach((star, index) => {
      const val = index + 1;
      star.setAttribute('role', 'radio');
      star.setAttribute('aria-label', `${val} of ${total} stars`);
      star.setAttribute('aria-checked', val === this._value ? 'true' : 'false');
      if (this._isReadonly) {
        star.setAttribute('tabindex', '-1');
        star.setAttribute('aria-disabled', 'true');
      } else {
        const isCurrent = this._value === 0 ? index === 0 : val === this._value;
        star.setAttribute('tabindex', isCurrent ? '0' : '-1');
      }
    });
  }

  _bindEvents() {
    this._starHandlers = [];
    this._stars.forEach((star, index) => {
      const val = index + 1;
      const onMouseEnter = () => this._renderStars(val);
      const onClick = () => {
        this.setValue(val);
        this._element.dispatchEvent(
          new CustomEvent('boodoo.rating.change', {
            bubbles: true,
            detail: { value: this._value },
          })
        );
      };
      const onKeyDown = (e) => {
        if (this._isReadonly) return;
        let handled = false;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          handled = true;
          const nextIndex = Math.min(this._stars.length - 1, index + 1);
          this.setValue(nextIndex + 1);
          this._stars[nextIndex].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          handled = true;
          const prevIndex = Math.max(0, index - 1);
          this.setValue(prevIndex + 1);
          this._stars[prevIndex].focus();
        } else if (e.key === ' ' || e.key === 'Enter') {
          handled = true;
          this.setValue(val);
        }
        if (handled) {
          e.preventDefault();
          this._element.dispatchEvent(
            new CustomEvent('boodoo.rating.change', {
              bubbles: true,
              detail: { value: this._value },
            })
          );
        }
      };

      star.addEventListener('mouseenter', onMouseEnter);
      star.addEventListener('click', onClick);
      star.addEventListener('keydown', onKeyDown);

      this._starHandlers.push({ star, onMouseEnter, onClick, onKeyDown });
    });

    this._onMouseLeave = () => this._renderStars(this._value);
    this._element.addEventListener('mouseleave', this._onMouseLeave);
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
    this._updateAccessibility();
  }

  dispose() {
    if (this._starHandlers) {
      this._starHandlers.forEach(({ star, onMouseEnter, onClick, onKeyDown }) => {
        star.removeEventListener('mouseenter', onMouseEnter);
        star.removeEventListener('click', onClick);
        star.removeEventListener('keydown', onKeyDown);
      });
      this._starHandlers = [];
    }
    if (this._onMouseLeave && this._element) {
      this._element.removeEventListener('mouseleave', this._onMouseLeave);
      this._onMouseLeave = null;
    }
    this._stars = [];
    super.dispose();
  }
}

initDataApi(Rating, '.rating, [data-boodoo="rating"]');
