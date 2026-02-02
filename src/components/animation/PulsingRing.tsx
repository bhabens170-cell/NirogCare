/**
 * NirogCare - Enhanced Pulsing Ring Animation
 * Beautiful concentric rings with wave-like pulse effects for health visualizations
 */

import { motion } from 'framer-motion';

interface PulsingRingProps {
  className?: string;
  size?: number;
  ringCount?: number;
  color?: 'primary' | 'accent' | 'destructive' | 'success';
  intensity?: 'low' | 'medium' | 'high';
  centerIcon?: React.ReactNode;
}

const colorClasses = {
  primary: 'border-primary/30 bg-primary',
  accent: 'border-accent/30 bg-accent',
  destructive: 'border-destructive/30 bg-destructive',
  success: 'border-emerald-500/30 bg-emerald-500',
};

const centerColorClasses = {
  primary: 'bg-primary',
  accent: 'bg-accent',
  destructive: 'bg-destructive',
  success: 'bg-emerald-500',
};

export default function PulsingRing({
  className = '',
  size = 200,
  ringCount = 4,
  color = 'primary',
  intensity = 'medium',
  centerIcon
}: PulsingRingProps) {
  const intensityValues = {
    low: { scale: [1, 1.5, 2], duration: 4 },
    medium: { scale: [1, 2, 2.5], duration: 3 },
    high: { scale: [1, 2.5, 3], duration: 2 },
  };

  const { scale, duration } = intensityValues[intensity];

  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Animated rings */}
      {Array.from({ length: ringCount }, (_, i) => (
        <motion.div
          key={i}
          className={`absolute inset-0 rounded-full border-2 ${colorClasses[color].split(' ')[0]}`}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{
            scale: scale,
            opacity: [0.6, 0.3, 0],
          }}
          transition={{
            duration: duration,
            delay: i * (duration / ringCount),
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-full ${colorClasses[color].split(' ')[1]} blur-xl`}
        style={{
          width: size * 0.4,
          height: size * 0.4,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Center element */}
      <motion.div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center shadow-lg ${centerColorClasses[color]}`}
        style={{
          width: size * 0.2,
          height: size * 0.2,
        }}
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {centerIcon ? (
          <div className="text-white">
            {centerIcon}
          </div>
        ) : (
          <motion.div
            className="w-1/2 h-1/2 rounded-full bg-white/80"
            animate={{
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

/**
 * Heartbeat animation variant - perfect for health monitoring UIs
 */
export function HeartbeatPulse({
  className = '',
  size = 80,
}: { className?: string; size?: number }) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* ECG line simulation */}
      <svg
        viewBox="0 0 100 50"
        className="absolute inset-0 w-full h-full"
        style={{ top: '25%' }}
      >
        <motion.path
          d="M0,25 L20,25 L25,25 L30,10 L35,40 L40,15 L45,25 L50,25 L55,25 L60,20 L65,30 L70,25 L100,25"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 1, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </svg>

      {/* Heart icon */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl"
        animate={{
          scale: [1, 1.3, 1, 1.15, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatDelay: 0.5,
          ease: 'easeInOut',
        }}
      >
        ❤️
      </motion.div>
    </div>
  );
}

/**
 * Activity indicator with circular progress
 */
export function ActivityIndicator({
  className = '',
  size = 60,
  progress = 75,
  color = 'primary',
}: { className?: string; size?: number; progress?: number; color?: 'primary' | 'accent' | 'success' }) {
  const strokeWidth = 4;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  const strokeColors = {
    primary: 'stroke-primary',
    accent: 'stroke-accent',
    success: 'stroke-emerald-500',
  };

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className="stroke-muted"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className={strokeColors[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference - (progress / 100) * circumference
          }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <motion.div
        className="absolute inset-0 flex items-center justify-center font-bold text-sm"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        {progress}%
      </motion.div>
    </div>
  );
}
