// boodoo Sitewide Component & Documentation Search
// Fast, client-side, keyboard-accessible spotlight search for components, utilities, and guides.

(function () {
  'use strict';

  // Comprehensive catalog of design components, forms, layout, utilities, and guides
  const CATALOG = [
    // Getting started
    { title: 'Introduction', category: 'Getting Started', route: 'getting-started/introduction', desc: 'Get started with boodoo — architecture, philosophy, and quick overview.', keywords: 'intro overview guide docs setup start getting started', icon: '🚀' },
    { title: 'Download & Releases', category: 'Getting Started', route: 'getting-started/download', desc: 'Download compiled CSS, JavaScript, and source Sass/Less files.', keywords: 'download zip dist release source files install', icon: '📥' },
    { title: 'What\'s included', category: 'Getting Started', route: 'getting-started/contents', desc: 'boodoo includes precompiled CSS and JavaScript bundles, plus Sass and Less source files.', keywords: 'files structure assets directories folders dist what is included source package tree', icon: '📦' },
    { title: 'Usage & CDN', category: 'Getting Started', route: 'getting-started/usage', desc: 'Include boodoo with high-speed CDN links via jsDelivr.', keywords: 'cdn link script css js head include unpkg jsdelivr', icon: '🌐' },
    { title: 'Install via npm', category: 'Getting Started', route: 'getting-started/npm', desc: 'Install boodoo into Node, Vite, Webpack, or Next.js with npm, pnpm or yarn.', keywords: 'npm package install pnpm yarn bundler node modules vite', icon: '📦' },
    { title: 'Customize with Sass', category: 'Getting Started', route: 'getting-started/sass', desc: 'Customize variables, maps, and color palettes using Sass / SCSS.', keywords: 'sass scss variables customize compile override theme', icon: '💅' },
    { title: 'Customize with Less', category: 'Getting Started', route: 'getting-started/less', desc: 'boodoo also ships a Less build covering the design tokens, grid, core components and utilities.', keywords: 'less style compile variables mixins preprocessor boodoo.less theme styling', icon: '🎨' },
    { title: 'Starter template', category: 'Getting Started', route: 'getting-started/starter', desc: 'A complete starter template to start using boodoo today.', keywords: 'starter boilerplate template html5 skeleton quick start setup scaffolding', icon: '⚡' },
    { title: 'Examples & Starters', category: 'Getting Started', route: 'getting-started/examples', desc: 'Official starter templates, dashboards, full pages, React and Vue starter kits.', keywords: 'examples templates starter react vue nextjs dashboard pricing checkout showcase', icon: '🎨' },
    { title: 'Browser support', category: 'Getting Started', route: 'getting-started/browser-support', desc: 'boodoo supports the latest, stable releases of all major browsers and platforms.', keywords: 'browsers chrome firefox safari edge ios android opera webkit compatibility', icon: '🌐' },
    { title: 'Accessibility', category: 'Getting Started', route: 'getting-started/accessibility', desc: 'boodoo is built with accessibility in mind — skip links, focus rings, aria attributes and reduced motion support.', keywords: 'a11y wcag screen readers aria keyboard navigation focus trap indicators contrast', icon: '♿' },
    { title: 'Dark Mode & Themes', category: 'Getting Started', route: 'getting-started/theme', desc: 'Built-in light/dark theme switching with data-boodoo-theme and JS API.', keywords: 'dark mode light theme toggle color-scheme palette switch', icon: '🌓' },
    { title: 'Custom Elements', category: 'Getting Started', route: 'getting-started/custom-elements', desc: 'HTML Web Components: <boodoo-rating>, <boodoo-otp>, and <boodoo-tree>.', keywords: 'web components custom elements tag autonomous shadow dom', icon: '🧩' },
    { title: 'Electron Desktop Apps', category: 'Getting Started', route: 'getting-started/electron', desc: 'Build modern, cross-platform desktop applications with Electron and boodoo. Native titlebars, drag regions, platform tokens, and desktop UI components.', keywords: 'electron desktop macos windows linux titlebar window frameless apps native', icon: '🖥️' },
    { title: 'Platforms & Frameworks', category: 'Getting Started', route: 'getting-started/platforms', desc: 'Integrate boodoo with Angular, Cordova, PhoneGap, Meteor, Photon, React Native Web, React Native Mobile (iOS & Android), Electron, and more.', keywords: 'platforms frameworks angular react vue cordova phonegap meteor photon ionic svelte solid nextjs', icon: '🔌' },
    { title: 'React Native & Mobile', category: 'Getting Started', route: 'getting-started/react-native-examples', desc: 'Comprehensive examples and interactive previews for React Native Mobile, Expo, React Native Paper migration, and cross-platform design tokens.', keywords: 'react native mobile expo android ios components widgets mobile preview touch paper', icon: '📱' },

    // Layout
    { title: 'Containers', category: 'Layout', route: 'layout/containers', desc: 'Containers are the fundamental building block that contain and pad content.', keywords: 'container fluid responsive wrapper layout width max-width', icon: '📐' },
    { title: 'Grid system', category: 'Layout', route: 'layout/grid', desc: 'Mobile-first 12-column flexbox grid system with auto-layout and breakpoints.', keywords: 'grid columns rows 12-col responsive flexbox layout', icon: '▦' },
    { title: 'Columns', category: 'Layout', route: 'layout/columns', desc: 'Column alignment, ordering, offsetting, and wrapping rules.', keywords: 'col column offset order align wrap flex', icon: '🏛️' },
    { title: 'Gutters', category: 'Layout', route: 'layout/gutters', desc: 'Gutters are the padding between columns used to responsively space content.', keywords: 'gx gy gap space gutters padding spacing column gap', icon: '↔️' },
    { title: 'CSS Grid', category: 'Layout', route: 'layout/css-grid', desc: 'Native CSS Grid layout classes for powerful two-dimensional grid layouts.', keywords: 'css grid template rows columns area auto-fill auto-fit', icon: '🍱' },
    { title: 'Breakpoints', category: 'Layout', route: 'layout/breakpoints', desc: 'Responsive breakpoints for building mobile, tablet, and desktop layouts.', keywords: 'sm md lg xl xxl media queries responsive viewport width', icon: '📏' },

    // Content
    { title: 'Typography', category: 'Content', route: 'content/typography', desc: 'Headings, display headings, body copy, lead text, blockquotes, and lists.', keywords: 'font heading text lead paragraph display copy type font-size', icon: '🔤' },
    { title: 'Images', category: 'Content', route: 'content/images', desc: 'Responsive images, image thumbnails, and rounded picture helpers.', keywords: 'img picture responsive thumbnail rounded fluid cover', icon: '🖼️' },
    { title: 'Tables', category: 'Content', route: 'content/tables', desc: 'Customizable data tables with striped rows, hoverable rows, borders, and dark mode.', keywords: 'table data grid rows columns striped border hover compact', icon: '📊' },
    { title: 'Figures', category: 'Content', route: 'content/figures', desc: 'Display related images and text with the figure and figcaption elements.', keywords: 'figure caption image illustration label quote', icon: '🖼️' },

    // Forms
    { title: 'Forms Overview', category: 'Forms', route: 'forms/overview', desc: 'Form control styles, layout options, and custom form elements.', keywords: 'form inputs text input controls layout form fields', icon: '📝' },
    { title: 'Form control', category: 'Forms', route: 'forms/form-control', desc: 'Textual form controls like input and textarea with custom sizes and states.', keywords: 'text field input textarea form placeholder', icon: '✏️' },
    { title: 'Select', category: 'Forms', route: 'forms/select', desc: 'Customized select dropdown menus matching modern form controls.', keywords: 'dropdown select picker choice option combobox', icon: '🔽' },
    { title: 'Checks & radios', category: 'Forms', route: 'forms/checks', desc: 'Custom checkboxes, radio buttons, and toggle switches.', keywords: 'checkbox radio toggle switch boolean options selection', icon: '☑️' },
    { title: 'Range', category: 'Forms', route: 'forms/range', desc: 'Custom range slider inputs with styled tracks and thumbs.', keywords: 'slider range input volume track value progress', icon: '🎚️' },
    { title: 'Input group', category: 'Forms', route: 'forms/input-group', desc: 'Extend form controls by adding text, buttons, or button groups on either side.', keywords: 'addon input prefix suffix addon prepend append icon', icon: '🔗' },
    { title: 'Floating labels', category: 'Forms', route: 'forms/floating-labels', desc: 'Beautiful Material-inspired floating labels over inputs and textareas.', keywords: 'floating label material animation placeholder transition', icon: '🏷️' },
    { title: 'OTP & PIN input', category: 'Forms', route: 'forms/otp', desc: 'Auto-advancing one-time password and verification PIN input field.', keywords: 'otp pin auth verification 2fa digits code auto-advance', icon: '🔢' },
    { title: 'Dropzone', category: 'Forms', route: 'forms/dropzone', desc: 'Drag and drop file upload zone with file preview cards and progress.', keywords: 'upload drop file drag attachments images dropzone', icon: '📤' },
    { title: 'Pickers (Color & Date)', category: 'Forms', route: 'forms/pickers', desc: 'Modern UI wrapper skins for native color pickers, date, time, and datetime inputs.', keywords: 'picker color date time calendar datetime native colorpicker input-color', icon: '📅' },
    { title: 'Validation', category: 'Forms', route: 'forms/validation', desc: 'Provide valuable, actionable feedback to users with HTML5 form validation.', keywords: 'valid invalid error feedback check required forms', icon: '✅' },

    // Components
    { title: 'Accordion', category: 'Components', route: 'components/accordion', desc: 'Vertically collapsing accordions built with CSS and vanilla JS.', keywords: 'collapse fold expand panels faq', icon: '📁' },
    { title: 'Alerts', category: 'Components', route: 'components/alerts', desc: 'Contextual feedback messages for user actions with dismissibility.', keywords: 'notification banner message warning danger success error', icon: '🔔' },
    { title: 'Avatar', category: 'Components', route: 'components/avatar', desc: 'User profile pictures, initials, and icon avatar clusters with status indicators.', keywords: 'user image profile picture photo badge group', icon: '👤' },
    { title: 'Badge', category: 'Components', route: 'components/badge', desc: 'Small count and labeling component with solid, soft, outline and pill variants.', keywords: 'chip tag label counter pill notification status', icon: '🏷️' },
    { title: 'Banners', category: 'Components', route: 'components/banner', desc: 'Sticky and floating notification banner components for top-level announcements.', keywords: 'banner announcement bar notice notification top bar alert header sticky floating broadcast', icon: '📢' },
    { title: 'Bottom Sheet', category: 'Components', route: 'components/bottom-sheet', desc: 'Mobile-friendly bottom sheet drawer with swipe gestures and backdrop.', keywords: 'drawer sheet modal mobile slide up touch pan', icon: '📱' },
    { title: 'Breadcrumb', category: 'Components', route: 'components/breadcrumb', desc: 'Indicate the current page location within a navigational hierarchy.', keywords: 'navigation path hierarchy trail history', icon: '🧭' },
    { title: 'Buttons', category: 'Components', route: 'components/buttons', desc: 'Custom button styles for actions in forms, dialogs, and more.', keywords: 'btn primary outline soft gradient ripple press click', icon: '🔘' },
    { title: 'Button group', category: 'Components', route: 'components/button-group', desc: 'Group a series of buttons together on a single line or vertical stack.', keywords: 'btn group toolbar segmented actions join', icon: '🔢' },
    { title: 'Card', category: 'Components', route: 'components/card', desc: 'Flexible, extensible content container with headers, footers, and images.', keywords: 'container box panel tile shadow surface cover', icon: '🃏' },
    { title: 'Carousel', category: 'Components', route: 'components/carousel', desc: 'Slideshow component for cycling through images or elements.', keywords: 'slider gallery slideshow swipe hero rotation', icon: '🎠' },
    { title: 'Chart', category: 'Components', route: 'components/chart', desc: 'Zero-dependency responsive data charts including bar, line, area, donut, pie, polar area, and radar charts powered by HTML5 Canvas and CSS design tokens.', keywords: 'chart canvas data visualization bar line area donut pie polar radar sparkline metrics statistics graph', icon: '📈' },
    { title: 'Chips & Tag Input', category: 'Components', route: 'components/chip', desc: 'Compact interactive elements for tags, multi-select filters, and removable pill inputs.', keywords: 'chip tag pills removable tag input filter badge token keywords labels chips', icon: '🏷️' },
    { title: 'Collapse', category: 'Components', route: 'components/collapse', desc: 'Toggle the visibility of content with smooth CSS accordion animations.', keywords: 'toggle accordion show hide expand transition', icon: '↕️' },
    { title: 'Combobox', category: 'Components', route: 'components/combobox', desc: 'Accessible, searchable autocomplete select component with keyboard navigation.', keywords: 'combobox autocomplete select searchable typeahead search suggestions dropdown filter listbox', icon: '🔍' },
    { title: 'Command Palette', category: 'Components', route: 'components/command-palette', desc: 'Keyboard-driven search modal and spotlight command runner with Ctrl+K.', keywords: 'spotlight raycast search modal kbd shortcuts quick runner', icon: '🔍' },
    { title: 'Context Menu', category: 'Components', route: 'components/context-menu', desc: 'Floating contextual menus triggered on right-click or custom triggers with viewport boundary collision protection.', keywords: 'context menu right click menu flyout popup shortcut cursor menu mouse action', icon: '🖱️' },
    { title: 'Data Table', category: 'Components', route: 'components/data-table', desc: 'Advanced data grids with sortable columns, row selection checkboxes, sticky headers, expandable detail rows, and dense sizing.', keywords: 'data table grid sortable rows columns checkboxes selection sticky header pagination dense', icon: '▦' },
    { title: 'Dropdowns', category: 'Components', route: 'components/dropdowns', desc: 'Contextual menus for displaying lists of links and actions.', keywords: 'menu popup popover select navigation flyout action', icon: '🔽' },
    { title: 'Empty State', category: 'Components', route: 'components/empty-state', desc: 'Visual placeholders for empty lists, search misses, 404 views, and zero-data screens.', keywords: 'empty state zero data placeholder search misses 404 no records illustrations clean slate', icon: '📭' },
    { title: 'Kbd', category: 'Components', route: 'components/kbd', desc: 'Inline keyboard shortcut badge styling with modern keycap aesthetics.', keywords: 'key shortcut keyboard command ctrl cmd alt press', icon: '⌨️' },
    { title: 'Lightbox', category: 'Components', route: 'components/lightbox', desc: 'Zero-dependency fullscreen media and image zoom viewer with gallery cycling.', keywords: 'lightbox image zoom gallery fullscreen preview modal photo viewer overlay cycling media', icon: '🖼️' },
    { title: 'List group', category: 'Components', route: 'components/list-group', desc: 'Flexible component for displaying a series of content in clean lists.', keywords: 'list items group menu selectable active items', icon: '📋' },
    { title: 'Modal', category: 'Components', route: 'components/modal', desc: 'Streamlined dialog prompts with backdrop, animations, and accessible focus trapping.', keywords: 'dialog popup lightbox alert confirm window popup', icon: '🪟' },
    { title: 'Navs & tabs', category: 'Components', route: 'components/navs', desc: 'Navigation tabs, pills, and underlined dynamic tab panes.', keywords: 'tabs navigation pills underline switch panes sections', icon: '📑' },
    { title: 'Navbar', category: 'Components', route: 'components/navbar', desc: 'Responsive navigation header with branding, navigation links, and collapse menu.', keywords: 'header navigation bar menu brand responsive mobile toggle', icon: '🧭' },
    { title: 'Offcanvas', category: 'Components', route: 'components/offcanvas', desc: 'Hidden sidebars for mobile menus, shopping carts, and contextual filters.', keywords: 'drawer sidebar slide flyout overlay panel sheet', icon: '🚪' },
    { title: 'Pagination', category: 'Components', route: 'components/pagination', desc: 'Pagination links to indicate a series of related content across pages.', keywords: 'pages pager previous next numbers navigation links', icon: '📄' },
    { title: 'Placeholders', category: 'Components', route: 'components/placeholder', desc: 'Placeholder loading state indicators for cards and layout blocks.', keywords: 'loading skeleton mock shimmer placeholder wait', icon: '⏳' },
    { title: 'Popovers', category: 'Components', route: 'components/popovers', desc: 'Rich content popover tooltips with titles and dismiss triggers.', keywords: 'tooltip popup hint info balloon hover click flyout', icon: '💬' },
    { title: 'Progress', category: 'Components', route: 'components/progress', desc: 'Custom progress bars with striped, animated, and colored variants.', keywords: 'progress bar percentage loading indicator meter status', icon: '📊' },
    { title: 'Rating', category: 'Components', route: 'components/rating', desc: 'Interactive star rating component with half-star precision and callbacks.', keywords: 'stars review score rating feedback feedback value', icon: '⭐' },
    { title: 'Scrollspy', category: 'Components', route: 'components/scrollspy', desc: 'Automatically update navigation targets based on current scroll position.', keywords: 'scroll spy active track headings section reading', icon: '📜' },
    { title: 'Segmented Control', category: 'Components', route: 'components/segmented-control', desc: 'iOS & macOS style segmented button switcher with smooth indicator sliding.', keywords: 'switch toggle pill segmented buttons choice selector ios', icon: '🎛️' },
    { title: 'Sidebar', category: 'Components', route: 'components/sidebar', desc: 'Persistent and collapsible desktop sidebar navigation with multi-level nested menus and dark themes.', keywords: 'sidebar navigation side nav drawer persistent collapsible menu tree admin dashboard panel', icon: '📑' },
    { title: 'Skeleton loaders', category: 'Components', route: 'components/skeleton', desc: 'Fluid shimmer skeleton screens for modern content preloading.', keywords: 'skeleton loading placeholder shimmer wave wireframe card', icon: '💀' },
    { title: 'Speed Dial', category: 'Components', route: 'components/speed-dial', desc: 'Floating Action Button menu that expands to reveal secondary actions.', keywords: 'speed dial fab floating action button quick actions radial menu expand popup bottom-right', icon: '⚡' },
    { title: 'Spinners', category: 'Components', route: 'components/spinners', desc: 'CSS loading spinners and pulsating dots for async states.', keywords: 'loader spinner loading circle indicator progress rotate', icon: '🔄' },
    { title: 'Splitter', category: 'Components', route: 'components/splitter', desc: 'Resizable dual panes and draggable splitter divider for responsive layouts.', keywords: 'splitter resizable panes draggable split divider horizontal vertical drag ratio layout gutter', icon: '↔️' },
    { title: 'Stepper', category: 'Components', route: 'components/stepper', desc: 'Multi-step process and wizard progress tracker with completed/active states.', keywords: 'wizard steps flow progress checkout onboarding timeline', icon: '🪜' },
    { title: 'Timeline', category: 'Components', route: 'components/timeline', desc: 'Vertical activity timeline for audit trails, milestones, and changelogs.', keywords: 'timeline history activity logs events track milestone', icon: '⏱️' },
    { title: 'Toasts', category: 'Components', route: 'components/toasts', desc: 'Lightweight push notifications with auto-dismiss and stackable container.', keywords: 'toast notification snackbar popup alert message banner', icon: '🍞' },
    { title: 'Tooltips', category: 'Components', route: 'components/tooltips', desc: 'Hover informative tooltips with clean micro-animations.', keywords: 'tooltip hint hover info popup title helper', icon: '💡' },
    { title: 'Tree View', category: 'Components', route: 'components/tree-view', desc: 'Hierarchical file tree and directory navigator with collapsible nodes.', keywords: 'tree folders files directory hierarchy branches explorer', icon: '🌲' },
    { title: 'Ripple effect', category: 'Components', route: 'components/ripple', desc: 'Material design dynamic ink ripple click interaction for buttons and cards.', keywords: 'material ink wave ripple click interaction tap animation', icon: '🌊' },
    { title: 'Native components', category: 'Components', route: 'components/native', desc: 'Native browser dialog, details/summary, and meter elements enhanced by boodoo.', keywords: 'dialog details summary native html5 elements meter', icon: '📦' },
    { title: 'Modern components', category: 'Components', route: 'components/modern-components', desc: 'Modern components for SaaS: Glass Cards, Glow Effects, Floating Action Dock, Bento Grids, Pulse Badges, and Stats.', keywords: 'modern glass glow bento dock action bar stats saas modern-components', icon: '✨' },
    { title: 'Extended components', category: 'Components', route: 'components/extended-components', desc: 'Extended enterprise components: Metric Stat Widgets, Activity Feeds, Mega Menus, Breadcrumb Dropdowns, FAB Docks, Fullscreen Dialogs, and Product Tours.', keywords: 'extended stat metric activity feed mega menu breadcrumb dropdown fab dock fullscreen dialog tour walkthrough', icon: '🚀' },
    { title: 'AI Prompt & Chat', category: 'Components', route: 'components/ai-prompt', desc: 'Modern conversational AI prompt bar with token badges, quick chips, and model switcher.', keywords: 'ai prompt chat llm bot textarea composer generate', icon: '🤖' },
    { title: 'Dock (App Shelf)', category: 'Components', route: 'components/dock', desc: 'macOS & iPadOS style interactive app icon shelf and floating launch dock with magnification.', keywords: 'dock app shelf launcher macos icons float bottom', icon: '🚢' },
    { title: 'KPI Stat Card', category: 'Components', route: 'components/kpi-card', desc: 'Executive dashboard KPI metric card with trends, delta indicators, and sparklines.', keywords: 'kpi stat metric card dashboard analytics trend delta sparkline', icon: '📈' },
    { title: 'Advanced components', category: 'Components', route: 'components/advanced-components', desc: 'Eight advanced UI components introduced in boodoo v1.2.1, including Chat & AI Streaming containers, Filter Bar, Kanban Board, Bento Grid, Transfer List, Audio Player, Color Picker, and Back-to-Top button.', keywords: 'advanced kanban filter bar audio player transfer list back to top chat thread bento grid boodoo components', icon: '🚀' },

    // Helpers
    { title: 'Clearfix', category: 'Helpers', route: 'helpers/clearfix', desc: 'Easily clear floats by adding .clearfix to the parent element.', keywords: 'clearfix clear float floats parent overflow hack fix helper', icon: '🧹' },
    { title: 'Ratio', category: 'Helpers', route: 'helpers/ratio', desc: 'Maintain aspect ratios for embeddable content like iframes, videos, and more.', keywords: 'ratio aspect ratio iframe video responsive 16x9 4x3 1x1 21x9 embed player helper', icon: '📐' },
    { title: 'Visually hidden', category: 'Helpers', route: 'helpers/visually-hidden', desc: 'Hide an element visually while keeping it exposed to screen readers.', keywords: 'a11y screen reader accessibility sr-only visually-hidden skip', icon: '👁️' },
    { title: 'Stretched link', category: 'Helpers', route: 'helpers/stretched-link', desc: 'Make any HTML element clickable by spreading an anchor link.', keywords: 'link click entire card stretch overlay anchor area', icon: '🔗' },
    { title: 'Color & background', category: 'Helpers', route: 'helpers/color-bg', desc: 'Contextual color and background helper classes with high contrast ratios.', keywords: 'colors background bg text primary secondary success danger gradient', icon: '🎨' },
    { title: 'Elevation (Material)', category: 'Helpers', route: 'helpers/elevation', desc: 'Material design inspired 0-24 elevation levels and ambient shadows.', keywords: 'elevation shadow depth material surface 3d z-space', icon: '🏔️' },

    // Utilities
    { title: 'Background utilities', category: 'Utilities', route: 'utilities/background', desc: 'Convey meaning through background colors and gradients.', keywords: 'bg color gradient dark light subtle surface background', icon: '🎨' },
    { title: 'Border utilities', category: 'Utilities', route: 'utilities/borders', desc: 'Control borders, border radii, rounded pills, circles, and colors.', keywords: 'border rounded circle radius stroke pill outline', icon: '🔲' },
    { title: 'Colors', category: 'Utilities', route: 'utilities/colors', desc: 'Color utilities for text and backgrounds using boodoo\'s full palette.', keywords: 'colors text-primary text-secondary text-success text-danger text-warning text-info text-dark text-light palette contrast', icon: '🎨' },
    { title: 'Display', category: 'Utilities', route: 'utilities/display', desc: 'Display utility classes like block, flex, grid, and responsive variants.', keywords: 'display d-none d-inline d-inline-block d-block d-grid d-table d-flex d-inline-flex responsive visibility', icon: '👁️' },
    { title: 'Flexbox utilities', category: 'Utilities', route: 'utilities/flex', desc: 'Quickly manage the layout, alignment, and sizing of flex items.', keywords: 'flexbox row column justify align gap wrap shrink grow', icon: '📐' },
    { title: 'Float', category: 'Utilities', route: 'utilities/float', desc: 'Toggle floats on any element, across any breakpoint.', keywords: 'float float-start float-end float-none clearfix positioning alignment', icon: '⬅️' },
    { title: 'Interactions', category: 'Utilities', route: 'utilities/interactions', desc: 'Utilities to control interaction behavior — how elements respond to touch, pointers, and selection.', keywords: 'interactions user-select pointer-events touch select none text all pe-none pe-auto click touch-action', icon: '👆' },
    { title: 'Opacity', category: 'Utilities', route: 'utilities/opacity', desc: 'Control element opacity with simple utility classes.', keywords: 'opacity opacity-0 opacity-25 opacity-50 opacity-75 opacity-100 transparent semi alpha', icon: '🌓' },
    { title: 'Overflow', category: 'Utilities', route: 'utilities/overflow', desc: 'Configure how content overflows an element\'s box.', keywords: 'overflow overflow-auto overflow-hidden overflow-visible overflow-scroll text clip wrap scrollbar', icon: '📜' },
    { title: 'Position', category: 'Utilities', route: 'utilities/position', desc: 'Use these shorthand utilities to quickly configure the position of an element.', keywords: 'position static relative absolute fixed sticky top bottom start end translate center fixed-top fixed-bottom', icon: '📌' },
    { title: 'Shadow utilities', category: 'Utilities', route: 'utilities/shadows', desc: 'Add or remove shadows to elements with box-shadow utilities.', keywords: 'shadow box-shadow glow depth elevation soft subtle', icon: '🌑' },
    { title: 'Sizing', category: 'Utilities', route: 'utilities/sizing', desc: 'Easily make an element as wide or as tall with our width and height utilities.', keywords: 'sizing width height w-25 w-50 w-75 w-100 w-auto h-25 h-50 h-75 h-100 mw-100 mh-100 vh vw min-width min-height', icon: '📏' },
    { title: 'Spacing utilities', category: 'Utilities', route: 'utilities/spacing', desc: 'Wide range of responsive margin and padding utility classes.', keywords: 'margin padding m- p- mx my px py gap space layout', icon: '↔️' },
    { title: 'Text', category: 'Utilities', route: 'utilities/text', desc: 'Text utilities — alignment, wrapping, transform, decoration, weight, size, and more.', keywords: 'text alignment text-start text-center text-end text-justify wrap nowrap truncate lowercase uppercase capitalize fs fw font-weight decoration italic', icon: '🔤' },
    { title: 'Vertical alignment', category: 'Utilities', route: 'utilities/vertical-alignment', desc: 'Easily change the vertical alignment of inline, inline-block, inline-table, and table cell elements.', keywords: 'vertical align align-baseline align-top align-middle align-bottom align-text-bottom align-text-top baseline', icon: '↕️' },
    { title: 'Z-index', category: 'Utilities', route: 'utilities/z-index', desc: 'Control z-index stacking order with utility classes.', keywords: 'z-index stack layering depth z-0 z-1 z-2 z-3 z-auto z-n1 layers overlay elevate', icon: '📚' },

    // Motion
    { title: 'Animations & Motion', category: 'Motion', route: 'motion/animations', desc: 'Pre-built CSS keyframe animations, fade-ins, slides, pulses, and bounces.', keywords: 'animation keyframe fade slide zoom bounce pulse spin motion', icon: '✨' },
    { title: 'Transitions', category: 'Motion', route: 'motion/transitions', desc: 'Motion tokens and transition utilities for smooth, purposeful UI.', keywords: 'transition transitions timing easing duration delay motion smooth token curve cubic-bezier', icon: '🌊' },

    // About
    { title: 'Overview', category: 'About', route: 'about/overview', desc: 'Learn more about the boodoo design system and the philosophies behind it.', keywords: 'about overview philosophy architecture principles modular lightweight zero dependency design system', icon: 'ℹ️' },
    { title: 'Production readiness', category: 'About', route: 'about/production-readiness', desc: 'Production quality standards, accessibility compliance, compatibility matrix, and enterprise support.', keywords: 'production enterprise stability security wcag compliance checklist audits benchmarks tests quality', icon: '🛡️' },
    { title: 'Design principles', category: 'About', route: 'about/design-principles', desc: 'The principles that guide boodoo\'s design decisions.', keywords: 'principles design decisions philosophy clarity performance consistency elegance ergonomics', icon: '💡' },
    { title: 'Brand assets', category: 'About', route: 'about/brand', desc: 'The official boodoo brand assets — logo lockup, icon, banner, and usage guidelines.', keywords: 'brand logo identity icon mark banner svg vector colors typography guidelines media kit', icon: '💎' },
    { title: 'boodoo vs Bootstrap', category: 'About', route: 'about/vs-bootstrap', desc: 'Comparison of features, bundle size, and design tokens against Bootstrap 5.', keywords: 'vs bootstrap comparison features differences benchmark', icon: '⚖️' },
    { title: 'Migrate from Bootstrap', category: 'About', route: 'about/migrate-from-bootstrap', desc: 'Step-by-step guide to migrate from Bootstrap 4 or 5 to boodoo. Learn class mapping, JavaScript API parity, and bundle size reduction techniques.', keywords: 'migrate migration bootstrap class mapping differences convert upgrade replace bootstrap 4 bootstrap 5', icon: '🔄' },
    { title: 'boodoo vs Foundation', category: 'About', route: 'about/vs-foundation', desc: 'Compare boodoo and Zurb Foundation. See differences in modern CSS architecture, bundle size, zero runtime dependencies, and active maintenance.', keywords: 'vs foundation zurb comparison differences benchmark zero dependencies modern grid flexbox', icon: '⚖️' },
    { title: 'Migrate from Foundation', category: 'About', route: 'about/migrate-from-foundation', desc: 'Step-by-step guide to modernize Foundation 6 websites to boodoo with modern flexbox/grid layout and zero-dependency ES modules.', keywords: 'migrate foundation modernization update upgrade convert foundation 6 to boodoo', icon: '🔄' },
    { title: 'boodoo vs Tailwind', category: 'About', route: 'about/vs-tailwind', desc: 'Comparison between boodoo pre-styled components and Tailwind utility-first CSS.', keywords: 'vs tailwind utility-first components comparison benchmark', icon: '⚡' },
    { title: 'Migrate from Tailwind', category: 'About', route: 'about/migrate-from-tailwind', desc: 'How to migrate from Tailwind CSS to boodoo. Eliminate complex compiler build pipelines and HTML class clutter with clean semantic components and utility classes.', keywords: 'migrate tailwind migration buildless eliminate pipeline html bloat semantic classes', icon: '🔄' },
    { title: 'boodoo vs Material', category: 'About', route: 'about/vs-material', desc: 'Compare boodoo and Material Design (MUI / Material Components). Discover how boodoo provides Material elevation, ripples, and motion without heavy React or JS runtimes.', keywords: 'vs material design mui mdc comparison elevation ripples performance bundle size lightweight', icon: '⚖️' },
    { title: 'Migrate from Material', category: 'About', route: 'about/migrate-from-material', desc: 'Migrate from Google Material Design, MUI, or MDC to boodoo. Keep elevation, ripples, and floating labels without heavy React runtimes.', keywords: 'migrate material mui design tokens ripples components floating labels', icon: '🔄' },
    { title: 'boodoo vs React Native Paper', category: 'About', route: 'about/vs-react-native-paper', desc: 'Compare boodoo and React Native Paper for mobile and cross-platform UI. Discover why developers choose boodoo for modern, lightweight iOS & Android design without Material Design 3 bloat.', keywords: 'vs react native paper mobile comparison differences benchmarks cross platform flutter expo', icon: '⚖️' },
    { title: 'Migrate from React Native Paper', category: 'About', route: 'about/migrate-from-react-native-paper', desc: 'Step-by-step migration guide from React Native Paper to boodoo. Two-phase migration roadmap, Paper theme skinning, and lightweight native mobile components.', keywords: 'migrate react native paper mobile migration skinning theme tokens adapter', icon: '🔄' },
    { title: 'Changelog', category: 'About', route: 'about/changelog', desc: 'Release history and updates across all boodoo versions.', keywords: 'changelog history versions release updates notes commits', icon: '📜' },
    { title: 'License', category: 'About', route: 'about/license', desc: 'boodoo is released under the MIT License.', keywords: 'license mit open source legal rights permissions commercial use software boodoo', icon: '📜' }
  ];

  // Helper to determine the path prefix to the root directory
  function getRootPrefix() {
    if (window.BOODOO_ROOT_PREFIX) return window.BOODOO_ROOT_PREFIX;
    const path = window.location.pathname.replace(/\\/g, '/');
    if (path.includes('/docs/')) {
      const parts = path.split('/docs/')[1].split('/');
      return '../'.repeat(parts.length);
    }
    return '';
  }

  // Create search modal DOM
  function createSearchModal() {
    let backdrop = document.getElementById('boodooSearchBackdrop');
    if (backdrop) return backdrop;

    backdrop = document.createElement('div');
    backdrop.id = 'boodooSearchBackdrop';
    backdrop.className = 'boodoo-search-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', 'Search boodoo components and documentation');

    backdrop.innerHTML = `
      <div class="boodoo-search-modal">
        <div class="boodoo-search-header">
          <div class="boodoo-search-input-wrap">
            <svg class="boodoo-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              class="boodoo-search-input" 
              id="boodooSearchInput" 
              name="boodooSearchQuery" 
              placeholder="Search components, utilities, guides... (e.g. modal, button, otp)"
              autocomplete="off" 
              spellcheck="false"
              aria-autocomplete="list"
              aria-controls="boodooSearchResults"
            >
            <button type="button" class="boodoo-search-clear d-none" id="boodooSearchClear" aria-label="Clear search query">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <button type="button" class="boodoo-search-close-btn" id="boodooSearchClose" aria-label="Close search">
            <span>Esc</span>
          </button>
        </div>

        <div class="boodoo-search-categories" id="boodooSearchCategories">
          <button type="button" class="boodoo-category-pill active" data-category="All"><span>All</span></button>
          <button type="button" class="boodoo-category-pill" data-category="Components"><span>Components</span></button>
          <button type="button" class="boodoo-category-pill" data-category="Forms"><span>Forms</span></button>
          <button type="button" class="boodoo-category-pill" data-category="Layout"><span>Layout</span></button>
          <button type="button" class="boodoo-category-pill" data-category="Utilities"><span>Utilities</span></button>
          <button type="button" class="boodoo-category-pill" data-category="Getting Started"><span>Guides</span></button>
        </div>

        <ul class="boodoo-search-results" id="boodooSearchResults" role="listbox"></ul>

        <div class="boodoo-search-footer">
          <div class="boodoo-search-footer-hints">
            <span class="d-inline-flex align-items-center gap-1"><kbd>↑</kbd><kbd>↓</kbd> <span>Navigate</span></span>
            <span class="d-inline-flex align-items-center gap-1"><kbd>↵</kbd> <span>Select</span></span>
            <span class="d-inline-flex align-items-center gap-1"><kbd>Esc</kbd> <span>Close</span></span>
          </div>
          <div class="boodoo-search-footer-brand">
            <span class="text-muted">boodoo Component Search</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    return backdrop;
  }

  // Search Engine Controller
  const SearchController = {
    isOpen: false,
    selectedIndex: 0,
    currentCategory: 'All',
    filteredItems: [],

    init() {
      this.backdrop = createSearchModal();
      this.input = document.getElementById('boodooSearchInput');
      this.clearBtn = document.getElementById('boodooSearchClear');
      this.closeBtn = document.getElementById('boodooSearchClose');
      this.resultsContainer = document.getElementById('boodooSearchResults');
      this.categoryBar = document.getElementById('boodooSearchCategories');

      this.bindEvents();
    },

    bindEvents() {
      // Backdrop click to close
      this.backdrop.addEventListener('click', (e) => {
        if (e.target === this.backdrop) this.close();
      });

      // Close button
      this.closeBtn?.addEventListener('click', () => this.close());

      // Clear button
      this.clearBtn?.addEventListener('click', () => {
        this.input.value = '';
        this.clearBtn.style.display = 'none';
        this.input.focus();
        this.filter();
      });

      // Live search input
      this.input.addEventListener('input', (e) => {
        this.clearBtn.style.display = e.target.value.trim() ? 'flex' : 'none';
        this.filter();
      });

      // Category filter pills
      this.categoryBar?.addEventListener('click', (e) => {
        const pill = e.target.closest('.boodoo-category-pill');
        if (!pill) return;
        this.categoryBar.querySelectorAll('.boodoo-category-pill').forEach((btn) => btn.classList.remove('active'));
        pill.classList.add('active');
        this.currentCategory = pill.getAttribute('data-category') || 'All';
        this.filter();
      });

      // Keyboard navigation inside input
      this.input.addEventListener('keydown', (e) => {
        const items = this.resultsContainer.querySelectorAll('.boodoo-search-item');
        if (!items.length) {
          if (e.key === 'Escape') this.close();
          return;
        }

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex + 1) % items.length;
          this.updateSelection(items);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.selectedIndex = (this.selectedIndex - 1 + items.length) % items.length;
          this.updateSelection(items);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const target = items[this.selectedIndex];
          if (target) {
            target.click();
          }
        } else if (e.key === 'Escape') {
          this.close();
        }
      });

      // Global keyboard shortcut: Ctrl+K, Cmd+K, or '/' (when not focused on form input)
      document.addEventListener('keydown', (e) => {
        const isModifier = e.ctrlKey || e.metaKey;
        if (isModifier && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          this.toggle();
          return;
        }

        if (e.key === '/' && !isModifier) {
          const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
          const isEditable = document.activeElement ? document.activeElement.isContentEditable : false;
          if (activeTag !== 'input' && activeTag !== 'textarea' && !isEditable) {
            e.preventDefault();
            this.open();
          }
        }
      });

      // Navbar trigger clicks
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-boodoo-search-trigger]');
        if (trigger) {
          e.preventDefault();
          this.open();
        }
      });
    },

    open() {
      this.isOpen = true;
      this.backdrop.classList.add('show');
      document.body.style.overflow = 'hidden';
      this.input.value = '';
      this.clearBtn.style.display = 'none';
      this.filter('');
      setTimeout(() => {
        this.input.focus();
      }, 60);
    },

    close() {
      this.isOpen = false;
      this.backdrop.classList.remove('show');
      document.body.style.overflow = '';
      if (this.input) this.input.value = '';
    },

    toggle() {
      if (this.isOpen) this.close();
      else this.open();
    },

    filter() {
      const query = (this.input.value || '').toLowerCase().trim();
      const prefix = getRootPrefix();

      // Score and filter catalog
      let results = CATALOG.filter((item) => {
        if (this.currentCategory !== 'All' && item.category !== this.currentCategory) {
          return false;
        }
        if (!query) return true;

        const titleMatch = item.title.toLowerCase().includes(query);
        const descMatch = item.desc.toLowerCase().includes(query);
        const kwMatch = item.keywords.toLowerCase().includes(query);
        const catMatch = item.category.toLowerCase().includes(query);
        return titleMatch || descMatch || kwMatch || catMatch;
      });

      // Priority sort: exact title match > startsWith title > category match
      if (query) {
        results.sort((a, b) => {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          if (aTitle === query) return -1;
          if (bTitle === query) return 1;
          if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1;
          if (!aTitle.startsWith(query) && bTitle.startsWith(query)) return 1;
          return 0;
        });
      }

      this.filteredItems = results;
      this.renderResults(results, query, prefix);
    },

    highlightMatch(text, query) {
      if (!query) return text;
      const regex = new RegExp(`(${query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi');
      return text.replace(regex, '<mark class="boodoo-search-highlight">$1</mark>');
    },

    renderResults(items, query, prefix) {
      if (!items.length) {
        this.resultsContainer.innerHTML = `
          <li class="boodoo-search-empty">
            <div class="boodoo-search-empty-icon">🔍</div>
            <p class="boodoo-search-empty-title">No matching components or docs</p>
            <p class="boodoo-search-empty-text text-muted">Try searching for keywords like "buttons", "modal", "cards", "otp", "grid", or "theme".</p>
          </li>
        `;
        return;
      }

      // Group by category if query is empty or 'All' selected
      const grouped = {};
      items.forEach((item, index) => {
        const cat = item.category;
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push({ item, index });
      });

      let html = '';
      let globalIndex = 0;

      Object.keys(grouped).forEach((cat) => {
        html += `<li class="boodoo-search-group-title"><span>${cat}</span></li>`;
        grouped[cat].forEach(({ item }) => {
          const itemHref = prefix + 'docs/' + item.route + '.html';
          const highlightedTitle = this.highlightMatch(item.title, query);
          const highlightedDesc = this.highlightMatch(item.desc, query);

          html += `
            <li class="boodoo-search-item" data-index="${globalIndex}" data-href="${itemHref}" role="option">
              <div class="boodoo-search-item-icon">
                <span>${item.icon || '📄'}</span>
              </div>
              <div class="boodoo-search-item-info">
                <div class="boodoo-search-item-head">
                  <span class="boodoo-search-item-title">${highlightedTitle}</span>
                  <span class="boodoo-search-badge">${item.category}</span>
                </div>
                <p class="boodoo-search-item-desc">${highlightedDesc}</p>
              </div>
              <div class="boodoo-search-item-arrow">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </li>
          `;
          globalIndex++;
        });
      });

      this.resultsContainer.innerHTML = html;

      // Click event delegation on results
      this.resultsContainer.querySelectorAll('.boodoo-search-item').forEach((el) => {
        el.addEventListener('click', () => {
          const href = el.getAttribute('data-href');
          if (href) {
            window.location.href = href;
          }
          this.close();
        });
      });

      this.selectedIndex = 0;
      const resultElements = this.resultsContainer.querySelectorAll('.boodoo-search-item');
      this.updateSelection(resultElements);
    },

    updateSelection(items) {
      if (!items.length) return;
      items.forEach((el, idx) => {
        const isCurrent = idx === this.selectedIndex;
        el.classList.toggle('active', isCurrent);
        if (isCurrent) {
          el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      });
    }
  };

  // Expose global controller
  window.boodooSearch = SearchController;
  window.openBoodooSearch = function () {
    SearchController.open();
  };

  // Initialize once DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SearchController.init());
  } else {
    SearchController.init();
  }
})();
