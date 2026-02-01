'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import Navbar from '@/components/Navbar'
import TeamScoreboard from '@/components/TeamScoreboard'
import UserStatsCard from '@/components/UserStatsCard'
import CompetitionProgress from '@/components/CompetitionProgress'
import RecentRuns from '@/components/RecentRuns'
import LogRunModal from '@/components/LogRunModal'
import { User, TeamScore, UserStats, Run } from '@/lib/types'

interface DashboardClientProps {
  user: User
  teamScores: TeamScore[]
  userStats: UserStats
  recentRuns: Run[]
}

export default function DashboardClient({
  user,
  teamScores,
  userStats,
  recentRuns,
}: DashboardClientProps) {
  const [showLogRunModal, setShowLogRunModal] = useState(false)

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar user={user} />
      
      <div className="pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome back, <span className={
                user.team_name === 'Alpha' ? 'text-alpha-red-400' : 'text-beta-gold-400'
              }>{user.username}</span>!
            </h1>
            <p className="text-dark-400">Ready to crush some kilometers today?</p>
          </div>

          {/* Team Scoreboard */}
          <TeamScoreboard teamScores={teamScores} />

          {/* Competition Progress */}
          <CompetitionProgress />

          {/* User Stats & Recent Runs Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <UserStatsCard stats={userStats} user={user} />
            <RecentRuns runs={recentRuns} />
          </div>
        </div>
      </div>

      {/* Floating Log Run Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setShowLogRunModal(true)}
          className={`flex items-center gap-2 px-6 py-4 rounded-full font-semibold shadow-2xl transition-all transform hover:scale-105 ${
            user.team_name === 'Alpha'
              ? 'bg-gradient-to-r from-alpha-red-600 to-alpha-red-700 text-white glow-alpha'
              : 'bg-gradient-to-r from-beta-gold-400 to-beta-gold-500 text-dark-900 glow-beta'
          }`}
        >
          <Plus className="w-5 h-5" />
          Log a Run
        </button>
      </div>

      {/* Log Run Modal */}
      <LogRunModal
        isOpen={showLogRunModal}
        onClose={() => setShowLogRunModal(false)}
        userId={user.id}
      />
    </div>
  )
}
