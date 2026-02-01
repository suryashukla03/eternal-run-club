import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    // Get team scores using the RPC function
    const { data: teamScores, error } = await supabase.rpc('get_team_scores')

    if (error) {
      console.error('Query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch team scores' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: teamScores })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
