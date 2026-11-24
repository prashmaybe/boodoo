// =====================================================================
// BOODOO Vue 3 — Core SFC-style Components Suite
// Button, Alert, Card, Badge, Modal, Input, Combobox, Accordion,
// Offcanvas, Dropdown, Tabs, Toast, Spinner, Progress, Breadcrumb,
// Avatar, Kbd, Tooltip, VirtualList, and Markdown.
// Follows strict A11y & Semantics (wrapped text, id/name form inputs).
// =====================================================================

import { h, ref, computed, watch, toRef } from 'vue';
import { useCombobox } from './composables.js';
import { Markdown as VanillaMarkdown } from '../js/src/markdown.js';

let inputCounter = 0;

export function createBoodooVue() {
  return {
    install(app) {
      app.component('BoodooButton', BoodooButton);
      app.component('BoodooAlert', BoodooAlert);
      app.component('BoodooCard', BoodooCard);
      app.component('BoodooBadge', BoodooBadge);
      app.component('BoodooModal', BoodooModal);
      app.component('BoodooInput', BoodooInput);
      app.component('BoodooCombobox', BoodooCombobox);
      app.component('BoodooAccordion', BoodooAccordion);
      app.component('BoodooAccordionItem', BoodooAccordionItem);
      app.component('BoodooOffcanvas', BoodooOffcanvas);
      app.component('BoodooDropdown', BoodooDropdown);
      app.component('BoodooTabs', BoodooTabs);
      app.component('BoodooToast', BoodooToast);
      app.component('BoodooSpinner', BoodooSpinner);
      app.component('BoodooProgress', BoodooProgress);
      app.component('BoodooBreadcrumb', BoodooBreadcrumb);
      app.component('BoodooAvatar', BoodooAvatar);
      app.component('BoodooKbd', BoodooKbd);
      app.component('BoodooVirtualList', BoodooVirtualList);
      app.component('BoodooMarkdown', BoodooMarkdown);
    },
  };
}

export const BoodooButton = {
  name: 'BoodooButton',
  props: {
    variant: { type: String, default: 'primary' },
    size: { type: String, default: '' },
    outline: { type: Boolean, default: false },
    soft: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    type: { type: String, default: 'button' },
  },
  emits: ['click'],
  setup(props, { slots, emit, attrs }) {
    return () => {
      let prefix = 'btn-';
      if (props.outline) prefix = 'btn-outline-';
      else if (props.soft) prefix = 'btn-soft-';

      const variantClass = props.variant ? `${prefix}${props.variant}` : '';
      const sizeClass = props.size ? `btn-${props.size}` : '';
      const loadingClass = props.loading ? 'btn-loading' : '';
      const { class: customClass, ...restAttrs } = attrs;

      return h(
        'button',
        {
          type: props.type,
          disabled: props.disabled || props.loading,
          onClick: (e) => emit('click', e),
          ...restAttrs,
          class: ['btn', variantClass, sizeClass, loadingClass, customClass]
            .filter(Boolean)
            .join(' '),
        },
        [
          props.loading
            ? h('span', {
                class: 'spinner-border spinner-border-sm me-2',
                role: 'status',
                'aria-hidden': 'true',
              })
            : null,
          slots.default ? slots.default() : null,
        ]
      );
    };
  },
};

export const BoodooAlert = {
  name: 'BoodooAlert',
  props: {
    variant: { type: String, default: 'info' },
    dismissible: { type: Boolean, default: false },
    title: { type: String, default: '' },
    icon: { type: String, default: '' },
    closeLabel: { type: String, default: 'Close alert' },
  },
  emits: ['dismiss'],
  setup(props, { slots, emit, attrs }) {
    const isVisible = ref(true);

    const dismiss = () => {
      isVisible.value = false;
      emit('dismiss');
    };

    return () => {
      if (!isVisible.value) return null;
      const { class: customClass, ...restAttrs } = attrs;

      return h(
        'div',
        {
          role: 'alert',
          ...restAttrs,
          class: [
            'alert',
            `alert-${props.variant}`,
            props.dismissible ? 'alert-dismissible' : '',
            'fade',
            'show',
            customClass,
          ]
            .filter(Boolean)
            .join(' '),
        },
        [
          h('div', { class: 'd-flex align-items-start gap-2' }, [
            props.icon ? h('span', { class: 'alert-icon' }, props.icon) : null,
            h('div', { class: 'alert-content flex-grow-1' }, [
              props.title ? h('h6', { class: 'alert-heading mb-1 fw-bold' }, props.title) : null,
              slots.default ? slots.default() : null,
            ]),
            props.dismissible
              ? h('button', {
                  type: 'button',
                  class: 'btn-close',
                  'aria-label': props.closeLabel,
                  onClick: dismiss,
                })
              : null,
          ]),
        ]
      );
    };
  },
};

export const BoodooCard = {
  name: 'BoodooCard',
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
  },
  setup(props, { slots, attrs }) {
    return () => {
      const { class: customClass, ...restAttrs } = attrs;
      return h(
        'div',
        {
          ...restAttrs,
          class: ['card', customClass].filter(Boolean).join(' '),
        },
        [
          slots.header ? h('div', { class: 'card-header' }, slots.header()) : null,
          h('div', { class: 'card-body' }, [
            props.title ? h('h5', { class: 'card-title' }, props.title) : null,
            props.subtitle
              ? h('h6', { class: 'card-subtitle mb-2 text-muted' }, props.subtitle)
              : null,
            slots.default ? slots.default() : null,
          ]),
          slots.footer ? h('div', { class: 'card-footer' }, slots.footer()) : null,
        ]
      );
    };
  },
};

export const BoodooBadge = {
  name: 'BoodooBadge',
  props: {
    variant: { type: String, default: 'primary' },
    pill: { type: Boolean, default: false },
    soft: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    return () => {
      let prefix = 'badge-';
      if (props.soft) prefix = 'badge-soft-';
      const variantClass = props.variant ? `${prefix}${props.variant}` : '';
      const pillClass = props.pill ? 'badge-pill' : '';
      const { class: customClass, ...restAttrs } = attrs;

      return h(
        'span',
        {
          ...restAttrs,
          class: ['badge', variantClass, pillClass, customClass].filter(Boolean).join(' '),
        },
        slots.default ? slots.default() : null
      );
    };
  },
};

export const BoodooInput = {
  name: 'BoodooInput',
  props: {
    modelValue: { type: [String, Number], default: '' },
    type: { type: String, default: 'text' },
    id: { type: String, default: '' },
    name: { type: String, default: '' },
    size: { type: String, default: '' },
  },
  emits: ['update:modelValue', 'input'],
  setup(props, { emit, attrs }) {
    inputCounter++;
    const defaultId = `bo-input-${inputCounter}`;
    const effectiveId = computed(() => props.id || props.name || defaultId);
    const effectiveName = computed(() => props.name || effectiveId.value);

    return () => {
      const sizeClass = props.size ? `form-control-${props.size}` : '';
      const { class: customClass, ...restAttrs } = attrs;

      return h('input', {
        id: effectiveId.value,
        name: effectiveName.value,
        type: props.type,
        value: props.modelValue,
        class: ['form-control', sizeClass, customClass].filter(Boolean).join(' '),
        onInput: (e) => {
          emit('update:modelValue', e.target.value);
          emit('input', e);
        },
        ...restAttrs,
      });
    };
  },
};

export const BoodooModal = {
  name: 'BoodooModal',
  props: {
    modelValue: { type: Boolean, default: false },
    title: { type: String, default: '' },
    closeLabel: { type: String, default: 'Close' },
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { slots, emit, attrs }) {
    const close = () => {
      emit('update:modelValue', false);
      emit('close');
    };

    return () => {
      if (!props.modelValue) return null;
      const { class: customClass, ...restAttrs } = attrs;

      return h(
        'div',
        {
          class: 'modal fade show d-block',
          tabindex: '-1',
          role: 'dialog',
          'aria-modal': 'true',
          onClick: (e) => {
            if (e.target === e.currentTarget) close();
          },
        },
        [
          h(
            'div',
            {
              ...restAttrs,
              class: ['modal-dialog', customClass].filter(Boolean).join(' '),
            },
            [
              h('div', { class: 'modal-content' }, [
                h('div', { class: 'modal-header' }, [
                  props.title ? h('h5', { class: 'modal-title' }, props.title) : null,
                  h('button', {
                    type: 'button',
                    class: 'btn-close',
                    'aria-label': props.closeLabel,
                    onClick: close,
                  }),
                ]),
                h('div', { class: 'modal-body' }, slots.default ? slots.default() : null),
                slots.footer ? h('div', { class: 'modal-footer' }, slots.footer()) : null,
              ]),
            ]
          ),
          h('div', { class: 'modal-backdrop fade show' }),
        ]
      );
    };
  },
};

export const BoodooCombobox = {
  name: 'BoodooCombobox',
  props: {
    items: { type: Array, default: () => [] },
    modelValue: { type: [String, Number, Object], default: '' },
    placeholder: { type: String, default: 'Search...' },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, attrs }) {
    const itemsRef = toRef(props, 'items');
    const modelValueRef = toRef(props, 'modelValue');

    const cb = useCombobox({
      items: itemsRef,
      modelValue: modelValueRef,
      onChange: (val) => {
        emit('update:modelValue', val);
        emit('change', val);
      },
    });

    return () => {
      const { class: customClass, ...restAttrs } = attrs;
      return h(
        'div',
        {
          class: ['combobox-wrapper position-relative', customClass].filter(Boolean).join(' '),
          ...restAttrs,
        },
        [
          h('input', {
            ...cb.getInputProps({
              placeholder: props.placeholder,
              class: 'form-control',
            }),
          }),
          cb.isOpen.value
            ? h(
                'ul',
                {
                  ...cb.getListboxProps({
                    class: 'dropdown-menu show w-100 position-absolute',
                    style: { maxHeight: '200px', overflowY: 'auto' },
                  }),
                },
                cb.filteredItems.value.map((item, idx) =>
                  h(
                    'li',
                    {
                      ...cb.getOptionProps(item, idx, {
                        class: ['dropdown-item', cb.activeIndex.value === idx ? 'active' : '']
                          .filter(Boolean)
                          .join(' '),
                      }),
                    },
                    h('span', null, item.label || item)
                  )
                )
              )
            : null,
        ]
      );
    };
  },
};

export const BoodooAccordion = {
  name: 'BoodooAccordion',
  props: {
    flush: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    return () => {
      const { class: customClass, ...restAttrs } = attrs;
      return h(
        'div',
        {
          ...restAttrs,
          class: ['accordion', props.flush ? 'accordion-flush' : '', customClass]
            .filter(Boolean)
            .join(' '),
        },
        slots.default ? slots.default() : null
      );
    };
  },
};

export const BoodooAccordionItem = {
  name: 'BoodooAccordionItem',
  props: {
    title: { type: String, default: '' },
    defaultOpen: { type: Boolean, default: false },
  },
  setup(props, { slots, attrs }) {
    const isOpen = ref(props.defaultOpen);

    const toggle = () => {
      isOpen.value = !isOpen.value;
    };

    return () => {
      const { class: customClass, ...restAttrs } = attrs;
      return h(
        'div',
        {
          ...restAttrs,
          class: ['accordion-item', customClass].filter(Boolean).join(' '),
        },
        [
          h('h2', { class: 'accordion-header' }, [
            h(
              'button',
              {
                type: 'button',
                class: ['accordion-button', !isOpen.value ? 'collapsed' : '']
                  .filter(Boolean)
                  .join(' '),
                'aria-expanded': isOpen.value ? 'true' : 'false',
                onClick: toggle,
              },
              h('span', null, props.title)
            ),
          ]),
          isOpen.value
            ? h('div', { class: 'accordion-collapse collapse show' }, [
                h('div', { class: 'accordion-body' }, slots.default ? slots.default() : null),
              ])
            : null,
        ]
      );
    };
  },
};

export const BoodooOffcanvas = {
  name: 'BoodooOffcanvas',
  props: {
    modelValue: { type: Boolean, default: false },
    placement: { type: String, default: 'start' },
    title: { type: String, default: '' },
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { slots, emit, attrs }) {
    const close = () => {
      emit('update:modelValue', false);
      emit('close');
    };

    return () => {
      if (!props.modelValue) return null;
      const { class: customClass, ...restAttrs } = attrs;

      return h(
        'div',
        {
          tabindex: '-1',
          role: 'dialog',
          ...restAttrs,
          class: ['offcanvas', `offcanvas-${props.placement}`, 'show', customClass]
            .filter(Boolean)
            .join(' '),
        },
        [
          h('div', { class: 'offcanvas-header' }, [
            props.title ? h('h5', { class: 'offcanvas-title' }, props.title) : null,
            h('button', {
              type: 'button',
              class: 'btn-close',
              'aria-label': 'Close',
              onClick: close,
            }),
          ]),
          h('div', { class: 'offcanvas-body' }, slots.default ? slots.default() : null),
        ]
      );
    };
  },
};

export const BoodooDropdown = {
  name: 'BoodooDropdown',
  props: {
    label: { type: String, default: 'Dropdown' },
    variant: { type: String, default: 'primary' },
  },
  setup(props, { slots, attrs }) {
    const isOpen = ref(false);
    const toggle = () => {
      isOpen.value = !isOpen.value;
    };

    return () => {
      const { class: customClass, ...restAttrs } = attrs;
      return h(
        'div',
        {
          ...restAttrs,
          class: ['dropdown d-inline-block', customClass].filter(Boolean).join(' '),
        },
        [
          h(
            'button',
            {
              type: 'button',
              class: `btn btn-${props.variant} dropdown-toggle`,
              'aria-expanded': isOpen.value ? 'true' : 'false',
              onClick: toggle,
            },
            h('span', null, props.label)
          ),
          isOpen.value
            ? h(
                'ul',
                { class: 'dropdown-menu show', onClick: () => (isOpen.value = false) },
                slots.default ? slots.default() : null
              )
            : null,
        ]
      );
    };
  },
};

export const BoodooTabs = {
  name: 'BoodooTabs',
  props: {
    tabs: { type: Array, default: () => [] },
    modelValue: { type: [String, Number], default: 0 },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { slots, emit, attrs }) {
    const activeIndex = ref(props.modelValue);

    watch(
      () => props.modelValue,
      (newVal) => {
        if (newVal !== undefined && newVal !== activeIndex.value) {
          activeIndex.value = newVal;
        }
      }
    );

    const selectTab = (idx) => {
      activeIndex.value = idx;
      emit('update:modelValue', idx);
      emit('change', idx);
    };

    return () => {
      const { class: customClass, ...restAttrs } = attrs;
      return h(
        'div',
        {
          class: ['boodoo-tabs', customClass].filter(Boolean).join(' '),
          ...restAttrs,
        },
        [
          h(
            'ul',
            { class: 'nav nav-tabs', role: 'tablist' },
            props.tabs.map((tab, idx) =>
              h('li', { class: 'nav-item', role: 'presentation' }, [
                h(
                  'button',
                  {
                    type: 'button',
                    class: ['nav-link', activeIndex.value === idx ? 'active' : '']
                      .filter(Boolean)
                      .join(' '),
                    role: 'tab',
                    'aria-selected': activeIndex.value === idx ? 'true' : 'false',
                    onClick: () => selectTab(idx),
                  },
                  h('span', null, typeof tab === 'string' ? tab : tab.label)
                ),
              ])
            )
          ),
          h(
            'div',
            { class: 'tab-content p-3' },
            slots.default ? slots.default({ activeIndex: activeIndex.value }) : null
          ),
        ]
      );
    };
  },
};

export const BoodooToast = {
  name: 'BoodooToast',
  props: {
    modelValue: { type: Boolean, default: true },
    title: { type: String, default: '' },
    variant: { type: String, default: 'default' },
  },
  emits: ['update:modelValue', 'close'],
  setup(props, { slots, emit, attrs }) {
    const close = () => {
      emit('update:modelValue', false);
      emit('close');
    };

    return () => {
      if (!props.modelValue) return null;

      const variantClass =
        props.variant && props.variant !== 'default' ? `text-bg-${props.variant}` : '';
      const { class: customClass, ...restAttrs } = attrs;

      return h(
        'div',
        {
          role: 'alert',
          'aria-live': 'assertive',
          'aria-atomic': 'true',
          ...restAttrs,
          class: ['toast show align-items-center', variantClass, customClass]
            .filter(Boolean)
            .join(' '),
        },
        [
          props.title
            ? h('div', { class: 'toast-header' }, [
                h('strong', { class: 'me-auto' }, props.title),
                h('button', {
                  type: 'button',
                  class: 'btn-close',
                  'aria-label': 'Close',
                  onClick: close,
                }),
              ])
            : null,
          h('div', { class: 'd-flex' }, [
            h('div', { class: 'toast-body flex-grow-1' }, slots.default ? slots.default() : null),
            !props.title
              ? h('button', {
                  type: 'button',
                  class: 'btn-close me-2 m-auto',
                  'aria-label': 'Close',
                  onClick: close,
                })
              : null,
          ]),
        ]
      );
    };
  },
};

export const BoodooSpinner = {
  name: 'BoodooSpinner',
  props: {
    variant: { type: String, default: 'primary' },
    size: { type: String, default: '' },
    grow: { type: Boolean, default: false },
  },
  setup(props, { attrs }) {
    return () => {
      const type = props.grow ? 'spinner-grow' : 'spinner-border';
      const sizeClass = props.size ? `${type}-${props.size}` : '';
      const colorClass = props.variant ? `text-${props.variant}` : '';
      const { class: customClass, ...restAttrs } = attrs;

      return h(
        'div',
        {
          role: 'status',
          ...restAttrs,
          class: [type, sizeClass, colorClass, customClass].filter(Boolean).join(' '),
        },
        h('span', { class: 'visually-hidden' }, 'Loading...')
      );
    };
  },
};

export const BoodooProgress = {
  name: 'BoodooProgress',
  props: {
    value: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    variant: { type: String, default: 'primary' },
    striped: { type: Boolean, default: false },
    animated: { type: Boolean, default: false },
  },
  setup(props, { attrs }) {
    return () => {
      const percent = Math.min(100, Math.max(0, (props.value / props.max) * 100));
      const bgClass = props.variant ? `bg-${props.variant}` : '';
      const stripedClass = props.striped ? 'progress-bar-striped' : '';
      const animClass = props.animated ? 'progress-bar-animated' : '';
      const { class: customClass, ...restAttrs } = attrs;

      return h(
        'div',
        {
          ...restAttrs,
          class: ['progress', customClass].filter(Boolean).join(' '),
        },
        [
          h('div', {
            class: ['progress-bar', bgClass, stripedClass, animClass].filter(Boolean).join(' '),
            role: 'progressbar',
            style: { width: `${percent}%` },
            'aria-valuenow': props.value,
            'aria-valuemin': 0,
            'aria-valuemax': props.max,
          }),
        ]
      );
    };
  },
};

export const BoodooBreadcrumb = {
  name: 'BoodooBreadcrumb',
  props: {
    items: { type: Array, default: () => [] },
  },
  setup(props, { attrs }) {
    return () => {
      const { class: customClass, ...restAttrs } = attrs;
      return h(
        'nav',
        {
          'aria-label': 'breadcrumb',
          ...restAttrs,
          class: customClass,
        },
        [
          h(
            'ol',
            { class: 'breadcrumb' },
            props.items.map((item, idx) => {
              const isLast = idx === props.items.length - 1;
              return h(
                'li',
                {
                  class: ['breadcrumb-item', isLast ? 'active' : ''].filter(Boolean).join(' '),
                  'aria-current': isLast ? 'page' : undefined,
                },
                isLast || !item.href
                  ? h('span', null, item.label || item)
                  : h('a', { href: item.href }, h('span', null, item.label || item))
              );
            })
          ),
        ]
      );
    };
  },
};

export const BoodooAvatar = {
  name: 'BoodooAvatar',
  props: {
    src: { type: String, default: '' },
    alt: { type: String, default: 'Avatar' },
    size: { type: String, default: 'md' },
    initials: { type: String, default: '' },
  },
  setup(props, { attrs }) {
    return () => {
      const sizeClass = props.size ? `avatar-${props.size}` : '';
      const { class: customClass, ...restAttrs } = attrs;

      return h(
        'div',
        {
          ...restAttrs,
          class: ['avatar', sizeClass, customClass].filter(Boolean).join(' '),
        },
        props.src
          ? h('img', { src: props.src, alt: props.alt, class: 'avatar-img' })
          : h('span', { class: 'avatar-initials' }, props.initials)
      );
    };
  },
};

export const BoodooKbd = {
  name: 'BoodooKbd',
  setup(_, { slots, attrs }) {
    return () => {
      const { class: customClass, ...restAttrs } = attrs;
      return h(
        'kbd',
        {
          ...restAttrs,
          class: ['kbd', customClass].filter(Boolean).join(' '),
        },
        slots.default ? slots.default() : null
      );
    };
  },
};

export const BoodooVirtualList = {
  name: 'BoodooVirtualList',
  props: {
    items: { type: Array, default: () => [] },
    itemHeight: { type: Number, default: 48 },
    height: { type: String, default: '320px' },
  },
  setup(props, { slots, attrs }) {
    const scrollTop = ref(0);

    const onScroll = (e) => {
      scrollTop.value = e.target.scrollTop;
    };

    return () => {
      const totalHeight = props.items.length * props.itemHeight;
      const startIndex = Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - 2);
      const endIndex = Math.min(props.items.length, startIndex + 15);
      const visibleItems = props.items.slice(startIndex, endIndex);
      const offsetY = startIndex * props.itemHeight;
      const { class: customClass, style: customStyle, ...restAttrs } = attrs;

      return h(
        'div',
        {
          style: [{ height: props.height }, customStyle],
          onScroll,
          ...restAttrs,
          class: ['boodoo-virtual-list position-relative overflow-auto', customClass]
            .filter(Boolean)
            .join(' '),
        },
        [
          h(
            'div',
            {
              class: 'virtual-list-spacer position-relative w-100',
              style: { height: `${totalHeight}px` },
            },
            [
              h(
                'div',
                {
                  class: 'virtual-list-content position-absolute top-0 start-0 end-0',
                  style: { transform: `translateY(${offsetY}px)` },
                },
                visibleItems.map((item, idx) =>
                  slots.default
                    ? slots.default({ item, index: startIndex + idx })
                    : h('div', { class: 'p-2 border-bottom' }, h('span', null, String(item)))
                )
              ),
            ]
          ),
        ]
      );
    };
  },
};

export const BoodooMarkdown = {
  name: 'BoodooMarkdown',
  props: {
    content: { type: String, default: '' },
  },
  setup(props, { attrs }) {
    return () => {
      const html = VanillaMarkdown.render(props.content);
      const { class: customClass, ...restAttrs } = attrs;
      return h('div', {
        innerHTML: html,
        ...restAttrs,
        class: ['boodoo-markdown', customClass].filter(Boolean).join(' '),
      });
    };
  },
};
