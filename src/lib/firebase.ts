/**
 * Firebase Configuration for NirogCare
 * This file initializes Firebase services
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyA9vkhCCiZl60rHCCZ3dqAJKm4SLKRq8nE",
    authDomain: "nirogcare-9a3ac.firebaseapp.com",
    projectId: "nirogcare-9a3ac",
    storageBucket: "nirogcare-9a3ac.firebasestorage.app",
    messagingSenderId: "559615363260",
    appId: "1:559615363260:web:7a4f45ae82182a30df28b9",
    measurementId: "G-W35ZJHBDDL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (for storing data)
export const db = getFirestore(app);

// Initialize Auth (for user authentication)
export const auth = getAuth(app);

// Initialize Storage (for file uploads like prescriptions)
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
export const initAnalytics = async () => {
    if (await isSupported()) {
        return getAnalytics(app);
    }
    return null;
};

export default app;
