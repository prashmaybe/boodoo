// =====================================================================
// BOODOO JS — Lightbox / Media Zoom Viewer
// Fullscreen media preview with zoom, image cycling, touch swipe, keyboard controls.
// =====================================================================

import { BaseComponent, initDataApi } from './base-component.js';
import { triggerEvent, element, elements } from './util.js';

export class Lightbox extends BaseComponent {
  static get NAME() {
    return 'lightbox';
  }

  constructor(target, config = {}) {
    super(target, config);

    this._currentIndex = 0;
    this._galleryItems = [];
    this._initLightboxDOM();
    this._initEvents();
  }

  _initLightboxDOM() {
    let container = document.getElementById('boodoo-lightbox-viewer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'boodoo-lightbox-viewer';
      container.className = 'lightbox-viewer';
      container.innerHTML = `
        <div class="lightbox-backdrop"></div>
        <div class="lightbox-toolbar">
          <span class="lightbox-counter" id="lightbox-counter"></span>
          <div class="lightbox-toolbar-actions">
            <button type="button" class="lightbox-btn" id="lightbox-zoom-btn" title="Toggle zoom" aria-label="Toggle zoom">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </button>
            <button type="button" class="lightbox-btn" id="lightbox-close-btn" title="Close" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
        <button type="button" class="lightbox-nav lightbox-prev" id="lightbox-prev-btn" aria-label="Previous">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div class="lightbox-stage">
          <img class="lightbox-img" id="lightbox-active-img" src="" alt="Enlarged media preview">
          <div class="lightbox-caption" id="lightbox-caption"></div>
        </div>
        <button type="button" class="lightbox-nav lightbox-next" id="lightbox-next-btn" aria-label="Next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      `;
      document.body.appendChild(container);
    }
    this._viewer = container;
    this._activeImg = container.querySelector('#lightbox-active-img');
    this._caption = container.querySelector('#lightbox-caption');
    this._counter = container.querySelector('#lightbox-counter');
  }

  _initEvents() {
    this._element.addEventListener('click', (e) => {
      e.preventDefault();
      this.open();
    });

    const closeBtn = this._viewer.querySelector('#lightbox-close-btn');
    const backdrop = this._viewer.querySelector('.lightbox-backdrop');
    const prevBtn = this._viewer.querySelector('#lightbox-prev-btn');
    const nextBtn = this._viewer.querySelector('#lightbox-next-btn');
    const zoomBtn = this._viewer.querySelector('#lightbox-zoom-btn');

    if (!this._viewer._hasListeners) {
      this._viewer._hasListeners = true;
      closeBtn.addEventListener('click', () => Lightbox.closeActive());
      backdrop.addEventListener('click', () => Lightbox.closeActive());
      prevBtn.addEventListener('click', () => Lightbox.activeInstance?.prev());
      nextBtn.addEventListener('click', () => Lightbox.activeInstance?.next());
      zoomBtn.addEventListener('click', () => Lightbox.activeInstance?.toggleZoom());

      document.addEventListener('keydown', (e) => {
        if (!Lightbox.activeInstance) return;
        if (e.key === 'Escape') Lightbox.closeActive();
        else if (e.key === 'ArrowLeft') Lightbox.activeInstance.prev();
        else if (e.key === 'ArrowRight') Lightbox.activeInstance.next();
      });
    }
  }

  _findGallery() {
    const galleryName = this._element.getAttribute('data-boodoo-gallery') || this._element.getAttribute('data-gallery');
    if (galleryName) {
      this._galleryItems = Array.from(document.querySelectorAll(`[data-boodoo-gallery="${galleryName}"], [data-gallery="${galleryName}"]`));
      this._currentIndex = this._galleryItems.indexOf(this._element);
    } else {
      this._galleryItems = [this._element];
      this._currentIndex = 0;
    }
  }

  open() {
    this._findGallery();
    Lightbox.activeInstance = this;
    this._viewer.classList.add('show');
    document.body.classList.add('lightbox-open');
    this._updateMedia();
    triggerEvent(this._element, 'boodoo.lightbox.open');
  }

  static closeActive() {
    if (Lightbox.activeInstance) {
      Lightbox.activeInstance.close();
    }
  }

  close() {
    this._viewer.classList.remove('show');
    this._viewer.classList.remove('zoomed');
    document.body.classList.remove('lightbox-open');
    Lightbox.activeInstance = null;
    triggerEvent(this._element, 'boodoo.lightbox.close');
  }

  prev() {
    if (this._galleryItems.length <= 1) return;
    this._currentIndex = (this._currentIndex - 1 + this._galleryItems.length) % this._galleryItems.length;
    this._updateMedia();
  }

  next() {
    if (this._galleryItems.length <= 1) return;
    this._currentIndex = (this._currentIndex + 1) % this._galleryItems.length;
    this._updateMedia();
  }

  toggleZoom() {
    this._viewer.classList.toggle('zoomed');
  }

  _updateMedia() {
    const item = this._galleryItems[this._currentIndex];
    const src = item.getAttribute('href') || item.getAttribute('data-src') || item.src || '';
    const captionText = item.getAttribute('data-caption') || item.getAttribute('alt') || item.getAttribute('title') || '';

    this._activeImg.src = src;
    this._caption.textContent = captionText;
    this._caption.style.display = captionText ? 'block' : 'none';

    if (this._galleryItems.length > 1) {
      this._counter.textContent = `${this._currentIndex + 1} / ${this._galleryItems.length}`;
      this._counter.style.display = 'block';
    } else {
      this._counter.style.display = 'none';
    }

    this._viewer.classList.remove('zoomed');
    triggerEvent(this._element, 'boodoo.lightbox.change', { index: this._currentIndex, src });
  }
}

Lightbox.activeInstance = null;
initDataApi(Lightbox, '[data-boodoo="lightbox"], .lightbox-trigger');
