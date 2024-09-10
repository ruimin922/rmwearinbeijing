'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import GenerateSVGClient from './GenerateSVGClient'
import { useAuth } from '@/contexts/AuthContext'

export default function GenerateUI() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <GenerateSVGClient userId={user?.id || ''} isNewUser={false} />
    </ProtectedRoute>
  )
}