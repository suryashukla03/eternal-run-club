'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { User, TeamScore, LeaderboardEntry } from '@/lib/types'
import { Trophy, Users, Medal, TrendingUp, Route, Activity, ChevronRight } from 'lucide-react'

interface LeaderboardClientProps {
  user: User
  teamScores: TeamScore[]
  leaderboard: LeaderboardEntry[]
}

type TabType = 'teams' | 'individuals'

export default function LeaderboardClient({
  user,
  teamScores,
  leaderboard,
}: LeaderboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('teams')

  const alphaScore = teamScores.find(t => t.team === 'Alpha') || { team: 'Alpha' as const, total_points: 0, total_runs: 0, total_distance: 0 }
  const betaScore = teamScores.find(t => t.team === 'Beta') || { team: 'Beta' as const, total_points: 0, total_runs: 0, total_distance: 0 }
  
  const maxPoints = Math.max(alphaScore.total_points, betaScore.total_points, 1)

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar user={user} />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Leaderboard</h1>
            <p className="text-dark-400">Who's winning the battle?</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-dark-800 p-1.5 mb-6">
            <button
              onClick={() => setActiveTab('teams')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'teams'
                  ? 'bg-dark-700 text-white'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Teams
            </button>
            <button
              onClick={() => setActiveTab('individuals')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'individuals'
                  ? 'bg-dark-700 text-white'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              Individuals
            </button>
          </div>

          {/* Teams View */}
          {activeTab === 'teams' && (
            <div className="space-y-6">
              {/* Visual Comparison */}
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-6 text-center">Points Battle</h3>
                
                <div className="space-y-6">
                  {/* Team Alpha Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-alpha-red-600/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-alpha-red-500" />
                        </div>
                        <span className="font-semibold text-alpha-red-400">Team Alpha</span>
                      </div>
                      <span className="text-2xl font-bold text-white">{alphaScore.total_points}</span>
                    </div>
                    <div className="h-8 bg-dark-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-alpha-red-600 to-alpha-red-500 rounded-full transition-all duration-700"
                        style={{ width: `${(alphaScore.total_points / maxPoints) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Team Beta Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-beta-gold-500/20 flex items-center justify-center">
                          <Trophy className="w-5 h-5 text-beta-gold-400" />
                        </div>
                        <span className="font-semibold text-beta-gold-400">Team Beta</span>
                      </div>
                      <span className="text-2xl font-bold text-white">{betaScore.total_points}</span>
                    </div>
                    <div className="h-8 bg-dark-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-beta-gold-500 to-beta-gold-400 rounded-full transition-all duration-700"
                        style={{ width: `${(betaScore.total_points / maxPoints) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Stats Comparison */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Team Alpha Card */}
                <div className="card border-alpha-red-600/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-alpha-red-600/10 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-alpha-red-600 flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Team Alpha</h3>
                        <p className="text-xs text-dark-400">Red Warriors</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-alpha-red-400">{alphaScore.total_points}</p>
                        <p className="text-xs text-dark-400">Points</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{alphaScore.total_runs}</p>
                        <p className="text-xs text-dark-400">Runs</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{alphaScore.total_distance.toFixed(0)}</p>
                        <p className="text-xs text-dark-400">KM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Beta Card */}
                <div className="card border-beta-gold-500/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-beta-gold-500/10 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-beta-gold-500 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-dark-900" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Team Beta</h3>
                        <p className="text-xs text-dark-400">Gold Legends</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-beta-gold-400">{betaScore.total_points}</p>
                        <p className="text-xs text-dark-400">Points</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{betaScore.total_runs}</p>
                        <p className="text-xs text-dark-400">Runs</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{betaScore.total_distance.toFixed(0)}</p>
                        <p className="text-xs text-dark-400">KM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Individuals View */}
          {activeTab === 'individuals' && (
            <div className="card p-0 overflow-hidden">
              {/* Table Header - Hidden on mobile */}
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-dark-800/50 border-b border-dark-700 text-sm font-medium text-dark-400">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-4">Runner</div>
                <div className="col-span-2 text-center">Team</div>
                <div className="col-span-2 text-right">Points</div>
                <div className="col-span-1 text-right">Runs</div>
                <div className="col-span-2 text-right">Distance</div>
              </div>

              {/* Leaderboard Entries */}
              <div className="divide-y divide-dark-700/50">
                {leaderboard.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-dark-500" />
                    </div>
                    <p className="text-dark-400">No runners yet. Be the first to log a run!</p>
                  </div>
                ) : (
                  leaderboard.map((entry, index) => {
                    const rank = index + 1
                    const isCurrentUser = entry.user_id === user.id
                    const isAlpha = entry.team === 'Alpha'

                    return (
                      <Link
                        href={`/profile/${entry.user_id}`}
                        key={entry.user_id}
                        className={`block p-4 transition-colors ${
                          isCurrentUser 
                            ? isAlpha 
                              ? 'bg-alpha-red-600/5 hover:bg-alpha-red-600/10' 
                              : 'bg-beta-gold-500/5 hover:bg-beta-gold-500/10'
                            : 'hover:bg-dark-800/50'
                        }`}
                      >
                        {/* Mobile Layout */}
                        <div className="sm:hidden">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {/* Rank */}
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                                rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                                rank === 3 ? 'bg-orange-600/20 text-orange-400' :
                                'bg-dark-700 text-dark-400'
                              }`}>
                                {rank <= 3 ? <Medal className="w-4 h-4" /> : rank}
                              </div>
                              
                              {/* Name */}
                              <div>
                                <span className={`font-medium ${isCurrentUser ? 'text-white' : 'text-dark-200'}`}>
                                  {entry.username}
                                  {isCurrentUser && <span className="text-xs text-dark-400 ml-1">(You)</span>}
                                </span>
                                <div className="mt-0.5">
                                  <span className={isAlpha ? 'team-badge-alpha' : 'team-badge-beta'}>
                                    {entry.team}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Points & Arrow */}
                            <div className="flex items-center gap-2">
                              <div className={`text-xl font-bold ${
                                isAlpha ? 'text-alpha-red-400' : 'text-beta-gold-400'
                              }`}>
                                {entry.total_points}
                              </div>
                              <ChevronRight className="w-4 h-4 text-dark-500" />
                            </div>
                          </div>
                          
                          {/* Stats */}
                          <div className="flex items-center gap-4 ml-11 text-sm text-dark-400">
                            <span className="flex items-center gap-1">
                              <Activity className="w-3.5 h-3.5" />
                              {entry.total_runs} runs
                            </span>
                            <span className="flex items-center gap-1">
                              <Route className="w-3.5 h-3.5" />
                              {entry.total_distance.toFixed(1)} km
                            </span>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
                          {/* Rank */}
                          <div className="col-span-1 flex justify-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                              rank === 2 ? 'bg-gray-400/20 text-gray-300' :
                              rank === 3 ? 'bg-orange-600/20 text-orange-400' :
                              'bg-dark-700 text-dark-400'
                            }`}>
                              {rank <= 3 ? <Medal className="w-4 h-4" /> : rank}
                            </div>
                          </div>

                          {/* Name */}
                          <div className="col-span-4 flex items-center gap-2">
                            <span className={`font-medium ${isCurrentUser ? 'text-white' : 'text-dark-200'}`}>
                              {entry.username}
                            </span>
                            {isCurrentUser && <span className="text-xs text-dark-400">(You)</span>}
                            <ChevronRight className="w-4 h-4 text-dark-500 ml-auto" />
                          </div>

                          {/* Team Badge */}
                          <div className="col-span-2 flex justify-center">
                            <span className={isAlpha ? 'team-badge-alpha' : 'team-badge-beta'}>
                              {entry.team}
                            </span>
                          </div>

                          {/* Points */}
                          <div className={`col-span-2 text-right font-bold ${
                            isAlpha ? 'text-alpha-red-400' : 'text-beta-gold-400'
                          }`}>
                            {entry.total_points}
                          </div>

                          {/* Runs */}
                          <div className="col-span-1 text-right text-dark-300">
                            {entry.total_runs}
                          </div>

                          {/* Distance */}
                          <div className="col-span-2 text-right text-dark-300">
                            {entry.total_distance.toFixed(1)} km
                          </div>
                        </div>
                      </Link>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
