import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomerLayout from '../components/layout/CustomerLayout';
import { mockProducts, KATEGORI_OPTIONS } from '../lib/mockData';
import { formatCurrency } from '../lib/utils';

const FlowerIcon = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 0 1 0 8 4 4 0 0 1 0-8z"/><path d="M22 12a4 4 0 0 1-8 0 4 4 0 0 1 8 0z"/><path d="M12 22a4 4 0 0 1 0-8 4 4 0 0 1 0 8z"/><path d="M2 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

export default function ProductCatalog() {
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('all');
  const [sort, setSort] = useState('default');

  let filtered = mockProducts.filter(p => {
    const matchSearch = p.nama_produk.toLowerCase().includes(search.toLowerCase());
    const matchKat = kategori === 'all' || p.kategori === kategori;
    return matchSearch && matchKat;
  });

  if (sort === 'price-asc') filtered.sort((a, b) => a.harga - b.harga);
  if (sort === 'price-desc') filtered.sort((a, b) => b.harga - a.harga);
  if (sort === 'name') filtered.sort((a, b) => a.nama_produk.localeCompare(b.nama_produk));

  return (
    <CustomerLayout>
      <div className="page-enter" style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--gray-900)' }}>Koleksi Produk</h1>
            <p style={{ fontSize: 14, color: 'var(--gray-500)', marginTop: 4 }}>Temukan rangkaian bunga terbaik untuk momen spesial Anda</p>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
              <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}><SearchIcon /></div>
              <input className="input" style={{ paddingLeft: 40 }} placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="select" style={{ width: 'auto', minWidth: 160 }} value={kategori} onChange={e => setKategori(e.target.value)}>
              <option value="all">Semua Kategori</option>
              {KATEGORI_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <select className="select" style={{ width: 'auto', minWidth: 160 }} value={sort} onChange={e => setSort(e.target.value)}>
              <option value="default">Urutan Default</option>
              <option value="price-asc">Harga: Rendah - Tinggi</option>
              <option value="price-desc">Harga: Tinggi - Rendah</option>
              <option value="name">Nama: A - Z</option>
            </select>
          </div>

          {/* Products Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray-400)' }}>Produk tidak ditemukan</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
              {filtered.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ overflow: 'hidden' }}>
                      {p.gambar ? (
                        <div style={{ height: 200, overflow: 'hidden' }}>
                          <img src={p.gambar} alt={p.nama_produk} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                        </div>
                      ) : (
                        <div style={{ height: 200, background: 'linear-gradient(135deg, var(--red-100), var(--red-50))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red-300)' }}>
                          <FlowerIcon />
                        </div>
                      )}
                      <div style={{ padding: 20 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--red-600)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{p.kategori}</span>
                        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-800)', margin: '6px 0 10px', lineHeight: 1.3 }}>{p.nama_produk}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--red-700)' }}>{formatCurrency(p.harga)}</span>
                          <span className={`badge ${p.stok > 10 ? 'badge-completed' : 'badge-pending'}`}>Stok: {p.stok}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
}
