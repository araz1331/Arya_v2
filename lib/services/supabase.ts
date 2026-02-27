"use server";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseAdmin: SupabaseClient | null = null;

/**
 * Singleton Supabase admin client (service role) for server-side operations.
 * Use for bypassing RLS when needed (e.g. webhooks, cron).
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured");
    }
    supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  }
  return supabaseAdmin;
}

/**
 * Create a Supabase client for client-side use (anon key, respects RLS).
 * Call from server components or pass to client components.
 */
export function createSupabaseClient(accessToken?: string): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured");
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    ...(accessToken && {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    }),
  });
}
