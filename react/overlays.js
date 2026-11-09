// =====================================================================
// BOODOO React — Overlays, Modals & Menus
// Dialog, ConfirmDialog, Offcanvas, Dropdown, Tooltip, and Portal
// =====================================================================

import React, { useState, useEffect, useRef, useId } from 'react';
import { Button } from './buttons.js';

let cachedCreatePortal = undefined;
function getCreatePortal() {
  if (cachedCreatePortal !== undefined) return cachedCreatePortal;
  try {
    const rd = typeof window !== 'undefined' && (window.ReactDOM || window.ReactDom);
    if (rd && typeof rd.createPortal === 'function') {
      cachedCreatePortal = rd.createPortal;
      return cachedCreatePortal;
    }
  } catch (e) {}

  try {
    if (typeof require === 'function') {
      const rd = require('react-dom');
      if (rd && typeof rd.createPortal === 'function') {
        cachedCreatePortal = rd.createPortal;
        return cachedCreatePortal;
      }
    }
  } catch (e) {}

  cachedCreatePortal = null;
  return null;
}

export function Portal({ children, container }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  const target = container || document.body;
  const createPortal = getCreatePortal();
  if (createPortal) {
    return createPortal(children, target);
  }

  return children;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'area[href]',
].join(', ');

export function Dialog({
  open = false,
  onClose,
  title,
  children,
  footer,
  className = '',
  closeLabel = 'Close',
  portal = true,
  portalContainer,
  initialFocusRef,
  ...props
}) {
  const dialogRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    if (typeof document !== 'undefined') {
      previousActiveElementRef.current = document.activeElement;
    }

    const timer = setTimeout(() => {
      if (initialFocusRef && initialFocusRef.current) {
        initialFocusRef.current.focus?.();
      } else if (dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
        if (focusable.length > 0) {
          focusable[0].focus?.();
        } else {
          dialogRef.current.focus?.();
        }
      }
    }, 20);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
          (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0
        );
        if (!focusable.length) {
          e.preventDefault();
          dialogRef.current.focus?.();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !dialogRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !dialogRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      clearTimeout(timer);
      if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', handleKeyDown);
      }
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
      }
    };
  }, [open, onClose, initialFocusRef]);

  if (!open) return null;

  const content = React.createElement(
    React.Fragment,
    null,
    React.createElement('div', {
      className: 'modal-backdrop fade show',
      onClick: onClose,
    }),
    React.createElement(
      'div',
      {
        ref: dialogRef,
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
                  'aria-label': closeLabel,
                  onClick: onClose,
                })
            ),
          React.createElement('div', { className: 'modal-body' }, children),
          footer && React.createElement('div', { className: 'modal-footer' }, footer)
        )
      )
    )
  );

  if (portal) {
    return React.createElement(Portal, { container: portalContainer }, content);
  }

  return content;
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
  confirmMatchPrompt,
  id: customId,
  closeLabel = 'Close',
  portal = true,
  portalContainer,
  ...props
}) {
  const [typed, setTyped] = useState('');
  const canConfirm = !mustMatch || typed.trim() === mustMatch.trim();
  const generatedId = useId();
  const inputId = customId || `boodoo-confirm-match-${generatedId.replace(/:/g, '')}`;

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

  const matchPrompt = confirmMatchPrompt
    ? (typeof confirmMatchPrompt === 'function' ? confirmMatchPrompt(mustMatch) : confirmMatchPrompt)
    : ['Please type ', React.createElement('strong', { key: 'mustMatch' }, mustMatch), ' to confirm:'];

  return React.createElement(
    Dialog,
    {
      open,
      onClose: handleClose,
      title,
      closeLabel,
      portal,
      portalContainer,
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
          { className: 'form-label fw-medium', htmlFor: inputId },
          matchPrompt
        ),
        React.createElement('input', {
          id: inputId,
          name: inputId,
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
  closeLabel = 'Close',
  children,
  ...props
}) {
  const offcanvasRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    if (typeof document !== 'undefined') {
      previousActiveElementRef.current = document.activeElement;
    }

    const timer = setTimeout(() => {
      if (offcanvasRef.current) {
        const focusable = offcanvasRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
        if (focusable.length > 0) {
          focusable[0].focus?.();
        } else {
          offcanvasRef.current.focus?.();
        }
      }
    }, 20);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose?.();
        return;
      }

      if (e.key === 'Tab' && offcanvasRef.current) {
        const focusable = Array.from(offcanvasRef.current.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
          (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0
        );
        if (!focusable.length) {
          e.preventDefault();
          offcanvasRef.current.focus?.();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !offcanvasRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !offcanvasRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      clearTimeout(timer);
      if (typeof document !== 'undefined') {
        document.removeEventListener('keydown', handleKeyDown);
      }
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
      }
    };
  }, [open, onClose]);

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
        ref: offcanvasRef,
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
              'aria-label': closeLabel,
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
