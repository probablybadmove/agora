import 'react-native-url-polyfill/auto'; // URL support for supabase-js on native

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase is optional at build time: Agora ships with a bundled catalog so the site
 * works before any database exists. When these public env vars are set (see .env.example),
 * the catalog is served live from Supabase instead.
 *
 * Only the *publishable* (anon) key belongs here — it is safe to expose to the client and
 * is gated by row-level security (public read-only on the catalog tables).
 */
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: false },
    })
  : null;
