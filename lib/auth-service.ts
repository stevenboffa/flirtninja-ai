import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export async function signUp({ email, password, name }: SignUpData): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with name
    await updateProfile(userCredential.user, {
      displayName: name
    });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      name,
      createdAt: serverTimestamp()
    });

    return userCredential.user;
  } catch (error: any) {
    console.error('Error during sign up:', error);
    throw error;
  }
}

export async function signIn({ email, password }: SignInData): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error during sign in:', error);
    throw error;
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Error during sign out:', error);
    throw error;
  }
}