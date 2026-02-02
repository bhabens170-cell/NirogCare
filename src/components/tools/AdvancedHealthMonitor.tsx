import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Droplets, Weight, Thermometer, Wind, Plus, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHealthMetrics } from '@/hooks/useHealthMetrics';
import { BloodPressureReading, GlucoseReading, WeightEntry } from '@/types/health';

interface MetricCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  unit: string;
  color: string;
  normalRange: string;
  component: React.ReactNode;
}

export default function AdvancedHealthMonitor() {
  const { 
    addBloodPressure, 
    addGlucoseReading, 
    addWeightEntry, 
    getLatestReadings,
    getBloodPressureTrend,
    getGlucoseTrend,
    getWeightTrend 
  } = useHealthMetrics();

  const latestReadings = getLatestReadings();
  const [activeTab, setActiveTab] = useState('bp');

  // Blood pressure form state
  const [bpForm, setBpForm] = useState<Omit<BloodPressureReading, 'timestamp'>>({
    systolic: 120,
    diastolic: 80,
    pulse: 72,
    notes: ''
  });

  // Glucose form state
  const [glucoseForm, setGlucoseForm] = useState<Omit<GlucoseReading, 'timestamp'>>({
    value: 100,
    unit: 'mg/dL',
    type: 'fasting',
    notes: ''
  });

  // Weight form state
  const [weightForm, setWeightForm] = useState<Omit<WeightEntry, 'timestamp'>>({
    weight: 70,
    bodyFat: undefined,
    muscleMass: undefined,
    notes: ''
  });

  const handleBloodPressureSubmit = () => {
    addBloodPressure(bpForm);
    setBpForm({ systolic: 120, diastolic: 80, pulse: 72, notes: '' });
  };

  const handleGlucoseSubmit = () => {
    addGlucoseReading(glucoseForm);
    setGlucoseForm({ value: 100, unit: 'mg/dL', type: 'fasting', notes: '' });
  };

  const handleWeightSubmit = () => {
    addWeightEntry(weightForm);
    setWeightForm({ weight: 70, bodyFat: undefined, muscleMass: undefined, notes: '' });
  };

  const getBPCategory = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return { category: 'Normal', color: 'text-green-600' };
    if (systolic < 130 && diastolic < 80) return { category: 'Elevated', color: 'text-yellow-600' };
    if (systolic < 140 || diastolic < 90) return { category: 'High Stage 1', color: 'text-orange-600' };
    return { category: 'High Stage 2', color: 'text-red-600' };
  };

  const getGlucoseCategory = (value: number, type: string) => {
    if (type === 'fasting') {
      if (value < 100) return { category: 'Normal', color: 'text-green-600' };
      if (value < 126) return { category: 'Prediabetes', color: 'text-yellow-600' };
      return { category: 'Diabetes', color: 'text-red-600' };
    } else {
      if (value < 140) return { category: 'Normal', color: 'text-green-600' };
      if (value < 200) return { category: 'Prediabetes', color: 'text-yellow-600' };
      return { category: 'Diabetes', color: 'text-red-600' };
    }
  };

  const metricCards: MetricCard[] = [
    {
      id: 'bp',
      title: 'Blood Pressure',
      icon: <Heart className="w-5 h-5" />,
      unit: 'mmHg',
      color: 'text-red-600',
      normalRange: '120/80 mmHg',
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="systolic">Systolic</Label>
              <Input
                id="systolic"
                type="number"
                value={bpForm.systolic}
                onChange={(e) => setBpForm(prev => ({ ...prev, systolic: parseInt(e.target.value) || 0 }))}
                placeholder="120"
              />
            </div>
            <div>
              <Label htmlFor="diastolic">Diastolic</Label>
              <Input
                id="diastolic"
                type="number"
                value={bpForm.diastolic}
                onChange={(e) => setBpForm(prev => ({ ...prev, diastolic: parseInt(e.target.value) || 0 }))}
                placeholder="80"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="pulse">Pulse (optional)</Label>
            <Input
              id="pulse"
              type="number"
              value={bpForm.pulse}
              onChange={(e) => setBpForm(prev => ({ ...prev, pulse: parseInt(e.target.value) || 0 }))}
              placeholder="72"
            />
          </div>
          <div>
            <Label htmlFor="bp-notes">Notes</Label>
            <Input
              id="bp-notes"
              value={bpForm.notes}
              onChange={(e) => setBpForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="After morning walk..."
            />
          </div>
          <Button onClick={handleBloodPressureSubmit} className="w-full">
            Record Blood Pressure
          </Button>
        </div>
      )
    },
    {
      id: 'glucose',
      title: 'Blood Glucose',
      icon: <Droplets className="w-5 h-5" />,
      unit: 'mg/dL',
      color: 'text-blue-600',
      normalRange: '70-100 mg/dL (fasting)',
      component: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="glucose-value">Glucose Level</Label>
            <Input
              id="glucose-value"
              type="number"
              value={glucoseForm.value}
              onChange={(e) => setGlucoseForm(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
              placeholder="100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="glucose-unit">Unit</Label>
              <Select value={glucoseForm.unit} onValueChange={(value: 'mg/dL' | 'mmol/L') => setGlucoseForm(prev => ({ ...prev, unit: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mg/dL">mg/dL</SelectItem>
                  <SelectItem value="mmol/L">mmol/L</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="glucose-type">Type</Label>
              <Select value={glucoseForm.type} onValueChange={(value: 'fasting' | 'post_meal' | 'random') => setGlucoseForm(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fasting">Fasting</SelectItem>
                  <SelectItem value="post_meal">Post Meal</SelectItem>
                  <SelectItem value="random">Random</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="glucose-notes">Notes</Label>
            <Input
              id="glucose-notes"
              value={glucoseForm.notes}
              onChange={(e) => setGlucoseForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Before breakfast..."
            />
          </div>
          <Button onClick={handleGlucoseSubmit} className="w-full">
            Record Glucose Level
          </Button>
        </div>
      )
    },
    {
      id: 'weight',
      title: 'Weight & Body Composition',
      icon: <Weight className="w-5 h-5" />,
      unit: 'kg',
      color: 'text-purple-600',
      normalRange: 'Varies by height',
      component: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="weight-value">Weight (kg)</Label>
            <Input
              id="weight-value"
              type="number"
              step="0.1"
              value={weightForm.weight}
              onChange={(e) => setWeightForm(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
              placeholder="70.0"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="body-fat">Body Fat % (optional)</Label>
              <Input
                id="body-fat"
                type="number"
                step="0.1"
                value={weightForm.bodyFat || ''}
                onChange={(e) => setWeightForm(prev => ({ ...prev, bodyFat: parseFloat(e.target.value) || undefined }))}
                placeholder="20.0"
              />
            </div>
            <div>
              <Label htmlFor="muscle-mass">Muscle Mass kg (optional)</Label>
              <Input
                id="muscle-mass"
                type="number"
                step="0.1"
                value={weightForm.muscleMass || ''}
                onChange={(e) => setWeightForm(prev => ({ ...prev, muscleMass: parseFloat(e.target.value) || undefined }))}
                placeholder="50.0"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="weight-notes">Notes</Label>
            <Input
              id="weight-notes"
              value={weightForm.notes}
              onChange={(e) => setWeightForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Morning weight..."
            />
          </div>
          <Button onClick={handleWeightSubmit} className="w-full">
            Record Weight
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metricCards.map((card) => {
          const latestReading = latestReadings[card.id];
          const bpCategory = card.id === 'bp' && latestReading ? 
            getBPCategory(
              (latestReading.value as { systolic: number; diastolic: number }).systolic,
              (latestReading.value as { systolic: number; diastolic: number }).diastolic
            ) : null;
          
          const glucoseCategory = card.id === 'glucose' && latestReading ?
            getGlucoseCategory(
              latestReading.value as number,
              latestReading.notes?.includes('fasting') ? 'fasting' : 'post_meal'
            ) : null;

          return (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => setActiveTab(card.id)}
            >
              <Card className={`h-full ${activeTab === card.id ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg bg-muted ${card.color}`}>
                      {card.icon}
                    </div>
                    <span className="text-xs text-muted-foreground">{card.normalRange}</span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{card.title}</h3>
                  {latestReading ? (
                    <div>
                      <div className="text-2xl font-bold">
                        {card.id === 'bp' ? 
                          `${(latestReading.value as { systolic: number; diastolic: number }).systolic}/${(latestReading.value as { systolic: number; diastolic: number }).diastolic}` :
                          `${latestReading.value} ${card.unit}`
                        }
                      </div>
                      <div className={`text-xs ${bpCategory?.color || glucoseCategory?.color || 'text-muted-foreground'}`}>
                        {bpCategory?.category || glucoseCategory?.category || 'Normal'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(latestReading.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      <div className="text-lg font-light">--</div>
                      <div className="text-xs">No data yet</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Input Forms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Health Metrics Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              {metricCards.map((card) => (
                <TabsTrigger key={card.id} value={card.id} className="flex items-center gap-2">
                  {card.icon}
                  <span className="hidden sm:inline">{card.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {metricCards.map((card) => (
              <TabsContent key={card.id} value={card.id} className="mt-6">
                {card.component}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center text-muted-foreground">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Your health trends will appear here as you record more measurements</p>
              <p className="text-sm">Track consistently to see patterns and insights</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
