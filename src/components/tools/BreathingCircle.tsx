import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface BreathingCircleProps {
  className?: string;
}

export default function BreathingCircle({ className = '' }: BreathingCircleProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('rest');
  const [seconds, setSeconds] = useState(0);
  const [cycles, setCycles] = useState(0);

  // 4-7-8 breathing technique
  const phaseDurations: Record<BreathPhase, number> = {
    inhale: 4,
    hold: 7,
    exhale: 8,
    rest: 0,
  };

  const phaseMessages: Record<BreathPhase, string> = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
    rest: 'Ready?',
  };

  const phaseColors: Record<BreathPhase, string> = {
    inhale: 'from-teal-400 to-emerald-500',
    hold: 'from-amber-400 to-orange-500',
    exhale: 'from-blue-400 to-indigo-500',
    rest: 'from-gray-400 to-gray-500',
  };

  const getNextPhase = useCallback((current: BreathPhase): BreathPhase => {
    switch (current) {
      case 'rest':
        return 'inhale';
      case 'inhale':
        return 'hold';
      case 'hold':
        return 'exhale';
      case 'exhale':
        return 'inhale';
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && phase !== 'rest') {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const maxDuration = phaseDurations[phase];
          if (prev >= maxDuration) {
            const nextPhase = getNextPhase(phase);
            setPhase(nextPhase);
            if (nextPhase === 'inhale' && phase === 'exhale') {
              setCycles((c) => c + 1);
            }
            return 1;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase, getNextPhase]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setSeconds(1);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('rest');
    setSeconds(0);
    setCycles(0);
  };

  const getCircleScale = () => {
    if (phase === 'rest') return 1;
    if (phase === 'inhale') return 1 + (seconds / phaseDurations.inhale) * 0.5;
    if (phase === 'hold') return 1.5;
    if (phase === 'exhale') return 1.5 - (seconds / phaseDurations.exhale) * 0.5;
    return 1;
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Breathing Circle */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-6">
        {/* Outer glow ring */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseColors[phase]} opacity-20 blur-xl`}
          animate={{ scale: getCircleScale() * 1.2 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
        
        {/* Main circle */}
        <motion.div
          className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${phaseColors[phase]} shadow-2xl flex items-center justify-center`}
          animate={{ scale: getCircleScale() }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          {/* Inner content */}
          <div className="text-center text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Wind className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <p className="text-xl font-bold">{phaseMessages[phase]}</p>
                {phase !== 'rest' && (
                  <p className="text-3xl font-bold mt-1">
                    {phaseDurations[phase] - seconds + 1}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Ripple effect during active breathing */}
        {isActive && phase !== 'rest' && (
          <motion.div
            className={`absolute w-48 h-48 rounded-full border-2 border-white/30`}
            animate={{ 
              scale: [1, 1.8], 
              opacity: [0.5, 0] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
        )}
      </div>

      {/* Cycle Counter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-6"
      >
        <p className="text-sm text-muted-foreground">Completed Cycles</p>
        <p className="text-3xl font-bold text-foreground">{cycles}</p>
      </motion.div>

      {/* Controls */}
      <div className="flex gap-3">
        {!isActive ? (
          <Button
            onClick={startExercise}
            className="rounded-xl h-12 px-8 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
          >
            <Play className="w-5 h-5 mr-2" />
            {phase === 'rest' ? 'Start' : 'Resume'}
          </Button>
        ) : (
          <Button
            onClick={pauseExercise}
            variant="outline"
            className="rounded-xl h-12 px-8 border-amber-300 text-amber-600 hover:bg-amber-50"
          >
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </Button>
        )}
        
        <Button
          onClick={resetExercise}
          variant="outline"
          className="rounded-xl h-12 px-4"
          disabled={phase === 'rest' && cycles === 0}
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 p-4 bg-muted/50 rounded-xl text-center max-w-xs"
      >
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">4-7-8 Technique:</span> Breathe in for 4s, hold for 7s, exhale for 8s
        </p>
      </motion.div>
    </div>
  );
}
