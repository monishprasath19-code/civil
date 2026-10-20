import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL
  )?.trim().replace(/^["']|["']$/g, '')

  const supabaseKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  )?.trim().replace(/^["']|["']$/g, '')

  return createBrowserClient(
    supabaseUrl || '',
    supabaseKey || ''
  )
}
