import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';

const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/**
 * Auth Guard Modal — Glassmorphism style.
 * Intercepts guest users at checkout, provides Google Login,
 * and resumes checkout flow after authentication.
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - onAuthSuccess: () => void  — callback after successful login
 */
export default function AuthGuardModal({ isOpen, onClose, onAuthSuccess }) {
  const { loginWithGoogle, login, isLoading, error, clearError, isDemoMode } = useAuthStore();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    const ok = await loginWithGoogle();
    // In demo mode, trigger success callback immediately
    // In production, OAuth redirects away and auth is restored on return
    if (ok && isDemoMode) {
      onAuthSuccess?.();
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) onAuthSuccess?.();
  };

  const handleClose = () => {
    clearError();
    setShowEmailForm(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 9998,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-40%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              zIndex: 9999,
              width: '100%', maxWidth: 440,
              maxHeight: '90vh',
              borderRadius: 20,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            {/* Glass header */}
            <div style={{
              background: 'linear-gradient(135deg, var(--red-800), var(--red-600))',
              padding: '32px 28px 24px',
              position: 'relative',
            }}>
              <button
                onClick={handleClose}
                style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'rgba(255,255,255,0.15)', border: 'none',
                  borderRadius: '50%', width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'rgba(255,255,255,0.8)',
                }}
                aria-label="Tutup modal"
              >
                <CloseIcon />
              </button>

              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16, backdropFilter: 'blur(10px)',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>

              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700,
                color: 'white', marginBottom: 6,
              }}>
                Masuk untuk Melanjutkan
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                Kami memerlukan akun Anda untuk menyimpan alamat pengiriman dan memproses pesanan.
              </p>
            </div>

            {/* Body */}
            <div style={{
              background: 'var(--color-surface)',
              padding: '24px 28px 28px',
            }}>
              {error && (
                <div style={{
                  padding: '10px 14px', background: 'var(--red-50)',
                  color: 'var(--red-700)', borderRadius: 8, fontSize: 13,
                  marginBottom: 16, border: '1px solid var(--red-200)',
                }}>
                  {error}
                </div>
              )}

              {/* Google Login — Primary CTA */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                style={{
                  width: '100%', padding: '14px 20px', borderRadius: 12,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                  fontSize: 15, fontWeight: 600, color: 'var(--color-text)',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={e => { if(!isLoading) e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}
              >
                {isLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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

              {/* Benefits */}
              <div style={{
                margin: '20px 0',
                padding: 16, borderRadius: 12,
                background: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Keuntungan Daftar
                </div>
                {[
                  'Lacak status pesanan real-time',
                  'Simpan alamat pengiriman favorit',
                  'Dapatkan promo & diskon eksklusif',
                  'Riwayat pesanan tersimpan aman',
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {b}
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>atau</span>
                <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
              </div>

              {/* Email Login — Secondary */}
              {!showEmailForm ? (
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="btn btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 14 }}
                >
                  Masuk dengan Email & Password
                </button>
              ) : (
                <motion.form
                  onSubmit={handleEmailLogin}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <div style={{ marginBottom: 12 }}>
                    <label className="label">Email</label>
                    <input
                      className="input"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="email@contoh.com"
                      required
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label className="label">Password</label>
                    <input
                      className="input"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Memproses...' : 'Masuk'}
                  </button>
                  {isDemoMode && (
                    <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, color: 'var(--color-text-muted)' }}>
                      Demo: admin@florentt.com / password
                    </div>
                  )}
                </motion.form>
              )}

              {/* Trust footer */}
              <div style={{
                marginTop: 20, paddingTop: 16,
                borderTop: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                <ShieldIcon />
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                  Data Anda terenkripsi dan aman
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
