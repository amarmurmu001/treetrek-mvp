import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bpcsemdvdhuycjozkmvn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwY3NlbWR2ZGh1eWNqb3prbXZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NDk0ODcsImV4cCI6MjA2MTMyNTQ4N30.pwGryD3TeRae814xHOA0XvYrPn11s_BxrPgrDZFyTrI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  throw new Error(error.message || 'An error occurred');
}; 