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

export declare function highlightMatches(
  text: string,
  query: string
): Array<{ text: string; match: boolean }>;

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

// --- Vue 3 SFC Component Props Interfaces ---
export interface DefineComponent<Props = {}, RawBindings = {}, D = {}, C = {}, M = {}> {
  new (): {
    $props: Props;
  };
}

export interface BoodooButtonProps {
  variant?:
    'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | string;
  size?: 'sm' | 'lg' | string;
  outline?: boolean;
  soft?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: MouseEvent) => void;
}

export interface BoodooAlertProps {
  variant?:
    'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | string;
  dismissible?: boolean;
  title?: string;
  icon?: string;
  closeLabel?: string;
  onDismiss?: () => void;
}

export interface BoodooCardProps {
  title?: string;
  subtitle?: string;
}

export interface BoodooBadgeProps {
  variant?:
    'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | string;
  pill?: boolean;
  soft?: boolean;
}

export interface BoodooInputProps {
  modelValue?: string | number;
  type?: string;
  id?: string;
  name?: string;
  size?: 'sm' | 'lg' | string;
  'onUpdate:modelValue'?: (value: string | number) => void;
  onInput?: (e: Event) => void;
}

export interface BoodooModalProps {
  modelValue?: boolean;
  title?: string;
  closeLabel?: string;
  'onUpdate:modelValue'?: (value: boolean) => void;
  onClose?: () => void;
}

export interface BoodooComboboxProps {
  items?: any[];
  modelValue?: any;
  placeholder?: string;
  'onUpdate:modelValue'?: (value: any) => void;
  onChange?: (value: any) => void;
}

export interface BoodooAccordionProps {
  flush?: boolean;
}

export interface BoodooAccordionItemProps {
  title?: string;
  defaultOpen?: boolean;
}

export interface BoodooOffcanvasProps {
  modelValue?: boolean;
  placement?: 'start' | 'end' | 'top' | 'bottom';
  title?: string;
  'onUpdate:modelValue'?: (value: boolean) => void;
  onClose?: () => void;
}

export interface BoodooDropdownProps {
  label?: string;
  variant?:
    'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | string;
}

export interface BoodooTabsProps {
  tabs?: Array<string | { label: string; [key: string]: any }>;
  modelValue?: string | number;
  'onUpdate:modelValue'?: (index: string | number) => void;
  onChange?: (index: string | number) => void;
}

export interface BoodooToastProps {
  modelValue?: boolean;
  title?: string;
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | string;
  'onUpdate:modelValue'?: (value: boolean) => void;
  onClose?: () => void;
}

export interface BoodooSpinnerProps {
  variant?:
    'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | string;
  size?: 'sm' | 'lg' | string;
  grow?: boolean;
}

export interface BoodooProgressProps {
  value?: number;
  max?: number;
  variant?:
    'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | string;
  striped?: boolean;
  animated?: boolean;
}

export interface BoodooBreadcrumbItem {
  label?: string;
  href?: string;
  [key: string]: any;
}

export interface BoodooBreadcrumbProps {
  items?: Array<string | BoodooBreadcrumbItem>;
}

export interface BoodooAvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
  initials?: string;
}

export interface BoodooKbdProps {}

export interface BoodooVirtualListProps {
  items?: any[];
  itemHeight?: number;
  height?: string;
}

export interface BoodooMarkdownProps {
  content?: string;
}

// --- Vue 3 SFC Components ---
export declare const BoodooButton: DefineComponent<BoodooButtonProps>;
export declare const BoodooAlert: DefineComponent<BoodooAlertProps>;
export declare const BoodooCard: DefineComponent<BoodooCardProps>;
export declare const BoodooBadge: DefineComponent<BoodooBadgeProps>;
export declare const BoodooModal: DefineComponent<BoodooModalProps>;
export declare const BoodooInput: DefineComponent<BoodooInputProps>;
export declare const BoodooCombobox: DefineComponent<BoodooComboboxProps>;
export declare const BoodooAccordion: DefineComponent<BoodooAccordionProps>;
export declare const BoodooAccordionItem: DefineComponent<BoodooAccordionItemProps>;
export declare const BoodooOffcanvas: DefineComponent<BoodooOffcanvasProps>;
export declare const BoodooDropdown: DefineComponent<BoodooDropdownProps>;
export declare const BoodooTabs: DefineComponent<BoodooTabsProps>;
export declare const BoodooToast: DefineComponent<BoodooToastProps>;
export declare const BoodooSpinner: DefineComponent<BoodooSpinnerProps>;
export declare const BoodooProgress: DefineComponent<BoodooProgressProps>;
export declare const BoodooBreadcrumb: DefineComponent<BoodooBreadcrumbProps>;
export declare const BoodooAvatar: DefineComponent<BoodooAvatarProps>;
export declare const BoodooKbd: DefineComponent<BoodooKbdProps>;
export declare const BoodooVirtualList: DefineComponent<BoodooVirtualListProps>;
export declare const BoodooMarkdown: DefineComponent<BoodooMarkdownProps>;

export declare function createBoodooVue(): { install: (app: any) => void };
