// =====================================================================
// BOODOO — Headless React Hooks
// Declarative state management hooks for Modals, Dropdowns, Tooltips,
// Accordions, and Comboboxes in Next.js, Remix, Vite, and React apps.
// =====================================================================

import { useState, useCallback, useMemo, useEffect } from 'react';

/**
 * Normalizes text for accent-insensitive search
 * @param {string} str
 * @returns {string}
 */
export function foldAccents(str) {
  if (typeof str !== 'string') return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[øØ]/g, 'o')
    .replace(/[æÆ]/g, 'ae')
    .toLowerCase();
}

/**
 * Splits text into matched and unmatched segments for search highlighting
 * @param {string} text
 * @param {string} query
 * @returns {Array<{ text: string, match: boolean }>}
 */
export function highlightMatches(text, query) {
  if (!text || typeof text !== 'string') return [];
  if (!query || typeof query !== 'string') return [{ text, match: false }];

  const foldedText = foldAccents(text);
  const foldedQuery = foldAccents(query.trim());
  if (!foldedQuery) return [{ text, match: false }];

  const segments = [];
  let lastIndex = 0;
  let idx = foldedText.indexOf(foldedQuery, lastIndex);

  while (idx !== -1) {
    if (idx > lastIndex) {
      segments.push({ text: text.slice(lastIndex, idx), match: false });
    }
    segments.push({ text: text.slice(idx, idx + foldedQuery.length), match: true });
    lastIndex = idx + foldedQuery.length;
    idx = foldedText.indexOf(foldedQuery, lastIndex);
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), match: false });
  }

  return segments;
}

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
    if (!isOpen) {
      setIsOpen(true);
      onOpen?.();
    }
  }, [isOpen, onOpen]);

  const close = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
      onClose?.();
    }
  }, [isOpen, onClose]);

  const toggle = useCallback(() => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) onOpen?.();
    else onClose?.();
  }, [isOpen, onOpen, onClose]);

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
 * Headless combobox / autocomplete hook with accent-folding and context meta support
 * @param {Object} options
 * @param {Array<{ id?: string, label: string, value: any, meta?: string }>} [options.items=[]]
 * @param {any} [options.value]
 * @param {any} [options.defaultValue]
 * @param {(value: any) => void} [options.onChange]
 * @param {(item: any) => string} [options.getOptionMeta]
 */
export function useCombobox(options = {}) {
  const {
    items = [],
    value: controlledValue,
    defaultValue = '',
    onChange,
    getOptionMeta,
  } = options;
  const isControlled = controlledValue !== undefined;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = isControlled ? controlledValue : internalValue;

  const currentItem = items.find((it) => it.value === selectedValue);
  const [query, setQuery] = useState(
    currentItem ? currentItem.label : typeof defaultValue === 'string' ? defaultValue : ''
  );
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Synchronize query when controlled value changes externally
  useEffect(() => {
    if (isControlled) {
      const match = items.find((it) => it.value === controlledValue);
      setQuery(match ? match.label : '');
    }
  }, [isControlled, controlledValue, items]);

  const filteredItems = useMemo(() => {
    if (!query) return items;
    const foldedQuery = foldAccents(query);
    return items.filter((item) => {
      const foldedLabel = foldAccents(item.label);
      const meta = getOptionMeta ? getOptionMeta(item) : item.meta || '';
      const foldedMeta = foldAccents(meta);
      return foldedLabel.includes(foldedQuery) || foldedMeta.includes(foldedQuery);
    });
  }, [items, query, getOptionMeta]);

  const selectItem = useCallback(
    (item) => {
      if (!isControlled) {
        setInternalValue(item.value);
      }
      setQuery(item.label);
      setIsOpen(false);
      setActiveIndex(-1);
      onChange?.(item.value);
    },
    [isControlled, onChange]
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
        props.onInputChange?.(e.target.value, e);
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
      'aria-expanded': isExpanded(key),
      onClick: (e) => {
        props.onClick?.(e);
        if (!e.defaultPrevented) toggle(key);
      },
    }),
    getPanelProps: (key, props = {}) => ({
      ...props,
      role: 'region',
      style: {
        ...(props.style || {}),
        display: isExpanded(key) ? 'block' : 'none',
      },
    }),
  };
}
