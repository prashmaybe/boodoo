import type { ComponentType, ReactNode, ReactElement } from 'react';
import type {
  BoodooColorTokens,
  BoodooSpacingScale,
  BoodooRadiiScale,
  BoodooTypographyTokens,
  BoodooShadowTokens,
} from '../tokens';
import type { BoodooPaperTheme } from './paper';

export interface BoodooComponentSpacing {
  baseSpacer?: number;
  card?: number;
  cardPadding?: number;
  cardTitleMarginBottom?: number;
  cardContentMarginVertical?: number;
  cardActionsMarginTop?: number;
  cardActionsGap?: number;
  surface?: number;
  surfacePadding?: number;
  statWidgetPadding?: number;
  pricingCardPadding?: number;
  buttonPaddingVerticalSm?: number;
  buttonPaddingHorizontalSm?: number;
  buttonPaddingVerticalMd?: number;
  buttonPaddingHorizontalMd?: number;
  buttonPaddingVerticalLg?: number;
  buttonPaddingHorizontalLg?: number;
  inputMarginBottom?: number;
  inputPaddingVertical?: number;
  inputPaddingHorizontal?: number;
  [key: string]: number | undefined;
}

export interface BoodooTheme {
  dark: boolean;
  colors: BoodooColorTokens & Record<string, string>;
  spacing: BoodooSpacingScale & Record<string, any>;
  componentSpacing: BoodooComponentSpacing;
  radii: BoodooRadiiScale;
  typography: BoodooTypographyTokens;
  shadows: BoodooShadowTokens;
}

export declare const createComponentSpacing: (
  baseSpacer?: number,
  overrides?: Partial<BoodooComponentSpacing>
) => BoodooComponentSpacing;
export declare const defaultComponentSpacing: BoodooComponentSpacing;

export declare const defaultLightTheme: BoodooTheme;
export declare const defaultDarkTheme: BoodooTheme;

export interface BoodooProviderProps {
  theme?: 'light' | 'dark' | BoodooTheme;
  customTheme?: Partial<BoodooTheme>;
  children: ReactNode;
}

export declare function BoodooProvider(props: BoodooProviderProps): ReactElement;
export declare function useTheme(): BoodooTheme;

export declare const boodooPaperLightTheme: BoodooPaperTheme;
export declare const boodooPaperDarkTheme: BoodooPaperTheme;

// --- Strong Component Prop Interfaces ---

export interface ButtonProps {
  title?: string;
  mode?: 'contained' | 'outlined' | 'text' | 'elevated' | string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'outline'
    | 'ghost'
    | string;
  type?: 'solid' | 'outline' | 'clear' | string;
  status?: string;
  size?: 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large' | string;
  disabled?: boolean;
  loading?: boolean;
  icon?: any;
  iconRight?: any;
  onPress?: (e?: any) => void;
  children?: ReactNode;
  paddingVertical?: number;
  paddingHorizontal?: number;
  style?: any;
  textStyle?: any;
  [key: string]: any;
}

export interface TextInputProps {
  label?: string;
  error?: string | boolean;
  errorMessage?: string;
  mode?: 'outlined' | 'flat' | string;
  left?: () => ReactNode;
  right?: () => ReactNode;
  leftIcon?: any;
  rightIcon?: any;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  paddingVertical?: number;
  paddingHorizontal?: number;
  marginBottom?: number;
  style?: any;
  inputStyle?: any;
  [key: string]: any;
}

export interface CardProps {
  mode?: 'elevated' | 'outlined' | 'flat' | 'contained' | string;
  variant?: string;
  padding?: number;
  children?: ReactNode;
  style?: any;
  [key: string]: any;
}

export interface DialogProps {
  visible?: boolean;
  onDismiss?: () => void;
  dismissable?: boolean;
  padding?: number;
  children?: ReactNode;
  style?: any;
  [key: string]: any;
}

export interface ModalProps {
  visible?: boolean;
  onDismiss?: () => void;
  children?: ReactNode;
  style?: any;
  [key: string]: any;
}

export interface CheckboxProps {
  checked?: boolean;
  status?: 'checked' | 'unchecked' | 'indeterminate' | string;
  title?: string;
  disabled?: boolean;
  onPress?: () => void;
  color?: string;
  uncheckedColor?: string;
  style?: any;
  [key: string]: any;
}

export interface SwitchProps {
  value?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onValueChange?: (val: boolean) => void;
  onChange?: (val: boolean) => void;
  color?: string;
  style?: any;
  [key: string]: any;
}

export interface SelectOption {
  label: string;
  value: any;
  [key: string]: any;
}

export interface SelectProps {
  selectedValue?: any;
  onValueChange?: (val: any) => void;
  placeholder?: string;
  options?: (SelectOption | string)[];
  style?: any;
  [key: string]: any;
}

export interface BoxProps {
  children?: ReactNode;
  style?: any;
  [key: string]: any;
}

export interface StackProps {
  space?: number;
  reversed?: boolean;
  children?: ReactNode;
  style?: any;
  [key: string]: any;
}

export interface GridProps {
  numColumns?: number;
  gap?: number;
  children?: ReactNode;
  style?: any;
  [key: string]: any;
}

export interface TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'muted' | 'lead' | 'caption' | string;
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  category?: string;
  color?: string;
  style?: any;
  children?: ReactNode;
  [key: string]: any;
}

export interface HeadingProps extends TextProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | string;
}

export interface BadgeProps {
  size?: number | 'sm' | 'md' | 'lg' | string;
  variant?: string;
  color?: string;
  children?: ReactNode;
  style?: any;
  [key: string]: any;
}

export interface ChipProps {
  title?: string;
  selected?: boolean;
  disabled?: boolean;
  icon?: any;
  onPress?: () => void;
  onClose?: () => void;
  style?: any;
  children?: ReactNode;
  [key: string]: any;
}

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger' | string;
  action?: string;
  title?: string;
  icon?: any;
  children?: ReactNode;
  style?: any;
  [key: string]: any;
}

export interface ProgressProps {
  progress?: number;
  color?: string;
  height?: number;
  style?: any;
  [key: string]: any;
}

// --- Typed Primitives & Components ---
export declare const Text: ComponentType<TextProps>;
export declare const Heading: ComponentType<HeadingProps>;
export declare const Box: ComponentType<BoxProps>;
export declare const HStack: ComponentType<StackProps>;
export declare const XStack: ComponentType<StackProps>;
export declare const VStack: ComponentType<StackProps>;
export declare const YStack: ComponentType<StackProps>;
export declare const Center: ComponentType<BoxProps>;
export declare const ZStack: ComponentType<BoxProps>;
export declare const Pressable: ComponentType<any>;
export declare const Grid: ComponentType<GridProps>;
export declare const Button: ComponentType<ButtonProps>;
export declare const ButtonGroup: ComponentType<any>;
export declare const IconButton: ComponentType<any>;
export declare const FAB: ComponentType<any>;
export declare const SegmentedButtons: ComponentType<any>;
export declare const Card: ComponentType<CardProps> & {
  Content: ComponentType<any>;
  Cover: ComponentType<any>;
  Actions: ComponentType<any>;
  Title: ComponentType<any>;
};
export declare const Surface: ComponentType<any>;
export declare const Divider: ComponentType<any>;
export declare const Separator: ComponentType<any>;
export declare const PricingCard: ComponentType<any>;
export declare const Tile: ComponentType<any>;
export declare const StatWidget: ComponentType<any>;
export declare const TextInput: ComponentType<TextInputProps>;
export declare const Input: ComponentType<TextInputProps>;
export declare const TextField: ComponentType<TextInputProps>;
export declare const Textarea: ComponentType<TextInputProps>;
export declare const TextArea: ComponentType<TextInputProps>;
export declare const Searchbar: ComponentType<any>;
export declare const SearchBar: ComponentType<any>;
export declare const HelperText: ComponentType<any>;
export declare const Checkbox: ComponentType<CheckboxProps>;
export declare const CheckBox: ComponentType<CheckboxProps>;
export declare const RadioButton: ComponentType<any>;
export declare const Radio: ComponentType<any>;
export declare const RadioGroup: ComponentType<any>;
export declare const Switch: ComponentType<SwitchProps>;
export declare const Toggle: ComponentType<SwitchProps>;
export declare const Slider: ComponentType<any>;
export declare const Stepper: ComponentType<any>;
export declare const Select: ComponentType<SelectProps>;
export declare const Picker: ComponentType<SelectProps>;
export declare const ToggleButton: ComponentType<any>;
export declare const Chip: ComponentType<ChipProps>;
export declare const Badge: ComponentType<BadgeProps>;
export declare const Avatar: ComponentType<any> & {
  Image: ComponentType<any>;
  Text: ComponentType<any>;
  Icon: ComponentType<any>;
};
export declare const ActivityIndicator: ComponentType<any>;
export declare const Spinner: ComponentType<any>;
export declare const ProgressBar: ComponentType<ProgressProps>;
export declare const Progress: ComponentType<ProgressProps>;
export declare const Skeleton: ComponentType<any>;
export declare const Alert: ComponentType<AlertProps>;
export declare const Banner: ComponentType<any>;
export declare const Toast: ComponentType<any>;
export declare const Snackbar: ComponentType<any>;
export declare const List: ComponentType<any> & {
  Section: ComponentType<any>;
  Subheader: ComponentType<any>;
  Accordion: ComponentType<any>;
};
export declare const ListItem: ComponentType<any>;
export declare const DataTable: ComponentType<any> & {
  Header: ComponentType<any>;
  Row: ComponentType<any>;
  Cell: ComponentType<any>;
  Pagination: ComponentType<any>;
};
export declare const Table: ComponentType<any>;
export declare const Appbar: ComponentType<any> & {
  BackAction: ComponentType<any>;
  Action: ComponentType<any>;
};
export declare const Header: ComponentType<any>;
export declare const TopNavigation: ComponentType<any>;
export declare const Drawer: ComponentType<any>;
export declare const BottomNavigation: ComponentType<any>;
export declare const Tabs: ComponentType<any>;
export declare const PageControl: ComponentType<any>;
export declare const Dialog: ComponentType<DialogProps>;
export declare const AlertDialog: ComponentType<DialogProps>;
export declare const Modal: ComponentType<ModalProps>;
export declare const Overlay: ComponentType<any>;
export declare const BottomSheet: ComponentType<any>;
export declare const Actionsheet: ComponentType<any>;
export declare const ActionSheet: ComponentType<any>;
export declare const Sheet: ComponentType<any>;
export declare const Menu: ComponentType<any>;
export declare const Popover: ComponentType<any>;
export declare const Tooltip: ComponentType<any>;
export declare const Portal: ComponentType<any>;
export declare const TouchableRipple: ComponentType<any>;

// Advanced components (v1.1.9)
export declare const ChatBubble: ComponentType<any>;
export declare const AIStream: ComponentType<any>;
export declare const FilterPill: ComponentType<any>;
export declare const BarChart: ComponentType<any>;
export declare const DonutChart: ComponentType<any>;
export declare const LineChart: ComponentType<any>;

// Extended Mobile Components (v1.2.3)
export declare const SpeedDial: ComponentType<any> & {
  Action: ComponentType<any>;
};
export declare const SpeedDialAction: ComponentType<any>;
export declare const BentoGrid: ComponentType<any>;
export declare const BentoItem: ComponentType<any>;
export declare const OtpInput: ComponentType<any>;
export declare const PinInput: ComponentType<any>;
export declare const Rating: ComponentType<any>;
export declare const StarRating: ComponentType<any>;
export declare const ChipInput: ComponentType<any>;
export declare const TagInput: ComponentType<any>;
export declare const EmptyState: ComponentType<any>;
export declare const Timeline: ComponentType<any>;
export declare const TimelineItem: ComponentType<any>;
export declare const StepIndicator: ComponentType<any>;
export declare const StepperWizard: ComponentType<any>;
export declare const Accordion: ComponentType<any> & {
  Item: ComponentType<any>;
};
export declare const AccordionItem: ComponentType<any>;
export declare const SwipeActionItem: ComponentType<any>;
export declare const SwipeableRow: ComponentType<any>;
