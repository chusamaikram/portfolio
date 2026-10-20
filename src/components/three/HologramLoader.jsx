import React from 'react';

export const HologramLoader = () => {
  return (
    <div className="w-full h-[480px] sm:h-[560px] md:h-[620px] lg:h-[660px] flex flex-col items-center justify-center relative">
      {/* Outer pulsing ring */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping opacity-30" />
        <div className="w-36 h-36 rounded-full border border-dashed border-cyan-400/50 animate-[spin_10s_linear_infinite]" />
        
        {/* Core hexagon wireframe placeholder */}
        <div className="absolute w-20 h-20 border border-cyan-300/60 rotate-45 animate-pulse flex items-center justify-center bg-cyan-500/10 backdrop-blur-sm">
          <div className="w-8 h-8 rounded-full bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-ping opacity-60" />
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-1 font-mono text-xs">
        <span className="text-cyan-400 tracking-widest uppercase animate-pulse">
          ASSEMBLING 3D WORKSTATION...
        </span>
        <span className="text-slate-500 text-[10px]">
          INITIALIZING WEBGL 60FPS SHADERS
        </span>
      </div>
    </div>
  );
};

export default HologramLoader;
