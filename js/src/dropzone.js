// =====================================================================
// BOODOO — Dropzone
// Drag-and-drop file upload with live previews, validation, and file removal.
// =====================================================================

import { BaseComponent, initDataApi } from './base-component.js';
import { triggerEvent } from './util.js';

export class Dropzone extends BaseComponent {
  static get NAME() { return 'dropzone'; }

  static get selector() { return '[data-boodoo-dropzone], .dropzone, .form-dropzone'; }

  constructor(element, config = {}) {
    super(element, config);

    this._input = this._element.querySelector('input[type="file"]');
    if (!this._input) {
      // Create hidden file input if missing
      this._input = document.createElement('input');
      this._input.type = 'file';
      this._input.name = this._config.name || 'files';
      if (this._config.multiple !== false) this._input.multiple = true;
      if (this._config.accept) this._input.accept = this._config.accept;
      this._element.appendChild(this._input);
    }

    const listSelector = this._element.getAttribute('data-boodoo-target-list') || this._config.listTarget;
    this._listContainer = listSelector ? document.querySelector(listSelector) : this._element.parentElement.querySelector('.file-list');

    this._maxSize = Number(this._element.getAttribute('data-boodoo-max-size') || this._config.maxSize || 0); // In MB, 0 = unlimited
    this._files = [];

    this._bindEvents();
  }

  _bindEvents() {
    ['dragenter', 'dragover'].forEach(name => {
      this._element.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._element.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      this._element.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._element.classList.remove('dragover');
      });
    });

    this._element.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length) {
        this.addFiles(dt.files);
      }
    });

    this._input.addEventListener('change', () => {
      if (this._input.files && this._input.files.length) {
        this.addFiles(this._input.files);
      }
    });
  }

  addFiles(fileList) {
    const added = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      // Validate size
      if (this._maxSize > 0 && file.size > this._maxSize * 1024 * 1024) {
        triggerEvent(this._element, 'boodoo.dropzone.error', {
          file,
          message: `File exceeds maximum size of ${this._maxSize} MB.`
        });
        continue;
      }

      this._files.push(file);
      added.push(file);
      this._renderFileItem(file);
    }

    triggerEvent(this._element, 'boodoo.dropzone.change', {
      files: this._files,
      added
    });
  }

  _formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  _renderFileItem(file) {
    if (!this._listContainer) return;

    const li = document.createElement('li');
    li.className = 'file-item';

    const isImage = file.type && file.type.startsWith('image/');
    let previewEl;

    if (isImage) {
      const url = URL.createObjectURL(file);
      li.dataset.previewUrl = url;
      previewEl = document.createElement('img');
      previewEl.src = url;
      previewEl.className = 'file-item-preview';
      previewEl.alt = file.name;
    } else {
      previewEl = document.createElement('span');
      previewEl.className = 'file-item-icon';
      previewEl.textContent = '📄';
    }

    const infoDiv = document.createElement('div');
    infoDiv.className = 'file-item-info';

    const nameP = document.createElement('p');
    nameP.className = 'file-item-name m-0';
    const nameSpan = document.createElement('span');
    nameSpan.textContent = file.name;
    nameP.appendChild(nameSpan);

    const metaSpan = document.createElement('span');
    metaSpan.className = 'file-item-meta';
    metaSpan.textContent = this._formatSize(file.size);

    infoDiv.appendChild(nameP);
    infoDiv.appendChild(metaSpan);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'file-item-actions';
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-close';
    removeBtn.setAttribute('aria-label', 'Remove file');
    actionsDiv.appendChild(removeBtn);

    li.appendChild(previewEl);
    li.appendChild(infoDiv);
    li.appendChild(actionsDiv);

    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.removeFile(file, li);
    });

    this._listContainer.appendChild(li);
  }

  removeFile(file, elementNode) {
    const idx = this._files.indexOf(file);
    if (idx > -1) {
      this._files.splice(idx, 1);
    }
    if (elementNode) {
      if (elementNode.dataset && elementNode.dataset.previewUrl) {
        URL.revokeObjectURL(elementNode.dataset.previewUrl);
      }
      if (elementNode.parentNode) {
        elementNode.parentNode.removeChild(elementNode);
      }
    }
    triggerEvent(this._element, 'boodoo.dropzone.remove', {
      file,
      remaining: this._files
    });
  }

  getFiles() {
    return this._files;
  }

  clear() {
    if (this._listContainer) {
      this._listContainer.querySelectorAll('.file-item').forEach((li) => {
        if (li.dataset && li.dataset.previewUrl) {
          URL.revokeObjectURL(li.dataset.previewUrl);
        }
      });
      this._listContainer.innerHTML = '';
    }
    this._files = [];
    if (this._input) this._input.value = '';
  }
}

// Data API auto-init
initDataApi(Dropzone, '[data-boodoo-dropzone]');

export default Dropzone;
