// =====================================================================
// BOODOO JS — Data Table Component
// Sortable columns, select-all checkboxes, expandable row details.
// =====================================================================

import { BaseComponent, initDataApi } from './base-component.js';
import { triggerEvent } from './util.js';

export class DataTable extends BaseComponent {
  static get NAME() {
    return 'dataTable';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._table = this._element.matches('table')
      ? this._element
      : this._element.querySelector('table');
    if (!this._table) return;

    this._sortColIndex = null;
    this._sortAsc = true;
    this._bindEvents();
  }

  _bindEvents() {
    // 1. Sortable column headers
    this._headerHandlers = [];
    const sortHeaders = this._table.querySelectorAll('thead th.sortable');
    sortHeaders.forEach((th) => {
      const handler = () => {
        this.sortBy(th);
      };
      th.addEventListener('click', handler);
      this._headerHandlers.push({ th, handler });
    });

    // 2. Select all checkbox
    this._selectAll = this._table.querySelector(
      'thead th.data-table-select-col input[type="checkbox"]'
    );
    if (this._selectAll) {
      this._onSelectAllChange = (e) => {
        const checked = e.target.checked;
        const rowChecks = this._table.querySelectorAll(
          'tbody td.data-table-select-col input[type="checkbox"]'
        );
        rowChecks.forEach((cb) => {
          cb.checked = checked;
          const tr = cb.closest('tr');
          if (tr) tr.classList.toggle('selected', checked);
        });
        triggerEvent(this._element, 'boodoo.datatable.selectionChange', {
          selectedCount: checked ? rowChecks.length : 0,
        });
      };
      this._selectAll.addEventListener('change', this._onSelectAllChange);
    }

    // 3. Individual row checkbox change
    this._onTableChange = (e) => {
      if (e.target.matches('tbody td.data-table-select-col input[type="checkbox"]')) {
        const tr = e.target.closest('tr');
        if (tr) tr.classList.toggle('selected', e.target.checked);

        // Update selectAll indeterminate / checked
        if (this._selectAll) {
          const rowChecks = Array.from(
            this._table.querySelectorAll('tbody td.data-table-select-col input[type="checkbox"]')
          );
          const selected = rowChecks.filter((c) => c.checked);
          this._selectAll.checked = selected.length === rowChecks.length && rowChecks.length > 0;
          this._selectAll.indeterminate = selected.length > 0 && selected.length < rowChecks.length;
        }

        triggerEvent(this._element, 'boodoo.datatable.selectionChange', {
          row: tr,
          checked: e.target.checked,
        });
      }
    };
    this._table.addEventListener('change', this._onTableChange);

    // 4. Expandable rows
    this._onTableClick = (e) => {
      const toggle = e.target.closest(
        '[data-boodoo-toggle="row-detail"], .data-table-expandable-row'
      );
      if (toggle && !e.target.matches('input[type="checkbox"], a, button')) {
        const row = toggle.closest('tr');
        const detailRow = row ? row.nextElementSibling : null;
        if (detailRow && detailRow.classList.contains('data-table-row-detail')) {
          const isShown = detailRow.classList.toggle('show');
          const icon = row.querySelector('.data-table-toggle-icon');
          if (icon) icon.classList.toggle('expanded', isShown);
          triggerEvent(this._element, 'boodoo.datatable.rowToggle', { row, detailRow, isShown });
        }
      }
    };
    this._table.addEventListener('click', this._onTableClick);
  }

  dispose() {
    if (this._headerHandlers) {
      this._headerHandlers.forEach(({ th, handler }) => {
        if (typeof th.removeEventListener === 'function') {
          th.removeEventListener('click', handler);
        }
      });
      this._headerHandlers = [];
    }
    if (this._selectAll && this._onSelectAllChange) {
      if (typeof this._selectAll.removeEventListener === 'function') {
        this._selectAll.removeEventListener('change', this._onSelectAllChange);
      }
      this._selectAll = null;
      this._onSelectAllChange = null;
    }
    if (this._table) {
      if (this._onTableChange && typeof this._table.removeEventListener === 'function') {
        this._table.removeEventListener('change', this._onTableChange);
        this._onTableChange = null;
      }
      if (this._onTableClick && typeof this._table.removeEventListener === 'function') {
        this._table.removeEventListener('click', this._onTableClick);
        this._onTableClick = null;
      }
      this._table = null;
    }
    super.dispose();
  }

  sortBy(headerEl) {
    const ths = Array.from(headerEl.parentElement.children);
    const colIndex = ths.indexOf(headerEl);
    const tbody = this._table.querySelector('tbody');
    if (!tbody) return;

    if (this._sortColIndex === colIndex) {
      this._sortAsc = !this._sortAsc;
    } else {
      this._sortColIndex = colIndex;
      this._sortAsc = true;
    }

    ths.forEach((th) => {
      th.classList.remove('sort-asc', 'sort-desc');
    });
    headerEl.classList.add(this._sortAsc ? 'sort-asc' : 'sort-desc');

    const rows = Array.from(tbody.querySelectorAll('tr:not(.data-table-row-detail)'));

    // Capture companion detail rows before any DOM reordering
    const rowDetails = new Map();
    rows.forEach((row) => {
      const details = [];
      let next = row.nextElementSibling;
      while (next && next.classList && next.classList.contains('data-table-row-detail')) {
        details.push(next);
        next = next.nextElementSibling;
      }
      if (details.length > 0) {
        rowDetails.set(row, details);
      }
    });

    rows.sort((a, b) => {
      const aText = (a.children[colIndex] ? a.children[colIndex].innerText : '').trim();
      const bText = (b.children[colIndex] ? b.children[colIndex].innerText : '').trim();

      const aClean = aText.replace(/[^0-9.-]+/g, '');
      const bClean = bText.replace(/[^0-9.-]+/g, '');
      const aNum = aClean !== '' ? Number(aClean) : NaN;
      const bNum = bClean !== '' ? Number(bClean) : NaN;

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return this._sortAsc ? aNum - bNum : bNum - aNum;
      }
      return this._sortAsc
        ? aText.localeCompare(bText, undefined, { numeric: true })
        : bText.localeCompare(aText, undefined, { numeric: true });
    });

    rows.forEach((row) => {
      const details = rowDetails.get(row);
      tbody.appendChild(row);
      if (details) {
        details.forEach((d) => tbody.appendChild(d));
      }
    });

    triggerEvent(this._element, 'boodoo.datatable.sorted', {
      colIndex,
      direction: this._sortAsc ? 'asc' : 'desc',
    });
  }
}

initDataApi(DataTable, '.data-table-wrapper, table.data-table, [data-boodoo="datatable"]');
