import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
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

      // If no profile exists, create one from user metadata
      if (!existingProfile) {
        const metadata = user.user_metadata
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            username: metadata?.username || user.email?.split('@')[0] || 'runner',
            team_name: metadata?.team_name || 'Alpha',
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          // Redirect to auth with error
          return NextResponse.redirect(`${origin}/auth?error=profile_creation_failed`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth?error=auth_callback_error`)
}
