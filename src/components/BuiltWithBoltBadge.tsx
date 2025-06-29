import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const BuiltWithBoltBadge: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className="relative group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Main Badge */}
        <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-sm border border-white/20">
          <div className="flex flex-col items-center justify-center">
            <Sparkles className="w-4 h-4 text-white mb-0.5" />
            <span className="text-[8px] font-bold text-white leading-none tracking-tight">
              BOLT
            </span>
          </div>
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
            <div className="relative">
              Proudly made using Bolt.new
              {/* Tooltip Arrow */}
              <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 rotate-45 transform"></div>
            </div>
          </div>
        )}

        {/* Subtle pulse animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 opacity-20 animate-ping"></div>
      </div>
    </div>
  );
};

export default BuiltWithBoltBadge;