import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomerLayout from '../components/layout/CustomerLayout';
import useAuthStore from '../store/authStore';
import { assetUrl } from '../lib/utils';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function RegisterPage() {
  const [form, setForm] = useState({ nama: '', email: '', password: '', password_confirmation: '', no_hp: '', alamat: '' });
  const [showForm, setShowForm] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const { register, loginWithGoogle, isLoading, error, isDemoMode } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) return;
    const result = await register(form);
    if (result === 'confirm_email') {
      setConfirmEmail(true);
    } else if (result === true) {
      navigate('/dashboard');
    }
  };

  const handleGoogleRegister = async () => {
    const ok = await loginWithGoogle();
    if (ok && isDemoMode) navigate('/dashboard');
  };

  const updateField = (field, value) => setForm(f => ({ ...f, [field]: value }));

  if (confirmEmail) {
    return (
      <CustomerLayout>
        <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ width: '100%', maxWidth: 480, padding: 40, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--color-text)', marginBottom: 12 }}>Cek Email Anda!</h2>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
              Kami telah mengirim link konfirmasi ke <strong>{form.email}</strong>. Klik link tersebut untuk mengaktifkan akun Anda.
            </p>
            <Link to="/login" className="btn btn-primary">Kembali ke Login</Link>
          </motion.div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ width: '100%', maxWidth: 500, padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <img src={assetUrl('/images/Group 40.png')} alt="Florent Logo" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', margin: '0 auto 16px', display: 'block' }} />
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--color-text)' }}>Buat Akun</h1>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 4 }}>Bergabung dengan Florent sekarang</p>
          </div>
          {error && <div style={{ padding: '10px 14px', background: 'var(--red-50)', color: 'var(--red-700)', borderRadius: 8, fontSize: 13, marginBottom: 16, border: '1px solid var(--red-200)' }}>{error}</div>}

          {/* Google Register */}
          <button
            onClick={handleGoogleRegister}
            disabled={isLoading}
            style={{
              width: '100%', padding: '12px 20px', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)', background: 'var(--color-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              fontSize: 15, fontWeight: 600, color: 'var(--color-text)',
              cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              boxShadow: 'var(--shadow-sm)', opacity: isLoading ? 0.7 : 1,
            }}
            onMouseEnter={e => { if(!isLoading) e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
            aria-label="Daftar dengan Google"
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="spinner" style={{ width: 18, height: 18 }} />
                Menghubungkan...
              </span>
            ) : (
              <>
                <GoogleIcon />
                Daftar dengan Google
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
            }}>
              Demo Mode — Supabase belum dikonfigurasi
            </div>
          )}

          {/* Divider */}
          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>atau</span>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>

          {!showForm ? (
            <button onClick={() => setShowForm(true)} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
              Daftar dengan Email & Password
            </button>
          ) : (
            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div><label className="label">Nama Lengkap</label><input className="input" value={form.nama} onChange={e => updateField('nama', e.target.value)} required /></div>
                <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={e => updateField('email', e.target.value)} required /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div><label className="label">Password</label><input className="input" type="password" value={form.password} onChange={e => updateField('password', e.target.value)} minLength={6} required /></div>
                <div><label className="label">Konfirmasi Password</label><input className="input" type="password" value={form.password_confirmation} onChange={e => updateField('password_confirmation', e.target.value)} required /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div><label className="label">No. HP</label><input className="input" value={form.no_hp} onChange={e => updateField('no_hp', e.target.value)} /></div>
                <div><label className="label">Alamat</label><input className="input" value={form.alamat} onChange={e => updateField('alamat', e.target.value)} /></div>
              </div>
              {form.password && form.password_confirmation && form.password !== form.password_confirmation && (
                <div style={{ padding: '8px 12px', background: 'var(--red-50)', color: 'var(--red-700)', borderRadius: 6, fontSize: 12, marginBottom: 12, border: '1px solid var(--red-200)' }}>
                  Password dan konfirmasi tidak cocok
                </div>
              )}
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={isLoading || (form.password !== form.password_confirmation)}>
                {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
              </button>
            </motion.form>
          )}
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--color-text-secondary)' }}>
            Sudah punya akun? <Link to="/login" style={{ fontWeight: 600 }}>Masuk di sini</Link>
          </p>
        </motion.div>
      </div>
    </CustomerLayout>
  );
}
