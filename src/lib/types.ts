import { TeamName } from './constants'

export interface User {
  id: string
  email: string
  username: string
  team_name: TeamName
  created_at: string
}

export interface Run {
  id: string
  user_id: string
  distance_km: number
  duration_mins: number
  points: number
  image_proof_url: string | null
  run_date: string
  created_at: string
  user?: User
}

export interface TeamScore {
  team: TeamName
  total_points: number
  total_runs: number
  total_distance: number
}

export interface LeaderboardEntry {
  user_id: string
  username: string
  team: TeamName
  total_points: number
  total_runs: number
  total_distance: number
}

export interface UserStats {
  total_points: number
  total_runs: number
  total_distance: number
}

export interface RunFormData {
  run_date: string
  distance_km: number
  duration_hours: number
  duration_minutes: number
  image?: File
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}
