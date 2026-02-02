import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, User, Heart, Activity, Shield, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { UserProfile, Gender, BloodType, ActivityLevel } from '@/types/health';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Let us know some basic information about you',
    icon: <User className="w-6 h-6" />
  },
  {
    id: 'medical',
    title: 'Medical Information',
    description: 'Help us understand your health background',
    icon: <Heart className="w-6 h-6" />
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle & Activity',
    description: 'Tell us about your daily activities',
    icon: <Activity className="w-6 h-6" />
  },
  {
    id: 'emergency',
    title: 'Emergency Contacts',
    description: 'Who should we contact in case of emergency?',
    icon: <Shield className="w-6 h-6" />
  }
];

export default function UserOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const { saveProfile } = useHealthProfile();

  // Form state
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'other',
      bloodType: 'O+',
      height: 170,
      weight: 70,
      activityLevel: 'moderate'
    },
    medicalInfo: {
      allergies: [],
      conditions: [],
      medications: [],
      emergencyContacts: []
    },
    preferences: {
      language: 'en',
      theme: 'auto',
      notifications: {
        medications: true,
        appointments: true,
        healthTips: true,
        emergency: true,
        achievements: true,
        familyUpdates: false
      },
      privacy: {
        shareData: false,
        analytics: true,
        locationSharing: true,
        familyAccess: false
      }
    }
  });

  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    isPrimary: true
  });

  const updateFormData = (section: keyof UserProfile, field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev };
      if (section === 'personalInfo') {
        updated.personalInfo = { ...prev.personalInfo, [field]: value };
      } else if (section === 'medicalInfo') {
        updated.medicalInfo = { ...prev.medicalInfo, [field]: value };
      } else if (section === 'preferences') {
        updated.preferences = { ...prev.preferences, [field]: value };
      }
      return updated;
    });
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    const completeProfile: UserProfile = {
      id: Date.now().toString(),
      personalInfo: formData.personalInfo as UserProfile['personalInfo'],
      medicalInfo: formData.medicalInfo as UserProfile['medicalInfo'],
      preferences: formData.preferences as UserProfile['preferences'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveProfile(completeProfile);
    setIsCompleted(true);
  };

  const addEmergencyContact = () => {
    if (emergencyContact.name && emergencyContact.phone) {
      const contacts = [...(formData.medicalInfo?.emergencyContacts || []), {
        ...emergencyContact,
        id: Date.now().toString()
      }];
      updateFormData('medicalInfo', 'emergencyContacts', contacts);
      
      // Reset form
      setEmergencyContact({
        name: '',
        relationship: '',
        phone: '',
        email: '',
        isPrimary: false
      });
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Welcome to NirogCare!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your profile has been set up successfully. You're all ready to start your health journey with us.
          </p>
          <Button size="lg" className="w-full">
            Get Started
          </Button>
        </motion.div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (onboardingSteps[currentStep].id) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.personalInfo?.firstName || ''}
                  onChange={(e) => updateFormData('personalInfo', 'firstName', e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.personalInfo?.lastName || ''}
                  onChange={(e) => updateFormData('personalInfo', 'lastName', e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.personalInfo?.email || ''}
                onChange={(e) => updateFormData('personalInfo', 'email', e.target.value)}
                placeholder="john.doe@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.personalInfo?.phone || ''}
                onChange={(e) => updateFormData('personalInfo', 'phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.personalInfo?.dateOfBirth || ''}
                onChange={(e) => updateFormData('personalInfo', 'dateOfBirth', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.personalInfo?.gender || 'other'} onValueChange={(value: Gender) => updateFormData('personalInfo', 'gender', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select value={formData.personalInfo?.bloodType || 'O+'} onValueChange={(value: BloodType) => updateFormData('personalInfo', 'bloodType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.personalInfo?.height || ''}
                  onChange={(e) => updateFormData('personalInfo', 'height', parseInt(e.target.value))}
                  placeholder="170"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.personalInfo?.weight || ''}
                  onChange={(e) => updateFormData('personalInfo', 'weight', parseInt(e.target.value))}
                  placeholder="70"
                />
              </div>
            </div>
          </div>
        );

      case 'medical':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="allergies">Allergies (comma separated)</Label>
              <Input
                id="allergies"
                value={formData.medicalInfo?.allergies?.join(', ') || ''}
                onChange={(e) => updateFormData('medicalInfo', 'allergies', e.target.value.split(',').map(a => a.trim()).filter(Boolean))}
                placeholder="Peanuts, Shellfish, Pollen"
              />
            </div>

            <div>
              <Label htmlFor="conditions">Medical Conditions (comma separated)</Label>
              <Input
                id="conditions"
                value={formData.medicalInfo?.conditions?.join(', ') || ''}
                onChange={(e) => updateFormData('medicalInfo', 'conditions', e.target.value.split(',').map(c => c.trim()).filter(Boolean))}
                placeholder="Diabetes, Hypertension, Asthma"
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Medical Information Privacy</h4>
              <p className="text-sm text-blue-700">
                Your medical information is stored securely and privately. You can choose what to share and with whom in your privacy settings.
              </p>
            </div>
          </div>
        );

      case 'lifestyle':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Select value={formData.personalInfo?.activityLevel || 'moderate'} onValueChange={(value: ActivityLevel) => updateFormData('personalInfo', 'activityLevel', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                  <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                  <SelectItem value="very_active">Very Active (twice per day)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Notification Preferences</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="med-notifications"
                    checked={formData.preferences?.notifications?.medications || false}
                    onCheckedChange={(checked) => {
                      const currentNotifications = formData.preferences?.notifications || {
                        medications: false,
                        appointments: false,
                        healthTips: false,
                        emergency: false,
                        achievements: false,
                        familyUpdates: false
                      };
                      updateFormData('preferences', 'notifications', { ...currentNotifications, medications: checked });
                    }}
                  />
                  <Label htmlFor="med-notifications">Medication reminders</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="health-tips"
                    checked={formData.preferences?.notifications?.healthTips || false}
                    onCheckedChange={(checked) => {
                      const currentNotifications = formData.preferences?.notifications || {
                        medications: false,
                        appointments: false,
                        healthTips: false,
                        emergency: false,
                        achievements: false,
                        familyUpdates: false
                      };
                      updateFormData('preferences', 'notifications', { ...currentNotifications, healthTips: checked });
                    }}
                  />
                  <Label htmlFor="health-tips">Health tips and insights</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="emergency-alerts"
                    checked={formData.preferences?.notifications?.emergency || false}
                    onCheckedChange={(checked) => {
                      const currentNotifications = formData.preferences?.notifications || {
                        medications: false,
                        appointments: false,
                        healthTips: false,
                        emergency: false,
                        achievements: false,
                        familyUpdates: false
                      };
                      updateFormData('preferences', 'notifications', { ...currentNotifications, emergency: checked });
                    }}
                  />
                  <Label htmlFor="emergency-alerts">Emergency alerts</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'emergency':
        return (
          <div className="space-y-4">
            <div>
              <Label>Emergency Contact</Label>
              <div className="space-y-3 mt-2">
                <Input
                  placeholder="Contact Name"
                  value={emergencyContact.name}
                  onChange={(e) => setEmergencyContact(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Relationship (e.g., Spouse, Parent)"
                  value={emergencyContact.relationship}
                  onChange={(e) => setEmergencyContact(prev => ({ ...prev, relationship: e.target.value }))}
                />
                <Input
                  placeholder="Phone Number"
                  type="tel"
                  value={emergencyContact.phone}
                  onChange={(e) => setEmergencyContact(prev => ({ ...prev, phone: e.target.value }))}
                />
                <Input
                  placeholder="Email (optional)"
                  type="email"
                  value={emergencyContact.email}
                  onChange={(e) => setEmergencyContact(prev => ({ ...prev, email: e.target.value }))}
                />
                <Button onClick={addEmergencyContact} className="w-full">
                  Add Emergency Contact
                </Button>
              </div>
            </div>

            {formData.medicalInfo?.emergencyContacts && formData.medicalInfo.emergencyContacts.length > 0 && (
              <div>
                <Label>Added Contacts</Label>
                <div className="space-y-2 mt-2">
                  {formData.medicalInfo.emergencyContacts.map((contact) => (
                    <div key={contact.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-muted-foreground">{contact.relationship}</div>
                      <div className="text-sm">{contact.phone}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {onboardingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                {index < onboardingSteps.length - 1 && (
                  <div className={`w-full h-1 mx-2 ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-medium text-muted-foreground">
              Step {currentStep + 1} of {onboardingSteps.length}
            </h2>
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {onboardingSteps[currentStep].icon}
                </div>
                <CardTitle className="text-2xl">{onboardingSteps[currentStep].title}</CardTitle>
                <p className="text-muted-foreground">{onboardingSteps[currentStep].description}</p>
              </CardHeader>
              <CardContent>
                {renderStepContent()}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            {currentStep === onboardingSteps.length - 1 ? 'Complete' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
