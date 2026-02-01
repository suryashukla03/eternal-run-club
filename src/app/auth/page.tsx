'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Flame, Users, Trophy, ArrowRight } from 'lucide-react'
import { TeamName } from '@/lib/constants'

export default function AuthPage() {
  const [selectedTeam, setSelectedTeam] = useState<TeamName | null>(null)
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      } else {
        setCheckingSession(false)
      }
    }
    checkSession()
  }, [router, supabase.auth])

  // Check for error in URL (from callback)
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
  }, [searchParams])

  const handleGoogleSignIn = async () => {
    setError(null)
    
    if (!selectedTeam) {
      setError('Please select a team first')
      return
    }

    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    setLoading(true)

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?team=${selectedTeam}&username=${encodeURIComponent(username.trim())}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (oauthError) throw oauthError
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="animate-spin h-8 w-8 border-2 border-alpha-red-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-dark-950">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-alpha-red-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-beta-gold-500/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-alpha-red-600 to-beta-gold-500 mb-4">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Eternal Run Club</h1>
          <p className="text-dark-400">50-Day Running Challenge</p>
        </div>

        {/* Auth Card */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Join the Challenge
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Choose Your Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter your username"
              />
            </div>

            {/* Team Selection */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-3">
                Choose Your Team
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Team Alpha */}
                <button
                  type="button"
                  onClick={() => setSelectedTeam('Alpha')}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    selectedTeam === 'Alpha'
                      ? 'border-alpha-red-500 bg-alpha-red-500/10'
                      : 'border-dark-600 hover:border-dark-500 bg-dark-800'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedTeam === 'Alpha' ? 'bg-alpha-red-600' : 'bg-alpha-red-600/50'
                    }`}>
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className={`font-semibold ${
                      selectedTeam === 'Alpha' ? 'text-alpha-red-400' : 'text-white'
                    }`}>
                      Team Alpha
                    </span>
                    <span className="text-xs text-dark-400">Red Warriors</span>
                  </div>
                  {selectedTeam === 'Alpha' && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-alpha-red-500 rounded-full" />
                  )}
                </button>

                {/* Team Beta */}
                <button
                  type="button"
                  onClick={() => setSelectedTeam('Beta')}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    selectedTeam === 'Beta'
                      ? 'border-beta-gold-500 bg-beta-gold-500/10'
                      : 'border-dark-600 hover:border-dark-500 bg-dark-800'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedTeam === 'Beta' ? 'bg-beta-gold-500' : 'bg-beta-gold-500/50'
                    }`}>
                      <Trophy className="w-6 h-6 text-dark-900" />
                    </div>
                    <span className={`font-semibold ${
                      selectedTeam === 'Beta' ? 'text-beta-gold-400' : 'text-white'
                    }`}>
                      Team Beta
                    </span>
                    <span className="text-xs text-dark-400">Gold Legends</span>
                  </div>
                  {selectedTeam === 'Beta' && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-beta-gold-500 rounded-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-gray-600" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <>
                  {/* Google Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <p className="text-xs text-dark-500 text-center">
              Sign in or sign up instantly with your Google account
            </p>
          </div>
        </div>

        {/* Competition Info */}
        <div className="mt-6 text-center">
          <p className="text-dark-400 text-sm">
            Competition runs from <span className="text-white font-medium">Feb 1</span> to{' '}
            <span className="text-white font-medium">March 22, 2026</span>
          </p>
        </div>
      </div>
    </div>
  )
}
