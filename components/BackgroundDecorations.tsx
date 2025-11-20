import React from 'react';

export const BackgroundDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-300" aria-hidden="true">
      <style>{`
        @keyframes spin3D {
          from { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          to { transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg); }
        }
        .cube-scene {
          perspective: 1000px;
        }
        .cube-3d {
          transform-style: preserve-3d;
          animation: spin3D 20s linear infinite;
        }
        .cube-face {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 1px solid rgba(6, 182, 212, 0.3);
          background: rgba(6, 182, 212, 0.05);
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.1) inset;
          backface-visibility: visible;
        }
        .face-front  { transform: rotateY(0deg) translateZ(60px); }
        .face-back   { transform: rotateY(180deg) translateZ(60px); }
        .face-right  { transform: rotateY(90deg) translateZ(60px); }
        .face-left   { transform: rotateY(-90deg) translateZ(60px); }
        .face-top    { transform: rotateX(90deg) translateZ(60px); }
        .face-bottom { transform: rotateX(-90deg) translateZ(60px); }
        
        .inner-cube .cube-face {
          border: 1px dashed rgba(16, 185, 129, 0.4);
          background: transparent;
          box-shadow: none;
        }
        .inner-cube .face-front  { transform: rotateY(0deg) translateZ(30px); }
        .inner-cube .face-back   { transform: rotateY(180deg) translateZ(30px); }
        .inner-cube .face-right  { transform: rotateY(90deg) translateZ(30px); }
        .inner-cube .face-left   { transform: rotateY(-90deg) translateZ(30px); }
        .inner-cube .face-top    { transform: rotateX(90deg) translateZ(30px); }
        .inner-cube .face-bottom { transform: rotateX(-90deg) translateZ(30px); }
      `}</style>

      {/* Left Scaffold Structure - Visible on wide screens */}
      <div className="absolute left-0 top-0 bottom-0 w-[18rem] hidden 2xl:block opacity-5 dark:opacity-20 select-none transition-opacity duration-300">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradLeft" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="20%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="80%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Main Vertical Rails */}
          <line x1="60" y1="0" x2="60" y2="100%" stroke="url(#gradLeft)" strokeWidth="2" />
          <line x1="120" y1="0" x2="120" y2="100%" stroke="url(#gradLeft)" strokeWidth="2" />
          
          {/* Repeated Horizontal Structures */}
          <pattern id="scaffold-pattern" x="0" y="0" width="100%" height="120" patternUnits="userSpaceOnUse">
             <line x1="60" y1="60" x2="120" y2="60" stroke="#0891b2" strokeWidth="1" opacity="0.6" />
             <line x1="60" y1="60" x2="120" y2="120" stroke="#0891b2" strokeWidth="0.5" opacity="0.3" />
             <line x1="120" y1="60" x2="60" y2="120" stroke="#0891b2" strokeWidth="0.5" opacity="0.3" />
             <rect x="58" y="58" width="4" height="4" fill="#22d3ee" opacity="0.5" />
             <rect x="118" y="58" width="4" height="4" fill="#22d3ee" opacity="0.5" />
             <rect x="20" y="50" width="30" height="20" rx="2" stroke="#22d3ee" fill="none" strokeWidth="1" opacity="0.4" />
             <path d="M50 60 L60 60" stroke="#22d3ee" strokeWidth="1" opacity="0.4" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#scaffold-pattern)" />
        </svg>
      </div>

      {/* Right Side: 3D Rotating Cuboid Scaffold */}
      <div className="absolute bottom-10 right-10 hidden lg:block opacity-10 dark:opacity-40 cube-scene w-32 h-32 transition-opacity duration-300">
         <div className="w-full h-full relative cube-3d">
            {/* Outer Shell */}
            <div className="cube-face face-front"></div>
            <div className="cube-face face-back"></div>
            <div className="cube-face face-right"></div>
            <div className="cube-face face-left"></div>
            <div className="cube-face face-top"></div>
            <div className="cube-face face-bottom"></div>

            {/* Inner Core (Green) */}
            <div className="absolute inset-0 flex items-center justify-center inner-cube" style={{ transformStyle: 'preserve-3d' }}>
               <div className="w-[60px] h-[60px] relative" style={{ transformStyle: 'preserve-3d' }}>
                 <div className="cube-face face-front"></div>
                 <div className="cube-face face-back"></div>
                 <div className="cube-face face-right"></div>
                 <div className="cube-face face-left"></div>
                 <div className="cube-face face-top"></div>
                 <div className="cube-face face-bottom"></div>
               </div>
            </div>
         </div>
         {/* Text Decoration */}
         <div className="absolute -bottom-8 right-0 text-[10px] font-mono text-cyan-600 dark:text-cyan-500/50 animate-pulse">
            SYS_MONITOR_ACTIVE
         </div>
      </div>

      {/* Right Upper: Tech Dots */}
      <div className="absolute right-0 top-0 bottom-0 w-[12rem] hidden 2xl:block opacity-5 dark:opacity-20 select-none pointer-events-none transition-opacity duration-300">
         <svg className="w-full h-full">
            <pattern id="grid-dots" width="30" height="30" patternUnits="userSpaceOnUse">
               <circle cx="2" cy="2" r="1" fill="#94a3b8" opacity="0.4" />
            </pattern>
            <rect x="40" y="0" width="100%" height="100%" fill="url(#grid-dots)" />
            <line x1="40" y1="0" x2="40" y2="100%" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" opacity="0.5" />
         </svg>
      </div>
    </div>
  );
};