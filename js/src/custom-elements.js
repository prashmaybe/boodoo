// =====================================================================
// BOODOO JS — Web Components / Custom Elements Wrapper
// =====================================================================

import { OTP } from './otp.js';
import { Rating } from './rating.js';
import { theme } from './theme.js';

export function registerCustomElements() {
  if (typeof customElements === 'undefined') return;

  // <bd-theme-toggle>
  if (!customElements.get('bd-theme-toggle')) {
    class BdThemeToggle extends HTMLElement {
      connectedCallback() {
        this.style.cursor = 'pointer';
        this.innerHTML = this.innerHTML || '🌓 Toggle Theme';
        this.addEventListener('click', () => theme.toggle());
      }
    }
    customElements.define('bd-theme-toggle', BdThemeToggle);
  }

  // <bd-otp length="4">
  if (!customElements.get('bd-otp')) {
    class BdOtp extends HTMLElement {
      connectedCallback() {
        const length = parseInt(this.getAttribute('length') || '4', 10);
        let inputs = '';
        for (let i = 0; i < length; i++) {
          inputs += `<input type="text" class="form-otp-input" id="otpInput${i + 1}" name="otpDigit${i + 1}">`;
        }
        this.className = 'form-otp';
        this.innerHTML = inputs;
        OTP.getOrCreateInstance(this);
      }
    }
    customElements.define('bd-otp', BdOtp);
  }

  // <bd-rating value="4" max="5">
  if (!customElements.get('bd-rating')) {
    class BdRating extends HTMLElement {
      connectedCallback() {
        const max = parseInt(this.getAttribute('max') || '5', 10);
        const value = parseInt(this.getAttribute('value') || '0', 10);
        let stars = '';
        for (let i = 0; i < max; i++) {
          stars += `<span class="rating-star">★</span>`;
        }
        this.className = 'rating';
        this.setAttribute('data-rating-value', value);
        this.innerHTML = stars;
        Rating.getOrCreateInstance(this);
      }
    }
    customElements.define('bd-rating', BdRating);
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerCustomElements);
  } else {
    registerCustomElements();
  }
}
