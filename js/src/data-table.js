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
    const sortHeaders = this._table.querySelectorAll('thead th.sortable');
    sortHeaders.forEach((th) => {
      th.addEventListener('click', () => {
        this.sortBy(th);
      });
    });

    // 2. Select all checkbox
    const selectAll = this._table.querySelector(
      'thead th.data-table-select-col input[type="checkbox"]'
    );
    if (selectAll) {
      selectAll.addEventListener('change', (e) => {
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
      });
    }

    // 3. Individual row checkbox change
    this._table.addEventListener('change', (e) => {
      if (e.target.matches('tbody td.data-table-select-col input[type="checkbox"]')) {
        const tr = e.target.closest('tr');
        if (tr) tr.classList.toggle('selected', e.target.checked);

        // Update selectAll indeterminate / checked
        if (selectAll) {
          const rowChecks = Array.from(
            this._table.querySelectorAll('tbody td.data-table-select-col input[type="checkbox"]')
          );
          const selected = rowChecks.filter((c) => c.checked);
          selectAll.checked = selected.length === rowChecks.length && rowChecks.length > 0;
          selectAll.indeterminate = selected.length > 0 && selected.length < rowChecks.length;
        }

        triggerEvent(this._element, 'boodoo.datatable.selectionChange', {
          row: tr,
          checked: e.target.checked,
        });
      }
    });

    // 4. Expandable rows
    this._table.addEventListener('click', (e) => {
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
    });
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
      const next = row.nextElementSibling;
      if (next && next.classList.contains('data-table-row-detail')) {
        rowDetails.set(row, next);
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
      const detailRow = rowDetails.get(row);
      tbody.appendChild(row);
      if (detailRow) {
        tbody.appendChild(detailRow);
      }
    });

    triggerEvent(this._element, 'boodoo.datatable.sorted', {
      colIndex,
      direction: this._sortAsc ? 'asc' : 'desc',
    });
  }
}

initDataApi(DataTable, '.data-table-wrapper, table.data-table, [data-boodoo="datatable"]');
