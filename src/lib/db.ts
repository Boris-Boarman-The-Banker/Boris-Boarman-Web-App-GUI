import { createClient } from '@supabase/supabase-js';

// Mocking Supabase client to bypass errors during development
export const db = {
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
  }),
  auth: {
    signIn: () => Promise.resolve({ user: null, session: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ session: null, error: null }),
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Mock implementation of onAuthStateChange
      callback('SIGNED_OUT', null);
      return { data: { subscription: { unsubscribe: () => {} } }, error: null };
    },
  },
};