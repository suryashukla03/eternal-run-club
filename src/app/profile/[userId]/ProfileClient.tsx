'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { User, Run, UserStats } from '@/lib/types'
import { ArrowLeft, Trophy, Route, Activity, Calendar, Clock, Image as ImageIcon, X, Users, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProfileClientProps {
  currentUser: User
  profileUser: User
  runs: Run[]
  stats: UserStats
}

export default function ProfileClient({
  currentUser,
  profileUser,
  runs,
  stats,
}: ProfileClientProps) {
  const [selectedRun, setSelectedRun] = useState<Run | null>(null)
  const isOwnProfile = currentUser.id === profileUser.id
  const isAlpha = profileUser.team_name === 'Alpha'

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60)
    const minutes = mins % 60
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const calculatePace = (distance: number, duration: number) => {
    if (distance === 0) return '0:00'
    const paceMinutes = duration / distance
    const mins = Math.floor(paceMinutes)
    const secs = Math.round((paceMinutes - mins) * 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar user={currentUser} />
      
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Leaderboard
          </Link>

          {/* Profile Header */}
          <div className="card mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Avatar */}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold ${
                isAlpha 
                  ? 'bg-alpha-red-600/20 text-alpha-red-400' 
                  : 'bg-beta-gold-500/20 text-beta-gold-400'
              }`}>
                {profileUser.username.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-white">
                    {profileUser.username}
                    {isOwnProfile && <span className="text-dark-400 text-lg ml-2">(You)</span>}
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <span className={isAlpha ? 'team-badge-alpha' : 'team-badge-beta'}>
                    {isAlpha ? <Users className="w-3 h-3 mr-1 inline" /> : <Trophy className="w-3 h-3 mr-1 inline" />}
                    Team {profileUser.team_name}
                  </span>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
                <div>
                  <p className={`text-2xl font-bold ${isAlpha ? 'text-alpha-red-400' : 'text-beta-gold-400'}`}>
                    {stats.total_points}
                  </p>
                  <p className="text-xs text-dark-400">Points</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total_runs}</p>
                  <p className="text-xs text-dark-400">Runs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.total_distance.toFixed(1)}</p>
                  <p className="text-xs text-dark-400">KM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Runs List */}
          <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b border-dark-700">
              <h2 className="text-lg font-semibold text-white">Run History</h2>
              <p className="text-sm text-dark-400">{runs.length} runs logged</p>
            </div>

            {runs.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-dark-500" />
                </div>
                <p className="text-dark-400">No runs logged yet</p>
              </div>
            ) : (
              <div className="divide-y divide-dark-700/50">
                {runs.map((run) => (
                  <div
                    key={run.id}
                    className="p-4 hover:bg-dark-800/30 transition-colors cursor-pointer"
                    onClick={() => run.image_proof_url && setSelectedRun(run)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-dark-400" />
                          <span className="text-white font-medium">{formatDate(run.run_date)}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Route className="w-4 h-4 text-dark-400" />
                            <span className="text-dark-300">{run.distance_km.toFixed(2)} km</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-dark-400" />
                            <span className="text-dark-300">{formatDuration(run.duration_mins)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-dark-400" />
                            <span className="text-dark-300">{calculatePace(run.distance_km, run.duration_mins)} /km</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Trophy className={`w-4 h-4 ${isAlpha ? 'text-alpha-red-400' : 'text-beta-gold-400'}`} />
                            <span className={isAlpha ? 'text-alpha-red-400' : 'text-beta-gold-400'}>
                              +{run.points} pts
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Proof Thumbnail */}
                      {run.image_proof_url ? (
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-dark-700 flex-shrink-0 group">
                          <img
                            src={run.image_proof_url}
                            alt="Run proof"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-dark-700 flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-6 h-6 text-dark-500" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedRun && selectedRun.image_proof_url && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedRun(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-dark-800 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-dark-700">
              <div>
                <p className="text-white font-medium">{formatDate(selectedRun.run_date)}</p>
                <p className="text-sm text-dark-400">
                  {selectedRun.distance_km.toFixed(2)} km • {formatDuration(selectedRun.duration_mins)} • +{selectedRun.points} pts
                </p>
              </div>
              <button
                onClick={() => setSelectedRun(null)}
                className="p-2 rounded-lg hover:bg-dark-700 transition-colors"
              >
                <X className="w-5 h-5 text-dark-400" />
              </button>
            </div>
            
            {/* Image */}
            <div className="relative aspect-video bg-dark-900 flex items-center justify-center">
              <img
                src={selectedRun.image_proof_url}
                alt="Run proof"
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
