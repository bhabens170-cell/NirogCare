import { useState, useEffect, useCallback } from 'react';
import { HealthInsight, SymptomAnalysis, UserProfile } from '@/types/health';

interface SymptomData {
  symptom: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
}

interface HealthCoachResponse {
  type: 'insight' | 'recommendation' | 'warning' | 'emergency';
  message: string;
  actionItems: string[];
  followUpRequired: boolean;
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
}

// Mock medical knowledge base
const MEDICAL_KNOWLEDGE = {
  symptoms: {
    headache: {
      possibleCauses: ['stress', 'dehydration', 'migraine', 'sinus infection', 'high blood pressure'],
      recommendations: ['rest', 'hydrate', 'over-the-counter pain relievers', 'dark room'],
      emergencySigns: ['sudden severe headache', 'headache with fever', 'headache after head injury'],
      urgencyLevel: 'low' as const
    },
    chest_pain: {
      possibleCauses: ['heart attack', 'angina', 'acid reflux', 'anxiety', 'muscle strain'],
      recommendations: ['immediate medical attention', 'call emergency services', 'rest'],
      emergencySigns: ['chest pain with shortness of breath', 'pain radiating to arm/jaw', 'sweating'],
      urgencyLevel: 'emergency' as const
    },
    fever: {
      possibleCauses: ['infection', 'virus', 'bacterial infection', 'inflammation'],
      recommendations: ['rest', 'hydrate', 'monitor temperature', 'consult doctor if high'],
      emergencySigns: ['fever above 103°F', 'fever with rash', 'fever with confusion'],
      urgencyLevel: 'medium' as const
    },
    cough: {
      possibleCauses: ['cold', 'flu', 'allergies', 'asthma', 'bronchitis'],
      recommendations: ['stay hydrated', 'use humidifier', 'rest', 'avoid irritants'],
      emergencySigns: ['cough with blood', 'difficulty breathing', 'cough lasting more than 2 weeks'],
      urgencyLevel: 'low' as const
    },
    fatigue: {
      possibleCauses: ['lack of sleep', 'stress', 'anemia', 'thyroid issues', 'depression'],
      recommendations: ['improve sleep hygiene', 'manage stress', 'balanced diet', 'exercise'],
      emergencySigns: ['extreme fatigue with confusion', 'fatigue with chest pain', 'sudden severe fatigue'],
      urgencyLevel: 'low' as const
    }
  },
  conditions: {
    diabetes: {
      symptoms: ['increased thirst', 'frequent urination', 'extreme hunger', 'unexplained weight loss'],
      recommendations: ['monitor blood sugar', 'balanced diet', 'regular exercise', 'medication adherence'],
      urgencyLevel: 'medium' as const
    },
    hypertension: {
      symptoms: ['often no symptoms', 'headaches', 'shortness of breath', 'nosebleeds'],
      recommendations: ['regular BP monitoring', 'low sodium diet', 'exercise', 'stress management'],
      urgencyLevel: 'medium' as const
    }
  }
};

export function useHealthCoach() {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [lastAnalysis, setLastAnalysis] = useState<SymptomAnalysis | null>(null);

  // Generate personalized health insights based on user profile
  const generateHealthInsights = useCallback(async (profile: UserProfile) => {
    setIsLoading(true);
    
    try {
      const newInsights: HealthInsight[] = [];

      // Age-based recommendations
      const age = calculateAge(profile.personalInfo.dateOfBirth);
      if (age) {
        if (age >= 50) {
          newInsights.push({
            id: Date.now().toString(),
            type: 'recommendation',
            title: 'Health Screening Recommended',
            description: 'Consider regular health screenings including cholesterol, diabetes, and cancer screenings appropriate for your age group.',
            priority: 'medium',
            category: 'preventive',
            timestamp: new Date().toISOString(),
            actionRequired: true,
            actionText: 'Schedule Screening'
          });
        }

        if (age >= 65) {
          newInsights.push({
            id: (Date.now() + 1).toString(),
            type: 'recommendation',
            title: 'Bone Health Check',
            description: 'Regular bone density scans are recommended to monitor osteoporosis risk.',
            priority: 'medium',
            category: 'preventive',
            timestamp: new Date().toISOString(),
            actionRequired: true,
            actionText: 'Learn More'
          });
        }
      }

      // BMI-based recommendations
      const bmi = calculateBMI(profile.personalInfo.weight, profile.personalInfo.height);
      if (bmi) {
        if (bmi.value >= 25) {
          newInsights.push({
            id: (Date.now() + 2).toString(),
            type: 'recommendation',
            title: 'Weight Management',
            description: `Your BMI is ${bmi.value}. Consider incorporating more physical activity and balanced nutrition.`,
            priority: 'medium',
            category: 'lifestyle',
            timestamp: new Date().toISOString(),
            actionRequired: true,
            actionText: 'View Tips'
          });
        }
      }

      // Activity level recommendations
      if (profile.personalInfo.activityLevel === 'sedentary') {
        newInsights.push({
          id: (Date.now() + 3).toString(),
          type: 'recommendation',
          title: 'Increase Physical Activity',
          description: 'Consider adding 30 minutes of moderate exercise most days of the week for better health.',
          priority: 'low',
          category: 'lifestyle',
          timestamp: new Date().toISOString(),
          actionRequired: true,
          actionText: 'Start Exercise Plan'
        });
      }

      // Medication reminders
      if (profile.medicalInfo.medications.length > 0) {
        newInsights.push({
          id: (Date.now() + 4).toString(),
          type: 'recommendation',
          title: 'Medication Adherence',
          description: `You have ${profile.medicalInfo.medications.length} medications. Ensure you take them as prescribed.`,
          priority: 'high',
          category: 'medication',
          timestamp: new Date().toISOString(),
          actionRequired: true,
          actionText: 'Set Reminders'
        });
      }

      // Allergy alerts
      if (profile.medicalInfo.allergies.length > 0) {
        newInsights.push({
          id: (Date.now() + 5).toString(),
          type: 'warning',
          title: 'Allergy Information',
          description: `Remember to inform healthcare providers about your allergies: ${profile.medicalInfo.allergies.join(', ')}`,
          priority: 'high',
          category: 'safety',
          timestamp: new Date().toISOString(),
          actionRequired: false,
          actionText: 'Update Medical ID'
        });
      }

      setInsights(prev => [...newInsights, ...prev].slice(0, 10)); // Keep only latest 10
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analyze symptoms using AI-like logic
  const analyzeSymptoms = useCallback(async (symptoms: SymptomData[]) => {
    setIsLoading(true);

    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const analysis: SymptomAnalysis = {
        id: Date.now().toString(),
        symptoms: symptoms.map(s => s.symptom),
        severity: determineOverallSeverity(symptoms),
        duration: symptoms.map(s => s.duration).join(', '),
        possibleConditions: [],
        recommendations: [],
        urgencyLevel: 'low',
        timestamp: new Date().toISOString(),
        followUpRequired: false
      };

      // Analyze each symptom
      const allPossibleCauses: string[] = [];
      const allRecommendations: string[] = [];
      let maxUrgency: 'low' | 'medium' | 'high' | 'emergency' = 'low';

      for (const symptomData of symptoms) {
        const symptomKey = symptomData.symptom.toLowerCase().replace(/\s+/g, '_');
        const symptomInfo = MEDICAL_KNOWLEDGE.symptoms[symptomKey as keyof typeof MEDICAL_KNOWLEDGE.symptoms];

        if (symptomInfo) {
          allPossibleCauses.push(...symptomInfo.possibleCauses);
          allRecommendations.push(...symptomInfo.recommendations);
          
          // Check for emergency signs
          const hasEmergencySigns = symptomInfo.emergencySigns.some(sign => 
            symptomData.symptom.toLowerCase().includes(sign.toLowerCase())
          );

          if (hasEmergencySigns || symptomData.severity === 'severe') {
            maxUrgency = 'emergency';
          } else if (symptomInfo.urgencyLevel === 'medium' && maxUrgency === 'low') {
            maxUrgency = 'medium';
          }
        }
      }

      // Remove duplicates and set analysis results
      analysis.possibleConditions = [...new Set(allPossibleCauses)];
      analysis.recommendations = [...new Set(allRecommendations)];
      analysis.urgencyLevel = maxUrgency;
      analysis.followUpRequired = maxUrgency !== 'low';

      // Add specific recommendations based on urgency
      if (maxUrgency === 'emergency') {
        analysis.recommendations.unshift('Seek immediate medical attention', 'Call emergency services if symptoms worsen');
      } else if (maxUrgency === 'medium') {
        analysis.recommendations.unshift('Consult a healthcare provider soon', 'Monitor symptoms closely');
      }

      setLastAnalysis(analysis);
      return analysis;
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get health coaching advice
  const getHealthAdvice = useCallback(async (topic: string, userProfile: UserProfile): Promise<HealthCoachResponse> => {
    setIsLoading(true);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1000));

      const topicLower = topic.toLowerCase();

      // Generate contextual advice based on topic and user profile
      if (topicLower.includes('sleep') || topicLower.includes('insomnia')) {
        return {
          type: 'recommendation',
          message: 'Based on your profile, improving sleep quality can significantly impact your overall health. Consider establishing a consistent sleep schedule and creating a relaxing bedtime routine.',
          actionItems: [
            'Go to bed and wake up at the same time daily',
            'Avoid screens 1 hour before bed',
            'Keep your bedroom cool and dark',
            'Avoid caffeine after 2 PM'
          ],
          followUpRequired: false,
          urgencyLevel: 'low'
        };
      }

      if (topicLower.includes('stress') || topicLower.includes('anxiety')) {
        return {
          type: 'recommendation',
          message: 'Stress management is crucial for your wellbeing. Based on your activity level, regular exercise can help reduce stress significantly.',
          actionItems: [
            'Practice deep breathing exercises',
            'Try meditation or mindfulness',
            'Engage in regular physical activity',
            'Consider talking to a mental health professional'
          ],
          followUpRequired: false,
          urgencyLevel: 'medium'
        };
      }

      if (topicLower.includes('diet') || topicLower.includes('nutrition')) {
        return {
          type: 'recommendation',
          message: 'A balanced diet is key to maintaining good health. Based on your profile, focus on whole foods and adequate hydration.',
          actionItems: [
            'Eat at least 5 servings of fruits and vegetables daily',
            'Choose whole grains over refined grains',
            'Include lean proteins in your meals',
            'Drink at least 8 glasses of water daily'
          ],
          followUpRequired: false,
          urgencyLevel: 'low'
        };
      }

      // Default response
      return {
        type: 'recommendation',
        message: 'I\'m here to help with your health questions. Please be more specific about what health topic you\'d like advice on.',
        actionItems: [
          'Ask about specific symptoms',
          'Inquire about lifestyle changes',
          'Request preventive health tips',
          'Get medication management advice'
        ],
        followUpRequired: false,
        urgencyLevel: 'low'
      };
    } catch (error) {
      console.error('Error getting health advice:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper functions
  const calculateAge = (dateOfBirth: string): number | null => {
    if (!dateOfBirth) return null;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = (weight: number, height: number): { value: number; category: string } | null => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const category = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese';
    return { value: Math.round(bmi * 10) / 10, category };
  };

  const determineOverallSeverity = (symptoms: SymptomData[]): 'mild' | 'moderate' | 'severe' => {
    if (symptoms.some(s => s.severity === 'severe')) return 'severe';
    if (symptoms.some(s => s.severity === 'moderate')) return 'moderate';
    return 'mild';
  };

  return {
    isLoading,
    insights,
    lastAnalysis,
    generateHealthInsights,
    analyzeSymptoms,
    getHealthAdvice
  };
}
