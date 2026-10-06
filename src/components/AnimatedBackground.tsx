import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'portal' | 'cosmetics' | 'rehab' | 'huiles' | 'formations' | 'seo';
  opacity?: number;
  fixed?: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  variant = 'portal',
  opacity = 0.35,
  fixed = false,
}) => {
  const getGradients = () => {
    switch (variant) {
      case 'cosmetics':
        return {
          c1: 'rgba(13, 148, 136, 0.18)',
          c2: 'rgba(16, 185, 129, 0.10)',
          c3: 'rgba(249, 115, 22, 0.06)',
          accent: '#10B981',
        };
      case 'rehab':
        return {
          c1: 'rgba(101, 163, 13, 0.18)',
          c2: 'rgba(132, 204, 22, 0.10)',
          c3: 'rgba(249, 115, 22, 0.05)',
          accent: '#84CC16',
        };
      case 'huiles':
        return {
          c1: 'rgba(21, 128, 61, 0.18)',
          c2: 'rgba(34, 197, 94, 0.10)',
          c3: 'rgba(245, 158, 11, 0.06)',
          accent: '#22C55E',
        };
      case 'formations':
        return {
          c1: 'rgba(15, 118, 110, 0.18)',
          c2: 'rgba(13, 148, 136, 0.10)',
          c3: 'rgba(249, 115, 22, 0.06)',
          accent: '#14B8A6',
        };
      case 'seo':
        return {
          c1: 'rgba(99, 102, 241, 0.18)',
          c2: 'rgba(168, 85, 247, 0.10)',
          c3: 'rgba(249, 115, 22, 0.05)',
          accent: '#6366F1',
        };
      case 'portal':
      default:
        return {
          c1: 'rgba(13, 148, 136, 0.14)',
          c2: 'rgba(99, 102, 241, 0.12)',
          c3: 'rgba(249, 115, 22, 0.07)',
          accent: '#F97316',
        };
    }
  };

  const colors = getGradients();

  return (
    <div
      className={`${fixed ? 'fixed inset-0' : 'absolute inset-0'} overflow-hidden pointer-events-none -z-10`}
      style={{ opacity }}
    >
      {/* Primary ambient light sphere */}
      <motion.div
        className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full blur-[130px]"
        style={{
          background: `radial-gradient(circle, ${colors.c1} 0%, transparent 70%)`,
        }}
        animate={{
          x: [0, 35, -25, 0],
          y: [0, -25, 25, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Secondary ambient light sphere */}
      <motion.div
        className="absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] rounded-full blur-[130px]"
        style={{
          background: `radial-gradient(circle, ${colors.c2} 0%, transparent 70%)`,
        }}
        animate={{
          x: [0, -35, 25, 0],
          y: [0, 35, -25, 0],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating geometric particles */}
      <div className="absolute inset-0">
        {[
          { top: '15%', left: '20%', size: 3, delay: 0 },
          { top: '35%', left: '75%', size: 4, delay: 1.5 },
          { top: '65%', left: '15%', size: 2.5, delay: 3 },
          { top: '80%', left: '60%', size: 3.5, delay: 0.8 },
          { top: '45%', left: '40%', size: 2, delay: 2.2 },
          { top: '25%', left: '88%', size: 3, delay: 4 },
        ].map((pt, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              top: pt.top,
              left: pt.left,
              width: pt.size,
              height: pt.size,
              backgroundColor: colors.accent,
              boxShadow: `0 0 8px ${colors.accent}`,
            }}
            animate={{
              y: [0, -12, 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: pt.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Discrete SaaS grid lines */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
};
