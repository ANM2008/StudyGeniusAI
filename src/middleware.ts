import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/study-guide', '/flashcards', '/generate'] // Add all routes that need auth
const authRoutes = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request and response cookies
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request and response cookies
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh session if expired - important!
  await supabase.auth.getUser()

  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = request.nextUrl

  // --- Authentication Logic ---

  // If user IS authenticated
  if (session) {
    // Redirect away from auth pages and root if logged in
    if ([...authRoutes, '/'].includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // Allow access to all other pages (including protected ones)
    return response
  }

  // If user IS NOT authenticated
  else {
    // Redirect to login if trying to access a protected route
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // Allow access to root, login, signup, and auth callback
    if (['/', ...authRoutes, '/auth/callback'].includes(pathname)) {
        // Allow the request to proceed. The root page.tsx will handle the redirect to /login if needed.
        return response
    }
    // Optional: Redirect any other unhandled path to login if not authenticated
    // Uncomment the line below if you want ALL other paths to require login
    // return NextResponse.redirect(new URL('/login', request.url))
  }

  // Default: Allow the request if none of the above conditions met
  // (Should primarily be for public, non-auth, non-protected routes if any exist)
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}