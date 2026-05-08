import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../components/layout/CustomerLayout';
import AuthGuardModal from '../components/guards/AuthGuardModal';
import useAuthStore from '../store/authStore';
import useOrderStore from '../store/orderStore';
import { designThemes, physicalProductOptions, WHATSAPP_NUMBER } from '../lib/mockData';
import { formatCurrency } from '../lib/utils';

/* ── SVG Icons ──────────────────────────────────────────────── */
const FireIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-warning)" stroke="none"><path d="M12 23c-3.6 0-7-2.4-7-7 0-3.3 2.1-5.4 3.5-6.9.4-.4 1.1-.1 1.1.5v2.2c0 .4.5.6.8.3 2.3-2.5 3.6-5.3 3.6-8.1 0-.5.5-.8.9-.5C18.3 5.8 21 10 21 14c0 5.5-4 9-9 9z"/></svg>;
const StarIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--gold-400)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

const FILTER_OPTIONS = ['Semua', 'Parodi', 'Formal', 'Unik'];

export default function CustomDesignPage() {
  const [filter, setFilter] = useState('Semua');
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [step, setStep] = useState('browse'); // browse | customize | physical
  const [customData, setCustomData] = useState({ ucapan: '', nama_wisudawan: '', warna: '', file: null });
  const [wantPhysical, setWantPhysical] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState(null);
  
  const { user } = useAuthStore();
  const { addOrder } = useOrderStore();
  const navigate = useNavigate();

  const filtered = filter === 'Semua' ? designThemes : designThemes.filter(t => t.kategori === filter);

  const handleSelectTheme = (theme) => {
    setSelectedTheme(theme);
    setStep('customize');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitDesign = () => {
    setStep('physical');
  };

  // ── Create and persist the order to orderStore ──────────────
  const createAndSaveOrder = () => {
    const orderId = Math.floor(Math.random() * 9000) + 1000;
    const newOrder = {
      id: orderId,
      user: {
        id: user?.id || 'guest',
        nama: user?.nama || 'Customer',
        email: user?.email || '',
      },
      tanggal_order: new Date().toISOString().split('T')[0],
      total_harga: getTotalPrice(),
      status: 'processing', // Dikemas — menunggu konfirmasi desain
      alamat_kirim: 'Akan dikonfirmasi via WhatsApp',
      items: [
        {
          product_id: `design-${selectedTheme?.id}`,
          nama_produk: `Custom Design: ${selectedTheme?.nama}`,
          harga: selectedTheme?.harga_design || 0,
          qty: 1,
          gambar: selectedTheme?.preview || null,
        },
        ...(selectedProduct ? [{
          product_id: selectedProduct.id,
          nama_produk: selectedProduct.nama,
          harga: selectedProduct.harga,
          qty: 1,
          gambar: null,
        }] : []),
      ],
      custom_design: {
        ucapan: customData.ucapan,
        nama_wisudawan: customData.nama_wisudawan,
        warna: customData.warna || 'Sesuai tema',
        tema: selectedTheme?.kategori || 'Custom',
        nama_tema: selectedTheme?.nama,
      },
      payment: {
        metode: 'WhatsApp / Transfer Manual',
        status: 'pending',
        tanggal_bayar: null,
      },
      shipping: {
        kurir: null,
        no_resi: null,
        status_pengiriman: 'diproses',
        tanggal_kirim: null,
      },
    };
    addOrder(newOrder);
    setConfirmedOrderId(orderId);
    return orderId;
  };

  const handleConfirmOrder = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    createAndSaveOrder();
    setShowConfirm(true);
  };
  
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    createAndSaveOrder();
    setShowConfirm(true);
  };

  const handleWhatsApp = () => {
    const msg = `Halo Florent! Saya ingin memesan Custom Design:\n\nTema: ${selectedTheme?.nama}\nUcapan: ${customData.ucapan}\nNama: ${customData.nama_wisudawan}${selectedProduct ? `\nProduk Fisik: ${selectedProduct.nama} (${formatCurrency(selectedProduct.harga)})` : '\nDigital Only'}\n\nTotal: ${formatCurrency(getTotalPrice())}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const getTotalPrice = () => {
    let total = selectedTheme?.harga_design || 0;
    if (selectedProduct) total += selectedProduct.harga;
    return total;
  };

  return (
    <CustomerLayout>
      <div className="page-enter" style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* ── Step: Browse Themes ──────────────────────────── */}
          {step === 'browse' && (
            <>
              {/* Hero */}
              <div style={{
                background: 'linear-gradient(135deg, var(--red-900), var(--red-700))',
                borderRadius: 'var(--radius-xl)', padding: '48px 40px', marginBottom: 32,
                color: 'white', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <span style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600, marginBottom: 12, backdropFilter: 'blur(10px)' }}>
                  Fitur Baru
                </span>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, marginBottom: 8 }}>Custom Design Studio</h1>
                <p style={{ fontSize: 16, opacity: 0.8, maxWidth: 560, lineHeight: 1.7 }}>
                  Buat banner wisuda, spanduk parodi, atau desain papan bunga custom Anda sendiri. Pilih dari tema trending, personalisasi, dan cetak langsung!
                </p>
              </div>

              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {FILTER_OPTIONS.map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}>{f}</button>
                ))}
              </div>

              {/* Theme Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                {filtered.map((theme, i) => (
                  <motion.div key={theme.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <div className="card" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => handleSelectTheme(theme)}>
                      {/* Preview Image */}
                      <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                        <img src={theme.preview} alt={theme.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 4 }}>
                          {theme.popularitas >= 95 && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '4px 8px', background: 'rgba(0,0,0,0.7)', borderRadius: 'var(--radius-full)', color: 'white', fontSize: 10, fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                              <FireIcon /> TRENDING
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ padding: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{theme.kategori}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <StarIcon />
                            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{theme.popularitas}%</span>
                          </div>
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', marginBottom: 6 }}>{theme.nama}</h3>
                        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{theme.deskripsi}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                          {theme.tags.map(t => (
                            <span key={t} style={{ fontSize: 10, padding: '2px 8px', background: 'var(--color-primary-bg)', color: 'var(--color-primary)', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>{t}</span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary)' }}>{formatCurrency(theme.harga_design)}</span>
                          <span className="btn btn-primary btn-sm">Pilih Tema</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* ── Step: Customize ──────────────────────────────── */}
          {step === 'customize' && selectedTheme && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button onClick={() => { setStep('browse'); setSelectedTheme(null); }} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
                ← Kembali ke Pilihan Tema
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                {/* Preview */}
                <div>
                  <div className="card" style={{ overflow: 'hidden' }}>
                    <img src={selectedTheme.preview} alt={selectedTheme.nama} style={{ width: '100%', height: 320, objectFit: 'cover' }} />
                    <div style={{ padding: 20 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase' }}>{selectedTheme.kategori}</span>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text)', marginTop: 4 }}>{selectedTheme.nama}</h2>
                      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginTop: 8 }}>{selectedTheme.deskripsi}</p>
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-primary)', marginTop: 12 }}>{formatCurrency(selectedTheme.harga_design)}</div>
                      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>Harga untuk jasa desain custom</p>
                    </div>
                  </div>
                </div>

                {/* Customization Form */}
                <div className="card" style={{ padding: 28 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', marginBottom: 20 }}>Personalisasi Desain Anda</h3>

                  <div style={{ marginBottom: 16 }}>
                    <label className="label" htmlFor="nama-wisudawan">Nama Wisudawan / Penerima</label>
                    <input id="nama-wisudawan" className="input" value={customData.nama_wisudawan} onChange={e => setCustomData({ ...customData, nama_wisudawan: e.target.value })} placeholder="Contoh: Budi Santoso, S.Kom" />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label className="label" htmlFor="ucapan-input">Teks Ucapan / Pesan</label>
                    <textarea id="ucapan-input" className="textarea" value={customData.ucapan} onChange={e => setCustomData({ ...customData, ucapan: e.target.value })} placeholder="Tulis pesan atau ucapan yang ingin ditampilkan..." maxLength={250} />
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>{customData.ucapan.length}/250 karakter</div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label className="label" htmlFor="warna-input">Preferensi Warna</label>
                    <select id="warna-input" className="select" value={customData.warna} onChange={e => setCustomData({ ...customData, warna: e.target.value })}>
                      <option value="">Sesuai tema (default)</option>
                      <option value="Merah & Putih">Merah & Putih</option>
                      <option value="Navy & Gold">Navy & Gold</option>
                      <option value="Hitam & Emas">Hitam & Emas</option>
                      <option value="Pink & Putih">Pink & Putih</option>
                      <option value="Custom">Warna Kustom (via WhatsApp)</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label className="label">Upload Foto (Opsional)</label>
                    <div style={{
                      border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)',
                      padding: 24, textAlign: 'center', cursor: 'pointer',
                      background: 'var(--color-bg)',
                    }}>
                      <input type="file" accept="image/*" style={{ display: 'none' }} id="file-upload" onChange={e => setCustomData({ ...customData, file: e.target.files[0] })} />
                      <label htmlFor="file-upload" style={{ cursor: 'pointer', fontSize: 13, color: 'var(--color-text-secondary)' }}>
                        {customData.file ? (
                          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{customData.file.name}</span>
                        ) : (
                          <>Klik untuk upload foto wisudawan<br /><span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>JPG, PNG (Max 5MB)</span></>
                        )}
                      </label>
                    </div>
                  </div>

                  <button onClick={handleSubmitDesign} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                    Lanjut Pilih Produk
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step: Physical Product Choice ────────────────── */}
          {step === 'physical' && selectedTheme && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button onClick={() => setStep('customize')} className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
                ← Kembali ke Kustomisasi
              </button>

              <div className="card" style={{ padding: 32, marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
                  Ingin Dicetak ke Produk Fisik?
                </h2>
                <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 24 }}>
                  Pilih apakah Anda ingin mengimplementasikan desain custom ke produk fisik yang bisa dipesan sekaligus, atau cukup desain digitalnya saja.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div
                    onClick={() => { setWantPhysical(false); setSelectedProduct(null); }}
                    style={{
                      padding: 24, borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                      border: `2px solid ${wantPhysical === false ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: wantPhysical === false ? 'var(--color-primary-bg)' : 'var(--color-surface)',
                      textAlign: 'center', transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>Desain Digital Saja</h3>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Dapatkan file desain high-res (JPG/PNG/PDF)</p>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary)', marginTop: 12 }}>{formatCurrency(selectedTheme.harga_design)}</div>
                  </div>
                  <div
                    onClick={() => setWantPhysical(true)}
                    style={{
                      padding: 24, borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                      border: `2px solid ${wantPhysical === true ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: wantPhysical === true ? 'var(--color-primary-bg)' : 'var(--color-surface)',
                      textAlign: 'center', transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>Cetak ke Produk Fisik</h3>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Desain + dicetak dan dikirim ke alamat Anda</p>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', marginTop: 12 }}>Mulai dari {formatCurrency(selectedTheme.harga_design + 75000)}</div>
                  </div>
                </div>
              </div>

              {/* Physical Product Grid */}
              <AnimatePresence>
                {wantPhysical && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>Pilih Tipe Produk Fisik</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
                      {physicalProductOptions.map(p => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedProduct(p)}
                          className="card"
                          style={{
                            padding: 20, cursor: 'pointer',
                            border: selectedProduct?.id === p.id ? '2px solid var(--color-primary)' : undefined,
                            background: selectedProduct?.id === p.id ? 'var(--color-primary-bg)' : undefined,
                          }}
                        >
                          <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>{p.nama}</h4>
                          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6 }}>{p.ukuran}</div>
                          <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>{p.deskripsi}</p>
                          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(p.harga)}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Summary & Confirm */}
              {wantPhysical !== null && (
                <div className="card" style={{ padding: 24, marginTop: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--color-text)' }}>Ringkasan Pesanan</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Jasa Desain: {selectedTheme.nama}</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{formatCurrency(selectedTheme.harga_design)}</span>
                  </div>
                  {selectedProduct && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Produk: {selectedProduct.nama}</span>
                      <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{formatCurrency(selectedProduct.harga)}</span>
                    </div>
                  )}
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-text)' }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--color-primary)' }}>{formatCurrency(getTotalPrice())}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <button onClick={handleConfirmOrder} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                      Pesan Sekarang
                    </button>
                    <button onClick={handleWhatsApp} className="btn btn-lg" style={{ flex: 1, background: '#25D366', color: 'white', border: 'none' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Konsultasi via WA
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div className="success-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="success-modal-content" initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}>
              <svg className="checkmark-svg" width="72" height="72" viewBox="0 0 80 80" style={{ margin: '0 auto 20px' }}>
                <circle className="circle" cx="40" cy="40" r="36" fill="none" stroke="var(--color-success)" strokeWidth="3" />
                <polyline className="check" points="26,42 36,52 54,30" fill="none" stroke="var(--color-success)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>Pesanan Design Diterima!</h2>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 16 }}>Tim desainer kami akan menghubungi Anda via WhatsApp untuk konfirmasi detail.</p>
              
              {/* Order Summary */}
              {confirmedOrderId && (
                <div style={{ background: 'var(--color-primary-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Order ID</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>#{confirmedOrderId}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Tema</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{selectedTheme?.nama}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Total</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-primary)' }}>{formatCurrency(getTotalPrice())}</span>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-primary btn-lg"
                  style={{ justifyContent: 'center' }}
                >
                  Lihat di Dashboard Saya
                </button>
                <button onClick={handleWhatsApp} className="btn btn-lg" style={{ background: '#25D366', color: 'white', border: 'none', justifyContent: 'center' }}>Chat WhatsApp Sekarang</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthGuardModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </CustomerLayout>
  );
}
