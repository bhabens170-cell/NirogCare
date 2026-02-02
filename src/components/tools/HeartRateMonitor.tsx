import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play, Square, Info, TrendingUp, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeartRateEntry {
  bpm: number;
  time: string;
  date: string;
}

export default function HeartRateMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [currentBPM, setCurrentBPM] = useState<number | null>(null);
  const [history, setHistory] = useState<HeartRateEntry[]>(() => {
    const saved = localStorage.getItem('heartRateHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    localStorage.setItem('heartRateHistory', JSON.stringify(history.slice(-10)));
  }, [history]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isMonitoring && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      finishMonitoring();
    }
    return () => clearTimeout(timer);
  }, [isMonitoring, countdown]);

  const startMonitoring = () => {
    setIsMonitoring(true);
    setTapTimes([]);
    setCurrentBPM(null);
    setCountdown(15);
  };

  const handleTap = () => {
    if (!isMonitoring) return;
    const now = Date.now();
    setTapTimes(prev => [...prev, now]);
  };

  const finishMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (tapTimes.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < tapTimes.length; i++) {
        intervals.push(tapTimes[i] - tapTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgInterval);
      const clampedBPM = Math.min(Math.max(bpm, 40), 200);
      setCurrentBPM(clampedBPM);
      
      const entry: HeartRateEntry = {
        bpm: clampedBPM,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toDateString(),
      };
      setHistory(prev => [entry, ...prev].slice(0, 10));
    }
    setTapTimes([]);
  }, [tapTimes]);

  const getHeartRateCategory = (bpm: number) => {
    if (bpm < 60) return { label: 'Low', color: 'text-blue-500', bg: 'bg-blue-100' };
    if (bpm <= 100) return { label: 'Normal', color: 'text-green-500', bg: 'bg-green-100' };
    if (bpm <= 120) return { label: 'Elevated', color: 'text-amber-500', bg: 'bg-amber-100' };
    return { label: 'High', color: 'text-red-500', bg: 'bg-red-100' };
  };

  return (
    <div className="space-y-4">
      {/* Monitor Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-6 text-white overflow-hidden"
      >
        <motion.div
          className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative text-center">
          <AnimatePresence mode="wait">
            {isMonitoring ? (
              <motion.div
                key="monitoring"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm cursor-pointer"
                  onClick={handleTap}
                >
                  <Heart className="w-12 h-12" fill="white" />
                </motion.div>
                <p className="text-xl font-bold mb-1">Tap with your heartbeat</p>
                <p className="text-white/80">{countdown}s remaining</p>
                <p className="text-sm text-white/60 mt-2">Taps: {tapTimes.length}</p>
              </motion.div>
            ) : currentBPM ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Heart className="w-16 h-16 mx-auto mb-3" fill="white" />
                </motion.div>
                <p className="text-5xl font-bold">{currentBPM}</p>
                <p className="text-white/80">BPM</p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`inline-block mt-3 px-4 py-1 rounded-full ${getHeartRateCategory(currentBPM).bg}`}
                >
                  <span className={`font-semibold ${getHeartRateCategory(currentBPM).color}`}>
                    {getHeartRateCategory(currentBPM).label}
                  </span>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Heart className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p className="text-xl font-bold">Heart Rate Monitor</p>
                <p className="text-white/70 text-sm mt-1">Manual pulse measurement</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Control Button */}
      <Button
        onClick={isMonitoring ? finishMonitoring : startMonitoring}
        className={`w-full rounded-xl h-12 ${
          isMonitoring 
            ? 'bg-gray-600 hover:bg-gray-700' 
            : 'bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600'
        }`}
      >
        {isMonitoring ? (
          <>
            <Square className="w-5 h-5 mr-2" />
            Stop Monitoring
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Start Measurement
          </>
        )}
      </Button>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-blue-50 border border-blue-200/50 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How to measure:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
              <li>Find your pulse on wrist or neck</li>
              <li>Press Start and tap the heart each beat</li>
              <li>Continue for 15 seconds for accuracy</li>
            </ol>
          </div>
        </div>
      </motion.div>

      {/* History */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border/50 rounded-2xl p-4"
        >
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-rose-500" />
            Recent Measurements
          </h3>
          <div className="space-y-2">
            {history.slice(0, 5).map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between bg-muted/50 rounded-xl p-3"
              >
                <div className="flex items-center gap-3">
                  <Activity className={`w-4 h-4 ${getHeartRateCategory(entry.bpm).color}`} />
                  <div>
                    <p className="font-bold text-foreground">{entry.bpm} BPM</p>
                    <p className="text-xs text-muted-foreground">{entry.time}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getHeartRateCategory(entry.bpm).bg} ${getHeartRateCategory(entry.bpm).color}`}>
                  {getHeartRateCategory(entry.bpm).label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
