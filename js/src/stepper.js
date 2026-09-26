// =====================================================================
// BOODOO JS — Stepper / Multi-step Wizard
// =====================================================================

import { BaseComponent } from './base-component.js';
import { triggerEvent } from './util.js';

export class Stepper extends BaseComponent {
  static get NAME() {
    return 'stepper';
  }

  static get selector() {
    return '.stepper';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._items = Array.from(this._element.querySelectorAll('.step-item'));
    this._currentStep = 0;
    this._initSteps();
    this._bindEvents();
  }

  _initSteps() {
    const activeIndex = this._items.findIndex((item) => item.classList.contains('active'));
    this._currentStep = activeIndex >= 0 ? activeIndex : 0;
    this._updateUI();
  }

  _bindEvents() {
    this._element.addEventListener('click', (e) => {
      const stepItem = e.target.closest('.step-item');
      if (!stepItem || !this._items.includes(stepItem)) return;

      const targetIndex = this._items.indexOf(stepItem);
      // Allow jumping to previously completed steps or if linear is false
      if (this._config.linear === false || targetIndex <= this._currentStep || stepItem.classList.contains('completed')) {
        this.goTo(targetIndex);
      }
    });
  }

  _updateUI() {
    this._items.forEach((item, index) => {
      item.classList.remove('active');
      if (index < this._currentStep) {
        item.classList.add('completed');
        item.classList.remove('error');
      } else if (index === this._currentStep) {
        item.classList.add('active');
        item.classList.remove('completed');
      } else {
        item.classList.remove('completed');
      }
    });

    // Update associated panels if data-boodoo-stepper-target is configured
    const targetSelector = this._element.getAttribute('data-boodoo-target');
    if (targetSelector) {
      const container = document.querySelector(targetSelector);
      if (container) {
        const panels = Array.from(container.children);
        panels.forEach((panel, idx) => {
          if (idx === this._currentStep) {
            panel.classList.add('active', 'show');
            panel.removeAttribute('hidden');
          } else {
            panel.classList.remove('active', 'show');
            panel.setAttribute('hidden', 'true');
          }
        });
      }
    }
  }

  goTo(stepIndex) {
    if (stepIndex < 0 || stepIndex >= this._items.length) return;
    if (!triggerEvent(this._element, 'boodoo.step.change', { step: stepIndex })) return;
    this._currentStep = stepIndex;
    this._updateUI();
    triggerEvent(this._element, 'boodoo.step.changed', { step: stepIndex });
  }

  next() {
    if (this._currentStep < this._items.length - 1) {
      this.goTo(this._currentStep + 1);
    }
  }

  prev() {
    if (this._currentStep > 0) {
      this.goTo(this._currentStep - 1);
    }
  }

  reset() {
    this._currentStep = 0;
    this._items.forEach((item) => {
      item.classList.remove('completed', 'active', 'error');
    });
    this._updateUI();
  }
}

// Data API
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const nextTrigger = e.target.closest('[data-boodoo-stepper="next"]');
    if (nextTrigger) {
      const targetSelector = nextTrigger.getAttribute('data-boodoo-target');
      const stepperEl = targetSelector ? document.querySelector(targetSelector) : document.querySelector('.stepper');
      if (stepperEl) {
        const instance = Stepper.getOrCreateInstance(stepperEl);
        instance.next();
      }
    }

    const prevTrigger = e.target.closest('[data-boodoo-stepper="prev"]');
    if (prevTrigger) {
      const targetSelector = prevTrigger.getAttribute('data-boodoo-target');
      const stepperEl = targetSelector ? document.querySelector(targetSelector) : document.querySelector('.stepper');
      if (stepperEl) {
        const instance = Stepper.getOrCreateInstance(stepperEl);
        instance.prev();
      }
    }
  });
}

export default Stepper;
