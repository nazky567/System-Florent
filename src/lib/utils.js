/**
 * Utility functions — Florentt
 */

/**
 * Format number as Indonesian Rupiah
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date string to localized Indonesian format
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Get CSS class name for order status badge
 */
export const getStatusBadgeClass = (status) => {
  const map = {
    pending: 'badge-warning',
    processing: 'badge-info',
    shipped: 'badge-primary',
    completed: 'badge-success',
    cancelled: 'badge-danger',
    success: 'badge-success',
    failed: 'badge-danger',
    diproses: 'badge-info',
    dikirim: 'badge-primary',
    diterima: 'badge-success',
  };
  return map[status] || 'badge-default';
};

/**
 * Get human-readable label for order status
 */
export const getStatusLabel = (status) => {
  const map = {
    pending: 'Menunggu',
    processing: 'Diproses',
    shipped: 'Dikirim',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
    success: 'Berhasil',
    failed: 'Gagal',
    diproses: 'Diproses',
    dikirim: 'Dikirim',
    diterima: 'Diterima',
  };
  return map[status] || status;
};

/**
 * Resolve asset path with Vite base URL.
 * Converts '/images/products/xxx.png' → '/System-Florent/images/products/xxx.png'
 */
const BASE_URL = import.meta.env.BASE_URL || '/';

export const assetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_URL}${cleanPath}`;
};
