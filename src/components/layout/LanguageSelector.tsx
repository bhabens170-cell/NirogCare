/**
 * NirogCare - Language Selector
 * Multi-language selection dialog with persistence
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { languages } from '@/data/healthData';
import { useAppContext } from '@/context/AppContext';
import { Check, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface LanguageSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LanguageSelector({ open, onOpenChange }: LanguageSelectorProps) {
  const { selectedLanguage, setSelectedLanguage } = useAppContext();

  const handleSelect = (langName: string) => {
    const previousLang = selectedLanguage;
    setSelectedLanguage(langName);
    onOpenChange(false);

    // Show confirmation toast
    if (previousLang !== langName) {
      toast.success(`Language changed to ${langName}`, {
        description: 'The app will now display in your selected language.',
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="gradient-hero p-6">
          <DialogHeader>
            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.div
                className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Globe className="w-6 h-6 text-white" />
              </motion.div>
            </div>
            <DialogTitle className="text-center font-display text-xl text-white">
              भाषा चुनें
            </DialogTitle>
            <p className="text-center text-white/80 text-sm mt-1">
              Choose Your Language
            </p>
          </DialogHeader>
        </div>

        {/* Language options */}
        <div className="p-4 max-h-80 overflow-y-auto">
          <div className="grid gap-2">
            <AnimatePresence>
              {languages.map((lang, index) => {
                const isSelected = selectedLanguage === lang.name;
                return (
                  <motion.button
                    key={lang.code}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(lang.name)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${isSelected
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted hover:bg-muted/80'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <motion.span
                        className="text-lg font-semibold"
                        animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {lang.nativeName}
                      </motion.span>
                      <span className={`text-sm ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        ({lang.name})
                      </span>
                    </div>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer note */}
        <div className="px-4 pb-4">
          <p className="text-xs text-center text-muted-foreground bg-muted/50 rounded-lg py-2 px-3">
            💡 Your language preference will be saved and applied across the entire app
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
