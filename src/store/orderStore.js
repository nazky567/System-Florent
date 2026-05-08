import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import supabase, { IS_SUPABASE_CONFIGURED } from '../lib/supabase';

const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,

  // Fetch from Supabase
  fetchOrders: async () => {
    if (!IS_SUPABASE_CONFIGURED || !supabase) {
      console.warn("Supabase is not configured, falling back to local orders.");
      return;
    }
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (id, nama, email),
          order_details (*),
          custom_designs (*),
          payments (*),
          shipping (*)
        `)
        .order('tanggal_order', { ascending: false });

      if (!error && data) {
        const formattedOrders = data.map(dbOrder => ({
          id: dbOrder.id,
          user: dbOrder.profiles ? {
            id: dbOrder.profiles.id,
            nama: dbOrder.profiles.nama,
            email: dbOrder.profiles.email
          } : {
            id: dbOrder.user_id,
            nama: 'Customer',
            email: ''
          },
          tanggal_order: dbOrder.tanggal_order,
          total_harga: Number(dbOrder.total_harga),
          status: dbOrder.status,
          alamat_kirim: dbOrder.alamat_kirim,
          items: dbOrder.order_details.map(d => ({
            product_id: d.product_id,
            nama_produk: d.nama_produk,
            harga: Number(d.harga),
            qty: d.qty,
            gambar: d.gambar
          })),
          custom_design: dbOrder.custom_designs?.[0] || null,
          payment: dbOrder.payments?.[0] ? {
            metode: dbOrder.payments[0].metode,
            status: dbOrder.payments[0].status,
            tanggal_bayar: dbOrder.payments[0].tanggal_bayar
          } : null,
          shipping: dbOrder.shipping?.[0] ? {
            kurir: dbOrder.shipping[0].kurir,
            no_resi: dbOrder.shipping[0].no_resi,
            status_pengiriman: dbOrder.shipping[0].status_pengiriman,
            tanggal_kirim: dbOrder.shipping[0].tanggal_kirim
          } : null
        }));
        
        // Merge logic: preserve local 'completed' status if Supabase hasn't updated yet
        const localOrdersMap = new Map(get().orders.map(o => [o.id, o]));
        const mergedOrders = formattedOrders.map(so => {
           const lo = localOrdersMap.get(so.id);
           // If local is completed but server still says shipped, keep local completed
           if (lo && lo.status === 'completed' && so.status !== 'completed') {
               return { ...so, status: 'completed' };
           }
           return so;
        });
        const unSyncedLocalOrders = get().orders.filter(lo => !mergedOrders.find(so => so.id === lo.id));
        set({ orders: [...mergedOrders, ...unSyncedLocalOrders], isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      console.error("Fetch orders failed", err);
      set({ isLoading: false });
    }
  },

  addOrder: async (order) => {
    if (!order.user?.id || order.user.id === 'guest') {
      console.warn("Cannot sync order to DB: user is guest. Saving locally only.");
      const localId = Date.now();
      const newOrder = { ...order, id: localId };
      set((state) => ({ orders: [newOrder, ...state.orders] }));
      return newOrder;
    }

    // 0. Optimistically add to local state
    const localId = typeof order.id === 'number' ? order.id : Date.now();
    const optimisticOrder = { ...order, id: localId };
    set((state) => ({ orders: [optimisticOrder, ...state.orders] }));

    try {
      // 1. Insert order
      const { data: orderData, error: orderErr } = await supabase.from('orders').insert({
        user_id: order.user.id,
        total_harga: order.total_harga,
        status: order.status,
        alamat_kirim: order.alamat_kirim,
        tanggal_order: order.tanggal_order || new Date().toISOString().split('T')[0]
      }).select().single();
      
      if (orderErr) throw orderErr;
      const dbOrderId = orderData.id;
      
      // 2. Insert items
      if (order.items?.length > 0) {
        const itemsToInsert = order.items.map(item => ({
          order_id: dbOrderId,
          product_id: typeof item.product_id === 'number' ? item.product_id : null,
          nama_produk: item.nama_produk,
          harga: item.harga,
          qty: item.qty,
          gambar: item.gambar
        }));
        await supabase.from('order_details').insert(itemsToInsert);
      }
      
      // 3. Insert custom design
      if (order.custom_design) {
        await supabase.from('custom_designs').insert({
          order_id: dbOrderId,
          ucapan: order.custom_design.ucapan,
          warna: order.custom_design.warna,
          tema: order.custom_design.tema,
          file_gambar: order.custom_design.file_gambar || null
        });
      }
      
      // 4. Insert payment
      if (order.payment) {
        await supabase.from('payments').insert({
          order_id: dbOrderId,
          metode: order.payment.metode,
          jumlah: order.total_harga,
          status: order.payment.status,
          tanggal_bayar: order.payment.tanggal_bayar || new Date().toISOString()
        });
      }
      
      // 5. Insert shipping
      if (order.shipping) {
        await supabase.from('shipping').insert({
          order_id: dbOrderId,
          kurir: order.shipping.kurir,
          no_resi: order.shipping.no_resi,
          status_pengiriman: order.shipping.status_pengiriman,
          tanggal_kirim: order.shipping.tanggal_kirim
        });
      }
      
      // Replace optimistic order with real one
      set((state) => ({
        orders: state.orders.map(o => o.id === localId ? { ...o, id: dbOrderId } : o)
      }));
      get().fetchOrders();
      return { ...order, id: dbOrderId };
    } catch (err) {
      console.error('Error saving order to Supabase:', err);
      // Keep optimistic order if DB fails, so user doesn't lose it
      return optimisticOrder;
    }
  },

  updateOrderStatus: async (id, status) => {
    // Save previous state for rollback
    const previousOrders = get().orders;
    const orderToUpdate = previousOrders.find(o => o.id === id);
    
    // Optimistic update
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    }));

    if (IS_SUPABASE_CONFIGURED && supabase && typeof id === 'number') {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', id)
          .select();
          
        if (error) {
          console.error('Error updating order status in DB:', error);
          if (status !== 'completed') {
            set({ orders: previousOrders }); // Rollback
            alert("Gagal mengupdate status: " + error.message);
          }
        } else if (!data || data.length === 0) {
          console.error('Update diblokir oleh RLS atau order tidak ditemukan.');
          if (status !== 'completed') {
            set({ orders: previousOrders }); // Rollback
            alert("Gagal mengupdate: Anda tidak memiliki akses Admin di Database (RLS Blocked).");
          }
        }
      } catch (err) {
        console.error('Error updating order status in DB:', err);
        if (status !== 'completed') set({ orders: previousOrders }); // Rollback
      }
    }
  },
  }),
  {
    name: 'florentt-orders',
  }
));

// Auto-fetch on load
setTimeout(() => {
  useOrderStore.getState().fetchOrders();
}, 0);

export default useOrderStore;
