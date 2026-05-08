import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ── Pre-render: Handle OAuth implicit flow hash tokens ──────
// If Supabase returns tokens in the hash fragment (e.g. #access_token=...),
// this conflicts with HashRouter. We intercept and store them BEFORE React mounts.
(function handleOAuthHashTokens() {
  const hash = window.location.hash;
  // Check if the hash contains an access_token (implicit flow from Supabase)
  if (hash && hash.includes('access_token=') && !hash.startsWith('#/')) {
    // Extract tokens from hash
    const tokenStr = hash.substring(1); // remove leading #
    const params = new URLSearchParams(tokenStr);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      // Store tokens for authStore to pick up
      sessionStorage.setItem('florentt-oauth-tokens', JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
      }));
      // Clear the hash to prevent HashRouter from treating it as a route
      window.history.replaceState({}, '', window.location.pathname + '#/');
    }
  }
})();

// Initialize theme from localStorage before render
const stored = localStorage.getItem('florentt-theme');
if (stored) {
  try {
    const { state } = JSON.parse(stored);
    document.documentElement.setAttribute('data-theme', state?.theme || 'light');
  } catch {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
