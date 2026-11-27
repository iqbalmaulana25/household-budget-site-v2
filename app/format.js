// format.js — turning numbers and dates into what a person reads.
// One job: presentation of values. No state, no DOM.

const idr = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

// formatIDR(485000) -> "Rp 485.000"
export function formatIDR(amount) {
  return idr.format(Math.round(amount));
}

// formatIDRShort(16850000) -> "Rp 16,9 jt" for tight chart labels.
export function formatIDRShort(amount) {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) {
    const jt = amount / 1_000_000;
    return `Rp ${jt.toFixed(jt >= 100 ? 0 : 1).replace('.', ',')} jt`;
  }
  if (abs >= 1_000) return `Rp ${Math.round(amount / 1_000)} rb`;
  return formatIDR(amount);
}

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function monthName(monthIndex) {
  return MONTHS_ID[monthIndex];
}

// formatDate('2026-11-04') -> "4 Nov 2026"
export function formatDate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${MONTHS_ID[month - 1].slice(0, 3)} ${year}`;
}

// percentOf(3200000, 4850000) -> 66 (rounded, never above 999 for display)
export function percentOf(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

// parseAmount('1.250.000') or ('1250000') -> 1250000; NaN when not a number.
export function parseAmount(text) {
  const digits = String(text).replace(/[^\d]/g, '');
  return digits === '' ? NaN : Number(digits);
}

// monthsBetween('2026-11', 1250000 remaining, 500000 a month) is done by
// callers; this helper only turns a month count into words: 7 -> "7 bulan".
export function monthsLabel(count) {
  if (count <= 0) return 'bulan ini';
  if (count === 1) return '1 bulan';
  if (count < 24) return `${count} bulan`;
  const years = Math.floor(count / 12);
  const rest = count % 12;
  return rest === 0 ? `${years} tahun` : `${years} tahun ${rest} bulan`;
}
