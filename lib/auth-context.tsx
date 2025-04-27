"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { createUserProfile, updateUserProfile } from './supabase-service';
import { useToast } from "@/hooks/use-toast";

interface UserData {
  id: string;
  name: string;
  email: string;
  trees: number;
  coins: number;
  streak: number;
  created_at: string;
  last_active: string;
  photo_url?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserData>) => Promise<void>;
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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
    });

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserData(session.user.id);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // First try to get the user profile
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If the error is that no rows were found, create a new profile
        if (error.code === 'PGRST116') {
          // Get the user's auth data
          const { data: authData } = await supabase.auth.getUser();
          if (!authData.user) throw new Error('No authenticated user found');

          try {
            // Create a new user profile using the service role
            const { data: newProfile, error: createError } = await supabase
              .from('users')
              .insert([{
                id: userId,
                name: authData.user.user_metadata.name || 'User',
                email: authData.user.email,
                trees: 0,
                coins: 0,
                streak: 0,
                created_at: new Date().toISOString(),
                last_active: new Date().toISOString(),
              }])
              .select()
              .single();

            if (createError) {
              // If the error is a duplicate key, try to fetch the existing profile
              if (createError.code === '23505') {
                const { data: existingProfile, error: fetchError } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', userId)
                  .single();

                if (fetchError) throw fetchError;
                if (existingProfile) {
                  setUserData(existingProfile as UserData);
                  return;
                }
              }
              throw createError;
            }

            if (newProfile) {
              setUserData(newProfile as UserData);
            }
          } catch (profileError: any) {
            console.error('Error handling user profile:', profileError);
            // If we can't create or fetch the profile, try to get it one more time
            const { data: finalProfile, error: finalError } = await supabase
              .from('users')
              .select('*')
              .eq('id', userId)
              .single();

            if (finalError) throw finalError;
            if (finalProfile) {
              setUserData(finalProfile as UserData);
            }
          }
          return;
        }
        throw error;
      }

      setUserData(data as UserData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Update last active in users table
      const { error: updateError } = await supabase
        .from('users')
        .update({ last_active: new Date().toISOString() })
        .eq('email', email);

      if (updateError) {
        console.error('Error updating last active:', updateError);
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // First, check if the email is already registered
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Sign up the user with proper data format
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            email,
          },
        },
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw new Error(signUpError.message);
      }

      if (!data.user) {
        throw new Error('Failed to create user account');
      }

      try {
        // Create user profile in users table
        const { data: newProfile, error: profileError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            name,
            email,
            trees: 0,
            coins: 0,
            streak: 0,
            created_at: new Date().toISOString(),
            last_active: new Date().toISOString(),
          }])
          .select()
          .single();

        if (profileError) {
          // If the error is a duplicate key, try to fetch the existing profile
          if (profileError.code === '23505') {
            const { data: existingProfile, error: fetchError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (fetchError) throw fetchError;
            if (existingProfile) {
              setUserData(existingProfile as UserData);
            }
          } else {
            throw profileError;
          }
        } else if (newProfile) {
          setUserData(newProfile as UserData);
        }
      } catch (profileError: any) {
        console.error('Error handling user profile:', profileError);
        // If we can't create or fetch the profile, try to get it one more time
        const { data: finalProfile, error: finalError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (finalError) throw finalError;
        if (finalProfile) {
          setUserData(finalProfile as UserData);
        }
      }

      // Sign in the user immediately
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw new Error('Account created but failed to sign in');
      }

      toast({
        title: "Welcome to TreeTrek!",
        description: "Your account has been created successfully.",
      });

    } catch (error: any) {
      if (error.message === 'Email already registered') {
        toast({
          title: "Error",
          description: "This email is already registered. Please sign in instead.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create account. Please try again.",
          variant: "destructive",
        });
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUserData(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for instructions to reset your password.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProfile = async (data: Partial<UserData>) => {
    if (!user) throw new Error('No user logged in');
    try {
      await updateUserProfile(user.id, data);
      setUserData((prev: UserData | null) => prev ? { ...prev, ...data } : null);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      throw error;
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
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 