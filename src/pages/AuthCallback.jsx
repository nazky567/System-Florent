import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

/**
 * Auth Callback — handles OAuth redirect from Supabase/Google.
 * Supabase appends tokens to the URL hash on redirect.
 * This page processes them and redirects to the dashboard.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const { handleAuthCallback, user } = useAuthStore();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const processAuth = async () => {
      try {
        const success = await handleAuthCallback();
        if (success) {
          setStatus('success');
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 1000);
        } else {
          setStatus('error');
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 2000);
        }
      } catch {
        setStatus('error');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    };

    processAuth();
  }, [handleAuthCallback, navigate]);

  // If user is already set (from onAuthStateChange), redirect immediately
  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', fontFamily: 'Inter, sans-serif',
      background: 'var(--color-bg, #f9fafb)',
    }}>
      <div style={{ textAlign: 'center' }}>
        {status === 'processing' && (
          <>
            <div className="spinner" style={{
              margin: '0 auto 16px', width: 36, height: 36,
              border: '3px solid #e5e7eb', borderTopColor: '#dc2626',
              borderRadius: '50%', animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: '#6b7280', fontSize: 15, fontWeight: 500 }}>
              Mengautentikasi akun Anda...
            </p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: '#10b981', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 24,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p style={{ color: '#10b981', fontSize: 15, fontWeight: 600 }}>
              Login berhasil! Mengarahkan...
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: '#ef4444', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 24,
            }}>✕</div>
            <p style={{ color: '#ef4444', fontSize: 15, fontWeight: 600 }}>
              Autentikasi gagal. Mengarahkan ke login...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
