// =====================================================================
// BOODOO React — Overlays, Modals & Menus
// Dialog, ConfirmDialog, Offcanvas, Dropdown, and Tooltip
// =====================================================================

import React, { useState } from 'react';
import { Button } from './buttons.js';

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

export const Modal = Dialog;

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
          name: 'boodoo-confirm-match-input',
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

export function Offcanvas({
  open = false,
  onClose,
  title,
  placement = 'start',
  className = '',
  children,
  ...props
}) {
  if (!open) return null;

  return React.createElement(
    React.Fragment,
    null,
    React.createElement('div', {
      className: 'offcanvas-backdrop fade show',
      onClick: onClose,
    }),
    React.createElement(
      'div',
      {
        className: ['offcanvas', `offcanvas-${placement}`, 'show', className]
          .filter(Boolean)
          .join(' '),
        tabIndex: -1,
        role: 'dialog',
        'aria-modal': 'true',
        ...props,
      },
      title &&
        React.createElement(
          'div',
          { className: 'offcanvas-header' },
          React.createElement('h5', { className: 'offcanvas-title' }, title),
          onClose &&
            React.createElement('button', {
              type: 'button',
              className: 'btn-close text-reset',
              'aria-label': 'Close',
              onClick: onClose,
            })
        ),
      React.createElement('div', { className: 'offcanvas-body' }, children)
    )
  );
}

export const Drawer = Offcanvas;

export function Dropdown({ trigger, items = [], open, onToggle, className = '', ...props }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;

  const toggle = () => {
    if (onToggle) onToggle(!isOpen);
    else setInternalOpen(!isOpen);
  };

  return React.createElement(
    'div',
    {
      className: ['dropdown', isOpen ? 'show' : '', className].filter(Boolean).join(' '),
      ...props,
    },
    React.createElement(
      'div',
      {
        onClick: toggle,
        'aria-expanded': isOpen,
        className: 'dropdown-trigger',
      },
      trigger
    ),
    isOpen &&
      React.createElement(
        'ul',
        { className: 'dropdown-menu show' },
        items.map((item, idx) =>
          item.divider
            ? React.createElement(
                'li',
                { key: idx },
                React.createElement('hr', { className: 'dropdown-divider' })
              )
            : React.createElement(
                'li',
                { key: item.key || idx },
                React.createElement(
                  'button',
                  {
                    type: 'button',
                    disabled: item.disabled,
                    className: ['dropdown-item', item.disabled ? 'disabled' : '']
                      .filter(Boolean)
                      .join(' '),
                    onClick: () => {
                      item.onClick?.();
                      toggle();
                    },
                  },
                  item.label
                )
              )
        )
      )
  );
}

export function Tooltip({ content, children, placement = 'top', className = '', ...props }) {
  const [visible, setVisible] = useState(false);

  return React.createElement(
    'div',
    {
      className: ['tooltip-wrapper', 'position-relative', 'd-inline-block', className]
        .filter(Boolean)
        .join(' '),
      onMouseEnter: () => setVisible(true),
      onMouseLeave: () => setVisible(false),
      onFocus: () => setVisible(true),
      onBlur: () => setVisible(false),
      ...props,
    },
    children,
    visible &&
      React.createElement(
        'div',
        {
          role: 'tooltip',
          className: ['tooltip', `bs-tooltip-${placement}`, 'show'].join(' '),
          style: {
            position: 'absolute',
            bottom: placement === 'top' ? '100%' : undefined,
            top: placement === 'bottom' ? '100%' : undefined,
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 1070,
          },
        },
        React.createElement('div', { className: 'tooltip-inner' }, content)
      )
  );
}
