// =====================================================================
// BOODOO — Headless Vue 3 / Nuxt Composables
// Declarative state management composables for Modals, Dropdowns, Tooltips,
// Accordions, and Comboboxes in Vue 3, Nuxt, and Vite apps.
// =====================================================================

import { ref, computed, watch, isRef } from 'vue';

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
    if (!isOpen.value) {
      isOpen.value = true;
      onOpen?.();
    }
  };

  const close = () => {
    if (isOpen.value) {
      isOpen.value = false;
      onClose?.();
    }
  };

  const toggle = () => {
    if (isOpen.value) {
      isOpen.value = false;
      onClose?.();
    } else {
      isOpen.value = true;
      onOpen?.();
    }
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
 * Headless combobox / autocomplete composable with v-model support
 * @param {Object} [options]
 * @param {Array<{ id?: string, label: string, value: any, meta?: string }>} [options.items=[]]
 * @param {any} [options.modelValue]
 * @param {any} [options.value]
 * @param {string} [options.defaultValue='']
 * @param {(value: any) => void} [options.onChange]
 * @param {(value: any) => void} [options['onUpdate:modelValue']]
 * @param {(item: any) => string} [options.getOptionMeta]
 */
export function useCombobox(options = {}) {
  const {
    items = [],
    modelValue,
    value: controlledVal,
    defaultValue = '',
    onChange,
    getOptionMeta,
  } = options;
  const onUpdateModelValue = options['onUpdate:modelValue'] || options.onUpdateModelValue;

  const isControlled = modelValue !== undefined || controlledVal !== undefined;
  const getControlledVal = () =>
    modelValue !== undefined
      ? isRef(modelValue)
        ? modelValue.value
        : modelValue
      : isRef(controlledVal)
        ? controlledVal.value
        : controlledVal;

  const getItemsList = () => {
    const raw = isRef(items) ? items.value : items;
    return Array.isArray(raw) ? raw : [];
  };

  const internalValue = ref(isControlled ? getControlledVal() : null);
  const initialSelected = isControlled ? getControlledVal() : null;
  const initialItem = getItemsList().find((it) => it && it.value === initialSelected);

  const query = ref(initialItem ? initialItem.label : defaultValue);
  const isOpen = ref(false);
  const activeIndex = ref(-1);

  const selectedValue = computed({
    get: () => (isControlled ? getControlledVal() : internalValue.value),
    set: (val) => {
      if (!isControlled) {
        internalValue.value = val;
      }
      onUpdateModelValue?.(val);
      onChange?.(val);
    },
  });

  // Keep query in sync when controlled modelValue / value changes or asynchronous items arrive
  if (isControlled) {
    const getItems = () => (isRef(items) ? items.value : items);
    watch(
      [() => getControlledVal(), () => getItems()],
      ([newVal, currentItems]) => {
        const list = Array.isArray(currentItems) ? currentItems : [];
        const match = list.find((it) => it && it.value === newVal);
        if (match) {
          query.value = match.label;
        } else if (newVal === null || newVal === undefined || newVal === '') {
          query.value = '';
        }
      },
      { immediate: true, deep: true }
    );
  }

  const filteredItems = computed(() => {
    const list = getItemsList();
    const q = query.value.trim();
    if (!q) return list;
    const foldedQuery = foldAccents(q);
    return list.filter((item) => {
      if (!item) return false;
      const foldedLabel = foldAccents(item.label || '');
      const meta = getOptionMeta ? getOptionMeta(item) : item.meta || '';
      const foldedMeta = foldAccents(meta);
      return foldedLabel.includes(foldedQuery) || foldedMeta.includes(foldedQuery);
    });
  });

  const selectItem = (item) => {
    selectedValue.value = item.value;
    query.value = item.label;
    isOpen.value = false;
    activeIndex.value = -1;
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
    class:
      `${props.class || props.className || ''} ${index === activeIndex.value ? 'active' : ''}`.trim(),
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

/**
 * Headless direction and RTL composable for Vue 3
 * @param {'ltr' | 'rtl' | 'auto'} [initial='ltr']
 */
export function useDirection(initial = 'ltr') {
  const direction = ref(
    typeof document !== 'undefined'
      ? document.documentElement.getAttribute('dir') || initial
      : initial
  );

  const isRtl = computed(() => direction.value === 'rtl');

  const setDirection = (val) => {
    direction.value = val;
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', val);
      if (document.body) document.body.setAttribute('dir', val);
    }
  };

  const toggleDirection = () => {
    setDirection(isRtl.value ? 'ltr' : 'rtl');
  };

  return {
    direction,
    isRtl,
    setDirection,
    toggleDirection,
  };
}
