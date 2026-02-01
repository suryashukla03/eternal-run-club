import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LeaderboardClient from './LeaderboardClient'
import { TeamScore, LeaderboardEntry, User } from '@/lib/types'

export default async function LeaderboardPage() {
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
    redirect('/auth')
  }

  // Get team scores
  const { data: teamScoresData } = await supabase.rpc('get_team_scores')
  const teamScores: TeamScore[] = teamScoresData || []

  // Get individual leaderboard
  const { data: leaderboardData } = await supabase.rpc('get_leaderboard')
  const leaderboard: LeaderboardEntry[] = leaderboardData || []

  return (
    <LeaderboardClient
      user={userProfile as User}
      teamScores={teamScores}
      leaderboard={leaderboard}
    />
  )
}
