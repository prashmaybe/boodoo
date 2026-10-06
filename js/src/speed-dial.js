// =====================================================================
// BOODOO JS — Speed Dial / Floating Action Button Menu
// Expandable floating action menu with staggered actions, click/hover modes, and escape dismiss.
// =====================================================================

import { BaseComponent, initDataApi } from './base-component.js';
import { triggerEvent, element } from './util.js';

const FAB_SELECTOR_TRIGGER = '.fab-trigger, [data-boodoo-fab-trigger], .btn-fab';
const FAB_SELECTOR_ACTIONS = '.fab-actions, [data-boodoo-fab-actions]';

export class SpeedDial extends BaseComponent {
  static get NAME() {
    return 'speed-dial';
  }

  constructor(target, config = {}) {
    super(target, config);

    this._trigger = this._element.querySelector(FAB_SELECTOR_TRIGGER);
    this._actions = this._element.querySelector(FAB_SELECTOR_ACTIONS);
    this._mode = this._element.getAttribute('data-trigger') || 'click'; // 'click' | 'hover'

    if (!this._trigger || !this._actions) return;

    this._initEvents();
  }

  _initEvents() {
    this._trigger.setAttribute('aria-haspopup', 'true');
    this._trigger.setAttribute('aria-expanded', 'false');

    this._trigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });

    if (this._mode === 'hover') {
      this._element.addEventListener('mouseenter', () => this.open());
      this._element.addEventListener('mouseleave', () => this.close());
    }

    document.addEventListener('click', (e) => {
      if (!this._element.contains(e.target)) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
        this._trigger.focus();
      }
    });
  }

  isOpen() {
    return this._element.classList.contains('open');
  }

  open() {
    if (this.isOpen()) return;
    this._element.classList.add('open');
    this._trigger.setAttribute('aria-expanded', 'true');
    triggerEvent(this._element, 'boodoo.speed-dial.open');
  }

  close() {
    if (!this.isOpen()) return;
    this._element.classList.remove('open');
    this._trigger.setAttribute('aria-expanded', 'false');
    triggerEvent(this._element, 'boodoo.speed-dial.close');
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }
}

initDataApi(SpeedDial, '[data-boodoo="speed-dial"], .fab-menu');
