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

    // Placeholders map for code blocks, inline code, and links to protect them from text escaping
    const placeholders = [];
    const createPlaceholder = (replacementHtml) => {
      const id = `@@BOODOOMDPH${placeholders.length}@@`;
      placeholders.push({ id, html: replacementHtml });
      return id;
    };

    // 1. Code blocks (extract & escape code contents safely)
    md = md.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (_, lang, code) => {
      const codeHtml = `<pre class="boodoo-code-block"><code class="language-${escapeHtml(lang)}">${escapeHtml(code.trim())}</code></pre>`;
      return createPlaceholder(codeHtml);
    });

    // 2. Inline code (extract & escape code contents safely)
    md = md.replace(/`([^`]+)`/g, (_, code) => {
      const inlineCodeHtml = `<code class="boodoo-inline-code">${escapeHtml(code)}</code>`;
      return createPlaceholder(inlineCodeHtml);
    });

    // 3. Safe Links (only http, https, mailto, relative, and anchor protocols)
    md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
      const trimmed = href.trim();
      const isSafe = /^(https?:|\/|#|mailto:)/i.test(trimmed);
      const safeHref = isSafe ? escapeHtml(trimmed) : '#';
      const linkHtml = `<a href="${safeHref}" class="boodoo-link" rel="noopener noreferrer"><span>${escapeHtml(label)}</span></a>`;
      return createPlaceholder(linkHtml);
    });

    // 4. Escape all remaining raw HTML characters in the user Markdown text to prevent XSS
    md = escapeHtml(md);

    // 5. Blockquotes
    md = md.replace(/^&gt;\s+(.+)$/gm, (_, quote) => {
      return `<blockquote class="boodoo-blockquote"><p><span>${quote}</span></p></blockquote>`;
    });

    // 6. Headings (H1 to H6)
    md = md.replace(/^(#{1,6})\s+(.+)$/gm, (_, hashes, text) => {
      const level = hashes.length;
      return `<h${level}><span>${text}</span></h${level}>`;
    });

    // 7. Unordered lists
    md = md.replace(/^[-*+]\s+(.+)$/gm, '<li><span>$1</span></li>');
    md = md.replace(/(<li><span>.*<\/span><\/li>\n?)+/g, '<ul class="boodoo-list">$&</ul>');

    // 8. Bold & Italic (escaped text preserves markup delimiters)
    md = md.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    md = md.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    md = md.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    md = md.replace(/_([^_]+)_/g, '<em>$1</em>');

    // 9. Paragraphs: Wrap lines that aren't already wrapped in block elements
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

    let output = result.join('\n');

    // 10. Restore protected placeholders
    for (const ph of placeholders) {
      output = output.replaceAll(ph.id, ph.html);
    }

    return output;
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
