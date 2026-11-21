// =====================================================================
// BOODOO Vue 3 — Core SFC-style Components Suite
// Button, Alert, Card, Badge, Modal, Input, and Combobox
// Follows strict A11y & Semantics (wrapped text, id/name form inputs).
// =====================================================================

import { h, ref, computed, watch, useId } from 'vue';
import { useDisclosure, useCombobox } from './composables.js';

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

      return h(
        'button',
        {
          type: props.type,
          disabled: props.disabled || props.loading,
          class: ['btn', variantClass, sizeClass, loadingClass, attrs.class].filter(Boolean).join(' '),
          onClick: (e) => emit('click', e),
          ...attrs,
        },
        [
          props.loading
            ? h('span', { class: 'spinner-border spinner-border-sm me-2', role: 'status', 'aria-hidden': 'true' })
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

      return h(
        'div',
        {
          role: 'alert',
          class: [
            'alert',
            `alert-${props.variant}`,
            props.dismissible ? 'alert-dismissible' : '',
            'fade',
            'show',
            attrs.class,
          ]
            .filter(Boolean)
            .join(' '),
          ...attrs,
        },
        [
          h(
            'div',
            { class: 'd-flex align-items-start gap-2' },
            [
              props.icon ? h('span', { class: 'alert-icon' }, props.icon) : null,
              h(
                'div',
                { class: 'alert-content flex-grow-1' },
                [
                  props.title ? h('h6', { class: 'alert-heading mb-1 fw-bold' }, props.title) : null,
                  slots.default ? slots.default() : null,
                ]
              ),
              props.dismissible
                ? h('button', {
                    type: 'button',
                    class: 'btn-close',
                    'aria-label': props.closeLabel,
                    onClick: dismiss,
                  })
                : null,
            ]
          ),
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
      return h(
        'div',
        { class: ['card', attrs.class].filter(Boolean).join(' '), ...attrs },
        [
          slots.header ? h('div', { class: 'card-header' }, slots.header()) : null,
          h(
            'div',
            { class: 'card-body' },
            [
              props.title ? h('h5', { class: 'card-title' }, props.title) : null,
              props.subtitle ? h('h6', { class: 'card-subtitle mb-2 text-muted' }, props.subtitle) : null,
              slots.default ? slots.default() : null,
            ]
          ),
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

      return h(
        'span',
        { class: ['badge', variantClass, pillClass, attrs.class].filter(Boolean).join(' '), ...attrs },
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
    const defaultId = `bo-input-${Math.random().toString(36).slice(2, 9)}`;
    const effectiveId = computed(() => props.id || props.name || defaultId);
    const effectiveName = computed(() => props.name || effectiveId.value);

    return () => {
      const sizeClass = props.size ? `form-control-${props.size}` : '';

      return h('input', {
        id: effectiveId.value,
        name: effectiveName.value,
        type: props.type,
        value: props.modelValue,
        class: ['form-control', sizeClass, attrs.class].filter(Boolean).join(' '),
        onInput: (e) => {
          emit('update:modelValue', e.target.value);
          emit('input', e);
        },
        ...attrs,
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
            { class: ['modal-dialog', attrs.class].filter(Boolean).join(' '), ...attrs },
            [
              h(
                'div',
                { class: 'modal-content' },
                [
                  h(
                    'div',
                    { class: 'modal-header' },
                    [
                      props.title ? h('h5', { class: 'modal-title' }, props.title) : null,
                      h('button', {
                        type: 'button',
                        class: 'btn-close',
                        'aria-label': props.closeLabel,
                        onClick: close,
                      }),
                    ]
                  ),
                  h('div', { class: 'modal-body' }, slots.default ? slots.default() : null),
                  slots.footer ? h('div', { class: 'modal-footer' }, slots.footer()) : null,
                ]
              ),
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
    const cb = useCombobox({
      items: props.items,
      modelValue: props.modelValue,
      onChange: (val) => {
        emit('update:modelValue', val);
        emit('change', val);
      },
    });

    return () => {
      return h(
        'div',
        { class: ['combobox-wrapper position-relative', attrs.class].filter(Boolean).join(' ') },
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
                        class: [
                          'dropdown-item',
                          cb.activeIndex.value === idx ? 'active' : '',
                        ].filter(Boolean).join(' '),
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
