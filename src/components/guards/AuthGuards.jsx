import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';

/**
 * Loading spinner shown while auth is initializing.
 * Auto-resolves after 6 seconds to prevent infinite loading.
 */
function AuthLoading() {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.warn('[AuthGuard] Auth init timed out after 6s — forcing ready');
      useAuthStore.setState({ _authReady: true });
      setTimedOut(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  if (timedOut) return null; // Will re-render with _authReady = true

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', gap: 12, color: 'var(--color-text-muted)',
    }}>
      <span className="spinner" style={{ width: 20, height: 20 }} />
      <span style={{ fontSize: 14 }}>Memuat...</span>
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const { user, token, _authReady } = useAuthStore();

  if (!_authReady) return <AuthLoading />;
  if (!token || !user) return <Navigate to="/login" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { user, token, _authReady } = useAuthStore();

  if (!_authReady) return <AuthLoading />;
  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export function GuestRoute({ children }) {
  const { user, token, _authReady } = useAuthStore();

  if (!_authReady) return <AuthLoading />;

  if (token && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}
