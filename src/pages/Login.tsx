import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, ArrowRight, ShieldCheck, Mail, Lock, UserPlus, Fingerprint, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const ADMIN_EMAILS = ['ritikshr864@gmail.com', 'shrdevlopers@gmail.com'];

const BACKGROUND_IMAGES = [
  'https://ik.imagekit.io/xgxpgvop9/footer-truck.jpeg?updatedAt=178679575617&tr=w-1200,f-auto,q-757&tr=w-1200,f-auto,q-75',
  'https://ik.imagekit.io/xgxpgvop9/ambulance.jpeg?tr=w-1200,f-auto,q-75?tr=w-1200,f-auto,q-75',
  'https://ik.imagekit.io/xgxpgvop9/truck.jpeg?tr=w-1200,f-auto,q-75?tr=w-1200,f-auto,q-75',
  'https://ik.imagekit.io/xgxpgvop9/car.jpeg?tr=w-1200,f-auto,q-75?tr=w-1200,f-auto,q-75'
];

function getAuthErrorMessage(error: any): string {
  const code = error?.code || '';
  const message = error?.message || 'Unknown error occurred.';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Incorrect email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was canceled. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups or open this app in a new tab.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/cross-origin-opener-policy-failed':
      return 'Google sign-in blocked by browser security. Please open the app in a new tab to login.';
    default:
      console.error('Firebase Auth Error:', error);
      return `Auth Error (${code}): ${message}`;
  }
}

export default function Login() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, currentUser, logout } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  
  const [bgIndex, setBgIndex] = useState(0);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  useEffect(() => {
    // If somehow a dealer token exists on the public side, just clear it. Public login shouldn't know about dealers.
    if (localStorage.getItem('dealerAuth')) {
      localStorage.removeItem('dealerAuth');
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.email && ADMIN_EMAILS.includes(currentUser.email)) {
        // Block Admin from logging in on public site
        logout();
        setError('Admin/Dealer login is not allowed here. Please use admin.abstracker.in');
        return;
      }

      // Normal customer
      navigate(redirectTo === 'checkout' ? '/checkout' : redirectTo);
    }
  }, [currentUser, navigate, redirectTo, logout]);

  // Background animation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      const result = await signInWithGoogle();
      
      // If result is undefined, it means we are falling back to a redirect. Do nothing.
      if (!result) return;
      
      if (result.user?.email && ADMIN_EMAILS.includes(result.user.email)) {
         logout();
         setError('Admin/Dealer login is not allowed here. Please use admin.abstracker.in');
         setLoading(false);
         return;
      }
      
      navigate(redirectTo === 'checkout' ? '/checkout' : redirectTo);
    } catch (e: any) {
      setError(getAuthErrorMessage(e));
      setLoading(false);
    }
  }

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      if (isLogin) {
        if (ADMIN_EMAILS.includes(email)) {
          setError('Admin/Dealer login is not allowed here. Please use admin.abstracker.in');
          setLoading(false);
          return;
        }
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
    } catch (err: any) {
      setError(getAuthErrorMessage(err));
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Animated Backgrounds */}
      <AnimatePresence mode="wait">
        <motion.div
          key={bgIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <img loading="lazy" width="800" height="600"  
            src={BACKGROUND_IMAGES[bgIndex]} 
            alt="Vehicle Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/90"></div>
        </motion.div>
      </AnimatePresence>

      <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-center relative z-10 min-h-screen">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[320px] sm:max-w-[360px]"
        >
          <div className="bg-black/10 backdrop-blur-[2px] border border-white/20 rounded-[2rem] p-6 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-600"></div>
            
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="mb-6 inline-block bg-white rounded-full p-4 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <img width="128" height="128"  loading="lazy" 
                  src="https://ik.imagekit.io/xgxpgvop9/1000562214-removebg-preview.png?tr=w-256,f-auto,q-80" 
                  alt="AbsTracker Logo" 
                  className="h-10 w-auto object-contain"
                />
              </motion.div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-2">
                {isLogin ? 'Welcome Back.' : 'Create Account.'}
              </h2>
              <p className="text-slate-300 font-medium">Secure fleet management portal</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/20 text-red-200 p-4 rounded-xl text-sm mb-6 font-bold text-center border border-red-500/30 backdrop-blur-md"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserPlus className="h-5 w-5 text-white" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-medium backdrop-blur-sm"
                      placeholder="Full Name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 transition-all font-medium focus:ring-red-500 backdrop-blur-sm"
                  placeholder="Email Address"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder-slate-300 focus:outline-none focus:border-red-500 focus:ring-1 transition-all font-medium focus:ring-red-500 backdrop-blur-sm"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <button aria-label="Button action" 
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold py-4 rounded-xl transition-all duration-150 active:scale-95 active:opacity-90 select-none disabled:opacity-70 flex justify-center items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-[0_0_20px_rgba(220,38,38,0.4)] min-h-[44px]"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isLogin ? 'Log In to Portal' : 'Register Account')}
              </button>
            </form>

            <p className="mt-8 text-center text-slate-300 text-sm font-medium">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button aria-label="Button action"  
                onClick={() => setIsLogin(!isLogin)} 
                className="text-white hover:text-red-400 font-bold transition-colors underline decoration-red-500/50 underline-offset-4"
              >
                {isLogin ? 'Sign up here' : 'Log in here'}
              </button>
            </p>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-slate-400" /> Enterprise-Grade Secure Authentication
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
