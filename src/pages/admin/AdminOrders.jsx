import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import useOrderStore from '../../store/orderStore';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '../../lib/utils';

// Filter tabs — all statuses can be viewed
const FILTER_OPTIONS = ['all', 'pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'];
// Admin can only update status up to 'shipped' — 'completed' is exclusive to customer
const ADMIN_STATUS_OPTIONS = ['pending', 'paid', 'processing', 'shipped'];

export default function AdminOrders() {
  const { orders, updateOrderStatus, fetchOrders } = useOrderStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const updateStatus = (id, newStatus) => {
    updateOrderStatus(id, newStatus);
  };

  return (
    <AdminLayout>
      <div className="page-enter">
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Manajemen Pesanan</h1>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {FILTER_OPTIONS.map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}>
                {s === 'all' ? 'Semua' : getStatusLabel(s)}
              </button>
            ))}
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>ID</th><th>Pelanggan</th><th>Tanggal</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 600 }}>#{o.id}</td>
                    <td>{o.user.nama}</td>
                    <td>{formatDate(o.tanggal_order)}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(o.total_harga)}</td>
                    <td><span className={`badge ${getStatusBadgeClass(o.status)}`}>{getStatusLabel(o.status)}</span></td>
                    <td>
                      {/* Admin can only set status up to 'shipped'. 'completed' is set by customer only. */}
                      {o.status === 'completed' ? (
                        <span className="badge badge-completed" style={{ fontSize: 12 }}>Selesai oleh Customer</span>
                      ) : o.status === 'cancelled' ? (
                        <span className="badge badge-cancelled" style={{ fontSize: 12 }}>Dibatalkan</span>
                      ) : (
                        <select
                          className="select"
                          style={{ width: 'auto', fontSize: 12, padding: '4px 8px' }}
                          value={o.status}
                          onChange={e => updateStatus(o.id, e.target.value)}
                        >
                          {ADMIN_STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{getStatusLabel(s)}</option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
