/**
 * NirogCare - Medicine Reminders Page
 * Full CRUD functionality with integration from Prescription Scanner
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import FloatingChatButton from '@/components/layout/FloatingChatButton';
import { ArrowLeft, Bell, Plus, Clock, Sparkles, Pill, Calendar, BellRing, X, Trash2, Edit2, Check, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useReminderStore, formatTime12Hour, type MedicineReminder } from '@/stores/reminderStore';

export default function Reminders() {
  const navigate = useNavigate();

  // Use Zustand store for reminders
  const {
    reminders,
    addReminder,
    removeReminder,
    toggleReminder,
    updateReminder
  } = useReminderStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [newMedicine, setNewMedicine] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newFrequency, setNewFrequency] = useState('Daily');

  const handleAddReminder = () => {
    if (!newMedicine.trim()) {
      toast.error('Please enter medicine name');
      return;
    }

    addReminder({
      medicine: newMedicine,
      dosage: newDosage,
      time: newTime,
      frequency: newFrequency,
      active: true,
      source: 'manual'
    });

    resetForm();
    setShowAddForm(false);
    toast.success('Reminder added successfully!');
  };

  const handleDeleteReminder = (id: number) => {
    removeReminder(id);
    toast.success('Reminder deleted');
  };

  const handleUpdateReminder = (id: number) => {
    if (!newMedicine.trim()) {
      toast.error('Please enter medicine name');
      return;
    }

    updateReminder(id, {
      medicine: newMedicine,
      dosage: newDosage,
      time: newTime,
      frequency: newFrequency
    });

    setEditingId(null);
    resetForm();
    toast.success('Reminder updated!');
  };

  const startEdit = (reminder: MedicineReminder) => {
    setEditingId(reminder.id);
    setNewMedicine(reminder.medicine);
    setNewDosage(reminder.dosage || '');
    setNewTime(reminder.time);
    setNewFrequency(reminder.frequency);
    setShowAddForm(false);
  };

  const resetForm = () => {
    setNewMedicine('');
    setNewDosage('');
    setNewTime('08:00');
    setNewFrequency('Daily');
  };

  const cancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  const activeCount = reminders.filter(r => r.active).length;
  const prescriptionReminders = reminders.filter(r => r.source === 'prescription');
  const manualReminders = reminders.filter(r => r.source === 'manual');

  const frequencyOptions = [
    'Daily',
    'Every 8 hours',
    'Every 12 hours',
    'Once a week',
    'Twice a day',
    'Three times a day',
    'Before meals',
    'After meals',
    'At bedtime',
    'As needed'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24 max-w-2xl">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary font-medium mb-6 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </motion.button>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-3xl p-6 md:p-8 text-white mb-6"
        >
          {/* Background decorations */}
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="relative flex items-start gap-4">
            <motion.div
              className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Bell className="w-8 h-8" />
            </motion.div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                Medicine Reminders
                <Sparkles className="w-6 h-6 text-amber-300" />
              </h1>
              <p className="text-white/80">Never miss a dose again</p>
            </div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between bg-card rounded-2xl border border-border/50 p-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <BellRing className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Reminders</p>
              <p className="font-bold text-foreground text-lg">{activeCount} of {reminders.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {prescriptionReminders.length > 0 && (
              <span className="flex items-center gap-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300 px-2 py-1 rounded-md">
                <FileText className="w-3 h-3" />
                {prescriptionReminders.length} from Rx
              </span>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Today</span>
            </div>
          </div>
        </motion.div>

        {/* Add Reminder Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="bg-card rounded-2xl border border-primary/30 shadow-lg overflow-hidden"
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add New Reminder
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Medicine Name</label>
                    <Input
                      placeholder="e.g., Paracetamol 500mg"
                      value={newMedicine}
                      onChange={(e) => setNewMedicine(e.target.value)}
                      className="rounded-xl h-12"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Dosage (optional)</label>
                    <Input
                      placeholder="e.g., 1 tablet"
                      value={newDosage}
                      onChange={(e) => setNewDosage(e.target.value)}
                      className="rounded-xl h-12"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Time</label>
                      <Input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="rounded-xl h-12"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Frequency</label>
                      <Select value={newFrequency} onValueChange={setNewFrequency}>
                        <SelectTrigger className="rounded-xl h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map(freq => (
                            <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddReminder}
                    className="flex-1 rounded-xl gradient-hero"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Reminder
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prescription Reminders Section */}
        {prescriptionReminders.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-violet-500" />
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                From Prescription Scanner
              </h3>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {prescriptionReminders.map((reminder, index) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    index={index}
                    isEditing={editingId === reminder.id}
                    onToggle={() => toggleReminder(reminder.id)}
                    onEdit={() => startEdit(reminder)}
                    onDelete={() => handleDeleteReminder(reminder.id)}
                    onSave={() => handleUpdateReminder(reminder.id)}
                    onCancel={cancelEdit}
                    editState={{
                      medicine: newMedicine,
                      setMedicine: setNewMedicine,
                      dosage: newDosage,
                      setDosage: setNewDosage,
                      time: newTime,
                      setTime: setNewTime,
                      frequency: newFrequency,
                      setFrequency: setNewFrequency,
                      frequencyOptions
                    }}
                    isPrescription
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Manual Reminders Section */}
        <div className="space-y-3 mb-6">
          {manualReminders.length > 0 && prescriptionReminders.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Manual Reminders
              </h3>
            </div>
          )}
          <AnimatePresence>
            {manualReminders.map((reminder, index) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                index={index}
                isEditing={editingId === reminder.id}
                onToggle={() => toggleReminder(reminder.id)}
                onEdit={() => startEdit(reminder)}
                onDelete={() => handleDeleteReminder(reminder.id)}
                onSave={() => handleUpdateReminder(reminder.id)}
                onCancel={cancelEdit}
                editState={{
                  medicine: newMedicine,
                  setMedicine: setNewMedicine,
                  dosage: newDosage,
                  setDosage: setNewDosage,
                  time: newTime,
                  setTime: setNewTime,
                  frequency: newFrequency,
                  setFrequency: setNewFrequency,
                  frequencyOptions
                }}
              />
            ))}
          </AnimatePresence>

          {reminders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-2">No reminders yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add reminders manually or scan a prescription
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => setShowAddForm(true)} className="rounded-xl gradient-hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reminder
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} className="rounded-xl">
                  <FileText className="w-4 h-4 mr-2" />
                  Scan Prescription
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Add Button */}
        {!showAddForm && reminders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full rounded-2xl h-14 gradient-hero text-lg shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Reminder
            </Button>
          </motion.div>
        )}

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-5 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200/50 dark:border-violet-800/50 rounded-2xl"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-violet-500/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h4 className="font-semibold text-violet-900 dark:text-violet-100 mb-1">Pro Tip</h4>
              <p className="text-sm text-violet-700 dark:text-violet-300">
                Use the AI Prescription Scanner on the home page to automatically add reminders from your doctor's prescription!
              </p>
            </div>
          </div>
        </motion.div>
      </main>
      <FloatingChatButton />
    </div>
  );
}

// Reminder Card Component
interface ReminderCardProps {
  reminder: MedicineReminder;
  index: number;
  isEditing: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  editState: {
    medicine: string;
    setMedicine: (v: string) => void;
    dosage: string;
    setDosage: (v: string) => void;
    time: string;
    setTime: (v: string) => void;
    frequency: string;
    setFrequency: (v: string) => void;
    frequencyOptions: string[];
  };
  isPrescription?: boolean;
}

function ReminderCard({
  reminder,
  index,
  isEditing,
  onToggle,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  editState,
  isPrescription
}: ReminderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
      layout
      className={`bg-card rounded-2xl border shadow-sm p-5 transition-all duration-300 ${reminder.active
          ? isPrescription
            ? 'border-violet-300 dark:border-violet-700 shadow-md'
            : 'border-primary/30 shadow-md'
          : 'border-border/50 opacity-60'
        }`}
    >
      {isEditing ? (
        // Edit mode
        <div className="space-y-3">
          <Input
            placeholder="Medicine name"
            value={editState.medicine}
            onChange={(e) => editState.setMedicine(e.target.value)}
            className="rounded-xl h-11"
          />
          <Input
            placeholder="Dosage (optional)"
            value={editState.dosage}
            onChange={(e) => editState.setDosage(e.target.value)}
            className="rounded-xl h-11"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="time"
              value={editState.time}
              onChange={(e) => editState.setTime(e.target.value)}
              className="rounded-xl h-11"
            />
            <Select value={editState.frequency} onValueChange={editState.setFrequency}>
              <SelectTrigger className="rounded-xl h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {editState.frequencyOptions.map(freq => (
                  <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} size="sm" className="rounded-xl flex-1">
              Cancel
            </Button>
            <Button onClick={onSave} size="sm" className="rounded-xl flex-1 gradient-hero">
              <Check className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      ) : (
        // View mode
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <motion.div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${reminder.active
                  ? isPrescription
                    ? 'bg-gradient-to-br from-violet-500/20 to-purple-500/20'
                    : 'bg-gradient-to-br from-primary/20 to-purple-500/20'
                  : 'bg-muted'
                }`}
              whileHover={{ scale: 1.05 }}
            >
              <Pill className={`w-6 h-6 ${reminder.active ? isPrescription ? 'text-violet-500' : 'text-primary' : 'text-muted-foreground'}`} />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">
                  {reminder.medicine}
                </h3>
                {isPrescription && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300">
                    Rx
                  </span>
                )}
              </div>
              {reminder.dosage && (
                <p className="text-xs text-muted-foreground">{reminder.dosage}</p>
              )}
              <div className="flex items-center gap-3 mt-1">
                <span className={`flex items-center gap-1 text-sm ${reminder.active ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                  <Clock className="w-4 h-4" />
                  {formatTime12Hour(reminder.time)}
                </span>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-sm text-muted-foreground">{reminder.frequency}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <Edit2 className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-xl hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
            <Switch
              checked={reminder.active}
              onCheckedChange={onToggle}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
