import AdminSidebar from './AdminSidebar';
import useAuthStore from '../../store/authStore';

export default function AdminLayout({ children }) {
  const { user } = useAuthStore();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', transition: 'background 0.3s ease' }}>
      <AdminSidebar />

      {/* Main Content */}
      <div style={{ marginLeft: 240, minHeight: '100vh' }}>
        {/* Top Bar */}
        <header style={{
          height: 56,
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '0 24px', position: 'sticky', top: 0, zIndex: 40,
          transition: 'background 0.3s, border-color 0.3s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--color-primary-bg)',
              color: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 600,
            }}>
              {user?.nama?.charAt(0) || 'A'}
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>{user?.nama || 'Admin'}</span>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: 24 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
