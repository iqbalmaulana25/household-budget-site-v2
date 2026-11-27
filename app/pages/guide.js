// pages/guide.js — the written half of the site: the family's routine,
// its adapted 50/30/20 split, sinking funds, and the over-budget playbook.
// Static prose, but every figure in it is the family's real November figure.
import { formatIDR } from '../format.js';

export default function renderGuide(root) {
  root.innerHTML = `
  <div class="page-head">
    <h1>Panduan anggaran ala Mahesa</h1>
    <p>Cara keluarga ini menjalankan anggarannya, ditulis seperti kami menjalankannya — dengan angka November 2026 yang sebenarnya, bukan contoh bulat dari buku.</p>
  </div>

  <div class="guide-body">
    <h2>Rutinitas 30 menit di awal bulan</h2>
    <ol>
      <li><strong>Catat dua gajian sebagai satu pemasukan.</strong> Gaji Sinta masuk tgl 1 (Rp 4.950.000), gaji Raka tgl 25 (Rp 11.900.000). Keduanya digabung jadi satu angka rencana: ${formatIDR(16850000)}.</li>
      <li><strong>Pindahkan uang tagihan lebih dulu.</strong> ${formatIDR(6019400)} untuk 9 tagihan rutin dipindah ke rekening khusus tagihan (lihat halaman Tagihan), jadi tidak tercampur uang belanja.</li>
      <li><strong>Setor ke target di hari gajian.</strong> Total ${formatIDR(3000000)} dibagi ke empat target — dana darurat didahulukan. Menabung di awal, bukan dari sisa, adalah satu-satunya cara versi kami yang terbukti jalan.</li>
      <li><strong>Bagi sisanya per kategori.</strong> Angka per kategori ada di Perencana; yang paling sering berubah adalah belanja dapur dan makan di luar.</li>
      <li><strong>Cek 10 menit tiap Minggu malam.</strong> Buka Ringkasan, lihat kategori mana yang sudah di atas 85% sebelum tanggal 20. November ini dua yang menyala kuning-merah: kontrakan &amp; rumah (104%) dan listrik, air &amp; internet (103%).</li>
    </ol>

    <h2>50/30/20 versi Depok: 67/11/18</h2>
    <p>Aturan populer 50/30/20 (50% kebutuhan, 30% keinginan, 20% tabungan) tidak muat untuk keluarga berpenghasilan ${formatIDR(16850000)} dengan kontrakan ${formatIDR(3500000)} dan dua anak di Jabodetabek. Kebutuhan pokok kami saja — kontrakan, dapur, listrik, transportasi, sekolah, kesehatan — berjumlah ${formatIDR(11350000)}, alias 67% pemasukan. Memaksakan 50% hanya menghasilkan anggaran yang selalu "gagal" dan akhirnya ditinggalkan.</p>
    <p>Jadi patokan yang dipakai keluarga ini: <strong>kebutuhan ≤ 68%, keinginan ≤ 12%, berbagi 4%, tabungan ≥ 16%</strong>. Keinginan memang jauh di bawah 30% — itu harga dari memilih menabung 18%. Kalau pemasukan naik, separuh kenaikannya masuk tabungan dulu sebelum gaya hidup ikut naik.</p>

    <div class="callout"><p><strong>Prinsipnya:</strong> patokan yang realistis dan dipatuhi 12 bulan mengalahkan patokan ideal yang ditinggalkan di bulan kedua.</p></div>

    <h2>Dana tenggelam (sinking funds) untuk biaya tahunan</h2>
    <p>Biaya besar yang datangnya jarang — servis besar motor, perpanjang STNK, liburan, uang pangkal sekolah — tidak boleh mengejutkan. Caranya: bagi biaya tahunan dengan 12, setor tiap bulan ke targetnya sendiri.</p>
    <table class="ledger">
      <thead><tr><th>Kebutuhan</th><th>Perkiraan biaya</th><th class="num">Setoran / bulan</th></tr></thead>
      <tbody>
        <tr><td>Uang pangkal SD Bima (2028)</td><td>${formatIDR(20000000)}</td><td class="num">${formatIDR(900000)}</td></tr>
        <tr><td>Liburan keluarga tahunan</td><td>${formatIDR(12000000)}</td><td class="num">${formatIDR(600000)}</td></tr>
        <tr><td>Ganti laptop Sinta</td><td>${formatIDR(9500000)}</td><td class="num">${formatIDR(500000)}</td></tr>
        <tr><td>Dana darurat menuju 3x biaya hidup</td><td>${formatIDR(45000000)}</td><td class="num">${formatIDR(1000000)}</td></tr>
      </tbody>
    </table>

    <h2>Kalau sebuah kategori lewat anggaran</h2>
    <ul>
      <li><strong>Bedakan sekali vs pola.</strong> Sepatu Nara jebol (Rp 219.000) itu kejadian sekali; belanja dapur naik 3 bulan berturut-turut itu pola — yang pola diubah anggarannya atau kebiasaannya, yang sekali cukup dicatat.</li>
      <li><strong>Geser, jangan tambah.</strong> Kelebihan kontrakan &amp; rumah bulan ini (${formatIDR(153000)}) ditutup dari kategori hiburan yang baru terpakai 94% — total bulan tetap sama.</li>
      <li><strong>Jangan sentuh setoran target untuk belanja harian.</strong> Kalau memang harus dikurangi, kurangi bulan depan secara sadar di Perencana, bukan diam-diam berhenti.</li>
      <li><strong>Tulis sebabnya di keterangan transaksi.</strong> "Sepatu sekolah Nara (yang lama jebol)" bisa diaudit bulan depan; "belanja" saja tidak bisa.</li>
    </ul>

    <h2>Angka November sekilas</h2>
    <p>Pemasukan ${formatIDR(16850000)} · pengeluaran ${formatIDR(11962500)} · ditabung ${formatIDR(2100000)} · sisa belum teralokasi ${formatIDR(2787500)} yang akan diputuskan di cek Minggu malam terakhir: separuh ke dana darurat, separuh menjadi bujet belanja awal Desember. Semua angka ini hidup di halaman lain situs ini — ubah transaksinya, dan ringkasannya ikut berubah.</p>
  </div>`;
}
