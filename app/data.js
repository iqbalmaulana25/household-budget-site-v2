// data.js — the Mahesa family's money, as first-run seed data.
// One job: hold the starting figures. The store (store.js) copies these into
// localStorage on first run; after that the family's own edits win and this
// file is only the "reset" source. Every figure is in rupiah (IDR).

export const HOUSEHOLD = {
  name: 'Keluarga Mahesa',
  members: 'Raka (34, desainer produk) · Sinta (32, guru SD) · Nara (7) · Bima (4)',
  home: 'Rumah kontrakan di Depok, Jawa Barat',
  monthLabel: 'November 2026',
  // Take-home pay: Raka is paid on the 25th, Sinta on the 1st.
  incomeNote: 'Gaji Raka Rp 11.900.000 (tgl 25) + gaji Sinta Rp 4.950.000 (tgl 1)',
};

// kind: 'needs' (kebutuhan), 'wants' (keinginan) or 'giving' (berbagi).
// budget is the monthly plan for November 2026.
export const CATEGORIES = [
  { id: 'housing', name: 'Kontrakan & rumah', kind: 'needs', budget: 3500000 },
  { id: 'groceries', name: 'Belanja dapur & pasar', kind: 'needs', budget: 2950000 },
  { id: 'utilities', name: 'Listrik, air & internet', kind: 'needs', budget: 1150000 },
  { id: 'transport', name: 'Transportasi & bensin', kind: 'needs', budget: 1300000 },
  { id: 'kids', name: 'Anak & sekolah', kind: 'needs', budget: 1600000 },
  { id: 'health', name: 'Kesehatan & BPJS', kind: 'needs', budget: 850000 },
  { id: 'eatingout', name: 'Makan di luar & kopi', kind: 'wants', budget: 750000 },
  { id: 'shopping', name: 'Belanja & kebutuhan rumah', kind: 'wants', budget: 700000 },
  { id: 'fun', name: 'Hiburan & langganan', kind: 'wants', budget: 450000 },
  { id: 'giving', name: 'Orang tua & berbagi', kind: 'giving', budget: 600000 },
];

// type: 'in' money arriving, 'out' spending, 'save' a transfer to a goal.
export const TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', text: 'Gaji Sinta — SD Tunas Bangsa', category: 'income', type: 'in', amount: 4950000 },
  { id: 't02', date: '2026-11-01', text: 'Transfer ke Dana Darurat', category: 'savings', type: 'save', amount: 1000000 },
  { id: 't03', date: '2026-11-02', text: 'Belanja mingguan — Pasar Segar Depok', category: 'groceries', type: 'out', amount: 486500 },
  { id: 't04', date: '2026-11-02', text: 'Beras 10 kg + minyak — Toko Beras Sari', category: 'groceries', type: 'out', amount: 218000 },
  { id: 't05', date: '2026-11-03', text: 'Bensin Pertalite — SPBU Margonda', category: 'transport', type: 'out', amount: 150000 },
  { id: 't06', date: '2026-11-03', text: 'KRL + ojek online (5 hari kerja Raka)', category: 'transport', type: 'out', amount: 176000 },
  { id: 't07', date: '2026-11-04', text: 'Token listrik PLN 500 kWh', category: 'utilities', type: 'out', amount: 512000 },
  { id: 't08', date: '2026-11-05', text: 'Kontrakan bulan November', category: 'housing', type: 'out', amount: 3500000 },
  { id: 't09', date: '2026-11-05', text: 'Galon + gas LPG 3 kg', category: 'housing', type: 'out', amount: 78000 },
  { id: 't10', date: '2026-11-06', text: 'SPP Nara bulan November', category: 'kids', type: 'out', amount: 625000 },
  { id: 't11', date: '2026-11-06', text: 'Buku paket + alat tulis Nara', category: 'kids', type: 'out', amount: 164000 },
  { id: 't12', date: '2026-11-07', text: 'Makan keluarga — Bakso Lapangan Tembak', category: 'eatingout', type: 'out', amount: 187000 },
  { id: 't13', date: '2026-11-08', text: 'Belanja mingguan — Superindo Depok', category: 'groceries', type: 'out', amount: 512300 },
  { id: 't14', date: '2026-11-08', text: 'Susu + popok Bima', category: 'kids', type: 'out', amount: 342000 },
  { id: 't15', date: '2026-11-09', text: 'Servis motor + ganti oli', category: 'transport', type: 'out', amount: 285000 },
  { id: 't16', date: '2026-11-10', text: 'Iuran BPJS Kesehatan keluarga', category: 'health', type: 'out', amount: 350000 },
  { id: 't17', date: '2026-11-10', text: 'Vitamin + obat — Apotek K-24', category: 'health', type: 'out', amount: 128500 },
  { id: 't18', date: '2026-11-11', text: 'Kirim ke orang tua di Solo', category: 'giving', type: 'out', amount: 500000 },
  { id: 't19', date: '2026-11-12', text: 'Iuran RT/RW + keamanan', category: 'housing', type: 'out', amount: 75000 },
  { id: 't20', date: '2026-11-12', text: 'Pulsa + paket data 2 nomor', category: 'utilities', type: 'out', amount: 150000 },
  { id: 't21', date: '2026-11-13', text: 'Kopi + roti (jajan kantor Raka)', category: 'eatingout', type: 'out', amount: 96000 },
  { id: 't22', date: '2026-11-14', text: 'Deterjen, sabun, tisu — belanja bulanan', category: 'shopping', type: 'out', amount: 264700 },
  { id: 't23', date: '2026-11-15', text: 'Tagihan air PDAM', category: 'utilities', type: 'out', amount: 132400 },
  { id: 't24', date: '2026-11-15', text: 'Belanja mingguan — Pasar Segar Depok', category: 'groceries', type: 'out', amount: 468200 },
  { id: 't25', date: '2026-11-16', text: 'Les renang Nara (4x pertemuan)', category: 'kids', type: 'out', amount: 200000 },
  { id: 't26', date: '2026-11-17', text: 'Bensin Pertalite — SPBU Margonda', category: 'transport', type: 'out', amount: 150000 },
  { id: 't27', date: '2026-11-18', text: 'Periksa gigi Bima — Klinik Gigi Sehat', category: 'health', type: 'out', amount: 175000 },
  { id: 't28', date: '2026-11-19', text: 'Ayam, telur, sayur — Pasar Segar', category: 'groceries', type: 'out', amount: 296800 },
  { id: 't29', date: '2026-11-20', text: 'IndiHome internet + TV', category: 'utilities', type: 'out', amount: 389000 },
  { id: 't30', date: '2026-11-21', text: 'Sepatu sekolah Nara (yang lama jebol)', category: 'kids', type: 'out', amount: 219000 },
  { id: 't31', date: '2026-11-22', text: 'Belanja mingguan — Superindo Depok', category: 'groceries', type: 'out', amount: 447600 },
  { id: 't32', date: '2026-11-22', text: 'Nonton bioskop + popcorn (keluarga)', category: 'fun', type: 'out', amount: 238000 },
  { id: 't33', date: '2026-11-23', text: 'Lampu + baterai + perkakas kecil', category: 'shopping', type: 'out', amount: 117500 },
  { id: 't34', date: '2026-11-24', text: 'Netflix + Spotify keluarga', category: 'fun', type: 'out', amount: 186000 },
  { id: 't35', date: '2026-11-25', text: 'Gaji Raka — Studio Kala', category: 'income', type: 'in', amount: 11900000 },
  { id: 't36', date: '2026-11-25', text: 'Transfer ke Liburan Yogyakarta', category: 'savings', type: 'save', amount: 600000 },
  { id: 't37', date: '2026-11-25', text: 'Transfer ke Laptop Sinta', category: 'savings', type: 'save', amount: 500000 },
  { id: 't38', date: '2026-11-26', text: 'Sate + es teh — traktiran kecil tim Raka', category: 'eatingout', type: 'out', amount: 143000 },
];

// Recurring bills. dueDay is the day of month; paid says whether November's
// bill is settled. Bills also appear in TRANSACTIONS once paid; this list is
// the schedule the family plans around.
export const BILLS = [
  { id: 'b1', name: 'Kontrakan rumah', dueDay: 5, amount: 3500000, category: 'housing', paid: true },
  { id: 'b2', name: 'SPP Nara — SD Tunas Bangsa', dueDay: 8, amount: 625000, category: 'kids', paid: true },
  { id: 'b3', name: 'BPJS Kesehatan (4 orang)', dueDay: 10, amount: 350000, category: 'health', paid: true },
  { id: 'b4', name: 'Token listrik PLN', dueDay: 10, amount: 512000, category: 'utilities', paid: true },
  { id: 'b5', name: 'Iuran RT/RW + keamanan', dueDay: 12, amount: 75000, category: 'housing', paid: true },
  { id: 'b6', name: 'Air PDAM Depok', dueDay: 15, amount: 132400, category: 'utilities', paid: true },
  { id: 'b7', name: 'IndiHome internet + TV', dueDay: 20, amount: 389000, category: 'utilities', paid: true },
  { id: 'b8', name: 'Netflix + Spotify keluarga', dueDay: 24, amount: 186000, category: 'fun', paid: true },
  { id: 'b9', name: 'Gym Raka (tahunan dibagi 12)', dueDay: 28, amount: 250000, category: 'fun', paid: false },
];

// Savings goals. monthly is the planned set-aside; saved is what is there now.
export const GOALS = [
  { id: 'g1', name: 'Dana darurat', target: 45000000, saved: 18750000, monthly: 1000000, note: 'Target 3x pengeluaran bulanan (Rp 45 jt). Saat ini setara 1,3 bulan biaya hidup.' },
  { id: 'g2', name: 'Liburan keluarga ke Yogyakarta', target: 12000000, saved: 4800000, monthly: 600000, note: 'Kereta PP 4 orang, 4 malam homestay, wisata Borobudur + Malioboro. Rencana berangkat Desember 2027.' },
  { id: 'g3', name: 'Laptop baru untuk Sinta', target: 9500000, saved: 6200000, monthly: 500000, note: 'Laptop lama baterainya drop; target beli sebelum tahun ajaran baru Juli 2027.' },
  { id: 'g4', name: 'Dana masuk SD Bima', target: 20000000, saved: 3250000, monthly: 900000, note: 'Uang pangkal + seragam saat Bima masuk SD tahun 2028. Jalan paling panjang, mulai paling awal.' },
];

// Six months of cash flow for the trend chart (November is month to date).
export const HISTORY = [
  { month: 'Juni', income: 16400000, spent: 12840000 },
  { month: 'Juli', income: 16850000, spent: 13960000 },
  { month: 'Agustus', income: 16850000, spent: 12475000 },
  { month: 'September', income: 17300000, spent: 14180000 },
  { month: 'Oktober', income: 16850000, spent: 13025000 },
  { month: 'November', income: 16850000, spent: 11962500 },
];
