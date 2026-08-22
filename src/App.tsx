/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { DealerProvider } from './context/DealerContext';
import { useState, useEffect } from 'react';
import { useDealer } from './context/DealerContext';
import { AnimatePresence } from 'motion/react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
























import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import DealerFooter from './components/DealerFooter';
import DealerWhatsAppFAB from './components/DealerWhatsAppFAB';
import DealerNavbar from './components/DealerNavbar';
import WhatsAppFAB from './components/WhatsAppFAB';

import LoadingScreen from './components/LoadingScreen';
import SEO from './components/SEO';
import SubdomainHandler from './components/SubdomainHandler';

import ErrorBoundary from './components/ErrorBoundary';
import { Suspense, lazy } from 'react';

// Refactored to Route-Based Code Splitting
const Home = lazy(() => import('./pages/Home'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailAIS = lazy(() => import('./pages/ServiceDetailAIS'));
const ServiceDetailMining = lazy(() => import('./pages/ServiceDetailMining'));
const ServiceDetailPrivate = lazy(() => import('./pages/ServiceDetailPrivate'));
const DealerNetwork = lazy(() => import('./pages/DealerNetwork'));
const DistrictPage = lazy(() => import('./pages/DistrictPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

const AboutUs = lazy(() => import('./pages/AboutUs'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const Orders = lazy(() => import('./pages/Orders'));
const Profile = lazy(() => import('./pages/Profile'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const PartnerRedirect = lazy(() => import('./pages/PartnerRedirect'));
const TrackingDemo = lazy(() => import('./pages/TrackingDemo'));
const ProgrammaticSEOPage = lazy(() => import('./pages/ProgrammaticSEOPage'));
const Login = lazy(() => import('./pages/Login'));
const BecomeDealer = lazy(() => import('./pages/BecomeDealer'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminApp = lazy(() => import('./admin/AdminApp'));

// Zero-layout-shift fallback
const PageFallback = () => (
  <div className="h-screen w-full bg-slate-50 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin opacity-50"></div>
  </div>
);

function AppRouter() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { dealerData } = useDealer();
  
  const hostnameParts = window.location.hostname.split('.');
  const subdomain = (hostnameParts.length >= 3 && hostnameParts[0] !== 'www') ? hostnameParts[0] : null;

  const isAdminSubdomain = subdomain === 'admin' || subdomain === 'portal';
  const isSubdomain = !!subdomain && !isAdminSubdomain;

  useEffect(() => {
    document.body.classList.add('app-loaded');
  }, []);

  if (isAdminSubdomain) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <AdminApp />
        </Suspense>
      </ErrorBoundary>
    );
  }

  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dealer-portal');
  const isTrackingDemoPage = location.pathname === '/tracking-demo';
  const isLoginPage = location.pathname === '/login';
  const hideLayout = isAdminPage || isTrackingDemoPage || isLoginPage;
  
  const isDealerPage = 
    isSubdomain || 
    (location.pathname.startsWith('/dealer-network/') && location.pathname !== '/dealer-network') ||
    location.pathname.startsWith('/p/') ||
    location.pathname.startsWith('/d/') ||
    (location.pathname.match(/^\/[^/]+\/[^/]+$/) !== null && !location.pathname.startsWith('/services/') && !location.pathname.startsWith('/dealer-network/') && !location.pathname.startsWith('/products/') && !location.pathname.startsWith('/track/'));

  return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-600 selection:text-white scroll-smooth overflow-x-hidden max-w-full">
          <SEO />
          <AnimatePresence>
            {loading && <LoadingScreen onComplete={() => setLoading(false)} isDealerPage={isDealerPage} />}
          </AnimatePresence>
          
          <ScrollToTop />
          {!hideLayout && (isDealerPage ? <DealerNavbar /> : <Navbar />)}
          <main className={`flex-grow ${hideLayout ? '' : 'pt-20'}`}>
            <ErrorBoundary>
            <Suspense fallback={<PageFallback />}>
            <Routes>
              {isSubdomain && <Route path="/" element={<DistrictPage isSubdomain={true} />} />}
              {!isSubdomain && <Route path="/" element={<Home />} />}
              <Route path="/login" element={<Login />} />
              <Route path="/become-dealer" element={<BecomeDealer />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/ais-140-gps-solutions-in-india" element={<ServiceDetailAIS />} />
              <Route path="/services/mining-gps" element={<ServiceDetailMining />} />
              <Route path="/services/private-gps" element={<ServiceDetailPrivate />} />
              <Route path="/dealer-network" element={<DealerNetwork />} />
              <Route path="/dealer-network/:slug" element={<DistrictPage />} />
              <Route path="/d/:slug" element={<DistrictPage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/track/:id" element={<OrderTracking />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/tracking-demo" element={<TrackingDemo />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<Terms />} />
              <Route path="/p/:dealerId" element={<PartnerRedirect />} />
              
              {/* Admin & Dealer Portal Routes for main domain */}
              <Route path="/admin" element={<AdminApp />} />
              <Route path="/admin/*" element={<AdminApp />} />
              <Route path="/dealer-portal" element={<AdminApp />} />
              <Route path="/dealer-portal/*" element={<AdminApp />} />
              <Route path="/portal" element={<AdminApp />} />
              <Route path="/portal/*" element={<AdminApp />} />

              {/* Programmatic SEO Route - Must be last */}
              <Route path="/:city/:vehicle" element={<ProgrammaticSEOPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </Suspense>
            </ErrorBoundary>
          </main>
          {!hideLayout && (isDealerPage ? <DealerFooter /> : <Footer />)}
          {!hideLayout && (isDealerPage ? <DealerWhatsAppFAB /> : <WhatsAppFAB />)}
        </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <DealerProvider>
        <SubdomainHandler />
        <CartProvider>
           <AppRouter />
        </CartProvider>
      </DealerProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
