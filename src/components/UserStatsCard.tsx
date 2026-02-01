'use client'

import { UserStats, User } from '@/lib/types'
import { Activity, Target, Route, TrendingUp } from 'lucide-react'

interface UserStatsCardProps {
  stats: UserStats
  user: User
}

export default function UserStatsCard({ stats, user }: UserStatsCardProps) {
  const isAlpha = user.team_name === 'Alpha'
  
  return (
    <div className={`card relative overflow-hidden ${
      isAlpha ? 'border-alpha-red-600/30' : 'border-beta-gold-500/30'
    }`}>
      {/* Background accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 ${
        isAlpha ? 'bg-alpha-red-600' : 'bg-beta-gold-500'
      }`} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Your Stats</h2>
            <p className="text-sm text-dark-400">Personal performance</p>
          </div>
          <div className={`px-3 py-1.5 rounded-full ${
            isAlpha 
              ? 'bg-alpha-red-600/20 text-alpha-red-400' 
              : 'bg-beta-gold-500/20 text-beta-gold-400'
          }`}>
            Team {user.team_name}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-dark-800/50">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
              isAlpha ? 'bg-alpha-red-600/20' : 'bg-beta-gold-500/20'
            }`}>
              <Target className={`w-5 h-5 ${
                isAlpha ? 'text-alpha-red-400' : 'text-beta-gold-400'
              }`} />
            </div>
            <p className="text-2xl font-bold text-white">{stats.total_points}</p>
            <p className="text-xs text-dark-400">Points</p>
          </div>

          <div className="text-center p-4 rounded-xl bg-dark-800/50">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
              isAlpha ? 'bg-alpha-red-600/20' : 'bg-beta-gold-500/20'
            }`}>
              <Activity className={`w-5 h-5 ${
                isAlpha ? 'text-alpha-red-400' : 'text-beta-gold-400'
              }`} />
            </div>
            <p className="text-2xl font-bold text-white">{stats.total_runs}</p>
            <p className="text-xs text-dark-400">Runs</p>
          </div>

          <div className="text-center p-4 rounded-xl bg-dark-800/50">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
              isAlpha ? 'bg-alpha-red-600/20' : 'bg-beta-gold-500/20'
            }`}>
              <Route className={`w-5 h-5 ${
                isAlpha ? 'text-alpha-red-400' : 'text-beta-gold-400'
              }`} />
            </div>
            <p className="text-2xl font-bold text-white">{stats.total_distance.toFixed(1)}</p>
            <p className="text-xs text-dark-400">KM</p>
          </div>
        </div>

        {/* Motivation */}
        <div className={`mt-4 p-3 rounded-lg ${
          isAlpha ? 'bg-alpha-red-600/10 border border-alpha-red-600/20' : 'bg-beta-gold-500/10 border border-beta-gold-500/20'
        }`}>
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${isAlpha ? 'text-alpha-red-400' : 'text-beta-gold-400'}`} />
            <span className="text-sm text-dark-300">
              {stats.total_runs > 0 
                ? `Avg ${(stats.total_distance / stats.total_runs).toFixed(1)} km per run`
                : 'Log your first run to start earning points!'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
