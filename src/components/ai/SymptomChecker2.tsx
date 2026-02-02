import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, AlertTriangle, CheckCircle, Clock, MessageCircle, Plus, X, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useHealthCoach } from '@/hooks/useHealthCoach';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { SymptomAnalysis } from '@/types/health';

interface SymptomEntry {
  id: string;
  symptom: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
}

const COMMON_SYMPTOMS = [
  'Headache', 'Chest Pain', 'Fever', 'Cough', 'Fatigue', 'Nausea',
  'Dizziness', 'Shortness of Breath', 'Back Pain', 'Stomach Pain',
  'Sore Throat', 'Muscle Pain', 'Joint Pain', 'Skin Rash', 'Swelling'
];

export default function SymptomChecker2() {
  const { profile } = useHealthProfile();
  const { analyzeSymptoms, isLoading, lastAnalysis } = useHealthCoach();
  
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [currentSeverity, setCurrentSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [currentDuration, setCurrentDuration] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showResults, setShowResults] = useState(false);

  const addSymptom = () => {
    if (currentSymptom.trim()) {
      const newSymptom: SymptomEntry = {
        id: Date.now().toString(),
        symptom: currentSymptom,
        severity: currentSeverity,
        duration: currentDuration || 'Unknown'
      };
      setSymptoms([...symptoms, newSymptom]);
      setCurrentSymptom('');
      setCurrentSeverity('mild');
      setCurrentDuration('');
    }
  };

  const removeSymptom = (id: string) => {
    setSymptoms(symptoms.filter(s => s.id !== id));
  };

  const handleAnalyze = async () => {
    if (symptoms.length === 0) return;
    
    try {
      await analyzeSymptoms(symptoms);
      setShowResults(true);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'emergency': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'low': return <CheckCircle className="w-5 h-5" />;
      case 'medium': return <Clock className="w-5 h-5" />;
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      case 'emergency': return <AlertTriangle className="w-5 h-5" />;
      default: return <MessageCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">AI Symptom Checker</h2>
        <p className="text-muted-foreground">
          Describe your symptoms and get AI-powered health insights
        </p>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg max-w-2xl mx-auto">
          <p className="text-sm text-amber-800">
            <strong>Disclaimer:</strong> This tool provides general health information and is not a substitute for professional medical advice. Always consult a healthcare provider for medical concerns.
          </p>
        </div>
      </div>

      {/* Symptom Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Symptoms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="symptom">Symptom</Label>
              <Select value={currentSymptom} onValueChange={setCurrentSymptom}>
                <SelectTrigger>
                  <SelectValue placeholder="Select or type symptom" />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_SYMPTOMS.map((symptom) => (
                    <SelectItem key={symptom} value={symptom}>
                      {symptom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="mt-2"
                placeholder="Or type a custom symptom..."
                value={currentSymptom}
                onChange={(e) => setCurrentSymptom(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="severity">Severity</Label>
                <Select value={currentSeverity} onValueChange={(value: 'mild' | 'moderate' | 'severe') => setCurrentSeverity(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 2 days, 1 week"
                  value={currentDuration}
                  onChange={(e) => setCurrentDuration(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button onClick={addSymptom} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Symptom
          </Button>
        </CardContent>
      </Card>

      {/* Added Symptoms */}
      {symptoms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Symptoms ({symptoms.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {symptoms.map((symptom) => (
                <motion.div
                  key={symptom.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{symptom.symptom}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getSeverityColor(symptom.severity)}>
                        {symptom.severity}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{symptom.duration}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeSymptom(symptom.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <Label htmlFor="notes">Additional Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information that might be helpful..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleAnalyze} 
                disabled={isLoading || symptoms.length === 0}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Symptoms
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      <AnimatePresence>
        {showResults && lastAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className={`border-2 ${
              lastAnalysis.urgencyLevel === 'emergency' ? 'border-red-200 bg-red-50' :
              lastAnalysis.urgencyLevel === 'medium' ? 'border-yellow-200 bg-yellow-50' :
              'border-green-200 bg-green-50'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getUrgencyIcon(lastAnalysis.urgencyLevel)}
                  Analysis Results
                  <Badge className={getSeverityColor(lastAnalysis.urgencyLevel)}>
                    {lastAnalysis.urgencyLevel.toUpperCase()} PRIORITY
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Possible Conditions:</h4>
                  <div className="flex flex-wrap gap-2">
                    {lastAnalysis.possibleConditions.map((condition, index) => (
                      <Badge key={index} variant="outline">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {lastAnalysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {lastAnalysis.followUpRequired && (
                  <div className="p-3 bg-orange-100 border border-orange-200 rounded-lg">
                    <p className="text-sm font-medium text-orange-800">
                      <strong>Follow-up Required:</strong> Based on your symptoms, we recommend consulting with a healthcare provider.
                    </p>
                  </div>
                )}

                {lastAnalysis.urgencyLevel === 'emergency' && (
                  <div className="p-4 bg-red-100 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-2">
                      <strong>⚠️ Seek Immediate Medical Attention</strong>
                    </p>
                    <p className="text-sm text-red-700">
                      Your symptoms may indicate a serious medical condition. Please call emergency services or visit the nearest emergency room.
                    </p>
                    <Button className="w-full mt-3 bg-red-600 hover:bg-red-700">
                      Call Emergency Services
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowResults(false)}>
                    Start New Analysis
                  </Button>
                  <Button variant="outline">
                    Save Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
