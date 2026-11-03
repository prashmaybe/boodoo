export interface BoodooComponent {
  dispose(): void;
  hide?(): void;
  show?(): void;
  toggle?(): void;
}

export declare class BaseComponent implements BoodooComponent {
  constructor(target: string | Element, config?: Record<string, unknown>);
  static getInstance(target: string | Element): BaseComponent | null;
  static getOrCreateInstance(
    target: string | Element,
    config?: Record<string, unknown>
  ): BaseComponent;
  static getAll(): BaseComponent[];
  dispose(): void;
  hide(): void;
  show(): void;
  toggle(): void;
}

declare class Alert extends BaseComponent {
  close(): void;
}

declare class Button extends BaseComponent {
  setLoading(loading: boolean): void;
}

declare class Modal extends BaseComponent {
  static toggleVia(source: Element): void;
}

declare class Toast extends BaseComponent {
  static showToast(el: Element): void;
  static showAll(container?: Element): void;
}

declare class Tooltip extends BaseComponent {}
declare class Popover extends BaseComponent {}
declare class Collapse extends BaseComponent {}
declare class Dropdown extends BaseComponent {}
declare class Offcanvas extends BaseComponent {}
declare class Tab extends BaseComponent {}
declare class Carousel extends BaseComponent {}
declare class ScrollSpy extends BaseComponent {}
declare class Sidebar extends BaseComponent {}
declare class BottomSheet extends BaseComponent {}
declare class ChipInput extends BaseComponent {
  addChip(text: string, variant?: string): void;
  getTags(): string[];
}
declare class CommandPalette extends BaseComponent {
  open(): void;
  close(): void;
  static initDefault(options?: {
    items?: Array<{
      title: string;
      href?: string;
      action?: () => void;
      icon?: string;
      shortcut?: string;
    }>;
  }): void;
}
declare class ContextMenu extends BaseComponent {}
declare class DataTable extends BaseComponent {}
declare class Dropzone extends BaseComponent {
  removeFile(file: File, elementNode?: Element): void;
  clear(): void;
  getFiles(): File[];
}
declare class Lightbox extends BaseComponent {}
declare class OTP extends BaseComponent {}
declare class Rating extends BaseComponent {}
declare class SpeedDial extends BaseComponent {}
declare class Splitter extends BaseComponent {}
declare class Stepper extends BaseComponent {}
declare class TreeView extends BaseComponent {}
declare class Banner extends BaseComponent {}
declare class Combobox extends BaseComponent {}
declare class FloatingBar extends BaseComponent {
  show(count?: number): void;
  hide(): void;
  setCount(count: number): void;
}
declare class ImageCompare extends BaseComponent {
  setPosition(percentage: number): void;
  getPosition(): number;
}
declare class PasswordMeter extends BaseComponent {
  evaluate(password?: string): number;
}
declare class FABDock extends BaseComponent {
  open(): void;
  close(): void;
  toggle(): void;
}
declare class DialogFullscreen extends BaseComponent {
  show(): void;
  hide(): void;
  toggle(): void;
}
declare class Tour extends BaseComponent {
  setSteps(steps: Array<{ target?: string | Element; title?: string; content?: string }>): void;
  start(): void;
  next(): void;
  prev(): void;
  end(): void;
}

export interface ChartData {
  labels?: string[];
  datasets?: Array<{
    label?: string;
    data?: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    colors?: string[];
    pointBackgroundColor?: string;
  }>;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  aspectRatio?: number;
  donutCutout?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltips?: boolean;
}

declare class Chart extends BaseComponent {
  render(): void;
  resize(): void;
  update(data?: ChartData, options?: ChartOptions): void;
  getColors(): { palette: string[]; text: string; grid: string };
  dispose(): void;
}

export interface ToastOptions {
  title?: string;
  variant?: string;
  delay?: number;
  container?: string | Element;
}

declare class FilterBar extends BaseComponent {
  addPill(label: string, value: string, key?: string): void;
  removePill(key: string, value: string, pillElement?: HTMLElement): void;
  clearAll(): void;
}

declare class TransferList extends BaseComponent {
  moveSelected(sourcePanel: HTMLElement, targetPanel: HTMLElement): void;
  moveAll(sourcePanel: HTMLElement, targetPanel: HTMLElement): void;
}

declare class ColorPicker extends BaseComponent {
  setValue(color: string, updateInput?: boolean): void;
  getValue(): string;
}

declare class BackToTop extends BaseComponent {
  dispose(): void;
}

declare function initDataApi(component?: any, selector?: string): void;
declare function initRipple(target?: any): void;
declare function registerCustomElements(): void;

declare const clipboard: {
  copy(text: string): Promise<boolean>;
};
declare const theme: {
  get(): string;
  set(theme: string): void;
  toggle(): string;
};
declare const a11y: {
  announce(message: string, politeness?: 'polite' | 'assertive'): void;
  setRovingTabindex(items: HTMLElement[] | NodeListOf<HTMLElement>, activeIndex?: number): void;
  createFocusTrap(container: HTMLElement, options?: { initialFocus?: HTMLElement }): () => void;
};

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
  FloatingBar: typeof FloatingBar;
  ImageCompare: typeof ImageCompare;
  PasswordMeter: typeof PasswordMeter;
  FABDock: typeof FABDock;
  DialogFullscreen: typeof DialogFullscreen;
  Tour: typeof Tour;
  Chart: typeof Chart;
  FilterBar: typeof FilterBar;
  TransferList: typeof TransferList;
  ColorPicker: typeof ColorPicker;
  BackToTop: typeof BackToTop;
  clipboard: any;
  theme: any;
  a11y: {
    announce(message: string, politeness?: 'polite' | 'assertive'): void;
    setRovingTabindex(items: HTMLElement[] | NodeListOf<HTMLElement>, activeIndex?: number): void;
    createFocusTrap(container: HTMLElement, options?: { initialFocus?: HTMLElement }): () => void;
  };
  initDataApi: (component?: any, selector?: string) => void;
  initRipple: (target?: any) => void;
  registerCustomElements: () => void;
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
  DialogFullscreen,
  Dropdown,
  Dropzone,
  FABDock,
  FloatingBar,
  ImageCompare,
  Lightbox,
  Modal,
  Offcanvas,
  OTP,
  PasswordMeter,
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
  Tour,
  Chart,
  TreeView,
  Carousel,
  clipboard,
  initDataApi,
  initRipple,
  registerCustomElements,
  theme,
  a11y,
  FilterBar,
  TransferList,
  ColorPicker,
  BackToTop,
};
