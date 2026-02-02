import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, HelpCircle, Command, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';

export default function VoiceAssistant() {
  const {
    isListening,
    isSupported,
    transcript,
    lastCommand,
    error,
    toggleListening,
    getAvailableCommands,
    clearLastCommand
  } = useVoiceCommands();

  const [showHelp, setShowHelp] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const availableCommands = getAvailableCommands();

  // Handle voice navigation events
  useEffect(() => {
    const handleVoiceNavigate = (event: CustomEvent) => {
      console.log('Voice navigation:', event.detail);
      // In a real app, this would navigate to the page
      // For demo, we'll just show a notification
    };

    const handleEmergencyAction = (event: CustomEvent) => {
      console.log('Emergency action:', event.detail);
      // Handle emergency actions
    };

    const handleRecordMetric = (event: CustomEvent) => {
      console.log('Record metric:', event.detail);
      // Handle metric recording
    };

    window.addEventListener('voiceNavigate', handleVoiceNavigate as EventListener);
    window.addEventListener('emergencyAction', handleEmergencyAction as EventListener);
    window.addEventListener('recordMetric', handleRecordMetric as EventListener);

    return () => {
      window.removeEventListener('voiceNavigate', handleVoiceNavigate as EventListener);
      window.removeEventListener('emergencyAction', handleEmergencyAction as EventListener);
      window.removeEventListener('recordMetric', handleRecordMetric as EventListener);
    };
  }, []);

  if (!isSupported) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <MicOff className="w-5 h-5" />
            <div>
              <p className="font-medium">Voice Commands Not Available</p>
              <p className="text-sm">Your browser doesn't support speech recognition</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4"
          >
            <Card className="w-80 shadow-lg border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Voice Assistant
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowHelp(!showHelp)}
                    >
                      <HelpCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsMinimized(true)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Voice Input */}
                <div className="text-center">
                  <Button
                    size="lg"
                    onClick={toggleListening}
                    className={`w-full h-16 rounded-full ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    {isListening ? (
                      <div className="flex items-center gap-3">
                        <MicOff className="w-6 h-6" />
                        <span>Listening...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Mic className="w-6 h-6" />
                        <span>Tap to Speak</span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* Transcript */}
                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-muted rounded-lg"
                  >
                    <p className="text-sm font-medium">You said:</p>
                    <p className="text-sm text-muted-foreground">"{transcript}"</p>
                  </motion.div>
                )}

                {/* Last Command */}
                {lastCommand && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">Command executed:</p>
                        <p className="text-sm text-green-600">{lastCommand.action}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={clearLastCommand}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-sm text-red-800">{error}</p>
                  </motion.div>
                )}

                {/* Help Section */}
                {showHelp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Command className="w-4 h-4" />
                      Available Commands:
                    </p>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {availableCommands.map((cmd, index) => (
                        <div key={index} className="p-2 bg-muted rounded text-xs">
                          <p className="font-medium">"{cmd.phrase}"</p>
                          <p className="text-muted-foreground">{cmd.description}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Floating Button */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              size="lg"
              onClick={() => setIsMinimized(false)}
              className={`w-14 h-14 rounded-full shadow-lg ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isListening ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Listening Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -top-2 -right-2"
          >
            <div className="w-4 h-4 bg-red-500 rounded-full animate-ping" />
            <div className="w-4 h-4 bg-red-500 rounded-full absolute top-0" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
