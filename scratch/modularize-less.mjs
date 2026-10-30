import fs from 'fs';
import path from 'path';
import less from 'less';

const rootDir = process.cwd();
const boodooLessPath = path.resolve(rootDir, 'less/boodoo.less');
const rawContent = fs.readFileSync(boodooLessPath, 'utf8');
const lines = rawContent.split('\n');

console.log('Total lines in original less/boodoo.less:', lines.length);

function getSlice(start, end) {
  // start and end are 1-based line numbers inclusive
  return lines.slice(start - 1, end).join('\n').trim();
}

// Prepare directories
const dirs = [
  'less/mixins',
  'less/content',
  'less/forms',
  'less/components'
];

dirs.forEach(d => {
  const p = path.resolve(rootDir, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// Let's create partial definitions
const partials = {};

// 1. Variables
partials['less/_variables.less'] = `// =====================================================================
// BOODOO LESS — Variables & Design Tokens
// =====================================================================

// Base spacer & scaling
@boodoo-spacer: 1rem;

// Brand palette
@boodoo-primary: #7c3aed;
@boodoo-secondary: #5b21e6;
@boodoo-success: #1c9e50;
@boodoo-info: #0ea5e9;
@boodoo-warning: #f59e0b;
@boodoo-danger: #e11d48;
@boodoo-light: #f6f5fb;
@boodoo-dark: #17135f;
@boodoo-black: #000;
@boodoo-white: #fff;
@boodoo-accent: #f43f5e;

// Grays
@boodoo-gray-100: #f7f8fb;
@boodoo-gray-200: #ececf4;
@boodoo-gray-300: #dedfec;
@boodoo-gray-400: #c2c4d8;
@boodoo-gray-500: #8b8fb0;
@boodoo-gray-600: #5c6280;
@boodoo-gray-700: #3f4463;
@boodoo-gray-800: #272c4f;
@boodoo-gray-900: #11143d;

// Typography
@boodoo-font-sans-serif: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
@boodoo-font-serif: Georgia, "Times New Roman", serif;
@boodoo-font-monospace: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
@boodoo-font-family-base: var(--boodoo-font-sans-serif);
@boodoo-font-size-base: 1rem;
@boodoo-line-height-base: 1.5;

// Borders & Radii
@boodoo-border-width: 1px;
@boodoo-border-color: #dfe3ee;
@boodoo-border-radius: 0.5rem;
@boodoo-border-radius-sm: 0.375rem;
@boodoo-border-radius-lg: 0.75rem;
@boodoo-border-radius-pill: 50rem;
`;

// 2. Mixins
partials['less/_mixins.less'] = `// =====================================================================
// BOODOO LESS — Mixins
// =====================================================================

.clearfix() {
  &::after {
    display: block;
    clear: both;
    content: "";
  }
}

.box-shadow(@shadow) {
  box-shadow: @shadow;
}

.transition(@transition) {
  transition: @transition;
}
`;

partials['less/mixins/_utility-api.less'] = `// =====================================================================
// BOODOO LESS — Utility API Mixins
// =====================================================================

// Utility generator helper
.generate-utility(@property, @class-prefix, @value) {
  .@{class-prefix} {
    @{property}: @value;
  }
}
`;

// 3. Root & Dark theme inversion
partials['less/_root.less'] = `// =====================================================================
// BOODOO LESS — Root Variables & Dark Mode Inversion
// =====================================================================

` + getSlice(13, 162);

// 4. Reboot
partials['less/_reboot.less'] = `// =====================================================================
// BOODOO LESS — Reboot & Base Resets
// =====================================================================

` + getSlice(163, 250);

// 5. Grid
partials['less/_grid.less'] = `// =====================================================================
// BOODOO LESS — Mobile-first Grid System
// =====================================================================

` + getSlice(251, 683);

// 6. Content
partials['less/content/_typography.less'] = `// =====================================================================
// BOODOO LESS — Typography
// =====================================================================

// Display headings
.display-1 { font-size: 5rem; font-weight: 300; line-height: 1.2; }
.display-2 { font-size: 4.5rem; font-weight: 300; line-height: 1.2; }
.display-3 { font-size: 4rem; font-weight: 300; line-height: 1.2; }
.display-4 { font-size: 3.5rem; font-weight: 300; line-height: 1.2; }
.display-5 { font-size: 3rem; font-weight: 300; line-height: 1.2; }
.display-6 { font-size: 2.5rem; font-weight: 300; line-height: 1.2; }

// Lead
.lead {
  font-size: 1.25rem;
  font-weight: 300;
}

// Inline text elements
.small {
  font-size: 0.875em;
  font-weight: 400;
}

.mark {
  padding: 0.2em;
  background-color: #fcf8e3;
}

.initialism {
  font-size: 0.875em;
  text-transform: uppercase;
}

// Blockquote
.blockquote {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  border-left: 4px solid var(--boodoo-border-color);
  padding-left: 1rem;

  > :last-child {
    margin-bottom: 0;
  }
}

.blockquote-footer {
  margin-top: -1rem;
  margin-bottom: 1rem;
  font-size: 0.875em;
  color: var(--boodoo-body-secondary-color);

  &::before {
    content: "\\2014\\00A0";
  }
}

// Fluid display
.display-fluid {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 300;
  line-height: 1.2;
}

.text-heading {
  color: var(--boodoo-heading-color, inherit);
}

.list-inline {
  padding-left: 0;
  list-style: none;
}

.list-inline-item {
  display: inline-block;

  &:not(:last-child) {
    margin-right: 0.5rem;
  }
}

.list-unstyled {
  padding-left: 0;
  list-style: none;
}

.dl-horizontal {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.5rem 1rem;

  @media (min-width: 576px) {
    grid-template-columns: 8rem minmax(0, 1fr);
  }
}

.text-hyphenate {
  -webkit-hyphens: auto;
  hyphens: auto;
}

.text-balance {
  text-wrap: balance;
}

.text-pretty {
  text-wrap: pretty;
}

::selection {
  color: var(--boodoo-white, #fff);
  background-color: var(--boodoo-primary, #7c3aed);
}
`;

partials['less/content/_images.less'] = `// =====================================================================
// BOODOO LESS — Images & Thumbnails
// =====================================================================

.img-fluid {
  max-width: 100%;
  height: auto;
}

.img-thumbnail {
  padding: 0.25rem;
  background-color: var(--boodoo-body-bg);
  border: var(--boodoo-border-width) solid var(--boodoo-border-color);
  border-radius: var(--boodoo-border-radius);
  max-width: 100%;
  height: auto;
}

.img-rounded {
  border-radius: var(--boodoo-border-radius-lg);
}

.img-circle {
  border-radius: 50%;
}

.img-blur-up {
  filter: blur(8px);
  transition: filter 0.4s ease;
}

.img-loading {
  background: linear-gradient(90deg, var(--boodoo-gray-200) 25%, var(--boodoo-gray-100) 37%, var(--boodoo-gray-200) 63%);
  background-size: 400% 100%;
  animation: boodoo-shine 1.4s ease infinite;
}
`;

partials['less/content/_figures.less'] = `// =====================================================================
// BOODOO LESS — Figures
// =====================================================================

.figure {
  display: inline-block;
}

.figure-img {
  margin-bottom: 0.5rem;
  line-height: 1;
}

.figure-caption {
  font-size: 0.875em;
  color: var(--boodoo-body-secondary-color);
}
`;

partials['less/content/_tables.less'] = `// =====================================================================
// BOODOO LESS — Tables
// =====================================================================

.table {
  --boodoo-table-bg: transparent;
  --boodoo-table-color: var(--boodoo-body-color);
  --boodoo-table-border-color: var(--boodoo-border-color);
  --boodoo-table-accent-bg: transparent;
  --boodoo-table-striped-color: var(--boodoo-body-color);
  --boodoo-table-striped-bg: rgba(0, 0, 0, 0.04);
  --boodoo-table-active-color: var(--boodoo-body-color);
  --boodoo-table-active-bg: rgba(124, 58, 237, 0.08);
  --boodoo-table-hover-color: var(--boodoo-body-color);
  --boodoo-table-hover-bg: rgba(0, 0, 0, 0.06);

  width: 100%;
  margin-bottom: 1rem;
  color: var(--boodoo-table-color);
  vertical-align: top;
  border-color: var(--boodoo-table-border-color);

  > :not(caption) > * > * {
    padding: 0.75rem 0.75rem;
    background-color: var(--boodoo-table-bg);
    border-bottom-width: var(--boodoo-border-width, 1px);
    box-shadow: inset 0 0 0 9999px var(--boodoo-table-accent-bg);
  }

  > tbody {
    vertical-align: inherit;
  }

  > thead {
    vertical-align: bottom;
  }

  > :not(:first-child) {
    border-top: 2px solid currentcolor;
  }

  th {
    font-weight: 600;
    text-align: inherit;
    text-align: -webkit-match-parent;
  }

  > caption {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    color: var(--boodoo-body-secondary-color);
    text-align: left;
  }
}

.table-striped {
  > tbody > tr:nth-of-type(odd) > * {
    --boodoo-table-accent-bg: var(--boodoo-table-striped-bg);
    color: var(--boodoo-table-striped-color);
  }
}

.table-hover {
  > tbody > tr:hover > * {
    --boodoo-table-accent-bg: var(--boodoo-table-hover-bg);
    color: var(--boodoo-table-hover-color);
  }
}

.table-bordered {
  border: 1px solid var(--boodoo-table-border-color);

  > :not(caption) > * > * {
    border-width: 1px;
  }
}

.table-borderless {
  > :not(caption) > * > * {
    border-bottom-width: 0;
  }
  > :not(:first-child) {
    border-top-width: 0;
  }
}

.table-sm {
  > :not(caption) > * > * {
    padding: 0.25rem 0.25rem;
  }
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
`;

// 7. Forms
partials['less/forms/_control.less'] = `// =====================================================================
// BOODOO LESS — Form Controls
// =====================================================================

` + getSlice(902, 928);

partials['less/forms/_select.less'] = `// =====================================================================
// BOODOO LESS — Form Select
// =====================================================================

` + getSlice(929, 937);

partials['less/forms/_layout.less'] = `// =====================================================================
// BOODOO LESS — Form Layout & Labels
// =====================================================================

` + getSlice(938, 948);

partials['less/forms/_checks.less'] = `// =====================================================================
// BOODOO LESS — Form Checks & Radios
// =====================================================================

` + getSlice(949, 973);

partials['less/forms/_floating-labels.less'] = `// =====================================================================
// BOODOO LESS — Form Floating Labels
// =====================================================================

` + getSlice(974, 1072);

partials['less/forms/_otp.less'] = `// =====================================================================
// BOODOO LESS — Form OTP / PIN Input
// =====================================================================

` + getSlice(1828, 1847);

partials['less/forms/_dropzone.less'] = `// =====================================================================
// BOODOO LESS — Form Dropzone & File Upload
// =====================================================================

` + getSlice(1848, 1861);

partials['less/forms/_pickers.less'] = `// =====================================================================
// BOODOO LESS — Form Pickers (Color & Date Wrappers & Swatches)
// =====================================================================

` + getSlice(2743, 2777) + '\n\n' + getSlice(6605, 6678);

partials['less/forms/_range.less'] = `// =====================================================================
// BOODOO LESS — Range Slider
// =====================================================================

.form-range {
  --boodoo-form-range-thumb-bg: var(--boodoo-primary, #7c3aed);
  --boodoo-form-range-track-bg: var(--boodoo-gray-200, #ececf4);

  width: 100%;
  height: 1.5rem;
  padding: 0;
  background-color: transparent;
  appearance: none;
  -webkit-appearance: none;

  &:focus {
    outline: 0;

    &::-webkit-slider-thumb {
      box-shadow: 0 0 0 1px var(--boodoo-body-bg), 0 0 0 0.25rem rgba(124, 58, 237, 0.25);
    }
    &::-moz-range-thumb {
      box-shadow: 0 0 0 1px var(--boodoo-body-bg), 0 0 0 0.25rem rgba(124, 58, 237, 0.25);
    }
  }

  &::-moz-focus-outer {
    border: 0;
  }

  &::-webkit-slider-thumb {
    width: 1rem;
    height: 1rem;
    margin-top: -0.25rem;
    background-color: var(--boodoo-form-range-thumb-bg);
    border: 0;
    border-radius: 1rem;
    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    appearance: none;
    -webkit-appearance: none;

    &:active {
      background-color: var(--boodoo-secondary, #5b21e6);
    }
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 0.5rem;
    color: transparent;
    cursor: pointer;
    background-color: var(--boodoo-form-range-track-bg);
    border-color: transparent;
    border-radius: 1rem;
  }

  &::-moz-range-thumb {
    width: 1rem;
    height: 1rem;
    background-color: var(--boodoo-form-range-thumb-bg);
    border: 0;
    border-radius: 1rem;
    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    appearance: none;

    &:active {
      background-color: var(--boodoo-secondary, #5b21e6);
    }
  }

  &::-moz-range-track {
    width: 100%;
    height: 0.5rem;
    color: transparent;
    cursor: pointer;
    background-color: var(--boodoo-form-range-track-bg);
    border-color: transparent;
    border-radius: 1rem;
  }

  &:disabled {
    pointer-events: none;

    &::-webkit-slider-thumb {
      background-color: var(--boodoo-gray-500, #8b8fb0);
    }
    &::-moz-range-thumb {
      background-color: var(--boodoo-gray-500, #8b8fb0);
    }
  }
}
`;

partials['less/forms/_range-dual.less'] = `// =====================================================================
// BOODOO LESS — Dual Range Slider
// =====================================================================

.form-range-dual {
  position: relative;
  height: 2rem;
  display: flex;
  align-items: center;

  input[type="range"] {
    position: absolute;
    width: 100%;
    pointer-events: none;
    appearance: none;
    -webkit-appearance: none;
    height: 0;
    outline: none;
    background: transparent;

    &::-webkit-slider-thumb {
      pointer-events: all;
      appearance: none;
      -webkit-appearance: none;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background-color: var(--boodoo-primary);
      border: 2px solid var(--boodoo-white);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      cursor: pointer;
    }

    &::-moz-range-thumb {
      pointer-events: all;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background-color: var(--boodoo-primary);
      border: 2px solid var(--boodoo-white);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      cursor: pointer;
    }
  }
}
`;

partials['less/forms/_input-group.less'] = `// =====================================================================
// BOODOO LESS — Input Group
// =====================================================================

.input-group {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;

  > .form-control,
  > .form-select,
  > .form-floating,
  > .form-control-plaintext {
    position: relative;
    flex: 1 1 auto;
    width: 1%;
    min-width: 0;

    &:focus {
      z-index: 5;
    }
  }

  .btn {
    position: relative;
    z-index: 2;

    &:focus {
      z-index: 5;
    }
  }

  .input-group-text {
    display: flex;
    align-items: center;
    padding: 0.5rem 0.875rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--boodoo-body-color);
    text-align: center;
    white-space: nowrap;
    background-color: var(--boodoo-body-tertiary-bg, #ececf4);
    border: 1px solid var(--boodoo-border-color, #c3c9dc);
    border-radius: var(--boodoo-border-radius, 0.5rem);
  }

  > :not(:first-child):not(.dropdown-menu) {
    margin-left: -1px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  > :not(:last-child):not(.dropdown-toggle) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}
`;

partials['less/forms/_validation.less'] = `// =====================================================================
// BOODOO LESS — Validation States & Feedback
// =====================================================================

.valid-feedback {
  display: none;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: var(--boodoo-success, #1c9e50);
}

.invalid-feedback {
  display: none;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: var(--boodoo-danger, #e11d48);
}

.was-validated :valid ~ .valid-feedback,
.was-validated :valid ~ .valid-tooltip,
.is-valid ~ .valid-feedback,
.is-valid ~ .valid-tooltip {
  display: block;
}

.was-validated :invalid ~ .invalid-feedback,
.was-validated :invalid ~ .invalid-tooltip,
.is-invalid ~ .invalid-feedback,
.is-invalid ~ .invalid-tooltip {
  display: block;
}

.was-validated .form-control:valid,
.form-control.is-valid {
  border-color: var(--boodoo-success, #1c9e50);
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%231c9e50' d='M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);

  &:focus {
    border-color: var(--boodoo-success, #1c9e50);
    box-shadow: 0 0 0 0.25rem rgba(28, 158, 80, 0.25);
  }
}

.was-validated .form-control:invalid,
.form-control.is-invalid {
  border-color: var(--boodoo-danger, #e11d48);
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23e11d48'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23e11d48' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);

  &:focus {
    border-color: var(--boodoo-danger, #e11d48);
    box-shadow: 0 0 0 0.25rem rgba(225, 29, 72, 0.25);
  }
}
`;

// 8. Components
partials['less/components/_buttons.less'] = `// =====================================================================
// BOODOO LESS — Buttons
// =====================================================================

` + getSlice(684, 826) + '\n\n' + getSlice(2127, 2157);

partials['less/components/_button-group.less'] = `// =====================================================================
// BOODOO LESS — Button Group
// =====================================================================

` + getSlice(827, 848);

partials['less/components/_card.less'] = `// =====================================================================
// BOODOO LESS — Card
// =====================================================================

` + getSlice(849, 897);

partials['less/components/_badge.less'] = `// =====================================================================
// BOODOO LESS — Badge & Role Badges
// =====================================================================

` + getSlice(1073, 1097) + '\n\n' + getSlice(6317, 6365);

partials['less/components/_alerts.less'] = `// =====================================================================
// BOODOO LESS — Alerts
// =====================================================================

` + getSlice(1098, 1154);

partials['less/components/_nav.less'] = `// =====================================================================
// BOODOO LESS — Nav
// =====================================================================

` + getSlice(1155, 1176) + '\n\n' + getSlice(6366, 6420);

partials['less/components/_dropdown.less'] = `// =====================================================================
// BOODOO LESS — Dropdown
// =====================================================================

` + getSlice(1177, 1299);

partials['less/components/_progress.less'] = `// =====================================================================
// BOODOO LESS — Progress
// =====================================================================

` + getSlice(1300, 1321);

partials['less/components/_spinners.less'] = `// =====================================================================
// BOODOO LESS — Spinners
// =====================================================================

` + getSlice(1322, 1361);

partials['less/components/_list-group.less'] = `// =====================================================================
// BOODOO LESS — List Group
// =====================================================================

` + getSlice(1362, 1390);

partials['less/components/_close.less'] = `// =====================================================================
// BOODOO LESS — Close Button
// =====================================================================

` + getSlice(1391, 1404);

partials['less/components/_stepper.less'] = `// =====================================================================
// BOODOO LESS — Stepper
// =====================================================================

` + getSlice(1661, 1734);

partials['less/components/_timeline.less'] = `// =====================================================================
// BOODOO LESS — Timeline
// =====================================================================

` + getSlice(1735, 1785);

partials['less/components/_rating.less'] = `// =====================================================================
// BOODOO LESS — Rating
// =====================================================================

` + getSlice(1786, 1800);

partials['less/components/_skeleton.less'] = `// =====================================================================
// BOODOO LESS — Skeleton
// =====================================================================

` + getSlice(1801, 1827);

partials['less/components/_bottom-sheet.less'] = `// =====================================================================
// BOODOO LESS — Bottom Sheet
// =====================================================================

` + getSlice(2158, 2258);

partials['less/components/_segmented-control.less'] = `// =====================================================================
// BOODOO LESS — Segmented Control
// =====================================================================

` + getSlice(2259, 2321);

partials['less/components/_kbd.less'] = `// =====================================================================
// BOODOO LESS — Keyboard Key (Kbd)
// =====================================================================

` + getSlice(2322, 2362);

partials['less/components/_data-table.less'] = `// =====================================================================
// BOODOO LESS — Data Table
// =====================================================================

` + getSlice(2363, 2488);

partials['less/components/_sidebar.less'] = `// =====================================================================
// BOODOO LESS — Sidebar
// =====================================================================

` + getSlice(2489, 2592);

partials['less/components/_context-menu.less'] = `// =====================================================================
// BOODOO LESS — Context Menu
// =====================================================================

` + getSlice(2593, 2639);

partials['less/components/_empty-state.less'] = `// =====================================================================
// BOODOO LESS — Empty State
// =====================================================================

` + getSlice(2640, 2682);

partials['less/components/_chip.less'] = `// =====================================================================
// BOODOO LESS — Chip & Tag Input
// =====================================================================

` + getSlice(2683, 2742);

partials['less/components/_combobox.less'] = `// =====================================================================
// BOODOO LESS — Combobox
// =====================================================================

` + getSlice(2835, 2915);

partials['less/components/_splitter.less'] = `// =====================================================================
// BOODOO LESS — Splitter
// =====================================================================

` + getSlice(2916, 2953);

partials['less/components/_speed-dial.less'] = `// =====================================================================
// BOODOO LESS — Speed Dial
// =====================================================================

` + getSlice(2954, 2995) + '\n\n' + getSlice(5508, 5615);

partials['less/components/_lightbox.less'] = `// =====================================================================
// BOODOO LESS — Lightbox
// =====================================================================

` + getSlice(2996, 3053);

partials['less/components/_command-palette.less'] = `// =====================================================================
// BOODOO LESS — Command Palette
// =====================================================================

` + getSlice(3054, 3192);

partials['less/components/_accordion.less'] = `// =====================================================================
// BOODOO LESS — Accordion
// =====================================================================

` + getSlice(3193, 3314);

partials['less/components/_avatar.less'] = `// =====================================================================
// BOODOO LESS — Avatar
// =====================================================================

` + getSlice(3315, 3492);

partials['less/components/_banner.less'] = `// =====================================================================
// BOODOO LESS — Banner & Announcement Bar
// =====================================================================

` + getSlice(3493, 3691);

partials['less/components/_breadcrumb.less'] = `// =====================================================================
// BOODOO LESS — Breadcrumb
// =====================================================================

` + getSlice(3692, 3752);

partials['less/components/_carousel.less'] = `// =====================================================================
// BOODOO LESS — Carousel
// =====================================================================

` + getSlice(3753, 3956);

partials['less/components/_collapse.less'] = `// =====================================================================
// BOODOO LESS — Collapse
// =====================================================================

` + getSlice(3957, 3986);

partials['less/components/_modal.less'] = `// =====================================================================
// BOODOO LESS — Modal
// =====================================================================

` + getSlice(3987, 4329);

partials['less/components/_navbar.less'] = `// =====================================================================
// BOODOO LESS — Navbar
// =====================================================================

` + getSlice(4330, 4942) + '\n\n' + getSlice(8805, 8847);

partials['less/components/_offcanvas.less'] = `// =====================================================================
// BOODOO LESS — Offcanvas
// =====================================================================

` + getSlice(4943, 5060);

partials['less/components/_pagination.less'] = `// =====================================================================
// BOODOO LESS — Pagination
// =====================================================================

` + getSlice(5061, 5158);

partials['less/components/_placeholder.less'] = `// =====================================================================
// BOODOO LESS — Placeholder
// =====================================================================

` + getSlice(5159, 5240);

partials['less/components/_popover.less'] = `// =====================================================================
// BOODOO LESS — Popover
// =====================================================================

` + getSlice(5241, 5479);

partials['less/components/_ripple.less'] = `// =====================================================================
// BOODOO LESS — Ripple Effect
// =====================================================================

` + getSlice(5480, 5507);

partials['less/components/_toasts.less'] = `// =====================================================================
// BOODOO LESS — Toasts
// =====================================================================

` + getSlice(5616, 5838);

partials['less/components/_tooltip.less'] = `// =====================================================================
// BOODOO LESS — Tooltip
// =====================================================================

` + getSlice(5839, 5985);

partials['less/components/_tree-view.less'] = `// =====================================================================
// BOODOO LESS — Tree View
// =====================================================================

` + getSlice(5986, 6061);

partials['less/components/_dock.less'] = `// =====================================================================
// BOODOO LESS — App Dock / Shelf
// =====================================================================

` + getSlice(6062, 6134);

partials['less/components/_kpi-card.less'] = `// =====================================================================
// BOODOO LESS — KPI Card
// =====================================================================

` + getSlice(6135, 6226);

partials['less/components/_ai-prompt.less'] = `// =====================================================================
// BOODOO LESS — AI Prompt & Chat Input
// =====================================================================

` + getSlice(6227, 6312);

partials['less/components/_native.less'] = `// =====================================================================
// BOODOO LESS — Native Platform Component Styles
// =====================================================================

` + getSlice(6679, 7865);

partials['less/components/_modern-components.less'] = `// =====================================================================
// BOODOO LESS — Modern Components
// =====================================================================

` + getSlice(7866, 8271);

partials['less/components/_extended-components.less'] = `// =====================================================================
// BOODOO LESS — Extended Components Suite
// =====================================================================

` + getSlice(8272, 8804);

partials['less/components/_advanced-components.less'] = `// =====================================================================
// BOODOO LESS — Advanced Components
// =====================================================================

` + getSlice(8848, 9575);

partials['less/components/_chart.less'] = `// =====================================================================
// BOODOO LESS — Chart Component
// =====================================================================

` + getSlice(9576, 9685);

// 9. Helpers & Utilities
partials['less/_helpers.less'] = `// =====================================================================
// BOODOO LESS — Layout Helpers, App Shell, & Chrome
// =====================================================================

` + getSlice(2778, 2834) + '\n\n' + getSlice(6421, 6604);

partials['less/_utilities.less'] = `// =====================================================================
// BOODOO LESS — Layout Utilities & Hover Helpers
// =====================================================================

` + getSlice(1405, 1626) + '\n\n' + getSlice(1999, 2126);

// 10. Animations
partials['less/_animations.less'] = `// =====================================================================
// BOODOO LESS — Motion & Keyframe Animations
// =====================================================================

` + getSlice(1627, 1660) + '\n\n' + getSlice(1862, 1998);

// 11. Subpath Standalone Builds
partials['less/boodoo-grid.less'] = `// =====================================================================
// BOODOO — Grid-only build (containers, rows, columns, gutters, CSS grid)
// =====================================================================

@import "_variables";
@import "_mixins";
@import "mixins/_utility-api";
@import "_grid";
`;

partials['less/boodoo-reboot.less'] = `// =====================================================================
// BOODOO — Reboot-only build (normalize + base styles)
// =====================================================================

@import "_variables";
@import "_mixins";
@import "mixins/_utility-api";
@import "_root";
@import "_reboot";
`;

partials['less/boodoo-utilities.less'] = `// =====================================================================
// BOODOO — Utilities-only build (Tailwind-style utility classes)
// =====================================================================

@import "_variables";
@import "_mixins";
@import "mixins/_utility-api";
@import "_utilities";
`;

partials['less/boodoo-animations.less'] = `// =====================================================================
// BOODOO — Animations-only build
// =====================================================================

@import "_variables";
@import "_mixins";
@import "mixins/_utility-api";
@import "_animations";
`;

// 12. Master boodoo.less
const masterImports = `// =====================================================================
// BOODOO — modular, mobile-first CSS design framework
// Inspired by Bootstrap, Foundation, Tailwind CSS & Material Design.
//
// Full build. Import individual partials for leaner builds.
// =====================================================================

// 1. Configuration
@import "_variables";
@import "_mixins";
@import "mixins/_utility-api";

// 2. Core
@import "_root";
@import "_reboot";

// 3. Layout
@import "_grid";

// 4. Content
@import "content/_typography";
@import "content/_images";
@import "content/_tables";
@import "content/_figures";

// 5. Forms
@import "forms/_layout";
@import "forms/_control";
@import "forms/_select";
@import "forms/_checks";
@import "forms/_range";
@import "forms/_range-dual";
@import "forms/_input-group";
@import "forms/_floating-labels";
@import "forms/_otp";
@import "forms/_dropzone";
@import "forms/_pickers";
@import "forms/_validation";

// 6. Components
@import "components/_accordion";
@import "components/_alerts";
@import "components/_avatar";
@import "components/_badge";
@import "components/_banner";
@import "components/_bottom-sheet";
@import "components/_breadcrumb";
@import "components/_button-group";
@import "components/_buttons";
@import "components/_card";
@import "components/_carousel";
@import "components/_chip";
@import "components/_close";
@import "components/_collapse";
@import "components/_combobox";
@import "components/_command-palette";
@import "components/_context-menu";
@import "components/_data-table";
@import "components/_dropdown";
@import "components/_empty-state";
@import "components/_kbd";
@import "components/_lightbox";
@import "components/_list-group";
@import "components/_modal";
@import "components/_nav";
@import "components/_navbar";
@import "components/_offcanvas";
@import "components/_pagination";
@import "components/_placeholder";
@import "components/_popover";
@import "components/_progress";
@import "components/_rating";
@import "components/_ripple";
@import "components/_segmented-control";
@import "components/_sidebar";
@import "components/_skeleton";
@import "components/_speed-dial";
@import "components/_spinners";
@import "components/_splitter";
@import "components/_stepper";
@import "components/_timeline";
@import "components/_toasts";
@import "components/_tooltip";
@import "components/_tree-view";
@import "components/_dock";
@import "components/_kpi-card";
@import "components/_chart";
@import "components/_ai-prompt";
@import "components/_native";
@import "components/_modern-components";
@import "components/_extended-components";
@import "components/_advanced-components";

// 7. Helpers & utilities
@import "_helpers";
@import "_utilities";

// 8. Motion
@import "_animations";
`;

partials['less/boodoo.less'] = masterImports;

console.log('Total files to create/write:', Object.keys(partials).length);

// Write all files
for (const [relPath, content] of Object.entries(partials)) {
  const fullPath = path.resolve(rootDir, relPath);
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log('Wrote:', relPath);
}

console.log('All partials written! Now testing compilation with Less...');

