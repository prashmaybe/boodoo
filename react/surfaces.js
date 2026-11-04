// =====================================================================
// BOODOO React — Surfaces & Cards
// Card, Surface, Divider, StatWidget, and BentoGrid
// =====================================================================

import React from 'react';

export function Card({ className = '', children, header, footer, image, ...props }) {
  return React.createElement(
    'div',
    { className: ['card', className].filter(Boolean).join(' '), ...props },
    image && React.createElement('img', { src: image, className: 'card-img-top', alt: '' }),
    header && React.createElement('div', { className: 'card-header' }, header),
    React.createElement('div', { className: 'card-body' }, children),
    footer && React.createElement('div', { className: 'card-footer' }, footer)
  );
}

export function Surface({ elevation = 1, className = '', children, ...props }) {
  return React.createElement(
    'div',
    {
      className: ['surface', `shadow-${elevation}`, className].filter(Boolean).join(' '),
      ...props,
    },
    children
  );
}

export function Divider({ vertical = false, className = '', ...props }) {
  if (vertical) {
    return React.createElement('div', {
      className: ['vr', className].filter(Boolean).join(' '),
      role: 'separator',
      'aria-orientation': 'vertical',
      ...props,
    });
  }
  return React.createElement('hr', {
    className: className || undefined,
    ...props,
  });
}

export const Separator = Divider;

export function StatWidget({ title, value, change, trend = 'up', icon, className = '', ...props }) {
  return React.createElement(
    'div',
    { className: ['card', 'stat-widget', className].filter(Boolean).join(' '), ...props },
    React.createElement(
      'div',
      { className: 'card-body d-flex align-items-center justify-content-between' },
      React.createElement(
        'div',
        null,
        React.createElement('p', { className: 'text-muted small mb-1' }, title),
        React.createElement('h3', { className: 'mb-0 fw-bold' }, value),
        change &&
          React.createElement(
            'p',
            {
              className: [
                `text-${trend === 'up' ? 'success' : 'danger'}`,
                'small',
                'mb-0',
                'mt-1',
              ].join(' '),
            },
            trend === 'up' ? '↑ ' : '↓ ',
            change
          )
      ),
      icon && React.createElement('div', { className: 'stat-icon text-primary fs-3' }, icon)
    )
  );
}

export function BentoGrid({ columns = 3, className = '', children, ...props }) {
  return React.createElement(
    'div',
    {
      className: ['bento-grid', className].filter(Boolean).join(' '),
      style: {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1rem',
      },
      ...props,
    },
    children
  );
}

export function BentoItem({
  colSpan = 1,
  rowSpan = 1,
  className = '',
  children,
  style = {},
  ...props
}) {
  return React.createElement(
    'div',
    {
      className: ['bento-item', 'card', className].filter(Boolean).join(' '),
      style: {
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        ...style,
      },
      ...props,
    },
    React.createElement('div', { className: 'card-body' }, children)
  );
}
