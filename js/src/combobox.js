// =====================================================================
// BOODOO JS — Combobox / Autocomplete Select
// Accessible inline combobox with searchable dropdown, arrow key navigation,
// custom filtering, option selection, and clearable support.
// =====================================================================

import { BaseComponent, initDataApi } from './base-component.js';
import { triggerEvent, element, elements } from './util.js';

const NAME = 'combobox';
const DATA_KEY = `boodoo.${NAME}`;
const EVENT_KEY = `.${DATA_KEY}`;

const EVENT_CHANGE = `change${EVENT_KEY}`;
const EVENT_SELECT = `select${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;

const SELECTOR_INPUT = '.combobox-input, [data-boodoo-combobox-input]';
const SELECTOR_MENU = '.combobox-menu, [data-boodoo-combobox-menu]';
const SELECTOR_ITEM = '.combobox-item:not(.disabled), [data-boodoo-combobox-item]:not([disabled])';
const SELECTOR_CLEAR = '[data-boodoo-combobox-clear]';

const CLASS_SHOW = 'show';
const CLASS_ACTIVE = 'active';

export class Combobox extends BaseComponent {
  constructor(target, config = {}) {
    super(target, config);

    this._input = this._element.querySelector(SELECTOR_INPUT);
    this._menu = this._element.querySelector(SELECTOR_MENU);
    this._clearBtn = this._element.querySelector(SELECTOR_CLEAR);
    this._activeIndex = -1;
    this._items = [];

    if (!this._input || !this._menu) return;

    this._initEvents();
    this._refreshItems();
  }

  static get NAME() {
    return NAME;
  }

  _initEvents() {
    this._onInput = () => this._handleInput();
    this._onKeyDown = (e) => this._handleKeyDown(e);
    this._onFocus = () => this.show();
    this._onDocumentClick = (e) => {
      if (!this._element.contains(e.target)) {
        this.hide();
      }
    };

    this._input.addEventListener('input', this._onInput);
    this._input.addEventListener('keydown', this._onKeyDown);
    this._input.addEventListener('focus', this._onFocus);
    document.addEventListener('click', this._onDocumentClick);

    this._menu.addEventListener('click', (e) => {
      const item = e.target.closest(SELECTOR_ITEM);
      if (item) {
        this.selectItem(item);
      }
    });

    if (this._clearBtn) {
      this._clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.clear();
      });
    }
  }

  _refreshItems() {
    this._items = Array.from(this._menu.querySelectorAll(SELECTOR_ITEM));
  }

  _handleInput() {
    const query = this._input.value.trim().toLowerCase();
    this.show();
    this._refreshItems();

    let hasMatches = false;
    for (const item of this._items) {
      const val = (item.getAttribute('data-value') || item.textContent || '').trim().toLowerCase();
      const matches = !query || val.includes(query);
      item.style.display = matches ? '' : 'none';
      if (matches) hasMatches = true;
    }

    const emptyNotice = this._menu.querySelector('.combobox-empty');
    if (emptyNotice) {
      emptyNotice.style.display = hasMatches ? 'none' : 'block';
    }

    this._activeIndex = -1;
    this._updateActive();
    triggerEvent(this._element, EVENT_CHANGE, { query });
  }

  _handleKeyDown(e) {
    const visibleItems = this._items.filter((item) => item.style.display !== 'none');
    if (!visibleItems.length) {
      if (e.key === 'Escape') this.hide();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!this.isShown()) {
        this.show();
      } else {
        this._activeIndex = (this._activeIndex + 1) % visibleItems.length;
        this._updateActive(visibleItems);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!this.isShown()) {
        this.show();
      } else {
        this._activeIndex = (this._activeIndex - 1 + visibleItems.length) % visibleItems.length;
        this._updateActive(visibleItems);
      }
    } else if (e.key === 'Enter') {
      if (this.isShown() && this._activeIndex >= 0 && this._activeIndex < visibleItems.length) {
        e.preventDefault();
        this.selectItem(visibleItems[this._activeIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.hide();
    }
  }

  _updateActive(visibleItems = null) {
    const list = visibleItems || this._items.filter((item) => item.style.display !== 'none');
    list.forEach((item, idx) => {
      if (idx === this._activeIndex) {
        item.classList.add(CLASS_ACTIVE);
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove(CLASS_ACTIVE);
      }
    });
  }

  selectItem(item) {
    if (!item) return;
    const value = item.getAttribute('data-value') || item.textContent.trim();
    const label = item.textContent.trim();

    this._input.value = label;
    this._element.setAttribute('data-selected-value', value);

    for (const el of this._items) {
      el.classList.toggle('selected', el === item);
    }

    triggerEvent(this._element, EVENT_SELECT, { value, label, item });
    this.hide();
    this._input.focus();
  }

  clear() {
    this._input.value = '';
    this._element.removeAttribute('data-selected-value');
    for (const el of this._items) {
      el.classList.remove('selected');
      el.style.display = '';
    }
    const emptyNotice = this._menu.querySelector('.combobox-empty');
    if (emptyNotice) emptyNotice.style.display = 'none';
    this._activeIndex = -1;
    this._updateActive();
    triggerEvent(this._element, EVENT_CHANGE, { query: '', cleared: true });
    this._input.focus();
  }

  show() {
    if (this.isShown()) return;
    this._menu.classList.add(CLASS_SHOW);
    this._element.classList.add(CLASS_SHOW);
    this._isShown = true;
    triggerEvent(this._element, EVENT_SHOW);
  }

  hide() {
    if (!this.isShown()) return;
    this._menu.classList.remove(CLASS_SHOW);
    this._element.classList.remove(CLASS_SHOW);
    this._isShown = false;
    this._activeIndex = -1;
    this._updateActive();
    triggerEvent(this._element, EVENT_HIDE);
  }

  isShown() {
    return this._menu.classList.contains(CLASS_SHOW);
  }

  dispose() {
    if (this._input) {
      this._input.removeEventListener('input', this._onInput);
      this._input.removeEventListener('keydown', this._onKeyDown);
      this._input.removeEventListener('focus', this._onFocus);
    }
    document.removeEventListener('click', this._onDocumentClick);
    super.dispose();
  }
}

initDataApi(Combobox, '[data-boodoo="combobox"], .combobox');
