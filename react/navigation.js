// =====================================================================
// BOODOO React — Navigation Components
// Nav, Navbar, Breadcrumb, Pagination, StickyHeader
// =====================================================================

import React from 'react';

export function Nav({
  items = [],
  activeKey,
  onSelect,
  pills = false,
  vertical = false,
  className = '',
  ...props
}) {
  const navClass = [
    'nav',
    pills ? 'nav-pills' : '',
    vertical ? 'flex-column' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

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

export function Navbar({
  brand,
  className = '',
  children,
  ...props
}) {
  return React.createElement(
    'nav',
    {
      className: ['navbar', 'navbar-expand-lg', className].filter(Boolean).join(' '),
      ...props,
    },
    React.createElement(
      'div',
      { className: 'container-fluid' },
      brand && React.createElement('a', { className: 'navbar-brand', href: '#' }, brand),
      children
    )
  );
}

export function Breadcrumb({
  items = [],
  className = '',
  ...props
}) {
  return React.createElement(
    'nav',
    { 'aria-label': 'breadcrumb', className: className || undefined, ...props },
    React.createElement(
      'ol',
      { className: 'breadcrumb' },
      items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return React.createElement(
          'li',
          {
            key: item.key || idx,
            className: ['breadcrumb-item', isLast ? 'active' : ''].filter(Boolean).join(' '),
            'aria-current': isLast ? 'page' : undefined,
          },
          isLast || !item.href
            ? React.createElement('span', null, item.label)
            : React.createElement('a', { href: item.href }, item.label)
        );
      })
    )
  );
}

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
  ...props
}) {
  return React.createElement(
    'nav',
    { 'aria-label': 'Pagination', className: className || undefined, ...props },
    React.createElement(
      'ul',
      { className: 'pagination' },
      React.createElement(
        'li',
        { className: ['page-item', currentPage <= 1 ? 'disabled' : ''].filter(Boolean).join(' ') },
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'page-link',
            disabled: currentPage <= 1,
            onClick: () => onPageChange?.(currentPage - 1),
          },
          '«'
        )
      ),
      Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;
        const isActive = page === currentPage;
        return React.createElement(
          'li',
          {
            key: page,
            className: ['page-item', isActive ? 'active' : ''].filter(Boolean).join(' '),
          },
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'page-link',
              onClick: () => onPageChange?.(page),
            },
            page
          )
        );
      }),
      React.createElement(
        'li',
        { className: ['page-item', currentPage >= totalPages ? 'disabled' : ''].filter(Boolean).join(' ') },
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'page-link',
            disabled: currentPage >= totalPages,
            onClick: () => onPageChange?.(currentPage + 1),
          },
          '»'
        )
      )
    )
  );
}

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

