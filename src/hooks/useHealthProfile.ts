import { useState, useEffect, useCallback } from 'react';
import { UserProfile, HealthMetrics, Achievement, HealthGoal } from '@/types/health';

const STORAGE_KEY = 'nirogcare_profile';

export function useHealthProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(STORAGE_KEY);
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save profile to localStorage whenever it changes
  const saveProfile = useCallback((updatedProfile: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    } catch (err) {
      setError('Failed to save profile');
    }
  }, []);

  // Update personal information
  const updatePersonalInfo = useCallback((personalInfo: Partial<UserProfile['personalInfo']>) => {
    if (!profile) return;
    
    const updatedProfile = {
      ...profile,
      personalInfo: { ...profile.personalInfo, ...personalInfo },
      updatedAt: new Date().toISOString()
    };
    saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  // Update medical information
  const updateMedicalInfo = useCallback((medicalInfo: Partial<UserProfile['medicalInfo']>) => {
    if (!profile) return;
    
    const updatedProfile = {
      ...profile,
      medicalInfo: { ...profile.medicalInfo, ...medicalInfo },
      updatedAt: new Date().toISOString()
    };
    saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  // Update preferences
  const updatePreferences = useCallback((preferences: Partial<UserProfile['preferences']>) => {
    if (!profile) return;
    
    const updatedProfile = {
      ...profile,
      preferences: { ...profile.preferences, ...preferences },
      updatedAt: new Date().toISOString()
    };
    saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  // Add emergency contact
  const addEmergencyContact = useCallback((contact: Omit<UserProfile['medicalInfo']['emergencyContacts'][0], 'id'>) => {
    if (!profile) return;
    
    const newContact = {
      ...contact,
      id: Date.now().toString()
    };
    
    const updatedProfile = {
      ...profile,
      medicalInfo: {
        ...profile.medicalInfo,
        emergencyContacts: [...profile.medicalInfo.emergencyContacts, newContact]
      },
      updatedAt: new Date().toISOString()
    };
    saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  // Remove emergency contact
  const removeEmergencyContact = useCallback((contactId: string) => {
    if (!profile) return;
    
    const updatedProfile = {
      ...profile,
      medicalInfo: {
        ...profile.medicalInfo,
        emergencyContacts: profile.medicalInfo.emergencyContacts.filter(c => c.id !== contactId)
      },
      updatedAt: new Date().toISOString()
    };
    saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  // Calculate BMI
  const calculateBMI = useCallback(() => {
    if (!profile?.personalInfo.height || !profile?.personalInfo.weight) return null;
    
    const heightInMeters = profile.personalInfo.height / 100;
    const bmi = profile.personalInfo.weight / (heightInMeters * heightInMeters);
    return {
      value: Math.round(bmi * 10) / 10,
      category: bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
    };
  }, [profile]);

  // Calculate age
  const calculateAge = useCallback(() => {
    if (!profile?.personalInfo.dateOfBirth) return null;
    
    const birthDate = new Date(profile.personalInfo.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }, [profile]);

  return {
    profile,
    loading,
    error,
    updatePersonalInfo,
    updateMedicalInfo,
    updatePreferences,
    addEmergencyContact,
    removeEmergencyContact,
    calculateBMI,
    calculateAge,
    saveProfile
  };
}
