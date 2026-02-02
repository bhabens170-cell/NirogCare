import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Plus, Minus, RotateCcw, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GLASS_ML = 250;
const DAILY_GOAL = 8; // 8 glasses = 2 liters

export default function WaterTracker() {
  const [glasses, setGlasses] = useState(() => {
    const saved = localStorage.getItem('waterTracker');
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      if (data.date === today) return data.glasses;
    }
    return 0;
  });

  useEffect(() => {
    localStorage.setItem('waterTracker', JSON.stringify({
      date: new Date().toDateString(),
      glasses,
    }));
  }, [glasses]);

  const addGlass = () => setGlasses((prev: number) => Math.min(prev + 1, 15));
  const removeGlass = () => setGlasses((prev: number) => Math.max(prev - 1, 0));
  const resetGlasses = () => setGlasses(0);

  const percentage = Math.min((glasses / DAILY_GOAL) * 100, 100);
  const totalMl = glasses * GLASS_ML;

  return (
    <div className="space-y-6">
      {/* Water Level Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-b from-blue-100 to-blue-50 rounded-2xl p-6 overflow-hidden"
      >
        {/* Water fill animation */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-cyan-400 opacity-30"
          initial={{ height: '0%' }}
          animate={{ height: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        
        <div className="relative z-10 text-center">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4"
            animate={{ scale: glasses > 0 ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Droplets className="w-10 h-10 text-blue-500" />
          </motion.div>
          
          <motion.p
            key={glasses}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold text-blue-600"
          >
            {glasses}/{DAILY_GOAL}
          </motion.p>
          <p className="text-blue-500 font-medium">glasses today</p>
          <p className="text-sm text-blue-400 mt-1">{totalMl}ml / {DAILY_GOAL * GLASS_ML}ml</p>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            <Target className="w-4 h-4" />
            Daily Progress
          </span>
          <span className="font-medium text-foreground">{Math.round(percentage)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        {percentage >= 100 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-green-600 font-medium text-sm"
          >
            🎉 Daily goal achieved! Great job!
          </motion.p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={removeGlass}
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full border-blue-200 hover:bg-blue-50"
          disabled={glasses === 0}
        >
          <Minus className="w-5 h-5 text-blue-500" />
        </Button>
        
        <Button
          onClick={addGlass}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg"
        >
          <Plus className="w-8 h-8" />
        </Button>
        
        <Button
          onClick={resetGlasses}
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full border-gray-200 hover:bg-gray-50"
          disabled={glasses === 0}
        >
          <RotateCcw className="w-5 h-5 text-gray-500" />
        </Button>
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-muted/50 rounded-xl p-4"
      >
        <p className="text-sm text-muted-foreground text-center">
          💡 <span className="font-medium text-foreground">Tip:</span> Drink a glass of water every 1-2 hours to stay hydrated
        </p>
      </motion.div>
    </div>
  );
}
