import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { isSuperAdminEmail } from '../utils/adminAuth';

function getAuthErrorMessage(error: any): string {
  const code = error?.code || '';
  const message = error?.message || 'Unknown error occurred.';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Incorrect email or password. Please try again.';
    default:
      console.error('Firebase Auth Error:', error);
      return `Auth Error (${code}): ${message}`;
  }
}

export default function AdminLogin() {
  const { signInWithEmail, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && isSuperAdminEmail(currentUser.email)) {
      navigate('/', { replace: true });
    } else if (localStorage.getItem('dealerAuth')) {
      navigate('/', { replace: true });
    }
  }, [currentUser, navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      // Check dealer credentials in Firestore first
      try {
        const q = query(
          collection(db, 'dealers'),
          where('loginEmail', '==', email.trim().toLowerCase()),
          where('loginPassword', '==', password)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          localStorage.setItem('dealerAuth', doc.id);
          window.location.href = '/';
          return;
        }
      } catch (dealerErr) {
        console.log('Dealer check passed to admin auth:', dealerErr);
      }

      // Try Firebase super admin login
      await signInWithEmail(email.trim(), password);
      setLoading(false);
    } catch (e: any) {
      setError(getAuthErrorMessage(e));
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-slate-900">
      <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="w-full max-w-md mx-auto px-4 flex items-center justify-center relative z-10 min-h-screen">
        <div className="w-full bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500"></div>
          
          <div className="text-center mb-8">
            <div className="mb-6 inline-block bg-white rounded-2xl p-3 shadow-lg">
              <img loading="lazy" width="800" height="600" 
                src="https://ik.imagekit.io/xgxpgvop9/1000562214-removebg-preview.png?tr=w-256,f-auto,q-80" 
                alt="AbsTracker Logo" 
                className="h-10 w-auto object-contain"
              />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
              System Login
            </h2>
            <p className="text-slate-400 font-medium">Administrators &amp; Dealers</p>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm mb-6 font-medium text-center border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-white transition-colors h-5 w-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                required
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-white transition-colors h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-12 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 mt-2 disabled:opacity-70 group min-h-[56px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In to Portal <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-slate-500" /> Enterprise-Grade Secure Authentication
          </div>
        </div>
      </div>
    </div>
  );
}
