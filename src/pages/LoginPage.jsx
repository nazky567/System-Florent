import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomerLayout from '../components/layout/CustomerLayout';
import useAuthStore from '../store/authStore';
import { assetUrl } from '../lib/utils';

/* ── Google SVG Icon ────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const { login, loginWithGoogle, isLoading, error, clearError, isDemoMode, user } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form.email, form.password);
    if (ok) {
      // Re-read fresh user from store after login completes
      const freshUser = useAuthStore.getState().user;
      navigate(freshUser?.role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    const ok = await loginWithGoogle();
    // In production mode, Google OAuth redirects away from the page
    // so navigation only happens in demo mode
    if (ok && isDemoMode) {
      const freshUser = useAuthStore.getState().user;
      navigate(freshUser?.role === 'admin' ? '/admin' : '/dashboard');
    }
  };

  return (
    <CustomerLayout>
      <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
          {/* Logo & Title */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <img src={assetUrl('/images/Group 40.png')} alt="Florent Logo" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', margin: '0 auto 16px', display: 'block' }} />
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>Selamat Datang</h1>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>Masuk ke akun Florent Anda</p>
          </div>

          {/* Error */}
          {error && <div style={{ padding: '10px 14px', background: 'var(--red-50)', color: 'var(--red-700)', borderRadius: 8, fontSize: 13, marginBottom: 16, border: '1px solid var(--red-200)' }}>{error}</div>}

          {/* ── Google Login (Primary) ──────────────────────── */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            style={{
              width: '100%', padding: '12px 20px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)', background: 'var(--color-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              fontSize: 15, fontWeight: 600, color: 'var(--color-text)',
              cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              boxShadow: 'var(--shadow-sm)',
              opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={e => { if(!isLoading) { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--gray-300)'; }}}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
            aria-label="Login dengan Google"
            id="google-login-btn"
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="spinner" style={{ width: 18, height: 18 }} />
                Menghubungkan...
              </span>
            ) : (
              <>
                <GoogleIcon />
                Lanjutkan dengan Google
              </>
            )}
          </button>

          {/* Demo Mode Hint */}
          {isDemoMode && (
            <div style={{
              marginTop: 10, padding: '6px 10px',
              background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
              borderRadius: 6, fontSize: 11,
              color: '#4338CA', textAlign: 'center',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Demo Mode — Supabase belum dikonfigurasi
            </div>
          )}

          {/* Divider */}
          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>atau</span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>

          {/* ── Email/Password Login ───────────────────────── */}
          {!showEmailLogin ? (
            <button
              onClick={() => setShowEmailLogin(true)}
              className="btn btn-ghost"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Masuk dengan Email & Password
            </button>
          ) : (
            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <div style={{ marginBottom: 16 }}>
                <label className="label" htmlFor="login-email">Email</label>
                <input id="login-email" className="input" type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); clearError(); }} placeholder="email@contoh.com" required />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="label" htmlFor="login-password">Password</label>
                <input id="login-password" className="input" type="password" value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); clearError(); }} placeholder="Masukkan password" required />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={isLoading}>
                {isLoading ? 'Memproses...' : 'Masuk'}
              </button>
              {isDemoMode && (
                <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: 'var(--color-text-muted)' }}>
                  Demo: admin@florentt.com / password &nbsp;atau&nbsp; siti@email.com / password
                </div>
              )}
            </motion.form>
          )}

          {/* Register Link */}
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--color-text-secondary)' }}>
            Belum punya akun? <Link to="/register" style={{ fontWeight: 600 }}>Daftar di sini</Link>
          </p>
        </motion.div>
      </div>
    </CustomerLayout>
  );
}
