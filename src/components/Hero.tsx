import { ArrowRight, ShieldCheck, PhoneCall, Radio, Zap, Map, Navigation, Briefcase, LayoutDashboard, Megaphone, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

const HERO_IMAGES = [
  "https://ik.imagekit.io/xgxpgvop9/truck.jpeg?tr=w-1200,f-auto,q-75", // Truck
  "https://ik.imagekit.io/xgxpgvop9/bus.jpeg?tr=w-1200,f-auto,q-75", // Commercial vehicles
  "https://ik.imagekit.io/xgxpgvop9/Mining.jpeg?tr=w-1200,f-auto,q-75", // Logistics
  "https://ik.imagekit.io/xgxpgvop9/car.jpeg?tr=w-1200,f-auto,q-75"  // Cars/Vans
];

export default function Hero() {
  const phoneToUse = '+919123200739';
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative pt-[clamp(8rem,15vw,12rem)] pb-[clamp(6rem,10vw,8rem)] overflow-hidden bg-slate-950 min-h-[90vh] flex items-center w-full">
      {/* Preload first hero image for LCP */}
      <link rel="preload" href={HERO_IMAGES[0]} as="image" fetchPriority="high" />
      
      {/* Slider Background */}
      <div className="absolute inset-0 z-0 bg-slate-950">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentImage}
            src={HERO_IMAGES[currentImage]}
            initial={currentImage === 0 ? false : { opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            alt="Vehicle Background"
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority={currentImage === 0 ? "high" : "auto"}
            loading={currentImage === 0 ? "eager" : "lazy"}
            decoding={currentImage === 0 ? "sync" : "async"}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950"></div>
      </div>

      {/* Animated Clean Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Dynamic Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-600/20 via-slate-950/5 to-transparent blur-[80px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent blur-[100px]"></div>
        
        {/* Animated Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_30%,transparent_100%)]"></div>
        
        {/* India Map Silhouette */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-5 pointer-events-none mix-blend-screen px-[clamp(1rem,5vw,2rem)]">
          <img width="800" height="600" loading="lazy"
            src="https://upload.wikimedia.org/wikipedia/commons/e/e4/India_silhouette.svg" 
            alt="India Map" 
            className="w-full max-w-[800px] h-auto object-contain filter invert opacity-50"
          />
        </div>

        {/* Floating Abstract Map Nodes */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[15%] hidden lg:flex items-center gap-2 text-red-500/50"
        >
          <div className="w-12 h-12 rounded-full border border-red-500/30 flex items-center justify-center bg-slate-900/50 backdrop-blur-md">
            <Map className="w-5 h-5 text-red-500" />
          </div>
          <div className="h-px w-24 bg-gradient-to-r from-red-500/30 to-transparent"></div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 25, 0], opacity: [0.2, 0.5, 0.2] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[30%] right-[10%] hidden lg:flex items-center gap-2 flex-row-reverse text-slate-400/50"
        >
          <div className="w-16 h-16 rounded-full border border-slate-700/50 flex items-center justify-center bg-slate-900/50 backdrop-blur-md relative">
            <Navigation className="w-6 h-6 text-slate-400" />
            <motion.div 
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full border border-slate-400/30"
            ></motion.div>
          </div>
          <div className="h-px w-32 bg-gradient-to-l from-slate-700/50 to-transparent"></div>
        </motion.div>

        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] right-[20%] hidden xl:block w-32 h-32 bg-red-600/5 rounded-full blur-[40px]"
        ></motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-[clamp(1rem,5vw,2rem)] relative z-20 text-center flex flex-col items-center w-full">
        
        {/* Status Pill */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md mb-[clamp(1.5rem,4vw,2rem)] shadow-2xl max-w-full"
        >
          <div className="relative flex items-center justify-center w-3 h-3 shrink-0">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
          </div>
          <span className="text-slate-300 text-[clamp(0.65rem,1.5vw,0.875rem)] font-bold uppercase tracking-widest truncate">
            PAN INDIA B2B & DEALER NETWORK OPEN
          </span>
        </motion.div>
        
        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[clamp(2.5rem,6vw,4rem)] font-black text-white tracking-tight mb-6 leading-[1.1] w-full"
        >
          India's Reliable Wholesale GPS <br className="hidden sm:block" /> Trackers & IoT Devices
          <span className="relative inline-block mt-2 max-w-full">
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-white break-words">
              Empowering Dealers, Fleets & Businesses Nationwide.
            </span>
            <motion.span 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
              className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-red-600 to-transparent rounded-full"
            ></motion.span>
          </span>
        </motion.h1>
        
        {/* Subheadline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-[clamp(1rem,2vw,1.25rem)] text-slate-300 mb-10 leading-relaxed font-medium max-w-3xl mx-auto px-4 sm:px-0"
        >
          Expand your business with AbsTracker high-performance Basic GPS Trackers, Magnetic Asset Devices, Personal & Student Trackers. Premium software support, attractive dealer margins, and fast Pan-India dispatch.
        </motion.p>

        {/* Feature Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center items-center gap-[clamp(0.5rem,1.5vw,1.5rem)] mb-12 text-[clamp(0.75rem,1.5vw,0.875rem)] text-slate-300 font-bold w-full"
        >
          <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800/50 backdrop-blur-sm shrink-0 max-w-full">
            <Briefcase className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="truncate">Complete Business Setup Support (Website + Branding + GBP)</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800/50 backdrop-blur-sm shrink-0 max-w-full">
            <LayoutDashboard className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">Dedicated Device Management Dashboard</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800/50 backdrop-blur-sm shrink-0 max-w-full">
            <Megaphone className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="truncate">Free Digital Marketing Assistance</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800/50 backdrop-blur-sm shrink-0 max-w-full">
            <Truck className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">Pan-India Fast Hardware Dispatch</span>
          </div>
        </motion.div>
        
        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <Link
            to="/dealer-network"
            className="w-full sm:w-auto px-[clamp(1.5rem,3vw,2rem)] py-[clamp(0.75rem,2vw,1rem)] bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-base transition-all duration-150 shadow-[0_10px_30px_rgba(239,68,68,0.3)] hover:shadow-[0_15px_40px_rgba(239,68,68,0.5)] active:scale-95 active:opacity-90 select-none flex items-center justify-center gap-2 min-h-[44px]"
          >
            Become a Dealer / Partner <ArrowRight className="h-5 w-5 shrink-0" />
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto px-[clamp(1.5rem,3vw,2rem)] py-[clamp(0.75rem,2vw,1rem)] bg-slate-900 text-white border border-slate-700 hover:border-red-500 hover:bg-slate-800 rounded-xl font-bold text-base transition-all duration-150 active:scale-95 active:opacity-90 select-none flex items-center justify-center gap-2 shadow-lg min-h-[44px]"
          >
            Explore B2B Products
          </Link>
        </motion.div>

        {/* Dashboard Preview Hint */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="mt-[clamp(3rem,8vw,5rem)] w-full max-w-5xl mx-auto relative hidden md:block"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 rounded-t-3xl"></div>
          <div className="relative rounded-t-3xl border-t border-x border-slate-800 bg-slate-900/50 backdrop-blur-sm p-4 overflow-hidden h-40">
             <div className="w-full h-full rounded-2xl bg-slate-950 border border-slate-800 flex flex-col p-4 opacity-50 relative overflow-hidden">
                {/* Mock UI Elements */}
                <div className="flex justify-between items-center mb-6">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                     <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                   </div>
                   <div className="h-6 w-32 bg-slate-800 rounded-full"></div>
                </div>
                <div className="grid grid-cols-4 gap-4 flex-1">
                   <div className="col-span-1 bg-slate-900 rounded-xl border border-slate-800"></div>
                   <div className="col-span-2 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:1rem_1rem]"></div>
                   </div>
                   <div className="col-span-1 bg-slate-900 rounded-xl border border-slate-800"></div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
