// pages/goals.js — four savings goals with live progress and top-up buttons.
import { getGoals, addToGoal, goalMonthsLeft, goalEtaLabel } from '../store.js';
import { formatIDR, percentOf, monthsLabel } from '../format.js';

const TOP_UP = 250000;

export default function renderGoals(root, rerender) {
  const goals = getGoals();
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalMonthly = goals.reduce((s, g) => s + g.monthly, 0);

  root.innerHTML = `
  <div class="page-head">
    <h1>Target tabungan</h1>
    <p>Empat target berjalan bersamaan. Keluarga Mahesa menyetor total ${formatIDR(totalMonthly)} per bulan — dipotong di hari gajian, sebelum uangnya sempat "bocor" ke belanja harian. Tombol setor menambah ${formatIDR(TOP_UP)} dari sisa bulan ini dan langsung mengubah progres.</p>
  </div>

  <div class="grid grid-3">
    <section class="card stat"><div class="stat-label">Total terkumpul</div><div class="stat-value">${formatIDR(totalSaved)}</div><p class="stat-note">dari target gabungan ${formatIDR(totalTarget)}</p></section>
    <section class="card stat"><div class="stat-label">Setoran rutin / bulan</div><div class="stat-value">${formatIDR(totalMonthly)}</div><p class="stat-note">${percentOf(totalMonthly, 16850000)}% dari pemasukan keluarga</p></section>
    <section class="card stat"><div class="stat-label">Progres gabungan</div><div class="stat-value">${percentOf(totalSaved, totalTarget)}%</div><p class="stat-note">Dana darurat didahulukan sampai penuh</p></section>
  </div>

  <div class="grid grid-2" style="margin-top:16px">
    ${goals.map((g) => {
      const pct = percentOf(g.saved, g.target);
      const left = goalMonthsLeft(g);
      return `<section class="card">
        <div class="goal-head"><h3 class="card-title" style="margin:0">${g.name}</h3><span class="pill">${pct}%</span></div>
        <p class="goal-figures"><strong>${formatIDR(g.saved)}</strong> dari ${formatIDR(g.target)}</p>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
        <p class="goal-note">${g.note}</p>
        <p class="stat-note">Setoran rutin ${formatIDR(g.monthly)}/bulan · kurang ${formatIDR(g.target - g.saved)} · selesai dalam ${monthsLabel(left)} (± ${goalEtaLabel(g)})</p>
        <button class="btn btn-small" type="button" data-topup="${g.id}" ${g.saved >= g.target ? 'disabled' : ''}>Setor ${formatIDR(TOP_UP)}</button>
      </section>`;
    }).join('')}
  </div>

  <section class="card" style="margin-top:16px">
    <h3 class="card-title">Urutan prioritas kalau uangnya pas-pasan</h3>
    <p style="margin:0">Dana darurat selalu diisi pertama — itu yang membuat keluarga ini tidak perlu utang saat motor rusak atau ada yang sakit. Liburan boleh melambat sebulan, laptop bisa menunggu, tapi dana darurat tidak dinegosiasi. Dana masuk SD Bima justru dimulai paling awal karena jalannya paling panjang: ${formatIDR(goals[3].monthly)} per bulan terasa ringan di 2026, jauh lebih ringan daripada mengejar ${formatIDR(goals[3].target)} di 2028.</p>
  </section>`;

  root.querySelectorAll('[data-topup]').forEach((button) => {
    button.addEventListener('click', () => {
      addToGoal(button.dataset.topup, TOP_UP);
      rerender();
    });
  });
}
