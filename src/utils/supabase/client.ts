import { createBrowserClient } from '@supabase/ssr'

const DEFAULT_SUPABASE_URL = "https://kfezydsnhlvaldvnntux.supabase.co"
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmZXp5ZHNuaGx2YWxkdm5udHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NjY0MjgsImV4cCI6MjEwNjU0MjQyOH0.qJxmXSfZWP72xzAh5f_wLzbYHpQf01rqHJApYQ2okEw"

export function createClient() {
  const supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    DEFAULT_SUPABASE_URL
  )?.trim().replace(/^["']|["']$/g, '')

  const supabaseKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY ||
    DEFAULT_SUPABASE_ANON_KEY
  )?.trim().replace(/^["']|["']$/g, '')

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}
