/**
 * NirogCare - Enhanced AI Chat Page
 * Premium chat interface with beautiful UI and smooth interactions
 */

import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { ArrowLeft, Send, Globe, Sparkles, Bot, User, Loader2, Copy, Check, Trash2, Heart, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/layout/LanguageSelector';
import { chatWithAI, isAIConfigured } from '@/lib/aiService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Quick suggestion chips
const quickSuggestions = [
  '🤒 I have a headache',
  '😷 Cold remedies',
  '💊 Medicine timing',
  '🏥 When to see doctor',
  '🥗 Healthy diet tips',
  '😴 Sleep better',
];

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatMessages, setChatMessages, selectedLanguage } = useAppContext();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [initialMessageProcessed, setInitialMessageProcessed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          id: 'welcome',
          type: 'bot',
          text: getWelcomeMessage(),
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, []);

  // Handle initialMessage from navigation (e.g., from Prescription Scanner)
  useEffect(() => {
    const state = location.state as { initialMessage?: string } | null;
    if (state?.initialMessage && !initialMessageProcessed && !isLoading) {
      setInitialMessageProcessed(true);
      // Small delay to ensure chat is initialized
      setTimeout(() => {
        handleSend(state.initialMessage);
      }, 500);
      // Clear the state so it doesn't re-trigger
      window.history.replaceState({}, document.title);
    }
  }, [location.state, initialMessageProcessed, isLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const getWelcomeMessage = () => {
    return `Namaste! 🙏 I'm your AI Health Assistant powered by Nirog Care.

I can help you with:
• 🏥 General health questions
• 🔍 Understanding symptoms
• 💡 Wellness tips & advice
• 📋 Government health schemes
• ⚠️ When to see a doctor

**Disclaimer:** I provide general health information only. For medical emergencies, please call 108 or visit a doctor.

How can I assist you today?`;
  };

  const handleSend = async (messageText?: string) => {
    const userMessage = (messageText || input).trim();
    if (!userMessage || isLoading) return;

    // Check if AI is configured
    if (!isAIConfigured()) {
      toast.error('AI not configured', {
        description: 'Please add your Gemini API key to the .env file',
      });
      return;
    }

    const userMsg = {
      id: Date.now().toString(),
      type: 'user' as const,
      text: userMessage,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Call the Gemini AI service
      const response = await chatWithAI(userMessage, chatMessages, selectedLanguage);

      setChatMessages((prev) => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        text: response,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (error) {
      console.error('Chat error:', error);

      // Error response with helpful tips
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      setChatMessages((prev) => [...prev, {
        id: Date.now().toString(),
        type: 'bot',
        text: `😔 ${errorMessage}\n\n💡 **Quick Tips:**\n- For emergencies, call **108**\n- Visit your nearest pharmacy for OTC medicines\n- Check our Health Tips section for common remedies\n\n_Please try again in a moment._`,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      }]);

      toast.error('Failed to get response', {
        description: 'Please check your internet connection and try again',
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const copyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setChatMessages([{
      id: 'welcome',
      type: 'bot',
      text: getWelcomeMessage(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }]);
    toast.success('Chat cleared!');
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="gradient-hero p-4 shadow-lg relative overflow-hidden">
        {/* Animated background decorations */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"
              >
                <Bot className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  AI Health Assistant
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </motion.div>
                </h1>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-white/80 text-sm">Online • Responds instantly</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearChat}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLangModal(true)}
              className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors flex items-center gap-1"
            >
              <Globe className="w-4 h-4" />
              {selectedLanguage.slice(0, 2).toUpperCase()}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-muted/30 to-background">
        <AnimatePresence>
          {chatMessages.map((msg, idx) => (
            <motion.div
              key={msg.id || idx}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <motion.div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.type === 'user'
                    ? 'bg-gradient-to-br from-primary to-primary/80'
                    : 'bg-gradient-to-br from-accent to-accent/80'
                    }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {msg.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </motion.div>

                {/* Message bubble */}
                <div className="group relative">
                  <div className={`rounded-2xl px-4 py-3 shadow-sm ${msg.type === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-card border border-border rounded-bl-md'
                    }`}>
                    <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                      {msg.text.split('**').map((part, i) =>
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </div>
                    <div className={`flex items-center justify-between mt-2 pt-2 border-t ${msg.type === 'user' ? 'border-white/20' : 'border-border/50'
                      }`}>
                      <span className={`text-xs ${msg.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {msg.time}
                      </span>

                      {/* Copy button for bot messages */}
                      {msg.type === 'bot' && msg.text && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => copyMessage(msg.text, msg.id)}
                          className="p-1 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isLoading && chatMessages[chatMessages.length - 1]?.type !== 'bot' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-primary rounded-full"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <AnimatePresence>
        {chatMessages.length <= 2 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-4 pb-2"
          >
            <p className="text-xs text-muted-foreground mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend(suggestion.replace(/^[^\s]+\s/, ''))}
                  className="px-3 py-1.5 bg-muted hover:bg-primary/10 border border-border hover:border-primary/30 rounded-full text-sm font-medium text-foreground transition-colors"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type your health question..."
              className="w-full px-5 py-3.5 pr-12 rounded-2xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              disabled={isLoading}
            />
            <Heart className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/30" />
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="rounded-2xl w-12 h-12 p-0 gradient-hero shadow-lg"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-5 h-5" />
                </motion.div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </motion.div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">
          AI provides general health info. For emergencies, call <strong>108</strong>
        </p>
      </div>

      <LanguageSelector open={showLangModal} onOpenChange={setShowLangModal} />
    </div>
  );
}
