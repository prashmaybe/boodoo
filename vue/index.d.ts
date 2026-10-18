import type { Ref, ComputedRef } from 'vue';

export interface DisclosureReturn {
  isOpen: Ref<boolean>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  getTriggerProps: <T extends Record<string, any>>(props?: T) => T & { 'aria-expanded': boolean; onClick: (e?: any) => void };
  getDialogProps: <T extends Record<string, any>>(props?: T) => T & { role: string; 'aria-modal': string; style: any };
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
}

export interface ComboboxOptions {
  items?: ComboboxItem[];
  defaultValue?: string;
  onChange?: (value: any) => void;
}

export interface ComboboxReturn {
  query: Ref<string>;
  isOpen: Ref<boolean>;
  activeIndex: Ref<number>;
  selectedValue: Ref<any>;
  filteredItems: ComputedRef<ComboboxItem[]>;
  selectItem: (item: ComboboxItem) => void;
  getInputProps: <T extends Record<string, any>>(props?: T) => T & Record<string, any>;
  getListboxProps: <T extends Record<string, any>>(props?: T) => T & Record<string, any>;
  getOptionProps: <T extends Record<string, any>>(item: ComboboxItem, index: number, props?: T) => T & Record<string, any>;
}

export declare function useCombobox(options?: ComboboxOptions): ComboboxReturn;

export interface AccordionOptions {
  allowMultiple?: boolean;
  defaultExpanded?: string[];
}

export interface AccordionReturn {
  expandedKeys: ComputedRef<string[]>;
  toggle: (key: string) => void;
  isExpanded: (key: string) => boolean;
  getButtonProps: <T extends Record<string, any>>(key: string, props?: T) => T & Record<string, any>;
  getPanelProps: <T extends Record<string, any>>(key: string, props?: T) => T & Record<string, any>;
}

export declare function useAccordion(options?: AccordionOptions): AccordionReturn;
