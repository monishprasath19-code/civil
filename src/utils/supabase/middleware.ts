import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const DEFAULT_SUPABASE_URL = "https://kfezydsnhlvaldvnntux.supabase.co"
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmZXp5ZHNuaGx2YWxkdm5udHV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NjY0MjgsImV4cCI6MjEwNjU0MjQyOH0.qJxmXSfZWP72xzAh5f_wLzbYHpQf01rqHJApYQ2okEw"

export async function updateSession(request: NextRequest) {
  const supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    DEFAULT_SUPABASE_URL
  )?.trim().replace(/^["']|["']$/g, '');

  const supabaseKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY ||
    DEFAULT_SUPABASE_ANON_KEY
  )?.trim().replace(/^["']|["']$/g, '');

  let supabaseResponse = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (
      !user &&
      request.nextUrl.pathname.startsWith('/dashboard')
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    if (
      user &&
      (request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup'))
    ) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (error) {
    console.error('Middleware updateSession error:', error);
    return NextResponse.next({ request });
  }
}
