/**
 * Trust badges displayed in checkout footer.
 * Reduces friction and increases conversion confidence.
 */

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const QrisIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/>
    <line x1="21" y1="14" x2="21" y2="21"/><line x1="14" y1="21" x2="21" y2="21"/>
  </svg>
);

export default function TrustBadges() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
        padding: '16px 0',
      }}
      role="complementary"
      aria-label="Trust badges keamanan pembayaran"
    >
      <span className="trust-badge">
        <QrisIcon />
        QRIS Supported
      </span>
      <span className="trust-badge">
        <ShieldIcon />
        Secured by Midtrans
      </span>
      <span className="trust-badge">
        <LockIcon />
        Enkripsi SSL 256-bit
      </span>
    </div>
  );
}
