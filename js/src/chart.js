// =====================================================================
// BOODOO JS — Chart Component (Native zero-dependency Canvas/SVG charts)
// Supports: 'bar', 'line', 'area', 'pie', 'donut', 'radar', 'polarArea'
// Features: Responsive scaling, interactive hover tooltips, CSS variable theming,
// dark mode awareness, data-api initialization, programmatic updates.
// =====================================================================

import { BaseComponent } from './base-component.js';
import { triggerEvent, escapeHtml } from './util.js';

const PALETTE_FALLBACKS = [
  '#7c3aed', // primary (purple)
  '#0ea5e9', // info (sky blue)
  '#1c9e50', // success (green)
  '#f59e0b', // warning (amber)
  '#e11d48', // danger (rose)
  '#5b21e6', // secondary (indigo)
  '#f43f5e', // accent
  '#8b8fb0', // gray-500
];

export class Chart extends BaseComponent {
  static get NAME() {
    return 'chart';
  }

  constructor(element, config = {}) {
    super(element, config);
    this._canvas = this._element.tagName === 'CANVAS' ? this._element : this._element.querySelector('canvas');
    if (!this._canvas) {
      this._canvas = document.createElement('canvas');
      this._canvas.className = 'chart-canvas';
      this._element.appendChild(this._canvas);
    }

    // Config options
    this._type = this._config.type || this._element.getAttribute('data-chart-type') || 'bar';
    this._data = this._config.data || this._parseDataFromDOM() || { labels: [], datasets: [] };

    // Default aspect ratio: pie, donut, radar, polarArea look best square (1 or 1.25); line and bar look best at 2
    const defaultAspectRatio = ['pie', 'donut', 'radar', 'polarArea'].includes(this._type) ? 1.2 : 2;

    this._options = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: this._config.options?.aspectRatio || defaultAspectRatio,
      animated: true,
      donutCutout: 0.55,
      showGrid: true,
      showLegend: true,
      showTooltips: true,
      ...this._config.options,
    };

    this._ctx = this._canvas.getContext ? this._canvas.getContext('2d') : null;
    this._tooltipEl = null;
    this._hoveredElement = null;
    this._animationProgress = 1;
    this._animationFrame = null;
    this._resizeObserver = null;
    this._boundHandlers = {};

    this._init();
  }

  _parseDataFromDOM() {
    const rawData = this._element.getAttribute('data-chart-data');
    if (rawData) {
      try {
        return JSON.parse(rawData);
      } catch {
        return { labels: [], datasets: [] };
      }
    }
    return { labels: [], datasets: [] };
  }

  _init() {
    if (!this._ctx) return;

    this._element.classList.add('chart-wrapper');
    this._createTooltipElement();
    this._bindEvents();
    this._setupResizeObserver();
    this.render();
  }

  _createTooltipElement() {
    if (!this._options.showTooltips) return;
    let tt = this._element.querySelector('.chart-tooltip');
    if (!tt) {
      tt = document.createElement('div');
      tt.className = 'chart-tooltip';
      tt.style.position = 'absolute';
      tt.style.pointerEvents = 'none';
      tt.style.opacity = '0';
      tt.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
      this._element.style.position = this._element.style.position || 'relative';
      this._element.appendChild(tt);
    }
    this._tooltipEl = tt;
  }

  _bindEvents() {
    this._boundHandlers.mousemove = (e) => this._handleMouseMove(e);
    this._boundHandlers.mouseleave = () => this._handleMouseLeave();

    this._canvas.addEventListener('mousemove', this._boundHandlers.mousemove);
    this._canvas.addEventListener('mouseleave', this._boundHandlers.mouseleave);
  }

  _setupResizeObserver() {
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => {
        this.resize();
      });
      this._resizeObserver.observe(this._element);
    } else {
      this._boundHandlers.windowResize = () => this.resize();
      window.addEventListener('resize', this._boundHandlers.windowResize);
    }
  }

  getColors() {
    const style = typeof window !== 'undefined' && window.getComputedStyle ? window.getComputedStyle(this._element) : null;
    const readVar = (name, fallback) => {
      if (!style) return fallback;
      const v = style.getPropertyValue(name).trim();
      return v || fallback;
    };

    const primary = readVar('--boodoo-primary', PALETTE_FALLBACKS[0]);
    const info = readVar('--boodoo-info', PALETTE_FALLBACKS[1]);
    const success = readVar('--boodoo-success', PALETTE_FALLBACKS[2]);
    const warning = readVar('--boodoo-warning', PALETTE_FALLBACKS[3]);
    const danger = readVar('--boodoo-danger', PALETTE_FALLBACKS[4]);
    const secondary = readVar('--boodoo-secondary', PALETTE_FALLBACKS[5]);
    const text = readVar('--boodoo-body-color', '#29314d');
    const grid = readVar('--boodoo-border-color', '#dfe3ee');

    return {
      palette: [primary, info, success, warning, danger, secondary, PALETTE_FALLBACKS[6], PALETTE_FALLBACKS[7]],
      text,
      grid,
    };
  }

  resize() {
    if (!this._canvas || !this._ctx) return;
    const rect = this._element.getBoundingClientRect();
    const width = rect.width || this._canvas.parentElement?.clientWidth || 400;
    const height = this._options.maintainAspectRatio
      ? width / (this._options.aspectRatio || 2)
      : (rect.height || 240);

    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    this._canvas.width = Math.floor(width * dpr);
    this._canvas.height = Math.floor(height * dpr);
    this._canvas.style.width = `${Math.floor(width)}px`;
    this._canvas.style.height = `${Math.floor(height)}px`;

    this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    this._ctx.scale(dpr, dpr);

    this.render();
  }

  update(data, options) {
    if (data) this._data = data;
    if (options) {
      if (options.type) this._type = options.type;
      this._options = { ...this._options, ...options };
    }
    this.render();
    triggerEvent(this._element, 'boodoo.chart.update', { data: this._data });
  }

  render() {
    if (!this._ctx) return;
    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    const width = this._canvas.width / dpr;
    const height = this._canvas.height / dpr;

    if (width <= 0 || height <= 0) return;

    this._ctx.clearRect(0, 0, width, height);
    this._hitRegions = [];

    const { palette, text, grid } = this.getColors();

    if (this._type === 'bar') {
      this._renderBarChart(width, height, palette, text, grid);
    } else if (this._type === 'line' || this._type === 'area') {
      this._renderLineChart(width, height, palette, text, grid);
    } else if (this._type === 'pie' || this._type === 'donut') {
      this._renderPieChart(width, height, palette, text);
    } else if (this._type === 'polarArea') {
      this._renderPolarAreaChart(width, height, palette, text, grid);
    } else if (this._type === 'radar') {
      this._renderRadarChart(width, height, palette, text, grid);
    }
  }

  _renderBarChart(width, height, palette, textColor, gridColor) {
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const labels = this._data.labels || [];
    const datasets = this._data.datasets || [];
    if (!labels.length || !datasets.length) return;

    let maxVal = 0;
    datasets.forEach((ds) => {
      (ds.data || []).forEach((val) => {
        if (val > maxVal) maxVal = val;
      });
    });
    if (maxVal <= 0) maxVal = 10;
    const stepCount = 4;
    const niceMax = Math.ceil(maxVal / stepCount) * stepCount;

    // Draw grid lines & Y labels
    this._ctx.fillStyle = textColor;
    this._ctx.strokeStyle = gridColor;
    this._ctx.lineWidth = 1;
    this._ctx.font = '12px Inter, system-ui, sans-serif';
    this._ctx.textAlign = 'right';
    this._ctx.textBaseline = 'middle';

    for (let i = 0; i <= stepCount; i++) {
      const yVal = (niceMax / stepCount) * i;
      const y = padding.top + chartH - (yVal / niceMax) * chartH;

      if (this._options.showGrid) {
        this._ctx.beginPath();
        this._ctx.moveTo(padding.left, y);
        this._ctx.lineTo(width - padding.right, y);
        this._ctx.stroke();
      }

      this._ctx.fillText(String(Math.round(yVal)), padding.left - 8, y);
    }

    const groupWidth = chartW / labels.length;
    const barGap = 6;
    const barW = Math.max(4, (groupWidth - 20) / datasets.length - barGap);

    labels.forEach((label, labelIdx) => {
      const groupX = padding.left + labelIdx * groupWidth + 10;

      datasets.forEach((ds, dsIdx) => {
        const val = (ds.data && ds.data[labelIdx] !== undefined) ? ds.data[labelIdx] : 0;
        const barH = (val / niceMax) * chartH;
        const x = groupX + dsIdx * (barW + barGap);
        const y = padding.top + chartH - barH;

        const color = ds.backgroundColor || (Array.isArray(ds.colors) ? ds.colors[labelIdx] : palette[dsIdx % palette.length]);

        this._ctx.fillStyle = color;
        this._ctx.beginPath();
        if (this._ctx.roundRect) {
          this._ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
        } else {
          this._ctx.rect(x, y, barW, barH);
        }
        this._ctx.fill();

        this._hitRegions.push({
          x,
          y,
          w: barW,
          h: barH,
          label,
          datasetLabel: ds.label || `Dataset ${dsIdx + 1}`,
          value: val,
          color,
        });
      });

      this._ctx.fillStyle = textColor;
      this._ctx.textAlign = 'center';
      this._ctx.textBaseline = 'top';
      this._ctx.fillText(label, groupX + (datasets.length * (barW + barGap)) / 2 - barGap / 2, padding.top + chartH + 10);
    });
  }

  _renderLineChart(width, height, palette, textColor, gridColor) {
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const labels = this._data.labels || [];
    const datasets = this._data.datasets || [];
    if (!labels.length || !datasets.length) return;

    let maxVal = 0;
    datasets.forEach((ds) => {
      (ds.data || []).forEach((val) => {
        if (val > maxVal) maxVal = val;
      });
    });
    if (maxVal <= 0) maxVal = 10;
    const stepCount = 4;
    const niceMax = Math.ceil(maxVal / stepCount) * stepCount;

    // Grid & Y labels
    this._ctx.fillStyle = textColor;
    this._ctx.strokeStyle = gridColor;
    this._ctx.lineWidth = 1;
    this._ctx.font = '12px Inter, system-ui, sans-serif';
    this._ctx.textAlign = 'right';
    this._ctx.textBaseline = 'middle';

    for (let i = 0; i <= stepCount; i++) {
      const yVal = (niceMax / stepCount) * i;
      const y = padding.top + chartH - (yVal / niceMax) * chartH;

      if (this._options.showGrid) {
        this._ctx.beginPath();
        this._ctx.moveTo(padding.left, y);
        this._ctx.lineTo(width - padding.right, y);
        this._ctx.stroke();
      }

      this._ctx.fillText(String(Math.round(yVal)), padding.left - 8, y);
    }

    const getX = (idx) => padding.left + (idx / (labels.length - 1 || 1)) * chartW;
    const getY = (val) => padding.top + chartH - (val / niceMax) * chartH;

    datasets.forEach((ds, dsIdx) => {
      const color = ds.borderColor || palette[dsIdx % palette.length];
      const data = ds.data || [];
      const isArea = this._type === 'area' || ds.fill;

      // Fill area under line if area chart
      if (isArea && data.length > 0) {
        this._ctx.beginPath();
        data.forEach((val, idx) => {
          const x = getX(idx);
          const y = getY(val);
          if (idx === 0) this._ctx.moveTo(x, y);
          else this._ctx.lineTo(x, y);
        });
        this._ctx.lineTo(getX(data.length - 1), padding.top + chartH);
        this._ctx.lineTo(getX(0), padding.top + chartH);
        this._ctx.closePath();

        const areaBg = ds.backgroundColor || (color.startsWith('#') ? `${color}33` : 'rgba(124, 58, 237, 0.15)');
        this._ctx.fillStyle = areaBg;
        this._ctx.fill();
      }

      // Line path
      this._ctx.beginPath();
      data.forEach((val, idx) => {
        const x = getX(idx);
        const y = getY(val);
        if (idx === 0) this._ctx.moveTo(x, y);
        else this._ctx.lineTo(x, y);
      });
      this._ctx.strokeStyle = color;
      this._ctx.lineWidth = ds.borderWidth || 2.5;
      this._ctx.stroke();

      // Points & hit regions
      data.forEach((val, idx) => {
        const x = getX(idx);
        const y = getY(val);

        this._ctx.beginPath();
        this._ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        this._ctx.fillStyle = ds.pointBackgroundColor || color;
        this._ctx.fill();
        this._ctx.lineWidth = 2;
        this._ctx.strokeStyle = '#ffffff';
        this._ctx.stroke();

        this._hitRegions.push({
          x: x - 8,
          y: y - 8,
          w: 16,
          h: 16,
          label: labels[idx],
          datasetLabel: ds.label || `Dataset ${dsIdx + 1}`,
          value: val,
          color,
        });
      });
    });

    this._ctx.fillStyle = textColor;
    this._ctx.textAlign = 'center';
    this._ctx.textBaseline = 'top';
    labels.forEach((label, idx) => {
      this._ctx.fillText(label, getX(idx), padding.top + chartH + 10);
    });
  }

  _renderPieChart(width, height, palette, textColor) {
    const isDonut = this._type === 'donut';
    const centerX = width / 2;
    const centerY = height / 2;
    // Generous radius to make pie and donut prominently sized (fills 85% of available bounds)
    const radius = Math.max(20, Math.min(centerX, centerY) - 12);
    const cutoutRadius = isDonut ? radius * (this._options.donutCutout || 0.55) : 0;

    const labels = this._data.labels || [];
    const dataset = (this._data.datasets && this._data.datasets[0]) || { data: [] };
    const data = dataset.data || [];
    if (!data.length) return;

    const total = data.reduce((acc, v) => acc + (v || 0), 0);
    if (total <= 0) return;

    let currentAngle = -Math.PI / 2;

    data.forEach((val, idx) => {
      const sliceAngle = (val / total) * Math.PI * 2;
      const endAngle = currentAngle + sliceAngle;
      const color = (dataset.backgroundColor && dataset.backgroundColor[idx]) || palette[idx % palette.length];

      this._ctx.beginPath();
      this._ctx.arc(centerX, centerY, radius, currentAngle, endAngle);
      if (cutoutRadius > 0) {
        this._ctx.arc(centerX, centerY, cutoutRadius, endAngle, currentAngle, true);
      } else {
        this._ctx.lineTo(centerX, centerY);
      }
      this._ctx.closePath();
      this._ctx.fillStyle = color;
      this._ctx.fill();

      // Border separation
      this._ctx.lineWidth = 2;
      this._ctx.strokeStyle = '#ffffff';
      this._ctx.stroke();

      this._hitRegions.push({
        type: 'arc',
        centerX,
        centerY,
        innerRadius: cutoutRadius,
        outerRadius: radius,
        startAngle: currentAngle,
        endAngle,
        label: labels[idx] || `Item ${idx + 1}`,
        value: val,
        percentage: ((val / total) * 100).toFixed(1),
        color,
      });

      currentAngle = endAngle;
    });

    // Donut center label showing total
    if (isDonut && cutoutRadius > 25) {
      this._ctx.fillStyle = textColor;
      this._ctx.textAlign = 'center';
      this._ctx.textBaseline = 'middle';
      this._ctx.font = 'bold 18px Inter, system-ui, sans-serif';
      this._ctx.fillText(String(total), centerX, centerY - 6);
      this._ctx.font = '11px Inter, system-ui, sans-serif';
      this._ctx.fillText('TOTAL', centerX, centerY + 14);
    }
  }

  _renderPolarAreaChart(width, height, palette, textColor, gridColor) {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.max(20, Math.min(centerX, centerY) - 16);

    const labels = this._data.labels || [];
    const dataset = (this._data.datasets && this._data.datasets[0]) || { data: [] };
    const data = dataset.data || [];
    if (!data.length) return;

    const maxVal = Math.max(...data, 10);
    const sliceAngle = (Math.PI * 2) / data.length;

    // Draw concentric guide circles
    this._ctx.strokeStyle = gridColor;
    this._ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      this._ctx.beginPath();
      this._ctx.arc(centerX, centerY, (maxRadius / 3) * i, 0, Math.PI * 2);
      this._ctx.stroke();
    }

    let currentAngle = -Math.PI / 2;
    data.forEach((val, idx) => {
      const r = (val / maxVal) * maxRadius;
      const endAngle = currentAngle + sliceAngle;
      const color = (dataset.backgroundColor && dataset.backgroundColor[idx]) || palette[idx % palette.length];

      this._ctx.beginPath();
      this._ctx.arc(centerX, centerY, r, currentAngle, endAngle);
      this._ctx.lineTo(centerX, centerY);
      this._ctx.closePath();

      this._ctx.fillStyle = color.startsWith('#') ? `${color}cc` : color;
      this._ctx.fill();

      this._ctx.lineWidth = 1.5;
      this._ctx.strokeStyle = '#ffffff';
      this._ctx.stroke();

      this._hitRegions.push({
        type: 'arc',
        centerX,
        centerY,
        innerRadius: 0,
        outerRadius: r,
        startAngle: currentAngle,
        endAngle,
        label: labels[idx] || `Item ${idx + 1}`,
        value: val,
        color,
      });

      currentAngle = endAngle;
    });
  }

  _renderRadarChart(width, height, palette, textColor, gridColor) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.max(20, Math.min(centerX, centerY) - 30);

    const labels = this._data.labels || [];
    const datasets = this._data.datasets || [];
    const count = labels.length;
    if (count < 3 || !datasets.length) return;

    let maxVal = 0;
    datasets.forEach((ds) => {
      (ds.data || []).forEach((val) => {
        if (val > maxVal) maxVal = val;
      });
    });
    if (maxVal <= 0) maxVal = 100;

    const angleStep = (Math.PI * 2) / count;

    // Draw concentric web rings
    this._ctx.strokeStyle = gridColor;
    this._ctx.lineWidth = 1;
    const rings = 4;
    for (let rIdx = 1; rIdx <= rings; rIdx++) {
      const r = (radius / rings) * rIdx;
      this._ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const a = -Math.PI / 2 + i * angleStep;
        const x = centerX + Math.cos(a) * r;
        const y = centerY + Math.sin(a) * r;
        if (i === 0) this._ctx.moveTo(x, y);
        else this._ctx.lineTo(x, y);
      }
      this._ctx.closePath();
      this._ctx.stroke();
    }

    // Spokes and labels
    this._ctx.fillStyle = textColor;
    this._ctx.font = '11px Inter, system-ui, sans-serif';
    this._ctx.textAlign = 'center';
    this._ctx.textBaseline = 'middle';

    for (let i = 0; i < count; i++) {
      const a = -Math.PI / 2 + i * angleStep;
      const x = centerX + Math.cos(a) * radius;
      const y = centerY + Math.sin(a) * radius;

      this._ctx.beginPath();
      this._ctx.moveTo(centerX, centerY);
      this._ctx.lineTo(x, y);
      this._ctx.stroke();

      const labelX = centerX + Math.cos(a) * (radius + 16);
      const labelY = centerY + Math.sin(a) * (radius + 16);
      this._ctx.fillText(labels[i], labelX, labelY);
    }

    // Draw polygon datasets
    datasets.forEach((ds, dsIdx) => {
      const color = ds.borderColor || palette[dsIdx % palette.length];
      const data = ds.data || [];

      this._ctx.beginPath();
      data.forEach((val, i) => {
        const r = (val / maxVal) * radius;
        const a = -Math.PI / 2 + i * angleStep;
        const x = centerX + Math.cos(a) * r;
        const y = centerY + Math.sin(a) * r;
        if (i === 0) this._ctx.moveTo(x, y);
        else this._ctx.lineTo(x, y);
      });
      this._ctx.closePath();

      const areaBg = ds.backgroundColor || (color.startsWith('#') ? `${color}33` : 'rgba(124, 58, 237, 0.2)');
      this._ctx.fillStyle = areaBg;
      this._ctx.fill();

      this._ctx.strokeStyle = color;
      this._ctx.lineWidth = 2;
      this._ctx.stroke();

      // Points and hit regions
      data.forEach((val, i) => {
        const r = (val / maxVal) * radius;
        const a = -Math.PI / 2 + i * angleStep;
        const x = centerX + Math.cos(a) * r;
        const y = centerY + Math.sin(a) * r;

        this._ctx.beginPath();
        this._ctx.arc(x, y, 4, 0, Math.PI * 2);
        this._ctx.fillStyle = color;
        this._ctx.fill();
        this._ctx.strokeStyle = '#ffffff';
        this._ctx.lineWidth = 1.5;
        this._ctx.stroke();

        this._hitRegions.push({
          x: x - 8,
          y: y - 8,
          w: 16,
          h: 16,
          label: labels[i],
          datasetLabel: ds.label || `Dataset ${dsIdx + 1}`,
          value: val,
          color,
        });
      });
    });
  }

  _handleMouseMove(e) {
    if (!this._hitRegions || !this._hitRegions.length) return;
    const rect = this._canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let match = null;
    for (let i = this._hitRegions.length - 1; i >= 0; i--) {
      const region = this._hitRegions[i];
      if (region.type === 'arc') {
        const dx = x - region.centerX;
        const dy = y - region.centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist >= region.innerRadius && dist <= region.outerRadius) {
          let angle = Math.atan2(dy, dx);
          while (angle < region.startAngle) angle += Math.PI * 2;
          while (angle > region.startAngle + Math.PI * 2) angle -= Math.PI * 2;
          if (angle >= region.startAngle && angle <= region.endAngle) {
            match = region;
            break;
          }
        }
      } else {
        if (x >= region.x && x <= region.x + region.w && y >= region.y && y <= region.y + region.h) {
          match = region;
          break;
        }
      }
    }

    if (match) {
      this._canvas.style.cursor = 'pointer';
      this._showTooltip(match, x, y);
    } else {
      this._canvas.style.cursor = 'default';
      this._hideTooltip();
    }
  }

  _handleMouseLeave() {
    this._canvas.style.cursor = 'default';
    this._hideTooltip();
  }

  _showTooltip(item, mouseX, mouseY) {
    if (!this._tooltipEl) return;
    const title = item.datasetLabel ? `${escapeHtml(item.datasetLabel)}: ${escapeHtml(item.label)}` : escapeHtml(item.label);
    const valueStr = item.percentage ? `${item.value} (${item.percentage}%)` : String(item.value);

    this._tooltipEl.innerHTML = `
      <div class="chart-tooltip-content">
        <span class="chart-tooltip-indicator" style="background-color: ${item.color};"></span>
        <strong class="chart-tooltip-title">${title}</strong>
        <span class="chart-tooltip-value">${escapeHtml(valueStr)}</span>
      </div>
    `;

    this._tooltipEl.style.opacity = '1';
    this._tooltipEl.style.left = `${mouseX + 12}px`;
    this._tooltipEl.style.top = `${mouseY - 12}px`;
  }

  _hideTooltip() {
    if (this._tooltipEl) {
      this._tooltipEl.style.opacity = '0';
    }
  }

  dispose() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._boundHandlers.windowResize) {
      window.removeEventListener('resize', this._boundHandlers.windowResize);
    }
    if (this._canvas) {
      if (this._boundHandlers.mousemove) {
        this._canvas.removeEventListener('mousemove', this._boundHandlers.mousemove);
      }
      if (this._boundHandlers.mouseleave) {
        this._canvas.removeEventListener('mouseleave', this._boundHandlers.mouseleave);
      }
    }
    if (this._tooltipEl && this._tooltipEl.parentNode) {
      this._tooltipEl.parentNode.removeChild(this._tooltipEl);
      this._tooltipEl = null;
    }
    super.dispose();
  }
}
