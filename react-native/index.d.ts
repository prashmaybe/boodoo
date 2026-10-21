import type { ComponentType, ReactNode } from 'react';
import type { BoodooColorTokens, BoodooSpacingScale, BoodooRadiiScale, BoodooTypographyTokens, BoodooShadowTokens } from '../tokens/index.d.ts';

export interface BoodooTheme {
  dark: boolean;
  colors: Record<string, string>;
  spacing: BoodooSpacingScale;
  radii: BoodooRadiiScale;
  typography: BoodooTypographyTokens;
  shadows: BoodooShadowTokens;
}

export declare const defaultLightTheme: BoodooTheme;
export declare const defaultDarkTheme: BoodooTheme;

export interface BoodooProviderProps {
  theme?: 'light' | 'dark' | BoodooTheme;
  customTheme?: Partial<BoodooTheme>;
  children: ReactNode;
}

export declare function BoodooProvider(props: BoodooProviderProps): JSX.Element;
export declare function useTheme(): BoodooTheme;

export declare const boodooPaperLightTheme: Record<string, unknown>;
export declare const boodooPaperDarkTheme: Record<string, unknown>;

// Primitives & Components
export declare const Text: ComponentType<any>;
export declare const Heading: ComponentType<any>;
export declare const Box: ComponentType<any>;
export declare const HStack: ComponentType<any>;
export declare const XStack: ComponentType<any>;
export declare const VStack: ComponentType<any>;
export declare const YStack: ComponentType<any>;
export declare const Center: ComponentType<any>;
export declare const ZStack: ComponentType<any>;
export declare const Pressable: ComponentType<any>;
export declare const Grid: ComponentType<any>;
export declare const Button: ComponentType<any>;
export declare const ButtonGroup: ComponentType<any>;
export declare const IconButton: ComponentType<any>;
export declare const FAB: ComponentType<any>;
export declare const SegmentedButtons: ComponentType<any>;
export declare const Card: ComponentType<any> & {
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
export declare const TextInput: ComponentType<any>;
export declare const Input: ComponentType<any>;
export declare const TextField: ComponentType<any>;
export declare const Textarea: ComponentType<any>;
export declare const TextArea: ComponentType<any>;
export declare const Searchbar: ComponentType<any>;
export declare const SearchBar: ComponentType<any>;
export declare const HelperText: ComponentType<any>;
export declare const Checkbox: ComponentType<any>;
export declare const CheckBox: ComponentType<any>;
export declare const RadioButton: ComponentType<any>;
export declare const Radio: ComponentType<any>;
export declare const RadioGroup: ComponentType<any>;
export declare const Switch: ComponentType<any>;
export declare const Toggle: ComponentType<any>;
export declare const Slider: ComponentType<any>;
export declare const Stepper: ComponentType<any>;
export declare const Select: ComponentType<any>;
export declare const Picker: ComponentType<any>;
export declare const ToggleButton: ComponentType<any>;
export declare const Chip: ComponentType<any>;
export declare const Badge: ComponentType<any>;
export declare const Avatar: ComponentType<any> & {
  Image: ComponentType<any>;
  Text: ComponentType<any>;
  Icon: ComponentType<any>;
};
export declare const ActivityIndicator: ComponentType<any>;
export declare const Spinner: ComponentType<any>;
export declare const ProgressBar: ComponentType<any>;
export declare const Progress: ComponentType<any>;
export declare const Skeleton: ComponentType<any>;
export declare const Alert: ComponentType<any>;
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
export declare const Dialog: ComponentType<any>;
export declare const AlertDialog: ComponentType<any>;
export declare const Modal: ComponentType<any>;
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

