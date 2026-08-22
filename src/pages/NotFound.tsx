import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Compass, MapPin, Satellite, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4 py-20">
      <Helmet>
        <title>Page Not Found | AbsTracker</title>
      </Helmet>

      {/* Dynamic Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[300px] sm:w-[500px] md:w-[800px] h-[300px] sm:h-[500px] md:h-[800px] bg-red-100/50 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[250px] sm:w-[400px] md:w-[600px] h-[250px] sm:h-[400px] md:h-[600px] bg-indigo-100/40 rounded-full blur-[80px] md:blur-[100px]" />
        
        {/* Animated Satellite SVG in Background (Desktop focus) */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[20%] right-[15%] hidden lg:block opacity-20 text-slate-400"
        >
          <Satellite className="w-48 h-48" />
        </motion.div>
      </div>
      
      <div className="max-w-3xl w-full text-center relative z-10 flex flex-col items-center">
        {/* Animated 404 Graphic */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="relative inline-block mb-6 md:mb-10 w-full"
        >
          <div className="text-[120px] sm:text-[150px] md:text-[220px] lg:text-[250px] font-black text-slate-900 leading-none tracking-tighter select-none flex justify-center items-center">
            4
            <div className="relative mx-1 sm:mx-4">
              <span className="opacity-0">0</span>
              <motion.div 
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                  y: [0, -10, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="absolute inset-0 m-auto w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px] bg-white rounded-full shadow-2xl border border-slate-100 flex items-center justify-center z-20"
              >
                <MapPin className="w-10 h-10 sm:w-12 sm:h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 text-red-600 drop-shadow-md" />
              </motion.div>
              {/* Radar pulse effect */}
              <motion.div
                animate={{
                  scale: [1, 2.5],
                  opacity: [0.5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                className="absolute inset-0 m-auto w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px] rounded-full border-2 border-red-500/30 z-10"
              />
            </div>
            4
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight px-4"
        >
          GPS Signal Lost!
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-slate-600 font-medium mb-10 max-w-lg mx-auto leading-relaxed px-4"
        >
          We can't seem to track down the page you're looking for. It might have moved out of range, or the coordinates are incorrect.
        </motion.p>

        {/* Action Buttons: Mobile-first stacked, Desktop row */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto px-4"
        >
          <Link 
            to="/" 
            className="group px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-3 hover:-translate-y-1 w-full sm:w-auto"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Return to Base</span>
          </Link>
          
          <Link 
            to="/contact" 
            className="group px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-2xl transition-all shadow-lg shadow-slate-200/50 border border-slate-200 flex items-center justify-center gap-3 hover:-translate-y-1 w-full sm:w-auto"
          >
            <Compass className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <span>Contact Support</span>
            <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all text-indigo-500" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
