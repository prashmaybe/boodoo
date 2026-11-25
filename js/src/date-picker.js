// =====================================================================
// BOODOO JS — DatePicker & DateRangePicker Component
// Fully accessible, zero-dependency calendar dropdown, keyboard navigation,
// single date & date range selection with customizable formatters.
// =====================================================================

import { BaseComponent, initDataApi } from './base-component.js';
import { triggerEvent } from './util.js';

/**
 * Safely parse a date-only string (YYYY-MM-DD) or Date object in local calendar space,
 * avoiding negative UTC timezone shifts.
 */
function parseLocalDate(val) {
  if (!val) return null;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : new Date(val.getFullYear(), val.getMonth(), val.getDate());
  }
  if (typeof val === 'string') {
    const parts = val.trim().split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m, d);
      }
    }
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export class DatePicker extends BaseComponent {
  static get NAME() {
    return 'datePicker';
  }

  constructor(element, config = {}) {
    super(element, config);

    this._input = this._element.querySelector('input');
    if (!this._input && this._element.matches('input')) {
      this._input = this._element;
    }
    if (!this._input) return;

    // Config defaults
    this._isRange = Boolean(
      this._config.range ||
      (typeof this._element.getAttribute === 'function' &&
        this._element.getAttribute('data-boodoo-range') === 'true')
    );
    this._minDate = this._config.min ? parseLocalDate(this._config.min) : null;
    this._maxDate = this._config.max ? parseLocalDate(this._config.max) : null;

    // Internal state
    this._isOpen = false;
    this._viewDate = new Date();
    this._selectedDate = null;
    this._rangeStart = null;
    this._rangeEnd = null;

    // Parse initial input value
    if (this._input.value) {
      if (this._isRange && this._input.value.includes(' - ')) {
        const [s, e] = this._input.value.split(' - ');
        const ds = parseLocalDate(s);
        const de = parseLocalDate(e);
        if (ds) this._rangeStart = ds;
        if (de) this._rangeEnd = de;
        if (this._rangeStart) this._viewDate = new Date(this._rangeStart);
      } else {
        const d = parseLocalDate(this._input.value);
        if (d) {
          this._selectedDate = d;
          this._viewDate = new Date(d);
        }
      }
    }

    this._buildPopup();
    this._bindEvents();
  }

  _buildPopup() {
    this._popup = this._element.querySelector('.date-picker-popup');
    if (!this._popup) {
      this._popup = document.createElement('div');
      this._popup.className = 'date-picker-popup';
      this._popup.setAttribute('role', 'dialog');
      this._popup.setAttribute('aria-modal', 'false');
      this._popup.setAttribute('aria-label', this._isRange ? 'Date range picker' : 'Date picker');
      this._element.appendChild(this._popup);
    }

    this._toggleBtn = this._element.querySelector('.date-picker-toggle-btn');
    if (!this._toggleBtn) {
      this._toggleBtn = document.createElement('button');
      this._toggleBtn.type = 'button';
      this._toggleBtn.className = 'date-picker-toggle-btn';
      this._toggleBtn.setAttribute('aria-label', 'Toggle calendar');
      this._toggleBtn.innerHTML = '📅';

      const wrap = this._input.parentElement;
      if (wrap) wrap.appendChild(this._toggleBtn);
    }
  }

  _bindEvents() {
    this._onToggleClick = (e) => {
      e.preventDefault();
      this.toggle();
    };
    if (this._toggleBtn) {
      this._toggleBtn.addEventListener('click', this._onToggleClick);
    }

    this._onInputClick = () => {
      if (!this._isOpen) this.open();
    };
    this._input.addEventListener('click', this._onInputClick);

    this._onDocClick = (e) => {
      if (this._isOpen && !this._element.contains(e.target)) {
        this.close();
      }
    };
    document.addEventListener('click', this._onDocClick);

    this._onKeyDown = (e) => {
      if (e.key === 'Escape' && this._isOpen) {
        this.close();
        this._input.focus();
      }
    };
    this._element.addEventListener('keydown', this._onKeyDown);
  }

  open() {
    if (this._isOpen) return;
    this._isOpen = true;
    this.render();
    this._popup.classList.add('show');
    triggerEvent(this._element, 'boodoo.datepicker.open');
  }

  close() {
    if (!this._isOpen) return;
    this._isOpen = false;
    this._popup.classList.remove('show');
    triggerEvent(this._element, 'boodoo.datepicker.close');
  }

  toggle() {
    if (this._isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  prevMonth() {
    this._viewDate.setMonth(this._viewDate.getMonth() - 1);
    this.render();
  }

  nextMonth() {
    this._viewDate.setMonth(this._viewDate.getMonth() + 1);
    this.render();
  }

  today() {
    const today = new Date();
    this._viewDate = new Date(today);
    if (!this._isRange) {
      this.selectDate(today);
    } else {
      this.render();
    }
  }

  clear() {
    this._selectedDate = null;
    this._rangeStart = null;
    this._rangeEnd = null;
    this._input.value = '';
    this.render();
    triggerEvent(this._element, 'boodoo.datepicker.change', { value: '' });
  }

  _formatDate(date) {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  selectDate(date) {
    const targetDate = parseLocalDate(date);
    if (!targetDate) return;

    if (!this._isRange) {
      this._selectedDate = targetDate;
      this._input.value = this._formatDate(this._selectedDate);
      this.close();
      triggerEvent(this._element, 'boodoo.datepicker.change', {
        value: this._input.value,
        date: this._selectedDate,
      });
      return;
    }

    // Range selection flow
    if (!this._rangeStart || (this._rangeStart && this._rangeEnd)) {
      this._rangeStart = targetDate;
      this._rangeEnd = null;
      this._input.value = this._formatDate(this._rangeStart);
      this.render();
    } else if (this._rangeStart && !this._rangeEnd) {
      if (targetDate < this._rangeStart) {
        this._rangeEnd = new Date(this._rangeStart);
        this._rangeStart = targetDate;
      } else {
        this._rangeEnd = targetDate;
      }
      this._input.value = `${this._formatDate(this._rangeStart)} - ${this._formatDate(this._rangeEnd)}`;
      this.close();
      triggerEvent(this._element, 'boodoo.datepicker.change', {
        value: this._input.value,
        start: this._rangeStart,
        end: this._rangeEnd,
      });
    }
  }

  render() {
    if (!this._popup) return;

    const year = this._viewDate.getFullYear();
    const month = this._viewDate.getMonth();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const todayDate = new Date();
    const todayStr = this._formatDate(todayDate);

    // Header
    let html = `
      <div class="date-picker-header">
        <button type="button" class="date-picker-nav-btn date-picker-prev" aria-label="Previous month">‹</button>
        <span class="date-picker-title" id="dp-title-${this._uid || 'calendar'}">${monthNames[month]} ${year}</span>
        <button type="button" class="date-picker-nav-btn date-picker-next" aria-label="Next month">›</button>
      </div>
      <div class="date-picker-grid" role="grid" aria-labelledby="dp-title-${this._uid || 'calendar'}">
        <div role="row" class="date-picker-row date-picker-weekdays-row" style="display: contents;">
    `;

    // Weekday headers
    weekdays.forEach((wd) => {
      html += `<span class="date-picker-weekday" role="columnheader">${wd}</span>`;
    });
    html += `</div>`;

    // Build all cells (previous month, current month, next month)
    const cellsData = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      cellsData.push({
        html: `<button type="button" class="date-picker-cell other-month" role="gridcell" disabled tabindex="-1">${day}</button>`,
      });
    }

    // Determine which date cell should have tabindex="0" (roving focus: selected date if in current view, else today if in current view, else day 1)
    let rovingDay = 1;
    if (
      !this._isRange &&
      this._selectedDate &&
      this._selectedDate.getFullYear() === year &&
      this._selectedDate.getMonth() === month
    ) {
      rovingDay = this._selectedDate.getDate();
    } else if (todayDate.getFullYear() === year && todayDate.getMonth() === month) {
      rovingDay = todayDate.getDate();
    }

    // Current month days
    for (let day = 1; day <= lastDayOfMonth; day++) {
      const current = new Date(year, month, day);
      const curStr = this._formatDate(current);

      let classes = ['date-picker-cell'];
      let isSelected = false;
      if (curStr === todayStr) classes.push('today');

      if (!this._isRange && this._selectedDate && this._formatDate(this._selectedDate) === curStr) {
        classes.push('selected');
        isSelected = true;
      } else if (this._isRange) {
        const startStr = this._rangeStart ? this._formatDate(this._rangeStart) : '';
        const endStr = this._rangeEnd ? this._formatDate(this._rangeEnd) : '';

        if (curStr === startStr) {
          classes.push('range-start');
          isSelected = true;
        }
        if (curStr === endStr) {
          classes.push('range-end');
          isSelected = true;
        }
        if (
          this._rangeStart &&
          this._rangeEnd &&
          current > this._rangeStart &&
          current < this._rangeEnd
        ) {
          classes.push('range-in');
        }
      }

      const ariaSelected = isSelected ? ' aria-selected="true"' : ' aria-selected="false"';
      const cellTabindex = day === rovingDay ? ' tabindex="0"' : ' tabindex="-1"';
      cellsData.push({
        html: `<button type="button" class="${classes.join(' ')}" role="gridcell"${ariaSelected}${cellTabindex} data-date="${curStr}">${day}</button>`,
      });
    }

    // Trailing days to fill 7 columns
    const totalRendered = firstDayIndex + lastDayOfMonth;
    const remaining = (7 - (totalRendered % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      cellsData.push({
        html: `<button type="button" class="date-picker-cell other-month" role="gridcell" disabled tabindex="-1">${day}</button>`,
      });
    }

    // Chunk cells into rows of 7 with role="row" and style="display: contents;"
    for (let i = 0; i < cellsData.length; i += 7) {
      html += `<div role="row" class="date-picker-row" style="display: contents;">`;
      for (let j = 0; j < 7 && i + j < cellsData.length; j++) {
        html += cellsData[i + j].html;
      }
      html += `</div>`;
    }

    html += `
      </div>
      <div class="date-picker-footer">
        <button type="button" class="date-picker-today-btn">Today</button>
        <button type="button" class="date-picker-clear-btn">Clear</button>
      </div>
    `;

    this._popup.innerHTML = html;

    // Attach listeners inside popup
    const prevBtn = this._popup.querySelector('.date-picker-prev');
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevMonth());

    const nextBtn = this._popup.querySelector('.date-picker-next');
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextMonth());

    const todayBtn = this._popup.querySelector('.date-picker-today-btn');
    if (todayBtn) todayBtn.addEventListener('click', () => this.today());

    const clearBtn = this._popup.querySelector('.date-picker-clear-btn');
    if (clearBtn) clearBtn.addEventListener('click', () => this.clear());

    const cells = this._popup.querySelectorAll('.date-picker-cell[data-date]');
    cells.forEach((cell) => {
      cell.addEventListener('click', () => {
        const dStr = cell.getAttribute('data-date');
        if (dStr) this.selectDate(dStr);
      });
    });

    // Arrow key navigation inside calendar grid
    this._popup.addEventListener('keydown', (e) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key))
        return;
      const focusedCell = this._popup.querySelector('.date-picker-cell:focus');
      if (!focusedCell || !focusedCell.hasAttribute('data-date')) return;

      const activeDate = parseLocalDate(focusedCell.getAttribute('data-date'));
      if (!activeDate) return;

      e.preventDefault();
      let nextDate = new Date(activeDate);
      if (e.key === 'ArrowLeft') nextDate.setDate(nextDate.getDate() - 1);
      else if (e.key === 'ArrowRight') nextDate.setDate(nextDate.getDate() + 1);
      else if (e.key === 'ArrowUp') nextDate.setDate(nextDate.getDate() - 7);
      else if (e.key === 'ArrowDown') nextDate.setDate(nextDate.getDate() + 7);
      else if (e.key === 'Home') nextDate.setDate(1);
      else if (e.key === 'End') {
        nextDate.setMonth(nextDate.getMonth() + 1, 0);
      }

      if (
        nextDate.getMonth() !== this._viewDate.getMonth() ||
        nextDate.getFullYear() !== this._viewDate.getFullYear()
      ) {
        this._viewDate = new Date(nextDate);
        this.render();
      }

      const targetStr = this._formatDate(nextDate);
      const targetBtn = this._popup.querySelector(`.date-picker-cell[data-date="${targetStr}"]`);
      if (targetBtn) targetBtn.focus();
    });
  }

  dispose() {
    if (this._onDocClick) {
      document.removeEventListener('click', this._onDocClick);
      this._onDocClick = null;
    }
    if (this._toggleBtn && this._onToggleClick) {
      this._toggleBtn.removeEventListener('click', this._onToggleClick);
      this._toggleBtn = null;
    }
    if (this._input && this._onInputClick) {
      this._input.removeEventListener('click', this._onInputClick);
      this._input = null;
    }
    if (this._popup && this._popup.parentNode) {
      this._popup.parentNode.removeChild(this._popup);
      this._popup = null;
    }
    super.dispose();
  }
}

initDataApi(DatePicker, '.date-picker, [data-boodoo="datepicker"]');
