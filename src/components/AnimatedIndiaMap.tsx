import React, { memo, useState } from "react";
import { motion } from "motion/react";
import { indiaMapData } from "./indiaMapData";

const staticMarkers = [
  { name: "New Delhi", cx: 320, cy: 270 },
  { name: "Mumbai", cx: 210, cy: 650 },
  { name: "Bengaluru", cx: 350, cy: 850 },
  { name: "Kolkata", cx: 680, cy: 520 },
  { name: "Chennai", cx: 420, cy: 830 },
  { name: "Patna", cx: 600, cy: 420 },
];

interface MapLocation {
  id: string;
  name: string;
  path: string;
}

interface MapData {
  label: string;
  viewBox: string;
  locations: MapLocation[];
}

const mapData: MapData = indiaMapData.default ? indiaMapData.default : (indiaMapData as unknown as MapData);

const AnimatedIndiaMap = () => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none overflow-hidden">
      <div className="w-full max-w-4xl opacity-50 scale-150 sm:scale-125 lg:scale-110 translate-y-20 relative">
        <svg
          viewBox={mapData.viewBox}
          className="w-full h-auto drop-shadow-2xl pointer-events-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            {mapData.locations.map((location: MapLocation) => (
              <motion.path
                key={location.id}
                d={location.path}
                id={location.id}
                name={location.name}
                fill={hoveredState === location.id ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.1)"}
                stroke="rgba(59, 130, 246, 0.6)"
                strokeWidth="1.5"
                initial={{ fill: "rgba(59, 130, 246, 0.1)" }}
                animate={{ fill: hoveredState === location.id ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.1)" }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setHoveredState(location.id)}
                onMouseLeave={() => setHoveredState(null)}
                style={{ cursor: "pointer", outline: "none" }}
                className="transition-all duration-300 hover:stroke-blue-400"
              />
            ))}
          </g>

          {staticMarkers.map((marker) => (
            <g key={marker.name}>
              <motion.circle
                cx={marker.cx}
                cy={marker.cy}
                r={6}
                fill="#3b82f6"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.8, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              />
              <motion.circle
                cx={marker.cx}
                cy={marker.cy}
                r={16}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={2}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: Math.random() * 2,
                }}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default memo(AnimatedIndiaMap);
