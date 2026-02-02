import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function SimpleVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  const commands = {
    'find pharmacy': () => {
      window.location.href = '/pharmacy';
      return 'Opening pharmacy locator...';
    },
    'emergency': () => {
      window.location.href = '/emergency';
      return 'Opening emergency contacts...';
    },
    'symptom checker': () => {
      window.location.href = '/symptom-checker';
      return 'Opening symptom checker...';
    },
    'dashboard': () => {
      window.location.href = '/dashboard';
      return 'Opening health dashboard...';
    }
  };

  const startListening = () => {
    setIsListening(true);
    setTranscript('Listening...');
    
    // Simulate voice recognition
    setTimeout(() => {
      const possibleCommands = Object.keys(commands);
      const randomCommand = possibleCommands[Math.floor(Math.random() * possibleCommands.length)];
      setTranscript(`"${randomCommand}"`);
      
      // Process command
      const commandResponse = commands[randomCommand as keyof typeof commands];
      if (commandResponse) {
        setResponse(commandResponse);
        commandResponse();
      }
      
      setIsListening(false);
    }, 2000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Voice Assistant
            </h4>
            <Button
              size="sm"
              onClick={startListening}
              disabled={isListening}
              className={isListening ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
          
          {transcript && (
            <div className="mb-3 p-2 bg-muted rounded">
              <p className="text-sm">{transcript}</p>
            </div>
          )}
          
          {response && (
            <div className="p-2 bg-primary/10 border border-primary/20 rounded">
              <p className="text-sm">{response}</p>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground mt-2">
            Try: "find pharmacy", "emergency", "symptom checker", "dashboard"
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
