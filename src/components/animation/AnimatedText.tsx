import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  type?: 'fade' | 'slide' | 'wave';
}

export function AnimatedWord({ 
  children, 
  className = '', 
  delay = 0,
  type = 'slide'
}: AnimatedTextProps) {
  const text = typeof children === 'string' ? children : '';
  
  if (type === 'wave' && text) {
    return (
      <span className={`inline-flex ${className}`}>
        {text.split('').map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.4,
              delay: delay + i * 0.03,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    );
  }

  return (
    <motion.span
      className={className}
      initial={{ 
        opacity: 0, 
        y: type === 'slide' ? 30 : 0,
      }}
      animate={{ 
        opacity: 1, 
        y: 0,
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.span>
  );
}

export function AnimatedParagraph({ 
  children, 
  className = '', 
  delay = 0 
}: AnimatedTextProps) {
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.p>
  );
}

interface StaggeredTextProps {
  words: string[];
  className?: string;
  wordClassName?: string;
  staggerDelay?: number;
  initialDelay?: number;
}

export function StaggeredText({ 
  words, 
  className = '', 
  wordClassName = '',
  staggerDelay = 0.1,
  initialDelay = 0
}: StaggeredTextProps) {
  return (
    <span className={`inline-flex flex-wrap gap-x-2 ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className={wordClassName}
          initial={{ opacity: 0, y: 30, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: initialDelay + i * staggerDelay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
