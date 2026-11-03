// BOODOO — Bottom Sheet
// Mobile drawer sheet sliding from bottom with swipe/touch gestures, backdrop & dismiss.

import { BaseComponent } from './base-component.js';
import { getElementFromSelector, triggerEvent, reflow } from './util.js';

export class BottomSheet extends BaseComponent {
  static get NAME() {
    return 'bottomSheet';
  }

  static get selector() {
    return '.bottom-sheet';
  }

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
    this._handleEl =
      this._handle || this._element.querySelector('.bottom-sheet-header') || this._element;
    const handle = this._handleEl;

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

    this._onTouchStart = (e) => {
      if (e.touches && e.touches[0]) onStart(e.touches[0].clientY);
    };

    this._onTouchMove = (e) => {
      if (this._isDragging && e.touches && e.touches[0]) {
        onMove(e.touches[0].clientY);
      }
    };

    this._onTouchEnd = (e) => {
      if (this._isDragging) {
        const touch = e.changedTouches && e.changedTouches[0];
        onEnd(touch ? touch.clientY : this._startY);
      }
    };

    this._onMouseDown = (e) => {
      onStart(e.clientY);
      this._moveHandler = (moveEvent) => onMove(moveEvent.clientY);
      this._upHandler = (upEvent) => {
        window.removeEventListener('mousemove', this._moveHandler);
        window.removeEventListener('mouseup', this._upHandler);
        this._moveHandler = null;
        this._upHandler = null;
        onEnd(upEvent.clientY);
      };
      window.addEventListener('mousemove', this._moveHandler);
      window.addEventListener('mouseup', this._upHandler);
    };

    if (handle && typeof handle.addEventListener === 'function') {
      handle.addEventListener('touchstart', this._onTouchStart, { passive: true });
      handle.addEventListener('mousedown', this._onMouseDown);
    }
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('touchmove', this._onTouchMove, { passive: true });
      window.addEventListener('touchend', this._onTouchEnd);
    }
  }

  dispose() {
    if (this._isShown) {
      this.hide();
    }
    if (this._onKeydown) {
      document.removeEventListener('keydown', this._onKeydown);
      this._onKeydown = null;
    }
    if (this._handleEl) {
      if (this._onTouchStart) this._handleEl.removeEventListener('touchstart', this._onTouchStart);
      if (this._onMouseDown) this._handleEl.removeEventListener('mousedown', this._onMouseDown);
      this._handleEl = null;
    }
    if (this._onTouchMove) {
      window.removeEventListener('touchmove', this._onTouchMove);
      this._onTouchMove = null;
    }
    if (this._onTouchEnd) {
      window.removeEventListener('touchend', this._onTouchEnd);
      this._onTouchEnd = null;
    }
    if (this._moveHandler) {
      window.removeEventListener('mousemove', this._moveHandler);
      this._moveHandler = null;
    }
    if (this._upHandler) {
      window.removeEventListener('mouseup', this._upHandler);
      this._upHandler = null;
    }
    if (this._backdrop && this._backdrop.parentNode) {
      this._backdrop.parentNode.removeChild(this._backdrop);
      this._backdrop = null;
    }
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = '';
    }
    super.dispose();
  }
}

// Data API
if (typeof document !== 'undefined') {
  document.addEventListener(
    'click',
    (event) => {
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
    },
    true
  );
}

export default BottomSheet;
