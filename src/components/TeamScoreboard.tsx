'use client'

import { TeamScore } from '@/lib/types'
import { Users, Flame, Trophy } from 'lucide-react'

interface TeamScoreboardProps {
  teamScores: TeamScore[]
}

export default function TeamScoreboard({ teamScores }: TeamScoreboardProps) {
  const alphaScore = teamScores.find(t => t.team === 'Alpha') || { team: 'Alpha' as const, total_points: 0, total_runs: 0, total_distance: 0 }
  const betaScore = teamScores.find(t => t.team === 'Beta') || { team: 'Beta' as const, total_points: 0, total_runs: 0, total_distance: 0 }
  
  const totalPoints = alphaScore.total_points + betaScore.total_points
  const alphaPercentage = totalPoints > 0 ? (alphaScore.total_points / totalPoints) * 100 : 50
  const betaPercentage = totalPoints > 0 ? (betaScore.total_points / totalPoints) * 100 : 50

  const leadingTeam = alphaScore.total_points > betaScore.total_points ? 'Alpha' : 
                      betaScore.total_points > alphaScore.total_points ? 'Beta' : 'Tied'

  return (
    <div className="card relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-alpha-red-600/30 to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-beta-gold-500/30 to-transparent" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-alpha-red-500" />
            <h2 className="text-lg font-semibold text-white">Team Battle</h2>
            <Trophy className="w-5 h-5 text-beta-gold-400" />
          </div>
          {leadingTeam !== 'Tied' && (
            <p className="text-sm text-dark-400">
              <span className={leadingTeam === 'Alpha' ? 'text-alpha-red-400' : 'text-beta-gold-400'}>
                Team {leadingTeam}
              </span>
              {' '}is in the lead!
            </p>
          )}
        </div>

        {/* Score Display */}
        <div className="flex items-center justify-between mb-6">
          {/* Team Alpha */}
          <div className="text-center flex-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-alpha-red-600/20 mb-2">
              <Users className="w-6 h-6 text-alpha-red-500" />
            </div>
            <h3 className="text-sm font-medium text-alpha-red-400 mb-1">Team Alpha</h3>
            <p className="text-4xl font-bold text-white mb-1">{alphaScore.total_points.toLocaleString()}</p>
            <p className="text-xs text-dark-400">points</p>
          </div>

          {/* VS Divider */}
          <div className="flex-shrink-0 px-4">
            <div className="w-12 h-12 rounded-full bg-dark-700 flex items-center justify-center">
              <span className="text-lg font-bold text-dark-400">VS</span>
            </div>
          </div>

          {/* Team Beta */}
          <div className="text-center flex-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-beta-gold-500/20 mb-2">
              <Trophy className="w-6 h-6 text-beta-gold-400" />
            </div>
            <h3 className="text-sm font-medium text-beta-gold-400 mb-1">Team Beta</h3>
            <p className="text-4xl font-bold text-white mb-1">{betaScore.total_points.toLocaleString()}</p>
            <p className="text-xs text-dark-400">points</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-4 bg-dark-700 rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-gradient-to-r from-alpha-red-600 to-alpha-red-500 transition-all duration-500"
              style={{ width: `${alphaPercentage}%` }}
            />
            <div 
              className="h-full bg-gradient-to-l from-beta-gold-500 to-beta-gold-400 transition-all duration-500"
              style={{ width: `${betaPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-dark-400">
            <span>{alphaPercentage.toFixed(1)}%</span>
            <span>{betaPercentage.toFixed(1)}%</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-dark-700">
          <div className="text-center">
            <p className="text-sm text-dark-400 mb-1">Total Runs</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-alpha-red-400 font-semibold">{alphaScore.total_runs}</span>
              <span className="text-dark-600">|</span>
              <span className="text-beta-gold-400 font-semibold">{betaScore.total_runs}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-dark-400 mb-1">Total Distance</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-alpha-red-400 font-semibold">{alphaScore.total_distance.toFixed(1)} km</span>
              <span className="text-dark-600">|</span>
              <span className="text-beta-gold-400 font-semibold">{betaScore.total_distance.toFixed(1)} km</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
