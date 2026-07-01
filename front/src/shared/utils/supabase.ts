import { createBrowserClient } from '@supabase/ssr'

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl && supabaseUrl.includes('localhost')) {
  supabaseUrl = supabaseUrl.replace('localhost', '127.0.0.1');
}

export const supabase = createBrowserClient(
  supabaseUrl || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)
