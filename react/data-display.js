// =====================================================================
// BOODOO React — Data Display Components
// Badge, Chip, Avatar, EmptyState, Timeline, StepIndicator
// =====================================================================

import React from 'react';

export function Badge({
  variant = 'primary',
  soft = false,
  outline = false,
  pill = false,
  className = '',
  children,
  ...props
}) {
  let variantClass = `badge-${variant}`;
  if (soft) variantClass = `badge-soft-${variant}`;
  else if (outline) variantClass = `badge-outline-${variant}`;

  const fullClassName = ['badge', variantClass, pill ? 'rounded-pill' : '', className]
    .filter(Boolean)
    .join(' ');

  return React.createElement('span', { className: fullClassName, ...props }, children);
}

export function Chip({
  variant = 'light',
  onClose,
  disabled = false,
  className = '',
  closeLabel = 'Remove chip',
  children,
  ...props
}) {
  return React.createElement(
    'span',
    {
      className: ['chip', `chip-${variant}`, disabled ? 'disabled' : '', className]
        .filter(Boolean)
        .join(' '),
      ...props,
    },
    React.createElement('span', { className: 'chip-label' }, children),
    onClose &&
      !disabled &&
      React.createElement(
        'button',
        {
          type: 'button',
          className: 'chip-close',
          'aria-label': closeLabel,
          onClick: onClose,
        },
        '×'
      )
  );
}

export function Avatar({ src, alt = '', initials, size = 'md', status, className = '', ...props }) {
  return React.createElement(
    'div',
    {
      className: ['avatar', `avatar-${size}`, className].filter(Boolean).join(' '),
      ...props,
    },
    src
      ? React.createElement('img', { src, alt, className: 'avatar-img' })
      : React.createElement('span', { className: 'avatar-initials' }, initials),
    status &&
      React.createElement('span', {
        className: ['avatar-indicator', `bg-${status}`].join(' '),
        'aria-hidden': 'true',
      })
  );
}

export function EmptyState({ title, description, icon, action, className = '', ...props }) {
  return React.createElement(
    'div',
    {
      className: ['empty-state', 'text-center', 'p-4', className].filter(Boolean).join(' '),
      ...props,
    },
    icon &&
      React.createElement('div', { className: 'empty-state-icon fs-1 mb-3 text-muted' }, icon),
    title && React.createElement('h4', { className: 'empty-state-title mb-2' }, title),
    description &&
      React.createElement(
        'p',
        { className: 'empty-state-description text-muted mb-3' },
        description
      ),
    action && React.createElement('div', { className: 'empty-state-action' }, action)
  );
}

export function Timeline({ className = '', children, ...props }) {
  return React.createElement(
    'ul',
    {
      className: ['timeline', className].filter(Boolean).join(' '),
      ...props,
    },
    children
  );
}

export function TimelineItem({ title, time, badge, className = '', children, ...props }) {
  return React.createElement(
    'li',
    {
      className: ['timeline-item', className].filter(Boolean).join(' '),
      ...props,
    },
    badge && React.createElement('div', { className: 'timeline-badge' }, badge),
    React.createElement(
      'div',
      { className: 'timeline-content' },
      (title || time) &&
        React.createElement(
          'div',
          { className: 'timeline-header d-flex justify-content-between mb-1' },
          title && React.createElement('h5', { className: 'timeline-title mb-0' }, title),
          time && React.createElement('small', { className: 'timeline-time text-muted' }, time)
        ),
      children
    )
  );
}

export function StepIndicator({
  steps = [],
  currentStep = 0,
  onStepClick,
  className = '',
  ...props
}) {
  return React.createElement(
    'div',
    {
      className: ['stepper', className].filter(Boolean).join(' '),
      ...props,
    },
    steps.map((step, idx) => {
      const isCompleted = idx < currentStep;
      const isCurrent = idx === currentStep;
      return React.createElement(
        'div',
        {
          key: step.key || idx,
          className: ['step-item', isCompleted ? 'completed' : '', isCurrent ? 'active' : '']
            .filter(Boolean)
            .join(' '),
          onClick: () => onStepClick?.(idx),
        },
        React.createElement('div', { className: 'step-circle' }, isCompleted ? '✓' : idx + 1),
        React.createElement('div', { className: 'step-label' }, step.title || step.label)
      );
    })
  );
}

export function VirtualList({
  items = [],
  itemHeight = 48,
  height = '320px',
  className = '',
  children,
  ...props
}) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
  const endIndex = Math.min(items.length, startIndex + 15);
  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  return React.createElement(
    'div',
    {
      className: ['boodoo-virtual-list position-relative overflow-auto', className]
        .filter(Boolean)
        .join(' '),
      style: { height },
      onScroll: (e) => setScrollTop(e.currentTarget.scrollTop),
      ...props,
    },
    React.createElement(
      'div',
      {
        className: 'virtual-list-spacer position-relative w-100',
        style: { height: `${totalHeight}px` },
      },
      React.createElement(
        'div',
        {
          className: 'virtual-list-content position-absolute top-0 start-0 end-0',
          style: { transform: `translateY(${offsetY}px)` },
        },
        visibleItems.map((item, idx) =>
          typeof children === 'function'
            ? children(item, startIndex + idx)
            : React.createElement(
                'div',
                { key: startIndex + idx, className: 'p-2 border-bottom' },
                React.createElement('span', null, String(item))
              )
        )
      )
    )
  );
}

export function Markdown({ content = '', className = '', ...props }) {
  // Safe dynamic client/SSR Markdown rendering with XSS sanitization
  function escapeText(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const raw = String(content || '').replace(/\r\n/g, '\n');
  const safeLines = raw.split('\n').map((line) => {
    const trimmed = line.trim();
    if (/^### (.*$)/i.test(trimmed)) {
      const heading = trimmed.replace(/^###\s+/, '');
      return `<h3><span>${escapeText(heading)}</span></h3>`;
    }
    if (/^## (.*$)/i.test(trimmed)) {
      const heading = trimmed.replace(/^##\s+/, '');
      return `<h2><span>${escapeText(heading)}</span></h2>`;
    }
    if (/^# (.*$)/i.test(trimmed)) {
      const heading = trimmed.replace(/^#\s+/, '');
      return `<h1><span>${escapeText(heading)}</span></h1>`;
    }
    let escaped = escapeText(line);
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return `<p><span>${escaped}</span></p>`;
  });

  return React.createElement('div', {
    className: ['boodoo-markdown', className].filter(Boolean).join(' '),
    dangerouslySetInnerHTML: {
      __html: safeLines.join('\n'),
    },
    ...props,
  });
}

export function Icon({ name = '', size = 20, className = '', label = '', ...props }) {
  return React.createElement(
    'span',
    {
      className: ['boodoo-icon-wrapper', className].filter(Boolean).join(' '),
      'aria-hidden': !label ? 'true' : undefined,
      'aria-label': label || undefined,
      role: label ? 'img' : undefined,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
      },
      ...props,
    },
    React.createElement('i', { className: `hi hi-${name}` })
  );
}
