// =====================================================================
// BOODOO JS — Splitter / Docking Panes
// Resizable dual panes with mouse/touch drag, keyboard stepping, and min/max limits.
// =====================================================================

import { BaseComponent, initDataApi } from './base-component.js';
import { triggerEvent, element } from './util.js';

const NAME = 'splitter';
const DATA_KEY = `boodoo.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;

const EVENT_RESIZE = `resize${EVENT_KEY}`;
const EVENT_DRAG_START = `dragstart${EVENT_KEY}`;
const EVENT_DRAG_END = `dragend${EVENT_KEY}`;

export class Splitter extends BaseComponent {
  constructor(target, config = {}) {
    super(target, config);

    this._gutter = this._element.querySelector('.splitter-gutter, [data-boodoo-splitter-gutter]');
    this._panePrimary = this._element.querySelector('.splitter-pane:first-child');
    this._paneSecondary = this._element.querySelector('.splitter-pane:last-child');
    this._isVertical = this._element.classList.contains('splitter-vertical') || this._element.getAttribute('data-orientation') === 'vertical';

    if (!this._gutter || !this._panePrimary || !this._paneSecondary) return;

    this._minSize = parseFloat(this._element.getAttribute('data-min-size')) || 100;
    this._maxSize = parseFloat(this._element.getAttribute('data-max-size')) || 0;
    this._isDragging = false;

    this._initEvents();
  }

  static get NAME() {
    return NAME;
  }

  _initEvents() {
    this._gutter.setAttribute('tabindex', '0');
    this._gutter.setAttribute('role', 'separator');
    this._gutter.setAttribute('aria-orientation', this._isVertical ? 'vertical' : 'horizontal');

    const onPointerMove = (e) => this._onPointerMove(e);
    const onPointerUp = () => this._onPointerUp(onPointerMove, onPointerUp);

    this._gutter.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this._isDragging = true;
      this._element.classList.add('splitter-resizing');
      this._gutter.setPointerCapture(e.pointerId);

      triggerEvent(this._element, EVENT_DRAG_START);

      const moveHandler = (moveEvent) => this._onPointerMove(moveEvent);
      const upHandler = (upEvent) => {
        this._isDragging = false;
        this._element.classList.remove('splitter-resizing');
        try {
          this._gutter.releasePointerCapture(upEvent.pointerId);
        } catch (_) {}
        window.removeEventListener('pointermove', moveHandler);
        window.removeEventListener('pointerup', upHandler);
        triggerEvent(this._element, EVENT_DRAG_END);
      };

      window.addEventListener('pointermove', moveHandler);
      window.addEventListener('pointerup', upHandler);
    });

    this._gutter.addEventListener('keydown', (e) => this._onKeyDown(e));
  }

  _onPointerMove(e) {
    if (!this._isDragging) return;
    const rect = this._element.getBoundingClientRect();

    let newSize;
    if (this._isVertical) {
      newSize = e.clientY - rect.top;
    } else {
      newSize = e.clientX - rect.left;
    }

    this.setSize(newSize);
  }

  _onKeyDown(e) {
    const step = e.shiftKey ? 40 : 10;
    const currentSize = this._isVertical ? this._panePrimary.offsetHeight : this._panePrimary.offsetWidth;

    if (this._isVertical) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.setSize(currentSize - step);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.setSize(currentSize + step);
      }
    } else {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.setSize(currentSize - step);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.setSize(currentSize + step);
      }
    }
  }

  setSize(size) {
    const rect = this._element.getBoundingClientRect();
    const totalSize = this._isVertical ? rect.height : rect.width;
    const gutterSize = this._isVertical ? this._gutter.offsetHeight : this._gutter.offsetWidth;

    let clamped = Math.max(this._minSize, size);
    const maxBound = this._maxSize > 0 ? this._maxSize : totalSize - this._minSize - gutterSize;
    clamped = Math.min(maxBound, clamped);

    if (this._isVertical) {
      this._panePrimary.style.height = `${clamped}px`;
      this._panePrimary.style.flex = `0 0 ${clamped}px`;
    } else {
      this._panePrimary.style.width = `${clamped}px`;
      this._panePrimary.style.flex = `0 0 ${clamped}px`;
    }

    triggerEvent(this._element, EVENT_RESIZE, { size: clamped, totalSize });
  }
}

initDataApi(Splitter, '[data-boodoo="splitter"], .splitter-container, .split-view');
