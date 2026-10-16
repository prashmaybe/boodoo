export interface BoodooComponent {
  dispose(): void;
  hide?(): void;
  show?(): void;
  toggle?(): void;
}

export declare class BaseComponent implements BoodooComponent {
  constructor(target: string | Element, config?: Record<string, unknown>);
  static getInstance(target: string | Element): BaseComponent | null;
  static getOrCreateInstance(target: string | Element, config?: Record<string, unknown>): BaseComponent;
  static getAll(): BaseComponent[];
  dispose(): void;
  hide(): void;
  show(): void;
  toggle(): void;
}

export declare class Alert extends BaseComponent {
  close(): void;
}

export declare class Button extends BaseComponent {
  setLoading(loading: boolean): void;
}

export declare class Modal extends BaseComponent {
  static toggleVia(source: Element): void;
}

export declare class Toast extends BaseComponent {
  static showToast(el: Element): void;
  static showAll(container?: Element): void;
}

export declare class Tooltip extends BaseComponent {}
export declare class Popover extends BaseComponent {}
export declare class Collapse extends BaseComponent {}
export declare class Dropdown extends BaseComponent {}
export declare class Offcanvas extends BaseComponent {}
export declare class Tab extends BaseComponent {}
export declare class Carousel extends BaseComponent {}
export declare class ScrollSpy extends BaseComponent {}
export declare class Sidebar extends BaseComponent {}
export declare class BottomSheet extends BaseComponent {}
export declare class ChipInput extends BaseComponent {
  addChip(text: string, variant?: string): void;
  getTags(): string[];
}
export declare class CommandPalette extends BaseComponent {
  open(): void;
  close(): void;
  static initDefault(options?: { items?: Array<{ title: string; href?: string; action?: () => void; icon?: string; shortcut?: string }> }): void;
}
export declare class ContextMenu extends BaseComponent {}
export declare class DataTable extends BaseComponent {}
export declare class Dropzone extends BaseComponent {
  removeFile(file: File, elementNode?: Element): void;
  clear(): void;
  getFiles(): File[];
}
export declare class Lightbox extends BaseComponent {}
export declare class OTP extends BaseComponent {}
export declare class Rating extends BaseComponent {}
export declare class SpeedDial extends BaseComponent {}
export declare class Splitter extends BaseComponent {}
export declare class Stepper extends BaseComponent {}
export declare class TreeView extends BaseComponent {}
export declare class Banner extends BaseComponent {}
export declare class Combobox extends BaseComponent {}

export interface ToastOptions {
  title?: string;
  variant?: string;
  delay?: number;
  container?: string | Element;
}

export interface BoodooGlobal {
  toast: {
    (message: string, options?: ToastOptions): Toast;
    show(message: string, options?: ToastOptions): Toast;
    success(message: string, options?: ToastOptions): Toast;
    danger(message: string, options?: ToastOptions): Toast;
    warning(message: string, options?: ToastOptions): Toast;
    info(message: string, options?: ToastOptions): Toast;
  };
  Alert: typeof Alert;
  Button: any;
  Collapse: typeof Collapse;
  Dropdown: typeof Dropdown;
  Modal: typeof Modal;
  Offcanvas: typeof Offcanvas;
  Tab: typeof Tab;
  Toast: typeof Toast;
  Tooltip: typeof Tooltip;
  Popover: typeof Popover;
  Carousel: typeof Carousel;
  ScrollSpy: typeof ScrollSpy;
  Sidebar: typeof Sidebar;
  BottomSheet: typeof BottomSheet;
  ChipInput: typeof ChipInput;
  CommandPalette: typeof CommandPalette;
  ContextMenu: typeof ContextMenu;
  DataTable: typeof DataTable;
  Dropzone: typeof Dropzone;
  Lightbox: typeof Lightbox;
  OTP: typeof OTP;
  Rating: typeof Rating;
  SpeedDial: typeof SpeedDial;
  Splitter: typeof Splitter;
  Stepper: typeof Stepper;
  TreeView: typeof TreeView;
  Banner: typeof Banner;
  Combobox: typeof Combobox;
  clipboard: any;
  theme: any;
  a11y: {
    announce(message: string, politeness?: 'polite' | 'assertive'): void;
    setRovingTabindex(items: HTMLElement[] | NodeListOf<HTMLElement>, activeIndex?: number): void;
    createFocusTrap(container: HTMLElement, options?: { initialFocus?: HTMLElement }): () => void;
  };
}

declare const boodoo: BoodooGlobal;
export default boodoo;

export {
  Alert,
  Banner,
  BottomSheet,
  Button,
  ChipInput,
  Collapse,
  Combobox,
  CommandPalette,
  ContextMenu,
  DataTable,
  Dropdown,
  Dropzone,
  Lightbox,
  Modal,
  Offcanvas,
  OTP,
  Popover,
  Rating,
  ScrollSpy,
  Sidebar,
  SpeedDial,
  Splitter,
  Stepper,
  Tab,
  Toast,
  Tooltip,
  TreeView,
  Carousel,
  clipboard,
  theme,
  a11y,
};
