'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Flame, Users, Trophy, ArrowRight, Eye, EyeOff, Mail, CheckCircle } from 'lucide-react'
import { TeamName, TEAM_COLORS } from '@/lib/constants'

type AuthMode = 'login' | 'signup'

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<TeamName | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'signup') {
        if (!selectedTeam) {
          setError('Please select a team')
          setLoading(false)
          return
        }

        if (!username.trim()) {
          setError('Please enter a username')
          setLoading(false)
          return
        }

        // Sign up the user with metadata (profile will be created on email confirmation)
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              username: username.trim(),
              team_name: selectedTeam,
            }
          }
        })

        if (authError) throw authError

        // Check if email confirmation is required
        if (authData.user && !authData.session) {
          // Email confirmation is required
          setEmailSent(true)
        } else if (authData.user && authData.session) {
          // No email confirmation required, create profile and redirect
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: authData.user.email,
              username: username.trim(),
              team_name: selectedTeam,
            })

          if (profileError) throw profileError
          
          router.push('/dashboard')
          router.refresh()
        }
      } else {
        // Login
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (loginError) throw loginError

        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Email confirmation sent screen
  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-dark-950">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-64 h-64 bg-alpha-red-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-beta-gold-500/20 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="card text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Check Your Email!</h2>
            <p className="text-dark-400 mb-6">
              We've sent a confirmation link to<br />
              <span className="text-white font-medium">{email}</span>
            </p>
            <div className="p-4 rounded-lg bg-dark-800/50 text-left text-sm text-dark-300 space-y-2">
              <p>✓ Click the link in your email to confirm</p>
              <p>✓ You'll be redirected back to login</p>
              <p>✓ Then sign in with your password</p>
            </div>
            <button
              onClick={() => {
                setEmailSent(false)
                setMode('login')
              }}
              className="btn-secondary w-full mt-6"
            >
              Back to Login
            </button>
          </div>
        </div>
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
          {/* Tab Switcher */}
          <div className="flex rounded-lg bg-dark-900 p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'bg-dark-700 text-white'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-dark-700 text-white'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {/* Username (Signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  placeholder="Choose a username"
                  required
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Team Selection (Signup only) */}
            {mode === 'signup' && (
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
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  {mode === 'login' ? 'Logging in...' : 'Creating account...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {mode === 'login' ? 'Log In' : 'Join the Challenge'}
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>
          </form>
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
