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
    this._selectedRowIds = new Set();
    if (this._selectAll) {
      this._onSelectAllChange = (e) => {
        const checked = e.target.checked;
        if (this._isVirtualized && this._virtualOptions) {
          if (checked) {
            const total = this._virtualOptions.totalRows || 0;
            const items = this._virtualOptions.items;
            const getRowId = this._virtualOptions.getRowId;
            for (let i = 0; i < total; i++) {
              let id = i;
              if (typeof getRowId === 'function') {
                const item = Array.isArray(items) ? items[i] : undefined;
                id = getRowId(item, i);
              } else if (Array.isArray(items) && items[i] && typeof items[i] === 'object' && items[i].id !== undefined) {
                id = items[i].id;
              }
              this._selectedRowIds.add(id);
            }
          } else {
            this._selectedRowIds.clear();
          }
          if (typeof this._renderVirtual === 'function') {
            this._renderVirtual();
          }
          triggerEvent(this._element, 'boodoo.datatable.selectionChange', {
            selectedCount: this._selectedRowIds.size,
          });
          return;
        }

        const rowChecks = this._table.querySelectorAll(
          'tbody td.data-table-select-col input[type="checkbox"]'
        );
        rowChecks.forEach((cb) => {
          cb.checked = checked;
          const tr = cb.closest('tr');
          if (tr) {
            tr.classList.toggle('selected', checked);
            const rowId = tr.getAttribute('data-row-id') || tr.getAttribute('data-row-index') || tr.id;
            if (rowId !== null && rowId !== undefined) {
              if (checked) this._selectedRowIds.add(rowId);
              else this._selectedRowIds.delete(rowId);
            }
          }
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

        if (this._isVirtualized && tr) {
          const rowId = tr.hasAttribute('data-row-id')
            ? tr.getAttribute('data-row-id')
            : tr.hasAttribute('data-row-index')
            ? parseInt(tr.getAttribute('data-row-index'), 10)
            : null;

          if (rowId !== null && rowId !== undefined) {
            if (e.target.checked) this._selectedRowIds.add(rowId);
            else this._selectedRowIds.delete(rowId);
          }

          if (this._selectAll && this._virtualOptions) {
            const total = this._virtualOptions.totalRows;
            this._selectAll.checked = this._selectedRowIds.size === total && total > 0;
            this._selectAll.indeterminate =
              this._selectedRowIds.size > 0 && this._selectedRowIds.size < total;
          }

          triggerEvent(this._element, 'boodoo.datatable.selectionChange', {
            row: tr,
            checked: e.target.checked,
            selectedCount: this._selectedRowIds.size,
          });
          return;
        }

        const nonVirtId = tr?.getAttribute('data-row-id') || tr?.getAttribute('data-row-index') || tr?.id;
        if (nonVirtId !== null && nonVirtId !== undefined) {
          if (e.target.checked) this._selectedRowIds.add(nonVirtId);
          else this._selectedRowIds.delete(nonVirtId);
        }

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
      if (
        this._onScroll &&
        this._scrollContainer &&
        typeof this._scrollContainer.removeEventListener === 'function'
      ) {
        this._scrollContainer.removeEventListener('scroll', this._onScroll);
        this._onScroll = null;
        this._scrollContainer = null;
      }
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

    if (this._isVirtualized) {
      if (typeof this._virtualOptions?.onSort === 'function') {
        this._virtualOptions.onSort(colIndex, this._sortAsc ? 'asc' : 'desc');
      } else if (Array.isArray(this._virtualOptions?.items)) {
        // Internal sorting over the complete dataset when items array is provided
        const items = this._virtualOptions.items;
        items.sort((a, b) => {
          let aVal = a;
          let bVal = b;
          if (Array.isArray(a)) aVal = a[colIndex];
          else if (a && typeof a === 'object') {
            const keys = Object.keys(a);
            aVal = a[keys[colIndex]] !== undefined ? a[keys[colIndex]] : a;
          }
          if (Array.isArray(b)) bVal = b[colIndex];
          else if (b && typeof b === 'object') {
            const keys = Object.keys(b);
            bVal = b[keys[colIndex]] !== undefined ? b[keys[colIndex]] : b;
          }
          const aStr = String(aVal ?? '').trim();
          const bStr = String(bVal ?? '').trim();
          const aNum = Number(aStr.replace(/[^0-9.-]+/g, ''));
          const bNum = Number(bStr.replace(/[^0-9.-]+/g, ''));
          if (!isNaN(aNum) && !isNaN(bNum) && aStr !== '' && bStr !== '') {
            return this._sortAsc ? aNum - bNum : bNum - aNum;
          }
          return this._sortAsc
            ? aStr.localeCompare(bStr, undefined, { numeric: true })
            : bStr.localeCompare(aStr, undefined, { numeric: true });
        });
      }
      if (typeof this._renderVirtual === 'function') {
        this._renderVirtual();
      }
      triggerEvent(this._element, 'boodoo.datatable.sorted', {
        colIndex,
        direction: this._sortAsc ? 'asc' : 'desc',
      });
      return;
    }

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

  virtualize(options = {}) {
    const {
      totalRows = 0,
      rowHeight = 40,
      buffer = 5,
      renderRow = null,
      container = this._element.matches('.data-table-wrapper')
        ? this._element
        : this._table.parentElement,
    } = options;

    if (!container || typeof renderRow !== 'function' || totalRows <= 0) return;

    this._isVirtualized = true;
    this._virtualOptions = options;
    this._scrollContainer = container;
    const tbody = this._table.querySelector('tbody');
    if (!tbody) return;

    // Ensure container styling for virtualization
    container.style.overflowY = 'auto';
    container.style.position = 'relative';

    const render = () => {
      const scrollTop = container.scrollTop;
      const viewportHeight = container.clientHeight || 400;

      const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
      const endIndex = Math.min(
        totalRows,
        Math.ceil((scrollTop + viewportHeight) / rowHeight) + buffer
      );

      const topPadding = startIndex * rowHeight;
      const bottomPadding = Math.max(0, (totalRows - endIndex) * rowHeight);

      tbody.replaceChildren();

      // Top spacer row
      if (topPadding > 0) {
        const topTr = document.createElement('tr');
        topTr.className = 'data-table-virtual-spacer';
        topTr.style.height = `${topPadding}px`;
        topTr.style.border = 'none';
        tbody.appendChild(topTr);
      }

      // Render visible slice
      const items = this._virtualOptions?.items;
      const getRowId = this._virtualOptions?.getRowId;
      for (let i = startIndex; i < endIndex; i++) {
        const tr = renderRow(i);
        if (tr) {
          tr.setAttribute('data-row-index', String(i));
          let rowId = i;
          if (tr.hasAttribute('data-row-id')) {
            rowId = tr.getAttribute('data-row-id');
          } else if (typeof getRowId === 'function') {
            const item = Array.isArray(items) ? items[i] : undefined;
            rowId = getRowId(item, i);
            tr.setAttribute('data-row-id', String(rowId));
          } else if (Array.isArray(items) && items[i] && typeof items[i] === 'object' && items[i].id !== undefined) {
            rowId = items[i].id;
            tr.setAttribute('data-row-id', String(rowId));
          }
          const cb = tr.querySelector('td.data-table-select-col input[type="checkbox"]');
          if (cb) {
            const isChecked = this._selectedRowIds.has(rowId) || this._selectedRowIds.has(String(rowId)) || (typeof rowId === 'number' && this._selectedRowIds.has(Number(rowId)));
            cb.checked = isChecked;
            tr.classList.toggle('selected', isChecked);
          }
          tbody.appendChild(tr);
        }
      }

      // Bottom spacer row
      if (bottomPadding > 0) {
        const bottomTr = document.createElement('tr');
        bottomTr.className = 'data-table-virtual-spacer';
        bottomTr.style.height = `${bottomPadding}px`;
        bottomTr.style.border = 'none';
        tbody.appendChild(bottomTr);
      }

      triggerEvent(this._element, 'boodoo.datatable.virtualScroll', {
        startIndex,
        endIndex,
        totalRows,
      });
    };

    this._renderVirtual = render;

    this._onScroll = () => {
      requestAnimationFrame(render);
    };

    container.addEventListener('scroll', this._onScroll, { passive: true });
    render();
  }
}

initDataApi(DataTable, '.data-table-wrapper, table.data-table, [data-boodoo="datatable"]');
