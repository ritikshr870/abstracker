import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Smartphone, ShieldCheck, Zap, Share, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / standalone mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Check iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIphoneOrIpad = /iphone|ipad|ipod/.test(ua) && !/crios|fxios/.test(ua);
    setIsIOS(isIphoneOrIpad);

    // 3. Listen for native Android / Chrome / Edge install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      localStorage.setItem('abstracker_pwa_installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // 4. Determine if we should show prompt on first/recent visit
    const dismissedAt = localStorage.getItem('abstracker_install_dismissed_at');
    const wasInstalled = localStorage.getItem('abstracker_pwa_installed');
    
    // Show after 3 seconds for new users (if not dismissed in last 3 days)
    const isDismissedRecently = dismissedAt && (Date.now() - parseInt(dismissedAt, 10)) < 3 * 24 * 60 * 60 * 1000;

    if (!wasInstalled && !isDismissedRecently && !isStandalone) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2500);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowPrompt(false);
        localStorage.setItem('abstracker_pwa_installed', 'true');
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback instruction
      alert('To install AbsTracker:\n1. Click your browser menu (⋮ or Share)\n2. Select "Install app" or "Add to Home screen"');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    localStorage.setItem('abstracker_install_dismissed_at', Date.now().toString());
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 pointer-events-auto"
      >
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/70 p-5 rounded-2xl shadow-2xl text-white relative overflow-hidden ring-1 ring-white/10">
          {/* Subtle Red Accent Gradient */}
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-red-600/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close install prompt"
          >
            <X className="w-4 h-4" />
          </button>

          {!showIOSGuide ? (
            <div>
              {/* Header with App Icon */}
              <div className="flex items-center gap-3.5 mb-3">
                <div className="relative">
                  <img loading="lazy" width="800" height="600"
                    src="/favicon.jpg"
                    alt="AbsTracker App Icon"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md ring-2 ring-red-500/30"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                    <Zap className="w-2.5 h-2.5 text-white" />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-white tracking-tight">Install AbsTracker</h3>
                    <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                      Official PWA
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">AIS 140 GPS & Fleet Tracking App</p>
                </div>
              </div>

              {/* Benefits Highlights */}
              <div className="grid grid-cols-3 gap-1.5 mb-4 py-2 border-y border-slate-800">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>Superfast</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>RTO Certified</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <Smartphone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span>1-Tap Launch</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Install App Free</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-200 py-2.5 px-3 rounded-xl hover:bg-slate-800/80 transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          ) : (
            /* iOS Safari Step-by-Step Guide */
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <Smartphone className="w-4 h-4" />
                <span>Install on iPhone / iPad</span>
              </div>
              <div className="space-y-2 text-xs text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] text-white">1</span>
                  <span>Tap the <Share className="w-3.5 h-3.5 inline text-blue-400 mx-1" /> <strong>Share</strong> button in Safari browser.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] text-white">2</span>
                  <span>Scroll down & tap <PlusSquare className="w-3.5 h-3.5 inline text-emerald-400 mx-1" /> <strong>Add to Home Screen</strong>.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[10px] text-white">3</span>
                  <span>Tap <strong>Add</strong> on top-right to launch AbsTracker instantly!</span>
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-colors"
              >
                Got It!
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
