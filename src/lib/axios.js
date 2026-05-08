/**
 * API Client — Florentt
 *
 * In production mode: Uses Supabase client directly (no axios needed)
 * In demo mode: Returns mock data
 *
 * This file is kept for backward compatibility with any components
 * that still import from './axios'. New code should use supabase.js directly.
 */

import supabase, { IS_SUPABASE_CONFIGURED } from './supabase';

/**
 * Fetch products from Supabase or return mock data.
 */
export async function fetchProducts() {
  if (!IS_SUPABASE_CONFIGURED) {
    const { mockProducts } = await import('./mockData');
    return mockProducts;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('[API] Products fetch error:', error);
    const { mockProducts } = await import('./mockData');
    return mockProducts;
  }
  return data;
}

/**
 * Fetch single product by ID.
 */
export async function fetchProduct(id) {
  if (!IS_SUPABASE_CONFIGURED) {
    const { mockProducts } = await import('./mockData');
    return mockProducts.find(p => p.id === Number(id)) || null;
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[API] Product fetch error:', error);
    const { mockProducts } = await import('./mockData');
    return mockProducts.find(p => p.id === Number(id)) || null;
  }
  return data;
}

/**
 * Fetch orders for the authenticated user.
 */
export async function fetchUserOrders(userId) {
  if (!IS_SUPABASE_CONFIGURED) {
    const { mockOrders } = await import('./mockData');
    return mockOrders;
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_details (*),
      custom_designs (*),
      payments (*),
      shipping (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[API] Orders fetch error:', error);
    const { mockOrders } = await import('./mockData');
    return mockOrders;
  }

  // Transform to match the expected shape
  return data.map(order => ({
    ...order,
    items: order.order_details || [],
    custom_design: order.custom_designs?.[0] || null,
    payment: order.payments?.[0] || null,
    shipping: order.shipping?.[0] || null,
  }));
}

/**
 * Create a new order.
 */
export async function createOrder(orderData) {
  if (!IS_SUPABASE_CONFIGURED) {
    // Demo mode: simulate order creation
    return {
      id: Math.floor(Math.random() * 1000) + 100,
      ...orderData,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
  }

  // 1. Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: orderData.user_id,
      total_harga: orderData.total_harga,
      status: 'pending',
      alamat_kirim: orderData.alamat_kirim,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // 2. Create order details
  if (orderData.items?.length) {
    const details = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id || item.product?.id,
      nama_produk: item.nama_produk || item.product?.nama_produk,
      harga: item.harga || item.product?.harga,
      qty: item.qty,
      gambar: item.gambar || item.product?.gambar,
    }));
    await supabase.from('order_details').insert(details);
  }

  // 3. Create custom design if applicable
  if (orderData.custom_design) {
    await supabase.from('custom_designs').insert({
      order_id: order.id,
      ...orderData.custom_design,
    });
  }

  // 4. Create payment record
  if (orderData.payment) {
    await supabase.from('payments').insert({
      order_id: order.id,
      metode: orderData.payment.metode,
      jumlah: orderData.total_harga,
      status: 'pending',
    });
  }

  return order;
}

/**
 * Admin: Fetch all orders.
 */
export async function fetchAllOrders() {
  if (!IS_SUPABASE_CONFIGURED) {
    const { mockOrders } = await import('./mockData');
    return mockOrders;
  }

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles:user_id (nama, email),
      order_details (*),
      custom_designs (*),
      payments (*),
      shipping (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[API] Admin orders error:', error);
    const { mockOrders } = await import('./mockData');
    return mockOrders;
  }

  return data.map(order => ({
    ...order,
    user: order.profiles || {},
    items: order.order_details || [],
    custom_design: order.custom_designs?.[0] || null,
    payment: order.payments?.[0] || null,
    shipping: order.shipping?.[0] || null,
  }));
}

/**
 * Admin: Fetch dashboard stats.
 */
export async function fetchDashboardStats() {
  if (!IS_SUPABASE_CONFIGURED) {
    const { mockStats, mockChartData } = await import('./mockData');
    return { stats: mockStats, chartData: mockChartData };
  }

  try {
    const [ordersRes, productsRes, customersRes] = await Promise.all([
      supabase.from('orders').select('id, total_harga, status'),
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ]);

    const orders = ordersRes.data || [];
    const stats = {
      total_revenue: orders.reduce((sum, o) => sum + Number(o.total_harga || 0), 0),
      total_orders: orders.length,
      total_products: productsRes.count || 0,
      total_customers: customersRes.count || 0,
      pending_orders: orders.filter(o => o.status === 'pending').length,
      processing_orders: orders.filter(o => o.status === 'processing').length,
    };

    return { stats, chartData: [] };
  } catch {
    const { mockStats, mockChartData } = await import('./mockData');
    return { stats: mockStats, chartData: mockChartData };
  }
}

// Default export for backward compatibility
export default { fetchProducts, fetchProduct, fetchUserOrders, createOrder };
