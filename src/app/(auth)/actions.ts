'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6)
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const DEMO_EMAIL = 'atelier.demo@civilagent.com'
const DEMO_PASSWORD = 'AtelierPassword2026!'

/**
 * 1-Click Instant Access: Logs in immediately without requiring any email verification.
 */
export async function instantDemoLogin() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  })

  if (error) {
    // If not yet created, register it
    await supabase.auth.signUp({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      options: {
        data: { full_name: 'Atelier Principal Architect' }
      }
    })
    await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    })
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = Object.fromEntries(formData)
  const validation = loginSchema.safeParse(data)
  
  if (!validation.success) {
    return { error: 'Invalid email or password format.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: validation.data.email,
    password: validation.data.password,
  })

  if (error) {
    const isUnconfirmed = error.message.toLowerCase().includes('not confirmed') || error.message.toLowerCase().includes('confirm');
    if (isUnconfirmed) {
      return { 
        error: 'Email verification is currently enabled in your Supabase project. Click "Instant Access" below to enter immediately without verification, or disable "Confirm email" in Supabase Auth settings.',
        showBypass: true
      }
    }
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = Object.fromEntries(formData)
  const validation = signupSchema.safeParse(data)

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  const { error: signUpError } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
    options: {
      data: {
        full_name: validation.data.name,
      },
    },
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  // Attempt immediate session sign-in
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: validation.data.email,
    password: validation.data.password,
  })

  if (signInData?.session) {
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  // If Supabase has email confirmation enabled in dashboard
  if (signInError && (signInError.message.toLowerCase().includes('not confirmed') || signInError.message.toLowerCase().includes('confirm'))) {
    return { 
      error: 'Account created! To allow instant login without email verification, turn off "Confirm email" in Supabase -> Auth -> Providers -> Email. You can also click "Instant Access" below to enter right now.',
      showBypass: true
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
