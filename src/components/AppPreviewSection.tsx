import { Link } from "react-router-dom";
import { motion, useMotionValue, animate, useTransform, useInView } from 'motion/react';
import { Smartphone, BellRing, Activity, LocateFixed, ShieldCheck, MapPin, Truck, Navigation, CarFront } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export default function AppPreviewSection() {
  const [isEngineOn, setIsEngineOn] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '200px' });
  const speed = useMotionValue(0);
  const displaySpeed = useTransform(speed, (s) => s.toFixed(0));

  useEffect(() => {
    let controls: any;
    if (isEngineOn) {
      controls = animate(speed, 65, {
        type: "tween",
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      });
    } else {
      speed.set(0);
    }
    return () => {
      if (controls) controls.stop();
    };
  }, [isEngineOn, speed]);

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden border-t-2 border-red-600 bg-slate-900 flex items-center group">
      
      {/* Full Screen Realistic Map Background */}
      <div className="absolute inset-0 z-0">
        {isInView && <iframe 
          title="AbsTracker Office Location Map"
          className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight={0} 
          marginWidth={0} 
          src="https://www.openstreetmap.org/export/embed.html?bbox=76.8%2C28.4%2C77.4%2C28.9&amp;layer=mapnik" 
          style={{ filter: 'grayscale(1) invert(1) contrast(1.2)' }}
        ></iframe>}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      </div>

      {/* Moving Vehicle on Map */}
      <motion.div 
        className="absolute z-10 hidden lg:flex items-center justify-center"
        initial={{ x: '50vw', y: '60vh' }}
        animate={isEngineOn ? { 
          x: ['50vw', '55vw', '70vw', '65vw', '50vw'] as any,
          y: ['60vh', '50vh', '45vh', '65vh', '60vh'] as any
        } : { x: '50vw', y: '60vh' }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <div className="relative flex items-center justify-center w-24 h-24">
          {isEngineOn && <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping scale-150"></div>}
          <div className={`w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 ${isEngineOn ? 'border-red-500' : 'border-slate-500'} relative z-10`}>
            <Navigation className={`w-6 h-6 ${isEngineOn ? 'text-red-600' : 'text-slate-500'}`} />
          </div>
          <div className="absolute top-16 bg-white text-slate-900 font-bold text-xs px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
            BR 01 PB 1234
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 text-left"
          >
            <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700 shadow-2xl">
              <h2 className="text-red-500 font-black tracking-widest uppercase text-sm mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5" /> 
                Next-Gen Tracking Experience
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                Your Vehicle, On Your Mobile
              </h3>
              <p className="text-slate-400 mb-8 leading-relaxed font-medium">
                With our advanced app, you can see your vehicle's live location from any corner of the world. Lock the engine, check route history - everything in one click.
              </p>
              
              <div className="space-y-6 mb-10">
                {[
                  { icon: LocateFixed, title: 'Live Location Tracking', desc: '100% accurate real-time location.' },
                  { icon: ShieldCheck, title: 'Engine Lock / Unlock', desc: 'Immobilize your vehicle instantly.' },
                  { icon: BellRing, title: 'Instant Smart Alerts', desc: 'Geo-fence and speed notifications.' }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                      <feature.icon className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base mb-0.5">{feature.title}</h4>
                      <p className="text-slate-400 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link aria-label="Navigation Link" to="/tracking-demo" className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20 active:scale-95 border border-transparent">
                <LocateFixed className="w-5 h-5" />
                View Full Screen App Demo
              </Link>
            </div>
          </motion.div>
          
          {/* Right Content - Realistic Dashboard Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 lg:col-start-7"
          >
            <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-6 sm:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-white/20">
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${isEngineOn ? 'bg-red-600 shadow-red-600/30' : 'bg-slate-600 shadow-slate-600/30'} flex items-center justify-center shadow-lg shrink-0 transition-colors`}>
                    <Truck className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-2xl tracking-wide">BR 01 PB 1234</h4>
                    <p className={`text-xs ${isEngineOn ? 'text-emerald-600' : 'text-slate-500'} font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${isEngineOn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span> {isEngineOn ? 'Running Live' : 'Stopped / Idle'}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5 tracking-wider">Current Speed</p>
                  <p className="text-4xl font-black text-slate-900 flex items-baseline justify-end gap-1 font-mono tracking-tighter">
                    <motion.span>{displaySpeed}</motion.span>
                    <span className="text-sm text-slate-500 font-sans tracking-normal font-bold">km/h</span>
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Engine Status</p>
                  <p className={`text-lg font-black ${isEngineOn ? 'text-emerald-600' : 'text-red-600'}`}>{isEngineOn ? 'ACTIVE' : 'LOCKED'}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Today's Run</p>
                  <p className="text-lg font-black text-slate-900">142 km</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Fuel / AC</p>
                  <p className={`text-lg font-black ${isEngineOn ? 'text-blue-600' : 'text-slate-600'}`}>{isEngineOn ? 'AC ON' : 'AC OFF'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 shadow-inner">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-red-600" />
                </div>
                <span className="font-bold truncate">NH-48, Jaipur Highway, Rajasthan</span>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsEngineOn(!isEngineOn)} 
                  className={`flex-1 ${isEngineOn ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'} border-2 rounded-xl py-4 text-sm font-black uppercase tracking-wide flex justify-center items-center gap-2 transition-all active:scale-95`}
                >
                  <ShieldCheck className="w-5 h-5" /> {isEngineOn ? 'Immobilize Engine' : 'Start Engine'}
                </button>
                <button className="flex-1 bg-slate-900 text-white rounded-xl py-4 text-sm font-black uppercase tracking-wide flex justify-center items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                  <Activity className="w-5 h-5" /> Route History
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
