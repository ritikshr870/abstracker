import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingScreen({ onComplete, isDealerPage = false }: { onComplete: () => void, isDealerPage?: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isDealerPage) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500); // 1.5 second simple loader for dealer page
      return () => clearTimeout(timer);
    }
    
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 100); // Wait a bit before completing
          return 100;
        }
        return p + Math.floor(Math.random() * 20) + 15;
      });
    }, 30);
    
    return () => clearInterval(timer);
  }, [onComplete, isDealerPage]);

  if (isDealerPage) {
    return (
      <motion.div 
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-white"
      >
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
        <p className="text-slate-600 font-bold tracking-widest uppercase text-sm animate-pulse">Securing connection...</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-white overflow-hidden"
    >
      {/* Background colorful glows */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-red-50 via-white to-slate-50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-slate-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-red-200/40 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, rotateX: 30 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative z-10 flex flex-col items-center perspective-[1000px]"
      >
        <div className="relative w-48 h-48 mb-8 flex items-center justify-center transform-style-3d">
          <motion.div
            animate={{ rotateX: 360, rotateY: 180 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-4 border-r-4 border-red-600 opacity-80 shadow-[0_0_25px_rgba(239,68,68,0.4)]"
          />
          <motion.div
            animate={{ rotateY: -360, rotateZ: 180 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-b-4 border-l-4 border-slate-900 opacity-80 shadow-[0_0_25px_rgba(15,23,42,0.4)]"
          />
          <div className="bg-white p-6 rounded-2xl shadow-[0_20px_40px_rgba(239,68,68,0.15)] border border-slate-100 flex items-center justify-center w-36 h-36">
            <img loading="lazy" width="128" height="128"  src="https://ik.imagekit.io/xgxpgvop9/1000562214-removebg-preview.png?tr=w-256,f-auto,q-80" alt="AbsTracker Logo" className="w-32 h-auto object-contain" />
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-slate-950 tracking-tight mb-2">AbsTracker</h1>
        <p className="text-red-600 font-bold tracking-widest uppercase text-sm mb-12">Loading System...</p>
        
        {/* Progress Bar */}
        <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200">
          <motion.div 
            className="h-full bg-gradient-to-r from-slate-900 via-red-500 to-red-600 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"
            initial={{ scaleX: 0, transformOrigin: "left" }}
            animate={{ scaleX: Math.min(progress, 100) / 100 }}
            transition={{ ease: "easeOut" }}
          />
        </div>
        
        <div className="mt-4 text-slate-600 font-bold text-sm tabular-nums">
          {Math.min(progress, 100)}%
        </div>
      </motion.div>
    </motion.div>
  );
}
