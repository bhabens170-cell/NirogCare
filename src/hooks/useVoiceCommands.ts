import { useState, useEffect, useCallback, useRef } from 'react';
import { VoiceCommand } from '@/types/health';

interface VoiceCommandConfig {
  phrase: string;
  action: string;
  parameters?: Record<string, any>;
  description: string;
}

const VOICE_COMMANDS: VoiceCommandConfig[] = [
  {
    phrase: "record blood pressure",
    action: "navigate",
    parameters: { page: "health-monitor", tab: "blood-pressure" },
    description: "Open blood pressure recording"
  },
  {
    phrase: "check my heart rate",
    action: "navigate",
    parameters: { page: "health-monitor", tab: "heart-rate" },
    description: "Check heart rate"
  },
  {
    phrase: "log medication",
    action: "navigate",
    parameters: { page: "medications" },
    description: "Go to medication logging"
  },
  {
    phrase: "emergency call",
    action: "emergency",
    parameters: { type: "call" },
    description: "Call emergency services"
  },
  {
    phrase: "find nearest pharmacy",
    action: "navigate",
    parameters: { page: "pharmacy-locator" },
    description: "Find nearby pharmacies"
  },
  {
    phrase: "show my health profile",
    action: "navigate",
    parameters: { page: "profile" },
    description: "View health profile"
  },
  {
    phrase: "check symptoms",
    action: "navigate",
    parameters: { page: "symptom-checker" },
    description: "Open symptom checker"
  },
  {
    phrase: "track my steps",
    action: "navigate",
    parameters: { page: "health-tools", tool: "step-counter" },
    description: "Open step counter"
  },
  {
    phrase: "water reminder",
    action: "navigate",
    parameters: { page: "health-tools", tool: "water-tracker" },
    description: "Track water intake"
  },
  {
    phrase: "emergency contacts",
    action: "navigate",
    parameters: { page: "emergency-contacts" },
    description: "Show emergency contacts"
  }
];

export function useVoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Check for speech recognition support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript('');
      };

      recognitionInstance.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript.toLowerCase();
        setTranscript(transcript);

        if (event.results[current].isFinal) {
          processCommand(transcript);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser');
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const processCommand = useCallback((transcript: string) => {
    // Find matching command
    const matchedCommand = VOICE_COMMANDS.find(cmd => 
      transcript.includes(cmd.phrase.toLowerCase())
    );

    if (matchedCommand) {
      const command: VoiceCommand = {
        id: Date.now().toString(),
        phrase: transcript,
        action: matchedCommand.action,
        parameters: matchedCommand.parameters,
        confidence: 0.9,
        timestamp: new Date().toISOString()
      };

      setLastCommand(command);
      executeCommand(command);
    } else {
      // Try to extract intent from transcript
      const intent = extractIntent(transcript);
      if (intent) {
        const command: VoiceCommand = {
          id: Date.now().toString(),
          phrase: transcript,
          action: intent.action,
          parameters: intent.parameters,
          confidence: 0.6,
          timestamp: new Date().toISOString()
        };

        setLastCommand(command);
        executeCommand(command);
      } else {
        setError(`I didn't understand: "${transcript}". Try saying "help" for available commands.`);
      }
    }
  }, []);

  const extractIntent = (transcript: string): VoiceCommandConfig | null => {
    const text = transcript.toLowerCase();
    
    // Health monitoring
    if (text.includes('blood pressure') || text.includes('bp')) {
      return {
        phrase: "record blood pressure",
        action: "navigate",
        parameters: { page: "health-monitor", tab: "blood-pressure" },
        description: "Open blood pressure recording"
      };
    }

    // Emergency
    if (text.includes('emergency') || text.includes('help') || text.includes('sos')) {
      return {
        phrase: "emergency call",
        action: "emergency",
        parameters: { type: "call" },
        description: "Call emergency services"
      };
    }

    // Medication
    if (text.includes('medicine') || text.includes('medication') || text.includes('pill')) {
      return {
        phrase: "log medication",
        action: "navigate",
        parameters: { page: "medications" },
        description: "Go to medication logging"
      };
    }

    // Pharmacy
    if (text.includes('pharmacy') || text.includes('drug store')) {
      return {
        phrase: "find nearest pharmacy",
        action: "navigate",
        parameters: { page: "pharmacy-locator" },
        description: "Find nearby pharmacies"
      };
    }

    return null;
  };

  const executeCommand = useCallback((command: VoiceCommand) => {
    switch (command.action) {
      case 'navigate':
        // Navigate to specific page
        if (command.parameters?.page) {
          // In a real app, this would use react-router
          console.log(`Navigating to: ${command.parameters.page}`, command.parameters);
          // Example: navigate(`/${command.parameters.page}`);
          
          // For demo, we'll dispatch a custom event
          window.dispatchEvent(new CustomEvent('voiceNavigate', {
            detail: command.parameters
          }));
        }
        break;

      case 'emergency':
        // Trigger emergency action
        console.log('Emergency action triggered', command.parameters);
        window.dispatchEvent(new CustomEvent('emergencyAction', {
          detail: command.parameters
        }));
        break;

      case 'record':
        // Record health metric
        console.log('Recording health metric', command.parameters);
        window.dispatchEvent(new CustomEvent('recordMetric', {
          detail: command.parameters
        }));
        break;

      default:
        console.log('Unknown command action:', command.action);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported || !recognition) {
      setError('Speech recognition not available');
      return;
    }

    try {
      recognition.start();
      
      // Auto-stop after 10 seconds of silence
      timeoutRef.current = setTimeout(() => {
        if (isListening) {
          recognition.stop();
        }
      }, 10000);
    } catch (error) {
      setError('Failed to start speech recognition');
    }
  }, [isSupported, recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [recognition, isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Get available commands
  const getAvailableCommands = useCallback(() => {
    return VOICE_COMMANDS;
  }, []);

  // Clear last command
  const clearLastCommand = useCallback(() => {
    setLastCommand(null);
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    lastCommand,
    error,
    startListening,
    stopListening,
    toggleListening,
    getAvailableCommands,
    clearLastCommand
  };
}
