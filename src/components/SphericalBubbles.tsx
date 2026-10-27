import React from 'react';

interface SphereBubble {
  id: string;
  top: string;
  left?: string;
  right?: string;
  size: string; // e.g., 'w-24 h-24'
  animationClass: string;
  duration: string;
  gradientStyle: React.CSSProperties;
  innerGlow: string;
  specularPos: string;
  opacity: string;
}

const SPHERICAL_BUBBLES: SphereBubble[] = [
  // --- Zone 1: Top Hero & Upper Viewport (0% - 25%) ---
  {
    id: 'sphere-1',
    top: '3%',
    left: '8%',
    size: 'w-20 h-20 sm:w-28 sm:h-28',
    animationClass: 'animate-bubble-drift-1',
    duration: '22s',
    gradientStyle: {
      background: 'radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.9) 0%, rgba(192, 132, 252, 0.45) 35%, rgba(56, 189, 248, 0.35) 70%, rgba(99, 102, 241, 0.25) 100%)',
    },
    innerGlow: 'shadow-[inset_0_-10px_20px_rgba(147,51,234,0.3),inset_0_4px_12px_rgba(255,255,255,0.8),0_12px_32px_rgba(124,58,237,0.18)]',
    specularPos: 'top-3 left-4 w-5 h-2.5',
    opacity: 'opacity-70 dark:opacity-40',
  },
  {
    id: 'sphere-2',
    top: '6%',
    right: '10%',
    size: 'w-24 h-24 sm:w-36 sm:h-36',
    animationClass: 'animate-bubble-drift-2',
    duration: '27s',
    gradientStyle: {
      background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(56, 189, 248, 0.45) 35%, rgba(99, 102, 241, 0.35) 70%, rgba(168, 85, 247, 0.25) 100%)',
    },
    innerGlow: 'shadow-[inset_0_-12px_24px_rgba(59,130,246,0.3),inset_0_5px_14px_rgba(255,255,255,0.85),0_16px_40px_rgba(56,189,248,0.2)]',
    specularPos: 'top-4 left-5 w-7 h-3.5',
    opacity: 'opacity-65 dark:opacity-35',
  },
  {
    id: 'sphere-3',
    top: '16%',
    left: '18%',
    size: 'w-14 h-14 sm:w-20 sm:h-20',
    animationClass: 'animate-bubble-drift-4',
    duration: '19s',
    gradientStyle: {
      background: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.85) 0%, rgba(244, 114, 182, 0.4) 35%, rgba(192, 132, 252, 0.3) 70%, rgba(56, 189, 248, 0.2) 100%)',
    },
    innerGlow: 'shadow-[inset_0_-8px_16px_rgba(236,72,153,0.25),inset_0_3px_10px_rgba(255,255,255,0.75),0_8px_24px_rgba(236,72,153,0.15)]',
    specularPos: 'top-2.5 left-3 w-4 h-2',
    opacity: 'opacity-60 dark:opacity-35',
  },
  {
    id: 'sphere-4',
    top: '21%',
    right: '22%',
    size: 'w-16 h-16 sm:w-24 sm:h-24',
    animationClass: 'animate-bubble-drift-3',
    duration: '25s',
    gradientStyle: {
      background: 'radial-gradient(circle at 33% 28%, rgba(255, 255, 255, 0.9) 0%, rgba(45, 212, 191, 0.4) 35%, rgba(56, 189, 248, 0.35) 70%, rgba(99, 102, 241, 0.2) 100%)',
    },
    innerGlow: 'shadow-[inset_0_-8px_18px_rgba(20,184,166,0.25),inset_0_4px_12px_rgba(255,255,255,0.8),0_10px_28px_rgba(45,212,191,0.15)]',
    specularPos: 'top-3 left-3.5 w-4.5 h-2',
    opacity: 'opacity-65 dark:opacity-35',
  },

  // --- Zone 2: Supported Platforms & Features (25% - 50%) ---
  {
    id: 'sphere-5',
    top: '32%',
    left: '5%',
    size: 'w-24 h-24 sm:w-36 sm:h-36',
    animationClass: 'animate-bubble-drift-5',
    duration: '28s',
    gradientStyle: {
      background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.85) 0%, rgba(168, 85, 247, 0.4) 40%, rgba(56, 189, 248, 0.3) 75%, rgba(79, 70, 229, 0.25) 100%)',
    },
    innerGlow: 'shadow-[inset_0_-12px_24px_rgba(124,58,237,0.3),inset_0_5px_15px_rgba(255,255,255,0.8),0_16px_36px_rgba(124,58,237,0.18)]',
    specularPos: 'top-4 left-5 w-7 h-3',
    opacity: 'opacity-65 dark:opacity-35',
  },
  {
    id: 'sphere-6',
    top: '38%',
    right: '6%',
    size: 'w-20 h-20 sm:w-32 sm:h-32',
    animationClass: 'animate-bubble-drift-1',
    duration: '24s',
    gradientStyle: {
      background: 'radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.9) 0%, rgba(56, 189, 248, 0.45) 35%, rgba(129, 140, 248, 0.35) 70%, rgba(244, 114, 182, 0.2) 100%)',
    },
    innerGlow: 'shadow-[inset_0_-10px_20px_rgba(59,130,246,0.3),inset_0_4px_12px_rgba(255,255,255,0.8),0_12px_32px_rgba(56,189,248,0.18)]',
    specularPos: 'top-3 left-4 w-6 h-3',
    opacity: 'opacity-70 dark:opacity-40',
  },
  {
    id: 'sphere-7',
    top: '46%',
    left: '20%',
    size: 'w-16 h-16 sm:w-22 sm:h-22',
    animationClass: 'animate-bubble-drift-6',
    duration: '26s',
    gradientStyle: {
      background: 'radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.85) 0%, rgba(251, 191, 36, 0.35) 35%, rgba(244, 114, 182, 0.3) 70%, rgba(168, 85, 247, 0.2) 100%)',
    },
    innerGlow: 'shadow-[inset_0_-8px_16px_rgba(245,158,11,0.25),inset_0_3px_10px_rgba(255,255,255,0.75),0_10px_24px_rgba(245,158,11,0.15)]',
    specularPos: 'top-2.5 left-3 w-4 h-2',
    opacity: 'opacity-55 dark:opacity-30',
  },

  // --- Zone 3: How It Works & Media Types (50% - 75%) ---
  {
    id: 'sphere-8',
    top: '55%',
    right: '16%',
    size: 'w-24 h-24 sm:w-36 sm:h-36',
    animationClass: 'animate-bubble-drift-2',
    duration: '31s',
    gradientStyle: {
      background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(129, 140, 248, 0.45) 35%, rgba(56, 189, 248, 0.35) 70%, rgba(192, 132, 252, 0.25) 100%)',
    },
    innerGlow: 'shadow-[inset_0_-12px_24px_rgba(99,102,241,0.3),inset_0_5px_15px_rgba(255,255,255,0.85),0_16px_40px_rgba(99,102,241,0.18)]',
    specularPos: 'top-4 left-5 w-7 h-3.5',
    opacity: 'opacity-65 dark:opacity-35',
  },
  {
    id: 'sphere-9',
    top: '62%',
    left: '7%',
    size: 'w-20 h-20 sm:w-28 sm:h-28',
    animationClass: 'animate-bubble-drift-3',
    duration: '23s',
    gradientStyle: {
      background: 'radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.85) 0%, rgba(56, 189, 248, 0.45) 35%, rgba(168, 85, 247, 0.35) 70%, rgba(99, 102, 241, 0.25) 100%)',
    },
    innerGlow: 'shadow-[inset_0_-10px_20px_rgba(56,189,248,0.3),inset_0_4px_12px_rgba(255,255,255,0.8),0_12px_30px_rgba(56,189,248,0.18)]',
    specularPos: 'top-3 left-4 w-5 h-2.5',
    opacity: 'opacity-65 dark:opacity-35',
  },
  {
    id: 'sphere-10',
    top: '70%',
    right: '8%',
    size: 'w-16 h-16 sm:w-24 sm:h-24',
    animationClass: 'animate-bubble-drift-4',
    duration: '26s',
    gradientStyle: {
      background: 'radial-gradient(circle at 33% 28%, rgba(255, 255, 255, 0.9) 0%, rgba(244, 114, 182, 0.4) 35%, rgba(129, 140, 248, 0.3) 70%, rgba(56, 189, 248, 0.25) 100%)',
    },
    innerGlow: 'shadow-[inset_0_-8px_18px_rgba(236,72,153,0.25),inset_0_4px_12px_rgba(255,255,255,0.8),0_10px_26px_rgba(236,72,153,0.15)]',
    specularPos: 'top-3 left-3 w-4.5 h-2',
    opacity: 'opacity-60 dark:opacity-35',
  },

  // --- Zone 4: FAQ, Benefits & Footer Region (75% - 98%) ---
  {
    id: 'sphere-11',
    top: '78%',
    left: '14%',
    size: 'w-24 h-24 sm:w-34 sm:h-34',
    animationClass: 'animate-bubble-drift-5',
    duration: '30s',
    gradientStyle: {
      background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(192, 132, 252, 0.45) 35%, rgba(56, 189, 248, 0.35) 70%, rgba(79, 70, 229, 0.25) 100%)',
    },
    innerGlow: 'shadow-[inset_0_-12px_24px_rgba(147,51,234,0.3),inset_0_5px_15px_rgba(255,255,255,0.85),0_16px_36px_rgba(124,58,237,0.18)]',
    specularPos: 'top-4 left-5 w-6.5 h-3',
    opacity: 'opacity-65 dark:opacity-35',
  },
  {
    id: 'sphere-12',
    top: '86%',
    right: '18%',
    size: 'w-18 h-18 sm:w-26 sm:h-26',
    animationClass: 'animate-bubble-drift-1',
    duration: '21s',
    gradientStyle: {
      background: 'radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.85) 0%, rgba(56, 189, 248, 0.4) 35%, rgba(45, 212, 191, 0.35) 70%, rgba(99, 102, 241, 0.2) 100%)',
    },
    innerGlow: 'shadow-[inset_0_-10px_18px_rgba(56,189,248,0.25),inset_0_4px_10px_rgba(255,255,255,0.8),0_12px_28px_rgba(56,189,248,0.15)]',
    specularPos: 'top-3 left-3.5 w-5 h-2.5',
    opacity: 'opacity-60 dark:opacity-35',
  },
  {
    id: 'sphere-13',
    top: '93%',
    left: '8%',
    size: 'w-22 h-22 sm:w-32 sm:h-32',
    animationClass: 'animate-bubble-drift-6',
    duration: '28s',
    gradientStyle: {
      background: 'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.9) 0%, rgba(168, 85, 247, 0.45) 35%, rgba(56, 189, 248, 0.35) 70%, rgba(129, 140, 248, 0.25) 100%)',
    },
    innerGlow: 'shadow-[inset_0_-12px_22px_rgba(124,58,237,0.3),inset_0_5px_14px_rgba(255,255,255,0.85),0_14px_34px_rgba(124,58,237,0.18)]',
    specularPos: 'top-4 left-5 w-6 h-3',
    opacity: 'opacity-65 dark:opacity-35',
  },
];

export const SphericalBubbles: React.FC = () => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none -z-5 overflow-hidden select-none"
      aria-hidden="true"
    >
      {SPHERICAL_BUBBLES.map((bubble) => {
        const style: React.CSSProperties = {
          top: bubble.top,
          ...(bubble.left ? { left: bubble.left } : {}),
          ...(bubble.right ? { right: bubble.right } : {}),
          animationDuration: bubble.duration,
          ...bubble.gradientStyle,
        };

        return (
          <div
            key={bubble.id}
            style={style}
            className={`absolute rounded-full border border-white/50 dark:border-white/20 backdrop-blur-[2px] transition-opacity duration-500 will-change-transform ${bubble.size} ${bubble.animationClass} ${bubble.innerGlow} ${bubble.opacity}`}
          >
            {/* Primary Specular Highlight (Reflection spot creating 3D spherical depth) */}
            <div 
              className={`absolute rounded-full bg-white/90 dark:bg-white/70 filter blur-[0.5px] transform -rotate-25 ${bubble.specularPos}`} 
            />

            {/* Secondary subtle rim counter-highlight */}
            <div 
              className="absolute bottom-2 right-2.5 w-3 h-1.5 rounded-full bg-white/40 dark:bg-white/20 filter blur-[0.8px] transform rotate-45"
            />
          </div>
        );
      })}
    </div>
  );
};
