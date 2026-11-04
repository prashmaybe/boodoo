// =====================================================================
// BOODOO — DOM React Components Suite
// Accessible, controlled, themeable DOM components for React 18 & 19
// Zero external runtime dependencies. Integrates with host CSS variables.
// =====================================================================

import React, { useState, useId, useMemo } from 'react';
import { useDisclosure, useCombobox, useAccordion } from './hooks.js';

/**
 * BoodooProvider — bridges host CSS variables and configures density
 */
export function BoodooProvider({
  children,
  density = 'normal',
  theme = {},
  className = '',
  style = {},
  ...props
}) {
  const dynamicStyles = useMemo(() => {
    const s = { ...style };
    if (theme.primary) s['--boodoo-primary'] = theme.primary;
    if (theme.surface) s['--boodoo-surface'] = theme.surface;
    if (theme.text) s['--boodoo-text'] = theme.text;
    if (theme.radius) s['--boodoo-radius'] = theme.radius;
    return s;
  }, [theme, style]);

  const densityClass = density === 'compact' ? 'boodoo-density-compact' : '';
  const mergedClass = ['boodoo', densityClass, className].filter(Boolean).join(' ');

  return React.createElement(
    'div',
    {
      className: mergedClass,
      'data-density': density,
      style: dynamicStyles,
      ...props,
    },
    children
  );
}

/**
 * Button component
 */
export function Button({
  variant = 'primary',
  size,
  outline = false,
  disabled = false,
  className = '',
  children,
  onClick,
  type = 'button',
  ...props
}) {
  const prefix = outline ? 'btn-outline-' : 'btn-';
  const variantClass = variant ? `${prefix}${variant}` : '';
  const sizeClass = size ? `btn-${size}` : '';
  const fullClassName = ['btn', variantClass, sizeClass, className].filter(Boolean).join(' ');

  return React.createElement(
    'button',
    {
      type,
      disabled,
      className: fullClassName,
      onClick,
      ...props,
    },
    children
  );
}

/**
 * Badge component
 */
export function Badge({
  variant = 'primary',
  soft = false,
  outline = false,
  className = '',
  children,
  ...props
}) {
  let variantClass = `badge-${variant}`;
  if (soft) variantClass = `badge-soft-${variant}`;
  else if (outline) variantClass = `badge-outline-${variant}`;

  const fullClassName = ['badge', variantClass, className].filter(Boolean).join(' ');

  return React.createElement(
    'span',
    {
      className: fullClassName,
      ...props,
    },
    children
  );
}

/**
 * Dialog / Modal component (controlled via `open` and `onClose`)
 */
export function Dialog({
  open = false,
  onClose,
  title,
  children,
  footer,
  className = '',
  ...props
}) {
  if (!open) return null;

  return React.createElement(
    React.Fragment,
    null,
    React.createElement('div', {
      className: 'modal-backdrop fade show',
      onClick: onClose,
    }),
    React.createElement(
      'div',
      {
        role: 'dialog',
        'aria-modal': 'true',
        tabIndex: -1,
        className: ['modal', 'fade', 'show', 'd-block', className].filter(Boolean).join(' '),
        ...props,
      },
      React.createElement(
        'div',
        { className: 'modal-dialog modal-dialog-centered' },
        React.createElement(
          'div',
          { className: 'modal-content' },
          title &&
            React.createElement(
              'div',
              { className: 'modal-header' },
              React.createElement('h5', { className: 'modal-title' }, title),
              onClose &&
                React.createElement('button', {
                  type: 'button',
                  className: 'btn-close',
                  'aria-label': 'Close',
                  onClick: onClose,
                })
            ),
          React.createElement('div', { className: 'modal-body' }, children),
          footer && React.createElement('div', { className: 'modal-footer' }, footer)
        )
      )
    )
  );
}

/**
 * ConfirmDialog component with type-to-confirm barrier
 */
export function ConfirmDialog({
  open = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  mustMatch,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  description,
  children,
  confirmVariant = 'danger',
  ...props
}) {
  const [typed, setTyped] = useState('');
  const canConfirm = !mustMatch || typed.trim() === mustMatch.trim();

  const handleClose = () => {
    setTyped('');
    onClose?.();
  };

  const handleConfirm = () => {
    if (canConfirm) {
      setTyped('');
      onConfirm?.();
    }
  };

  if (!open) return null;

  return React.createElement(
    Dialog,
    {
      open,
      onClose: handleClose,
      title,
      footer: React.createElement(
        React.Fragment,
        null,
        React.createElement(
          Button,
          { variant: 'secondary', outline: true, onClick: handleClose },
          cancelText
        ),
        React.createElement(
          Button,
          {
            variant: confirmVariant,
            disabled: !canConfirm,
            onClick: handleConfirm,
          },
          confirmText
        )
      ),
      ...props,
    },
    description && React.createElement('p', { className: 'text-muted mb-3' }, description),
    children,
    mustMatch &&
      React.createElement(
        'div',
        { className: 'mt-3' },
        React.createElement(
          'label',
          { className: 'form-label fw-medium', htmlFor: 'boodoo-confirm-match-input' },
          'Please type ',
          React.createElement('strong', null, mustMatch),
          ' to confirm:'
        ),
        React.createElement('input', {
          id: 'boodoo-confirm-match-input',
          type: 'text',
          className: 'form-control',
          value: typed,
          onChange: (e) => setTyped(e.target.value),
          placeholder: mustMatch,
          autoComplete: 'off',
        })
      )
  );
}

/**
 * Field component with label, description, error, and "Learn more" disclosure slot
 */
export function Field({
  label,
  id: customId,
  required = false,
  description,
  error,
  learnMore,
  children,
  className = '',
}) {
  const generatedId = useId();
  const id = customId || generatedId;
  const [showLearnMore, setShowLearnMore] = useState(false);

  return React.createElement(
    'div',
    { className: ['boodoo-field', className].filter(Boolean).join(' ') },
    label &&
      React.createElement(
        'div',
        { className: 'boodoo-field-label-row' },
        React.createElement(
          'label',
          { className: 'boodoo-field-label', htmlFor: id },
          label,
          required && React.createElement('span', { className: 'boodoo-field-required' }, '*')
        ),
        learnMore &&
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'boodoo-field-learn-more-btn',
              'aria-expanded': showLearnMore,
              onClick: () => setShowLearnMore((prev) => !prev),
            },
            showLearnMore ? 'Hide info' : 'Learn more'
          )
      ),
    showLearnMore &&
      learnMore &&
      React.createElement('div', { className: 'boodoo-field-learn-more-content' }, learnMore),
    children,
    description &&
      !error &&
      React.createElement('p', { className: 'boodoo-field-description' }, description),
    error && React.createElement('p', { className: 'boodoo-field-error' }, error)
  );
}

/**
 * Table component — Controlled column sorting, expandable detail rows in React tree
 */
export function Table({
  columns = [],
  data = [],
  sortColumn,
  sortDirection = 'asc',
  onSort,
  keyField = 'id',
  expandedRowRender,
  expandedKeys = [],
  className = '',
  responsive = true,
  hover = true,
  striped = false,
  bordered = false,
  ...props
}) {
  const tableClasses = [
    'table',
    hover ? 'table-hover' : '',
    striped ? 'table-striped' : '',
    bordered ? 'table-bordered' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleHeaderClick = (col) => {
    if (!col.sortable || !onSort) return;
    const isCurrent = sortColumn === col.key;
    const nextDir = isCurrent && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(col.key, nextDir);
  };

  const tableElement = React.createElement(
    'table',
    { className: tableClasses, ...props },
    React.createElement(
      'thead',
      null,
      React.createElement(
        'tr',
        null,
        columns.map((col) => {
          const isSorted = sortColumn === col.key;
          const sortIndicator = isSorted ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : '';
          return React.createElement(
            'th',
            {
              key: col.key,
              style: {
                cursor: col.sortable ? 'pointer' : 'default',
                userSelect: col.sortable ? 'none' : 'auto',
                width: col.width,
              },
              onClick: () => handleHeaderClick(col),
              'aria-sort': isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined,
            },
            col.title,
            sortIndicator
          );
        })
      )
    ),
    React.createElement(
      'tbody',
      null,
      data.length === 0
        ? React.createElement(
            'tr',
            null,
            React.createElement(
              'td',
              { colSpan: columns.length, className: 'text-center text-muted py-3' },
              'No records found'
            )
          )
        : data.map((row, index) => {
            const key = row[keyField] ?? index;
            const isExpanded = expandedKeys.includes(key);
            const mainRow = React.createElement(
              'tr',
              { key: `row-${key}` },
              columns.map((col) =>
                React.createElement(
                  'td',
                  { key: `${key}-${col.key}` },
                  col.render ? col.render(row[col.key], row, index) : row[col.key]
                )
              )
            );

            if (isExpanded && expandedRowRender) {
              const detailRow = React.createElement(
                'tr',
                { key: `detail-${key}`, className: 'boodoo-table-detail-row' },
                React.createElement(
                  'td',
                  { colSpan: columns.length },
                  expandedRowRender(row, index)
                )
              );
              return [mainRow, detailRow];
            }

            return mainRow;
          })
    )
  );

  if (responsive) {
    return React.createElement('div', { className: 'table-responsive' }, tableElement);
  }

  return tableElement;
}

/**
 * Combobox component — Controlled & uncontrolled with accent-folding and context meta
 */
export function Combobox({
  items = [],
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Select option...',
  getOptionMeta,
  disabled = false,
  className = '',
  id: customId,
  name,
  ...props
}) {
  const generatedId = useId();
  const inputId = customId || generatedId;

  const {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    activeIndex,
    selectedValue,
    filteredItems,
    selectItem,
    getInputProps,
    getListboxProps,
    getOptionProps,
  } = useCombobox({
    items,
    value,
    defaultValue,
    onChange,
    getOptionMeta,
  });

  return React.createElement(
    'div',
    {
      className: ['combobox', className].filter(Boolean).join(' '),
      ...props,
    },
    React.createElement(
      'div',
      { className: 'combobox-input-wrapper' },
      React.createElement('input', {
        ...getInputProps({
          id: inputId,
          name,
          disabled,
          placeholder,
          className: 'form-control combobox-input',
        }),
      }),
      query &&
        !disabled &&
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'combobox-clear',
            'aria-label': 'Clear input',
            onClick: () => {
              setQuery('');
              if (value !== undefined) onChange?.('');
            },
          },
          '×'
        )
    ),
    isOpen &&
      React.createElement(
        'ul',
        {
          ...getListboxProps({
            className: 'combobox-menu show',
          }),
        },
        filteredItems.length === 0
          ? React.createElement('li', { className: 'combobox-empty d-block' }, 'No matches found')
          : filteredItems.map((item, idx) => {
              const meta = getOptionMeta ? getOptionMeta(item) : item.meta;
              return React.createElement(
                'li',
                {
                  key: item.id || item.value || idx,
                  ...getOptionProps(item, idx, {
                    className: 'combobox-item',
                  }),
                },
                React.createElement(
                  'div',
                  null,
                  React.createElement('span', { className: 'combobox-item-label' }, item.label),
                  meta && React.createElement('span', { className: 'combobox-item-meta' }, meta)
                )
              );
            })
      )
  );
}

/**
 * Accordion component
 */
export function Accordion({
  items = [],
  allowMultiple = false,
  defaultExpanded = [],
  className = '',
  ...props
}) {
  const { toggle, isExpanded, getButtonProps, getPanelProps } = useAccordion({
    allowMultiple,
    defaultExpanded,
  });

  return React.createElement(
    'div',
    {
      className: ['accordion', className].filter(Boolean).join(' '),
      ...props,
    },
    items.map((item) => {
      const expanded = isExpanded(item.key);
      return React.createElement(
        'div',
        { className: 'accordion-item', key: item.key },
        React.createElement(
          'h2',
          { className: 'accordion-header' },
          React.createElement(
            'button',
            getButtonProps(item.key, {
              type: 'button',
              className: ['accordion-button', !expanded ? 'collapsed' : ''].filter(Boolean).join(' '),
            }),
            item.title
          )
        ),
        React.createElement(
          'div',
          getPanelProps(item.key, {
            className: ['accordion-collapse', expanded ? 'show' : ''].filter(Boolean).join(' '),
          }),
          React.createElement('div', { className: 'accordion-body' }, item.content)
        )
      );
    })
  );
}

/**
 * Nav component
 */
export function Nav({
  items = [],
  activeKey,
  onSelect,
  pills = false,
  className = '',
  ...props
}) {
  const navClass = ['nav', pills ? 'nav-pills' : '', className].filter(Boolean).join(' ');

  return React.createElement(
    'ul',
    { className: navClass, ...props },
    items.map((item) => {
      const active = item.key === activeKey;
      return React.createElement(
        'li',
        { className: 'nav-item', key: item.key },
        React.createElement(
          'button',
          {
            type: 'button',
            disabled: item.disabled,
            className: ['nav-link', active ? 'active' : '', item.disabled ? 'disabled' : '']
              .filter(Boolean)
              .join(' '),
            onClick: () => onSelect?.(item.key),
          },
          item.label
        )
      );
    })
  );
}

/**
 * StickyHeader component — page header that compacts on scroll and provides action slots
 */
export function StickyHeader({
  title,
  description,
  actions,
  isStuck = false,
  className = '',
  children,
  ...props
}) {
  return React.createElement(
    'header',
    {
      className: ['boodoo-sticky-header', isStuck ? 'boodoo-is-stuck' : '', className]
        .filter(Boolean)
        .join(' '),
      ...props,
    },
    React.createElement(
      'div',
      { className: 'boodoo-header-content' },
      React.createElement(
        'div',
        null,
        React.createElement('h1', { className: 'boodoo-header-title' }, title),
        description &&
          React.createElement('p', { className: 'boodoo-header-description' }, description)
      ),
      actions && React.createElement('div', { className: 'boodoo-header-actions' }, actions)
    ),
    children
  );
}
