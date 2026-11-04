// =====================================================================
// BOODOO React — Forms & Input Controls
// Pure React form components adhering strictly to form field element ID rules
// =====================================================================

import React, { useId, useState } from 'react';
import { useCombobox } from './hooks.js';

export function Input({ id: customId, name, type = 'text', size, className = '', ...props }) {
  const generatedId = useId();
  const id = customId || name || generatedId;
  const sizeClass = size ? `form-control-${size}` : '';

  return React.createElement('input', {
    id,
    name: name || id,
    type,
    className: ['form-control', sizeClass, className].filter(Boolean).join(' '),
    ...props,
  });
}

export const TextInput = Input;
export const TextField = Input;

export function Textarea({ id: customId, name, rows = 3, className = '', ...props }) {
  const generatedId = useId();
  const id = customId || name || generatedId;

  return React.createElement('textarea', {
    id,
    name: name || id,
    rows,
    className: ['form-control', className].filter(Boolean).join(' '),
    ...props,
  });
}

export const TextArea = Textarea;

export function Select({
  id: customId,
  name,
  options = [],
  size,
  className = '',
  children,
  ...props
}) {
  const generatedId = useId();
  const id = customId || name || generatedId;
  const sizeClass = size ? `form-select-${size}` : '';

  return React.createElement(
    'select',
    {
      id,
      name: name || id,
      className: ['form-select', sizeClass, className].filter(Boolean).join(' '),
      ...props,
    },
    options.length > 0
      ? options.map((opt) =>
          React.createElement(
            'option',
            { key: opt.value, value: opt.value, disabled: opt.disabled },
            opt.label
          )
        )
      : children
  );
}

export function Checkbox({
  id: customId,
  name,
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) {
  const generatedId = useId();
  const id = customId || name || generatedId;

  return React.createElement(
    'div',
    { className: ['form-check', className].filter(Boolean).join(' ') },
    React.createElement('input', {
      id,
      name: name || id,
      type: 'checkbox',
      checked,
      defaultChecked,
      disabled,
      onChange,
      className: 'form-check-input',
      ...props,
    }),
    label && React.createElement('label', { className: 'form-check-label', htmlFor: id }, label)
  );
}

export const CheckBox = Checkbox;

export function Radio({
  id: customId,
  name,
  value,
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) {
  const generatedId = useId();
  const id = customId || `${name}-${value}` || generatedId;

  return React.createElement(
    'div',
    { className: ['form-check', className].filter(Boolean).join(' ') },
    React.createElement('input', {
      id,
      name,
      value,
      type: 'radio',
      checked,
      defaultChecked,
      disabled,
      onChange,
      className: 'form-check-input',
      ...props,
    }),
    label && React.createElement('label', { className: 'form-check-label', htmlFor: id }, label)
  );
}

export const RadioButton = Radio;

export function Switch({
  id: customId,
  name,
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) {
  const generatedId = useId();
  const id = customId || name || generatedId;

  return React.createElement(
    'div',
    { className: ['form-check', 'form-switch', className].filter(Boolean).join(' ') },
    React.createElement('input', {
      id,
      name: name || id,
      type: 'checkbox',
      role: 'switch',
      checked,
      defaultChecked,
      disabled,
      onChange,
      className: 'form-check-input',
      ...props,
    }),
    label && React.createElement('label', { className: 'form-check-label', htmlFor: id }, label)
  );
}

export const Toggle = Switch;

export function Slider({
  id: customId,
  name,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  className = '',
  ...props
}) {
  const generatedId = useId();
  const id = customId || name || generatedId;

  return React.createElement('input', {
    id,
    name: name || id,
    type: 'range',
    min,
    max,
    step,
    value,
    defaultValue,
    onChange,
    className: ['form-range', className].filter(Boolean).join(' '),
    ...props,
  });
}

export function Rating({
  max = 5,
  value = 0,
  onChange,
  disabled = false,
  className = '',
  ...props
}) {
  return React.createElement(
    'div',
    {
      role: 'radiogroup',
      'aria-label': 'Rating',
      className: ['rating', className].filter(Boolean).join(' '),
      ...props,
    },
    Array.from({ length: max }, (_, i) => {
      const starVal = i + 1;
      const isFilled = starVal <= value;
      return React.createElement(
        'button',
        {
          key: starVal,
          type: 'button',
          role: 'radio',
          'aria-checked': isFilled,
          'aria-label': `${starVal} of ${max} stars`,
          disabled,
          className: ['rating-star', isFilled ? 'active' : ''].filter(Boolean).join(' '),
          onClick: () => onChange?.(starVal),
        },
        '★'
      );
    })
  );
}

export const StarRating = Rating;

export function Field({
  label,
  id: customId,
  required = false,
  description,
  error,
  learnMore,
  children,
  className = '',
}) {
  const generatedId = useId();
  const id = customId || generatedId;
  const [showLearnMore, setShowLearnMore] = useState(false);

  const descId = description ? `${id}-desc` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descId, errorId].filter(Boolean).join(' ') || undefined;

  let enhancedChildren = children;
  if (React.isValidElement(children)) {
    const childProps = children.props || {};
    enhancedChildren = React.cloneElement(children, {
      id: childProps.id || id,
      'aria-describedby':
        [childProps['aria-describedby'], describedBy].filter(Boolean).join(' ') || undefined,
      'aria-invalid':
        childProps['aria-invalid'] !== undefined ? childProps['aria-invalid'] : Boolean(error),
      'aria-required':
        childProps['aria-required'] !== undefined
          ? childProps['aria-required']
          : required || undefined,
    });
  }

  return React.createElement(
    'div',
    { className: ['boodoo-field', className].filter(Boolean).join(' ') },
    label &&
      React.createElement(
        'div',
        { className: 'boodoo-field-label-row' },
        React.createElement(
          'label',
          { className: 'boodoo-field-label', htmlFor: id },
          label,
          required && React.createElement('span', { className: 'boodoo-field-required' }, '*')
        ),
        learnMore &&
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'boodoo-field-learn-more-btn',
              'aria-expanded': showLearnMore,
              onClick: () => setShowLearnMore((prev) => !prev),
            },
            showLearnMore ? 'Hide info' : 'Learn more'
          )
      ),
    showLearnMore &&
      learnMore &&
      React.createElement('div', { className: 'boodoo-field-learn-more-content' }, learnMore),
    enhancedChildren,
    description &&
      !error &&
      React.createElement('p', { id: descId, className: 'boodoo-field-description' }, description),
    error && React.createElement('p', { id: errorId, className: 'boodoo-field-error' }, error)
  );
}

export function Combobox({
  items = [],
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Select option...',
  getOptionMeta,
  disabled = false,
  className = '',
  id: customId,
  name,
  ...props
}) {
  const generatedId = useId();
  const inputId = customId || name || generatedId;

  const { query, setQuery, isOpen, filteredItems, getInputProps, getListboxProps, getOptionProps } =
    useCombobox({
      items,
      value,
      defaultValue,
      onChange,
      getOptionMeta,
    });

  return React.createElement(
    'div',
    {
      className: ['combobox', className].filter(Boolean).join(' '),
      ...props,
    },
    React.createElement(
      'div',
      { className: 'combobox-input-wrapper' },
      React.createElement('input', {
        ...getInputProps({
          id: inputId,
          name: name || inputId,
          disabled,
          placeholder,
          className: 'form-control combobox-input',
        }),
      }),
      query &&
        !disabled &&
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'combobox-clear',
            'aria-label': 'Clear input',
            onClick: () => {
              setQuery('');
              if (value !== undefined) onChange?.('');
            },
          },
          '×'
        )
    ),
    isOpen &&
      React.createElement(
        'ul',
        {
          ...getListboxProps({
            className: 'combobox-menu show',
          }),
        },
        filteredItems.length === 0
          ? React.createElement('li', { className: 'combobox-empty d-block' }, 'No matches found')
          : filteredItems.map((item, idx) => {
              const meta = getOptionMeta ? getOptionMeta(item) : item.meta;
              return React.createElement(
                'li',
                {
                  key: item.id || item.value || idx,
                  ...getOptionProps(item, idx, {
                    className: 'combobox-item',
                  }),
                },
                React.createElement(
                  'div',
                  null,
                  React.createElement('span', { className: 'combobox-item-label' }, item.label),
                  meta && React.createElement('span', { className: 'combobox-item-meta' }, meta)
                )
              );
            })
      )
  );
}
