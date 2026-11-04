// =====================================================================
// BOODOO React — Typography Primitives
// Semantic, accessible typography components with host theming support
// =====================================================================

import React from 'react';

export function Text({
  as = 'p',
  variant,
  color,
  size,
  weight,
  align,
  truncate = false,
  className = '',
  children,
  ...props
}) {
  const Component = as;
  const classes = [
    variant ? `text-${variant}` : '',
    color ? `text-${color}` : '',
    size ? `fs-${size}` : '',
    weight ? `fw-${weight}` : '',
    align ? `text-${align}` : '',
    truncate ? 'text-truncate' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return React.createElement(Component, { className: classes || undefined, ...props }, children);
}

export function Heading({ level = 2, as, className = '', children, ...props }) {
  const Component = as || `h${level}`;
  return React.createElement(Component, { className: className || undefined, ...props }, children);
}
