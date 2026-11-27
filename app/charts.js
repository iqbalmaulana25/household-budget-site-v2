// charts.js — the site's two charts, drawn as inline SVG.
// One job: turn numbers into pictures. No library, no canvas state to lose;
// the SVG is in the page, so it stays crisp on a phone and in screenshots.

import { formatIDRShort } from './format.js';

export const CHART_COLORS = [
  '#0f5e5c', '#e8a33d', '#4d908e', '#f28482', '#577590',
  '#90be6d', '#f9c74f', '#277da1', '#9b5de5', '#6a8eae',
];

function polar(cx, cy, radius, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
}

function arcPath(cx, cy, radius, startAngle, endAngle) {
  const [sx, sy] = polar(cx, cy, radius, startAngle);
  const [ex, ey] = polar(cx, cy, radius, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${sx.toFixed(2)} ${sy.toFixed(2)} A ${radius} ${radius} 0 ${large} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`;
}

// svgDonut([{label, value}], centerLabel) -> an SVG string with thick arc
// segments, one per slice, and the total in the middle.
export function svgDonut(slices, centerTop, centerBottom) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (total <= 0) return '<p class="empty-note">Belum ada pengeluaran bulan ini.</p>';
  const cx = 110;
  const cy = 110;
  const radius = 84;
  let angle = 0;
  const parts = slices.map((slice, i) => {
    const sweep = (slice.value / total) * 360;
    const start = angle;
    angle += sweep;
    if (sweep >= 359.9) {
      return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${CHART_COLORS[i % CHART_COLORS.length]}" stroke-width="30"/>`;
    }
    return `<path d="${arcPath(cx, cy, radius, start + 0.7, angle - 0.7)}" fill="none" stroke="${CHART_COLORS[i % CHART_COLORS.length]}" stroke-width="30"><title>${slice.label}: ${formatIDRShort(slice.value)}</title></path>`;
  });
  return `<svg viewBox="0 0 220 220" class="donut" role="img" aria-label="Donat pengeluaran per kategori">
    ${parts.join('\n')}
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-top">${centerTop}</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-bottom">${centerBottom}</text>
  </svg>`;
}

// svgBars([{label, income, spent}]) -> grouped vertical bars, income in teal,
// spending in amber, with a value label over the taller of each pair.
export function svgBars(months) {
  const width = 640;
  const height = 260;
  const base = 224;
  const top = 18;
  const max = Math.max(...months.map((m) => Math.max(m.income, m.spent)));
  const groupWidth = width / months.length;
  const barWidth = 26;
  const scale = (value) => ((value / max) * (base - top)).toFixed(1);
  const parts = [];
  months.forEach((m, i) => {
    const gx = i * groupWidth + groupWidth / 2;
    const incomeH = scale(m.income);
    const spentH = scale(m.spent);
    parts.push(`<rect x="${(gx - barWidth - 3).toFixed(1)}" y="${(base - incomeH).toFixed(1)}" width="${barWidth}" height="${incomeH}" rx="4" class="bar-in"><title>Pemasukan ${m.month}: ${formatIDRShort(m.income)}</title></rect>`);
    parts.push(`<rect x="${(gx + 3).toFixed(1)}" y="${(base - spentH).toFixed(1)}" width="${barWidth}" height="${spentH}" rx="4" class="bar-out"><title>Pengeluaran ${m.month}: ${formatIDRShort(m.spent)}</title></rect>`);
    parts.push(`<text x="${gx}" y="${base + 22}" text-anchor="middle" class="bar-label">${m.month}</text>`);
    parts.push(`<text x="${gx}" y="${(base - Math.max(incomeH, spentH) - 6).toFixed(1)}" text-anchor="middle" class="bar-value">${formatIDRShort(Math.max(m.income, m.spent))}</text>`);
  });
  return `<svg viewBox="0 0 ${width} ${height}" class="bars" role="img" aria-label="Grafik batang pemasukan vs pengeluaran 6 bulan">
    <line x1="0" y1="${base}" x2="${width}" y2="${base}" class="bar-axis"/>
    ${parts.join('\n')}
  </svg>`;
}
