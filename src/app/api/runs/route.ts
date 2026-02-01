import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { validateRun } from '@/lib/scoring'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { distance_km, duration_mins, run_date, image_proof_url } = body

    // Validate required fields
    if (!distance_km || !duration_mins || !run_date) {
      return NextResponse.json(
        { error: 'Missing required fields: distance_km, duration_mins, run_date' },
        { status: 400 }
      )
    }

    // Validate the run
    const validation = validateRun({
      distanceKm: parseFloat(distance_km),
      durationMins: parseInt(duration_mins),
      runDate: new Date(run_date),
    })

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errors.join('. ') },
        { status: 400 }
      )
    }

    // Check if user already has a run for this date
    const { data: existingRun } = await supabase
      .from('runs')
      .select('id')
      .eq('user_id', user.id)
      .eq('run_date', run_date)
      .single()

    if (existingRun) {
      return NextResponse.json(
        { error: 'You have already logged a run for this date. Only one run per day is allowed.' },
        { status: 400 }
      )
    }

    // Insert the run
    const { data: newRun, error: insertError } = await supabase
      .from('runs')
      .insert({
        user_id: user.id,
        distance_km: parseFloat(distance_km),
        duration_mins: parseInt(duration_mins),
        points: validation.points,
        image_proof_url: image_proof_url || null,
        run_date: run_date,
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to log run. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: newRun,
      points: validation.points,
      warnings: validation.warnings,
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabase
      .from('runs')
      .select('*, user:users(username, team_name)')
      .order('run_date', { ascending: false })
      .limit(limit)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: runs, error } = await query

    if (error) {
      console.error('Query error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch runs' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: runs })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
