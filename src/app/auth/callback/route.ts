import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const team = searchParams.get('team') || 'Alpha'
  const username = searchParams.get('username')
  const mode = searchParams.get('mode') || 'login'
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    
    // Exchange the code for a session
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && user) {
      // Check if user profile exists
      const { data: existingProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()

      if (mode === 'login') {
        // Login mode - user must have an existing profile
        if (!existingProfile) {
          // Sign out the user since they don't have a profile
          await supabase.auth.signOut()
          return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent('No account found. Please sign up first.')}`)
        }
        return NextResponse.redirect(`${origin}${next}`)
      }

      // Signup mode - create profile if it doesn't exist
      if (!existingProfile) {
        const finalUsername = username || 
          user.user_metadata?.full_name?.replace(/\s+/g, '_').toLowerCase() ||
          user.email?.split('@')[0] || 
          'runner'
        
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            username: finalUsername,
            team_name: team as 'Alpha' | 'Beta',
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          await supabase.auth.signOut()
          return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent('Failed to create profile. Please try again.')}`)
        }
      } else {
        // User already exists - sign them out and tell them to log in
        await supabase.auth.signOut()
        return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent('Account already exists with this email. Please log in instead.')}`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent('Authentication failed. Please try again.')}`)
}
