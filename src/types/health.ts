export type CategoryType = 'male' | 'female' | 'baby' | 'mental';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface MedicalStore {
  id: number;
  name: string;
  distance: string;
  address: string;
  phone: string;
  rating: number;
  openNow: boolean;
  lat: number;
  lng: number;
}

export interface HealthService {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tips: string[];
  schemes: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  duration: string;
  purpose: string;
  reminders: string[];
  sideEffects?: string[];
  interactions?: string[];
}

export interface PrescriptionData {
  id: string;
  medications: Medication[];
  doctorName: string;
  date: string;
  instructions: string;
  pharmacy?: string;
  refills?: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot' | 'system';
  text: string;
  time: string;
  attachments?: string[];
}

export interface HealthTip {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  icon: string;
  category: CategoryType;
  readTime?: number;
}

export interface GovtScheme {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  benefits: string[];
  eligibility: string;
  deadline?: string;
}

export interface Reminder {
  id: string;
  medicine: string;
  time: string;
  frequency: string;
  active: boolean;
  type: 'medication' | 'appointment' | 'exercise' | 'water' | 'custom';
}

// Enhanced User Profile
export interface UserProfile {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: Gender;
    bloodType: BloodType;
    height: number; // in cm
    weight: number; // in kg
    activityLevel: ActivityLevel;
  };
  medicalInfo: {
    allergies: string[];
    conditions: string[];
    medications: Medication[];
    emergencyContacts: EmergencyContact[];
    primaryDoctor?: Doctor;
    insurance?: Insurance;
  };
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    notifications: NotificationSettings;
    privacy: PrivacySettings;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email?: string;
  hospital?: string;
  address?: string;
}

export interface Insurance {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  coverage: string[];
  expiryDate?: string;
}

export interface NotificationSettings {
  medications: boolean;
  appointments: boolean;
  healthTips: boolean;
  emergency: boolean;
  achievements: boolean;
  familyUpdates: boolean;
}

export interface PrivacySettings {
  shareData: boolean;
  analytics: boolean;
  locationSharing: boolean;
  familyAccess: boolean;
}

// Health Metrics
export interface HealthMetrics {
  id: string;
  userId: string;
  timestamp: string;
  type: 'blood_pressure' | 'glucose' | 'heart_rate' | 'weight' | 'temperature' | 'oxygen_saturation';
  value: number | { systolic: number; diastolic: number };
  unit: string;
  notes?: string;
  device?: string;
}

export interface BloodPressureReading {
  systolic: number;
  diastolic: number;
  pulse?: number;
  timestamp: string;
  notes?: string;
}

export interface GlucoseReading {
  value: number;
  unit: 'mg/dL' | 'mmol/L';
  type: 'fasting' | 'post_meal' | 'random';
  timestamp: string;
  notes?: string;
}

export interface WeightEntry {
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  timestamp: string;
  notes?: string;
}

// Achievements and Gamification
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  points: number;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface HealthGoal {
  id: string;
  title: string;
  description: string;
  type: 'steps' | 'water' | 'weight' | 'medication' | 'exercise' | 'custom';
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  isActive: boolean;
  createdAt: string;
}

// Family Health
export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  gender: Gender;
  bloodType?: BloodType;
  allergies: string[];
  conditions: string[];
  medications: Medication[];
  permissions: {
    viewHealth: boolean;
    manageReminders: boolean;
    emergencyContact: boolean;
  };
}

// AI Health Coach
export interface HealthInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'achievement' | 'trend';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  timestamp: string;
  actionRequired?: boolean;
  actionText?: string;
}

export interface SymptomAnalysis {
  id: string;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  possibleConditions: string[];
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  timestamp: string;
  followUpRequired: boolean;
}

// Wearable Integration
export interface WearableDevice {
  id: string;
  name: string;
  type: 'fitness_tracker' | 'smartwatch' | 'glucose_monitor' | 'blood_pressure_monitor';
  brand: string;
  model: string;
  isConnected: boolean;
  lastSync?: string;
  supportedMetrics: string[];
  batteryLevel?: number;
}

export interface DeviceData {
  deviceId: string;
  timestamp: string;
  metrics: {
    steps?: number;
    heartRate?: number;
    sleep?: SleepData;
    calories?: number;
    distance?: number;
    activeMinutes?: number;
  };
}

export interface SleepData {
  duration: number; // in minutes
  quality: number; // 1-100
  stages: {
    deep: number;
    light: number;
    rem: number;
    awake: number;
  };
  efficiency: number;
}

// Voice Commands
export interface VoiceCommand {
  id: string;
  phrase: string;
  action: string;
  parameters?: Record<string, any>;
  confidence: number;
  timestamp: string;
}

// Emergency Features
export interface MedicalID {
  userId: string;
  name: string;
  dateOfBirth: string;
  bloodType: BloodType;
  allergies: string[];
  conditions: string[];
  medications: Medication[];
  emergencyContacts: EmergencyContact[];
  organDonor: boolean;
  notes?: string;
}

export interface EmergencyAlert {
  id: string;
  type: 'fall_detection' | 'medication_missed' | 'health_crisis' | 'manual';
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  message: string;
  contactsNotified: string[];
  resolvedAt?: string;
}
