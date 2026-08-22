import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuth } from '../context/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { isSuperAdminEmail } from '../utils/adminAuth';

const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const DealerPortal = lazy(() => import('../pages/DealerPortal'));
const AdminLogin = lazy(() => import('../pages/AdminLogin'));

const PageFallback = () => (
  <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-4">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-slate-400 text-sm font-medium">Loading AbsTracker Portal...</p>
  </div>
);

export default function AdminApp() {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <PageFallback />;

  const isSuperAdmin = isSuperAdminEmail(currentUser?.email);
  const hasDealerAuth = typeof window !== 'undefined' && !!localStorage.getItem('dealerAuth');

  const isAuthenticated = isSuperAdmin || hasDealerAuth;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/login" element={<AdminLogin />} />
            <Route path="*" element={<AdminLogin />} />
          </Routes>
        </Suspense>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 scroll-smooth max-w-full">
      <main className="flex-grow">
        <ErrorBoundary>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {isSuperAdmin ? (
                // Super Admin Dashboard
                <>
                  <Route path="/login" element={<Navigate to="/" replace />} />
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              ) : (
                // Dealer Portal
                <>
                  <Route path="/login" element={<Navigate to="/" replace />} />
                  <Route path="/" element={<DealerPortal />} />
                  <Route path="/dealer-portal" element={<DealerPortal />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              )}
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

