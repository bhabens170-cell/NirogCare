import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, AlertTriangle, CheckCircle, ChevronRight, 
  Thermometer, Stethoscope, ArrowRight,
  MessageSquare, RefreshCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

interface Symptom {
  id: string;
  name: string;
  category: string;
}

interface Condition {
  name: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  advice: string;
  seeDoctor: boolean;
}

const commonSymptoms: Symptom[] = [
  { id: 'headache', name: 'Headache', category: 'Head' },
  { id: 'fever', name: 'Fever', category: 'General' },
  { id: 'cough', name: 'Cough', category: 'Respiratory' },
  { id: 'fatigue', name: 'Fatigue', category: 'General' },
  { id: 'nausea', name: 'Nausea', category: 'Digestive' },
  { id: 'sore_throat', name: 'Sore Throat', category: 'Respiratory' },
  { id: 'body_ache', name: 'Body Aches', category: 'General' },
  { id: 'runny_nose', name: 'Runny Nose', category: 'Respiratory' },
  { id: 'dizziness', name: 'Dizziness', category: 'Head' },
  { id: 'stomach_pain', name: 'Stomach Pain', category: 'Digestive' },
  { id: 'chest_pain', name: 'Chest Pain', category: 'Chest' },
  { id: 'shortness_breath', name: 'Shortness of Breath', category: 'Respiratory' },
];

const conditionMapping: Record<string, Condition> = {
  'fever,cough,body_ache': {
    name: 'Common Flu',
    severity: 'medium',
    description: 'Viral infection affecting respiratory system',
    advice: 'Rest, stay hydrated, take paracetamol for fever. Monitor symptoms.',
    seeDoctor: false,
  },
  'headache,fever': {
    name: 'Viral Fever',
    severity: 'medium',
    description: 'Fever caused by viral infection with associated headache',
    advice: 'Take paracetamol, rest well, drink plenty of fluids.',
    seeDoctor: false,
  },
  'fever,sore_throat,cough': {
    name: 'Upper Respiratory Infection',
    severity: 'medium',
    description: 'Infection of throat and upper airways',
    advice: 'Gargle with warm salt water, stay hydrated, rest.',
    seeDoctor: true,
  },
  'chest_pain': {
    name: 'Chest Discomfort',
    severity: 'high',
    description: 'Pain in the chest area requires immediate attention',
    advice: 'Stop all activity, stay calm. If pain persists or is severe, call 108.',
    seeDoctor: true,
  },
  'shortness_breath': {
    name: 'Breathing Difficulty',
    severity: 'high',
    description: 'Difficulty breathing needs prompt evaluation',
    advice: 'Sit upright, stay calm, use inhaler if prescribed. Seek help if worsening.',
    seeDoctor: true,
  },
};

export default function SymptomChecker() {
  const navigate = useNavigate();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState<Condition | null>(null);

  const filteredSymptoms = commonSymptoms.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
    setResult(null);
  };

  const checkSymptoms = () => {
    if (selectedSymptoms.length === 0) return;

    // Check for high-severity single symptoms first
    for (const symptom of selectedSymptoms) {
      if (conditionMapping[symptom]) {
        setResult(conditionMapping[symptom]);
        return;
      }
    }

    // Check combinations
    const sortedKey = [...selectedSymptoms].sort().join(',');
    for (const key of Object.keys(conditionMapping)) {
      const keySymptoms = key.split(',');
      if (keySymptoms.every(s => selectedSymptoms.includes(s))) {
        setResult(conditionMapping[key]);
        return;
      }
    }

    // Default response
    setResult({
      name: 'General Assessment',
      severity: 'low',
      description: 'Based on your symptoms, this could be a minor condition',
      advice: 'Monitor your symptoms. Rest and stay hydrated. If symptoms persist beyond 3 days, consult a doctor.',
      seeDoctor: selectedSymptoms.length >= 3,
    });
  };

  const reset = () => {
    setSelectedSymptoms([]);
    setResult(null);
    setSearchQuery('');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'from-red-500 to-rose-600';
      case 'medium': return 'from-amber-500 to-orange-500';
      default: return 'from-green-500 to-emerald-500';
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Result Card */}
            <motion.div
              className={`bg-gradient-to-br ${getSeverityColor(result.severity)} rounded-2xl p-6 text-white`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm opacity-80 mb-1">Possible Condition</p>
                  <h3 className="text-2xl font-bold">{result.name}</h3>
                </div>
                {result.severity === 'high' && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <AlertTriangle className="w-8 h-8" />
                  </motion.div>
                )}
              </div>
              <p className="text-white/90 mb-4">{result.description}</p>
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <p className="font-medium mb-1">💡 Advice:</p>
                <p className="text-sm">{result.advice}</p>
              </div>
            </motion.div>

            {/* Doctor Recommendation */}
            {result.seeDoctor && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3"
              >
                <Stethoscope className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Consult a Doctor</p>
                  <p className="text-sm text-amber-700">
                    Based on your symptoms, we recommend consulting a healthcare professional.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={reset}
                variant="outline"
                className="rounded-xl h-12"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Check Again
              </Button>
              <Button
                onClick={() => navigate('/chat')}
                className="rounded-xl h-12 bg-gradient-to-r from-primary to-teal-500"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask AI
              </Button>
            </div>

            {/* Disclaimer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-muted-foreground text-center"
            >
              ⚠️ This is not a medical diagnosis. Always consult a qualified doctor.
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search symptoms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl h-12"
              />
            </div>

            {/* Selected Symptoms */}
            {selectedSymptoms.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex flex-wrap gap-2"
              >
                {selectedSymptoms.map(id => {
                  const symptom = commonSymptoms.find(s => s.id === id);
                  return (
                    <motion.span
                      key={id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {symptom?.name}
                      <button
                        onClick={() => toggleSymptom(id)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </motion.span>
                  );
                })}
              </motion.div>
            )}

            {/* Symptom Grid */}
            <div className="grid grid-cols-2 gap-2">
              {filteredSymptoms.map((symptom, index) => (
                <motion.button
                  key={symptom.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    selectedSymptoms.includes(symptom.id)
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-card border border-border/50 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{symptom.name}</span>
                    {selectedSymptoms.includes(symptom.id) && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-xs ${
                    selectedSymptoms.includes(symptom.id) 
                      ? 'text-primary-foreground/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {symptom.category}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Check Button */}
            <Button
              onClick={checkSymptoms}
              disabled={selectedSymptoms.length === 0}
              className="w-full rounded-xl h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              <Thermometer className="w-5 h-5 mr-2" />
              Check Symptoms ({selectedSymptoms.length})
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
