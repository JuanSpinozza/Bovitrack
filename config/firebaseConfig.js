import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD5yqH5MBvu3p4C_jW_7Oedhi2U7Pn-mDc",
  authDomain: "moviles2025-4f7ad.firebaseapp.com",
  databaseURL: "https://moviles2025-4f7ad-default-rtdb.firebaseio.com",
  projectId: "moviles2025-4f7ad",
  storageBucket: "moviles2025-4f7ad.firebasestorage.app",
  messagingSenderId: "364928939451",
  appId: "1:364928939451:web:5fa3f75ff1f7d597ce809e",
  measurementId: "G-M5252SNZSZ"
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);