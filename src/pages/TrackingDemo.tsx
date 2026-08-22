import { ArrowLeft, Truck, MapPin, Activity, Bell, Settings, Search, Maximize2, Navigation, CarFront, ShieldCheck, Menu, X, Filter, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'motion/react';

const VEHICLES_DATA = [
  { id: 'BR 01 PB 1234', name: 'Ashok Leyland Truck', status: 'moving', speed: 65, location: 'NH-48, Jaipur Highway', driver: 'Raju Singh', fuel: '78%', type: 'truck', coordinates: [26.9124, 75.7873] },
  { id: 'DL 1V C9876', name: 'Tata Ace', status: 'stopped', speed: 0, location: 'Bypass Road, Patna', driver: 'Amit Kumar', fuel: '45%', type: 'van', coordinates: [25.5941, 85.1376] },
  { id: 'HR 26 BR 5544', name: 'Mahindra Bolero', status: 'idle', speed: 0, location: 'Sector 14, Gurugram', driver: 'Suresh', fuel: '92%', type: 'car', coordinates: [28.4595, 77.0266] },
  { id: 'MH 04 AB 9988', name: 'JCB Excavator', status: 'moving', speed: 25, location: 'Mining Site A', driver: 'Vikash', fuel: '30%', type: 'heavy', coordinates: [19.0760, 72.8777] }
];

export default function TrackingDemo() {
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES_DATA[0]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showToast, setShowToast] = useState('');
  const [showMobileList, setShowMobileList] = useState(false);
  
  // Simulated map coordinates to trigger re-renders of the map iframe on switch
  const [mapCenter, setMapCenter] = useState(VEHICLES_DATA[0].coordinates);
  
  const speed = useMotionValue(selectedVehicle.speed);

  useEffect(() => {
    document.title = 'Live Tracking Demo | AbsTracker';
  }, []);

  useEffect(() => {
    // Animate map transition visually by updating center
    setMapCenter(selectedVehicle.coordinates);

    // Animate speed if moving
    if (selectedVehicle.status === 'moving') {
      const controls = animate(speed, selectedVehicle.speed + 15, {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      });
      return () => controls.stop();
    } else {
      speed.set(0);
    }
  }, [selectedVehicle, speed]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const handleAction = (action: string) => {
    setShowToast(action);
    setTimeout(() => setShowToast(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 overflow-hidden font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-[200] bg-slate-900/90 backdrop-blur-xl border border-slate-800 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-3 whitespace-nowrap"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            {showToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Area (Background) - Using highly realistic styling */}
      <div className="absolute inset-0 z-0 bg-slate-800">
        <motion.iframe
          key={selectedVehicle.id} // Forces iframe reload on vehicle switch for realistic jump
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full pointer-events-none" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight={0} 
          marginWidth={0} 
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter[1]-0.05}%2C${mapCenter[0]-0.05}%2C${mapCenter[1]+0.05}%2C${mapCenter[0]+0.05}&amp;layer=mapnik&amp;marker=${mapCenter[0]}%2C${mapCenter[1]}`}
          style={{ filter: 'grayscale(0.8) invert(1) hue-rotate(180deg) contrast(1.2)' }}
        ></motion.iframe>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-900/30"></div>
        
        {/* Simulated Route Path SVG */}
        {selectedVehicle.status === 'moving' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-10" preserveAspectRatio="none">
            <motion.path
              d="M 20 500 Q 400 400 800 600 T 1500 300"
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeDasharray="10 10"
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        )}
      </div>

      {/* Top Floating Header (Mobile & Desktop) */}
      <div className="absolute top-4 left-4 right-4 md:right-auto md:w-96 z-40 flex items-center gap-3">
        <Link aria-label="Navigation Link"  to="/" className="w-12 h-12 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center text-white hover:text-emerald-400 transition-colors border border-slate-700 shrink-0 active:scale-95">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div className="flex-1 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700 flex items-center px-4 py-3 h-12">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search vehicles..." 
            className="w-full bg-transparent border-none outline-none pl-3 text-sm font-bold text-white placeholder:text-slate-500 placeholder:font-medium"
            onClick={() => setShowMobileList(true)}
          />
          <button className="md:hidden ml-2" onClick={() => setShowMobileList(true)}>
             <Menu className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Right Floating Actions (Desktop & Mobile) */}
      <div className="absolute top-20 md:top-4 right-4 flex flex-col gap-3 z-40">
        <button onClick={toggleFullScreen} className="w-12 h-12 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700 flex items-center justify-center text-white hover:text-emerald-400 transition-colors active:scale-95 hidden md:flex">
          <Maximize2 className="w-5 h-5" />
        </button>
        <button onClick={() => handleAction('Notifications Opened')} className="w-12 h-12 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700 flex items-center justify-center text-white hover:text-emerald-400 transition-colors active:scale-95 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
        </button>
        <button onClick={() => handleAction('Settings Opened')} className="w-12 h-12 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700 flex items-center justify-center text-white hover:text-emerald-400 transition-colors active:scale-95">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Center Marker representing the vehicle on map */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <motion.div 
          key={selectedVehicle.id}
          initial={{ scale: 0, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative"
        >
          {selectedVehicle.status === 'moving' && (
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0], x: [0, 2, -2, 0], y: [0, -2, 2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 flex items-center justify-center relative"
            >
              <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping scale-150" style={{ animationDuration: '2s' }}></div>
              <div className="w-14 h-14 bg-white rounded-full border-4 border-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.6)] flex items-center justify-center z-10 text-blue-600 relative">
                 <Navigation className="w-6 h-6 fill-blue-600 drop-shadow-md" />
                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
              </div>
            </motion.div>
          )}
          {selectedVehicle.status !== 'moving' && (
            <div className="w-24 h-24 flex items-center justify-center relative">
              <div className={`w-14 h-14 bg-white rounded-full border-4 shadow-2xl flex items-center justify-center z-10 relative ${selectedVehicle.status === 'stopped' ? 'border-red-500 text-red-500' : 'border-amber-500 text-amber-500'}`}>
                 <MapPin className="w-6 h-6 fill-current drop-shadow-md" />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Selected Vehicle Info Panel (Floating at Bottom) */}
      <div className={`absolute left-4 right-4 md:left-4 md:w-[420px] md:bottom-4 transition-all duration-500 z-30 ${showMobileList ? 'bottom-[-100%]' : 'bottom-4'}`}>
        <div className="bg-slate-900/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-slate-700/50 p-6 relative overflow-hidden">
          
          {/* Moving background glow effect */}
          {selectedVehicle.status === 'moving' && (
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
            ></motion.div>
          )}

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg shrink-0 relative overflow-hidden group cursor-pointer" onClick={() => setShowMobileList(true)}>
                <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CarFront className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight leading-none mb-1">{selectedVehicle.id}</h2>
                <p className="text-xs text-slate-400 font-black uppercase tracking-widest">{selectedVehicle.name}</p>
              </div>
            </div>
            <div className="text-right">
               <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5 tracking-widest">Live Speed</p>
               <p className={`text-3xl font-black flex items-baseline justify-end gap-1 font-mono tracking-tighter ${selectedVehicle.status === 'moving' ? 'text-emerald-400' : 'text-slate-300'}`}>
                  <motion.span>{speed.get().toFixed(0)}</motion.span>
                  <span className="text-sm text-slate-500 font-sans tracking-normal font-bold">km/h</span>
               </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
            <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/80 text-center">
              <p className="text-[10px] text-slate-500 font-black mb-1.5 uppercase tracking-widest">Driver</p>
              <p className="font-bold text-white text-sm truncate">{selectedVehicle.driver}</p>
            </div>
            <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/80 text-center">
              <p className="text-[10px] text-slate-500 font-black mb-1.5 uppercase tracking-widest">Fuel</p>
              <p className="font-mono font-bold text-white text-sm">{selectedVehicle.fuel}</p>
            </div>
            <div className="bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/80 text-center">
              <p className="text-[10px] text-slate-500 font-black mb-1.5 uppercase tracking-widest">Engine</p>
              <p className={`font-black text-sm ${selectedVehicle.status === 'stopped' ? 'text-red-400' : selectedVehicle.status === 'idle' ? 'text-amber-400' : 'text-emerald-400'}`}>{selectedVehicle.status === 'stopped' ? 'OFF' : 'ON'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 mb-6 shadow-inner relative z-10">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 border border-slate-700">
               <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-bold truncate pr-2">{selectedVehicle.location}</span>
          </div>

          <div className="flex gap-3 relative z-10">
             <button onClick={() => handleAction(`Immobilizing ${selectedVehicle.id}...`)} className="w-14 h-14 shrink-0 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl flex justify-center items-center hover:bg-red-500/20 transition-colors shadow-sm active:scale-95">
               <ShieldCheck className="w-6 h-6" />
             </button>
             <button onClick={() => handleAction('Loading Route Playback...')} className="flex-1 bg-white text-slate-900 rounded-2xl text-sm font-black tracking-wide flex justify-center items-center gap-2 hover:bg-slate-100 transition-all shadow-xl shadow-white/10 active:scale-95 uppercase">
               <Activity className="w-5 h-5 text-blue-600" /> Route Playback
             </button>
          </div>
        </div>
      </div>

      {/* List Panel (Sidebar on Desktop, Bottom Sheet on Mobile) */}
      <div className={`absolute inset-x-0 bottom-0 top-20 md:top-20 md:left-auto md:right-4 md:w-[400px] md:bottom-4 md:max-h-[calc(100vh-6rem)] bg-white md:bg-slate-900/95 md:backdrop-blur-2xl md:rounded-[2rem] rounded-t-[2.5rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)] md:shadow-2xl border-t md:border border-slate-200 md:border-slate-700/50 z-50 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${showMobileList ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}`}>
        
        {/* Mobile Drag Handle & Header */}
        <div className="md:hidden flex flex-col items-center pt-4 pb-2 px-6">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-4"></div>
          <div className="flex items-center justify-between w-full">
            <h3 className="font-black text-xl text-slate-900">Your Fleet</h3>
            <button onClick={() => setShowMobileList(false)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between p-6 border-b border-slate-700/50">
          <h3 className="font-black text-xl text-white">Your Fleet</h3>
          <button className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-4 space-y-3 pb-32 md:pb-4 scrollbar-hide">
          {VEHICLES_DATA.map(v => (
            <div 
              key={v.id}
              onClick={() => {
                setSelectedVehicle(v);
                if (window.innerWidth < 768) setShowMobileList(false);
              }}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedVehicle.id === v.id ? 'border-blue-500 bg-blue-50/50 md:bg-blue-500/10 shadow-md shadow-blue-500/10' : 'border-slate-100 md:border-slate-700 bg-white md:bg-slate-800/50 hover:border-slate-200 md:hover:border-slate-600'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${v.status === 'moving' ? 'bg-emerald-100 md:bg-emerald-500/20 text-emerald-600 md:text-emerald-400' : v.status === 'stopped' ? 'bg-red-100 md:bg-red-500/20 text-red-600 md:text-red-400' : 'bg-amber-100 md:bg-amber-500/20 text-amber-600 md:text-amber-400'}`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-black text-sm tracking-wide leading-none mb-1 ${selectedVehicle.id === v.id ? 'text-slate-900 md:text-white' : 'text-slate-900 md:text-white'}`}>{v.id}</h3>
                    <p className="text-[10px] font-black text-slate-500 md:text-slate-400 uppercase tracking-widest">{v.name}</p>
                  </div>
                </div>
                {v.status === 'moving' && (
                  <span className="text-[10px] font-black text-emerald-700 md:text-emerald-400 bg-emerald-100 md:bg-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 md:bg-emerald-400 rounded-full animate-pulse"></span>
                    {v.speed} km/h
                  </span>
                )}
                {v.status === 'stopped' && (
                  <span className="text-[10px] font-black text-red-700 md:text-red-400 bg-red-100 md:bg-red-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    Stopped
                  </span>
                )}
                {v.status === 'idle' && (
                  <span className="text-[10px] font-black text-amber-700 md:text-amber-400 bg-amber-100 md:bg-amber-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                    Idle
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 md:text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate max-w-[150px]">{v.location}</span>
                </div>
                <MoreVertical className="w-4 h-4 text-slate-300 md:text-slate-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile Map Click Overlay to dismiss bottom sheet */}
      {showMobileList && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden animate-in fade-in"
          onClick={() => setShowMobileList(false)}
        ></div>
      )}
    </div>
  );
}
