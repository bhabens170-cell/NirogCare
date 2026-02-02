import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, User, Plus, Trash2, Edit, Star, Shield, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { EmergencyContact } from '@/types/health';

const relationshipOptions = [
  'Spouse',
  'Parent',
  'Child',
  'Sibling',
  'Grandparent',
  'Friend',
  'Roommate',
  'Caregiver',
  'Doctor',
  'Other'
];

export default function EmergencyContacts() {
  const { profile, addEmergencyContact, removeEmergencyContact } = useHealthProfile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState<Omit<EmergencyContact, 'id'>>({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    isPrimary: false
  });

  const emergencyContacts = profile?.medicalInfo?.emergencyContacts || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) return;

    if (editingContact) {
      // In a real app, you'd update the contact
      // For now, we'll just close the dialog
      setIsDialogOpen(false);
      setEditingContact(null);
    } else {
      addEmergencyContact(formData);
    }

    // Reset form
    setFormData({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      isPrimary: false
    });
    setIsDialogOpen(false);
  };

  const handleEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      email: contact.email || '',
      isPrimary: contact.isPrimary
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (contactId: string) => {
    if (confirm('Are you sure you want to remove this emergency contact?')) {
      removeEmergencyContact(contactId);
    }
  };

  const makePrimaryContact = (contactId: string) => {
    // In a real app, you'd update the primary contact
    console.log('Making contact primary:', contactId);
  };

  const callEmergency = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const sendEmergencySMS = (phone: string) => {
    window.open(`sms:${phone}?body=Emergency! This is an automated message from NirogCare. Please contact me immediately.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Emergency Contacts</h2>
          <p className="text-muted-foreground">
            Manage who to contact in case of emergency
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="relationship">Relationship *</Label>
                <Select 
                  value={formData.relationship} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john.doe@example.com"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={formData.isPrimary}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPrimary: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="isPrimary">Set as primary emergency contact</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingContact(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Emergency Alert */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">
                Emergency Contacts
              </p>
              <p className="text-xs text-red-700">
                These contacts will be notified automatically in case of emergency. Make sure they know they're listed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {emergencyContacts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No Emergency Contacts
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add emergency contacts to ensure someone can be reached in case of emergency.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Contact
              </Button>
            </motion.div>
          ) : (
            emergencyContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative ${contact.isPrimary ? 'border-primary bg-primary/5' : ''}`}>
                  <CardContent className="p-4">
                    {contact.isPrimary && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="default" className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Primary
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                        
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{contact.phone}</span>
                            <div className="flex gap-1 ml-auto">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => callEmergency(contact.phone)}
                                className="h-8 px-2"
                              >
                                <Phone className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => sendEmergencySMS(contact.phone)}
                                className="h-8 px-2"
                              >
                                <Mail className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {contact.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{contact.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {!contact.isPrimary && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => makePrimaryContact(contact.id)}
                            className="h-8 px-2"
                          >
                            <Star className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(contact)}
                          className="h-8 px-2"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(contact.id)}
                          className="h-8 px-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Emergency Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Emergency Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium">Keep contacts updated</p>
              <p className="text-sm text-muted-foreground">
                Regularly review and update your emergency contact information
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium">Inform your contacts</p>
              <p className="text-sm text-muted-foreground">
                Let your emergency contacts know they're listed and what to expect
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium">Test emergency features</p>
              <p className="text-sm text-muted-foreground">
                Periodically test the emergency notification system
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
