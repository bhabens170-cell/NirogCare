import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, AlertTriangle, X, Ambulance, Shield, HeartPulse, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';

const emergencyContacts = [
  { id: 'ambulance', icon: Ambulance, label: 'Ambulance', number: '108', color: 'from-red-500 to-rose-600' },
  { id: 'police', icon: Shield, label: 'Police', number: '100', color: 'from-blue-500 to-indigo-600' },
  { id: 'fire', icon: Flame, label: 'Fire', number: '101', color: 'from-orange-500 to-red-600' },
  { id: 'women', icon: HeartPulse, label: 'Women Helpline', number: '1091', color: 'from-pink-500 to-purple-600' },
];

export default function EmergencySOSButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSOSClick = () => {
    if (!isExpanded) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsExpanded(true);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleCall = (number: string) => {
    window.open(`tel:${number}`);
  };

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-24 left-4 right-4 z-50 bg-card rounded-3xl p-6 shadow-2xl border border-border max-w-md mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center"
                >
                  <AlertTriangle className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">Emergency Services</h3>
                  <p className="text-sm text-muted-foreground">Tap to call immediately</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {emergencyContacts.map((contact, index) => (
                <motion.button
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleCall(contact.number)}
                  className={`bg-gradient-to-br ${contact.color} p-4 rounded-2xl text-white hover:scale-105 active:scale-95 transition-transform shadow-lg`}
                >
                  <contact.icon className="w-8 h-8 mb-2" />
                  <p className="font-bold text-lg">{contact.number}</p>
                  <p className="text-sm opacity-90">{contact.label}</p>
                </motion.button>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-muted-foreground mt-4"
            >
              🇮🇳 India Emergency Numbers
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating SOS Button */}
      <motion.button
        onClick={handleSOSClick}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-4 z-40"
      >
        <motion.div
          animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
          className="relative"
        >
          {/* Pulse rings */}
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-red-500 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            className="absolute inset-0 bg-red-500 rounded-full"
          />
          
          {/* Main button */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40">
            <span className="text-white font-bold text-lg">SOS</span>
          </div>
        </motion.div>
      </motion.button>
    </>
  );
}
