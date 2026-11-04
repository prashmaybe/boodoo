// =====================================================================
// BOODOO React — Layout & Structure Primitives
// Flex, Grid, Box, Container, Stack, and Splitter
// =====================================================================

import React from 'react';

export function Box({
  as = 'div',
  className = '',
  children,
  style,
  ...props
}) {
  const Component = as;
  return React.createElement(Component, { className: className || undefined, style, ...props }, children);
}

export function Container({
  fluid = false,
  breakpoint,
  className = '',
  children,
  ...props
}) {
  let prefix = 'container';
  if (fluid) prefix = 'container-fluid';
  else if (breakpoint) prefix = `container-${breakpoint}`;

  return React.createElement(
    'div',
    { className: [prefix, className].filter(Boolean).join(' '), ...props },
    children
  );
}

export function Row({
  gap,
  className = '',
  children,
  ...props
}) {
  const gapClass = gap !== undefined ? `g-${gap}` : '';
  return React.createElement(
    'div',
    { className: ['row', gapClass, className].filter(Boolean).join(' '), ...props },
    children
  );
}

export function Col({
  span,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  offset,
  className = '',
  children,
  ...props
}) {
  const classes = ['col'];
  if (span) classes[0] = `col-${span}`;
  if (xs) classes.push(`col-xs-${xs}`);
  if (sm) classes.push(`col-sm-${sm}`);
  if (md) classes.push(`col-md-${md}`);
  if (lg) classes.push(`col-lg-${lg}`);
  if (xl) classes.push(`col-xl-${xl}`);
  if (xxl) classes.push(`col-xxl-${xxl}`);
  if (offset) classes.push(`offset-${offset}`);
  if (className) classes.push(className);

  return React.createElement('div', { className: classes.join(' '), ...props }, children);
}

export function HStack({
  spacing = 2,
  align = 'center',
  justify,
  wrap = false,
  className = '',
  children,
  ...props
}) {
  const classes = [
    'd-flex',
    'flex-row',
    `gap-${spacing}`,
    align ? `align-items-${align}` : '',
    justify ? `justify-content-${justify}` : '',
    wrap ? 'flex-wrap' : 'flex-nowrap',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return React.createElement('div', { className: classes, ...props }, children);
}

export const XStack = HStack;

export function VStack({
  spacing = 2,
  align,
  justify,
  className = '',
  children,
  ...props
}) {
  const classes = [
    'd-flex',
    'flex-column',
    `gap-${spacing}`,
    align ? `align-items-${align}` : '',
    justify ? `justify-content-${justify}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return React.createElement('div', { className: classes, ...props }, children);
}

export const YStack = VStack;

export function Center({
  className = '',
  children,
  ...props
}) {
  return React.createElement(
    'div',
    {
      className: ['d-flex', 'align-items-center', 'justify-content-center', className]
        .filter(Boolean)
        .join(' '),
      ...props,
    },
    children
  );
}

export function Grid({
  columns = 12,
  gap = 3,
  className = '',
  children,
  style = {},
  ...props
}) {
  return React.createElement(
    'div',
    {
      className: ['grid', className].filter(Boolean).join(' '),
      style: {
        display: 'grid',
        gridTemplateColumns: typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns,
        gap: typeof gap === 'number' ? `var(--boodoo-spacer-${gap}, ${gap * 0.5}rem)` : gap,
        ...style,
      },
      ...props,
    },
    children
  );
}

export function Splitter({
  vertical = false,
  minSize = 50,
  className = '',
  children,
  ...props
}) {
  return React.createElement(
    'div',
    {
      className: ['splitter', vertical ? 'splitter-vertical' : 'splitter-horizontal', className]
        .filter(Boolean)
        .join(' '),
      'data-boodoo-min-size': minSize,
      ...props,
    },
    children
  );
}
