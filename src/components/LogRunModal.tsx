'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X, Upload, Route, Clock, Calendar, AlertCircle, Loader2, Check, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { 
  validateRun, 
  calculatePoints, 
  calculateSpeed,
  formatDateForInput,
  formatPace,
  calculatePace
} from '@/lib/scoring'
import { MIN_SPEED_KMH, COMPETITION_START_DATE, COMPETITION_END_DATE } from '@/lib/constants'
import confetti from 'canvas-confetti'

interface LogRunModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
}

export default function LogRunModal({ isOpen, onClose, userId }: LogRunModalProps) {
  const [runDate, setRunDate] = useState(formatDateForInput(new Date()))
  const [distanceKm, setDistanceKm] = useState('')
  const [durationHours, setDurationHours] = useState('0')
  const [durationMins, setDurationMins] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const [success, setSuccess] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setRunDate(formatDateForInput(new Date()))
      setDistanceKm('')
      setDurationHours('0')
      setDurationMins('')
      setImageFile(null)
      setImagePreview(null)
      setError(null)
      setWarnings([])
      setSuccess(false)
    }
  }, [isOpen])

  // Calculate preview stats
  const distance = parseFloat(distanceKm) || 0
  const totalMinutes = (parseInt(durationHours) || 0) * 60 + (parseInt(durationMins) || 0)
  const speed = totalMinutes > 0 ? calculateSpeed(distance, totalMinutes) : 0
  const pace = distance > 0 && totalMinutes > 0 ? calculatePace(distance, totalMinutes) : 0
  const estimatedPoints = distance > 0 && totalMinutes > 0 ? calculatePoints(distance, totalMinutes) : 0
  const isPaceTooSlow = speed > 0 && speed < MIN_SPEED_KMH

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerConfetti = () => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 }
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })
    fire(0.2, {
      spread: 60,
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setWarnings([])
    setLoading(true)

    try {
      const totalDurationMins = (parseInt(durationHours) || 0) * 60 + (parseInt(durationMins) || 0)
      const runDateObj = new Date(runDate)

      // Validate the run
      const validation = validateRun({
        distanceKm: parseFloat(distanceKm),
        durationMins: totalDurationMins,
        runDate: runDateObj,
      })

      if (!validation.isValid) {
        setError(validation.errors.join('. '))
        setLoading(false)
        return
      }

      if (validation.warnings.length > 0) {
        setWarnings(validation.warnings)
      }

      // Check if user already has a run for this date
      const { data: existingRun } = await supabase
        .from('runs')
        .select('id')
        .eq('user_id', userId)
        .eq('run_date', runDate)
        .single()

      if (existingRun) {
        setError('You have already logged a run for this date. Only one run per day is allowed.')
        setLoading(false)
        return
      }

      // Upload image if provided
      let imageUrl = null
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${userId}/${Date.now()}.${fileExt}`
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('run-proofs')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('run-proofs')
          .getPublicUrl(fileName)
        
        imageUrl = urlData.publicUrl
      }

      // Insert the run
      const { error: insertError } = await supabase
        .from('runs')
        .insert({
          user_id: userId,
          distance_km: parseFloat(distanceKm),
          duration_mins: totalDurationMins,
          points: validation.points,
          image_proof_url: imageUrl,
          run_date: runDate,
        })

      if (insertError) throw insertError

      // Success!
      setSuccess(true)
      triggerConfetti()
      
      // Close modal and refresh after delay
      setTimeout(() => {
        onClose()
        router.refresh()
      }, 2000)

    } catch (err: any) {
      setError(err.message || 'Failed to log run. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Calculate min and max dates for the input
  const today = new Date()
  const minDate = formatDateForInput(COMPETITION_START_DATE)
  const maxDate = formatDateForInput(today > COMPETITION_END_DATE ? COMPETITION_END_DATE : today)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-dark-900 rounded-2xl shadow-2xl border border-dark-700 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-900 border-b border-dark-700 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">Log Your Run</h2>
          <button
            onClick={onClose}
            className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          // Success State
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Run Logged! 🎉</h3>
            <p className="text-dark-400">
              You earned <span className="text-green-400 font-bold">{estimatedPoints} points</span> for your team!
            </p>
          </div>
        ) : (
          // Form
          <form onSubmit={handleSubmit} className="p-4 space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2">
                <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-400">
                  {warnings.map((w, i) => (
                    <p key={i}>{w}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Run Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-2">
                <Calendar className="w-4 h-4" />
                Run Date
              </label>
              <input
                type="date"
                value={runDate}
                onChange={(e) => setRunDate(e.target.value)}
                min={minDate}
                max={maxDate}
                className="input-field"
                required
              />
              <p className="text-xs text-dark-500 mt-1">Must be within 24 hours of the run</p>
            </div>

            {/* Distance */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-2">
                <Route className="w-4 h-4" />
                Distance (km)
              </label>
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                className="input-field"
                placeholder="e.g., 5.5"
                step="0.01"
                min="0.01"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-2">
                <Clock className="w-4 h-4" />
                Duration
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      value={durationHours}
                      onChange={(e) => setDurationHours(e.target.value)}
                      className="input-field pr-16"
                      placeholder="0"
                      min="0"
                      max="24"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 text-sm">hours</span>
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      value={durationMins}
                      onChange={(e) => setDurationMins(e.target.value)}
                      className="input-field pr-14"
                      placeholder="30"
                      min="0"
                      max="59"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 text-sm">mins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Preview */}
            {distance > 0 && totalMinutes > 0 && (
              <div className={`p-4 rounded-xl ${
                isPaceTooSlow 
                  ? 'bg-yellow-500/10 border border-yellow-500/20' 
                  : 'bg-green-500/10 border border-green-500/20'
              }`}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-dark-400 mb-1">Speed</p>
                    <p className={`font-semibold ${
                      isPaceTooSlow ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {speed.toFixed(1)} km/h
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-400 mb-1">Pace</p>
                    <p className={`font-semibold ${
                      isPaceTooSlow ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {formatPace(pace)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-dark-400 mb-1">Points</p>
                    <p className={`font-bold text-lg ${
                      isPaceTooSlow ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {estimatedPoints}
                    </p>
                  </div>
                </div>
                {isPaceTooSlow && (
                  <p className="text-xs text-yellow-400 text-center mt-2">
                    ⚠️ Pace slower than {MIN_SPEED_KMH} km/h - 0 points
                  </p>
                )}
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-dark-300 mb-2">
                <Upload className="w-4 h-4" />
                Proof (Screenshot/Photo)
              </label>
              <div 
                className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
                  imagePreview 
                    ? 'border-green-500/30 bg-green-500/5' 
                    : 'border-dark-600 hover:border-dark-500 bg-dark-800/50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Run proof preview" 
                      className="max-h-40 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setImageFile(null)
                        setImagePreview(null)
                      }}
                      className="absolute top-2 right-2 p-1 bg-dark-900/80 rounded-full text-white hover:bg-dark-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-dark-400 mx-auto mb-2" />
                    <p className="text-sm text-dark-400">Click to upload proof</p>
                    <p className="text-xs text-dark-500 mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging Run...
                </span>
              ) : (
                'Log Run'
              )}
            </button>

            {/* Rules Reminder */}
            <div className="text-xs text-dark-500 space-y-1">
              <p>• 1 km = 1 point (rounded down)</p>
              <p>• Minimum pace: {MIN_SPEED_KMH} km/h (10 min/km)</p>
              <p>• Max 1 run per day</p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
