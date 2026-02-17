import React, { useEffect, useState, useMemo } from 'react';

// A lightweight 3D particle globe using React state for rotation
// This creates a true spherical distribution projected onto 2D

const GlobeVisual: React.FC = () => {
  const [rotation, setRotation] = useState(0);

  // Constants
  const N_PARTICLES = 60;
  const GLOBE_RADIUS = 120;
  
  // Generate random points on a sphere once
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i < N_PARTICLES; i++) {
      // Golden Angle distribution for even spacing
      const phi = Math.acos(1 - 2 * (i + 0.5) / N_PARTICLES);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
      const z = GLOBE_RADIUS * Math.cos(phi);
      
      // Randomize color and size slightly
      const isPurple = Math.random() > 0.5;
      
      pts.push({ x, y, z, isPurple });
    }
    return pts;
  }, []);

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setRotation(prev => (prev + 0.005) % (Math.PI * 2));
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative w-[450px] h-[450px] flex items-center justify-center pointer-events-none select-none overflow-visible">
      
      {/* 1. Background Glow (The Core) */}
      <div className="absolute w-[280px] h-[280px] bg-gradient-to-tr from-cyan-100/30 via-white/40 to-purple-100/30 rounded-full blur-3xl opacity-60 animate-pulse"></div>

      {/* 2. Rotating Particles */}
      <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
        {points.map((pt, i) => {
          // Rotate point around Y axis
          const rotatedX = pt.x * Math.cos(rotation) - pt.z * Math.sin(rotation);
          const rotatedZ = pt.x * Math.sin(rotation) + pt.z * Math.cos(rotation);
          
          // Simple perspective projection
          // As Z gets closer (positive), scale gets bigger
          const scale = (rotatedZ + 200) / 300; 
          const opacity = Math.max(0.1, (rotatedZ + GLOBE_RADIUS) / (2 * GLOBE_RADIUS)); // Fade back points

          // Only render if not too far back (optional culling)
          // if (rotatedZ < -100) return null;

          return (
            <div
              key={i}
              className={`absolute rounded-full transition-colors duration-500`}
              style={{
                transform: `translate3d(${rotatedX}px, ${pt.y}px, 0) scale(${scale})`,
                width: pt.isPurple ? '4px' : '3px',
                height: pt.isPurple ? '4px' : '3px',
                backgroundColor: pt.isPurple ? '#c084fc' : '#22d3ee', // Purple-400 or Cyan-400
                opacity: opacity,
                boxShadow: pt.isPurple ? '0 0 4px 1px rgba(192, 132, 252, 0.4)' : '0 0 4px 1px rgba(34, 211, 238, 0.4)',
                zIndex: Math.floor(rotatedZ), // Ensure front points are on top
              }}
            />
          );
        })}
      </div>

      {/* 3. Orbital Rings (Static SVG decoration for tech feel) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40">
        <svg className="w-[320px] h-[320px] animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
           <ellipse cx="50" cy="50" rx="48" ry="20" fill="none" stroke="#d8b4fe" strokeWidth="0.2" transform="rotate(45 50 50)" />
        </svg>
        <svg className="absolute w-[340px] h-[340px] animate-[spin_15s_linear_infinite_reverse]" viewBox="0 0 100 100">
           <ellipse cx="50" cy="50" rx="48" ry="20" fill="none" stroke="#a5f3fc" strokeWidth="0.2" transform="rotate(-45 50 50)" />
        </svg>
      </div>

    </div>
  );
};

export default GlobeVisual;