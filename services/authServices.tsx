import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithCredential,
    signOut,
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const minLength = password.length >= 6;
    
    if (!minLength) {
      return { valid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
    }
    if (!hasUpperCase) {
      return { valid: false, error: 'La contraseña debe contener al menos una mayúscula' };
    }
    return { valid: true };
  };
  
  export const registerWithEmail = async (email: string, password: string) => {
    const validation = validatePassword(password);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };

  export const loginWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };
  
  export const loginWithGoogle = async (idToken: string) => {
    try {
        const credential = GoogleAuthProvider.credential(idToken);
        const result = await signInWithCredential(auth, credential);
        return { success: true, user: result.user };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
  };
  
  export const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  };
  
  export const subscribeToAuthChanges = (callback: (user: any) => void) => {
    return onAuthStateChanged(auth, callback);
  };