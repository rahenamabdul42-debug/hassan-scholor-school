import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Central environment variables (configured in Vercel or .env.local)
const ENV_SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const ENV_SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Fallback storage key for local development override
const STORAGE_URL_KEY = 'hsps_supabase_url';
const STORAGE_KEY_KEY = 'hsps_supabase_anon_key';

/**
 * Recommended Row Level Security (RLS) script for Supabase:
 * Ensures anonymous public visitors can safely INSERT admission applications.
 */
export const SUPABASE_RLS_FIX_SQL = `-- ==============================================================
-- HASSAN SCHOLARS PUBLIC SCHOOL - ZAFARWAL
-- Safe Row Level Security (RLS) for Anonymous Visitors (INSERT)
-- ==============================================================

-- 1. Ensure table exists with standard columns
CREATE TABLE IF NOT EXISTS admissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  class TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous public visitors (the 'anon' role) to submit admission forms
DROP POLICY IF EXISTS "Allow public insert for admissions" ON admissions;
CREATE POLICY "Allow public insert for admissions" 
ON admissions 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- 4. Allow reading admissions (for status check or authenticated dashboard)
DROP POLICY IF EXISTS "Allow public read admissions" ON admissions;
CREATE POLICY "Allow public read admissions" 
ON admissions 
FOR SELECT 
TO anon, authenticated
USING (true);
`;

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) || '' : '';

  // Prioritize Vercel / Vite environment variables, fallback to local storage
  const url = (ENV_SUPABASE_URL || localUrl || '').trim();
  const anonKey = (ENV_SUPABASE_ANON_KEY || localKey || '').trim();

  return { url, anonKey };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
};

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

/**
 * Automatically initializes and returns the Supabase client.
 * Uses Vercel environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
 * Never exposes or uses the service_role key.
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    return null;
  }

  if (cachedClient && lastUsedUrl === url && lastUsedKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    lastUsedUrl = url;
    lastUsedKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

// Automatically initialize on module load
export const supabase = getSupabaseClient();

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
 * Inserts admission record into Supabase `admissions` table.
 * Designed specifically for anonymous visitors:
 * - Does not chain .select() during insert to prevent RLS read permission blocks.
 * - Supports automatic column fallbacks (class vs grade, phone_number vs phone).
 */
export const saveAdmissionRecord = async (
  payload: AdmissionPayload
): Promise<SupabaseSaveResult> => {
  const client = getSupabaseClient();

  if (!client) {
    return {
      isSavedInSupabase: false,
      message: 'Supabase configuration pending in Vercel',
      details: 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables are required in Vercel project settings.',
    };
  }

  // Schema variation attempts to match whatever columns exist in the user's `admissions` table
  const attempts = [
    // 1. Standard naming: class and phone_number
    {
      student_name: payload.student_name,
      father_name: payload.father_name,
      class: payload.grade,
      phone_number: payload.phone,
      address: payload.address,
    },
    // 2. Alternative naming: grade and phone
    {
      student_name: payload.student_name,
      father_name: payload.father_name,
      grade: payload.grade,
      phone: payload.phone,
      address: payload.address,
    },
    // 3. Alternative naming: class and phone
    {
      student_name: payload.student_name,
      father_name: payload.father_name,
      class: payload.grade,
      phone: payload.phone,
      address: payload.address,
    },
    // 4. Alternative naming: grade and phone_number
    {
      student_name: payload.student_name,
      father_name: payload.father_name,
      grade: payload.grade,
      phone_number: payload.phone,
      address: payload.address,
    },
    // 5. Title Case column names if created manually
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
      // NOTE: We avoid .select() here so that anonymous visitors do not get blocked
      // by RLS read restrictions if the table only has an INSERT policy!
      const { error } = await client
        .from('admissions')
        .insert([attempts[i]]);

      if (!error) {
        return {
          isSavedInSupabase: true,
          message: 'Saved in Supabase Successfully',
        };
      }

      lastError = error;

      // If the error is not about a missing column, do not keep trying other mappings
      const isColumnMissing =
        error.message?.toLowerCase().includes('column') ||
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

  console.error('Supabase admission insert error:', lastError);

  let userFriendlyDetails = lastError?.message || 'Unable to save record in Supabase admissions table.';
  if (lastError?.code === '42501' || userFriendlyDetails.toLowerCase().includes('row-level security')) {
    userFriendlyDetails = 'Row Level Security policy blocked anonymous insert. Please run the RLS policy script in your Supabase SQL editor.';
  } else if (lastError?.code === '42P01' || userFriendlyDetails.toLowerCase().includes('relation') || userFriendlyDetails.toLowerCase().includes('does not exist')) {
    userFriendlyDetails = 'The "admissions" table does not exist in your Supabase database. Please create it in Supabase SQL editor.';
  }

  return {
    isSavedInSupabase: false,
    message: 'Submission failed to save in Supabase',
    details: userFriendlyDetails,
  };
};
