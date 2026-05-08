import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useThemeStore from '../../store/themeStore';
import { assetUrl } from '../../lib/utils';

/* ── SVG Icons ──────────────────────────────────────────────── */
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const navLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/products', label: 'Produk' },
  { to: '/custom-design', label: 'Custom Design' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const cartCount = useCartStore((s) => s.getCount());
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: scrolled ? 'var(--nav-bg)' : 'var(--nav-bg-transparent)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
    transition: 'all 0.3s ease',
  };

  return (
    <nav style={navStyle} role="navigation" aria-label="Main navigation">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }} aria-label="Florent Home">
          <img src={assetUrl('/images/Group 40.png')} alt="Florent Logo" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: theme === 'dark' ? 'white' : 'var(--color-primary)' }}>Florent</span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} style={({ isActive }) => ({
              fontSize: 14, fontWeight: 500,
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              textDecoration: 'none', transition: 'color 0.2s',
              borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
              paddingBottom: 4,
            })}>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            style={{ display: 'flex', alignItems: 'center', justifyContent: theme === 'light' ? 'flex-start' : 'flex-end' }}
          />

          {/* Cart */}
          <Link to="/checkout" style={{ position: 'relative', color: 'var(--color-text-secondary)', padding: 8 }} aria-label={`Keranjang belanja, ${cartCount} item`}>
            <CartIcon />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 2, background: 'var(--red-600)', color: 'white', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-hidden="true">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-ghost btn-sm">
                <UserIcon /> {user.nama?.split(' ')[0]}
              </Link>
              <button onClick={logout} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }}>Keluar</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" className="btn btn-ghost btn-sm">Masuk</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Daftar</Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', padding: 4 }} className="mobile-toggle" aria-label="Toggle menu">
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', padding: '16px 24px' }}
          >
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{ display: 'block', padding: '8px 0', color: 'var(--color-text)', textDecoration: 'none', fontWeight: 500 }}>
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
