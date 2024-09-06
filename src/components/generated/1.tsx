import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const planets = [
  { name: '水星', color: '#8a7f80', size: 0.383, orbitDuration: 88 },
  { name: '金星', color: '#e39e54', size: 0.949, orbitDuration: 225 },
  { name: '地球', color: '#6b93d6', size: 1, orbitDuration: 365 },
  { name: '火星', color: '#c1440e', size: 0.532, orbitDuration: 687 },
  { name: '木星', color: '#d8ca9d', size: 11.209, orbitDuration: 4333 },
  { name: '土星', color: '#e3e0c0', size: 9.449, orbitDuration: 10759 },
  { name: '天王星', color: '#d1e7e7', size: 4.007, orbitDuration: 30687 },
  { name: '海王星', color: '#5b5ddf', size: 3.883, orbitDuration: 60190 },
  { name: '冥王星', color: '#7c6a5c', size: 0.18, orbitDuration: 90560 },
];

const PlanetSystem = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-[1938px] h-[1048px] bg-black overflow-hidden">
      <div className="absolute top-4 left-4 bg-white/80 p-2 rounded-md shadow-md z-10">
        <p className="text-lg font-semibold">
          {currentTime.toLocaleString('zh-CN', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false 
          })}
        </p>
      </div>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-32 h-32 bg-yellow-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10" />
        {planets.map((planet, index) => (
          <motion.div
            key={planet.name}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: `${(index + 1) * 120}px`,
              height: `${(index + 1) * 120}px`,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
            }}
          >
            <motion.div
              className="absolute"
              animate={{
                rotate: 360
              }}
              transition={{
                duration: planet.orbitDuration / 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <motion.div
                className="absolute"
                style={{
                  width: `${Math.max(planet.size * 8, 8)}px`,
                  height: `${Math.max(planet.size * 8, 8)}px`,
                  backgroundColor: planet.color,
                  borderRadius: '50%',
                  top: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
                whileHover={{ scale: 1.2 }}
              >
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white/80 px-1 py-0.5 rounded text-xs whitespace-nowrap">
                  {planet.name}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlanetSystem;