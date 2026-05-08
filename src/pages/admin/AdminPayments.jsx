import { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { mockPayments } from '../../lib/mockData';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '../../lib/utils';

export default function AdminPayments() {
  const [payments, setPayments] = useState(mockPayments);

  const updateStatus = (id, status) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status, tanggal_bayar: status === 'success' ? new Date().toISOString() : p.tanggal_bayar } : p));
  };

  return (
    <AdminLayout>
      <div className="page-enter">
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Verifikasi Pembayaran</h1>
        <div className="card" style={{ padding: 20 }}>
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Order</th><th>Pelanggan</th><th>Metode</th><th>Jumlah</th><th>Status</th><th>Tanggal</th><th>Aksi</th></tr></thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>#{p.order_id}</td>
                    <td>{p.order.user.nama}</td>
                    <td>{p.metode}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(p.jumlah)}</td>
                    <td><span className={`badge ${getStatusBadgeClass(p.status)}`}>{getStatusLabel(p.status)}</span></td>
                    <td>{formatDate(p.tanggal_bayar)}</td>
                    <td>
                      {p.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-primary btn-sm" onClick={() => updateStatus(p.id, 'success')}>Konfirmasi</button>
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red-600)' }} onClick={() => updateStatus(p.id, 'failed')}>Tolak</button>
                        </div>
                      ) : <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>—</span>}
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
