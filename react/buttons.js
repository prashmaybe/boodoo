// =====================================================================
// BOODOO React — Buttons & Actions
// Button, ButtonGroup, IconButton, FAB, and SegmentedButtons
// =====================================================================

import React from 'react';

export function Button({
  variant = 'primary',
  size,
  outline = false,
  soft = false,
  disabled = false,
  loading = false,
  className = '',
  children,
  onClick,
  type = 'button',
  ...props
}) {
  let prefix = 'btn-';
  if (outline) prefix = 'btn-outline-';
  else if (soft) prefix = 'btn-soft-';

  const variantClass = variant ? `${prefix}${variant}` : '';
  const sizeClass = size ? `btn-${size}` : '';
  const fullClassName = ['btn', variantClass, sizeClass, loading ? 'btn-loading' : '', className]
    .filter(Boolean)
    .join(' ');

  return React.createElement(
    'button',
    {
      type,
      disabled: disabled || loading,
      className: fullClassName,
      onClick,
      ...props,
    },
    loading && React.createElement('span', { className: 'spinner-border spinner-border-sm me-2', role: 'status', 'aria-hidden': 'true' }),
    children
  );
}

export function ButtonGroup({
  vertical = false,
  size,
  className = '',
  children,
  ...props
}) {
  const prefix = vertical ? 'btn-group-vertical' : 'btn-group';
  const sizeClass = size ? `btn-group-${size}` : '';

  return React.createElement(
    'div',
    {
      role: 'group',
      className: [prefix, sizeClass, className].filter(Boolean).join(' '),
      ...props,
    },
    children
  );
}

export function IconButton({
  icon,
  variant = 'secondary',
  outline = true,
  size = 'sm',
  className = '',
  children,
  'aria-label': ariaLabel,
  ...props
}) {
  return React.createElement(
    Button,
    {
      variant,
      outline,
      size,
      className: ['btn-icon', className].filter(Boolean).join(' '),
      'aria-label': ariaLabel,
      ...props,
    },
    icon || children
  );
}

export function FAB({
  icon,
  position = 'bottom-right',
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  return React.createElement(
    'button',
    {
      type: 'button',
      className: ['btn', `btn-${variant}`, 'btn-fab', `fab-${position}`, className]
        .filter(Boolean)
        .join(' '),
      ...props,
    },
    icon || children
  );
}

export function SegmentedButtons({
  options = [],
  value,
  onChange,
  className = '',
  ...props
}) {
  return React.createElement(
    'div',
    {
      role: 'radiogroup',
      className: ['segmented-control', className].filter(Boolean).join(' '),
      ...props,
    },
    options.map((opt) => {
      const selected = opt.value === value;
      return React.createElement(
        'button',
        {
          key: opt.value,
          type: 'button',
          role: 'radio',
          'aria-checked': selected,
          disabled: opt.disabled,
          className: ['segmented-item', selected ? 'active' : ''].filter(Boolean).join(' '),
          onClick: () => onChange?.(opt.value),
        },
        opt.label
      );
    })
  );
}

