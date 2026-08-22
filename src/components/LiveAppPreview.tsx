import { Battery, Bell, CarFront, ChevronLeft, MapPin, Navigation, Signal, Wifi, Activity, History, ShieldCheck, Layers, Crosshair } from 'lucide-react';
import { motion, useMotionValue, animate, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

export default function LiveAppPreview() {
  const speed = useMotionValue(0);
  const [time, setTime] = useState('12:45');
  const [toast, setToast] = useState('');
  const [isEngineOn, setIsEngineOn] = useState(true);
  
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
    
    const interval = setInterval(() => {
      const date = new Date();
      setTime(date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    }, 1000);

    return () => {
      if (controls) controls.stop();
      clearInterval(interval);
    };
  }, [isEngineOn, speed]);

  const handleAction = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const toggleEngine = () => {
    const newState = !isEngineOn;
    setIsEngineOn(newState);
    handleAction(newState ? 'Engine Started' : 'Engine Immobilized');
  };

  return (
    <div className="w-[320px] h-[650px] bg-slate-900 rounded-[3.5rem] p-3 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative border-[6px] border-slate-800 flex flex-col overflow-hidden ring-4 ring-slate-900/50 group">
      {/* Phone Notch/Dynamic Island */}
      <div className="absolute top-4 inset-x-0 h-7 flex justify-center z-50">
        <div className="w-24 h-7 bg-slate-900 rounded-full flex items-center justify-between px-2">
          <div className="w-2 h-2 rounded-full bg-slate-800/80"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/80 animate-pulse"></div>
        </div>
      </div>
      
      {/* Inner Screen */}
      <div className="flex-1 bg-slate-50 rounded-[2.8rem] overflow-hidden flex flex-col relative border border-slate-700/50 shadow-inner">
        
        {/* Status Bar */}
        <div className="h-10 bg-transparent flex justify-between items-center px-6 pt-2 z-40 absolute top-0 inset-x-0 text-slate-800 font-medium text-[11px] mix-blend-color-burn">
          <span>{time}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative overflow-hidden bg-[#e8eaed]">
          {/* Extremely Realistic Google Map Tile Background */}
          <div className="absolute inset-0 z-0">
             <img width="800" height="600"  loading="lazy" 
               src="https://ik.imagekit.io/xgxpgvop9/car.jpeg?tr=w-1200,f-auto,q-75" 
               alt="Map" 
               className="w-full h-[150%] object-cover object-top contrast-[1.1] saturate-50 opacity-90 -translate-y-10" 
             />
          </div>
          
          <div className="absolute inset-0 bg-red-900/5 mix-blend-overlay z-0"></div>
          
          {/* Map Controls */}
          <div className="absolute top-16 right-4 z-20 flex flex-col gap-2">
            <button aria-label="Button action"  onClick={() => handleAction('Map Layers')} className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/50 flex items-center justify-center text-slate-600 hover:text-red-600 cursor-pointer hover:bg-white transition-all active:scale-95">
              <Layers className="w-5 h-5" />
            </button>
            <button aria-label="Button action"  onClick={() => handleAction('Location Centered')} className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/50 flex items-center justify-center text-slate-600 hover:text-red-600 cursor-pointer hover:bg-white transition-all active:scale-95">
              <Crosshair className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute top-16 left-4 z-20">
             <button aria-label="Button action"  onClick={() => handleAction('Back to Menu')} className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/50 flex items-center justify-center text-slate-600 hover:text-red-600 cursor-pointer hover:bg-white transition-all active:scale-95">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          {/* Toast inside Phone */}
          <AnimatePresence>
            {toast && (
              <motion.div 
                initial={{ opacity: 0, y: -20, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -20, x: '-50%' }}
                className="absolute top-32 left-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shadow-xl flex items-center gap-2 border border-slate-700"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {toast}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Faux Route Path with Blue glowing line */}
          <svg className="absolute inset-0 w-full h-full drop-shadow-xl z-10" viewBox="0 0 300 450" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 40 380 C 40 380, 80 250, 150 220 C 220 190, 260 100, 260 100" stroke="#cbd5e1" strokeWidth="8" strokeLinecap="round" />
            <path d="M 40 380 C 40 380, 80 250, 150 220 C 220 190, 260 100, 260 100" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 12" className="opacity-60" />
            
            <motion.path 
              d="M 40 380 C 40 380, 80 250, 150 220 C 220 190, 260 100, 260 100" 
              stroke="#ef4444" 
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isEngineOn ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>

          {/* Start Marker */}
          <div className="absolute z-10 flex flex-col items-center" style={{ left: '32px', top: '372px' }}>
            <div className="w-4 h-4 bg-white rounded-full border-4 border-slate-800 shadow-md"></div>
          </div>

          {/* End Marker */}
          <div className="absolute z-10 flex flex-col items-center" style={{ left: '248px', top: '70px' }}>
             <MapPin className="w-8 h-8 text-red-500 fill-red-100 drop-shadow-xl animate-bounce" />
             <div className="bg-white/90 backdrop-blur-sm text-slate-900 border border-slate-200 text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 shadow-lg">Destination</div>
          </div>

          {/* Moving Vehicle */}
          <motion.div 
            className="absolute z-30"
            initial={{ x: 40, y: 380, rotate: 20 }}
            animate={isEngineOn ? { 
              x: [40, 60, 110, 150, 210, 260],
              y: [380, 310, 235, 220, 150, 100],
              rotate: [20, 25, 45, -15, -45, -30]
            } : { x: 40, y: 380, rotate: 20 }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative -ml-8 -mt-8 flex items-center justify-center w-16 h-16">
              {isEngineOn && <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping scale-150" style={{ animationDuration: '2s' }}></div>}
              <div className="absolute inset-2 bg-red-500/20 rounded-full blur-md"></div>
              <div className={`w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 ${isEngineOn ? 'border-red-500' : 'border-slate-500'} relative z-10 transform -rotate-45`}>
                <Navigation className={`w-5 h-5 ${isEngineOn ? 'text-red-600 drop-shadow-md fill-red-600' : 'text-slate-500 fill-slate-500'}`} />
              </div>
            </div>
          </motion.div>

          {/* Bottom Sheet Data */}
          <div className="absolute bottom-0 inset-x-0 z-40">
             <div className="bg-white/95 backdrop-blur-xl rounded-t-[2.5rem] p-5 shadow-[0_-20px_50px_rgba(0,0,0,0.15)] border-t border-white">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5 cursor-pointer hover:bg-slate-300 transition-colors" onClick={() => handleAction('Swiped Up')}></div>
                
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${isEngineOn ? 'bg-red-600 shadow-red-600/30' : 'bg-slate-600 shadow-slate-600/30'} flex items-center justify-center shadow-lg shrink-0 transition-colors`}>
                       <CarFront className="w-6 h-6 text-white" />
                    </div>
                    <div>
                       <h4 className="font-extrabold text-slate-900 text-sm tracking-wide">BR 01 PB 1234</h4>
                       <p className={`text-[10px] ${isEngineOn ? 'text-emerald-600' : 'text-slate-500'} font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5`}>
                         <span className={`w-2 h-2 rounded-full ${isEngineOn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span> {isEngineOn ? 'Running' : 'Stopped'}
                       </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5 tracking-wider">Speed</p>
                    <p className="text-2xl font-black text-slate-900 flex items-baseline justify-end gap-1 font-mono tracking-tighter">
                       <motion.span>{speed.get().toFixed(0)}</motion.span>
                       <span className="text-xs text-slate-500 font-sans tracking-normal font-bold">km/h</span>
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-slate-50/80 rounded-2xl p-2.5 text-center border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleAction('Engine Data')}>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-0.5">Engine</p>
                    <p className={`text-xs font-black ${isEngineOn ? 'text-emerald-600' : 'text-slate-600'}`}>{isEngineOn ? 'ON' : 'OFF'}</p>
                  </div>
                  <div className="bg-slate-50/80 rounded-2xl p-2.5 text-center border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleAction('Odometer')}>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-0.5">Today</p>
                    <p className="text-xs font-black text-slate-900">142 km</p>
                  </div>
                  <div className="bg-slate-50/80 rounded-2xl p-2.5 text-center border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => handleAction('AC Status')}>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mb-0.5">AC</p>
                    <p className={`text-xs font-black ${isEngineOn ? 'text-amber-600' : 'text-slate-600'}`}>{isEngineOn ? 'ON' : 'OFF'}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                   <button aria-label="Button action"  
                     onClick={toggleEngine}
                     className={`flex-1 ${isEngineOn ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'} border rounded-xl py-3.5 text-xs font-bold flex justify-center items-center gap-1.5 transition-colors shadow-sm active:scale-95`}
                   >
                     <ShieldCheck className="w-4 h-4" /> {isEngineOn ? 'Immobilize' : 'Start Engine'}
                   </button>
                   <button aria-label="Button action"  
                     onClick={() => handleAction('Playback Route Data...')}
                     className="flex-1 bg-slate-900 text-white rounded-xl py-3.5 text-xs font-bold flex justify-center items-center gap-1.5 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:scale-95"
                   >
                     <Activity className="w-4 h-4" /> Playback
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
