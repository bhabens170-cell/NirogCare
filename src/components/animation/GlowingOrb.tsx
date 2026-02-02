import { motion } from 'framer-motion';

interface GlowingOrbProps {
  className?: string;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'accent' | 'secondary';
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

const colorClasses = {
  primary: 'bg-primary/30 shadow-[0_0_60px_30px_hsl(var(--primary)/0.3)]',
  accent: 'bg-accent/30 shadow-[0_0_60px_30px_hsl(var(--accent)/0.3)]',
  secondary: 'bg-secondary/50 shadow-[0_0_60px_30px_hsl(var(--secondary)/0.5)]',
};

export default function GlowingOrb({ 
  className = '', 
  delay = 0, 
  size = 'md',
  color = 'primary'
}: GlowingOrbProps) {
  return (
    <motion.div
      className={`absolute rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.4, 0.8, 0.4],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
