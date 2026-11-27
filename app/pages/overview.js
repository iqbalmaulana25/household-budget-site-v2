// pages/overview.js — the front door: where November stands at a glance.
import {
  getCategories, getTransactions, getBills, getGoals,
  monthIncome, monthSpent, monthSaved, monthRemaining,
  spentByCategory, billsUnpaid, goalMonthsLeft,
} from '../store.js';
import { HOUSEHOLD, HISTORY } from '../data.js';
import { formatIDR, formatIDRShort, percentOf, formatDate } from '../format.js';
import { svgDonut, svgBars, CHART_COLORS } from '../charts.js';

function statCard(label, value, note, accent = false) {
  return `<section class="card stat${accent ? ' accent' : ''}">
    <div class="stat-label">${label}</div>
    <div class="stat-value">${value}</div>
    <p class="stat-note">${note}</p>
  </section>`;
}

function budgetRow(category) {
  const spent = spentByCategory(category.id);
  const pct = percentOf(spent, category.budget);
  const state = pct >= 100 ? 'over' : pct >= 85 ? 'warn' : '';
  const pill = pct >= 100
    ? `<span class="pill over">Lewat ${formatIDR(spent - category.budget)}</span>`
    : `<span class="pill">Sisa ${formatIDR(category.budget - spent)}</span>`;
  return `<div class="budget-row">
    <div class="row-top"><span>${category.name}</span><span class="figures"><strong>${formatIDR(spent)}</strong> / ${formatIDR(category.budget)} ${pill}</span></div>
    <div class="bar-track"><div class="bar-fill ${state}" style="width:${Math.min(pct, 100)}%"></div></div>
  </div>`;
}

export default function renderOverview(root) {
  const income = monthIncome();
  const spent = monthSpent();
  const saved = monthSaved();
  const remaining = monthRemaining();
  const unpaid = billsUnpaid();
  const recent = getTransactions().slice(0, 5);
  const goals = getGoals().slice(0, 2);

  const slices = getCategories()
    .map((c, i) => ({ label: c.name, value: spentByCategory(c.id), color: CHART_COLORS[i % CHART_COLORS.length] }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);
  const legend = slices
    .map((s) => `<li><span class="swatch" style="background:${s.color}"></span>${s.label}<span class="legend-figure">${formatIDR(s.value)} · ${percentOf(s.value, spent)}%</span></li>`)
    .join('');

  root.innerHTML = `
  <div class="page-head">
    <h1>Ringkasan ${HOUSEHOLD.monthLabel}</h1>
    <p>${HOUSEHOLD.name} — ${HOUSEHOLD.members}. Tinggal di ${HOUSEHOLD.home.toLowerCase()}. ${HOUSEHOLD.incomeNote}. Angka di bawah adalah posisi sampai 26 November 2026.</p>
  </div>

  <div class="grid grid-4">
    ${statCard('Pemasukan bulan ini', formatIDR(income), 'Dua gaji sudah masuk semua', true)}
    ${statCard('Pengeluaran', formatIDR(spent), `${percentOf(spent, income)}% dari pemasukan`)}
    ${statCard('Ditabung ke target', formatIDR(saved), 'Dana darurat, liburan, laptop')}
    ${statCard('Sisa belum teralokasi', formatIDR(remaining), 'Buffer sampai gajian berikutnya')}
  </div>

  <div class="grid grid-2" style="margin-top:16px">
    <section class="card">
      <h3 class="card-title">Pengeluaran per kategori</h3>
      ${svgDonut(slices, formatIDRShort(spent), 'total keluar')}
      <ul class="legend">${legend}</ul>
    </section>
    <section class="card">
      <h3 class="card-title">Anggaran per kategori</h3>
      ${getCategories().map(budgetRow).join('')}
    </section>
  </div>

  <h2 class="section-title">Arus kas 6 bulan terakhir</h2>
  <section class="card">
    ${svgBars(HISTORY)}
    <div class="chart-key"><span><span class="swatch" style="background:#0f5e5c"></span>Pemasukan</span><span><span class="swatch" style="background:#e8a33d"></span>Pengeluaran</span><span>November adalah bulan berjalan (s.d. 26 Nov).</span></div>
  </section>

  <div class="grid grid-2">
    <section class="card">
      <h3 class="card-title">Tagihan berikutnya</h3>
      ${unpaid.length === 0
        ? '<p class="empty-note">Semua tagihan November sudah lunas. 🎉</p>'
        : `<table class="ledger"><tbody>${unpaid.map((b) => `<tr><td>${b.name}</td><td>Jatuh tempo tgl ${b.dueDay}</td><td class="num">${formatIDR(b.amount)}</td></tr>`).join('')}</tbody></table>
           <p class="stat-note" style="margin-top:10px">Tandai lunas di halaman <a href="#/bills">Tagihan</a> begitu dibayar.</p>`}
      <h3 class="card-title" style="margin-top:18px">Target terdekat</h3>
      ${goals.map((g) => `<div class="budget-row"><div class="row-top"><span>${g.name}</span><span class="figures"><strong>${formatIDR(g.saved)}</strong> / ${formatIDR(g.target)}</span></div><div class="bar-track"><div class="bar-fill" style="width:${percentOf(g.saved, g.target)}%"></div></div><p class="stat-note">${percentOf(g.saved, g.target)}% terkumpul · ${goalMonthsLeft(g)} bulan lagi dengan setoran sekarang</p></div>`).join('')}
    </section>
    <section class="card">
      <h3 class="card-title">Transaksi terakhir</h3>
      <table class="ledger"><tbody>
        ${recent.map((t) => `<tr><td>${formatDate(t.date)}</td><td>${t.text}</td><td class="num ${t.type === 'in' ? 'amount-in' : t.type === 'save' ? 'amount-save' : 'amount-out'}">${t.type === 'in' ? '+' : '−'} ${formatIDR(t.amount)}</td></tr>`).join('')}
      </tbody></table>
      <p style="margin:12px 0 0"><a href="#/transactions">Lihat semua transaksi →</a></p>
    </section>
  </div>`;
}
