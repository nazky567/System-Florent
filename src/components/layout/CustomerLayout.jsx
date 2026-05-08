import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { WHATSAPP_NUMBER } from '../../lib/mockData';
import { assetUrl } from '../../lib/utils';

const WhatsAppSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function CustomerLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)', transition: 'background 0.3s ease' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: 64 }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--red-900)',
        color: 'rgba(255,255,255,0.8)',
        padding: '48px 24px 24px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <img src={assetUrl('/images/Group 40.png')} alt="Florent Logo" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'white' }}>Florent</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.7 }}>Toko papan bunga & rangkaian bunga premium dengan layanan kustomisasi kreatif dan custom design studio.</p>
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 12 }}>Menu</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }} aria-label="Footer navigation">
              <Link to="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Beranda</Link>
              <Link to="/products" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Produk</Link>
              <Link to="/custom-design" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Custom Design</Link>
              <Link to="/login" style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Masuk</Link>
            </nav>
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 12 }}>Kontak</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 13, opacity: 0.6 }}>info@florent.com</span>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Halo Florent! Saya ingin bertanya tentang produk Anda.')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 13, color: '#25D366', textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                <WhatsAppSmall /> 0895-2912-7505
              </a>
              <span style={{ fontSize: 13, opacity: 0.6 }}>Jakarta, Indonesia</span>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 12 }}>Pembayaran</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['QRIS', 'BCA', 'Mandiri', 'BRI', 'GoPay'].map(p => (
                <span key={p} style={{ fontSize: 11, padding: '3px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: 4, color: 'rgba(255,255,255,0.7)' }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '32px auto 0', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.15)', textAlign: 'center', fontSize: 12, opacity: 0.5 }}>
          &copy; {new Date().getFullYear()} Florentt. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
