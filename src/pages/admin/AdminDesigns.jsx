import AdminLayout from '../../components/layout/AdminLayout';
import { mockDesigns } from '../../lib/mockData';

export default function AdminDesigns() {
  return (
    <AdminLayout>
      <div className="page-enter">
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Desain Kustom</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {mockDesigns.map(d => (
            <div key={d.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Order #{d.order_id}</span>
                <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{d.order.user.nama}</span>
              </div>
              <div style={{ background: 'var(--gray-50)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontStyle: 'italic', color: 'var(--gray-700)', lineHeight: 1.6 }}>"{d.ucapan}"</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 4 }}>Warna</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{d.warna}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 4 }}>Tema</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{d.tema}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
