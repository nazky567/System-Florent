import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminLayout from '../../components/layout/AdminLayout';
import { mockStats, mockChartData, mockOrders } from '../../lib/mockData';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '../../lib/utils';

const RevenueIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const OrdersIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>;
const ProductsIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;
const UsersIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;

const stats = [
  { label: 'Total Pendapatan', value: formatCurrency(mockStats.total_revenue), icon: RevenueIcon, color: 'stat-icon-red' },
  { label: 'Total Pesanan', value: mockStats.total_orders, icon: OrdersIcon, color: 'stat-icon-blue' },
  { label: 'Total Produk', value: mockStats.total_products, icon: ProductsIcon, color: 'stat-icon-green' },
  { label: 'Total Pelanggan', value: mockStats.total_customers, icon: UsersIcon, color: 'stat-icon-amber' },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="page-enter">
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Dashboard</h1>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
              <div className={`stat-icon ${s.color}`}><s.icon /></div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Pendapatan Bulanan</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${v/1000000}jt`} />
                <Tooltip formatter={v => formatCurrency(v)} />
                <Line type="monotone" dataKey="total" stroke="#b91c1c" strokeWidth={2} dot={{ r: 4, fill: '#b91c1c' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Pesanan per Bulan</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Pesanan Terbaru</h3>
          <div className="table-wrapper">
            <table className="table">
              <thead><tr><th>ID</th><th>Pelanggan</th><th>Tanggal</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {mockOrders.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 600 }}>#{o.id}</td>
                    <td>{o.user.nama}</td>
                    <td>{formatDate(o.tanggal_order)}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(o.total_harga)}</td>
                    <td><span className={`badge ${getStatusBadgeClass(o.status)}`}>{getStatusLabel(o.status)}</span></td>
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
