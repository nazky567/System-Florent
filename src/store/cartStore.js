import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockProducts } from '../lib/mockData';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1, customDesign = null) => {
        const items = get().items;
        const existing = items.find(i => i.product.id === product.id);
        if (existing) {
          set({
            items: items.map(i =>
              i.product.id === product.id
                ? { ...i, qty: i.qty + qty }
                : i
            ),
          });
        } else {
          set({ items: [...items, { product, qty, customDesign }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.product.id !== productId) });
      },

      updateQty: (productId, qty) => {
        if (qty < 1) return;
        set({
          items: get().items.map(i =>
            i.product.id === productId ? { ...i, qty } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((sum, i) => sum + i.product.harga * i.qty, 0);
      },

      getCount: () => {
        return get().items.reduce((sum, i) => sum + i.qty, 0);
      },

      /**
       * Reorder: Deep-clone items from a previous order into the cart.
       * Maps order_detail items back to full product objects from the catalog.
       * Preserves custom_design data for consistency.
       *
       * @param {object} order - The order object containing items[] and custom_design
       * @returns {number} Number of items successfully added
       */
      reorderFromHistory: (order) => {
        if (!order?.items?.length) return 0;

        let addedCount = 0;

        order.items.forEach(orderItem => {
          // Find the full product from catalog
          const catalogProduct = mockProducts.find(p => p.id === orderItem.product_id);

          const product = catalogProduct || {
            id: orderItem.product_id,
            nama_produk: orderItem.nama_produk,
            harga: orderItem.harga,
            gambar: orderItem.gambar,
            stok: 99,
            kategori: 'Papan Bunga',
            deskripsi: '',
          };

          // Check if already in cart — increment qty if yes
          const items = get().items;
          const existing = items.find(i => i.product.id === product.id);
          if (existing) {
            set({
              items: items.map(i =>
                i.product.id === product.id
                  ? { ...i, qty: i.qty + orderItem.qty }
                  : i
              ),
            });
          } else {
            set({
              items: [
                ...get().items,
                {
                  product,
                  qty: orderItem.qty,
                  customDesign: order.custom_design || null,
                },
              ],
            });
          }
          addedCount++;
        });

        return addedCount;
      },
    }),
    { name: 'florentt-cart' }
  )
);

export default useCartStore;
