// =====================================================================
// BOODOO — Banner
// Sticky/Floating full-width dismissible announcement banner component.
// =====================================================================

import { BaseComponent, initDataApi } from './base-component.js';
import { getTransitionDuration, emulateTransitionEnd, triggerEvent } from './util.js';

export class Banner extends BaseComponent {
  static get NAME() { return 'banner'; }

  static get selector() { return '[data-boodoo-banner], .banner, .announcement-bar'; }

  hide() {
    const el = this._element;
    if (!triggerEvent(el, 'boodoo.hide.banner')) return;

    el.classList.add('banner-dismissed');
    const duration = getTransitionDuration(el) || 250;

    emulateTransitionEnd(el, duration).then(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      triggerEvent(el, 'boodoo.hidden.banner');
      this.dispose();
    });
  }

  close() {
    this.hide();
  }
}

// Data API auto-init
initDataApi(Banner, '[data-boodoo-banner]');

export default Banner;
