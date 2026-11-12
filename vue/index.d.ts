// Fallback type interfaces when 'vue' is not installed in the current environment
export interface Ref<T = any> {
  value: T;
}

export type ComputedRef<T = any> = {
  readonly value: T;
};

export interface DisclosureReturn {
  isOpen: Ref<boolean>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  getTriggerProps: <T extends Record<string, any>>(
    props?: T
  ) => T & { 'aria-expanded': boolean; onClick: (e?: any) => void };
  getDialogProps: <T extends Record<string, any>>(
    props?: T
  ) => T & { role: string; 'aria-modal': string; style: any };
}

export interface DisclosureOptions {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export declare function useDisclosure(options?: DisclosureOptions): DisclosureReturn;

export interface ComboboxItem {
  id?: string;
  label: string;
  value: any;
  meta?: string;
}

export interface ComboboxOptions {
  items?: ComboboxItem[];
  modelValue?: any;
  value?: any;
  defaultValue?: string;
  onChange?: (value: any) => void;
  'onUpdate:modelValue'?: (value: any) => void;
  onUpdateModelValue?: (value: any) => void;
  getOptionMeta?: (item: ComboboxItem) => string;
}

export interface ComboboxReturn {
  query: Ref<string>;
  isOpen: Ref<boolean>;
  activeIndex: Ref<number>;
  selectedValue: Ref<any> | ComputedRef<any>;
  filteredItems: ComputedRef<ComboboxItem[]>;
  selectItem: (item: ComboboxItem) => void;
  getInputProps: <T extends Record<string, any>>(props?: T) => T & Record<string, any>;
  getListboxProps: <T extends Record<string, any>>(props?: T) => T & Record<string, any>;
  getOptionProps: <T extends Record<string, any>>(
    item: ComboboxItem,
    index: number,
    props?: T
  ) => T & Record<string, any>;
}

export declare function foldAccents(str: string): string;

export declare function useCombobox(options?: ComboboxOptions): ComboboxReturn;

export interface AccordionOptions {
  allowMultiple?: boolean;
  defaultExpanded?: string[];
}

export interface AccordionReturn {
  expandedKeys: ComputedRef<string[]>;
  toggle: (key: string) => void;
  isExpanded: (key: string) => boolean;
  getButtonProps: <T extends Record<string, any>>(
    key: string,
    props?: T
  ) => T & Record<string, any>;
  getPanelProps: <T extends Record<string, any>>(key: string, props?: T) => T & Record<string, any>;
}

export declare function useAccordion(options?: AccordionOptions): AccordionReturn;

export declare function useDirection(initial?: 'ltr' | 'rtl' | 'auto'): {
  direction: Ref<'ltr' | 'rtl' | 'auto'>;
  isRtl: ComputedRef<boolean>;
  setDirection: (val: 'ltr' | 'rtl' | 'auto') => void;
  toggleDirection: () => void;
};
