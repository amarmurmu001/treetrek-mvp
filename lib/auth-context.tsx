"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from './firebase';
import { createUserProfile, updateUserProfile } from './firebase-service';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  userData: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  signInWithGoogle: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            // Create user profile if it doesn't exist
            await createUserProfile(user.uid, {
              name: user.displayName || 'User',
              email: user.email,
              photoURL: user.photoURL,
              createdAt: new Date().toISOString(),
            });
            setUserData({
              name: user.displayName || 'User',
              email: user.email,
              photoURL: user.photoURL,
              createdAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Update last login
      await updateUserProfile(userCredential.user.uid, {
        lastLogin: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error signing in:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(userCredential.user.uid, {
        name,
        email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error signing up:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const signOut = async () => {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error: any) {
      console.error('Error signing out:', error);
      throw new Error(error.message || 'Failed to sign out');
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if this is a new user
      const isNewUser = userCredential.additionalUserInfo?.isNewUser;
      if (isNewUser) {
        await createUserProfile(userCredential.user.uid, {
          name: userCredential.user.displayName,
          email: userCredential.user.email,
          photoURL: userCredential.user.photoURL,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });
      } else {
        // Update last login for existing users
        await updateUserProfile(userCredential.user.uid, {
          lastLogin: new Date().toISOString(),
        });
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      throw new Error(error.message || 'Failed to reset password');
    }
  };

  const updateProfile = async (data: any) => {
    if (!user) throw new Error('No user logged in');
    try {
      await updateUserProfile(user.uid, data);
      setUserData(prev => ({ ...prev, ...data }));
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userData, 
      loading, 
      signIn, 
      signUp, 
      signOut, 
      signInWithGoogle,
      resetPassword,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 