// Competition Constants
export const COMPETITION_START_DATE = new Date('2026-02-01T00:00:00')
export const COMPETITION_END_DATE = new Date('2026-03-22T23:59:59')

// Scoring Rules
export const MIN_SPEED_KMH = 6 // Minimum speed in km/h for points
export const MAX_PACE_MIN_PER_KM = 10 // Maximum pace in minutes per km (equivalent to 6 km/h)
export const SUBMISSION_WINDOW_HOURS = 24 // Hours allowed to submit a run after the run date

// Team Names
export type TeamName = 'Alpha' | 'Beta'

export const TEAM_COLORS = {
  Alpha: {
    primary: '#dc2626', // red-600
    secondary: '#991b1b', // red-800
    bg: 'bg-alpha-red-600',
    bgLight: 'bg-alpha-red-500/20',
    text: 'text-alpha-red-500',
    border: 'border-alpha-red-500',
    gradient: 'from-alpha-red-600 to-alpha-red-800',
  },
  Beta: {
    primary: '#eab308', // yellow-500
    secondary: '#a16207', // yellow-700
    bg: 'bg-beta-gold-500',
    bgLight: 'bg-beta-gold-500/20',
    text: 'text-beta-gold-400',
    border: 'border-beta-gold-400',
    gradient: 'from-beta-gold-500 to-beta-gold-700',
  },
} as const
