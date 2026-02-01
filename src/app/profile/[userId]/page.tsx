import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileClient from './ProfileClient'

interface ProfilePageProps {
  params: { userId: string }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const supabase = createClient()
  
  // Check auth
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) {
    redirect('/auth')
  }

  // Get current user profile
  const { data: currentUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (!currentUser) {
    redirect('/auth')
  }

  // Get profile user
  const { data: profileUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', params.userId)
    .single()

  if (!profileUser) {
    redirect('/leaderboard')
  }

  // Get user's runs with proof
  const { data: runs } = await supabase
    .from('runs')
    .select('*')
    .eq('user_id', params.userId)
    .order('run_date', { ascending: false })

  // Get user stats
  const { data: stats } = await supabase
    .from('runs')
    .select('distance_km, points')
    .eq('user_id', params.userId)

  const userStats = {
    total_points: stats?.reduce((sum, r) => sum + r.points, 0) || 0,
    total_runs: stats?.length || 0,
    total_distance: stats?.reduce((sum, r) => sum + r.distance_km, 0) || 0,
  }

  return (
    <ProfileClient
      currentUser={currentUser}
      profileUser={profileUser}
      runs={runs || []}
      stats={userStats}
    />
  )
}
