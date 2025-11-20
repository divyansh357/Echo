import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan-500 */}
        <stop offset="100%" stopColor="#8b5cf6" /> {/* Violet-500 */}
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Outer Ring - Representing the Noise/Chaos (Segmented) */}
    <path d="M50 10C72.0914 10 90 27.9086 90 50" stroke="#334155" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 10" opacity="0.5" />
    <path d="M50 90C27.9086 90 10 72.0914 10 50" stroke="#334155" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 10" opacity="0.5" />

    {/* Middle Ring - Representing the Echo/Context (Focusing) */}
    <path d="M50 25C63.8071 25 75 36.1929 75 50" stroke="url(#logoGradient)" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
    <path d="M50 75C36.1929 75 25 63.8071 25 50" stroke="url(#logoGradient)" strokeWidth="5" strokeLinecap="round" opacity="0.8" />

    {/* Central Core - The Priority (Solid) */}
    <path d="M50 38L62 50L50 62L38 50L50 38Z" fill="url(#logoGradient)" filter="url(#glow)" />
    <circle cx="50" cy="50" r="4" fill="#fff" />
  </svg>
);