// =====================================================================
// BOODOO JS — Image Comparison Slider
// Enables interactive before/after image comparison with drag/touch.
// =====================================================================

import { BaseComponent } from './base-component.js';
import { triggerEvent } from './util.js';

export class ImageCompare extends BaseComponent {
  static get NAME() {
    return 'imageCompare';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._overlay = this._element.querySelector('.image-compare-overlay');
    this._handle = this._element.querySelector('.image-compare-handle');
    this._isDragging = false;
    this._onMove = this._onMove.bind(this);
    this._onUp = this._onUp.bind(this);

    this._bindEvents();
  }

  _bindEvents() {
    if (!this._overlay || !this._handle) return;

    const startDrag = (e) => {
      this._isDragging = true;
      e.preventDefault();
      document.addEventListener('mousemove', this._onMove);
      document.addEventListener('touchmove', this._onMove, { passive: false });
      document.addEventListener('mouseup', this._onUp);
      document.addEventListener('touchend', this._onUp);
    };

    this._handle.addEventListener('mousedown', startDrag);
    this._handle.addEventListener('touchstart', startDrag, { passive: false });
  }

  _onMove(e) {
    if (!this._isDragging) return;
    if (e.cancelable) e.preventDefault();

    const rect = this._element.getBoundingClientRect();
    const pageX = e.touches ? e.touches[0].clientX : e.clientX;
    let offset = pageX - rect.left;

    if (offset < 0) offset = 0;
    if (offset > rect.width) offset = rect.width;

    const percentage = (offset / rect.width) * 100;
    this.setPosition(percentage);
  }

  _onUp() {
    if (!this._isDragging) return;
    this._isDragging = false;
    document.removeEventListener('mousemove', this._onMove);
    document.removeEventListener('touchmove', this._onMove);
    document.removeEventListener('mouseup', this._onUp);
    document.removeEventListener('touchend', this._onUp);
    triggerEvent(this._element, 'boodoo.imagecompare.change', {
      position: this.getPosition(),
    });
  }

  setPosition(percentage) {
    const clamped = Math.max(0, Math.min(100, percentage));
    if (this._overlay) {
      this._overlay.style.width = `${clamped}%`;
    }
    if (this._handle) {
      this._handle.style.left = `${clamped}%`;
    }
  }

  getPosition() {
    if (!this._overlay) return 50;
    return parseFloat(this._overlay.style.width || '50');
  }

  dispose() {
    document.removeEventListener('mousemove', this._onMove);
    document.removeEventListener('touchmove', this._onMove);
    document.removeEventListener('mouseup', this._onUp);
    document.removeEventListener('touchend', this._onUp);
    super.dispose();
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.image-compare, [data-boodoo="image-compare"]').forEach((el) => {
      ImageCompare.getOrCreateInstance(el);
    });
  });
}
