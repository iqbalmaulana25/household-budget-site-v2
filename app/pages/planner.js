// pages/planner.js — plan next month: editable category budgets, the
// 50/30/20 calculator, and the emergency-fund calculator.
import {
  getCategories, spentByCategory, setCategoryBudget,
  spentByKind, budgetByKind, monthIncome, monthSpent,
} from '../store.js';
import { formatIDR, percentOf, parseAmount, monthsLabel } from '../format.js';

function splitRow(label, actualPct, targetPct, actualAmount) {
  return `<div class="budget-row">
    <div class="row-top"><span>${label}</span><span class="figures">nyata <strong>${actualPct}%</strong> · patokan ${targetPct}% · ${formatIDR(actualAmount)}</span></div>
    <div class="bar-track"><div class="bar-fill ${actualPct > targetPct ? 'warn' : ''}" style="width:${Math.min(actualPct, 100)}%"></div></div>
  </div>`;
}

export default function renderPlanner(root, rerender) {
  const income = monthIncome();
  const needsBudget = budgetByKind('needs');
  const wantsBudget = budgetByKind('wants');
  const givingBudget = budgetByKind('giving');
  const plannedSave = income - needsBudget - wantsBudget - givingBudget;

  root.innerHTML = `
  <div class="page-head">
    <h1>Perencana anggaran</h1>
    <p>Tiga alat untuk merencanakan bulan depan dari angka bulan ini: ubah anggaran per kategori, uji pemasukan dengan aturan 50/30/20, dan hitung kebutuhan dana darurat. Semua alat bekerja langsung — tidak ada tombol "simpan" yang pura-pura.</p>
  </div>

  <section class="card">
    <h3 class="card-title">Anggaran per kategori (bisa diubah)</h3>
    <p class="stat-note" style="margin-bottom:8px">Ketik angka baru lalu tekan Enter atau pindah kolom. Total rencana saat ini: kebutuhan ${formatIDR(needsBudget)} · keinginan ${formatIDR(wantsBudget)} · berbagi ${formatIDR(givingBudget)} · direncanakan ditabung ${formatIDR(plannedSave)} dari pemasukan ${formatIDR(income)}.</p>
    ${getCategories().map((c) => {
      const spent = spentByCategory(c.id);
      const pct = percentOf(spent, c.budget);
      return `<div class="budget-row">
        <div class="row-top"><span>${c.name}</span><span class="figures">terpakai <strong>${formatIDR(spent)}</strong> (${pct}%)</span></div>
        <div class="bar-track"><div class="bar-fill ${pct >= 100 ? 'over' : pct >= 85 ? 'warn' : ''}" style="width:${Math.min(pct, 100)}%"></div></div>
        <label class="field" style="max-width:220px;margin-top:6px">Anggaran / bulan (Rp)<input type="text" inputmode="numeric" value="${c.budget}" data-budget="${c.id}"></label>
      </div>`;
    }).join('')}
  </section>

  <div class="grid grid-2" style="margin-top:16px">
    <section class="card">
      <h3 class="card-title">Kalkulator 50/30/20</h3>
      <p class="stat-note">Aturan praktis: 50% kebutuhan, 30% keinginan, 20% tabungan. Geser pemasukan untuk melihat patokannya, lalu bandingkan dengan pola nyata keluarga ini.</p>
      <label class="field" style="margin-top:10px">Pemasukan bulanan: <strong id="split-income-label">${formatIDR(income)}</strong>
        <input type="range" id="split-income" min="5000000" max="30000000" step="250000" value="${income}">
      </label>
      <div id="split-result" style="margin-top:12px"></div>
      <div class="callout"><p>Pola nyata November: kebutuhan ${percentOf(spentByKind('needs'), monthSpent())}% dari pengeluaran, keinginan ${percentOf(spentByKind('wants'), monthSpent())}%, berbagi ${percentOf(spentByKind('giving'), monthSpent())}%. Dengan kontrakan + dua anak di Depok, kebutuhan keluarga ini memang di atas 50% pemasukan — jadi patokan yang dipakai adalah versi longgar: kebutuhan ≤ 68%, tabungan ≥ 16%.</p></div>
    </section>

    <section class="card">
      <h3 class="card-title">Kalkulator dana darurat</h3>
      <p class="stat-note">Dana darurat = pengeluaran bulanan x jumlah bulan pengaman. Keluarga dengan dua anak dan satu kontrakan memakai 6 bulan sebagai target akhir; 3 bulan adalah garis aman pertama.</p>
      <label class="field" style="margin-top:10px">Pengeluaran bulanan rata-rata
        <input type="text" id="ef-spend" inputmode="numeric" value="${monthSpent()}">
      </label>
      <label class="field" style="margin-top:10px">Bulan pengaman: <strong id="ef-months-label">3 bulan</strong>
        <input type="range" id="ef-months" min="1" max="12" step="1" value="3">
      </label>
      <p style="font-size:19px;margin:14px 0 4px">Target dana darurat: <strong id="ef-target"></strong></p>
      <p class="stat-note" id="ef-note"></p>
    </section>
  </div>`;

  root.querySelectorAll('[data-budget]').forEach((input) => {
    input.addEventListener('change', () => {
      const value = parseAmount(input.value);
      if (Number.isFinite(value) && value >= 0) {
        setCategoryBudget(input.dataset.budget, value);
        rerender();
      }
    });
  });

  const splitResult = root.querySelector('#split-result');
  const splitLabel = root.querySelector('#split-income-label');
  function drawSplit(value) {
    splitLabel.textContent = formatIDR(value);
    splitResult.innerHTML =
      splitRow('Kebutuhan (50%)', percentOf(value * 0.5, value), 50, value * 0.5) +
      splitRow('Keinginan (30%)', percentOf(value * 0.3, value), 30, value * 0.3) +
      splitRow('Tabungan (20%)', percentOf(value * 0.2, value), 20, value * 0.2);
  }
  root.querySelector('#split-income').addEventListener('input', (e) => drawSplit(Number(e.target.value)));
  drawSplit(income);

  const efTarget = root.querySelector('#ef-target');
  const efNote = root.querySelector('#ef-note');
  const efMonthsLabel = root.querySelector('#ef-months-label');
  function drawEmergency() {
    const spend = parseAmount(root.querySelector('#ef-spend').value);
    const months = Number(root.querySelector('#ef-months').value);
    efMonthsLabel.textContent = monthsLabel(months);
    if (!Number.isFinite(spend) || spend <= 0) {
      efTarget.textContent = '—';
      efNote.textContent = 'Isi pengeluaran bulanan dengan angka untuk melihat targetnya.';
      return;
    }
    const target = spend * months;
    efTarget.textContent = formatIDR(target);
    efNote.textContent = `Dana darurat keluarga ini sekarang Rp 18.750.000 — setara ${(18750000 / spend).toFixed(1).replace('.', ',')} bulan pengeluaran pada angka ini.`;
  }
  root.querySelector('#ef-spend').addEventListener('input', drawEmergency);
  root.querySelector('#ef-months').addEventListener('input', drawEmergency);
  drawEmergency();
}
