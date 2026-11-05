import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'hsps_supabase_url';
const STORAGE_KEY_KEY = 'hsps_supabase_anon_key';

export const SUPABASE_SQL_SCRIPT = `-- ==========================================
-- HASSAN SCHOLARS PUBLIC SCHOOL - ZAFARWAL
-- Copy and paste this into Supabase SQL Editor:
-- ==========================================

-- 1. Create admissions table with 5 required fields
CREATE TABLE IF NOT EXISTS admissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;

-- 3. Allow public website visitors to submit admission forms
DROP POLICY IF EXISTS "Allow public insert for admissions" ON admissions;
CREATE POLICY "Allow public insert for admissions" 
ON admissions 
FOR INSERT 
WITH CHECK (true);

-- 4. Allow reading admissions for verification
DROP POLICY IF EXISTS "Allow public read admissions" ON admissions;
CREATE POLICY "Allow public read admissions" 
ON admissions 
FOR SELECT 
USING (true);
`;

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  const localUrl = localStorage.getItem(STORAGE_URL_KEY) || '';
  const localKey = localStorage.getItem(STORAGE_KEY_KEY) || '';

  return {
    url: localUrl || envUrl || '',
    anonKey: localKey || envKey || '',
  };
};

export const saveSupabaseConfig = (url: string, anonKey: string) => {
  if (url.trim()) {
    localStorage.setItem(STORAGE_URL_KEY, url.trim());
  } else {
    localStorage.removeItem(STORAGE_URL_KEY);
  }

  if (anonKey.trim()) {
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_KEY);
  }
};

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    return null;
  }

  if (cachedClient && lastUsedUrl === url && lastUsedKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey);
    lastUsedUrl = url;
    lastUsedKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

export interface AdmissionPayload {
  student_name: string;
  father_name: string;
  grade: string;
  phone: string;
  address: string;
}

export interface SupabaseSaveResult {
  isSavedInSupabase: boolean;
  message: string;
  details?: string;
  data?: any;
}

export const saveAdmissionRecord = async (
  payload: AdmissionPayload
): Promise<SupabaseSaveResult> => {
  const client = getSupabaseClient();

  if (!client) {
    return {
      isSavedInSupabase: false,
      message: 'Not saved yet in Supabase',
      details: 'Supabase URL and Anon Key are not configured yet. You can connect Supabase in the "Supabase Setup" button below.',
    };
  }

  try {
    const { data, error } = await client
      .from('admissions')
      .insert([
        {
          student_name: payload.student_name,
          father_name: payload.father_name,
          grade: payload.grade,
          phone: payload.phone,
          address: payload.address,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return {
        isSavedInSupabase: false,
        message: 'Not saved yet in Supabase',
        details: error.message || 'Error executing insert on admissions table.',
      };
    }

    return {
      isSavedInSupabase: true,
      message: 'Saved in Supabase Successfully',
      data,
    };
  } catch (err: any) {
    console.error('Supabase network error:', err);
    return {
      isSavedInSupabase: false,
      message: 'Not saved yet in Supabase',
      details: err?.message || 'Network or connection error.',
    };
  }
};
