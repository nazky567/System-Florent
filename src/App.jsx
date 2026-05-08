import { HashRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/guards/AuthGuards';
import WhatsAppFloat from './components/chat/WhatsAppFloat';
import useAuthStore from './store/authStore';

// Customer Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductCatalog from './pages/ProductCatalog';
import ProductDetail from './pages/ProductDetail';
import CheckoutPage from './pages/CheckoutPage';
import CustomerDashboard from './pages/CustomerDashboard';
import OrderTracking from './pages/OrderTracking';
import CustomDesignPage from './pages/CustomDesignPage';
import AuthCallback from './pages/AuthCallback';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPayments from './pages/admin/AdminPayments';
import AdminShipping from './pages/admin/AdminShipping';
import AdminDesigns from './pages/admin/AdminDesigns';

/**
 * AuthInitializer — runs initAuth on mount.
 * initAuth handles: session restore, OAuth code exchange, and redirect.
 */
function AuthInitializer() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return null;
}

export default function App() {
  return (
    <HashRouter>
      <AuthInitializer />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductCatalog />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/custom-design" element={<CustomDesignPage />} />

        {/* Auth */}
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Customer Protected */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />

        {/* Admin Protected */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
        <Route path="/admin/shipping" element={<AdminRoute><AdminShipping /></AdminRoute>} />
        <Route path="/admin/designs" element={<AdminRoute><AdminDesigns /></AdminRoute>} />
      </Routes>

      <WhatsAppFloat />
    </HashRouter>
  );
}
