import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../lib/utils';

/**
 * Full-screen glassmorphism success modal with checkmark animation.
 * Appears after QRIS/payment is confirmed.
 * WCAG AA: contrast ratio ≥ 4.5:1 on all text.
 */
export default function PaymentSuccessModal({ isOpen, orderId, amount, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="success-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Pembayaran berhasil"
        >
          <motion.div
            className="success-modal-content"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Animated Checkmark */}
            <div style={{ marginBottom: 24 }}>
              <svg
                className="checkmark-svg"
                width="80"
                height="80"
                viewBox="0 0 80 80"
                style={{ margin: '0 auto' }}
                role="img"
                aria-label="Pembayaran berhasil"
              >
                <circle
                  className="circle"
                  cx="40" cy="40" r="36"
                  fill="none"
                  stroke="var(--color-success)"
                  strokeWidth="3"
                />
                <polyline
                  className="check"
                  points="26,42 36,52 54,30"
                  fill="none"
                  stroke="var(--color-success)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Title */}
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--color-text)',
              marginBottom: 8,
            }}>
              Pembayaran Berhasil!
            </h2>

            <p style={{
              fontSize: 14,
              color: 'var(--color-text-secondary)',
              marginBottom: 24,
              lineHeight: 1.6,
            }}>
              Terima kasih, pembayaran Anda telah dikonfirmasi.
            </p>

            {/* Order Summary */}
            <div style={{
              background: 'var(--color-primary-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 16,
              marginBottom: 28,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Order ID</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>#{orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Total</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary)' }}>
                  {formatCurrency(amount)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link
                to="/"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={onClose}
                aria-label="Kembali ke Beranda"
              >
                Kembali ke Beranda
              </Link>
              <Link
                to={`/orders/${orderId}`}
                className="btn btn-secondary btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={onClose}
                aria-label="Lacak pesanan saya"
              >
                Lacak Pesanan Saya
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
