import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'
import { TeamScore, UserStats, Run, User } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = createClient()
  
  // Get authenticated user
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    redirect('/auth')
  }

  // Get user profile
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (!userProfile) {
    // User authenticated but no profile, redirect to auth
    redirect('/auth')
  }

  // Get team scores
  const { data: teamScoresData } = await supabase.rpc('get_team_scores')
  const teamScores: TeamScore[] = teamScoresData || []

  // Get user stats
  const { data: userStatsData } = await supabase.rpc('get_user_stats', { p_user_id: authUser.id })
  const userStats: UserStats = userStatsData?.[0] || { total_points: 0, total_runs: 0, total_distance: 0 }

  // Get recent runs for the user
  const { data: runsData } = await supabase
    .from('runs')
    .select('*')
    .eq('user_id', authUser.id)
    .order('run_date', { ascending: false })
    .limit(5)
  
  const recentRuns: Run[] = runsData || []

  return (
    <DashboardClient
      user={userProfile as User}
      teamScores={teamScores}
      userStats={userStats}
      recentRuns={recentRuns}
    />
  )
}
