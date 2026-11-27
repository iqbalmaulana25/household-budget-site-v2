// pages/transactions.js — the ledger: every November transaction, with
// search, filters, sorting, and working add / delete controls.
import {
  getCategories, getTransactions, categoryById,
  addTransaction, deleteTransaction,
} from '../store.js';
import { formatIDR, formatDate, parseAmount } from '../format.js';

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const TYPE_LABEL = { in: 'Masuk', out: 'Keluar', save: 'Tabungan' };

export default function renderTransactions(root, rerender) {
  const categories = getCategories();
  let query = '';
  let categoryFilter = 'all';
  let typeFilter = 'all';
  let sortBy = 'date-desc';

  root.innerHTML = `
  <div class="page-head">
    <h1>Transaksi November 2026</h1>
    <p>Semua uang masuk, keluar, dan yang dipindah ke target tabungan. Tambah transaksi lewat formulir — dasbor, anggaran, dan grafik langsung ikut berubah. Perubahan tersimpan di browser ini.</p>
  </div>

  <section class="card" style="margin-bottom:16px">
    <h3 class="card-title">Tambah transaksi</h3>
    <form class="inline-form" id="add-form">
      <label class="field">Tanggal<input type="date" name="date" value="2026-11-27" min="2026-11-01" max="2026-11-30" required></label>
      <label class="field">Keterangan<input type="text" name="text" placeholder="cth. Belanja — Pasar Segar" required maxlength="80"></label>
      <label class="field">Kategori<select name="category">
        ${categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}
        <option value="income">Pemasukan</option>
        <option value="savings">Tabungan</option>
      </select></label>
      <label class="field">Jenis<select name="type">
        <option value="out">Keluar</option>
        <option value="in">Masuk</option>
        <option value="save">Pindah ke tabungan</option>
      </select></label>
      <label class="field">Jumlah (Rp)<input type="text" name="amount" inputmode="numeric" placeholder="150.000" required></label>
      <button class="btn" type="submit">Tambah</button>
    </form>
    <p class="stat-note" id="form-note" role="status"></p>
  </section>

  <section class="card">
    <div class="toolbar">
      <label class="field">Cari<input type="search" id="q" placeholder="pasar, bensin, gaji…"></label>
      <label class="field">Kategori<select id="f-category">
        <option value="all">Semua kategori</option>
        ${categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}
        <option value="income">Pemasukan</option>
        <option value="savings">Tabungan</option>
      </select></label>
      <label class="field">Jenis<select id="f-type">
        <option value="all">Semua jenis</option>
        <option value="in">Masuk</option>
        <option value="out">Keluar</option>
        <option value="save">Tabungan</option>
      </select></label>
      <label class="field">Urutkan<select id="f-sort">
        <option value="date-desc">Tanggal terbaru</option>
        <option value="date-asc">Tanggal terlama</option>
        <option value="amount-desc">Jumlah terbesar</option>
        <option value="amount-asc">Jumlah terkecil</option>
      </select></label>
    </div>
    <p class="stat-note" id="table-summary"></p>
    <div class="table-scroll">
      <table class="ledger">
        <thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th>Jenis</th><th class="num">Jumlah</th><th></th></tr></thead>
        <tbody id="tx-body"></tbody>
      </table>
    </div>
  </section>`;

  const body = root.querySelector('#tx-body');
  const summary = root.querySelector('#table-summary');

  function categoryName(t) {
    if (t.category === 'income') return 'Pemasukan';
    if (t.category === 'savings') return 'Tabungan';
    return categoryById(t.category).name;
  }

  function draw() {
    let rows = getTransactions().filter((t) => {
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (query && !t.text.toLowerCase().includes(query)) return false;
      return true;
    });
    rows.sort((a, b) => {
      if (sortBy === 'date-desc') return a.date < b.date ? 1 : -1;
      if (sortBy === 'date-asc') return a.date > b.date ? 1 : -1;
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      return a.amount - b.amount;
    });
    const totalOut = rows.filter((t) => t.type === 'out').reduce((s, t) => s + t.amount, 0);
    summary.textContent = `${rows.length} transaksi cocok · total keluar pada tampilan ini ${formatIDR(totalOut)}`;
    body.innerHTML = rows.length === 0
      ? '<tr><td colspan="6" class="empty-note">Tidak ada transaksi yang cocok dengan filter ini.</td></tr>'
      : rows.map((t) => `<tr>
          <td>${formatDate(t.date)}</td>
          <td>${escapeHtml(t.text)}</td>
          <td>${categoryName(t)}</td>
          <td>${TYPE_LABEL[t.type]}</td>
          <td class="num ${t.type === 'in' ? 'amount-in' : t.type === 'save' ? 'amount-save' : 'amount-out'}">${t.type === 'in' ? '+' : '−'} ${formatIDR(t.amount)}</td>
          <td class="num"><button class="btn btn-danger btn-small" type="button" data-delete="${t.id}">Hapus</button></td>
        </tr>`).join('');
    body.querySelectorAll('[data-delete]').forEach((button) => {
      button.addEventListener('click', () => {
        deleteTransaction(button.dataset.delete);
        draw();
      });
    });
  }

  root.querySelector('#q').addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); draw(); });
  root.querySelector('#f-category').addEventListener('change', (e) => { categoryFilter = e.target.value; draw(); });
  root.querySelector('#f-type').addEventListener('change', (e) => { typeFilter = e.target.value; draw(); });
  root.querySelector('#f-sort').addEventListener('change', (e) => { sortBy = e.target.value; draw(); });

  root.querySelector('#add-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const amount = parseAmount(form.get('amount'));
    const note = root.querySelector('#form-note');
    if (!Number.isFinite(amount) || amount <= 0) {
      note.textContent = 'Jumlahnya belum terbaca — isi angka saja, misalnya 150.000.';
      return;
    }
    addTransaction({
      date: form.get('date'),
      text: String(form.get('text')).trim(),
      category: form.get('category'),
      type: form.get('type'),
      amount,
    });
    note.textContent = `Tercatat: ${form.get('text')} — ${formatIDR(amount)}.`;
    e.target.reset();
    e.target.elements.date.value = '2026-11-27';
    draw();
  });

  draw();
}
