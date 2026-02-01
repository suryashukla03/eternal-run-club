import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const team = searchParams.get('team') || 'Alpha'
  const username = searchParams.get('username')
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

      // If no profile exists, create one
      if (!existingProfile) {
        // For Google OAuth, use username from URL params or derive from email/name
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
          // Redirect to auth with error
          return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent('Failed to create profile. Please try again.')}`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth?error=${encodeURIComponent('Authentication failed. Please try again.')}`)
}
