/**
 * Boodoo React Native Component Suite
 * Modular, tree-shakeable, pure native components with zero DOM dependencies.
 */

// Theme Context & Presets
export { BoodooProvider, useTheme, defaultLightTheme, defaultDarkTheme } from './theme.js';
export { boodooPaperLightTheme, boodooPaperDarkTheme } from './paper.js';

// Typography
export {
  Text,
  Heading,
} from './typography.js';

// Layout Primitives (Gluestack / Tamagui)
export {
  Box,
  HStack,
  XStack,
  VStack,
  YStack,
  Center,
  ZStack,
  Pressable,
  Grid,
} from './layout.js';

// Buttons & Actions
export {
  Button,
  ButtonGroup,
  IconButton,
  FAB,
  SegmentedButtons,
} from './buttons.js';

// Surfaces & Cards
export {
  Card,
  Surface,
  Divider,
  Separator,
  PricingCard,
  Tile,
} from './surfaces.js';

// Forms & Inputs
export {
  TextInput,
  Input,
  TextField,
  Textarea,
  TextArea,
  Searchbar,
  SearchBar,
  HelperText,
  Checkbox,
  CheckBox,
  RadioButton,
  Radio,
  RadioGroup,
  Switch,
  Toggle,
  Slider,
  Stepper,
  Select,
  Picker,
  ToggleButton,
} from './inputs.js';

// Data Display
export {
  Chip,
  Badge,
  Avatar,
} from './data-display.js';

// Feedback & Status
export {
  ActivityIndicator,
  Spinner,
  ProgressBar,
  Progress,
  Skeleton,
  Alert,
  Banner,
  Toast,
  Snackbar,
} from './feedback.js';

// Lists & Tables
export {
  List,
  ListItem,
  DataTable,
  Table,
} from './lists.js';

// Navigation & Headers
export {
  Appbar,
  Header,
  TopNavigation,
  Drawer,
  BottomNavigation,
  Tabs,
  PageControl,
} from './navigation.js';

// Overlays, Modals & Sheets
export {
  Dialog,
  AlertDialog,
  Modal,
  Overlay,
  BottomSheet,
  Actionsheet,
  ActionSheet,
  Sheet,
  Menu,
  Popover,
  Tooltip,
  Portal,
  TouchableRipple,
} from './overlays.js';
