// =====================================================================
// BOODOO JS — Chip & Tag Input Component
// Handles removable chips and tag creation upon Enter or comma.
// =====================================================================

import { BaseComponent } from './base-component.js';
import { triggerEvent } from './util.js';

export class ChipInput extends BaseComponent {
  static get NAME() {
    return 'chipInput';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._input = this._element.querySelector('.chip-input-field');
    this._bindEvents();
  }

  _bindEvents() {
    // 1. Remove chip click
    this._element.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.chip-remove');
      if (removeBtn) {
        e.preventDefault();
        const chip = removeBtn.closest('.chip');
        if (chip) {
          const text = chip.querySelector('span') ? chip.querySelector('span').innerText : chip.innerText;
          chip.remove();
          triggerEvent(this._element, 'boodoo.chip.remove', { text, chip });
        }
      } else if (this._input && e.target === this._element) {
        this._input.focus();
      }
    });

    // 2. Add chip on Enter or comma
    if (this._input) {
      this._input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          const val = this._input.value.trim().replace(/^,+|,+$/g, '');
          if (val) {
            this.addChip(val);
            this._input.value = '';
          }
        } else if (e.key === 'Backspace' && !this._input.value) {
          const chips = this._element.querySelectorAll('.chip');
          if (chips.length > 0) {
            const lastChip = chips[chips.length - 1];
            lastChip.remove();
            triggerEvent(this._element, 'boodoo.chip.remove', { chip: lastChip });
          }
        }
      });
    }
  }

  addChip(text, variant = '') {
    const chip = document.createElement('span');
    chip.className = `chip ${variant}`.trim();
    chip.innerHTML = `<span>${text}</span><button type="button" class="chip-remove" aria-label="Remove tag">&times;</button>`;

    if (this._input) {
      this._element.insertBefore(chip, this._input);
    } else {
      this._element.appendChild(chip);
    }

    triggerEvent(this._element, 'boodoo.chip.add', { text, chip });
  }

  getTags() {
    const chips = Array.from(this._element.querySelectorAll('.chip'));
    return chips.map((c) => {
      const span = c.querySelector('span');
      return span ? span.innerText.trim() : c.innerText.replace('×', '').trim();
    });
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Interactive tag input containers
    document.querySelectorAll('.chip-input-container, [data-boodoo="chip-input"]').forEach((el) => {
      ChipInput.getOrCreateInstance(el);
    });

    // Standalone removable chips
    document.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.chip .chip-remove');
      if (removeBtn && !removeBtn.closest('.chip-input-container')) {
        const chip = removeBtn.closest('.chip');
        if (chip) chip.remove();
      }
    });
  });
}
