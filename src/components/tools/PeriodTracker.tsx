import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Droplets, TrendingUp, Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, differenceInDays, startOfDay } from 'date-fns';

interface PeriodData {
  lastPeriodStart: Date | null;
  cycleLength: number;
  periodLength: number;
}

export default function PeriodTracker() {
  const [periodData, setPeriodData] = useState<PeriodData>(() => {
    const saved = localStorage.getItem('periodTracker');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        lastPeriodStart: parsed.lastPeriodStart ? new Date(parsed.lastPeriodStart) : null,
      };
    }
    return { lastPeriodStart: null, cycleLength: 28, periodLength: 5 };
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    localStorage.setItem('periodTracker', JSON.stringify(periodData));
  }, [periodData]);

  const today = startOfDay(new Date());
  
  const getNextPeriod = () => {
    if (!periodData.lastPeriodStart) return null;
    return addDays(periodData.lastPeriodStart, periodData.cycleLength);
  };

  const getDaysUntilNextPeriod = () => {
    const nextPeriod = getNextPeriod();
    if (!nextPeriod) return null;
    return differenceInDays(nextPeriod, today);
  };

  const getFertileWindow = () => {
    if (!periodData.lastPeriodStart) return null;
    const ovulationDay = addDays(periodData.lastPeriodStart, periodData.cycleLength - 14);
    return {
      start: addDays(ovulationDay, -5),
      end: addDays(ovulationDay, 1),
    };
  };

  const getCurrentPhase = () => {
    if (!periodData.lastPeriodStart) return 'unknown';
    const dayInCycle = differenceInDays(today, periodData.lastPeriodStart) % periodData.cycleLength;
    
    if (dayInCycle < periodData.periodLength) return 'menstrual';
    if (dayInCycle < 13) return 'follicular';
    if (dayInCycle < 17) return 'ovulation';
    return 'luteal';
  };

  const phaseInfo: Record<string, { color: string; label: string; description: string }> = {
    menstrual: { color: 'from-rose-500 to-pink-500', label: 'Menstrual Phase', description: 'Period days - take rest and stay hydrated' },
    follicular: { color: 'from-green-500 to-emerald-500', label: 'Follicular Phase', description: 'Energy increasing - great for exercise' },
    ovulation: { color: 'from-amber-500 to-orange-500', label: 'Ovulation Phase', description: 'Peak fertility window' },
    luteal: { color: 'from-purple-500 to-violet-500', label: 'Luteal Phase', description: 'PMS may occur - practice self-care' },
    unknown: { color: 'from-gray-400 to-gray-500', label: 'Set Your Cycle', description: 'Log your last period to get started' },
  };

  const logPeriodStart = () => {
    setPeriodData({
      ...periodData,
      lastPeriodStart: today,
    });
    setShowDatePicker(false);
  };

  const phase = getCurrentPhase();
  const daysUntil = getDaysUntilNextPeriod();
  const fertileWindow = getFertileWindow();

  return (
    <div className="space-y-4">
      {/* Current Phase Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br ${phaseInfo[phase].color}`}
      >
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Current Phase</span>
          </div>
          <h3 className="text-2xl font-bold mb-2">{phaseInfo[phase].label}</h3>
          <p className="text-white/80 text-sm">{phaseInfo[phase].description}</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Next Period */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border/50 p-4"
        >
          <div className="flex items-center gap-2 text-rose-500 mb-2">
            <Droplets className="w-4 h-4" />
            <span className="text-xs font-medium">Next Period</span>
          </div>
          {daysUntil !== null ? (
            <>
              <p className="text-2xl font-bold text-foreground">{daysUntil} days</p>
              <p className="text-xs text-muted-foreground mt-1">
                {getNextPeriod() && format(getNextPeriod()!, 'MMM d')}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Not set</p>
          )}
        </motion.div>

        {/* Cycle Length */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border/50 p-4"
        >
          <div className="flex items-center gap-2 text-purple-500 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Cycle Length</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{periodData.cycleLength} days</p>
          <p className="text-xs text-muted-foreground mt-1">Average cycle</p>
        </motion.div>
      </div>

      {/* Fertile Window */}
      {fertileWindow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Bell className="w-4 h-4" />
            <span className="text-sm font-medium">Fertile Window</span>
          </div>
          <p className="text-amber-900">
            {format(fertileWindow.start, 'MMM d')} - {format(fertileWindow.end, 'MMM d')}
          </p>
        </motion.div>
      )}

      {/* Log Period Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={logPeriodStart}
          className="w-full rounded-xl h-12 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Log Period Start (Today)
        </Button>
        {periodData.lastPeriodStart && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            Last logged: {format(periodData.lastPeriodStart, 'MMMM d, yyyy')}
          </p>
        )}
      </motion.div>
    </div>
  );
}
