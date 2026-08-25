// =====================================================================
// BOODOO JS — Command Palette
// =====================================================================

import { BaseComponent } from './base-component.js';

export class CommandPalette extends BaseComponent {
  static get NAME() {
    return 'commandPalette';
  }


  constructor(element, config = {}) {
    super(element, config);
    this._items = config.items || [];
    this._isOpen = false;
    this._selectedIndex = 0;
    this._buildUI();
    this._bindEvents();
  }

  _buildUI() {
    if (!this._element.querySelector('.command-palette-input')) {
      this._element.classList.add('command-palette-backdrop');
      this._element.innerHTML = `
        <div class="command-palette" role="dialog" aria-modal="true">
          <div class="command-palette-header">
            <span class="text-secondary me-2">🔍</span>
            <input type="text" class="command-palette-input" placeholder="Type a command or search..." autofocus>
          </div>
          <ul class="command-palette-results"></ul>
          <div class="command-palette-footer">
            <span>Navigation: <kbd>↑</kbd> <kbd>↓</kbd> to select</span>
            <span><kbd>Esc</kbd> to close</span>
          </div>
        </div>
      `;
    }

    this._input = this._element.querySelector('.command-palette-input');
    this._results = this._element.querySelector('.command-palette-results');
  }

  _bindEvents() {
    // Backdrop click
    this._element.addEventListener('click', (e) => {
      if (e.target === this._element) {
        this.close();
      }
    });

    // Input filter
    this._input.addEventListener('input', (e) => {
      this._filter(e.target.value);
    });

    // Keyboard navigation
    this._input.addEventListener('keydown', (e) => {
      const items = Array.from(this._results.querySelectorAll('.command-palette-item'));
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this._selectedIndex = (this._selectedIndex + 1) % (items.length || 1);
        this._updateSelection(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this._selectedIndex = (this._selectedIndex - 1 + items.length) % (items.length || 1);
        this._updateSelection(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = items[this._selectedIndex];
        if (selected) {
          selected.click();
        }
      } else if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  _filter(query = '') {
    const q = query.toLowerCase().trim();
    const filtered = this._items.filter((item) => {
      return item.title.toLowerCase().includes(q) || (item.subtitle && item.subtitle.toLowerCase().includes(q));
    });

    this._renderResults(filtered);
    this._selectedIndex = 0;
    const items = Array.from(this._results.querySelectorAll('.command-palette-item'));
    this._updateSelection(items);
  }

  _renderResults(items) {
    if (!items.length) {
      this._results.innerHTML = `<li class="p-3 text-center text-secondary">No results found</li>`;
      return;
    }

    this._results.innerHTML = items.map((item, index) => `
      <li class="command-palette-item" data-index="${index}">
        <div class="command-palette-item-title">
          ${item.icon ? `<span>${item.icon}</span>` : ''}
          <span>${item.title}</span>
        </div>
        ${item.shortcut ? `<span class="command-palette-item-shortcut"><kbd>${item.shortcut}</kbd></span>` : ''}
      </li>
    `).join('');

    this._results.querySelectorAll('.command-palette-item').forEach((el, index) => {
      el.addEventListener('click', () => {
        const item = items[index];
        if (item && item.action) {
          item.action();
        } else if (item && item.href) {
          window.location.href = item.href;
        }
        this.close();
      });
    });
  }

  _updateSelection(items) {
    items.forEach((el, idx) => {
      el.classList.toggle('active', idx === this._selectedIndex);
    });
  }

  open() {
    this._element.classList.add('show');
    this._isOpen = true;
    this._filter('');
    setTimeout(() => {
      if (this._input) this._input.focus();
    }, 50);
  }

  close() {
    this._element.classList.remove('show');
    this._isOpen = false;
    if (this._input) this._input.value = '';
  }

  toggle() {
    if (this._isOpen) this.close();
    else this.open();
  }

  setItems(items) {
    this._items = items;
    if (this._isOpen) this._filter(this._input.value);
  }
}

// Global keyboard shortcut (Ctrl+K or Cmd+K)
if (typeof document !== 'undefined') {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      let modal = document.querySelector('.command-palette-backdrop');
      if (!modal) {
        modal = document.createElement('div');
        document.body.appendChild(modal);
        CommandPalette.getOrCreateInstance(modal, {
          items: [
            { title: 'Home', href: '/', icon: '🏠' },
            { title: 'Documentation', href: '/docs/getting-started/introduction.html', icon: '📚' },
            { title: 'Toggle Dark Mode', action: () => { if (window.boodoo && window.boodoo.theme) window.boodoo.theme.toggle(); }, icon: '🌓' }
          ]
        });
      }
      const instance = CommandPalette.getInstance(modal) || CommandPalette.getOrCreateInstance(modal);
      instance.toggle();
    }
  });
}
