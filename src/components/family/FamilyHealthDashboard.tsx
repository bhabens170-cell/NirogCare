import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, AlertTriangle, Calendar, Heart, Pill, Activity, Download, User, Phone, Mail, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useFamilyHealth } from '@/hooks/useFamilyHealth';
import { FamilyMember, Gender, BloodType } from '@/types/health';

export default function FamilyHealthDashboard() {
  const {
    familyMembers,
    familyHealthData,
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
    getFamilyHealthSummary,
    getHealthAlerts,
    getFamilyMedicationReminders,
    exportFamilyHealthData,
    generateHealthReport
  } = useFamilyHealth();

  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [familySummary, setFamilySummary] = useState<any>(null);
  const [healthAlerts, setHealthAlerts] = useState<any[]>([]);
  const [medicationReminders, setMedicationReminders] = useState<any[]>([]);

  // Form state for adding family member
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({
    name: '',
    relationship: '',
    dateOfBirth: '',
    gender: 'other',
    bloodType: 'O+',
    allergies: [],
    conditions: [],
    medications: [],
    permissions: {
      viewHealth: true,
      manageReminders: false,
      emergencyContact: false
    }
  });

  // Initialize data
  useEffect(() => {
    setFamilySummary(getFamilyHealthSummary());
    setHealthAlerts(getHealthAlerts());
    setMedicationReminders(getFamilyMedicationReminders());
  }, [familyMembers, familyHealthData]);

  const handleAddMember = () => {
    if (newMember.name && newMember.relationship && newMember.dateOfBirth) {
      const member = addFamilyMember(newMember as Omit<FamilyMember, 'id'>);
      setIsAddMemberOpen(false);
      setNewMember({
        name: '',
        relationship: '',
        dateOfBirth: '',
        gender: 'other',
        bloodType: 'O+',
        allergies: [],
        conditions: [],
        medications: [],
        permissions: {
          viewHealth: true,
          manageReminders: false,
          emergencyContact: false
        }
      });
    }
  };

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

  const getMemberHealthData = (memberId: string) => {
    return familyHealthData.get(memberId);
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

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Family Health Dashboard
          </h2>
          <p className="text-muted-foreground">
            Manage and monitor health information for your entire family
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportFamilyHealthData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Family Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newMember.name || ''}
                      onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="relationship">Relationship</Label>
                    <Select value={newMember.relationship || ''} onValueChange={(value) => setNewMember(prev => ({ ...prev, relationship: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="grandparent">Grandparent</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={newMember.dateOfBirth || ''}
                      onChange={(e) => setNewMember(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={newMember.gender || 'other'} onValueChange={(value: Gender) => setNewMember(prev => ({ ...prev, gender: value }))}>
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
                </div>

                <div>
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select value={newMember.bloodType || 'O+'} onValueChange={(value: BloodType) => setNewMember(prev => ({ ...prev, bloodType: value }))}>
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

                <div>
                  <Label htmlFor="allergies">Allergies (comma separated)</Label>
                  <Input
                    id="allergies"
                    value={newMember.allergies?.join(', ') || ''}
                    onChange={(e) => setNewMember(prev => ({ 
                      ...prev, 
                      allergies: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
                    }))}
                    placeholder="Peanuts, Shellfish, Pollen"
                  />
                </div>

                <div>
                  <Label htmlFor="conditions">Medical Conditions (comma separated)</Label>
                  <Input
                    id="conditions"
                    value={newMember.conditions?.join(', ') || ''}
                    onChange={(e) => setNewMember(prev => ({ 
                      ...prev, 
                      conditions: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                    }))}
                    placeholder="Diabetes, Hypertension, Asthma"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="viewHealth"
                        checked={newMember.permissions?.viewHealth || false}
                        onCheckedChange={(checked) => setNewMember(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions!, viewHealth: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="viewHealth">View health information</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="manageReminders"
                        checked={newMember.permissions?.manageReminders || false}
                        onCheckedChange={(checked) => setNewMember(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions!, manageReminders: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="manageReminders">Manage medication reminders</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="emergencyContact"
                        checked={newMember.permissions?.emergencyContact || false}
                        onCheckedChange={(checked) => setNewMember(prev => ({
                          ...prev,
                          permissions: { ...prev.permissions!, emergencyContact: checked as boolean }
                        }))}
                      />
                      <Label htmlFor="emergencyContact">Emergency contact</Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddMember} className="flex-1">
                    Add Member
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Family Summary */}
      {familySummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {familySummary.totalMembers}
              </div>
              <p className="text-sm text-muted-foreground">Family Members</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {familySummary.membersWithAllergies}
              </div>
              <p className="text-sm text-muted-foreground">With Allergies</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {familySummary.membersOnMedications}
              </div>
              <p className="text-sm text-muted-foreground">On Medications</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {familySummary.upcomingAppointments}
              </div>
              <p className="text-sm text-muted-foreground">Appointments</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Health Alerts */}
      {healthAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Health Alerts
              <Badge variant="destructive">{healthAlerts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {healthAlerts.slice(0, 3).map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getAlertColor(alert.priority)}`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm opacity-75">{alert.memberName}</p>
                    </div>
                    <Badge variant="outline">{alert.priority}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">Family Members</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        {/* Family Members Tab */}
        <TabsContent value="members" className="space-y-4">
          {familyMembers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Family Members</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add family members to start managing their health information
                </p>
                <Button onClick={() => setIsAddMemberOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Member
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {familyMembers.map((member) => {
                const healthData = getMemberHealthData(member.id);
                const age = calculateAge(member.dateOfBirth);
                
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: familyMembers.indexOf(member) * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-lg">{member.name}</h4>
                              <p className="text-sm text-muted-foreground">{member.relationship}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span>Age: {age || 'Unknown'}</span>
                                <Badge className={getBloodTypeColor(member.bloodType || 'O+')}>
                                  {member.bloodType || 'O+'}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Health Overview */}
                        <div className="mt-4 grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-red-600">
                              <Heart className="w-4 h-4" />
                              <span className="font-semibold">{member.allergies.length}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Allergies</p>
                          </div>
                          
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-blue-600">
                              <Activity className="w-4 h-4" />
                              <span className="font-semibold">{member.conditions.length}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Conditions</p>
                          </div>
                          
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-green-600">
                              <Pill className="w-4 h-4" />
                              <span className="font-semibold">{member.medications.length}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Medications</p>
                          </div>
                        </div>

                        {/* Recent Activity */}
                        {healthData && healthData.recentActivity.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium mb-2">Recent Activity</p>
                            <div className="space-y-1">
                              {healthData.recentActivity.slice(0, 2).map((activity, index) => (
                                <div key={index} className="text-xs text-muted-foreground">
                                  {activity.description} • {new Date(activity.timestamp).toLocaleDateString()}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5" />
                Family Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {medicationReminders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No medication reminders set up for family members
                </p>
              ) : (
                <div className="space-y-3">
                  {medicationReminders.map((reminder, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{reminder.medication}</p>
                        <p className="text-sm text-muted-foreground">
                          {reminder.memberName} • {reminder.dosage}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{reminder.time}</p>
                        <p className="text-xs text-muted-foreground">{reminder.frequency}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                No upcoming appointments scheduled
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Family Health Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Comprehensive Family Health</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View detailed analytics and reports for your entire family
                </p>
                <Button onClick={() => exportFamilyHealthData()}>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
