// =====================================================================
// BOODOO — Touch & Pointer Gestures Primitive
// Lightweight swipe-to-dismiss, pull-to-refresh, and drag handlers
// =====================================================================

import { triggerEvent } from './util.js';

export class Gestures {
  static attachSwipe(element, options = {}) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return null;

    const threshold = options.threshold || 80;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isTracking = false;

    const onPointerDown = (e) => {
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      currentX = startX;
      currentY = startY;
      isTracking = true;
    };

    const onPointerMove = (e) => {
      if (!isTracking) return;
      currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const deltaX = currentX - startX;
      if (options.onMove) {
        options.onMove(deltaX, currentY - startY);
      }
    };

    const onPointerUp = () => {
      if (!isTracking) return;
      isTracking = false;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        const direction = deltaX > 0 ? 'right' : 'left';
        triggerEvent(el, 'boodoo:gesture:swipe', { direction, deltaX });
        if (options.onSwipe) {
          options.onSwipe(direction, deltaX);
        }
      }
    };

    el.addEventListener('touchstart', onPointerDown, { passive: true });
    el.addEventListener('touchmove', onPointerMove, { passive: true });
    el.addEventListener('touchend', onPointerUp, { passive: true });
    el.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    return {
      dispose() {
        el.removeEventListener('touchstart', onPointerDown);
        el.removeEventListener('touchmove', onPointerMove);
        el.removeEventListener('touchend', onPointerUp);
        el.removeEventListener('mousedown', onPointerDown);
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('mouseup', onPointerUp);
      },
    };
  }

  static attachPullToRefresh(element, onRefresh) {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return null;

    let startY = 0;
    let isPulling = false;
    const threshold = 70;

    const onTouchStart = (e) => {
      if (el.scrollTop === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    };

    const onTouchMove = (e) => {
      if (!isPulling) return;
      const y = e.touches[0].clientY;
      const deltaY = y - startY;
      if (deltaY > 0 && el.scrollTop === 0) {
        el.style.transform = `translateY(${Math.min(deltaY * 0.4, 40)}px)`;
      }
    };

    const onTouchEnd = async (e) => {
      if (!isPulling) return;
      isPulling = false;
      const y = (e.changedTouches && e.changedTouches[0].clientY) || 0;
      const deltaY = y - startY;
      el.style.transition = 'transform 0.25s ease';
      el.style.transform = 'translateY(0)';
      setTimeout(() => {
        el.style.transition = '';
      }, 250);

      if (deltaY > threshold && typeof onRefresh === 'function') {
        triggerEvent(el, 'boodoo:gesture:refresh');
        await onRefresh();
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return {
      dispose() {
        el.removeEventListener('touchstart', onTouchStart);
        el.removeEventListener('touchmove', onTouchMove);
        el.removeEventListener('touchend', onTouchEnd);
      },
    };
  }
}
