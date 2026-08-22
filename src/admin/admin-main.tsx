import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AdminApp from './AdminApp';
import { AuthProvider } from '../context/AuthContext';
import { DealerProvider } from '../context/DealerContext';
import '../index.css';

const isLocalOrPreview = window.location.pathname.includes('/admin.html');
const basename = isLocalOrPreview ? '/admin.html' : '';

window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <DealerProvider>
          <BrowserRouter basename={basename}>
            <AdminApp />
          </BrowserRouter>
        </DealerProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
);
