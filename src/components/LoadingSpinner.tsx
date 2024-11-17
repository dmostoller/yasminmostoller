// components/LoadingSpinner.tsx

import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-dark-slate-950">
      <div className="relative w-16 h-16">
        {/* Outer blue circle */}
        <div className="absolute inset-0 border-4 border-dark-slate-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Inner white circle for extra design */}
        <div className="absolute inset-2 border-4 border-dark-slate-50 rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
