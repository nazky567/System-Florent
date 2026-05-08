import { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { mockProducts, KATEGORI_OPTIONS } from '../../lib/mockData';
import { formatCurrency } from '../../lib/utils';

export default function AdminProducts() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState('');

  const filtered = products.filter(p => p.nama_produk.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="page-enter">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Manajemen Produk</h1>
          <button className="btn btn-primary">+ Tambah Produk</button>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <input className="input" style={{ maxWidth: 320, marginBottom: 16 }} placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Aksi</th></tr></thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.nama_produk}</td>
                    <td><span className="badge badge-paid">{p.kategori}</span></td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(p.harga)}</td>
                    <td><span className={`badge ${p.stok > 10 ? 'badge-completed' : 'badge-pending'}`}>{p.stok}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm">Edit</button>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red-600)' }}>Hapus</button>
                      </div>
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
