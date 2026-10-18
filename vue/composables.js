// =====================================================================
// BOODOO — Headless Vue 3 / Nuxt Composables
// Declarative state management composables for Modals, Dropdowns, Tooltips,
// Accordions, and Comboboxes in Vue 3, Nuxt, and Vite apps.
// =====================================================================

import { ref, computed } from 'vue';

/**
 * Headless disclosure composable (Modal, Drawer, Dialog, Offcanvas)
 * @param {Object} [options]
 * @param {boolean} [options.defaultOpen=false]
 * @param {() => void} [options.onOpen]
 * @param {() => void} [options.onClose]
 */
export function useDisclosure(options = {}) {
  const { defaultOpen = false, onOpen, onClose } = options;
  const isOpen = ref(Boolean(defaultOpen));

  const open = () => {
    isOpen.value = true;
    onOpen?.();
  };

  const close = () => {
    isOpen.value = false;
    onClose?.();
  };

  const toggle = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) onOpen?.();
    else onClose?.();
  };

  const getTriggerProps = (props = {}) => ({
    ...props,
    'aria-expanded': isOpen.value,
    onClick: (e) => {
      props.onClick?.(e);
      if (!e?.defaultPrevented) toggle();
    },
  });

  const getDialogProps = (props = {}) => ({
    ...props,
    role: 'dialog',
    'aria-modal': 'true',
    style: {
      ...(props.style || {}),
      display: isOpen.value ? 'block' : 'none',
    },
  });

  return {
    isOpen,
    open,
    close,
    toggle,
    getTriggerProps,
    getDialogProps,
  };
}

/**
 * Headless combobox / autocomplete composable
 * @param {Object} [options]
 * @param {Array<{ id?: string, label: string, value: any }>} [options.items=[]]
 * @param {string} [options.defaultValue='']
 * @param {(value: any) => void} [options.onChange]
 */
export function useCombobox(options = {}) {
  const { items = [], defaultValue = '', onChange } = options;
  const query = ref(defaultValue);
  const isOpen = ref(false);
  const activeIndex = ref(-1);
  const selectedValue = ref(null);

  const filteredItems = computed(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  });

  const selectItem = (item) => {
    selectedValue.value = item.value;
    query.value = item.label;
    isOpen.value = false;
    activeIndex.value = -1;
    onChange?.(item.value);
  };

  const handleKeyDown = (e) => {
    const list = filteredItems.value;
    if (!list.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      isOpen.value = true;
      activeIndex.value = (activeIndex.value + 1) % list.length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      isOpen.value = true;
      activeIndex.value = (activeIndex.value - 1 + list.length) % list.length;
    } else if (e.key === 'Enter') {
      if (isOpen.value && activeIndex.value >= 0 && activeIndex.value < list.length) {
        e.preventDefault();
        selectItem(list[activeIndex.value]);
      }
    } else if (e.key === 'Escape') {
      isOpen.value = false;
      activeIndex.value = -1;
    }
  };

  const getInputProps = (props = {}) => ({
    ...props,
    role: 'combobox',
    'aria-expanded': isOpen.value,
    'aria-autocomplete': 'list',
    'aria-activedescendant':
      activeIndex.value >= 0 && filteredItems.value[activeIndex.value]
        ? `boodoo-opt-${filteredItems.value[activeIndex.value].id || activeIndex.value}`
        : undefined,
    value: query.value,
    onInput: (e) => {
      query.value = e.target.value;
      isOpen.value = true;
      activeIndex.value = -1;
      props.onInput?.(e);
    },
    onFocus: (e) => {
      isOpen.value = true;
      props.onFocus?.(e);
    },
    onKeydown: (e) => {
      handleKeyDown(e);
      props.onKeydown?.(e);
    },
  });

  const getListboxProps = (props = {}) => ({
    ...props,
    role: 'listbox',
    style: {
      ...(props.style || {}),
      display: isOpen.value ? 'block' : 'none',
    },
  });

  const getOptionProps = (item, index, props = {}) => ({
    ...props,
    id: `boodoo-opt-${item.id || index}`,
    role: 'option',
    'aria-selected': selectedValue.value === item.value,
    class: `${props.class || props.className || ''} ${index === activeIndex.value ? 'active' : ''}`.trim(),
    onClick: (e) => {
      selectItem(item);
      props.onClick?.(e);
    },
  });

  return {
    query,
    isOpen,
    activeIndex,
    selectedValue,
    filteredItems,
    selectItem,
    getInputProps,
    getListboxProps,
    getOptionProps,
  };
}

/**
 * Headless accordion / collapsible group composable
 * @param {Object} [options]
 * @param {boolean} [options.allowMultiple=false]
 * @param {string[]} [options.defaultExpanded=[]]
 */
export function useAccordion(options = {}) {
  const { allowMultiple = false, defaultExpanded = [] } = options;
  const expandedKeys = ref(new Set(defaultExpanded));

  const toggle = (key) => {
    const next = new Set(allowMultiple ? expandedKeys.value : []);
    if (expandedKeys.value.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    expandedKeys.value = next;
  };

  const isExpanded = (key) => expandedKeys.value.has(key);

  const getButtonProps = (key, props = {}) => ({
    ...props,
    'aria-expanded': isExpanded(key),
    onClick: (e) => {
      props.onClick?.(e);
      toggle(key);
    },
  });

  const getPanelProps = (key, props = {}) => ({
    ...props,
    role: 'region',
    style: {
      ...(props.style || {}),
      display: isExpanded(key) ? 'block' : 'none',
    },
  });

  const expandedList = computed(() => Array.from(expandedKeys.value));

  return {
    expandedKeys: expandedList,
    toggle,
    isExpanded,
    getButtonProps,
    getPanelProps,
  };
}
