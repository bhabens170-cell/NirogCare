import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, Flame, Zap, Bug, Heart, Brain, Bone, 
  ChevronRight, ArrowLeft, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FirstAidItem {
  id: string;
  title: string;
  icon: any;
  color: string;
  gradient: string;
  steps: string[];
  warning?: string;
}

const firstAidGuides: FirstAidItem[] = [
  {
    id: 'burn',
    title: 'Burns',
    icon: Flame,
    color: 'text-orange-500',
    gradient: 'from-orange-500 to-red-500',
    steps: [
      'Cool the burn under cool running water for 10-20 minutes',
      'Remove any jewelry or tight clothing near the burn',
      'Cover with a clean, non-fluffy bandage',
      'Do NOT apply ice, butter, or toothpaste',
      'Take over-the-counter pain relief if needed',
      'Seek medical help if burn is larger than palm size'
    ],
    warning: 'For severe burns (charred, white, or deep), call 108 immediately'
  },
  {
    id: 'choking',
    title: 'Choking',
    icon: AlertCircle,
    color: 'text-red-500',
    gradient: 'from-red-500 to-rose-600',
    steps: [
      'Ask "Are you choking?" - if they can speak, encourage coughing',
      'Stand behind the person, wrap arms around their waist',
      'Make a fist with one hand, place above navel',
      'Grasp fist with other hand, thrust inward and upward',
      'Repeat until object is dislodged or person becomes unconscious',
      'If unconscious, call 108 and start CPR'
    ],
    warning: 'For infants, use back blows and chest thrusts instead'
  },
  {
    id: 'bleeding',
    title: 'Heavy Bleeding',
    icon: Droplets,
    color: 'text-red-600',
    gradient: 'from-red-600 to-pink-600',
    steps: [
      'Apply direct pressure with a clean cloth',
      'Keep pressing firmly for at least 10 minutes',
      'Do NOT remove the cloth if blood soaks through - add more',
      'Elevate the injured area above heart level if possible',
      'If bleeding doesn\'t stop, apply pressure to artery points',
      'Call 108 if bleeding is severe or doesn\'t stop'
    ]
  },
  {
    id: 'shock',
    title: 'Electric Shock',
    icon: Zap,
    color: 'text-yellow-500',
    gradient: 'from-yellow-500 to-amber-600',
    steps: [
      'Do NOT touch the person if still in contact with electricity',
      'Turn off the power source if possible',
      'Call 108 immediately',
      'Check for breathing and pulse once safe',
      'Perform CPR if needed and you are trained',
      'Keep the person warm and still until help arrives'
    ],
    warning: 'Never approach if high voltage is involved'
  },
  {
    id: 'snake',
    title: 'Snake Bite',
    icon: Bug,
    color: 'text-green-600',
    gradient: 'from-green-600 to-emerald-600',
    steps: [
      'Keep the person calm and still - movement spreads venom',
      'Remove jewelry and tight clothing near the bite',
      'Position the bitten limb below heart level',
      'Clean the wound gently with soap and water',
      'Do NOT cut, suck, or apply tourniquet',
      'Get to hospital immediately - antivenom may be needed'
    ],
    warning: 'Try to remember the snake\'s appearance for identification'
  },
  {
    id: 'heart',
    title: 'Heart Attack',
    icon: Heart,
    color: 'text-rose-500',
    gradient: 'from-rose-500 to-red-600',
    steps: [
      'Call 108 immediately',
      'Have the person sit or lie down comfortably',
      'Give aspirin (325mg) if not allergic and conscious',
      'Loosen any tight clothing',
      'If unconscious and not breathing, start CPR',
      'Stay with them until help arrives'
    ],
    warning: 'Signs: chest pain, shortness of breath, cold sweat, nausea'
  },
  {
    id: 'stroke',
    title: 'Stroke (FAST)',
    icon: Brain,
    color: 'text-purple-500',
    gradient: 'from-purple-500 to-violet-600',
    steps: [
      'F - Face: Ask them to smile. Does one side droop?',
      'A - Arms: Can they raise both arms equally?',
      'S - Speech: Is their speech slurred or strange?',
      'T - Time: Call 108 immediately if any signs',
      'Note the time symptoms started',
      'Keep them comfortable until help arrives'
    ],
    warning: 'Every minute counts - brain cells are dying'
  },
  {
    id: 'fracture',
    title: 'Fractures',
    icon: Bone,
    color: 'text-gray-600',
    gradient: 'from-gray-500 to-slate-600',
    steps: [
      'Keep the injured area still - do not try to realign',
      'Apply ice wrapped in cloth to reduce swelling',
      'Immobilize the area with a splint if trained',
      'Use padding between splint and skin',
      'Check circulation beyond injury (pulse, color, feeling)',
      'Get medical help - X-ray may be needed'
    ]
  },
];

export default function FirstAidGuide() {
  const [selectedGuide, setSelectedGuide] = useState<FirstAidItem | null>(null);

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {selectedGuide ? (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Button
              variant="ghost"
              onClick={() => setSelectedGuide(null)}
              className="mb-4 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to guides
            </Button>

            <motion.div
              className={`bg-gradient-to-br ${selectedGuide.gradient} rounded-2xl p-5 text-white mb-4`}
            >
              <div className="flex items-center gap-3">
                <selectedGuide.icon className="w-10 h-10" />
                <div>
                  <h3 className="text-xl font-bold">{selectedGuide.title}</h3>
                  <p className="text-white/80 text-sm">First Aid Steps</p>
                </div>
              </div>
            </motion.div>

            {selectedGuide.warning && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{selectedGuide.warning}</p>
              </motion.div>
            )}

            <div className="space-y-3">
              {selectedGuide.steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 bg-card border border-border/50 rounded-xl p-4"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-foreground text-sm leading-relaxed pt-1">{step}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-sm">
                Stay calm, act quickly, and always call for professional help when needed
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            {firstAidGuides.map((guide, index) => (
              <motion.button
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedGuide(guide)}
                className="bg-card border border-border/50 rounded-2xl p-4 text-left hover:shadow-lg hover:border-primary/30 transition-all group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${guide.gradient} flex items-center justify-center mb-3`}
                >
                  <guide.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {guide.title}
                  </h4>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
