import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light', // 'light' | 'dark'

      toggleTheme: () => {
        const next = get().theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        set({ theme: next });
      },

      initTheme: () => {
        const { theme } = get();
        document.documentElement.setAttribute('data-theme', theme);
      },
    }),
    { name: 'florentt-theme' }
  )
);

export default useThemeStore;
