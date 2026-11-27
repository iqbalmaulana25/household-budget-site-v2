// pages/bills.js — the month's fixed commitments and what is still due.
import { getBills, categoryById, setBillPaid, billsTotal, billsUnpaid } from '../store.js';
import { formatIDR } from '../format.js';

export default function renderBills(root, rerender) {
  const bills = getBills();
  const total = billsTotal();
  const unpaid = billsUnpaid();
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const paidTotal = total - unpaidTotal;

  root.innerHTML = `
  <div class="page-head">
    <h1>Tagihan rutin November</h1>
    <p>Sembilan tagihan yang selalu datang tiap bulan, dari kontrakan sampai iuran RT. Total beban tetap keluarga ini ${formatIDR(total)} per bulan — ${formatIDR(total * 12)} setahun. Centang "Lunas" begitu tagihan dibayar; ringkasan di bawah langsung berubah.</p>
  </div>

  <div class="grid grid-3">
    <section class="card stat"><div class="stat-label">Total tagihan / bulan</div><div class="stat-value">${formatIDR(total)}</div><p class="stat-note">9 tagihan rutin</p></section>
    <section class="card stat"><div class="stat-label">Sudah lunas</div><div class="stat-value">${formatIDR(paidTotal)}</div><p class="stat-note">${bills.length - unpaid.length} dari ${bills.length} tagihan</p></section>
    <section class="card stat"><div class="stat-label">Masih harus dibayar</div><div class="stat-value">${formatIDR(unpaidTotal)}</div><p class="stat-note">${unpaid.length === 0 ? 'Bulan ini bersih 🎉' : unpaid.map((b) => `${b.name} (tgl ${b.dueDay})`).join(', ')}</p></section>
  </div>

  <section class="card" style="margin-top:16px">
    <div class="table-scroll">
      <table class="ledger">
        <thead><tr><th>Tagihan</th><th>Kategori</th><th>Jatuh tempo</th><th class="num">Jumlah</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${bills.map((b) => `<tr>
            <td><strong>${b.name}</strong></td>
            <td>${categoryById(b.category).name}</td>
            <td>Tanggal ${b.dueDay}</td>
            <td class="num">${formatIDR(b.amount)}</td>
            <td>${b.paid ? '<span class="pill">Lunas</span>' : '<span class="pill warn">Belum dibayar</span>'}</td>
            <td class="num"><button class="btn ${b.paid ? 'btn-ghost' : ''} btn-small" type="button" data-toggle="${b.id}">${b.paid ? 'Batalkan' : 'Tandai lunas'}</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <p class="stat-note" style="margin-top:12px">Urutan jatuh tempo sengaja disebar: tgl 5–15 untuk yang besar (kontrakan, SPP, BPJS), tgl 20–28 untuk langganan — supaya tidak menumpuk di minggu gajian Sinta saja.</p>
  </section>

  <section class="card" style="margin-top:16px">
    <h3 class="card-title">Kenapa tagihan dipisah dari transaksi?</h3>
    <p style="margin:0">Transaksi adalah yang sudah terjadi; tagihan adalah janji yang akan datang. Dengan daftar ini, keluarga Mahesa menyisihkan ${formatIDR(total)} di awal bulan ke rekening khusus tagihan, jadi uang belanja harian tidak pernah "merasa lebih banyak" daripada kenyataannya. Sisa tagihan bulan ini: ${formatIDR(unpaidTotal)}.</p>
  </section>`;

  root.querySelectorAll('[data-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const bill = bills.find((b) => b.id === button.dataset.toggle);
      setBillPaid(bill.id, !bill.paid);
      rerender();
    });
  });
}
