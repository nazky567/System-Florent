import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomerLayout from '../components/layout/CustomerLayout';
import AuthGuardModal from '../components/guards/AuthGuardModal';
import { mockProducts, WARNA_OPTIONS, TEMA_OPTIONS } from '../lib/mockData';
import { formatCurrency } from '../lib/utils';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.id === parseInt(id));
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const [qty, setQty] = useState(1);
  const [customDesign, setCustomDesign] = useState({ ucapan: '', warna: WARNA_OPTIONS[0], tema: TEMA_OPTIONS[0] });
  const [showCustom, setShowCustom] = useState(false);
  const [added, setAdded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!product) return <CustomerLayout><div style={{ padding: 80, textAlign: 'center' }}>Produk tidak ditemukan</div></CustomerLayout>;

  const handleAdd = () => {
    // If not logged in, show auth guard modal
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    addItem(product, qty, showCustom ? customDesign : null);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // After login, add the item to cart automatically
    addItem(product, qty, showCustom ? customDesign : null);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <CustomerLayout>
      <div className="page-enter" style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            {/* Image */}
            {product.gambar ? (
              <div style={{ height: 400, borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                <img src={product.gambar} alt={product.nama_produk} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{ height: 400, background: 'linear-gradient(135deg, var(--red-100), var(--red-50))', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--red-300)" strokeWidth="1"><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 0 1 0 8 4 4 0 0 1 0-8z"/><path d="M22 12a4 4 0 0 1-8 0 4 4 0 0 1 8 0z"/><path d="M12 22a4 4 0 0 1 0-8 4 4 0 0 1 0 8z"/><path d="M2 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/></svg>
              </div>
            )}

            {/* Info */}
            <div>
              <span className="badge badge-paid" style={{ marginBottom: 12 }}>{product.kategori}</span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 8 }}>{product.nama_produk}</h1>
              <p style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.7, marginBottom: 20 }}>{product.deskripsi}</p>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--red-700)', marginBottom: 24 }}>{formatCurrency(product.harga)}</div>

              {/* Qty */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <label className="label" style={{ marginBottom: 0 }}>Jumlah:</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden' }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 36, height: 36, border: 'none', background: 'var(--gray-50)', cursor: 'pointer', fontSize: 18 }}>-</button>
                  <span style={{ width: 48, textAlign: 'center', fontSize: 15, fontWeight: 600 }}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} style={{ width: 36, height: 36, border: 'none', background: 'var(--gray-50)', cursor: 'pointer', fontSize: 18 }}>+</button>
                </div>
                <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>Stok: {product.stok}</span>
              </div>

              {/* Customization Toggle */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
                  <input type="checkbox" checked={showCustom} onChange={e => setShowCustom(e.target.checked)} />
                  Tambah Kustomisasi Desain
                </label>
              </div>

              {/* Product Configurator */}
              {showCustom && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ padding: 20, background: 'var(--gray-50)', borderRadius: 12, marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--gray-800)' }}>Kustomisasi Desain</h3>
                  <div style={{ marginBottom: 12 }}>
                    <label className="label">Ucapan / Pesan</label>
                    <textarea className="textarea" value={customDesign.ucapan} onChange={e => setCustomDesign({ ...customDesign, ucapan: e.target.value })} placeholder="Tulis pesan ucapan Anda..." maxLength={200} />
                    <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>{customDesign.ucapan.length}/200 karakter</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label className="label">Pilihan Warna</label>
                      <select className="select" value={customDesign.warna} onChange={e => setCustomDesign({ ...customDesign, warna: e.target.value })}>
                        {WARNA_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Tema</label>
                      <select className="select" value={customDesign.tema} onChange={e => setCustomDesign({ ...customDesign, tema: e.target.value })}>
                        {TEMA_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* Color preview */}
                  <div style={{ marginTop: 12, padding: 12, background: 'white', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 6 }}>Pratinjau:</div>
                    <div style={{ fontSize: 14, fontStyle: 'italic', color: 'var(--gray-700)' }}>"{customDesign.ucapan || 'Pesan ucapan Anda akan muncul di sini...'}"</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>Warna: {customDesign.warna} | Tema: {customDesign.tema}</div>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={handleAdd} className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                  {added ? '✓ Ditambahkan!' : 'Tambah ke Keranjang'}
                </button>
                <button onClick={() => navigate('/products')} className="btn btn-ghost btn-lg">Kembali</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Guard Modal — shown when guest tries to add to cart */}
      <AuthGuardModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </CustomerLayout>
  );
}
