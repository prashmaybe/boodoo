// BOODOO — Carousel
// Sliding/fading carousel with controls, indicators, autoplay, swipe.

import { BaseComponent } from './base-component.js';
import { triggerEvent, getNextElement } from './util.js';

export class Carousel extends BaseComponent {
  static get NAME() {
    return 'carousel';
  }

  static get selector() {
    return '[data-boodoo-ride="carousel"]';
  }

  constructor(target, config = {}) {
    super(target, config);
    this._config = this._getConfig(config, {
      interval: 5000,
      pause: 'hover',
      wrap: true,
      keyboard: false,
      touch: true,
      slideDuration: 600,
    });
    this._items = null;
    this._interval = null;
    this._activeElement = null;
    this._isSliding = false;
    this._touchStartX = 0;

    this._setup();
    if (this._element.classList.contains('slide')) {
      this._slideDuration = this._config.slideDuration;
    }
    const alreadyActive = this._element.querySelector('.carousel-item.active');
    if (alreadyActive) this._activeElement = alreadyActive;
    if (this._config.interval !== false && !this._element.hasAttribute('data-boodoo-interval')) {
      this.cycle();
    }
  }

  _setup() {
    this._indicatorButtons = Array.from(
      this._element.querySelectorAll('.carousel-indicators [data-boodoo-target]')
    );
    this._container = this._element.querySelector('.carousel-inner');
    const intervalAttr = this._element.getAttribute('data-boodoo-interval');
    if (intervalAttr !== null) this._config.interval = Number(intervalAttr) || false;

    // indicators
    this._indicatorHandlers = this._indicatorButtons.map((btn, i) => {
      const handler = (e) => {
        e.preventDefault();
        this.to(i);
      };
      btn.addEventListener('click', handler);
      return { btn, handler };
    });

    // controls
    this._controlHandlers = [];
    this._element.querySelectorAll('.carousel-control-prev').forEach((c) => {
      const handler = (e) => {
        e.preventDefault();
        if (!this._isSliding) this.prev();
      };
      c.addEventListener('click', handler);
      this._controlHandlers.push({ el: c, handler });
    });
    this._element.querySelectorAll('.carousel-control-next').forEach((c) => {
      const handler = (e) => {
        e.preventDefault();
        if (!this._isSliding) this.next();
      };
      c.addEventListener('click', handler);
      this._controlHandlers.push({ el: c, handler });
    });

    // pause on hover
    if (this._config.pause === 'hover') {
      this._onMouseEnter = () => this.pause();
      this._onMouseLeave = () => this.cycle();
      this._element.addEventListener('mouseenter', this._onMouseEnter);
      this._element.addEventListener('mouseleave', this._onMouseLeave);
    }

    // keyboard
    if (this._config.keyboard) {
      this._onKeydown = (e) => {
        if (e.key === 'ArrowLeft') this.prev();
        else if (e.key === 'ArrowRight') this.next();
      };
      this._element.addEventListener('keydown', this._onKeydown);
    }

    // touch swipe
    if (this._config.touch && this._container) {
      this._onTouchStart = (e) => {
        this._touchStartX = e.touches[0].clientX;
      };
      this._onTouchEnd = (e) => {
        const dx = e.changedTouches[0].clientX - this._touchStartX;
        if (Math.abs(dx) > 40 && !this._isSliding) {
          if (dx < 0) this.next();
          else this.prev();
        }
      };
      this._container.addEventListener('touchstart', this._onTouchStart, { passive: true });
      this._container.addEventListener('touchend', this._onTouchEnd, { passive: true });
    }
  }

  _getItems() {
    if (!this._items) {
      this._items = this._container
        ? Array.from(this._container.children).filter((el) =>
            el.classList.contains('carousel-item')
          )
        : [];
    }
    return this._items;
  }

  _getActiveIndex() {
    return this._getItems().indexOf(this._activeElement);
  }

  next() {
    if (this._isSliding) return;
    if (!this._config.wrap && this._getActiveIndex() === this._getItems().length - 1) return;
    this._slide('next');
  }

  prev() {
    if (this._isSliding) return;
    if (!this._config.wrap && this._getActiveIndex() === 0) return;
    this._slide('prev');
  }

  to(index) {
    if (this._isSliding) return;
    const items = this._getItems();
    if (!items.length) return;
    const next = items[((index % items.length) + items.length) % items.length];
    if (next === this._activeElement) return;
    const order = items.indexOf(next) > this._getActiveIndex() ? 'next' : 'prev';
    this._doSlide(next, order);
  }

  _slide(direction) {
    if (!this._activeElement) {
      this._activeElement = this._getItems()[0];
      this._setActive(this._activeElement);
      return;
    }
    const next = getNextElement(this._container, this._activeElement, direction);
    if (!next || next === this._activeElement) return;
    if (
      !this._config.wrap &&
      next.classList.contains('carousel-item') &&
      this._getActiveIndex() === this._getItems().length - 1 &&
      direction === 'next'
    )
      return;
    this._doSlide(next, direction);
  }

  _doSlide(next, order) {
    const ev = triggerEvent(this._element, 'boodoo.slide.carousel', {
      relatedTarget: next,
      direction: order,
    });
    if (!ev) return;

    this._isSliding = true;
    const current = this._activeElement;

    // crossfade approach (carousel-fade) or translate
    if (this._element.classList.contains('carousel-fade')) {
      current.classList.add('active');
      next.classList.add('carousel-item-next', 'carousel-item-start', 'active');
      next.style.opacity = 0;
      void next.offsetWidth;
      requestAnimationFrame(() => {
        next.style.transition = 'opacity .6s ease';
        next.style.opacity = 1;
      });
      this._slideTimeout = setTimeout(() => this._finishSlide(next, current), 600);
    } else {
      const prevClass = order === 'next' ? 'carousel-item-start' : 'carousel-item-end';
      const nextClass = order === 'next' ? 'carousel-item-next' : 'carousel-item-prev';
      next.classList.add(nextClass);
      void next.offsetWidth;
      current.classList.add(prevClass);
      next.classList.remove(nextClass);
      next.classList.add(order === 'next' ? 'carousel-item-end' : 'carousel-item-start');
      next.classList.add('active');
      this._slideTimeout = setTimeout(() => this._finishSlide(next, current), 600);
    }
  }

  _finishSlide(next, current) {
    if (!this._element) return;
    this._slideTimeout = null;
    if (current) current.classList.remove('active');
    offsetRemove(next, [
      'carousel-item-next',
      'carousel-item-prev',
      'carousel-item-start',
      'carousel-item-end',
    ]);
    next.style.transition = '';
    next.style.opacity = '';
    this._activeElement = next;
    this._isSliding = false;
    this._setActive(next);
    triggerEvent(this._element, 'boodoo.slid.carousel', { relatedTarget: next });
    this.cycle();
  }

  _setActive(item) {
    const index = this._getItems().indexOf(item);
    this._indicatorButtons.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  }

  cycle() {
    this._clearInterval();
    if (!this._element) return;
    if (this._config.interval && this._config.interval !== false) {
      this._interval = setInterval(() => {
        if (this._element && !this._element.matches(':hover')) this.next();
      }, this._config.interval);
    }
  }

  pause() {
    this._clearInterval();
  }

  _clearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  dispose() {
    this._clearInterval();
    if (this._slideTimeout) {
      clearTimeout(this._slideTimeout);
      this._slideTimeout = null;
    }
    if (this._indicatorHandlers) {
      this._indicatorHandlers.forEach(({ btn, handler }) => {
        if (typeof btn.removeEventListener === 'function') {
          btn.removeEventListener('click', handler);
        }
      });
      this._indicatorHandlers = [];
    }
    if (this._controlHandlers) {
      this._controlHandlers.forEach(({ el, handler }) => {
        if (typeof el.removeEventListener === 'function') {
          el.removeEventListener('click', handler);
        }
      });
      this._controlHandlers = [];
    }
    if (this._element && typeof this._element.removeEventListener === 'function') {
      if (this._onMouseEnter) this._element.removeEventListener('mouseenter', this._onMouseEnter);
      if (this._onMouseLeave) this._element.removeEventListener('mouseleave', this._onMouseLeave);
      if (this._onKeydown) this._element.removeEventListener('keydown', this._onKeydown);
    }
    if (this._container && typeof this._container.removeEventListener === 'function') {
      if (this._onTouchStart) this._container.removeEventListener('touchstart', this._onTouchStart);
      if (this._onTouchEnd) this._container.removeEventListener('touchend', this._onTouchEnd);
    }
    this._indicatorButtons = [];
    this._container = null;
    this._activeElement = null;
    this._items = null;
    super.dispose();
  }
}

function offsetRemove(el, classes) {
  classes.forEach((c) => el.classList.remove(c));
}

// Auto-init carousels marked with data-boodoo-ride
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
  } else {
    initCarousels();
  }
}

function initCarousels() {
  if (typeof document === 'undefined' || !document.querySelectorAll) return;
  document.querySelectorAll(Carousel.selector).forEach((el) => {
    if (!Carousel.getInstance(el)) Carousel.getOrCreateInstance(el);
  });
}

export default Carousel;
