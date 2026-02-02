import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Footprints, Plus, Target, Flame, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DAILY_GOAL = 6000;
const CALORIES_PER_STEP = 0.04;

export default function StepCounter() {
  const [steps, setSteps] = useState(() => {
    const saved = localStorage.getItem('stepCounter');
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      if (data.date === today) return data.steps;
    }
    return 0;
  });
  
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    localStorage.setItem('stepCounter', JSON.stringify({
      date: new Date().toDateString(),
      steps,
    }));
  }, [steps]);

  const addSteps = (amount: number) => {
    setSteps((prev: number) => prev + amount);
  };

  const handleManualAdd = () => {
    const value = parseInt(inputValue);
    if (value > 0) {
      addSteps(value);
      setInputValue('');
      setShowInput(false);
    }
  };

  const percentage = Math.min((steps / DAILY_GOAL) * 100, 100);
  const caloriesBurned = Math.round(steps * CALORIES_PER_STEP);
  const distanceKm = (steps * 0.0008).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Main Step Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative flex items-center justify-center"
      >
        {/* Progress Ring */}
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="85"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-muted"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="85"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: '534', strokeDashoffset: '534' }}
            animate={{ strokeDashoffset: 534 - (534 * percentage) / 100 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center Content */}
        <div className="absolute text-center">
          <Footprints className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <motion.p
            key={steps}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-foreground"
          >
            {steps.toLocaleString()}
          </motion.p>
          <p className="text-sm text-muted-foreground">of {DAILY_GOAL.toLocaleString()}</p>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border/50 p-3 text-center"
        >
          <Target className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{Math.round(percentage)}%</p>
          <p className="text-xs text-muted-foreground">Goal</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-xl border border-border/50 p-3 text-center"
        >
          <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{caloriesBurned}</p>
          <p className="text-xs text-muted-foreground">Calories</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border/50 p-3 text-center"
        >
          <TrendingUp className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{distanceKm}</p>
          <p className="text-xs text-muted-foreground">km</p>
        </motion.div>
      </div>

      {/* Quick Add Buttons */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Quick Add Steps</p>
        <div className="grid grid-cols-4 gap-2">
          {[500, 1000, 2000, 5000].map((amount) => (
            <Button
              key={amount}
              variant="outline"
              onClick={() => addSteps(amount)}
              className="rounded-xl h-10 text-sm"
            >
              +{amount >= 1000 ? `${amount / 1000}k` : amount}
            </Button>
          ))}
        </div>
      </div>

      {/* Manual Input */}
      {showInput ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex gap-2"
        >
          <Input
            type="number"
            placeholder="Enter steps..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="rounded-xl"
          />
          <Button onClick={handleManualAdd} className="rounded-xl bg-green-500 hover:bg-green-600">
            Add
          </Button>
        </motion.div>
      ) : (
        <Button
          variant="outline"
          onClick={() => setShowInput(true)}
          className="w-full rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Steps
        </Button>
      )}

      {/* Achievement Message */}
      {percentage >= 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center"
        >
          <p className="text-green-600 font-medium">🎉 Amazing! You've reached your daily goal!</p>
        </motion.div>
      )}
    </div>
  );
}
