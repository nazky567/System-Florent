import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerLayout from '../components/layout/CustomerLayout';
import AuthGuardModal from '../components/guards/AuthGuardModal';
import PaymentSuccessModal from '../components/payment/PaymentSuccessModal';
import TrustBadges from '../components/payment/TrustBadges';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import useOrderStore from '../store/orderStore';
import { formatCurrency } from '../lib/utils';

/* ── Payment method configs ─────────────────────────────────── */
const PAYMENT_METHODS = [
  { id: 'qris', label: 'QRIS (GoPay, ShopeePay, OVO, dll)', badge: 'Rekomendasi', isQris: true },
  { id: 'bca', label: 'Transfer Bank BCA' },
  { id: 'mandiri', label: 'Transfer Bank Mandiri' },
  { id: 'bri', label: 'Transfer Bank BRI' },
];

/* ── SVG Icons ──────────────────────────────────────────────── */
const QrisIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
    <line x1="21" y1="14" x2="21" y2="21"/><line x1="14" y1="21" x2="21" y2="21"/>
  </svg>
);
const BankIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

export default function CheckoutPage() {
  const { items, removeItem, updateQty, clearCart, getTotal } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [alamat, setAlamat] = useState(user?.alamat || '');
  const [metode, setMetode] = useState('qris');
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [pollingActive, setPollingActive] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // ── Sync address when user logs in ────────────────────────
  useEffect(() => {
    if (user?.alamat && !alamat) setAlamat(user.alamat);
  }, [user, alamat]);

  // ── Payment Status Polling ────────────────────────────────
  useEffect(() => {
    if (!pollingActive || !orderResult?.orderId) return;

    const interval = setInterval(() => {
      // In production: api.get(`/orders/${orderResult.orderId}/payment-status`)
      const elapsed = Date.now() - orderResult.timestamp;
      if (elapsed > 5000) {
        setPollingActive(false);
        setShowSuccess(true);
        clearCart();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [pollingActive, orderResult, clearCart]);

  // ── Auth Guard: intercept step transition ─────────────────
  const handleStepChange = (targetStep) => {
    // Step 1 → Step 2: require authentication (user_id mandatory for Orders)
    if (targetStep >= 2 && !user) {
      setShowAuthModal(true);
      return;
    }
    setStep(targetStep);
  };

  // ── Post-auth: auto-resume to Step 2 ─────────────────────
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setStep(2); // Resume checkout flow
  };

  // ── Handle "Bayar" click ──────────────────────────────────
  const handlePay = useCallback(async () => {
    // Final auth check before payment
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 800));

    const mockOrderId = Math.floor(Math.random() * 1000) + 100;
    
    // Create new order object for the store
    const newOrder = {
      id: mockOrderId,
      user: { id: user.id || 999, nama: user.nama, email: user.email },
      tanggal_order: new Date().toISOString().split('T')[0],
      total_harga: getTotal(),
      status: 'processing', // Starts as Dikemas
      alamat_kirim: alamat,
      items: items.map(item => ({
        product_id: item.product.id,
        nama_produk: item.product.nama_produk,
        harga: item.product.harga,
        qty: item.qty,
        gambar: item.product.gambar,
      })),
      custom_design: items[0]?.customDesign || null,
      payment: { metode: PAYMENT_METHODS.find(m => m.id === metode)?.label || metode, status: 'success', tanggal_bayar: new Date().toISOString() },
      shipping: { kurir: 'Kurir Florent', no_resi: `FLR-${new Date().getFullYear()}-${mockOrderId}`, status_pengiriman: 'diproses' },
    };

    if (metode === 'qris') {
      setOrderResult({
        orderId: mockOrderId,
        amount: getTotal(),
        timestamp: Date.now(),
      });

      setTimeout(() => {
        setIsProcessing(false);
        setPollingActive(true);
      }, 1500);

      setTimeout(() => {
        useOrderStore.getState().addOrder(newOrder);
        setPollingActive(false);
        setShowSuccess(true);
        clearCart();
      }, 6000);
    } else {
      setOrderResult({
        orderId: mockOrderId,
        amount: getTotal(),
        timestamp: Date.now(),
      });
      useOrderStore.getState().addOrder(newOrder);
      setIsProcessing(false);
      setShowSuccess(true);
      clearCart();
    }
  }, [metode, getTotal, clearCart, user, items, alamat]);

  // ── Empty Cart ────────────────────────────────────────────
  if (items.length === 0 && !showSuccess && !pollingActive) {
    return (
      <CustomerLayout>
        <div style={{ padding: 80, textAlign: 'center' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1" style={{ margin: '0 auto 16px', opacity: 0.4 }}>
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
          </svg>
          <h2 style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>Keranjang Kosong</h2>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Ayo mulai belanja dan temukan produk favorit Anda!</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/products" className="btn btn-primary">Belanja Sekarang</Link>
            <Link to="/custom-design" className="btn btn-ghost">Custom Design</Link>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      {/* Auth Guard Modal */}
      <AuthGuardModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Success Modal */}
      <PaymentSuccessModal
        isOpen={showSuccess}
        orderId={orderResult?.orderId}
        amount={orderResult?.amount}
        onClose={() => setShowSuccess(false)}
      />

      <div className="page-enter" style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 24, color: 'var(--color-text)' }}>Checkout</h1>

          {/* Progress Steps */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }} role="progressbar" aria-valuemin="1" aria-valuemax="3" aria-valuenow={step}>
            {['Keranjang', 'Pengiriman', 'Pembayaran'].map((s, i) => (
              <div
                key={i}
                style={{
                  flex: 1, padding: '10px 0', textAlign: 'center', borderRadius: 8,
                  fontSize: 13, fontWeight: 600,
                  background: step > i ? 'var(--color-primary)' : step === i + 1 ? 'var(--color-primary-bg)' : 'var(--color-border)',
                  color: step > i ? 'white' : step === i + 1 ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => handleStepChange(i + 1)}
                role="tab"
                aria-selected={step === i + 1}
              >
                {i + 1 >= 2 && !user && (
                  <span style={{ marginRight: 4 }}><LockIcon /></span>
                )}
                {s}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
            <div>
              {/* Step 1: Cart */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="card" style={{ padding: 24 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: 'var(--color-text)' }}>Keranjang Belanja</h2>
                    {items.map(item => (
                      <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
                        {/* Product image */}
                        <div style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--color-primary-bg)' }}>
                          {item.product.gambar ? (
                            <img src={item.product.gambar} alt={item.product.nama_produk} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: 20 }}>🌺</div>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{item.product.nama_produk}</div>
                          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{formatCurrency(item.product.harga)}</div>
                          {item.customDesign && (
                            <div style={{ fontSize: 11, color: 'var(--color-primary)', marginTop: 2, fontWeight: 500 }}>
                              ✎ Desain kustom diterapkan
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => updateQty(item.product.id, item.qty - 1)} className="btn btn-ghost btn-sm" aria-label="Kurangi jumlah">-</button>
                          <span style={{ fontWeight: 600, color: 'var(--color-text)', minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                          <button onClick={() => updateQty(item.product.id, item.qty + 1)} className="btn btn-ghost btn-sm" aria-label="Tambah jumlah">+</button>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary)', minWidth: 100, textAlign: 'right' }}>{formatCurrency(item.product.harga * item.qty)}</div>
                        <button onClick={() => removeItem(item.product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 18 }} aria-label={`Hapus ${item.product.nama_produk}`}>×</button>
                      </div>
                    ))}

                    {/* Auth-aware "Lanjut" button */}
                    <button
                      onClick={() => handleStepChange(2)}
                      className="btn btn-primary"
                      style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      {!user && <LockIcon />}
                      Lanjut ke Pengiriman
                    </button>

                    {/* Guest hint */}
                    {!user && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          marginTop: 12, padding: '10px 14px',
                          background: 'var(--color-warning-bg, #FFFBEB)',
                          border: '1px solid var(--color-warning, #F59E0B)',
                          borderRadius: 8, fontSize: 13,
                          color: 'var(--color-text-secondary)',
                          display: 'flex', alignItems: 'center', gap: 8,
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning, #F59E0B)" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        Anda perlu masuk untuk melanjutkan ke pengiriman dan pembayaran.
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Shipping Address */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="card" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text)', flex: 1 }}>Alamat Pengiriman</h2>
                      {user && (
                        <span style={{ fontSize: 12, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                          Masuk sebagai {user.nama}
                        </span>
                      )}
                    </div>

                    {/* Pre-fill info */}
                    {user && (
                      <div style={{ padding: '12px 16px', background: 'var(--color-bg)', borderRadius: 8, marginBottom: 16, border: '1px solid var(--color-border)' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{user.nama}</div>
                        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{user.email}</div>
                      </div>
                    )}

                    <label className="label" htmlFor="alamat-input">Alamat Lengkap</label>
                    <textarea
                      id="alamat-input"
                      className="textarea"
                      value={alamat}
                      onChange={e => setAlamat(e.target.value)}
                      placeholder="Masukkan alamat lengkap pengiriman..."
                      style={{ marginBottom: 16 }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => setStep(1)} className="btn btn-ghost">Kembali</button>
                      <button onClick={() => setStep(3)} className="btn btn-primary" disabled={!alamat.trim()}>Lanjut ke Pembayaran</button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="card" style={{ padding: 24 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: 'var(--color-text)' }}>Metode Pembayaran</h2>

                    {/* QRIS Polling Indicator */}
                    {pollingActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{
                          padding: 24,
                          background: 'var(--color-primary-bg)',
                          border: '2px solid var(--color-primary)',
                          borderRadius: 16,
                          textAlign: 'center',
                          marginBottom: 16,
                        }}
                      >
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>Scan untuk Membayar</h3>
                        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20 }}>Buka aplikasi e-wallet (GoPay, OVO, Dana, dll) atau m-Banking Anda, lalu scan kode QR di bawah ini.</p>
                        
                        <div style={{ background: 'white', padding: 16, borderRadius: 12, display: 'inline-block', marginBottom: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                          <img 
                            src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MockQRISFlorent" 
                            alt="Mock QRIS" 
                            style={{ width: 180, height: 180 }} 
                          />
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--color-primary)' }}>
                          <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }} />
                          <span style={{ fontSize: 13, fontWeight: 600 }}>Menunggu pembayaran...</span>
                        </div>
                      </motion.div>
                    )}

                    {!pollingActive && (
                      <>
                        {PAYMENT_METHODS.map(m => (
                          <label
                            key={m.id}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 12,
                              padding: '14px 16px',
                              border: `2px solid ${metode === m.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                              borderRadius: 10, marginBottom: 8, cursor: 'pointer',
                              background: metode === m.id ? 'var(--color-primary-bg)' : 'var(--color-surface)',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <input
                              type="radio"
                              name="metode"
                              checked={metode === m.id}
                              onChange={() => setMetode(m.id)}
                              style={{ accentColor: 'var(--color-primary)' }}
                            />
                            <div style={{ color: 'var(--color-text-secondary)' }}>
                              {m.isQris ? <QrisIcon /> : <BankIcon />}
                            </div>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>{m.label}</span>
                            </div>
                            {m.badge && (
                              <span style={{
                                fontSize: 10, fontWeight: 700,
                                padding: '3px 8px', borderRadius: 'var(--radius-full)',
                                background: 'var(--color-primary)',
                                color: 'white', textTransform: 'uppercase',
                                letterSpacing: 0.5,
                              }}>{m.badge}</span>
                            )}
                          </label>
                        ))}

                        {/* Pay Button */}
                        <button
                          onClick={handlePay}
                          className={`btn btn-pay ${isProcessing ? 'loading' : ''}`}
                          style={{ width: '100%', marginTop: 16 }}
                          disabled={isProcessing}
                          aria-label="Bayar sekarang"
                        >
                          {isProcessing ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span className="spinner" />
                              Memproses...
                            </span>
                          ) : (
                            <>
                              {metode === 'qris' ? 'Bayar dengan QRIS' : 'Konfirmasi Pesanan'}
                              <span style={{ fontSize: 14, opacity: 0.8 }}>— {formatCurrency(getTotal())}</span>
                            </>
                          )}
                        </button>

                        <div style={{ marginTop: 12 }}>
                          <button onClick={() => setStep(2)} className="btn btn-ghost" style={{ width: '100%' }}>Kembali</button>
                        </div>
                      </>
                    )}

                    {/* Trust Badges */}
                    <TrustBadges />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order Summary Sidebar */}
            <div className="card" style={{ padding: 24, height: 'fit-content', position: 'sticky', top: 80 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--color-text)' }}>Ringkasan Pesanan</h3>
              {items.map(item => (
                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{item.product.nama_produk} x{item.qty}</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{formatCurrency(item.product.harga * item.qty)}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-text)' }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-primary)' }}>{formatCurrency(getTotal())}</span>
              </div>

              {/* User status in sidebar */}
              <div style={{
                marginTop: 16, paddingTop: 12,
                borderTop: '1px solid var(--color-border)',
              }}>
                {user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {user.avatar ? (
                      <img src={user.avatar} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} referrerPolicy="no-referrer" />
                    ) : (
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--color-primary)' }}>{user.nama?.charAt(0)}</div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>{user.nama}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{user.email}</div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    style={{
                      width: '100%', padding: '8px 12px', borderRadius: 8,
                      border: '1px dashed var(--color-primary)', background: 'var(--color-primary-bg)',
                      color: 'var(--color-primary)', fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <LockIcon /> Masuk untuk checkout
                  </button>
                )}
              </div>

              {/* Mini Trust Line */}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Transaksi aman & terenkripsi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
