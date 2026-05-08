import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomerLayout from '../components/layout/CustomerLayout';
import useCartStore from '../store/cartStore';
import useOrderStore from '../store/orderStore';
import { WHATSAPP_NUMBER } from '../lib/mockData';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '../lib/utils';

const steps = [
  { key: 'processing', label: 'Dikemas', desc: 'Pesanan Anda sedang disiapkan dan dikemas oleh tim Florent.' },
  { key: 'shipped', label: 'Diantar', desc: 'Kurir sedang dalam perjalanan mengirimkan pesanan ke lokasi Anda.' },
  { key: 'completed', label: 'Selesai', desc: 'Pesanan telah diterima. Terima kasih!' },
];

const statusOrder = { pending: 0, paid: 0, processing: 0, shipped: 1, completed: 2 };

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reorderFromHistory } = useCartStore();
  const { orders, updateOrderStatus } = useOrderStore();
  const order = orders.find(o => o.id === parseInt(id));

  if (!order) return (
    <CustomerLayout>
      <div style={{ padding: 80, textAlign: 'center' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1" style={{ margin: '0 auto 12px', opacity: 0.4 }}>
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h2 style={{ fontSize: 20, color: 'var(--color-text-muted)', marginBottom: 12 }}>Pesanan tidak ditemukan</h2>
        <Link to="/dashboard" className="btn btn-primary">Kembali ke Dashboard</Link>
      </div>
    </CustomerLayout>
  );

  const currentStep = statusOrder[order.status] ?? 0;

  const handleReorder = () => {
    reorderFromHistory(order);
    navigate('/checkout');
  };

  const handleWhatsApp = () => {
    const msg = `Halo Admin Florent, saya ingin bertanya mengenai pesanan saya #${order.id}. Terima kasih!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleConfirmDone = () => {
    updateOrderStatus(order.id, 'completed');
  };

  return (
    <CustomerLayout>
      <div className="page-enter" style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Back link */}
          <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'none', marginBottom: 20 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Kembali ke Dashboard
          </Link>

          {/* Main Card */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{
              padding: '24px 28px',
              background: 'linear-gradient(135deg, var(--red-800), var(--red-600))',
              color: 'white',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Pesanan #{order.id}</h1>
                  <p style={{ fontSize: 13, opacity: 0.75 }}>{formatDate(order.tanggal_order)}</p>
                </div>
                <span className={`badge ${getStatusBadgeClass(order.status)}`} style={{ fontSize: 12 }}>{getStatusLabel(order.status)}</span>
              </div>
            </div>

            {/* Timeline */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>Status Pesanan</h3>
              {steps.map((s, i) => {
                const done = i <= currentStep;
                const active = i === currentStep;
                return (
                  <div key={s.key} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <motion.div
                        initial={false}
                        animate={{ scale: active ? 1.1 : 1 }}
                        style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: done ? 'var(--color-primary)' : 'var(--color-border)',
                          color: done ? 'white' : 'var(--color-text-muted)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700,
                          boxShadow: active ? '0 0 0 4px var(--color-primary-bg)' : 'none',
                          transition: 'all 0.3s',
                        }}
                      >
                        {done ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : i + 1}
                      </motion.div>
                      {i < steps.length - 1 && <div style={{ width: 2, height: 32, background: done ? 'var(--color-primary)' : 'var(--color-border)', transition: 'background 0.3s' }} />}
                    </div>
                    <div style={{ paddingBottom: 20 }}>
                      <div style={{ fontSize: 14, fontWeight: done ? 600 : 400, color: done ? 'var(--color-text)' : 'var(--color-text-muted)' }}>{s.label}</div>
                      {active && <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{s.desc}</div>}
                    </div>
                  </div>
                );
              })}

              {/* MOCK MAP FOR SHIPPED STATUS */}
              {order.status === 'shipped' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 16 }}>
                  <div style={{ position: 'relative', width: '100%', height: 200, borderRadius: 12, overflow: 'hidden', background: '#e0e0e0', marginBottom: 16 }}>
                    {/* Fake Map Image (Placeholder) */}
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Map_placeholder.svg" 
                      alt="Map" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} 
                    />
                    {/* Fake route line and pin */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="200" height="100" viewBox="0 0 200 100" fill="none" style={{ position: 'absolute' }}>
                        <path d="M 20 80 Q 80 20 180 50" stroke="var(--color-primary)" strokeWidth="4" strokeDasharray="6 6" fill="none" />
                        <circle cx="20" cy="80" r="6" fill="var(--color-primary)" />
                        <circle cx="180" cy="50" r="8" fill="var(--color-success)" />
                      </svg>
                      <div style={{ background: 'white', padding: '6px 12px', borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: 13, fontWeight: 700, color: 'var(--color-text)', position: 'absolute', top: 20 }}>
                        ⏳ Estimasi Tiba: 7 Jam Lagi
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>Apakah pesanan Anda sudah sampai dengan selamat?</p>
                    <button onClick={handleConfirmDone} className="btn btn-primary" style={{ background: 'var(--color-success)', border: 'none', width: '100%' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 8 }}><polyline points="20 6 9 17 4 12"/></svg>
                      Konfirmasi Pesanan Selesai
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Items */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 0.5 }}>Item Pesanan</h3>
              {order.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: idx < order.items.length - 1 ? 12 : 0 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: 'var(--color-bg)' }}>
                    {item.gambar ? (
                      <img src={item.gambar} alt={item.nama_produk} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🌺</div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{item.nama_produk}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.qty}x @ {formatCurrency(item.harga)}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{formatCurrency(item.harga * item.qty)}</div>
                </div>
              ))}
            </div>

            {/* Custom Design */}
            {order.custom_design && (
              <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Kustomisasi Desain</h3>
                <div style={{ padding: 16, borderRadius: 10, background: 'var(--color-primary-bg)', border: '1px solid var(--color-primary)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>Tema</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{order.custom_design.tema}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>Warna</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{order.custom_design.warna}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500 }}>Ucapan</div>
                    <div style={{ fontSize: 14, color: 'var(--color-text)', fontStyle: 'italic', lineHeight: 1.5 }}>"{order.custom_design.ucapan}"</div>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping & Payment Info */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Shipping */}
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Pengiriman</h3>
                  <div style={{ fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Kurir: </span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{order.shipping?.kurir || '—'}</span>
                  </div>
                  <div style={{ fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Resi: </span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)', fontFamily: 'monospace' }}>{order.shipping?.no_resi || 'Belum tersedia'}</span>
                  </div>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Alamat: </span>
                    <span style={{ color: 'var(--color-text)' }}>{order.alamat_kirim}</span>
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Pembayaran</h3>
                  <div style={{ fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Metode: </span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{order.payment?.metode || '—'}</span>
                  </div>
                  <div style={{ fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Status: </span>
                    <span style={{
                      fontWeight: 600,
                      color: order.payment?.status === 'success' ? 'var(--color-success)' : 'var(--color-warning, #F59E0B)',
                    }}>
                      {order.payment?.status === 'success' ? '✓ Berhasil' : '⏳ Pending'}
                    </span>
                  </div>
                  {order.payment?.tanggal_bayar && (
                    <div style={{ fontSize: 13 }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Tanggal: </span>
                      <span style={{ color: 'var(--color-text)' }}>{formatDate(order.payment.tanggal_bayar)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer — Total + Actions */}
            <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Total Pesanan</span>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)' }}>{formatCurrency(order.total_harga)}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleWhatsApp} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                  Tanya Admin
                </button>

                {(order.status === 'completed' || order.status === 'shipped') && (
                  <button onClick={handleReorder} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
                    Beli Lagi
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
