// =====================================================================
// BOODOO React — Lists, Tables & Accordions
// Table, Accordion, List, and ListItem
// =====================================================================

import React from 'react';
import { useAccordion } from './hooks.js';

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

export function List({
  flush = false,
  numbered = false,
  className = '',
  children,
  ...props
}) {
  const Component = numbered ? 'ol' : 'ul';
  return React.createElement(
    Component,
    {
      className: ['list-group', flush ? 'list-group-flush' : '', numbered ? 'list-group-numbered' : '', className]
        .filter(Boolean)
        .join(' '),
      ...props,
    },
    children
  );
}

export function ListItem({
  active = false,
  disabled = false,
  action = false,
  className = '',
  children,
  onClick,
  ...props
}) {
  const Component = action || onClick ? 'button' : 'li';
  return React.createElement(
    Component,
    {
      type: Component === 'button' ? 'button' : undefined,
      className: [
        'list-group-item',
        active ? 'active' : '',
        disabled ? 'disabled' : '',
        action ? 'list-group-item-action' : '',
        className,
      ]
        .filter(Boolean)
        .join(' '),
      onClick,
      ...props,
    },
    children
  );
}

