import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Clock, TrendingUp, Bed, Sunrise } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, differenceInMinutes, parse } from 'date-fns';

interface SleepEntry {
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number; // in minutes
}

export default function SleepTracker() {
  const [sleepData, setSleepData] = useState<SleepEntry[]>(() => {
    const saved = localStorage.getItem('sleepTracker');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [bedtime, setBedtime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('06:30');

  useEffect(() => {
    localStorage.setItem('sleepTracker', JSON.stringify(sleepData));
  }, [sleepData]);

  const calculateDuration = (bed: string, wake: string) => {
    const bedDate = parse(bed, 'HH:mm', new Date());
    const wakeDate = parse(wake, 'HH:mm', new Date());
    
    // If wake time is before bedtime, it means sleeping past midnight
    if (wakeDate < bedDate) {
      wakeDate.setDate(wakeDate.getDate() + 1);
    }
    
    return differenceInMinutes(wakeDate, bedDate);
  };

  const logSleep = () => {
    const duration = calculateDuration(bedtime, wakeTime);
    const newEntry: SleepEntry = {
      date: new Date().toISOString().split('T')[0],
      bedtime,
      wakeTime,
      duration,
    };
    
    setSleepData((prev) => [newEntry, ...prev.slice(0, 6)]); // Keep last 7 entries
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const lastNight = sleepData[0];
  const avgDuration = sleepData.length > 0 
    ? Math.round(sleepData.reduce((acc, s) => acc + s.duration, 0) / sleepData.length)
    : 0;

  const getSleepQuality = (minutes: number) => {
    if (minutes >= 420 && minutes <= 540) return { label: 'Excellent', color: 'text-green-500', bg: 'bg-green-100' };
    if (minutes >= 360 && minutes < 420) return { label: 'Good', color: 'text-blue-500', bg: 'bg-blue-100' };
    if (minutes >= 300 && minutes < 360) return { label: 'Fair', color: 'text-amber-500', bg: 'bg-amber-100' };
    return { label: 'Poor', color: 'text-red-500', bg: 'bg-red-100' };
  };

  return (
    <div className="space-y-6">
      {/* Last Night Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-500 rounded-2xl p-6 text-white"
      >
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Moon className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Last Night</span>
          </div>
          
          {lastNight ? (
            <>
              <p className="text-3xl font-bold mb-2">{formatDuration(lastNight.duration)}</p>
              <div className="flex items-center gap-4 text-sm text-white/80">
                <span className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  {lastNight.bedtime}
                </span>
                <span className="flex items-center gap-1">
                  <Sunrise className="w-4 h-4" />
                  {lastNight.wakeTime}
                </span>
              </div>
            </>
          ) : (
            <p className="text-white/80">No sleep data yet. Log your first night!</p>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border/50 p-4"
        >
          <div className="flex items-center gap-2 text-purple-500 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">7-Day Average</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {avgDuration > 0 ? formatDuration(avgDuration) : '--'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border/50 p-4"
        >
          <div className="flex items-center gap-2 text-indigo-500 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Sleep Quality</span>
          </div>
          {lastNight ? (
            <span className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${getSleepQuality(lastNight.duration).bg} ${getSleepQuality(lastNight.duration).color}`}>
              {getSleepQuality(lastNight.duration).label}
            </span>
          ) : (
            <p className="text-muted-foreground">--</p>
          )}
        </motion.div>
      </div>

      {/* Log Sleep Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-xl border border-border/50 p-4 space-y-4"
      >
        <h3 className="font-medium text-foreground">Log Your Sleep</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
              <Moon className="w-4 h-4 text-indigo-500" />
              Bedtime
            </label>
            <input
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className="w-full p-3 rounded-xl border border-border bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
              <Sun className="w-4 h-4 text-amber-500" />
              Wake Time
            </label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full p-3 rounded-xl border border-border bg-background text-foreground"
            />
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Duration: <span className="font-medium text-foreground">{formatDuration(calculateDuration(bedtime, wakeTime))}</span>
        </div>

        <Button
          onClick={logSleep}
          className="w-full rounded-xl h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        >
          <Moon className="w-5 h-5 mr-2" />
          Log Sleep
        </Button>
      </motion.div>

      {/* Recent Sleep History */}
      {sleepData.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <p className="text-sm font-medium text-foreground">Recent History</p>
          <div className="space-y-2">
            {sleepData.slice(1, 4).map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between bg-muted/50 rounded-xl p-3">
                <span className="text-sm text-muted-foreground">{entry.date}</span>
                <span className={`text-sm font-medium ${getSleepQuality(entry.duration).color}`}>
                  {formatDuration(entry.duration)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-muted/50 rounded-xl p-4 text-center"
      >
        <p className="text-sm text-muted-foreground">
          💤 <span className="font-medium text-foreground">Optimal:</span> Adults need 7-9 hours of sleep per night
        </p>
      </motion.div>
    </div>
  );
}
