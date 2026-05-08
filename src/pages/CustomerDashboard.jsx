import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerLayout from '../components/layout/CustomerLayout';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import useOrderStore from '../store/orderStore';
import { WHATSAPP_NUMBER } from '../lib/mockData';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '../lib/utils';

/* ── SVG Icons ──────────────────────────────────────────────── */
const ShoppingBagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const PaletteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
  </svg>
);
const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const { reorderFromHistory } = useCartStore();
  const { orders, fetchOrders } = useOrderStore();
  const navigate = useNavigate();
  const [reorderingId, setReorderingId] = useState(null);
  const [reorderSuccess, setReorderSuccess] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Match orders belonging to the current user by email OR id
  const allUserOrders = orders.filter(o => {
    if (!user) return false;
    const emailMatch = o.user?.email && user?.email && 
                       o.user.email.toLowerCase() === user.email.toLowerCase();
    const idMatch = o.user?.id && user?.id && 
                    String(o.user.id) === String(user.id);
    return emailMatch || idMatch;
  }).sort((a, b) => new Date(b.tanggal_order) - new Date(a.tanggal_order));

  // Apply filter for display
  const userOrders = filter === 'all'
    ? allUserOrders
    : allUserOrders.filter(o => o.status === filter);

  const handleReorder = async (order) => {
    setReorderingId(order.id);
    await new Promise(r => setTimeout(r, 600));
    const count = reorderFromHistory(order);
    setReorderingId(null);
    setReorderSuccess(order.id);
    setTimeout(() => {
      setReorderSuccess(null);
      navigate('/checkout');
    }, 1200);
  };

  const handleWhatsApp = (orderId) => {
    const msg = `Halo Admin Florent, saya ingin bertanya mengenai kustomisasi desain saya dengan Order ID #${orderId}. Terima kasih!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Stats: computed on ALL user orders regardless of filter
  // "Total Pesanan" = aktif (belum completed/cancelled)
  const activeOrders = allUserOrders.filter(o => !['completed', 'cancelled'].includes(o.status)).length;
  const completedOrders = allUserOrders.filter(o => o.status === 'completed').length;
  const totalSpent = allUserOrders.reduce((sum, o) => sum + o.total_harga, 0);

  return (
    <CustomerLayout>
      <div className="page-enter" style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--color-text)', marginBottom: 24 }}>Dashboard Saya</h1>

          {/* Profile Card */}
          <div className="card" style={{ padding: 24, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.nama} style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
            ) : (
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--red-100)', color: 'var(--red-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>{user?.nama?.charAt(0)}</div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>{user?.nama}</div>
              <div style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{user?.email}</div>
              {user?.provider === 'google' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 11, color: 'var(--color-text-muted)', background: 'var(--color-bg)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google Account
                </span>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            <div className="card" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary)' }}>{activeOrders}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>Pesanan Aktif</div>
            </div>
            <div className="card" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-success)' }}>{completedOrders}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>Selesai</div>
            </div>
            <div className="card" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text)' }}>{formatCurrency(totalSpent)}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>Total Belanja</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
            <Link to="/products" className="card" style={{ padding: 16, textAlign: 'center', textDecoration: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}>
              <div style={{ color: 'var(--color-primary)', marginBottom: 6 }}><ShoppingBagIcon /></div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>Belanja</div>
            </Link>
            <Link to="/custom-design" className="card" style={{ padding: 16, textAlign: 'center', textDecoration: 'none', cursor: 'pointer' }}>
              <div style={{ color: 'var(--color-primary)', marginBottom: 6 }}><PaletteIcon /></div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>Custom Design</div>
            </Link>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Halo Florent! Saya butuh bantuan.')}`} target="_blank" rel="noopener noreferrer" className="card" style={{ padding: 16, textAlign: 'center', textDecoration: 'none', cursor: 'pointer', background: '#25D366', border: 'none' }}>
              <div style={{ marginBottom: 6 }}><WhatsAppIcon /></div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>Chat WA</div>
            </a>
          </div>

          {/* ── Purchase History ──────────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)' }}>Riwayat Pembelian</h2>
            <Link to="/products" className="btn btn-primary btn-sm">+ Pesan Baru</Link>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'Semua' },
              { key: 'pending', label: 'Menunggu' },
              { key: 'processing', label: 'Diproses' },
              { key: 'shipped', label: 'Dikirim' },
              { key: 'completed', label: 'Selesai' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: '6px 14px', borderRadius: 'var(--radius-full)',
                  border: `1px solid ${filter === f.key ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: filter === f.key ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: filter === f.key ? 'white' : 'var(--color-text-secondary)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Order Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AnimatePresence mode="popLayout">
              {userOrders.map(order => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="card"
                  style={{ padding: 0, overflow: 'hidden' }}
                >
                  {/* Order Header */}
                  <div style={{
                    padding: '14px 20px',
                    background: 'var(--color-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderBottom: '1px solid var(--color-border)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>Pesanan #{order.id}</span>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{formatDate(order.tanggal_order)}</span>
                    </div>
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>{getStatusLabel(order.status)}</span>
                  </div>

                  {/* Order Items */}
                  <div style={{ padding: '16px 20px' }}>
                    {order.items?.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: idx < order.items.length - 1 ? 12 : 0 }}>
                        {/* Product Thumbnail */}
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
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>
                          {formatCurrency(item.harga * item.qty)}
                        </div>
                      </div>
                    ))}

                    {/* Custom Design Badge */}
                    {order.custom_design && (
                      <div style={{
                        marginTop: 12, padding: '8px 12px', borderRadius: 8,
                        background: 'var(--color-primary-bg)', border: '1px solid var(--color-primary)',
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <PaletteIcon />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)' }}>Custom Design: {order.custom_design.tema}</div>
                          <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>"{order.custom_design.ucapan}"</div>
                        </div>
                      </div>
                    )}

                    {/* Shipping Badge */}
                    {order.shipping?.no_resi && (
                      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                        <TruckIcon />
                        <span>{order.shipping.kurir} — {order.shipping.no_resi}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Footer — Total + Actions */}
                  <div style={{
                    padding: '12px 20px',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Total: </span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-primary)' }}>{formatCurrency(order.total_harga)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {/* WhatsApp per-order */}
                      <button
                        onClick={() => handleWhatsApp(order.id)}
                        style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: '#25D366', border: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        title="Tanya via WhatsApp"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                      </button>

                      {/* Track */}
                      <Link to={`/orders/${order.id}`} className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>
                        Lacak
                      </Link>

                      {/* Reorder */}
                      {(order.status === 'completed' || order.status === 'shipped') && (
                        <motion.button
                          onClick={() => handleReorder(order)}
                          disabled={reorderingId === order.id}
                          className="btn btn-primary btn-sm"
                          style={{
                            fontSize: 12, display: 'flex', alignItems: 'center', gap: 6,
                            background: reorderSuccess === order.id ? 'var(--color-success)' : undefined,
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {reorderingId === order.id ? (
                            <><span className="spinner" style={{ width: 14, height: 14 }} /> Menambahkan...</>
                          ) : reorderSuccess === order.id ? (
                            <><CheckIcon /> Ditambahkan!</>
                          ) : (
                            <><RefreshIcon /> Beli Lagi</>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {userOrders.length === 0 && (
              <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🌸</div>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>
                  {filter !== 'all' ? 'Tidak ada pesanan dengan filter ini' : 'Belum ada pesanan'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>
                  {filter !== 'all' 
                    ? 'Coba filter lain untuk melihat pesanan Anda' 
                    : 'Mulai belanja dan temukan rangkaian bunga terbaik untuk Anda!'}
                </p>
                {filter === 'all' && (
                  <Link to="/products" className="btn btn-primary">Mulai Belanja</Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
