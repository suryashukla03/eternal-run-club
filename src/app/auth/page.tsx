import { Suspense } from 'react'
import AuthClient from './AuthClient'

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <div className="animate-spin h-8 w-8 border-2 border-alpha-red-500 border-t-transparent rounded-full" />
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthClient />
    </Suspense>
  )
}
