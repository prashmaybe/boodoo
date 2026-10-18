// =====================================================================
// BOODOO JS — Tour / Walkthrough Guide Component
// Step-by-step interactive onboarding tours with highlighting & anchors.
// =====================================================================

import { BaseComponent } from './base-component.js';
import { triggerEvent } from './util.js';

export class Tour extends BaseComponent {
  static get NAME() {
    return 'tour';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._steps = config.steps || [];
    this._currentStepIndex = 0;
    this._popoverEl = null;
    this._onKeyDown = this._onKeyDown.bind(this);

    if (config.steps && config.autoStart) {
      this.start();
    }
  }

  setSteps(steps) {
    this._steps = steps || [];
  }

  start() {
    if (!this._steps.length) return;
    this._currentStepIndex = 0;
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', this._onKeyDown);
      this._renderStep();
    }
  }

  _renderStep() {
    if (typeof document === 'undefined') return;
    const step = this._steps[this._currentStepIndex];
    if (!step) {
      this.end();
      return;
    }

    if (!this._popoverEl) {
      this._popoverEl = document.createElement('div');
      this._popoverEl.className = 'tour-popover';
      this._popoverEl.setAttribute('role', 'dialog');
      this._popoverEl.setAttribute('aria-modal', 'false');
      if (document.body) {
        document.body.appendChild(this._popoverEl);
      }
    }

    // Safe DOM Construction (DOM XSS Prevention Rule)
    this._popoverEl.replaceChildren();

    const badge = document.createElement('span');
    badge.className = 'tour-step-badge';
    badge.textContent = `Step ${this._currentStepIndex + 1} of ${this._steps.length}`;
    this._popoverEl.appendChild(badge);

    const titleEl = document.createElement('h4');
    titleEl.className = 'tour-title';
    titleEl.textContent = step.title || '';
    this._popoverEl.appendChild(titleEl);

    const contentEl = document.createElement('p');
    contentEl.className = 'tour-content';
    contentEl.textContent = step.content || '';
    this._popoverEl.appendChild(contentEl);

    const actionsEl = document.createElement('div');
    actionsEl.className = 'tour-actions';

    // Dots indicator
    const dotsEl = document.createElement('div');
    dotsEl.className = 'tour-dots';
    for (let i = 0; i < this._steps.length; i++) {
      const dot = document.createElement('span');
      dot.className = `tour-dot ${i === this._currentStepIndex ? 'active' : ''}`;
      dotsEl.appendChild(dot);
    }
    actionsEl.appendChild(dotsEl);

    // Buttons
    const buttonsEl = document.createElement('div');
    buttonsEl.className = 'tour-buttons';

    if (this._currentStepIndex > 0) {
      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'btn btn-sm btn-outline-secondary';
      prevBtn.textContent = 'Back';
      prevBtn.addEventListener('click', () => this.prev());
      buttonsEl.appendChild(prevBtn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'btn btn-sm btn-primary';
    nextBtn.textContent = this._currentStepIndex === this._steps.length - 1 ? 'Finish' : 'Next';
    nextBtn.addEventListener('click', () => {
      if (this._currentStepIndex === this._steps.length - 1) {
        this.end();
      } else {
        this.next();
      }
    });
    buttonsEl.appendChild(nextBtn);

    actionsEl.appendChild(buttonsEl);
    this._popoverEl.appendChild(actionsEl);

    // Position relative to target
    this._positionAt(step.target);
    this._popoverEl.classList.add('show');
    triggerEvent(this._element, 'boodoo.step.tour', { stepIndex: this._currentStepIndex, step });
  }

  _positionAt(targetSelector) {
    if (!this._popoverEl || typeof document === 'undefined') return;
    const target = typeof targetSelector === 'string' ? document.querySelector(targetSelector) : targetSelector;
    if (target && typeof window !== 'undefined') {
      const rect = target.getBoundingClientRect();
      const top = rect.bottom + window.scrollY + 10;
      const left = Math.max(16, Math.min(window.innerWidth - 340, rect.left + window.scrollX));
      this._popoverEl.style.top = `${top}px`;
      this._popoverEl.style.left = `${left}px`;
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Center fallback
      this._popoverEl.style.top = '30%';
      this._popoverEl.style.left = 'calc(50% - 160px)';
    }
  }

  next() {
    if (this._currentStepIndex < this._steps.length - 1) {
      this._currentStepIndex++;
      this._renderStep();
    } else {
      this.end();
    }
  }

  prev() {
    if (this._currentStepIndex > 0) {
      this._currentStepIndex--;
      this._renderStep();
    }
  }

  end() {
    if (this._popoverEl) {
      this._popoverEl.classList.remove('show');
      if (this._popoverEl.parentNode) {
        this._popoverEl.parentNode.removeChild(this._popoverEl);
      }
      this._popoverEl = null;
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', this._onKeyDown);
    }
    triggerEvent(this._element, 'boodoo.ended.tour');
  }

  _onKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.end();
    } else if (e.key === 'ArrowRight') {
      this.next();
    } else if (e.key === 'ArrowLeft') {
      this.prev();
    }
  }

  dispose() {
    this.end();
    super.dispose();
  }
}
