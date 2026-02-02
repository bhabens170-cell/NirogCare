/**
 * Firestore Service - Data Storage for NirogCare
 * Handles saving and retrieving user data
 */

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    setDoc
} from 'firebase/firestore';
import { db } from './firebase';

// Collection names
const COLLECTIONS = {
    USERS: 'users',
    REMINDERS: 'reminders',
    SCAN_HISTORY: 'scanHistory',
    CHAT_HISTORY: 'chatHistory'
};

// ===== USER PROFILE =====
export interface UserProfile {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    createdAt?: Date;
    lastActive?: Date;
}

export async function saveUserProfile(userId: string, profile: Partial<UserProfile>) {
    try {
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        await setDoc(userRef, {
            ...profile,
            lastActive: Timestamp.now()
        }, { merge: true });
        console.log('✅ User profile saved');
        return true;
    } catch (error) {
        console.error('Error saving user profile:', error);
        return false;
    }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
        const userRef = doc(db, COLLECTIONS.USERS, userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() } as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        return null;
    }
}

// ===== REMINDERS =====
export interface ReminderData {
    id?: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    times: string[];
    startDate: Date;
    endDate?: Date;
    notes?: string;
    isActive: boolean;
    createdAt?: Date;
}

export async function saveReminder(userId: string, reminder: ReminderData) {
    try {
        const remindersRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.REMINDERS);
        const docRef = await addDoc(remindersRef, {
            ...reminder,
            createdAt: Timestamp.now(),
            isActive: true
        });
        console.log('✅ Reminder saved:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error saving reminder:', error);
        return null;
    }
}

export async function getReminders(userId: string): Promise<ReminderData[]> {
    try {
        const remindersRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.REMINDERS);
        const q = query(remindersRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReminderData));
    } catch (error) {
        console.error('Error getting reminders:', error);
        return [];
    }
}

export async function updateReminder(userId: string, reminderId: string, updates: Partial<ReminderData>) {
    try {
        const reminderRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.REMINDERS, reminderId);
        await updateDoc(reminderRef, updates);
        console.log('✅ Reminder updated');
        return true;
    } catch (error) {
        console.error('Error updating reminder:', error);
        return false;
    }
}

export async function deleteReminder(userId: string, reminderId: string) {
    try {
        const reminderRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.REMINDERS, reminderId);
        await deleteDoc(reminderRef);
        console.log('✅ Reminder deleted');
        return true;
    } catch (error) {
        console.error('Error deleting reminder:', error);
        return false;
    }
}

// ===== SCAN HISTORY =====
export interface ScanHistoryData {
    id?: string;
    imageUrl?: string;
    medicines: {
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions?: string;
    }[];
    doctorName?: string;
    patientName?: string;
    date?: string;
    diagnosis?: string;
    notes?: string;
    createdAt?: Date;
}

export async function saveScanHistory(userId: string, scan: ScanHistoryData) {
    try {
        const scansRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.SCAN_HISTORY);
        const docRef = await addDoc(scansRef, {
            ...scan,
            createdAt: Timestamp.now()
        });
        console.log('✅ Scan history saved:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error saving scan history:', error);
        return null;
    }
}

export async function getScanHistory(userId: string, limitCount: number = 20): Promise<ScanHistoryData[]> {
    try {
        const scansRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.SCAN_HISTORY);
        const q = query(scansRef, orderBy('createdAt', 'desc'), limit(limitCount));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScanHistoryData));
    } catch (error) {
        console.error('Error getting scan history:', error);
        return [];
    }
}

// ===== CHAT HISTORY =====
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export async function saveChatHistory(userId: string, messages: ChatMessage[]) {
    try {
        const chatRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.CHAT_HISTORY, 'latest');
        await setDoc(chatRef, {
            messages: messages.slice(-50), // Keep last 50 messages
            updatedAt: Timestamp.now()
        });
        console.log('✅ Chat history saved');
        return true;
    } catch (error) {
        console.error('Error saving chat history:', error);
        return false;
    }
}

export async function getChatHistory(userId: string): Promise<ChatMessage[]> {
    try {
        const chatRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.CHAT_HISTORY, 'latest');
        const chatDoc = await getDoc(chatRef);
        if (chatDoc.exists()) {
            return chatDoc.data().messages || [];
        }
        return [];
    } catch (error) {
        console.error('Error getting chat history:', error);
        return [];
    }
}

// ===== ANONYMOUS USER ID =====
// For users who don't sign in, we use a device-based ID
export function getAnonymousUserId(): string {
    let userId = localStorage.getItem('nirogcare_user_id');
    if (!userId) {
        userId = 'anon_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('nirogcare_user_id', userId);
    }
    return userId;
}
