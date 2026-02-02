import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, AlertCircle, Download, Share2, Edit, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import type { MedicalID } from '@/types/health';

export default function MedicalID() {
  const { profile } = useHealthProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [organDonor, setOrganDonor] = useState(false);
  const [notes, setNotes] = useState('');

  // Generate Medical ID from profile
  const medicalID: MedicalID = {
    userId: profile?.id || '',
    name: `${profile?.personalInfo?.firstName || ''} ${profile?.personalInfo?.lastName || ''}`.trim(),
    dateOfBirth: profile?.personalInfo?.dateOfBirth || '',
    bloodType: profile?.personalInfo?.bloodType || 'O+',
    allergies: profile?.medicalInfo?.allergies || [],
    conditions: profile?.medicalInfo?.conditions || [],
    medications: profile?.medicalInfo?.medications || [],
    emergencyContacts: profile?.medicalInfo?.emergencyContacts || [],
    organDonor: organDonor,
    notes: notes
  };

  const calculateAge = (dateOfBirth: string) => {
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

  const downloadMedicalID = () => {
    const dataStr = JSON.stringify(medicalID, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `medical-id-${medicalID.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const shareMedicalID = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Medical ID',
          text: `Medical ID for ${medicalID.name}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback - copy to clipboard
      const text = `Medical ID for ${medicalID.name}\n` +
                   `Blood Type: ${medicalID.bloodType}\n` +
                   `Allergies: ${medicalID.allergies.join(', ') || 'None'}\n` +
                   `Conditions: ${medicalID.conditions.join(', ') || 'None'}\n` +
                   `Emergency Contacts: ${medicalID.emergencyContacts.map(c => `${c.name} (${c.phone})`).join(', ')}`;
      
      navigator.clipboard.writeText(text);
      alert('Medical ID information copied to clipboard');
    }
  };

  const getBloodTypeColor = (bloodType: string) => {
    const colors: Record<string, string> = {
      'A+': 'bg-red-100 text-red-800',
      'A-': 'bg-red-100 text-red-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-100 text-blue-800',
      'O+': 'bg-green-100 text-green-800',
      'O-': 'bg-green-100 text-green-800',
      'AB+': 'bg-purple-100 text-purple-800',
      'AB-': 'bg-purple-100 text-purple-800'
    };
    return colors[bloodType] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Medical ID
          </h2>
          <p className="text-muted-foreground">
            Critical medical information accessible from your lock screen
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadMedicalID}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={shareMedicalID}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Medical ID</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="organDonor"
                    checked={organDonor}
                    onCheckedChange={(checked) => setOrganDonor(checked as boolean)}
                  />
                  <Label htmlFor="organDonor">Organ Donor</Label>
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional medical information that emergency responders should know..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setIsEditing(false)}>
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Medical ID Card */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          {/* Header Info */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold">{medicalID.name}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                {medicalID.dateOfBirth && (
                  <span>Age: {calculateAge(medicalID.dateOfBirth)} years</span>
                )}
                <span>DOB: {medicalID.dateOfBirth}</span>
              </div>
            </div>
            <div className="text-right">
              <Badge className={`text-lg px-3 py-1 ${getBloodTypeColor(medicalID.bloodType)}`}>
                {medicalID.bloodType}
              </Badge>
              {medicalID.organDonor && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Heart className="w-3 h-3 mr-1" />
                    Organ Donor
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Medical Information */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Allergies */}
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Allergies
              </h4>
              {medicalID.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {medicalID.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No known allergies</p>
              )}
            </div>

            {/* Medical Conditions */}
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-blue-500" />
                Medical Conditions
              </h4>
              {medicalID.conditions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {medicalID.conditions.map((condition, index) => (
                    <Badge key={index} variant="secondary">
                      {condition}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No chronic conditions</p>
              )}
            </div>

            {/* Current Medications */}
            <div>
              <h4 className="font-semibold text-lg mb-3">Current Medications</h4>
              {medicalID.medications.length > 0 ? (
                <div className="space-y-2">
                  {medicalID.medications.map((medication, index) => (
                    <div key={index} className="p-2 bg-muted rounded text-sm">
                      <div className="font-medium">{medication.name}</div>
                      <div className="text-muted-foreground">
                        {medication.dosage} - {medication.purpose}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No current medications</p>
              )}
            </div>

            {/* Emergency Contacts */}
            <div>
              <h4 className="font-semibold text-lg mb-3">Emergency Contacts</h4>
              {medicalID.emergencyContacts.length > 0 ? (
                <div className="space-y-2">
                  {medicalID.emergencyContacts.slice(0, 3).map((contact, index) => (
                    <div key={contact.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {contact.name}
                          {contact.isPrimary && (
                            <Badge variant="outline" className="text-xs">
                              Primary
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contact.relationship} • {contact.phone}
                        </div>
                      </div>
                    </div>
                  ))}
                  {medicalID.emergencyContacts.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      +{medicalID.emergencyContacts.length - 3} more contacts
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No emergency contacts</p>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          {medicalID.notes && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Additional Notes</h4>
              <p className="text-sm text-muted-foreground">{medicalID.notes}</p>
            </div>
          )}

          {/* QR Code Placeholder */}
          <div className="mt-6 text-center">
            <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-500">QR Code</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Scan for emergency access
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">Important Medical Information</p>
              <p className="text-sm text-yellow-700 mt-1">
                This Medical ID contains critical health information that can be accessed by emergency responders. 
                Keep this information accurate and up to date. In an emergency, this information could save your life.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
