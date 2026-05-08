// ============================================================
// MOCK DATA — Florent App v2.0
// Images, Custom Design Themes, and WhatsApp integration
// ============================================================

const BASE = import.meta.env.BASE_URL || '/';
const img = (path) => `${BASE}${path.startsWith('/') ? path.slice(1) : path}`;

export const KATEGORI_OPTIONS = ['Papan Bunga', 'Bouquet', 'Standing Flower', 'Table Arrangement', 'Banner Wisuda', 'Spanduk Custom'];
export const WARNA_OPTIONS = ['Merah & Putih', 'Pink & Putih', 'Kuning & Merah', 'Ungu & Putih', 'Putih', 'Merah', 'Navy & Gold', 'Hitam & Emas'];
export const TEMA_OPTIONS = ['Pernikahan', 'Duka Cita', 'Grand Opening', 'Anniversary', 'Ulang Tahun', 'Wisuda', 'Formal', 'Parodi'];

// ── WhatsApp Config ────────────────────────────────────────────
export const WHATSAPP_NUMBER = '6289529127505';
export const WHATSAPP_MESSAGE = 'Halo Florent! Saya tertarik dengan produk Anda.';

// ── Products ───────────────────────────────────────────────────
export const mockProducts = [
  { id: 1, nama_produk: 'Papan Bunga Happy Wedding', kategori: 'Papan Bunga', harga: 850000, stok: 25, deskripsi: 'Papan bunga pernikahan premium dengan rangkaian bunga segar pilihan. Cocok untuk ucapan selamat menikah yang elegan dan berkesan.', gambar: img('/images/products/papan-wedding.png') },
  { id: 2, nama_produk: 'Papan Bunga Duka Cita', kategori: 'Papan Bunga', harga: 750000, stok: 20, deskripsi: 'Papan bunga belasungkawa dengan desain elegan dan warna lembut. Menyampaikan simpati dengan penuh hormat.', gambar: img('/images/products/papan-dukacita.png') },
  { id: 3, nama_produk: 'Papan Bunga Grand Opening', kategori: 'Papan Bunga', harga: 950000, stok: 15, deskripsi: 'Papan bunga pembukaan usaha baru dengan desain megah dan warna ceria. Sempurna untuk merayakan grand opening.', gambar: img('/images/products/papan-opening.png') },
  { id: 4, nama_produk: 'Bouquet Rose Premium', kategori: 'Bouquet', harga: 450000, stok: 30, deskripsi: 'Rangkaian buket mawar premium 20 tangkai yang dibungkus elegan. Pilihan sempurna untuk hari spesial.', gambar: img('/images/products/bouquet-rose.png') },
  { id: 5, nama_produk: 'Standing Flower Congratulations', kategori: 'Standing Flower', harga: 1200000, stok: 10, deskripsi: 'Standing flower megah tinggi 2 meter dengan campuran bunga tropis dan mawar. Statement piece untuk acara besar.', gambar: img('/images/products/standing-flower.png') },
  { id: 6, nama_produk: 'Hand Bouquet Anniversary', kategori: 'Bouquet', harga: 350000, stok: 35, deskripsi: 'Hand bouquet romantis dengan mawar pink dan baby breath. Pilihan yang tepat untuk merayakan anniversary.', gambar: img('/images/products/bouquet-anniversary.png') },
  { id: 7, nama_produk: 'Papan Bunga Selamat & Sukses', kategori: 'Papan Bunga', harga: 800000, stok: 18, deskripsi: 'Papan bunga ucapan selamat dan sukses dengan warna-warna ceria. Cocok untuk berbagai acara perayaan.', gambar: img('/images/products/papan-sukses.png') },
  { id: 8, nama_produk: 'Table Arrangement Elegant', kategori: 'Table Arrangement', harga: 275000, stok: 40, deskripsi: 'Rangkaian bunga meja elegan dalam vas keramik premium. Sentuhan estetis untuk ruangan Anda.', gambar: img('/images/products/table-arrangement.png') },
];

// ── Custom Design Themes ───────────────────────────────────────
export const designThemes = [
  {
    id: 'superhero',
    nama: 'Tema Superhero',
    kategori: 'Parodi',
    deskripsi: 'Desain bergaya komik superhero dengan efek aksi, speech bubble, dan halftone. Jadikan wisudawan pahlawan kampus!',
    preview: img('/images/themes/superhero.png'),
    tags: ['Wisuda', 'Lucu', 'Trending'],
    harga_design: 150000,
    popularitas: 95,
  },
  {
    id: 'meme-parodi',
    nama: 'Tema Warung & Meme',
    kategori: 'Parodi',
    deskripsi: 'Spanduk bergaya warung Pecel Lele atau menu Mie Gacoan dengan "Menu Wisuda" yang kocak. Viral di Instagram!',
    preview: img('/images/themes/meme-parodi.png'),
    tags: ['Wisuda', 'Viral', 'Meme'],
    harga_design: 125000,
    popularitas: 98,
  },
  {
    id: 'local-brand',
    nama: 'Tema App Parodi',
    kategori: 'Parodi',
    deskripsi: 'Desain meniru tampilan app Shopee/Netflix/Spotify dengan foto wisudawan sebagai "product listing" lengkap rating bintang.',
    preview: img('/images/themes/local-brand.png'),
    tags: ['Wisuda', 'Kreatif', 'Modern'],
    harga_design: 135000,
    popularitas: 92,
  },
  {
    id: 'politik',
    nama: 'Tema Kampanye Politik',
    kategori: 'Parodi',
    deskripsi: 'Spanduk bergaya poster kampanye partai politik Indonesia. Lengkap dengan nomor urut, slogan, dan stempel resmi parodi.',
    preview: img('/images/themes/politik.png'),
    tags: ['Wisuda', 'Viral', 'Lucu'],
    harga_design: 140000,
    popularitas: 97,
  },
  {
    id: 'elegant',
    nama: 'Tema Formal Elegant',
    kategori: 'Formal',
    deskripsi: 'Desain mewah dan minimalis dengan aksen gold foil, tipografi serif, dan frame laurel wreath. Untuk kesan profesional.',
    preview: img('/images/themes/elegant.png'),
    tags: ['Wisuda', 'Formal', 'Premium'],
    harga_design: 175000,
    popularitas: 85,
  },
  {
    id: 'retro',
    nama: 'Tema Retro Y2K',
    kategori: 'Unik',
    deskripsi: 'Vibes 90s/2000-an dengan warna neon, pixel art, VHS scanlines, dan elemen nostalgik. Cocok untuk gen-Z!',
    preview: img('/images/themes/retro.png'),
    tags: ['Wisuda', 'Aesthetic', 'Y2K'],
    harga_design: 145000,
    popularitas: 88,
  },
];

// ── Physical Product Options for Custom Design ─────────────────
export const physicalProductOptions = [
  {
    id: 'banner-kain',
    nama: 'Banner Kain (Flexi)',
    ukuran: '2m x 1m',
    harga: 200000,
    deskripsi: 'Cetak pada kain flexi tahan air, cocok untuk outdoor.',
  },
  {
    id: 'banner-akrilik',
    nama: 'Banner Akrilik Premium',
    ukuran: '60cm x 40cm',
    harga: 450000,
    deskripsi: 'Cetak UV pada akrilik bening 3mm. Kesan modern dan elegan.',
  },
  {
    id: 'papan-bunga-custom',
    nama: 'Papan Bunga + Custom Design',
    ukuran: 'Standard (1.8m)',
    harga: 1200000,
    deskripsi: 'Papan bunga lengkap dengan rangkaian bunga segar dan desain custom Anda.',
  },
  {
    id: 'standing-banner',
    nama: 'Standing Banner X-Frame',
    ukuran: '60cm x 160cm',
    harga: 350000,
    deskripsi: 'Standing banner portabel dengan X-Frame aluminium. Mudah dibawa.',
  },
  {
    id: 'poster-a2',
    nama: 'Poster Art Paper A2',
    ukuran: '42cm x 59cm',
    harga: 75000,
    deskripsi: 'Cetak pada art paper 260gsm. Cocok untuk koleksi dan framing.',
  },
];

// ── Orders (enriched with order_details for history & reorder) ──
export const mockOrders = [
  {
    id: 1,
    user: { id: 2, nama: 'Siti Nurhaliza', email: 'siti@email.com' },
    tanggal_order: '2026-04-29',
    total_harga: 850000,
    status: 'completed',
    alamat_kirim: 'Jl. Melati No. 15, Bandung',
    items: [
      { product_id: 1, nama_produk: 'Papan Bunga Happy Wedding', harga: 850000, qty: 1, gambar: img('/images/products/papan-wedding.png') },
    ],
    custom_design: { ucapan: 'Happy Wedding! Semoga menjadi keluarga sakinah.', warna: 'Merah & Putih', tema: 'Pernikahan' },
    payment: { metode: 'QRIS', status: 'success', tanggal_bayar: '2026-04-29' },
    shipping: { kurir: 'Kurir Florentt', no_resi: 'FLR-2026-00001', status_pengiriman: 'diterima', tanggal_kirim: '2026-04-30' },
  },
  {
    id: 2,
    user: { id: 3, nama: 'Ahmad Fadillah', email: 'ahmad@email.com' },
    tanggal_order: '2026-05-02',
    total_harga: 1650000,
    status: 'processing',
    alamat_kirim: 'Jl. Anggrek No. 22, Surabaya',
    items: [
      { product_id: 3, nama_produk: 'Papan Bunga Grand Opening', harga: 950000, qty: 1, gambar: img('/images/products/papan-opening.png') },
      { product_id: 6, nama_produk: 'Hand Bouquet Anniversary', harga: 350000, qty: 2, gambar: img('/images/products/bouquet-anniversary.png') },
    ],
    custom_design: { ucapan: 'Selamat Grand Opening! Sukses selalu.', warna: 'Kuning & Merah', tema: 'Grand Opening' },
    payment: { metode: 'Transfer Bank Mandiri', status: 'success', tanggal_bayar: '2026-05-02' },
    shipping: { kurir: 'Kurir Florentt', no_resi: null, status_pengiriman: 'diproses', tanggal_kirim: null },
  },
  {
    id: 3,
    user: { id: 4, nama: 'Diana Putri', email: 'diana@email.com' },
    tanggal_order: '2026-05-04',
    total_harga: 350000,
    status: 'pending',
    alamat_kirim: 'Jl. Kenanga No. 8, Yogyakarta',
    items: [
      { product_id: 6, nama_produk: 'Hand Bouquet Anniversary', harga: 350000, qty: 1, gambar: img('/images/products/bouquet-anniversary.png') },
    ],
    custom_design: { ucapan: 'Happy 5th Anniversary!', warna: 'Pink & Putih', tema: 'Anniversary' },
    payment: { metode: 'Transfer Bank BRI', status: 'pending', tanggal_bayar: null },
    shipping: { kurir: null, no_resi: null, status_pengiriman: 'diproses', tanggal_kirim: null },
  },
  {
    id: 4,
    user: { id: 2, nama: 'Siti Nurhaliza', email: 'siti@email.com' },
    tanggal_order: '2026-05-02',
    total_harga: 1200000,
    status: 'shipped',
    alamat_kirim: 'Jl. Melati No. 15, Bandung',
    items: [
      { product_id: 5, nama_produk: 'Standing Flower Congratulations', harga: 1200000, qty: 1, gambar: img('/images/products/standing-flower.png') },
    ],
    custom_design: null,
    payment: { metode: 'QRIS', status: 'success', tanggal_bayar: '2026-05-02' },
    shipping: { kurir: 'JNE Express', no_resi: 'JNE-2026-88712', status_pengiriman: 'dikirim', tanggal_kirim: '2026-05-03' },
  },
  {
    id: 5,
    user: { id: 2, nama: 'Siti Nurhaliza', email: 'siti@email.com' },
    tanggal_order: '2026-03-15',
    total_harga: 1075000,
    status: 'completed',
    alamat_kirim: 'Jl. Melati No. 15, Bandung',
    items: [
      { product_id: 7, nama_produk: 'Papan Bunga Selamat & Sukses', harga: 800000, qty: 1, gambar: img('/images/products/papan-sukses.png') },
      { product_id: 8, nama_produk: 'Table Arrangement Elegant', harga: 275000, qty: 1, gambar: img('/images/products/table-arrangement.png') },
    ],
    custom_design: { ucapan: 'Selamat atas pelantikan Bapak Direktur!', warna: 'Navy & Gold', tema: 'Formal' },
    payment: { metode: 'QRIS', status: 'success', tanggal_bayar: '2026-03-15' },
    shipping: { kurir: 'Kurir Florentt', no_resi: 'FLR-2026-00042', status_pengiriman: 'diterima', tanggal_kirim: '2026-03-16' },
  },
  {
    id: 6,
    user: { id: 'anazky', nama: 'Anazky Putra', email: 'anazkyputra@aiesec.net' },
    tanggal_order: '2026-05-08',
    total_harga: 850000,
    status: 'shipped',
    alamat_kirim: 'Jl. Florentt No. 1, Jakarta',
    items: [
      { product_id: 1, nama_produk: 'Papan Bunga Happy Wedding', harga: 850000, qty: 1, gambar: img('/images/products/papan-wedding.png') },
    ],
    custom_design: null,
    payment: { metode: 'QRIS', status: 'success', tanggal_bayar: '2026-05-08' },
    shipping: { kurir: 'Kurir Florentt', no_resi: 'FLR-2026-00106', status_pengiriman: 'dikirim', tanggal_kirim: '2026-05-08' },
  },
  {
    id: 7,
    user: { id: 'anazky', nama: 'Anazky Putra', email: 'anazkyputra@aiesec.net' },
    tanggal_order: '2026-05-01',
    total_harga: 350000,
    status: 'completed',
    alamat_kirim: 'Jl. Florentt No. 1, Jakarta',
    items: [
      { product_id: 6, nama_produk: 'Hand Bouquet Anniversary', harga: 350000, qty: 1, gambar: img('/images/products/bouquet-anniversary.png') },
    ],
    custom_design: null,
    payment: { metode: 'Transfer Bank BCA', status: 'success', tanggal_bayar: '2026-05-01' },
    shipping: { kurir: 'Kurir Florentt', no_resi: 'FLR-2026-00080', status_pengiriman: 'diterima', tanggal_kirim: '2026-05-02' },
  },
  {
    id: 8,
    user: { id: 'anazky', nama: 'Anazky Putra', email: 'anazkyputra@aiesec.net' },
    tanggal_order: '2026-05-08',
    total_harga: 500000,
    status: 'processing',
    alamat_kirim: 'Akan dikonfirmasi via WhatsApp',
    items: [
      { product_id: 'design-1', nama_produk: 'Custom Design: Formal Corporate', harga: 500000, qty: 1, gambar: img('/images/themes/formal.png') },
    ],
    custom_design: { ucapan: 'Happy Anniversary!', nama_wisudawan: '', warna: 'Merah & Putih', tema: 'Formal', nama_tema: 'Formal Corporate' },
    payment: { metode: 'WhatsApp / Transfer Manual', status: 'pending', tanggal_bayar: null },
    shipping: { kurir: null, no_resi: null, status_pengiriman: 'diproses', tanggal_kirim: null },
  },
];

// Legacy exports for admin pages
export const mockPayments = mockOrders.filter(o => o.payment).map((o, i) => ({
  id: i + 1, order_id: o.id, order: { id: o.id, user: o.user },
  metode: o.payment.metode, jumlah: o.total_harga, status: o.payment.status, tanggal_bayar: o.payment.tanggal_bayar,
}));

export const mockShipping = mockOrders.filter(o => o.shipping).map((o, i) => ({
  id: i + 1, order_id: o.id, order: { id: o.id, user: o.user },
  kurir: o.shipping.kurir, no_resi: o.shipping.no_resi, status_pengiriman: o.shipping.status_pengiriman, tanggal_kirim: o.shipping.tanggal_kirim,
}));

export const mockDesigns = mockOrders.filter(o => o.custom_design).map((o, i) => ({
  id: i + 1, order_id: o.id, order: { id: o.id, user: o.user },
  ucapan: o.custom_design.ucapan, warna: o.custom_design.warna, tema: o.custom_design.tema, file_gambar: null,
}));

export const mockStats = {
  total_revenue: 4050000,
  total_orders: 4,
  total_products: 8,
  total_customers: 3,
  pending_orders: 1,
  processing_orders: 1,
};

export const mockChartData = [
  { bulan: 'Jan', total: 2500000 },
  { bulan: 'Feb', total: 3200000 },
  { bulan: 'Mar', total: 2800000 },
  { bulan: 'Apr', total: 4100000 },
  { bulan: 'Mei', total: 4050000 },
];
