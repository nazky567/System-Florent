import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomerLayout from '../components/layout/CustomerLayout';
import { mockProducts } from '../lib/mockData';
import { formatCurrency, assetUrl } from '../lib/utils';

/* ── SVG Icons ──────────────────────────────────────────────── */
const FlowerIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 0 1 0 8 4 4 0 0 1 0-8z"/><path d="M19.07 4.93a4 4 0 0 1-5.66 5.66 4 4 0 0 1 5.66-5.66z"/><path d="M22 12a4 4 0 0 1-8 0 4 4 0 0 1 8 0z"/><path d="M19.07 19.07a4 4 0 0 1-5.66-5.66 4 4 0 0 1 5.66 5.66z"/><path d="M12 22a4 4 0 0 1 0-8 4 4 0 0 1 0 8z"/><path d="M4.93 19.07a4 4 0 0 1 5.66-5.66 4 4 0 0 1-5.66 5.66z"/><path d="M2 12a4 4 0 0 1 8 0 4 4 0 0 1-8 0z"/><path d="M4.93 4.93a4 4 0 0 1 5.66 5.66 4 4 0 0 1-5.66-5.66z"/></svg>;
const TruckIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const PaletteIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>;
const ShieldIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const ArrowRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

const features = [
  { icon: FlowerIcon, title: 'Bunga Segar Premium', desc: 'Rangkaian bunga segar pilihan berkualitas tinggi untuk setiap momen spesial Anda.' },
  { icon: PaletteIcon, title: 'Kustomisasi Kreatif', desc: 'Personalisasi ucapan, warna, dan tema sesuai keinginan Anda.' },
  { icon: TruckIcon, title: 'Pengiriman Cepat', desc: 'Layanan pengiriman same-day ke seluruh area Jabodetabek.' },
  { icon: ShieldIcon, title: 'Jaminan Kualitas', desc: 'Garansi kesegaran bunga dan kepuasan pelanggan 100%.' },
];

export default function LandingPage() {
  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <CustomerLayout>
      {/* ── Hero Section ──────────────────────────────────── */}
      <section style={{
        position: 'relative',
        padding: '100px 24px 80px',
        overflow: 'hidden',
      }}>
        {/* Full-width background image */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 0,
        }}>
          <img src={assetUrl('/images/hero-flowers.png')} alt="" style={{
            width: '100%', height: '100%', objectFit: 'cover',
          }} />
          {/* Dark gradient overlay for readability */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(135deg, rgba(127,29,29,0.88) 0%, rgba(185,28,28,0.82) 40%, rgba(220,38,38,0.75) 100%)',
          }} />
        </div>

        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', zIndex: 1 }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', zIndex: 1 }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-full)', marginBottom: 20, fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 500, backdropFilter: 'blur(10px)' }}>
              Rangkaian Bunga Premium Indonesia
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 700, color: 'white',
              lineHeight: 1.15, marginBottom: 20,
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}>
              Ungkapkan Perasaan<br />Melalui Keindahan<br />
              <span style={{ color: 'var(--gold-400)' }}>Bunga</span>
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, maxWidth: 480, marginBottom: 32, textShadow: '0 1px 8px rgba(0,0,0,0.2)' }}>
              Temukan koleksi papan bunga, bouquet, dan rangkaian bunga kustom terbaik untuk setiap momen berharga Anda.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/products" className="btn btn-lg" style={{ background: 'white', color: 'var(--red-700)', fontWeight: 700, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                Lihat Koleksi <ArrowRight />
              </Link>
              <Link to="/register" className="btn btn-lg" style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)' }}>
                Daftar Gratis
              </Link>
            </div>
          </motion.div>

          {/* Hero Right - Stats Cards */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Glass stats card */}
            <div className="hero-glass" style={{ padding: 24 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 8, fontWeight: 500 }}>Pelanggan Puas</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 42, fontWeight: 800, color: 'white' }}>2,500+</span>
                <span style={{ fontSize: 13, color: 'var(--gold-400)', fontWeight: 600 }}>Pesanan Terkirim</span>
              </div>
              <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
                <div><div style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>98%</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Rating Positif</div></div>
                <div><div style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>24h</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Pengiriman</div></div>
                <div><div style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>50+</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Kota</div></div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="hero-glass" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldIcon />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Garansi 100% Bunga Segar</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Jaminan kualitas untuk setiap pesanan</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--red-50)', color: 'var(--red-700)', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Keunggulan Kami</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 12 }}>Mengapa Memilih Florent?</h2>
            <p style={{ fontSize: 16, color: 'var(--gray-500)', maxWidth: 520, margin: '0 auto' }}>Kami menghadirkan pengalaman memesan bunga yang modern, personal, dan tanpa ribet.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card" style={{ padding: 28, textAlign: 'center', cursor: 'default' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--red-50)', color: 'var(--red-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <f.icon />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'var(--color-bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
            <div>
              <span style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--red-50)', color: 'var(--red-700)', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Koleksi Terbaru</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--gray-900)' }}>Produk Pilihan</h2>
            </div>
            <Link to="/products" className="btn btn-secondary">Lihat Semua <ArrowRight /></Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {featuredProducts.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                <Link to={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ height: 200, overflow: 'hidden', background: 'linear-gradient(135deg, var(--red-100), var(--red-50))' }}>
                      {p.gambar ? (
                        <img src={p.gambar} alt={p.nama_produk} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red-300)' }}><FlowerIcon /></div>
                      )}
                    </div>
                    <div style={{ padding: 20 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--red-600)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{p.kategori}</div>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-800)', marginBottom: 8, lineHeight: 1.3 }}>{p.nama_produk}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--red-700)' }}>{formatCurrency(p.harga)}</span>
                        {p.stok <= 10 && <span style={{ fontSize: 11, color: 'var(--color-warning)', fontWeight: 600 }}>Stok Terbatas</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Custom Design Studio CTA ──────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'var(--color-surface)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', padding: '6px 16px', background: 'var(--color-primary-bg)', color: 'var(--color-primary)', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Fitur Baru</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--color-text)', marginBottom: 16, lineHeight: 1.2 }}>
                Custom Design Studio
              </h2>
              <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
                Buat banner wisuda parodi, spanduk unik, atau desain papan bunga custom dengan tema trending: Superhero, Meme, Kampanye Politik, dan banyak lagi. Cetak langsung ke produk fisik!
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {['Superhero', 'Meme Parodi', 'Kampanye', 'Retro Y2K', 'Elegant'].map(t => (
                  <span key={t} style={{ fontSize: 12, padding: '4px 12px', background: 'var(--color-primary-bg)', color: 'var(--color-primary)', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>{t}</span>
                ))}
              </div>
              <Link to="/custom-design" className="btn btn-primary btn-lg">Mulai Desain <ArrowRight /></Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: 180 }}><img src={assetUrl('/images/themes/superhero.png')} alt="Tema Superhero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: 180 }}><img src={assetUrl('/images/themes/meme-parodi.png')} alt="Tema Meme Parodi" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: 180 }}><img src={assetUrl('/images/themes/politik.png')} alt="Tema Politik" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: 180 }}><img src={assetUrl('/images/themes/elegant.png')} alt="Tema Elegant" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, var(--red-800), var(--red-700))' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'white', marginBottom: 16, lineHeight: 1.2 }}>
            Siap Membuat Momen Lebih Berkesan?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 32, lineHeight: 1.7 }}>
            Mulai pilih rangkaian bunga terbaik dan kustomisasi pesan spesial Anda sekarang juga.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/products" className="btn btn-lg" style={{ background: 'white', color: 'var(--red-700)', fontWeight: 700 }}>
              Mulai Pesan Sekarang
            </Link>
            <Link to="/custom-design" className="btn btn-lg" style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.4)' }}>
              Custom Design
            </Link>
          </div>
        </motion.div>
      </section>
    </CustomerLayout>
  );
}
