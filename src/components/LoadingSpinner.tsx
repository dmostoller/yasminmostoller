// components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-dark-slate-950">
      <div className="relative w-24 h-24">
        {/* Outer ring */}
        <div
          className="absolute inset-0 border-4 border-violet-600/20 border-t-violet-600 rounded-full animate-spin 
                      shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        ></div>

        {/* Middle ring - spins opposite direction */}
        <div
          className="absolute inset-2 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin-reverse
                      shadow-[0_0_10px_rgba(59,130,246,0.3)]"
        ></div>

        {/* Inner ring */}
        <div
          className="absolute inset-4 border-4 border-teal-400/40 border-t-teal-400 rounded-full animate-spin
                      shadow-[0_0_10px_rgba(45,212,191,0.3)]"
        ></div>

        {/* Center dot with gradient */}
        <div
          className="absolute inset-[45%] rounded-full animate-pulse
                      bg-gradient-to-r from-violet-600 via-blue-500 to-teal-400
                      shadow-[0_0_15px_rgba(139,92,246,0.4)]"
        ></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
