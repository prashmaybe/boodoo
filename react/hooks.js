// =====================================================================
// BOODOO — Headless React Hooks
// Declarative state management hooks for Modals, Dropdowns, Tooltips,
// Accordions, and Comboboxes in Next.js, Remix, Vite, and React apps.
// =====================================================================

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Headless disclosure hook (Modal, Drawer, Dialog, Offcanvas)
 * @param {Object} [options]
 * @param {boolean} [options.defaultOpen=false]
 * @param {() => void} [options.onOpen]
 * @param {() => void} [options.onClose]
 */
export function useDisclosure(options = {}) {
  const { defaultOpen = false, onOpen, onClose } = options;
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) onOpen?.();
      else onClose?.();
      return next;
    });
  }, [onOpen, onClose]);

  return {
    isOpen,
    open,
    close,
    toggle,
    getTriggerProps: (props = {}) => ({
      ...props,
      'aria-expanded': isOpen,
      onClick: (e) => {
        props.onClick?.(e);
        if (!e.defaultPrevented) toggle();
      },
    }),
    getDialogProps: (props = {}) => ({
      ...props,
      role: 'dialog',
      'aria-modal': 'true',
      style: {
        ...(props.style || {}),
        display: isOpen ? 'block' : 'none',
      },
    }),
  };
}

/**
 * Headless combobox / autocomplete hook
 * @param {Object} options
 * @param {Array<{ id?: string, label: string, value: any }>} [options.items=[]]
 * @param {string} [options.defaultValue='']
 * @param {(value: any) => void} [options.onChange]
 */
export function useCombobox(options = {}) {
  const { items = [], defaultValue = '', onChange } = options;
  const [query, setQuery] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedValue, setSelectedValue] = useState(null);

  const filteredItems = items.filter((item) => {
    if (!query) return true;
    return item.label.toLowerCase().includes(query.toLowerCase());
  });

  const selectItem = useCallback(
    (item) => {
      setSelectedValue(item.value);
      setQuery(item.label);
      setIsOpen(false);
      setActiveIndex(-1);
      onChange?.(item.value);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!filteredItems.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setActiveIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIsOpen(true);
        setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        if (isOpen && activeIndex >= 0 && activeIndex < filteredItems.length) {
          e.preventDefault();
          selectItem(filteredItems[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    },
    [filteredItems, isOpen, activeIndex, selectItem]
  );

  return {
    query,
    setQuery,
    isOpen,
    setIsOpen,
    activeIndex,
    selectedValue,
    filteredItems,
    selectItem,
    getInputProps: (props = {}) => ({
      ...props,
      role: 'combobox',
      'aria-expanded': isOpen,
      'aria-autocomplete': 'list',
      'aria-activedescendant':
        activeIndex >= 0 && filteredItems[activeIndex]
          ? `boodoo-opt-${filteredItems[activeIndex].id || activeIndex}`
          : undefined,
      value: query,
      onChange: (e) => {
        setQuery(e.target.value);
        setIsOpen(true);
        setActiveIndex(-1);
        props.onChange?.(e);
      },
      onFocus: (e) => {
        setIsOpen(true);
        props.onFocus?.(e);
      },
      onKeyDown: (e) => {
        handleKeyDown(e);
        props.onKeyDown?.(e);
      },
    }),
    getListboxProps: (props = {}) => ({
      ...props,
      role: 'listbox',
      style: {
        ...(props.style || {}),
        display: isOpen ? 'block' : 'none',
      },
    }),
    getOptionProps: (item, index, props = {}) => ({
      ...props,
      id: `boodoo-opt-${item.id || index}`,
      role: 'option',
      'aria-selected': selectedValue === item.value,
      className: `${props.className || ''} ${index === activeIndex ? 'active' : ''}`.trim(),
      onClick: (e) => {
        selectItem(item);
        props.onClick?.(e);
      },
    }),
  };
}

/**
 * Headless accordion / collapsible group hook
 * @param {Object} [options]
 * @param {boolean} [options.allowMultiple=false]
 * @param {string[]} [options.defaultExpanded=[]]
 */
export function useAccordion(options = {}) {
  const { allowMultiple = false, defaultExpanded = [] } = options;
  const [expandedKeys, setExpandedKeys] = useState(new Set(defaultExpanded));

  const toggle = useCallback(
    (key) => {
      setExpandedKeys((prev) => {
        const next = new Set(allowMultiple ? prev : []);
        if (prev.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }
        return next;
      });
    },
    [allowMultiple]
  );

  const isExpanded = useCallback((key) => expandedKeys.has(key), [expandedKeys]);

  return {
    expandedKeys: Array.from(expandedKeys),
    toggle,
    isExpanded,
    getButtonProps: (key, props = {}) => ({
      ...props,
      'aria-expanded': expandedKeys.has(key),
      onClick: (e) => {
        props.onClick?.(e);
        toggle(key);
      },
    }),
    getPanelProps: (key, props = {}) => ({
      ...props,
      role: 'region',
      style: {
        ...(props.style || {}),
        display: expandedKeys.has(key) ? 'block' : 'none',
      },
    }),
  };
}
