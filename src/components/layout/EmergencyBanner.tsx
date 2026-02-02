/**
 * NirogCare - Emergency Banner/FAB
 * Always visible emergency button with pulse animation for critical access
 */

import { Phone, AlertTriangle, Shield, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function EmergencyBanner() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const emergencyNumbers = [
    { name: 'Ambulance', number: '108', icon: '🚑', color: 'bg-red-500' },
    { name: 'Police', number: '100', icon: '👮', color: 'bg-blue-600' },
    { name: 'Fire', number: '101', icon: '🚒', color: 'bg-orange-500' },
    { name: 'Women Helpline', number: '181', icon: '💜', color: 'bg-purple-500' },
  ];

  const handleEmergencyCall = (number: string) => {
    setShowConfirm(true);
    setTimeout(() => {
      window.open(`tel:${number}`);
      setShowConfirm(false);
      setIsExpanded(false);
    }, 500);
  };

  return (
    <>
      {/* Emergency FAB */}
      <motion.div
        className="fixed bottom-24 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 1 }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="bg-card border border-border rounded-3xl shadow-2xl p-4 min-w-[220px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </motion.div>
                  <span className="font-bold text-foreground">Emergency</span>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Emergency Numbers */}
              <div className="space-y-2">
                {emergencyNumbers.map((item, index) => (
                  <motion.button
                    key={item.number}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleEmergencyCall(item.number)}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted transition-all group"
                  >
                    <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center text-lg shadow-md`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-foreground text-sm">{item.name}</p>
                      <p className="text-muted-foreground text-xs">{item.number}</p>
                    </div>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                    >
                      <Phone className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </motion.button>
                ))}
              </div>

              {/* Medical ID Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 pt-4 border-t border-border"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl text-sm"
                  onClick={() => {
                    window.location.href = '/medical-id';
                    setIsExpanded(false);
                  }}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  View Medical ID
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              onClick={() => setIsExpanded(true)}
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pulse rings */}
              <motion.div
                className="absolute inset-0 rounded-full bg-destructive"
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.5, 0.2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-destructive"
                animate={{
                  scale: [1, 1.3, 1.6],
                  opacity: [0.4, 0.15, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.4,
                  ease: 'easeOut',
                }}
              />

              {/* Main button */}
              <div className="relative bg-destructive text-destructive-foreground px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 font-bold overflow-hidden">
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
                />

                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Phone className="w-4 h-4 relative z-10" />
                </motion.div>
                <span className="relative z-10">SOS</span>
              </div>

              {/* Hover tooltip */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg px-3 py-1.5 shadow-md text-xs font-medium text-foreground whitespace-nowrap pointer-events-none"
              >
                Tap for Emergency Services
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Confirmation overlay */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.1, 1] }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-destructive flex items-center justify-center"
              >
                <Phone className="w-10 h-10 text-white" />
              </motion.div>
              <p className="text-xl font-bold text-foreground">Calling Emergency...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
