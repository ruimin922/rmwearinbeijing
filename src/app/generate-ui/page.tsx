'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import GenerateUIClient from './GenerateUIClient'
import { useAuth } from '@/contexts/AuthContext'

export default function GenerateUI() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <GenerateUIClient userId={user?.id || ''} isNewUser={false} />
    </ProtectedRoute>
  )
}