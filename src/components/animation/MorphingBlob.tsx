import { motion } from 'framer-motion';

interface MorphingBlobProps {
  className?: string;
  color?: string;
  size?: string;
}

export default function MorphingBlob({ 
  className = '', 
  color = 'from-primary/20 to-accent/10',
  size = 'w-72 h-72'
}: MorphingBlobProps) {
  return (
    <motion.div
      className={`absolute bg-gradient-to-br ${color} ${size} rounded-full blur-3xl ${className}`}
      animate={{
        borderRadius: [
          '60% 40% 30% 70% / 60% 30% 70% 40%',
          '30% 60% 70% 40% / 50% 60% 30% 60%',
          '40% 60% 60% 40% / 60% 40% 60% 40%',
          '60% 40% 30% 70% / 60% 30% 70% 40%',
        ],
        scale: [1, 1.1, 0.95, 1],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
