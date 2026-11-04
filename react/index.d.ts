import * as React from 'react';

export interface DisclosureReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  getTriggerProps: <T extends Record<string, any>>(
    props?: T
  ) => T & { 'aria-expanded': boolean; onClick: (e: any) => void };
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
  value?: any;
  defaultValue?: any;
  onChange?: (value: any) => void;
  getOptionMeta?: (item: ComboboxItem) => string;
}

export interface ComboboxReturn {
  query: string;
  setQuery: (query: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeIndex: number;
  selectedValue: any;
  filteredItems: ComboboxItem[];
  selectItem: (item: ComboboxItem) => void;
  getInputProps: <T extends Record<string, any>>(props?: T) => T & Record<string, any>;
  getListboxProps: <T extends Record<string, any>>(props?: T) => T & Record<string, any>;
  getOptionProps: <T extends Record<string, any>>(
    item: ComboboxItem,
    index: number,
    props?: T
  ) => T & Record<string, any>;
}

export declare function useCombobox(options?: ComboboxOptions): ComboboxReturn;
export declare function foldAccents(str: string): string;

export interface AccordionOptions {
  allowMultiple?: boolean;
  defaultExpanded?: string[];
}

export interface AccordionReturn {
  expandedKeys: string[];
  toggle: (key: string) => void;
  isExpanded: (key: string) => boolean;
  getButtonProps: <T extends Record<string, any>>(
    key: string,
    props?: T
  ) => T & Record<string, any>;
  getPanelProps: <T extends Record<string, any>>(key: string, props?: T) => T & Record<string, any>;
}

export declare function useAccordion(options?: AccordionOptions): AccordionReturn;

// --- DOM Components ---

export interface BoodooProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: 'normal' | 'compact';
  theme?: {
    primary?: string;
    surface?: string;
    text?: string;
    radius?: string;
  };
}
export declare const BoodooProvider: React.FC<BoodooProviderProps>;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | string;
  size?: 'sm' | 'lg' | string;
  outline?: boolean;
}
export declare const Button: React.FC<ButtonProps>;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | string;
  soft?: boolean;
  outline?: boolean;
}
export declare const Badge: React.FC<BadgeProps>;

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
}
export declare const Dialog: React.FC<DialogProps>;

export interface ConfirmDialogProps extends Omit<DialogProps, 'title'> {
  title?: React.ReactNode;
  onConfirm?: () => void;
  mustMatch?: string;
  confirmText?: string;
  cancelText?: string;
  description?: React.ReactNode;
  confirmVariant?: string;
}
export declare const ConfirmDialog: React.FC<ConfirmDialogProps>;

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  id?: string;
  required?: boolean;
  description?: React.ReactNode;
  error?: React.ReactNode;
  learnMore?: React.ReactNode;
}
export declare const Field: React.FC<FieldProps>;

export interface TableColumn<T = any> {
  key: string;
  title: React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  render?: (val: any, row: T, index: number) => React.ReactNode;
}

export interface TableProps<T = any> extends React.TableHTMLAttributes<HTMLTableElement> {
  columns: TableColumn<T>[];
  data: T[];
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  keyField?: string;
  expandedRowRender?: (row: T, index: number) => React.ReactNode;
  expandedKeys?: any[];
  responsive?: boolean;
  hover?: boolean;
  striped?: boolean;
  bordered?: boolean;
}
export declare function Table<T = any>(props: TableProps<T>): React.ReactElement;

export interface ComboboxComponentProps {
  items: ComboboxItem[];
  value?: any;
  defaultValue?: any;
  onChange?: (val: any) => void;
  placeholder?: string;
  getOptionMeta?: (item: ComboboxItem) => string;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
}
export declare const Combobox: React.FC<ComboboxComponentProps>;

export interface AccordionItem {
  key: string;
  title: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultExpanded?: string[];
}
export declare const Accordion: React.FC<AccordionComponentProps>;

export interface NavItem {
  key: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface NavProps extends React.HTMLAttributes<HTMLUListElement> {
  items: NavItem[];
  activeKey?: string;
  onSelect?: (key: string) => void;
  pills?: boolean;
}
export declare const Nav: React.FC<NavProps>;

export interface StickyHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  isStuck?: boolean;
}
export declare const StickyHeader: React.FC<StickyHeaderProps>;
