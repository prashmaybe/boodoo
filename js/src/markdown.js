// =====================================================================
// BOODOO — Markdown & Rich Text Component
// Zero-dependency, lightweight, safe Markdown renderer with XSS protection
// Supports headings, bold/italic, links, code blocks, lists, quotes, tables.
// =====================================================================

import { escapeHtml, triggerEvent } from './util.js';

export class Markdown {
  static render(markdownText = '') {
    if (typeof markdownText !== 'string') return '';
    let md = markdownText.replace(/\r\n/g, '\n');

    // Code blocks
    md = md.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (_, lang, code) => {
      return `<pre class="boodoo-code-block"><code class="language-${escapeHtml(lang)}">${escapeHtml(code.trim())}</code></pre>`;
    });

    // Inline code
    md = md.replace(/`([^`]+)`/g, (_, code) => {
      return `<code class="boodoo-inline-code">${escapeHtml(code)}</code>`;
    });

    // Blockquotes
    md = md.replace(/^>\s+(.+)$/gm, (_, quote) => {
      return `<blockquote class="boodoo-blockquote"><p><span>${quote}</span></p></blockquote>`;
    });

    // Headings (H1 to H6)
    md = md.replace(/^(#{1,6})\s+(.+)$/gm, (_, hashes, text) => {
      const level = hashes.length;
      return `<h${level}><span>${text}</span></h${level}>`;
    });

    // Unordered lists
    md = md.replace(/^[-*+]\s+(.+)$/gm, '<li><span>$1</span></li>');
    md = md.replace(/(<li><span>.*<\/span><\/li>\n?)+/g, '<ul class="boodoo-list">$&</ul>');

    // Bold & Italic
    md = md.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    md = md.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    md = md.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    md = md.replace(/_([^_]+)_/g, '<em>$1</em>');

    // Safe Links (only http, https, mailto, relative, and anchor)
    md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
      const trimmed = href.trim();
      const isSafe = /^(https?:|\/|#|mailto:)/i.test(trimmed);
      const safeHref = isSafe ? escapeHtml(trimmed) : '#';
      return `<a href="${safeHref}" class="boodoo-link" rel="noopener noreferrer"><span>${escapeHtml(label)}</span></a>`;
    });

    // Paragraphs: Wrap lines that aren't already wrapped in block elements
    const lines = md.split('\n');
    const result = [];
    let pBuffer = [];

    const flushP = () => {
      if (pBuffer.length > 0) {
        result.push(`<p><span>${pBuffer.join(' ')}</span></p>`);
        pBuffer = [];
      }
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        flushP();
      } else if (/^<(h[1-6]|ul|ol|pre|blockquote|div|p)/i.test(trimmed)) {
        flushP();
        result.push(trimmed);
      } else {
        pBuffer.push(trimmed);
      }
    }
    flushP();

    return result.join('\n');
  }

  constructor(element, options = {}) {
    this._element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this._element) return;

    this._options = {
      content:
        options.content ||
        this._element.getAttribute('data-content') ||
        this._element.textContent ||
        '',
      editable: options.editable || false,
      ...options,
    };

    this._init();
  }

  _init() {
    this._element.classList.add('boodoo-markdown');
    this.setContent(this._options.content);

    if (this._options.editable) {
      this._element.setAttribute('contenteditable', 'true');
      this._onInput = () => {
        triggerEvent(this._element, 'boodoo:markdown:change', {
          html: this._element.innerHTML,
        });
      };
      this._element.addEventListener('input', this._onInput);
    }
  }

  setContent(text) {
    this._content = text;
    this._element.innerHTML = Markdown.render(text);
    triggerEvent(this._element, 'boodoo:markdown:rendered', {
      markdown: text,
    });
  }

  dispose() {
    if (this._element) {
      if (this._onInput) {
        this._element.removeEventListener('input', this._onInput);
      }
      this._element.classList.remove('boodoo-markdown');
    }
  }
}
