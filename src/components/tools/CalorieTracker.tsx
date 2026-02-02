import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Plus, Minus, RotateCcw, Apple, Coffee, UtensilsCrossed, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MealEntry {
  id: string;
  name: string;
  calories: number;
  icon: any;
  time: string;
}

const quickAddItems = [
  { name: 'Roti', calories: 80, icon: UtensilsCrossed },
  { name: 'Rice (1 cup)', calories: 200, icon: UtensilsCrossed },
  { name: 'Dal (1 bowl)', calories: 150, icon: UtensilsCrossed },
  { name: 'Tea with milk', calories: 50, icon: Coffee },
  { name: 'Apple', calories: 95, icon: Apple },
  { name: 'Biscuits (2)', calories: 100, icon: Cookie },
];

export default function CalorieTracker() {
  const [dailyGoal] = useState(2000);
  const [meals, setMeals] = useState<MealEntry[]>(() => {
    const saved = localStorage.getItem('calorieTracker');
    const today = new Date().toDateString();
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        return parsed.meals;
      }
    }
    return [];
  });
  const [customCalories, setCustomCalories] = useState(100);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const remaining = dailyGoal - totalCalories;
  const progress = Math.min((totalCalories / dailyGoal) * 100, 100);

  useEffect(() => {
    localStorage.setItem('calorieTracker', JSON.stringify({
      date: new Date().toDateString(),
      meals,
    }));
  }, [meals]);

  const addMeal = (name: string, calories: number, icon: any = Flame) => {
    const newMeal: MealEntry = {
      id: Date.now().toString(),
      name,
      calories,
      icon,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMeals([...meals, newMeal]);
  };

  const removeMeal = (id: string) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  const resetDay = () => {
    setMeals([]);
  };

  const getProgressColor = () => {
    if (progress < 50) return 'from-green-500 to-emerald-500';
    if (progress < 80) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <div className="space-y-4">
      {/* Progress Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-card border border-border/50 rounded-2xl p-6 overflow-hidden"
      >
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="relative flex items-center justify-center mb-4">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-muted"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              strokeWidth="12"
              strokeLinecap="round"
              className={`text-transparent`}
              style={{
                stroke: `url(#calorieGradient)`,
              }}
              initial={{ strokeDasharray: '0 440' }}
              animate={{ strokeDasharray: `${progress * 4.4} 440` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
            <motion.p
              key={totalCalories}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-foreground"
            >
              {totalCalories}
            </motion.p>
            <p className="text-sm text-muted-foreground">kcal eaten</p>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <div className="text-center">
            <p className="font-bold text-foreground">{dailyGoal}</p>
            <p className="text-muted-foreground">Goal</p>
          </div>
          <div className="text-center">
            <p className={`font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
              {remaining}
            </p>
            <p className="text-muted-foreground">Remaining</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Add */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border/50 rounded-2xl p-4"
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Apple className="w-4 h-4 text-primary" />
          Quick Add
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {quickAddItems.map((item) => (
            <motion.button
              key={item.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addMeal(item.name, item.calories, item.icon)}
              className="bg-muted hover:bg-muted/80 rounded-xl p-3 text-center transition-colors"
            >
              <item.icon className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.calories} kcal</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Custom Add */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border/50 rounded-2xl p-4"
      >
        <h3 className="font-semibold text-foreground mb-3">Custom Entry</h3>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCustomCalories(Math.max(10, customCalories - 50))}
            className="rounded-xl"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold text-foreground">{customCalories}</p>
            <p className="text-sm text-muted-foreground">kcal</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCustomCalories(customCalories + 50)}
            className="rounded-xl"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <Button
          onClick={() => addMeal('Custom', customCalories)}
          className="w-full mt-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {customCalories} kcal
        </Button>
      </motion.div>

      {/* Today's Log */}
      {meals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border/50 rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Today's Log</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetDay}
              className="text-muted-foreground hover:text-destructive"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {meals.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between bg-muted/50 rounded-xl p-3"
              >
                <div className="flex items-center gap-3">
                  <meal.icon className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="font-medium text-foreground text-sm">{meal.name}</p>
                    <p className="text-xs text-muted-foreground">{meal.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-orange-500">{meal.calories}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMeal(meal.id)}
                    className="w-6 h-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
