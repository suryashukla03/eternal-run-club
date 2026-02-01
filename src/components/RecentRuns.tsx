'use client'

import { Run } from '@/lib/types'
import { formatDuration, formatPace, calculatePace } from '@/lib/scoring'
import { Calendar, Route, Clock, Award, ExternalLink } from 'lucide-react'

interface RecentRunsProps {
  runs: Run[]
}

export default function RecentRuns({ runs }: RecentRunsProps) {
  if (runs.length === 0) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Runs</h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-4">
            <Route className="w-8 h-8 text-dark-500" />
          </div>
          <p className="text-dark-400">No runs logged yet</p>
          <p className="text-sm text-dark-500 mt-1">Start running to see your activity here!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-white mb-4">Recent Runs</h2>
      <div className="space-y-3">
        {runs.slice(0, 5).map((run) => {
          const pace = calculatePace(run.distance_km, run.duration_mins)
          const runDate = new Date(run.run_date)
          
          return (
            <div 
              key={run.id}
              className="p-4 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1.5 text-sm text-dark-400">
                      <Calendar className="w-4 h-4" />
                      {runDate.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    {run.image_proof_url && (
                      <a 
                        href={run.image_proof_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-dark-400 hover:text-white flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Proof
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Route className="w-4 h-4 text-green-400" />
                      <span className="font-semibold text-white">{run.distance_km.toFixed(2)} km</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-dark-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{formatDuration(run.duration_mins)}</span>
                    </div>
                    <div className="text-xs text-dark-500">
                      {formatPace(pace)}
                    </div>
                  </div>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                  run.points > 0 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-dark-700 text-dark-400'
                }`}>
                  <Award className="w-4 h-4" />
                  <span className="font-semibold">{run.points}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
