import { useState, useEffect } from 'react';
import { Signal, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function ServiceReachMap() {
  const [activeRoute, setActiveRoute] = useState(0);

  // Geographic coordinates mapped to SVG viewbox (approximate locations on 600x700 map)
  const locations = [
    { name: 'New Delhi', cx: 200, cy: 180 },
    { name: 'Mumbai', cx: 100, cy: 450 },
    { name: 'Bengaluru', cx: 200, cy: 530 },
    { name: 'Kolkata / Patna', cx: 420, cy: 290 },
    { name: 'Chennai', cx: 280, cy: 550 },
    { name: 'Hyderabad', cx: 250, cy: 450 },
    { name: 'Ahmedabad', cx: 120, cy: 300 },
  ];

  // Routes connecting cities
  const routes = [
    [0, 1], // Delhi to Mumbai
    [1, 2], // Mumbai to Bengaluru
    [2, 4], // Bengaluru to Chennai
    [4, 5], // Chennai to Hyderabad
    [5, 3], // Hyderabad to Patna/Kolkata
    [3, 0], // Patna/Kolkata to Delhi
    [1, 6], // Mumbai to Ahmedabad
    [6, 0], // Ahmedabad to Delhi
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRoute((prev) => (prev + 1) % routes.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [routes.length]);

  return (
    <section className="py-20 lg:py-28 bg-slate-950 relative overflow-hidden border-b border-slate-900">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #dc2626 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute inset-0 bg-red-950/10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/15 text-red-400 text-xs sm:text-sm font-bold mb-4 border border-red-500/30 backdrop-blur-md">
            <Signal className="h-4 w-4 text-red-500 animate-pulse" />
            <span className="uppercase tracking-wider font-black">Pan-India Telemetry Grid</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
            Real-Time Pan-India Fleet Tracking
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-medium">
            Live satellite tracking across national highways, industrial corridors & remote mining clusters with 99.9% uptime.
          </p>
        </div>

        <div className="relative w-full max-w-4xl mx-auto h-[560px] bg-slate-900/90 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center">
          
          <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center p-8">
             <img width="800" height="600" loading="lazy" src="https://raw.githubusercontent.com/djaiss/mapsicon/master/all/in/vector.svg" alt="India Map" className="w-full h-full object-contain filter invert opacity-60" />
          </div>

          <svg viewBox="0 0 600 700" className="w-full h-full p-4 md:p-8 drop-shadow-2xl z-10 relative">
            {/* Draw all routes */}
            {routes.map((route, idx) => {
              const start = locations[route[0]];
              const end = locations[route[1]];
              return (
                <path
                  key={`route-${idx}`}
                  d={`M ${start.cx} ${start.cy} Q ${(start.cx + end.cx) / 2 - 30} ${(start.cy + end.cy) / 2 + 30} ${end.cx} ${end.cy}`}
                  fill="none"
                  stroke="rgba(220, 38, 38, 0.2)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Draw active route animated */}
            <path
              id="active-route-path"
              d={`M ${locations[routes[activeRoute][0]].cx} ${locations[routes[activeRoute][0]].cy} Q ${(locations[routes[activeRoute][0]].cx + locations[routes[activeRoute][1]].cx) / 2 - 30} ${(locations[routes[activeRoute][0]].cy + locations[routes[activeRoute][1]].cy) / 2 + 30} ${locations[routes[activeRoute][1]].cx} ${locations[routes[activeRoute][1]].cy}`}
              fill="none"
              stroke="rgba(239, 68, 68, 0.4)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <motion.path
              key={`active-route-trace-${activeRoute}`}
              d={`M ${locations[routes[activeRoute][0]].cx} ${locations[routes[activeRoute][0]].cy} Q ${(locations[routes[activeRoute][0]].cx + locations[routes[activeRoute][1]].cx) / 2 - 30} ${(locations[routes[activeRoute][0]].cy + locations[routes[activeRoute][1]].cy) / 2 + 30} ${locations[routes[activeRoute][1]].cx} ${locations[routes[activeRoute][1]].cy}`}
              fill="none"
              stroke="#ef4444"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.8, ease: "easeInOut" }}
            />
            
            {/* Vehicle Moving Marker */}
            <g key={`vehicle-anim-${activeRoute}`}>
              <g transform="translate(-14, -14)">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 17h4V5H2v12h3" />
                  <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
                  <path d="M14 17h1" />
                  <circle cx="7.5" cy="17.5" r="2.5" />
                  <circle cx="17.5" cy="17.5" r="2.5" />
                </svg>
              </g>
              <animateMotion
                dur="2.8s"
                repeatCount="1"
                fill="freeze"
                path={`M ${locations[routes[activeRoute][0]].cx} ${locations[routes[activeRoute][0]].cy} Q ${(locations[routes[activeRoute][0]].cx + locations[routes[activeRoute][1]].cx) / 2 - 30} ${(locations[routes[activeRoute][0]].cy + locations[routes[activeRoute][1]].cy) / 2 + 30} ${locations[routes[activeRoute][1]].cx} ${locations[routes[activeRoute][1]].cy}`}
              />
            </g>

            {/* Draw Locations */}
            {locations.map((loc, idx) => (
              <g key={`loc-${idx}`}>
                <circle 
                  cx={loc.cx} 
                  cy={loc.cy} 
                  r="5" 
                  fill="#ef4444" 
                  className="drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]"
                />
                <circle 
                  cx={loc.cx} 
                  cy={loc.cy} 
                  r="11" 
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1"
                  className="animate-ping opacity-60"
                />
                <text 
                  x={loc.cx} 
                  y={loc.cy + 18} 
                  textAnchor="middle" 
                  fill="#cbd5e1" 
                  fontSize="11" 
                  fontWeight="bold"
                  letterSpacing="0.5"
                >
                  {loc.name.toUpperCase()}
                </text>
              </g>
            ))}
          </svg>

          {/* Status Bar */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-center justify-between bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 gap-3 z-20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-500/15 rounded-xl flex items-center justify-center border border-red-500/30">
                <Zap className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Network Status</div>
                <div className="text-xs sm:text-sm text-white font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]"></span>
                  Active GNSS/IRNSS Uplink
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pan-India Pings</div>
              <div className="text-base sm:text-lg font-black text-white font-mono flex items-center gap-1.5 justify-end">
                <span className="text-red-500">●</span> 1,250,000+ Active Units
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
