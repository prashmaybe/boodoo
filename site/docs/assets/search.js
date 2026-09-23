// boodoo Sitewide Component & Documentation Search
// Fast, client-side, keyboard-accessible spotlight search for components, utilities, and guides.

(function () {
  'use strict';

  // Comprehensive catalog of design components, forms, layout, utilities, and guides
  const CATALOG = [
    // Components
    { title: 'Accordion', category: 'Components', route: 'components/accordion', desc: 'Vertically collapsing accordions built with CSS and vanilla JS.', keywords: 'collapse fold expand panels faq', icon: '📁' },
    { title: 'Alerts', category: 'Components', route: 'components/alerts', desc: 'Contextual feedback messages for user actions with dismissibility.', keywords: 'notification banner message warning danger success error', icon: '🔔' },
    { title: 'Avatar', category: 'Components', route: 'components/avatar', desc: 'User profile pictures, initials, and icon avatar clusters with status indicators.', keywords: 'user image profile picture photo badge group', icon: '👤' },
    { title: 'Badge', category: 'Components', route: 'components/badge', desc: 'Small count and labeling component with solid, soft, outline and pill variants.', keywords: 'chip tag label counter pill notification status', icon: '🏷️' },
    { title: 'Bottom Sheet', category: 'Components', route: 'components/bottom-sheet', desc: 'Mobile-friendly bottom sheet drawer with swipe gestures and backdrop.', keywords: 'drawer sheet modal mobile slide up touch pan', icon: '📱' },
    { title: 'Breadcrumb', category: 'Components', route: 'components/breadcrumb', desc: 'Indicate the current page location within a navigational hierarchy.', keywords: 'navigation path hierarchy trail history', icon: '🧭' },
    { title: 'Buttons', category: 'Components', route: 'components/buttons', desc: 'Custom button styles for actions in forms, dialogs, and more.', keywords: 'btn primary outline soft gradient ripple press click', icon: '🔘' },
    { title: 'Button group', category: 'Components', route: 'components/button-group', desc: 'Group a series of buttons together on a single line or vertical stack.', keywords: 'btn group toolbar segmented actions join', icon: '🔢' },
    { title: 'Card', category: 'Components', route: 'components/card', desc: 'Flexible, extensible content container with headers, footers, and images.', keywords: 'container box panel tile shadow surface cover', icon: '🃏' },
    { title: 'Carousel', category: 'Components', route: 'components/carousel', desc: 'Slideshow component for cycling through images or elements.', keywords: 'slider gallery slideshow swipe hero rotation', icon: '🎠' },
    { title: 'Collapse', category: 'Components', route: 'components/collapse', desc: 'Toggle the visibility of content with smooth CSS accordion animations.', keywords: 'toggle accordion show hide expand transition', icon: '↕️' },
    { title: 'Command Palette', category: 'Components', route: 'components/command-palette', desc: 'Keyboard-driven search modal and spotlight command runner with Ctrl+K.', keywords: 'spotlight raycast search modal kbd shortcuts quick runner', icon: '🔍' },
    { title: 'Dropdowns', category: 'Components', route: 'components/dropdowns', desc: 'Contextual menus for displaying lists of links and actions.', keywords: 'menu popup popover select navigation flyout action', icon: '🔽' },
    { title: 'Kbd', category: 'Components', route: 'components/kbd', desc: 'Inline keyboard shortcut badge styling with modern keycap aesthetics.', keywords: 'key shortcut keyboard command ctrl cmd alt press', icon: '⌨️' },
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
    { title: 'Ripple effect', category: 'Components', route: 'components/ripple', desc: 'Material design dynamic ink ripple click interaction for buttons and cards.', keywords: 'material ink wave ripple click interaction tap animation', icon: '🌊' },
    { title: 'Scrollspy', category: 'Components', route: 'components/scrollspy', desc: 'Automatically update navigation targets based on current scroll position.', keywords: 'scroll spy active track headings section reading', icon: '📜' },
    { title: 'Segmented Control', category: 'Components', route: 'components/segmented-control', desc: 'iOS & macOS style segmented button switcher with smooth indicator sliding.', keywords: 'switch toggle pill segmented buttons choice selector ios', icon: '🎛️' },
    { title: 'Skeleton loaders', category: 'Components', route: 'components/skeleton', desc: 'Fluid shimmer skeleton screens for modern content preloading.', keywords: 'skeleton loading placeholder shimmer wave wireframe card', icon: '💀' },
    { title: 'Spinners', category: 'Components', route: 'components/spinners', desc: 'CSS loading spinners and pulsating dots for async states.', keywords: 'loader spinner loading circle indicator progress rotate', icon: '🔄' },
    { title: 'Stepper', category: 'Components', route: 'components/stepper', desc: 'Multi-step process and wizard progress tracker with completed/active states.', keywords: 'wizard steps flow progress checkout onboarding timeline', icon: '🪜' },
    { title: 'Timeline', category: 'Components', route: 'components/timeline', desc: 'Vertical activity timeline for audit trails, milestones, and changelogs.', keywords: 'timeline history activity logs events track milestone', icon: '⏱️' },
    { title: 'Toasts', category: 'Components', route: 'components/toasts', desc: 'Lightweight push notifications with auto-dismiss and stackable container.', keywords: 'toast notification snackbar popup alert message banner', icon: '🍞' },
    { title: 'Tooltips', category: 'Components', route: 'components/tooltips', desc: 'Hover informative tooltips with clean micro-animations.', keywords: 'tooltip hint hover info popup title helper', icon: '💡' },
    { title: 'Tree View', category: 'Components', route: 'components/tree-view', desc: 'Hierarchical file tree and directory navigator with collapsible nodes.', keywords: 'tree folders files directory hierarchy branches explorer', icon: '🌲' },
    { title: 'Native components', category: 'Components', route: 'components/native', desc: 'Native browser dialog, details/summary, and meter elements enhanced by boodoo.', keywords: 'dialog details summary native html5 elements meter', icon: '📦' },

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
    { title: 'Validation', category: 'Forms', route: 'forms/validation', desc: 'Provide valuable, actionable feedback to users with HTML5 form validation.', keywords: 'valid invalid error feedback check required forms', icon: '✅' },

    // Layout
    { title: 'Containers', category: 'Layout', route: 'layout/containers', desc: 'Containers are the fundamental building block that contain and pad content.', keywords: 'container fluid responsive wrapper layout width max-width', icon: '📐' },
    { title: 'Grid system', category: 'Layout', route: 'layout/grid', desc: 'Mobile-first 12-column flexbox grid system with auto-layout and breakpoints.', keywords: 'grid columns rows 12-col responsive flexbox layout', icon: '▦' },
    { title: 'Columns', category: 'Layout', route: 'layout/columns', desc: 'Column alignment, ordering, offsetting, and wrapping rules.', keywords: 'col column offset order align wrap flex', icon: '🏛️' },
    { title: 'Gutters', category: 'Layout', route: 'layout/gutters', desc: 'Gutters are the padding between columns used to responsively space content.', keywords: 'gx gy gap space gutters padding spacing column gap', icon: '↔️' },
    { title: 'CSS Grid', category: 'Layout', route: 'layout/css-grid', desc: 'Native CSS Grid layout classes for powerful two-dimensional grid layouts.', keywords: 'css grid template rows columns area auto-fill auto-fit', icon: '🍱' },
    { title: 'Breakpoints', category: 'Layout', route: 'layout/breakpoints', desc: 'Responsive breakpoints for building mobile, tablet, and desktop layouts.', keywords: 'sm md lg xl xxl media queries responsive viewport width', icon: '📏' },

    // Content & Typography
    { title: 'Typography', category: 'Content', route: 'content/typography', desc: 'Headings, display headings, body copy, lead text, blockquotes, and lists.', keywords: 'font heading text lead paragraph display copy type font-size', icon: '🔤' },
    { title: 'Images', category: 'Content', route: 'content/images', desc: 'Responsive images, image thumbnails, and rounded picture helpers.', keywords: 'img picture responsive thumbnail rounded fluid cover', icon: '🖼️' },
    { title: 'Tables', category: 'Content', route: 'content/tables', desc: 'Customizable data tables with striped rows, hoverable rows, borders, and dark mode.', keywords: 'table data grid rows columns striped border hover compact', icon: '📊' },
    { title: 'Figures', category: 'Content', route: 'content/figures', desc: 'Display related images and text with the figure and figcaption elements.', keywords: 'figure caption image illustration label quote', icon: '🖼️' },

    // Helpers & Utilities
    { title: 'Color & background', category: 'Helpers', route: 'helpers/color-bg', desc: 'Contextual color and background helper classes with high contrast ratios.', keywords: 'colors background bg text primary secondary success danger gradient', icon: '🎨' },
    { title: 'Elevation (Material)', category: 'Helpers', route: 'helpers/elevation', desc: 'Material design inspired 0-24 elevation levels and ambient shadows.', keywords: 'elevation shadow depth material surface 3d z-space', icon: '🏔️' },
    { title: 'Visually hidden', category: 'Helpers', route: 'helpers/visually-hidden', desc: 'Hide an element visually while keeping it exposed to screen readers.', keywords: 'a11y screen reader accessibility sr-only visually-hidden skip', icon: '👁️' },
    { title: 'Stretched link', category: 'Helpers', route: 'helpers/stretched-link', desc: 'Make any HTML element clickable by spreading an anchor link.', keywords: 'link click entire card stretch overlay anchor area', icon: '🔗' },
    { title: 'Background utilities', category: 'Utilities', route: 'utilities/background', desc: 'Convey meaning through background colors and gradients.', keywords: 'bg color gradient dark light subtle surface background', icon: '🎨' },
    { title: 'Border utilities', category: 'Utilities', route: 'utilities/borders', desc: 'Control borders, border radii, rounded pills, circles, and colors.', keywords: 'border rounded circle radius stroke pill outline', icon: '🔲' },
    { title: 'Flexbox utilities', category: 'Utilities', route: 'utilities/flex', desc: 'Quickly manage the layout, alignment, and sizing of flex items.', keywords: 'flexbox row column justify align gap wrap shrink grow', icon: '📐' },
    { title: 'Shadow utilities', category: 'Utilities', route: 'utilities/shadows', desc: 'Add or remove shadows to elements with box-shadow utilities.', keywords: 'shadow box-shadow glow depth elevation soft subtle', icon: '🌑' },
    { title: 'Spacing utilities', category: 'Utilities', route: 'utilities/spacing', desc: 'Wide range of responsive margin and padding utility classes.', keywords: 'margin padding m- p- mx my px py gap space layout', icon: '↔️' },
    { title: 'Animations & Motion', category: 'Motion', route: 'motion/animations', desc: 'Pre-built CSS keyframe animations, fade-ins, slides, pulses, and bounces.', keywords: 'animation keyframe fade slide zoom bounce pulse spin motion', icon: '✨' },

    // Getting Started & About
    { title: 'Introduction', category: 'Getting Started', route: 'getting-started/introduction', desc: 'Get started with boodoo — architecture, philosophy, and quick overview.', keywords: 'intro overview guide docs setup start getting started', icon: '🚀' },
    { title: 'Download & Releases', category: 'Getting Started', route: 'getting-started/download', desc: 'Download compiled CSS, JavaScript, and source Sass/Less files.', keywords: 'download zip dist release source files install', icon: '📥' },
    { title: 'Examples & Starters', category: 'Getting Started', route: 'getting-started/examples', desc: 'Official starter templates, dashboards, full pages, React and Vue starter kits.', keywords: 'examples templates starter react vue nextjs dashboard pricing checkout showcase', icon: '🎨' },
    { title: 'Usage & CDN', category: 'Getting Started', route: 'getting-started/usage', desc: 'Include boodoo with high-speed CDN links via jsDelivr.', keywords: 'cdn link script css js head include unpkg jsdelivr', icon: '🌐' },
    { title: 'Install via npm', category: 'Getting Started', route: 'getting-started/npm', desc: 'Install boodoo into Node, Vite, Webpack, or Next.js with npm, pnpm or yarn.', keywords: 'npm package install pnpm yarn bundler node modules vite', icon: '📦' },
    { title: 'Customize with Sass', category: 'Getting Started', route: 'getting-started/sass', desc: 'Customize variables, maps, and color palettes using Sass / SCSS.', keywords: 'sass scss variables customize compile override theme', icon: '💅' },
    { title: 'Dark Mode & Themes', category: 'Getting Started', route: 'getting-started/theme', desc: 'Built-in light/dark theme switching with data-boodoo-theme and JS API.', keywords: 'dark mode light theme toggle color-scheme palette switch', icon: '🌓' },
    { title: 'Custom Elements', category: 'Getting Started', route: 'getting-started/custom-elements', desc: 'HTML Web Components: <boodoo-rating>, <boodoo-otp>, and <boodoo-tree>.', keywords: 'web components custom elements tag autonomous shadow dom', icon: '🧩' },
    { title: 'boodoo vs Bootstrap', category: 'About', route: 'about/vs-bootstrap', desc: 'Comparison of features, bundle size, and design tokens against Bootstrap 5.', keywords: 'vs bootstrap comparison features differences benchmark', icon: '⚖️' },
    { title: 'boodoo vs Tailwind', category: 'About', route: 'about/vs-tailwind', desc: 'Comparison between boodoo pre-styled components and Tailwind utility-first CSS.', keywords: 'vs tailwind utility-first components comparison benchmark', icon: '⚡' },
    { title: 'Changelog', category: 'About', route: 'about/changelog', desc: 'Release history and updates across all boodoo versions.', keywords: 'changelog history versions release updates notes commits', icon: '📜' }
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
            <button type="button" class="boodoo-search-clear" id="boodooSearchClear" aria-label="Clear search query" style="display: none;">
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
