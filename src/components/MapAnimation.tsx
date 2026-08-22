import { motion } from 'motion/react';
import { Truck } from 'lucide-react';

const locations = [
  { name: 'Delhi', x: 35, y: 25 },
  { name: 'Lucknow', x: 50, y: 35 },
  { name: 'Patna', x: 65, y: 40 },
  { name: 'Kolkata', x: 75, y: 50 },
  { name: 'Hyderabad', x: 45, y: 65 },
  { name: 'Chennai', x: 50, y: 85 },
  { name: 'Bengaluru', x: 35, y: 80 },
  { name: 'Mumbai', x: 20, y: 60 },
  { name: 'Ahmedabad', x: 15, y: 45 },
  { name: 'Jaipur', x: 25, y: 35 },
];

export default function MapAnimation() {
  // SVG viewBox is 0 0 100 100
  // Convert x, y to SVG coordinates (percentages essentially)
  const pathData = locations
    .map((loc, index) => `${index === 0 ? 'M' : 'L'} ${loc.x} ${loc.y}`)
    .join(' ') + ' Z'; // Close the path to make a loop

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-[4/5] sm:aspect-square flex items-center justify-center pointer-events-none">
      
      {/* Abstract Map Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center p-4">
         <img width="800" height="600"  loading="lazy" src="https://raw.githubusercontent.com/djaiss/mapsicon/master/all/in/vector.svg" alt="India Map" className="w-full h-full object-contain opacity-80" />
      </div>
      <svg className="absolute inset-0 w-full h-full drop-shadow-2xl z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        
        {/* Connection Lines */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="rgba(59, 130, 246, 0.3)"
          strokeWidth="0.5"
          strokeDasharray="1 1"
        />
        
        {/* Animated Glowing Line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="rgba(16, 185, 129, 0.8)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </svg>

      {/* Location Nodes */}
      {locations.map((loc, i) => (
        <div 
          key={loc.name}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
          style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.6)] z-10 border-2 border-white"
          />
          <span className="text-[8px] sm:text-[10px] font-bold text-slate-700 mt-1 uppercase tracking-wider bg-white/80 px-1 rounded backdrop-blur-sm">{loc.name}</span>
        </div>
      ))}

      {/* Moving Vehicle */}
      <motion.div
        className="absolute w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.8)] z-20 border-2 border-emerald-500"
        animate={{
          left: locations.map(l => `${l.x}%`),
          top: locations.map(l => `${l.y}%`),
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
          times: locations.map((_, i) => i / (locations.length - 1)) // Even timing
        }}
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900" />
      </motion.div>
    </div>
  );
}
