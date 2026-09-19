// BOODOO — Bottom Sheet
// Mobile drawer sheet sliding from bottom with swipe/touch gestures, backdrop & dismiss.

import { BaseComponent } from './base-component.js';
import { getElementFromSelector, triggerEvent, reflow } from './util.js';

export class BottomSheet extends BaseComponent {
  static get NAME() { return 'bottomSheet'; }

  static get selector() { return '.bottom-sheet'; }

  constructor(target, config = {}) {
    super(target, config);
    this._backdrop = null;
    this._handle = this._element.querySelector('.bottom-sheet-handle-wrap');
    this._startY = 0;
    this._currentY = 0;
    this._isDragging = false;
    this._initGestures();
  }

  static toggleVia(source) {
    const target = getElementFromSelector(source);
    if (!target) return;
    const sheet = BottomSheet.getOrCreateInstance(target);
    sheet.toggle();
  }

  toggle() {
    if (this._isShown) this.hide();
    else this.show();
  }

  show() {
    if (this._isShown) return;
    if (!triggerEvent(this._element, 'boodoo.show.bottomSheet')) return;

    this._isShown = true;
    this._createBackdrop();
    void reflow(this._element);
    this._element.classList.add('show');
    document.body.style.overflow = 'hidden';

    this._onKeydown = (e) => {
      if (e.key === 'Escape') this.hide();
    };
    document.addEventListener('keydown', this._onKeydown);
    triggerEvent(this._element, 'boodoo.shown.bottomSheet');
  }

  hide() {
    if (!this._isShown) return;
    if (!triggerEvent(this._element, 'boodoo.hide.bottomSheet')) return;

    this._isShown = false;
    this._element.classList.remove('show');
    this._element.style.transform = '';

    if (this._backdrop) {
      this._backdrop.classList.remove('show');
      setTimeout(() => {
        if (this._backdrop && this._backdrop.parentNode) {
          this._backdrop.parentNode.removeChild(this._backdrop);
        }
        this._backdrop = null;
      }, 300);
    }

    document.body.style.overflow = '';
    if (this._onKeydown) {
      document.removeEventListener('keydown', this._onKeydown);
      this._onKeydown = null;
    }

    triggerEvent(this._element, 'boodoo.hidden.bottomSheet');
  }

  _createBackdrop() {
    if (this._backdrop) return;
    const backdrop = document.createElement('div');
    backdrop.className = 'bottom-sheet-backdrop';
    document.body.appendChild(backdrop);
    void reflow(backdrop);
    backdrop.classList.add('show');

    backdrop.addEventListener('click', () => {
      this.hide();
    });

    this._backdrop = backdrop;
  }

  _initGestures() {
    const handle = this._handle || this._element.querySelector('.bottom-sheet-header') || this._element;

    const onStart = (clientY) => {
      this._startY = clientY;
      this._currentY = clientY;
      this._isDragging = true;
      this._element.style.transition = 'none';
    };

    const onMove = (clientY) => {
      if (!this._isDragging) return;
      const delta = clientY - this._startY;
      if (delta > 0) {
        this._element.style.transform = `translateY(${delta}px)`;
      }
    };

    const onEnd = (clientY) => {
      if (!this._isDragging) return;
      this._isDragging = false;
      this._element.style.transition = '';
      const delta = clientY - this._startY;
      if (delta > 120) {
        this.hide();
      } else {
        this._element.style.transform = '';
      }
    };

    handle.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) onStart(e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this._isDragging && e.touches && e.touches[0]) {
        onMove(e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (this._isDragging) {
        const touch = e.changedTouches && e.changedTouches[0];
        onEnd(touch ? touch.clientY : this._startY);
      }
    });

    handle.addEventListener('mousedown', (e) => {
      onStart(e.clientY);
      const moveHandler = (moveEvent) => onMove(moveEvent.clientY);
      const upHandler = (upEvent) => {
        window.removeEventListener('mousemove', moveHandler);
        window.removeEventListener('mouseup', upHandler);
        onEnd(upEvent.clientY);
      };
      window.addEventListener('mousemove', moveHandler);
      window.addEventListener('mouseup', upHandler);
    });
  }
}

// Data API
if (typeof document !== 'undefined') {
  document.addEventListener('click', (event) => {
    const source = event.target.closest('[data-boodoo-toggle="bottom-sheet"]');
    if (source) {
      event.preventDefault();
      BottomSheet.toggleVia(source);
    }
    const closer = event.target.closest('[data-boodoo-dismiss="bottom-sheet"]');
    if (closer) {
      const sheet = BottomSheet.getInstance(closer.closest('.bottom-sheet'));
      if (sheet) sheet.hide();
    }
  }, true);
}

export default BottomSheet;

