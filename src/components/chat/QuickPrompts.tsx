import { motion } from 'framer-motion';
import { 
  Pill, Stethoscope, Apple, Baby, Brain, Heart, 
  Thermometer, Droplets, AlertCircle, Sparkles 
} from 'lucide-react';

interface QuickPrompt {
  icon: any;
  label: string;
  prompt: string;
  color: string;
}

const quickPrompts: QuickPrompt[] = [
  { 
    icon: Thermometer, 
    label: 'Fever Help', 
    prompt: 'I have fever, what should I do?',
    color: 'from-red-500 to-orange-500'
  },
  { 
    icon: Pill, 
    label: 'Medicine Info', 
    prompt: 'Tell me about common over-the-counter medicines',
    color: 'from-blue-500 to-indigo-500'
  },
  { 
    icon: Apple, 
    label: 'Diet Tips', 
    prompt: 'What is a healthy balanced diet for Indians?',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    icon: Brain, 
    label: 'Mental Health', 
    prompt: 'How can I manage stress and anxiety?',
    color: 'from-purple-500 to-violet-500'
  },
  { 
    icon: Baby, 
    label: 'Baby Care', 
    prompt: 'What are essential baby care tips for new parents?',
    color: 'from-pink-500 to-rose-500'
  },
  { 
    icon: Heart, 
    label: 'Heart Health', 
    prompt: 'How can I keep my heart healthy?',
    color: 'from-rose-500 to-red-500'
  },
  { 
    icon: Droplets, 
    label: 'Diabetes', 
    prompt: 'What lifestyle changes help manage diabetes?',
    color: 'from-teal-500 to-cyan-500'
  },
  { 
    icon: AlertCircle, 
    label: 'First Aid', 
    prompt: 'What should I have in a home first aid kit?',
    color: 'from-amber-500 to-orange-500'
  },
];

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function QuickPrompts({ onSelectPrompt }: QuickPromptsProps) {
  return (
    <div className="py-4">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Quick Questions</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {quickPrompts.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectPrompt(item.prompt)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${item.color} text-white text-sm font-medium shadow-md`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
