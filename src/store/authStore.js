import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import supabase, { IS_SUPABASE_CONFIGURED } from '../lib/supabase';
import useCartStore from './cartStore';

/**
 * Auth Store — Florentt
 * Dual-mode: Supabase Production / Demo Fallback
 */

const DEMO_USERS = {
  'admin@florentt.com': { id: 1, nama: 'Admin Florentt', email: 'admin@florentt.com', role: 'admin' },
  'siti@email.com': { id: 2, nama: 'Siti Nurhaliza', email: 'siti@email.com', role: 'customer' },
};

/** Helper: wrap a promise with a timeout */
function withTimeout(promise, ms = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms)),
  ]);
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      session: null,
      isLoading: false,
      error: null,
      isDemoMode: !IS_SUPABASE_CONFIGURED,
      _authReady: false,

      // ── Initialize auth ────────────────────────────────────
      initAuth: async () => {
        // Prevent double init
        if (get()._authReady) return;

        if (!IS_SUPABASE_CONFIGURED) {
          console.log('[Auth] Demo mode — no Supabase configured');
          set({ _authReady: true });
          return;
        }

        try {
          // 1. Check for PKCE code in URL query params (?code=xxx)
          const urlParams = new URLSearchParams(window.location.search);
          const code = urlParams.get('code');

          if (code) {
            console.log('[Auth] PKCE code found, exchanging...');
            try {
              const { data, error } = await withTimeout(
                supabase.auth.exchangeCodeForSession(code)
              );
              if (!error && data?.session) {
                console.log('[Auth] Session via PKCE:', data.session.user.email);
                const profile = get()._buildProfile(data.session.user);
                set({
                  user: profile,
                  token: data.session.access_token,
                  session: data.session,
                  _authReady: true,
                });
                // Navigate to dashboard
                window.location.hash = profile?.role === 'admin' ? '#/admin' : '#/dashboard';
                // Clean ?code= from URL
                const cleanUrl = window.location.pathname + window.location.hash;
                window.history.replaceState({}, '', cleanUrl);
                return;
              } else {
                console.warn('[Auth] Code exchange failed:', error?.message);
              }
            } catch (e) {
              console.warn('[Auth] Code exchange error:', e.message);
            }
          }

          // 2. Check for implicit flow tokens captured by main.jsx
          const storedTokens = sessionStorage.getItem('florentt-oauth-tokens');
          if (storedTokens) {
            sessionStorage.removeItem('florentt-oauth-tokens');
            try {
              const { access_token, refresh_token } = JSON.parse(storedTokens);
              console.log('[Auth] Restoring from captured tokens...');
              const { data, error } = await withTimeout(
                supabase.auth.setSession({ access_token, refresh_token })
              );
              if (!error && data?.session) {
                const profile = get()._buildProfile(data.session.user);
                set({
                  user: profile,
                  token: data.session.access_token,
                  session: data.session,
                  _authReady: true,
                });
                window.location.hash = profile?.role === 'admin' ? '#/admin' : '#/dashboard';
                return;
              }
            } catch (e) {
              console.warn('[Auth] Token restore error:', e.message);
            }
          }

          // 3. Normal session restore (with timeout protection)
          try {
            console.log('[Auth] Checking existing session...');
            const { data, error } = await withTimeout(
              supabase.auth.getSession(), 5000
            );

            if (!error && data?.session) {
              console.log('[Auth] Restored session:', data.session.user.email);
              const profile = get()._buildProfile(data.session.user);
              set({
                user: profile,
                token: data.session.access_token,
                session: data.session,
                _authReady: true,
              });
              return;
            }
          } catch (e) {
            console.warn('[Auth] getSession error/timeout:', e.message);
          }

          // No session found — mark as ready
          console.log('[Auth] No session found, ready as guest');
          set({ _authReady: true });

        } catch (err) {
          console.error('[Auth] Init error:', err.message);
          set({ _authReady: true });
        }
      },

      // ── Google OAuth Login ─────────────────────────────────
      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          if (!IS_SUPABASE_CONFIGURED) {
            await new Promise(r => setTimeout(r, 800));
            const user = {
              id: 'google-demo-101',
              nama: 'Siti Nurhaliza',
              email: 'siti@email.com',
              avatar: 'https://ui-avatars.com/api/?name=Siti+Nurhaliza&background=DC2626&color=fff&size=128',
              role: 'customer',
              provider: 'google',
            };
            set({ user, token: 'demo-google-token-' + Date.now(), isLoading: false });
            return true;
          }

          // Redirect URL = base URL without hash
          const baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, '') + '/';
          console.log('[Auth] Google OAuth redirectTo:', baseUrl);

          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: baseUrl,
              queryParams: { access_type: 'offline', prompt: 'consent' },
            },
          });

          if (error) throw error;
          set({ isLoading: false });
          return true;
        } catch (err) {
          set({ error: err.message || 'Google login gagal', isLoading: false });
          return false;
        }
      },

      // ── Email/Password Login ───────────────────────────────
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          if (!IS_SUPABASE_CONFIGURED) {
            await new Promise(r => setTimeout(r, 500));
            const user = DEMO_USERS[email];
            if (user && password === 'password') {
              set({ user, token: 'demo-token-' + Date.now(), isLoading: false });
              return true;
            }
            set({ error: 'Email atau password salah', isLoading: false });
            return false;
          }

          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;

          const profile = get()._buildProfile(data.user);
          set({
            user: profile,
            token: data.session.access_token,
            session: data.session,
            isLoading: false,
          });
          return true;
        } catch (err) {
          let msg = err.message;
          if (msg === 'Invalid login credentials') msg = 'Email atau password salah';
          else if (msg === 'Email not confirmed') msg = 'Email belum dikonfirmasi. Silakan cek inbox/spam email Anda.';
          
          set({ error: msg, isLoading: false });
          return false;
        }
      },

      // ── Register ───────────────────────────────────────────
      register: async (regData) => {
        set({ isLoading: true, error: null });
        try {
          if (!IS_SUPABASE_CONFIGURED) {
            await new Promise(r => setTimeout(r, 500));
            const user = { id: Date.now(), ...regData, role: 'customer', provider: 'email' };
            set({ user, token: 'demo-token-' + Date.now(), isLoading: false });
            return true;
          }

          const { data, error } = await supabase.auth.signUp({
            email: regData.email,
            password: regData.password,
            options: {
              data: { full_name: regData.nama, name: regData.nama, no_hp: regData.no_hp || '', alamat: regData.alamat || '' },
            },
          });

          if (error) throw error;

          if (data.user && !data.session) {
            set({ isLoading: false });
            return 'confirm_email';
          }

          if (data.session) {
            const profile = get()._buildProfile(data.user);
            set({
              user: profile,
              token: data.session.access_token,
              session: data.session,
              isLoading: false,
            });
          }
          return true;
        } catch (err) {
          const msg = err.message === 'User already registered'
            ? 'Email sudah terdaftar. Silakan login.' : err.message;
          set({ error: msg, isLoading: false });
          return false;
        }
      },

      // ── Logout ─────────────────────────────────────────────
      logout: async () => {
        try {
          if (IS_SUPABASE_CONFIGURED && supabase) {
            await supabase.auth.signOut();
          }
        } catch { /* ignore */ }
        
        // Clear cart
        try { useCartStore.getState().clearCart(); } catch { /* ignore */ }
        
        // Clear auth state
        set({ user: null, token: null, session: null, error: null, _authReady: true });
        
        // Redirect to login
        window.location.hash = '#/login';
      },

      handleAuthCallback: async () => get().initAuth(),

      // ── Build profile from auth user (NEVER returns null) ──
      _buildProfile: (authUser) => {
        const email = authUser.email || '';
        const isAdmin = email.toLowerCase().includes('admin');
        const finalRole = isAdmin ? 'admin' : (authUser.user_metadata?.role || 'customer');

        return {
          id: authUser.id,
          nama: authUser.user_metadata?.full_name || authUser.user_metadata?.name || email.split('@')[0] || 'User',
          email: email,
          avatar: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
          role: finalRole,
          provider: authUser.app_metadata?.provider || 'email',
          no_hp: authUser.user_metadata?.no_hp || null,
          alamat: authUser.user_metadata?.alamat || null,
        };
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'florentt-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

// ── Auth State Listener ──────────────────────────────────────
if (IS_SUPABASE_CONFIGURED && supabase) {
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('[Auth] onAuthStateChange:', event);

    if (event === 'SIGNED_IN' && session) {
      const store = useAuthStore.getState();
      if (!store.user || store.user.id !== session.user.id) {
        const profile = store._buildProfile(session.user);
        useAuthStore.setState({
          user: profile,
          token: session.access_token,
          session,
          _authReady: true,
        });
      }
    }

    if (event === 'SIGNED_OUT') {
      useAuthStore.setState({ user: null, token: null, session: null });
    }

    if (event === 'TOKEN_REFRESHED' && session) {
      useAuthStore.setState({ token: session.access_token, session });
    }
  });
}

export default useAuthStore;
