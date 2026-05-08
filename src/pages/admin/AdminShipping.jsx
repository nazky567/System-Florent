import { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { mockShipping } from '../../lib/mockData';
import { formatDate, getStatusBadgeClass, getStatusLabel } from '../../lib/utils';

export default function AdminShipping() {
  const [shipping, setShipping] = useState(mockShipping);

  const updateField = (id, field, value) => {
    setShipping(shipping.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <AdminLayout>
      <div className="page-enter">
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Manajemen Pengiriman</h1>
        <div className="card" style={{ padding: 20 }}>
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Order</th><th>Pelanggan</th><th>Kurir</th><th>No. Resi</th><th>Status</th><th>Tanggal Kirim</th><th>Aksi</th></tr></thead>
              <tbody>
                {shipping.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>#{s.order_id}</td>
                    <td>{s.order.user.nama}</td>
                    <td><input className="input" style={{ width: 120, padding: '4px 8px', fontSize: 12 }} value={s.kurir || ''} onChange={e => updateField(s.id, 'kurir', e.target.value)} placeholder="Nama kurir" /></td>
                    <td><input className="input" style={{ width: 140, padding: '4px 8px', fontSize: 12 }} value={s.no_resi || ''} onChange={e => updateField(s.id, 'no_resi', e.target.value)} placeholder="No. resi" /></td>
                    <td><span className={`badge ${getStatusBadgeClass(s.status_pengiriman)}`}>{getStatusLabel(s.status_pengiriman)}</span></td>
                    <td>{formatDate(s.tanggal_kirim)}</td>
                    <td>
                      <select className="select" style={{ width: 'auto', fontSize: 12, padding: '4px 8px' }} value={s.status_pengiriman} onChange={e => updateField(s.id, 'status_pengiriman', e.target.value)}>
                        <option value="diproses">Diproses</option>
                        <option value="dikirim">Dikirim</option>
                        <option value="diterima">Diterima</option>
                      </select>
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
