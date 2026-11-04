// =====================================================================
// BOODOO React — Feedback & Status Indicators
// Alert, Banner, Toast, Spinner, and ProgressBar
// =====================================================================

import React from 'react';

export function Alert({
  variant = 'info',
  dismissible = false,
  onDismiss,
  title,
  icon,
  className = '',
  children,
  ...props
}) {
  return React.createElement(
    'div',
    {
      role: 'alert',
      className: [
        'alert',
        `alert-${variant}`,
        dismissible ? 'alert-dismissible' : '',
        'fade',
        'show',
        className,
      ]
        .filter(Boolean)
        .join(' '),
      ...props,
    },
    React.createElement(
      'div',
      { className: 'd-flex align-items-start gap-2' },
      icon && React.createElement('span', { className: 'alert-icon' }, icon),
      React.createElement(
        'div',
        { className: 'alert-content flex-grow-1' },
        title && React.createElement('h6', { className: 'alert-heading mb-1 fw-bold' }, title),
        children
      ),
      dismissible &&
        React.createElement('button', {
          type: 'button',
          className: 'btn-close',
          'aria-label': 'Close alert',
          onClick: onDismiss,
        })
    )
  );
}

export function Banner({
  variant = 'primary',
  onClose,
  className = '',
  children,
  ...props
}) {
  return React.createElement(
    'div',
    {
      className: ['banner', `banner-${variant}`, className].filter(Boolean).join(' '),
      ...props,
    },
    React.createElement('div', { className: 'banner-content container d-flex align-items-center justify-content-between py-2' },
      React.createElement('div', { className: 'banner-text' }, children),
      onClose &&
        React.createElement('button', {
          type: 'button',
          className: 'btn-close btn-close-white',
          'aria-label': 'Close banner',
          onClick: onClose,
        })
    )
  );
}

export function Toast({
  open = true,
  onClose,
  title,
  time,
  className = '',
  children,
  ...props
}) {
  if (!open) return null;

  return React.createElement(
    'div',
    {
      role: 'alert',
      'aria-live': 'assertive',
      'aria-atomic': 'true',
      className: ['toast', 'show', className].filter(Boolean).join(' '),
      ...props,
    },
    (title || onClose) &&
      React.createElement(
        'div',
        { className: 'toast-header d-flex align-items-center justify-content-between' },
        React.createElement('strong', { className: 'me-auto' }, title),
        time && React.createElement('small', { className: 'text-muted me-2' }, time),
        onClose &&
          React.createElement('button', {
            type: 'button',
            className: 'btn-close',
            'aria-label': 'Close',
            onClick: onClose,
          })
      ),
    React.createElement('div', { className: 'toast-body' }, children)
  );
}

export function Spinner({
  variant,
  size = 'md',
  grow = false,
  className = '',
  ...props
}) {
  const prefix = grow ? 'spinner-grow' : 'spinner-border';
  const sizeClass = size === 'sm' ? `${prefix}-sm` : '';
  const variantClass = variant ? `text-${variant}` : '';

  return React.createElement(
    'div',
    {
      role: 'status',
      className: [prefix, sizeClass, variantClass, className].filter(Boolean).join(' '),
      ...props,
    },
    React.createElement('span', { className: 'visually-hidden' }, 'Loading...')
  );
}

export function ProgressBar({
  value = 0,
  min = 0,
  max = 100,
  variant = 'primary',
  striped = false,
  animated = false,
  label,
  className = '',
  ...props
}) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return React.createElement(
    'div',
    {
      className: ['progress', className].filter(Boolean).join(' '),
      role: 'progressbar',
      'aria-valuenow': value,
      'aria-valuemin': min,
      'aria-valuemax': max,
      ...props,
    },
    React.createElement(
      'div',
      {
        className: [
          'progress-bar',
          `bg-${variant}`,
          striped ? 'progress-bar-striped' : '',
          animated ? 'progress-bar-animated' : '',
        ]
          .filter(Boolean)
          .join(' '),
        style: { width: `${percentage}%` },
      },
      label || (label === true ? `${Math.round(percentage)}%` : null)
    )
  );
}

export const Progress = ProgressBar;
