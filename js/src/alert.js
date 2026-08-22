// BUDU — Alert
// Dismissible alerts via [data-budu-dismiss="alert"].

import { BaseComponent, initDataApi } from './base-component.js';
import { getTransitionDuration, emulateTransitionEnd, triggerEvent } from './util.js';

export class Alert extends BaseComponent {
  static get NAME() { return 'alert'; }

  static get selector() { return '[data-budu-alert]'; }

  hide() {
    const el = this._element;
    if (!el.classList.contains('show')) return;
    if (!triggerEvent(el, 'budu.hide.alert')) return;

    el.classList.remove('show');
    const duration = getTransitionDuration(el);
    emulateTransitionEnd(el, duration).then(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      triggerEvent(el, 'budu.hidden.alert');
      this.dispose();
    });
  }

  close() {
    this.hide();
  }
}

// Data API: any element with [data-budu-dismiss="alert"] closes its parent .alert
initDataApi(Alert, '[data-budu-alert]');

export default Alert;