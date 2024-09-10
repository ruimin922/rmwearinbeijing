'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import GenerateSVGClient from './GenerateSVGClient'
import { useUser } from '@clerk/nextjs'

export default function GenerateUI() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded || !isSignedIn) {
    return null
  }

  return (
    <ProtectedRoute>
      <GenerateSVGClient />
    </ProtectedRoute>
  )
}