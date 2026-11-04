import * as React from 'react';

// --- Headless Hooks ---
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

// --- Theme ---
export interface BoodooProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: 'normal' | 'compact';
  theme?: {
    primary?: string;
    surface?: string;
    text?: string;
    radius?: string;
  };
}
export declare const ThemeContext: React.Context<{
  density: 'normal' | 'compact' | string;
  theme: Record<string, string>;
}>;
export declare const BoodooProvider: React.FC<BoodooProviderProps>;
export declare function useBoodooTheme(): { density: string; theme: Record<string, string> };

// --- Typography ---
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: string;
  color?: string;
  size?: number | string;
  weight?: string;
  align?: string;
  truncate?: boolean;
}
export declare const Text: React.FC<TextProps>;

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  as?: React.ElementType;
}
export declare const Heading: React.FC<HeadingProps>;

// --- Layout ---
export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}
export declare const Box: React.FC<BoxProps>;

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  fluid?: boolean;
  breakpoint?: string;
}
export declare const Container: React.FC<ContainerProps>;

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number | string;
}
export declare const Row: React.FC<RowProps>;

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
  offset?: number;
}
export declare const Col: React.FC<ColProps>;

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: number | string;
  align?: string;
  justify?: string;
  wrap?: boolean;
}
export declare const HStack: React.FC<StackProps>;
export declare const XStack: React.FC<StackProps>;
export declare const VStack: React.FC<StackProps>;
export declare const YStack: React.FC<StackProps>;
export declare const Center: React.FC<React.HTMLAttributes<HTMLDivElement>>;

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number | string;
  gap?: number | string;
}
export declare const Grid: React.FC<GridProps>;

export interface SplitterProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
  minSize?: number;
}
export declare const Splitter: React.FC<SplitterProps>;

// --- Buttons & Actions ---
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  size?: 'sm' | 'lg' | string;
  outline?: boolean;
  soft?: boolean;
  loading?: boolean;
}
export declare const Button: React.FC<ButtonProps>;

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
  size?: string;
}
export declare const ButtonGroup: React.FC<ButtonGroupProps>;

export interface IconButtonProps extends ButtonProps {
  icon?: React.ReactNode;
}
export declare const IconButton: React.FC<IconButtonProps>;

export interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  variant?: string;
}
export declare const FAB: React.FC<FABProps>;

export interface SegmentedButtonsProps extends React.HTMLAttributes<HTMLDivElement> {
  options: Array<{ label: React.ReactNode; value: any; disabled?: boolean }>;
  value?: any;
  onChange?: (val: any) => void;
}
export declare const SegmentedButtons: React.FC<SegmentedButtonsProps>;

// --- Surfaces ---
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  image?: string;
}
export declare const Card: React.FC<CardProps>;

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: number;
}
export declare const Surface: React.FC<SurfaceProps>;

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  vertical?: boolean;
}
export declare const Divider: React.FC<DividerProps>;
export declare const Separator: React.FC<DividerProps>;

export interface StatWidgetProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  value: React.ReactNode;
  change?: React.ReactNode;
  trend?: 'up' | 'down';
  icon?: React.ReactNode;
}
export declare const StatWidget: React.FC<StatWidgetProps>;

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: number;
}
export declare const BentoGrid: React.FC<BentoGridProps>;

export interface BentoItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: number;
  rowSpan?: number;
}
export declare const BentoItem: React.FC<BentoItemProps>;

// --- Forms & Inputs ---
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'lg' | string;
}
export declare const Input: React.FC<InputProps>;
export declare const TextInput: React.FC<InputProps>;
export declare const TextField: React.FC<InputProps>;

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  rows?: number;
}
export declare const Textarea: React.FC<TextareaProps>;
export declare const TextArea: React.FC<TextareaProps>;

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options?: Array<{ label: string; value: any; disabled?: boolean }>;
  size?: 'sm' | 'lg' | string;
}
export declare const Select: React.FC<SelectProps>;

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}
export declare const Checkbox: React.FC<CheckboxProps>;
export declare const CheckBox: React.FC<CheckboxProps>;

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}
export declare const Radio: React.FC<RadioProps>;
export declare const RadioButton: React.FC<RadioProps>;

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}
export declare const Switch: React.FC<SwitchProps>;
export declare const Toggle: React.FC<SwitchProps>;

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  min?: number;
  max?: number;
  step?: number;
}
export declare const Slider: React.FC<SliderProps>;

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  max?: number;
  value?: number;
  onChange?: (val: number) => void;
  disabled?: boolean;
}
export declare const Rating: React.FC<RatingProps>;
export declare const StarRating: React.FC<RatingProps>;

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  id?: string;
  required?: boolean;
  description?: React.ReactNode;
  error?: React.ReactNode;
  learnMore?: React.ReactNode;
}
export declare const Field: React.FC<FieldProps>;

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

// --- Data Display ---
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: string;
  soft?: boolean;
  outline?: boolean;
  pill?: boolean;
}
export declare const Badge: React.FC<BadgeProps>;

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: string;
  onClose?: () => void;
  disabled?: boolean;
}
export declare const Chip: React.FC<ChipProps>;

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: string;
}
export declare const Avatar: React.FC<AvatarProps>;

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}
export declare const EmptyState: React.FC<EmptyStateProps>;

export declare const Timeline: React.FC<React.HTMLAttributes<HTMLUListElement>>;
export interface TimelineItemProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'title'> {
  title?: React.ReactNode;
  time?: React.ReactNode;
  badge?: React.ReactNode;
}
export declare const TimelineItem: React.FC<TimelineItemProps>;

export interface StepIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Array<{ label?: React.ReactNode; title?: React.ReactNode; key?: string }>;
  currentStep?: number;
  onStepClick?: (idx: number) => void;
}
export declare const StepIndicator: React.FC<StepIndicatorProps>;

// --- Feedback ---
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  title?: React.ReactNode;
  icon?: React.ReactNode;
}
export declare const Alert: React.FC<AlertProps>;

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  onClose?: () => void;
}
export declare const Banner: React.FC<BannerProps>;

export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  open?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  time?: React.ReactNode;
}
export declare const Toast: React.FC<ToastProps>;

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
  size?: 'sm' | 'md';
  grow?: boolean;
}
export declare const Spinner: React.FC<SpinnerProps>;

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  min?: number;
  max?: number;
  variant?: string;
  striped?: boolean;
  animated?: boolean;
  label?: React.ReactNode | boolean;
}
export declare const ProgressBar: React.FC<ProgressBarProps>;
export declare const Progress: React.FC<ProgressBarProps>;

// --- Lists & Tables ---
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

export interface ListProps extends React.HTMLAttributes<HTMLElement> {
  flush?: boolean;
  numbered?: boolean;
}
export declare const List: React.FC<ListProps>;

export interface ListItemProps extends React.HTMLAttributes<HTMLElement> {
  active?: boolean;
  disabled?: boolean;
  action?: boolean;
}
export declare const ListItem: React.FC<ListItemProps>;

// --- Navigation ---
export interface NavItem {
  key: string;
  label: React.ReactNode;
  disabled?: boolean;
}
export interface NavProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  items: NavItem[];
  activeKey?: string;
  onSelect?: (key: string) => void;
  pills?: boolean;
  vertical?: boolean;
}
export declare const Nav: React.FC<NavProps>;

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  brand?: React.ReactNode;
}
export declare const Navbar: React.FC<NavbarProps>;

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: Array<{ key?: string; label: React.ReactNode; href?: string }>;
}
export declare const Breadcrumb: React.FC<BreadcrumbProps>;

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}
export declare const Pagination: React.FC<PaginationProps>;

export interface StickyHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  isStuck?: boolean;
}
export declare const StickyHeader: React.FC<StickyHeaderProps>;

// --- Overlays ---
export interface DialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
}
export declare const Dialog: React.FC<DialogProps>;
export declare const Modal: React.FC<DialogProps>;

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

export interface OffcanvasProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  placement?: 'start' | 'end' | 'top' | 'bottom';
}
export declare const Offcanvas: React.FC<OffcanvasProps>;
export declare const Drawer: React.FC<OffcanvasProps>;

export interface DropdownItem {
  key?: string;
  label?: React.ReactNode;
  divider?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
export interface DropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  trigger: React.ReactNode;
  items: DropdownItem[];
  open?: boolean;
  onToggle?: (open: boolean) => void;
}
export declare const Dropdown: React.FC<DropdownProps>;

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'start' | 'end';
}
export declare const Tooltip: React.FC<TooltipProps>;
