// BOODOO — Alert
// Dismissible alerts via [data-boodoo-dismiss="alert"].

import { BaseComponent, initDataApi } from './base-component.js';
import { getTransitionDuration, emulateTransitionEnd, triggerEvent } from './util.js';

export class Alert extends BaseComponent {
  static get NAME() { return 'alert'; }

  static get selector() { return '[data-boodoo-alert]'; }

  hide() {
    const el = this._element;
    if (!el.classList.contains('show')) return;
    if (!triggerEvent(el, 'boodoo.hide.alert')) return;

    el.classList.remove('show');
    const duration = getTransitionDuration(el);
    emulateTransitionEnd(el, duration).then(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      triggerEvent(el, 'boodoo.hidden.alert');
      this.dispose();
    });
  }

  close() {
    this.hide();
  }
}

// Data API: any element with [data-boodoo-dismiss="alert"] closes its parent .alert
initDataApi(Alert, '[data-boodoo-alert]');

export default Alert;