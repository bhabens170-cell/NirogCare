import { useState, useEffect, useCallback } from 'react';
import { FamilyMember } from '@/types/health';

interface FamilyHealthData {
  member: FamilyMember;
  recentActivity: {
    type: string;
    timestamp: string;
    description: string;
  }[];
  healthMetrics: {
    lastCheckup?: string;
    upcomingAppointments?: string[];
    medicationsCount: number;
    allergiesCount: number;
    conditionsCount: number;
  };
  emergencyInfo: {
    bloodType?: string;
    primaryContact: string;
    emergencyContacts: string[];
  };
}

export function useFamilyHealth() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [familyHealthData, setFamilyHealthData] = useState<Map<string, FamilyHealthData>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedMembers = localStorage.getItem('nirogcare_family_members');
      const savedHealthData = localStorage.getItem('nirogcare_family_health_data');
      
      if (savedMembers) {
        setFamilyMembers(JSON.parse(savedMembers));
      }
      if (savedHealthData) {
        const dataMap = new Map(JSON.parse(savedHealthData)) as Map<string, FamilyHealthData>;
        setFamilyHealthData(dataMap);
      }
    } catch (error) {
      console.error('Error loading family health data:', error);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('nirogcare_family_members', JSON.stringify(familyMembers));
      localStorage.setItem('nirogcare_family_health_data', JSON.stringify(Array.from(familyHealthData.entries())));
    } catch (error) {
      console.error('Error saving family health data:', error);
    }
  }, [familyMembers, familyHealthData]);

  // Add family member
  const addFamilyMember = useCallback((member: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: Date.now().toString()
    };
    
    setFamilyMembers(prev => [...prev, newMember]);
    
    // Initialize health data for new member
    const healthData: FamilyHealthData = {
      member: newMember,
      recentActivity: [],
      healthMetrics: {
        medicationsCount: member.medications.length,
        allergiesCount: member.allergies.length,
        conditionsCount: member.conditions.length
      },
      emergencyInfo: {
        bloodType: member.bloodType,
        primaryContact: member.name,
        emergencyContacts: []
      }
    };
    
    setFamilyHealthData(prev => new Map(prev).set(newMember.id, healthData));
    
    return newMember;
  }, []);

  // Update family member
  const updateFamilyMember = useCallback((memberId: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, ...updates } : member
    ));
    
    // Update health data
    setFamilyHealthData(prev => {
      const newData = new Map(prev);
      const healthData = newData.get(memberId);
      if (healthData) {
        healthData.member = { ...healthData.member, ...updates };
        newData.set(memberId, healthData);
      }
      return newData;
    });
  }, []);

  // Remove family member
  const removeFamilyMember = useCallback((memberId: string) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== memberId));
    setFamilyHealthData(prev => {
      const newData = new Map(prev);
      newData.delete(memberId);
      return newData;
    });
  }, []);

  // Add activity log for family member
  const addActivity = useCallback((memberId: string, activity: {
    type: string;
    description: string;
  }) => {
    setFamilyHealthData(prev => {
      const newData = new Map(prev);
      const healthData = newData.get(memberId);
      if (healthData) {
        const newActivity = {
          ...activity,
          timestamp: new Date().toISOString()
        };
        healthData.recentActivity = [newActivity, ...healthData.recentActivity].slice(0, 10);
        newData.set(memberId, healthData);
      }
      return newData;
    });
  }, []);

  // Get family member health data
  const getMemberHealthData = useCallback((memberId: string) => {
    return familyHealthData.get(memberId);
  }, [familyHealthData]);

  // Get all family health data
  const getAllFamilyHealthData = useCallback(() => {
    return Array.from(familyHealthData.values());
  }, [familyHealthData]);

  // Get family health summary
  const getFamilyHealthSummary = useCallback(() => {
    const summary = {
      totalMembers: familyMembers.length,
      membersWithAllergies: 0,
      membersWithConditions: 0,
      membersOnMedications: 0,
      upcomingAppointments: 0,
      recentActivities: 0
    };

    familyHealthData.forEach(data => {
      if (data.healthMetrics.allergiesCount > 0) summary.membersWithAllergies++;
      if (data.healthMetrics.conditionsCount > 0) summary.membersWithConditions++;
      if (data.healthMetrics.medicationsCount > 0) summary.membersOnMedications++;
      if (data.healthMetrics.upcomingAppointments) {
        summary.upcomingAppointments += data.healthMetrics.upcomingAppointments.length;
      }
      summary.recentActivities += data.recentActivity.length;
    });

    return summary;
  }, [familyMembers, familyHealthData]);

  // Get emergency contacts for all family members
  const getAllEmergencyContacts = useCallback(() => {
    const contacts: Array<{
      memberName: string;
      relationship: string;
      phone: string;
      isPrimary: boolean;
    }> = [];

    // For now, return empty array since FamilyMember doesn't have emergencyContacts
    // In a real implementation, this would come from the main user's emergency contacts
    return contacts;
  }, [familyMembers]);

  // Get medication reminders for family
  const getFamilyMedicationReminders = useCallback(() => {
    const reminders: Array<{
      memberName: string;
      medication: string;
      dosage: string;
      time: string;
      frequency: string;
    }> = [];

    familyMembers.forEach(member => {
      if (member.permissions.manageReminders) {
        member.medications.forEach(medication => {
          medication.reminders.forEach(time => {
            reminders.push({
              memberName: member.name,
              medication: medication.name,
              dosage: medication.dosage,
              time,
              frequency: medication.duration
            });
          });
        });
      }
    });

    return reminders.sort((a, b) => a.time.localeCompare(b.time));
  }, [familyMembers]);

  // Check for health alerts
  const getHealthAlerts = useCallback(() => {
    const alerts: Array<{
      type: 'medication' | 'appointment' | 'health_metric' | 'emergency';
      memberId: string;
      memberName: string;
      message: string;
      priority: 'low' | 'medium' | 'high';
      timestamp: string;
    }> = [];

    familyHealthData.forEach((data, memberId) => {
      // Check for missed medications (mock logic)
      const today = new Date().toDateString();
      data.recentActivity
        .filter(activity => activity.type === 'medication' && !activity.timestamp.startsWith(today))
        .forEach(() => {
          alerts.push({
            type: 'medication',
            memberId,
            memberName: data.member.name,
            message: `Medication reminder for ${data.member.name}`,
            priority: 'medium',
            timestamp: new Date().toISOString()
          });
        });

      // Check for upcoming appointments
      if (data.healthMetrics.upcomingAppointments) {
        data.healthMetrics.upcomingAppointments.forEach(appointment => {
          const appointmentDate = new Date(appointment);
          const today = new Date();
          const daysUntil = Math.ceil((appointmentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysUntil <= 3 && daysUntil >= 0) {
            alerts.push({
              type: 'appointment',
              memberId,
              memberName: data.member.name,
              message: `Appointment for ${data.member.name} in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
              priority: daysUntil <= 1 ? 'high' : 'medium',
              timestamp: new Date().toISOString()
            });
          }
        });
      }

      // Check for critical allergies or conditions
      if (data.member.allergies.some(allergy => 
        allergy.toLowerCase().includes('peanut') || 
        allergy.toLowerCase().includes('shellfish') ||
        allergy.toLowerCase().includes('bee')
      )) {
        alerts.push({
          type: 'emergency',
          memberId,
          memberName: data.member.name,
          message: `${data.member.name} has severe allergies that require immediate attention`,
          priority: 'high',
          timestamp: new Date().toISOString()
        });
      }
    });

    return alerts.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [familyHealthData]);

  // Export family health data
  const exportFamilyHealthData = useCallback(() => {
    const exportData = {
      familyMembers,
      familyHealthData: Array.from(familyHealthData.entries()),
      exportDate: new Date().toISOString(),
      summary: getFamilyHealthSummary()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `family-health-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [familyMembers, familyHealthData, getFamilyHealthSummary]);

  // Generate family health report
  const generateHealthReport = useCallback(() => {
    const summary = getFamilyHealthSummary();
    const healthData = getAllFamilyHealthData();
    
    const report = {
      summary,
      members: healthData.map(data => ({
        name: data.member.name,
        relationship: data.member.relationship,
        age: calculateAge(data.member.dateOfBirth),
        bloodType: data.member.bloodType,
        healthOverview: {
          allergies: data.member.allergies,
          conditions: data.member.conditions,
          medications: data.member.medications.length
        },
        recentActivity: data.recentActivity.slice(0, 5)
        // emergencyContacts would be added here if FamilyMember had this property
      })),
      generatedAt: new Date().toISOString()
    };

    return report;
  }, [getFamilyHealthSummary, getAllFamilyHealthData]);

  // Helper function to calculate age
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

  return {
    familyMembers,
    familyHealthData,
    isLoading,
    error,
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
    addActivity,
    getMemberHealthData,
    getAllFamilyHealthData,
    getFamilyHealthSummary,
    getAllEmergencyContacts,
    getFamilyMedicationReminders,
    getHealthAlerts,
    exportFamilyHealthData,
    generateHealthReport
  };
}
