/**
 * Reminder Store - Shared state for medicine reminders
 * Allows adding reminders from prescription scanner and viewing in Reminders page
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MedicineReminder {
    id: number;
    medicine: string;
    dosage?: string;
    time: string;
    frequency: string;
    active: boolean;
    source: 'manual' | 'prescription';
    prescriptionDate?: string;
}

interface ReminderStore {
    reminders: MedicineReminder[];
    addReminder: (reminder: Omit<MedicineReminder, 'id'>) => void;
    addMultipleReminders: (reminders: Omit<MedicineReminder, 'id'>[]) => void;
    removeReminder: (id: number) => void;
    toggleReminder: (id: number) => void;
    updateReminder: (id: number, updates: Partial<MedicineReminder>) => void;
    clearPrescriptionReminders: () => void;
    getActiveReminders: () => MedicineReminder[];
}

export const useReminderStore = create<ReminderStore>()(
    persist(
        (set, get) => ({
            reminders: [],

            addReminder: (reminder) => {
                const newReminder: MedicineReminder = {
                    ...reminder,
                    id: Date.now() + Math.random() * 1000,
                };
                set((state) => ({
                    reminders: [...state.reminders, newReminder],
                }));
            },

            addMultipleReminders: (newReminders) => {
                const remindersWithIds: MedicineReminder[] = newReminders.map((r, i) => ({
                    ...r,
                    id: Date.now() + i,
                }));
                set((state) => ({
                    reminders: [...state.reminders, ...remindersWithIds],
                }));
            },

            removeReminder: (id) => {
                set((state) => ({
                    reminders: state.reminders.filter((r) => r.id !== id),
                }));
            },

            toggleReminder: (id) => {
                set((state) => ({
                    reminders: state.reminders.map((r) =>
                        r.id === id ? { ...r, active: !r.active } : r
                    ),
                }));
            },

            updateReminder: (id, updates) => {
                set((state) => ({
                    reminders: state.reminders.map((r) =>
                        r.id === id ? { ...r, ...updates } : r
                    ),
                }));
            },

            clearPrescriptionReminders: () => {
                set((state) => ({
                    reminders: state.reminders.filter((r) => r.source !== 'prescription'),
                }));
            },

            getActiveReminders: () => {
                return get().reminders.filter((r) => r.active);
            },
        }),
        {
            name: 'nirogcare-reminders',
        }
    )
);

/**
 * Generate reminder times based on frequency
 */
export function generateReminderTimes(frequency: string): string[] {
    const freq = frequency.toLowerCase();

    if (freq.includes('once') || freq.includes('1')) {
        return ['08:00'];
    }
    if (freq.includes('twice') || freq.includes('2') || freq.includes('bd')) {
        return ['08:00', '20:00'];
    }
    if (freq.includes('thrice') || freq.includes('3') || freq.includes('tds') || freq.includes('tid')) {
        return ['08:00', '14:00', '20:00'];
    }
    if (freq.includes('four') || freq.includes('4') || freq.includes('qid')) {
        return ['08:00', '12:00', '16:00', '20:00'];
    }
    if (freq.includes('sos') || freq.includes('needed') || freq.includes('prn')) {
        return ['As needed'];
    }
    if (freq.includes('bedtime') || freq.includes('night') || freq.includes('hs')) {
        return ['21:00'];
    }
    if (freq.includes('morning') || freq.includes('od')) {
        return ['08:00'];
    }

    // Default to once daily
    return ['08:00'];
}

/**
 * Convert 24-hour time to 12-hour format
 */
export function formatTime12Hour(time: string): string {
    if (time === 'As needed') return time;

    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
}
