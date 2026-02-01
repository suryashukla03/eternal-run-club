import {
  COMPETITION_START_DATE,
  COMPETITION_END_DATE,
  MIN_SPEED_KMH,
  SUBMISSION_WINDOW_HOURS,
} from './constants'

export interface RunValidationResult {
  isValid: boolean
  points: number
  errors: string[]
  warnings: string[]
}

export interface CalculatePointsInput {
  distanceKm: number
  durationMins: number
  runDate: Date
}

/**
 * Calculates points for a run based on distance and pace.
 * Points = floor(distance in km) if pace is acceptable (speed >= 6 km/h)
 * Points = 0 if pace is too slow (speed < 6 km/h)
 */
export function calculatePoints(distanceKm: number, durationMins: number): number {
  // Calculate speed in km/h
  const durationHours = durationMins / 60
  const speedKmh = distanceKm / durationHours

  // If speed is below minimum (pace too slow), award 0 points
  if (speedKmh < MIN_SPEED_KMH) {
    return 0
  }

  // Round down the distance to get points (1 km = 1 point)
  return Math.floor(distanceKm)
}

/**
 * Calculates pace in minutes per kilometer
 */
export function calculatePace(distanceKm: number, durationMins: number): number {
  if (distanceKm <= 0) return 0
  return durationMins / distanceKm
}

/**
 * Calculates speed in km/h
 */
export function calculateSpeed(distanceKm: number, durationMins: number): number {
  const durationHours = durationMins / 60
  if (durationHours <= 0) return 0
  return distanceKm / durationHours
}

/**
 * Formats pace as "X:XX min/km"
 */
export function formatPace(paceMinPerKm: number): string {
  const mins = Math.floor(paceMinPerKm)
  const secs = Math.round((paceMinPerKm - mins) * 60)
  return `${mins}:${secs.toString().padStart(2, '0')} min/km`
}

/**
 * Formats duration as "Xh Xm" or "Xm"
 */
export function formatDuration(totalMins: number): string {
  const hours = Math.floor(totalMins / 60)
  const mins = totalMins % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

/**
 * Checks if a date is within the competition period
 */
export function isWithinCompetitionPeriod(date: Date): boolean {
  const checkDate = new Date(date)
  // Reset time for comparison
  checkDate.setHours(0, 0, 0, 0)
  
  const startDate = new Date(COMPETITION_START_DATE)
  startDate.setHours(0, 0, 0, 0)
  
  const endDate = new Date(COMPETITION_END_DATE)
  endDate.setHours(23, 59, 59, 999)

  return checkDate >= startDate && checkDate <= endDate
}

/**
 * Checks if submission is within the 24-hour window
 */
export function isWithinSubmissionWindow(runDate: Date): boolean {
  const now = new Date()
  const runDateTime = new Date(runDate)
  
  // Set run date to end of day for comparison
  runDateTime.setHours(23, 59, 59, 999)
  
  // Calculate hours difference
  const hoursDiff = (now.getTime() - runDateTime.getTime()) / (1000 * 60 * 60)
  
  // Run date should not be in the future
  const runDateStart = new Date(runDate)
  runDateStart.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (runDateStart > today) {
    return false
  }
  
  // Must be within 24 hours of the run date
  return hoursDiff <= SUBMISSION_WINDOW_HOURS
}

/**
 * Comprehensive validation for a run submission
 */
export function validateRun(input: CalculatePointsInput): RunValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  let points = 0

  // Check if run date is within competition period
  if (!isWithinCompetitionPeriod(input.runDate)) {
    errors.push(
      `Run date must be between ${COMPETITION_START_DATE.toLocaleDateString()} and ${COMPETITION_END_DATE.toLocaleDateString()}`
    )
  }

  // Check if submission is within 24-hour window
  if (!isWithinSubmissionWindow(input.runDate)) {
    errors.push('Runs must be logged within 24 hours of the run date')
  }

  // Validate distance
  if (input.distanceKm <= 0) {
    errors.push('Distance must be greater than 0')
  }

  // Validate duration
  if (input.durationMins <= 0) {
    errors.push('Duration must be greater than 0')
  }

  // If basic validation passes, calculate points
  if (errors.length === 0) {
    const speed = calculateSpeed(input.distanceKm, input.durationMins)
    const pace = calculatePace(input.distanceKm, input.durationMins)

    if (speed < MIN_SPEED_KMH) {
      warnings.push(
        `Pace too slow (${formatPace(pace)}). Minimum speed is ${MIN_SPEED_KMH} km/h. Run logged with 0 points.`
      )
      points = 0
    } else {
      points = calculatePoints(input.distanceKm, input.durationMins)
    }
  }

  return {
    isValid: errors.length === 0,
    points,
    errors,
    warnings,
  }
}

/**
 * Get the competition progress (days elapsed / total days)
 */
export function getCompetitionProgress(): {
  daysElapsed: number
  totalDays: number
  percentComplete: number
  daysRemaining: number
} {
  const now = new Date()
  const start = new Date(COMPETITION_START_DATE)
  const end = new Date(COMPETITION_END_DATE)

  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  
  let daysElapsed = 0
  if (now >= start) {
    daysElapsed = Math.min(
      Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
      totalDays
    )
  }

  const daysRemaining = Math.max(0, totalDays - daysElapsed)
  const percentComplete = Math.min(100, (daysElapsed / totalDays) * 100)

  return {
    daysElapsed,
    totalDays,
    percentComplete,
    daysRemaining,
  }
}

/**
 * Format date as YYYY-MM-DD for input fields
 */
export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Get today's date at midnight
 */
export function getTodayDate(): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}
