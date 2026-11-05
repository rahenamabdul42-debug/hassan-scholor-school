import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'hsps_supabase_url';
const STORAGE_KEY_KEY = 'hsps_supabase_anon_key';

export const SUPABASE_SQL_SCRIPT = `-- ==========================================
-- HASSAN SCHOLARS PUBLIC SCHOOL - ZAFARWAL
-- Table for Admission Form Submissions
-- ==========================================

CREATE TABLE IF NOT EXISTS admissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  class TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;

-- Allow public website visitors to submit admission forms
DROP POLICY IF EXISTS "Allow public insert for admissions" ON admissions;
CREATE POLICY "Allow public insert for admissions" 
ON admissions 
FOR INSERT 
WITH CHECK (true);

-- Allow reading admissions for verification
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
    url: (localUrl || envUrl || '').trim(),
    anonKey: (localKey || envKey || '').trim(),
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

  // Clear cached client so it re-initializes
  cachedClient = null;
  lastUsedUrl = '';
  lastUsedKey = '';
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
  grade: string; // The class value
  phone: string;
  address: string;
}

export interface SupabaseSaveResult {
  isSavedInSupabase: boolean;
  message: string;
  details?: string;
  data?: any;
}

/**
 * Robust insertion helper that supports both common Supabase column naming conventions:
 * - { student_name, father_name, class, phone_number, address }
 * - { student_name, father_name, grade, phone, address }
 * - { student_name, father_name, class, phone, address }
 * - { student_name, father_name, grade, phone_number, address }
 * - { "Student Name", "Father Name", "Class", "Phone Number", "Address" }
 */
export const saveAdmissionRecord = async (
  payload: AdmissionPayload
): Promise<SupabaseSaveResult> => {
  const client = getSupabaseClient();

  if (!client) {
    return {
      isSavedInSupabase: false,
      message: 'Supabase credentials missing',
      details: 'Please provide your existing Supabase Project URL and Publishable Key in the form settings.',
    };
  }

  // Variation attempts in case user table uses `class` vs `grade`, `phone_number` vs `phone`
  const attempts = [
    // 1. Common naming with class and phone_number
    {
      student_name: payload.student_name,
      father_name: payload.father_name,
      class: payload.grade,
      phone_number: payload.phone,
      address: payload.address,
    },
    // 2. Common naming with grade and phone
    {
      student_name: payload.student_name,
      father_name: payload.father_name,
      grade: payload.grade,
      phone: payload.phone,
      address: payload.address,
    },
    // 3. Mixed naming with class and phone
    {
      student_name: payload.student_name,
      father_name: payload.father_name,
      class: payload.grade,
      phone: payload.phone,
      address: payload.address,
    },
    // 4. Mixed naming with grade and phone_number
    {
      student_name: payload.student_name,
      father_name: payload.father_name,
      grade: payload.grade,
      phone_number: payload.phone,
      address: payload.address,
    },
    // 5. Title Case column names if created manually in table editor
    {
      'Student Name': payload.student_name,
      'Father Name': payload.father_name,
      'Class': payload.grade,
      'Phone Number': payload.phone,
      'Address': payload.address,
    },
  ];

  let lastError: any = null;

  for (let i = 0; i < attempts.length; i++) {
    try {
      const { data, error } = await client
        .from('admissions')
        .insert([attempts[i]])
        .select();

      if (!error) {
        return {
          isSavedInSupabase: true,
          message: 'Saved in Supabase Successfully',
          data,
        };
      }

      lastError = error;
      // If error is NOT a column missing error, don't try other mappings, just break
      const isColumnMissing = error.message?.toLowerCase().includes('column') || 
                              error.message?.toLowerCase().includes('does not exist') ||
                              error.code === '42703';
      if (!isColumnMissing) {
        break;
      }
    } catch (err: any) {
      lastError = err;
      break;
    }
  }

  console.error('Supabase insert failed:', lastError);
  return {
    isSavedInSupabase: false,
    message: 'Submission failed to save in Supabase',
    details: lastError?.message || 'Error communicating with Supabase admissions table.',
  };
};
