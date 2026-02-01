'use client'

import { getCompetitionProgress } from '@/lib/scoring'
import { Calendar, Clock, Zap } from 'lucide-react'
import { COMPETITION_START_DATE, COMPETITION_END_DATE } from '@/lib/constants'

export default function CompetitionProgress() {
  const progress = getCompetitionProgress()

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Competition Progress</h2>
        <div className="flex items-center gap-1.5 text-sm">
          <Clock className="w-4 h-4 text-dark-400" />
          <span className={progress.daysRemaining > 0 ? 'text-green-400' : 'text-dark-400'}>
            {progress.daysRemaining > 0 ? `${progress.daysRemaining} days left` : 'Competition ended'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500 relative"
            style={{ width: `${progress.percentComplete}%` }}
          >
            <div className="absolute inset-0 animate-shimmer" />
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-dark-400">
          <span>Day {progress.daysElapsed}</span>
          <span>{progress.percentComplete.toFixed(1)}%</span>
          <span>Day {progress.totalDays}</span>
        </div>
      </div>

      {/* Date Range */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-dark-400">
          <Calendar className="w-4 h-4" />
          <span>{COMPETITION_START_DATE.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-400">
          <Zap className="w-4 h-4" />
          <span className="font-medium">50 Days</span>
        </div>
        <div className="flex items-center gap-2 text-dark-400">
          <Calendar className="w-4 h-4" />
          <span>{COMPETITION_END_DATE.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  )
}
