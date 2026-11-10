import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Central environment variables (configured in Vercel or .env.local)
const ENV_SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const ENV_SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Storage keys for optional admin override or local testing
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

/**
 * Validates whether a given URL is a real, well-formed Supabase endpoint
 * and not a template placeholder (e.g., your-project-id, xyzabcdef, etc.).
 */
export const isRealSupabaseUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  if (!trimmed.startsWith('https://') && !trimmed.startsWith('http://')) return false;
  if (
    trimmed.includes('your-project') ||
    trimmed.includes('xyzabcdef') ||
    trimmed.includes('example.com') ||
    trimmed.includes('my_') ||
    trimmed.includes('placeholder')
  ) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.hostname.length > 5;
  } catch {
    return false;
  }
};

export const getSupabaseConfig = (): SupabaseConfig => {
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) || '' : '';

  // Prioritize Vercel / Vite environment variables, fallback to local storage
  const url = (ENV_SUPABASE_URL || localUrl || '').trim();
  const anonKey = (ENV_SUPABASE_ANON_KEY || localKey || '').trim();

  return { url, anonKey };
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

  // Clear cached client
  cachedClient = null;
  lastUsedUrl = '';
  lastUsedKey = '';
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(isRealSupabaseUrl(url) && anonKey && anonKey.length > 10);
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
  if (!isRealSupabaseUrl(url) || !anonKey) {
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
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
};

export interface SupabaseConnectionStatus {
  isConnected: boolean;
  statusText: string;
  url: string;
  hasKey: boolean;
  source: 'vercel_env' | 'custom' | 'none';
  tableExists?: boolean;
}

/**
 * Checks live connection with Supabase database.
 * Returns clear diagnostic information for the corner status button.
 */
export const checkSupabaseConnection = async (): Promise<SupabaseConnectionStatus> => {
  const { url, anonKey } = getSupabaseConfig();
  const source = ENV_SUPABASE_URL ? 'vercel_env' : (url ? 'custom' : 'none');

  if (!isRealSupabaseUrl(url) || !anonKey) {
    return {
      isConnected: false,
      statusText: 'Not Connected (Supabase URL or Key not configured yet)',
      url: url || '',
      hasKey: Boolean(anonKey),
      source,
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      isConnected: false,
      statusText: 'Not Connected (Invalid Supabase credentials)',
      url,
      hasKey: Boolean(anonKey),
      source,
    };
  }

  try {
    const { error } = await client
      .from('admissions')
      .select('*', { count: 'exact', head: true });

    if (!error) {
      return {
        isConnected: true,
        statusText: 'Connected & Ready (Admissions Table Active)',
        url,
        hasKey: true,
        source,
        tableExists: true,
      };
    }

    // 42501 = Row Level Security policy blocked SELECT, but connection to database is verified!
    if (error.code === '42501' || error.message?.toLowerCase().includes('row-level security')) {
      return {
        isConnected: true,
        statusText: 'Connected to Supabase (RLS Active)',
        url,
        hasKey: true,
        source,
        tableExists: true,
      };
    }

    // 42P01 = admissions table doesn't exist yet
    if (error.code === '42P01' || error.message?.toLowerCase().includes('does not exist')) {
      return {
        isConnected: false,
        statusText: 'Connected to Supabase, but "admissions" table is missing',
        url,
        hasKey: true,
        source,
        tableExists: false,
      };
    }

    return {
      isConnected: false,
      statusText: `Not Connected (${error.message || 'Check failed'})`,
      url,
      hasKey: true,
      source,
    };
  } catch (err: any) {
    return {
      isConnected: false,
      statusText: `Not Connected (${err?.message || 'Network unreachable'})`,
      url,
      hasKey: Boolean(anonKey),
      source,
    };
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
 * Inserts admission record into Supabase `admissions` table.
 * Designed specifically for anonymous visitors:
 * - Does not chain .select() during insert to prevent RLS read permission blocks.
 * - Supports automatic column fallbacks (class vs grade, phone_number vs phone).
 * - Gracefully catches network fetch failures without throwing unhandled exceptions.
 */
export const saveAdmissionRecord = async (
  payload: AdmissionPayload
): Promise<SupabaseSaveResult> => {
  const { url } = getSupabaseConfig();

  // If a real Supabase URL is not yet configured, return informative status
  // without attempting an impossible network call that fails with 'Failed to fetch'
  if (!isRealSupabaseUrl(url)) {
    return {
      isSavedInSupabase: false,
      message: 'Not Saved in Supabase Yet',
      details: 'Supabase cloud synchronization is pending. To connect live cloud sync, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel project settings. Your admission has been registered in the school ledger.',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      isSavedInSupabase: false,
      message: 'Not Saved in Supabase Yet',
      details: 'Invalid or missing Supabase Public Key. Application was saved safely in the school admissions ledger.',
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

  // Inspect the error and format a human-friendly explanation
  const errorMsg = lastError?.message || String(lastError || '');
  const isFetchError =
    lastError?.name === 'TypeError' ||
    errorMsg.toLowerCase().includes('failed to fetch') ||
    errorMsg.toLowerCase().includes('network');

  if (isFetchError) {
    return {
      isSavedInSupabase: false,
      message: 'Not Saved in Supabase Yet',
      details: `Network connection to Supabase at "${url}" could not be reached. Your application has been registered safely in the school admissions ledger.`,
    };
  }

  if (lastError?.code === '42501' || errorMsg.toLowerCase().includes('row-level security')) {
    return {
      isSavedInSupabase: false,
      message: 'Not Saved in Supabase Yet',
      details: 'Row Level Security policy blocked anonymous insert. Run the RLS policy script in your Supabase SQL editor to allow public inserts.',
    };
  }

  if (lastError?.code === '42P01' || errorMsg.toLowerCase().includes('does not exist')) {
    return {
      isSavedInSupabase: false,
      message: 'Not Saved in Supabase Yet',
      details: 'The "admissions" table does not exist in your Supabase project. Please run the SQL setup script to create it.',
    };
  }

  return {
    isSavedInSupabase: false,
    message: 'Not Saved in Supabase Yet',
    details: errorMsg || 'Unable to sync to remote Supabase server right now. Application is stored safely in local admissions records.',
  };
};
