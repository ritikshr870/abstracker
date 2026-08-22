import { useEffect, useState } from 'react';
import { MapPin, Navigation, Signal, Zap } from 'lucide-react';
import { motion, useInView } from 'motion/react';

import React from "react";

export default function LiveMapSection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '200px' });
  const [activeCity, setActiveCity] = useState(0);

  const cities = [
    { name: 'Delhi', x: '45%', y: '30%' },
    { name: 'Mumbai', x: '35%', y: '60%' },
    { name: 'Bengaluru', x: '45%', y: '80%' },
    { name: 'Kolkata', x: '65%', y: '55%' },
    { name: 'Chennai', x: '50%', y: '85%' },
    { name: 'Hyderabad', x: '45%', y: '65%' },
    { name: 'Patna', x: '58%', y: '45%' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCity((prev) => (prev + 1) % cities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [cities.length]);

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background Stylized Map Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute inset-0 bg-[url('https://ik.imagekit.io/xgxpgvop9/truck.jpeg?tr=w-1200,f-auto,q-75')] opacity-10 bg-cover bg-center mix-blend-screen grayscale"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold mb-6 border border-blue-500/20 backdrop-blur-md">
            <Signal className="h-4 w-4 animate-pulse" />
            <span className="uppercase tracking-widest">Live Telemetry</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            India's Most Active Fleet Network
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            Watch real-time vehicle movements across major logistics hubs. We track over 1.2M commercial vehicles pan-India with sub-second latency.
          </p>
        </div>

        <div className="relative w-full max-w-4xl mx-auto h-[500px] md:h-[600px] bg-slate-900/50 rounded-[3rem] border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden">
          
          {/* Abstract India Map Outline / Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
             <svg viewBox="0 0 800 800" className="w-full h-full text-blue-500">
               <path fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" d="M300,100 C400,200 450,400 350,700 M500,200 C600,400 550,600 400,750" />
               <path fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10,10" d="M200,300 C300,400 600,300 700,500" />
             </svg>
          </div>

          {/* Render Cities */}
          {cities.map((city, idx) => (
            <div 
              key={idx}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: city.x, top: city.y }}
            >
              <div className="relative">
                <div className={`absolute -inset-4 rounded-full blur-md transition-all duration-1000 ${idx === activeCity ? 'bg-blue-500/40' : 'bg-transparent'}`}></div>
                <div className={`w-3 h-3 rounded-full border-2 border-slate-900 transition-colors duration-500 relative z-10 ${idx === activeCity ? 'bg-blue-400' : 'bg-slate-600'}`}></div>
              </div>
              <span className={`mt-2 text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${idx === activeCity ? 'text-blue-300' : 'text-slate-500'}`}>
                {city.name}
              </span>
            </div>
          ))}

          {/* Animated Vehicle (Truck) moving between active cities */}
          <motion.div
            className="absolute w-8 h-8 flex items-center justify-center text-emerald-400 bg-slate-900 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-500/30 z-20"
            animate={{
              left: cities[activeCity].x,
              top: cities[activeCity].y,
            }}
            transition={{
              duration: 2.5,
              ease: "easeInOut"
            }}
            style={{ x: '-50%', y: '-50%' }}
          >
            <Navigation className="w-4 h-4 fill-emerald-500 rotate-45 transform" />
          </motion.div>

          {/* Status Bar inside Map */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-center justify-between bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                <Zap className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase">System Status</div>
                <div className="text-sm text-emerald-400 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  All Systems Operational
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-slate-400 font-bold uppercase">Active Links</div>
                <div className="text-lg font-black text-white">1,248,392</div>
              </div>
              <div className="w-px h-8 bg-slate-800"></div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-bold uppercase">Target Region</div>
                <div className="text-lg font-black text-blue-400">{cities[activeCity].name}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
