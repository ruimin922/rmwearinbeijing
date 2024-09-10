'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import GenerateSVGClient from './GenerateSVGClient'
import { useSession } from 'next-auth/react'
import { Session } from 'next-auth'

export default function GenerateUI() {
  const { data: session } = useSession() as { data: Session | null }

  return (
    <ProtectedRoute>
      <GenerateSVGClient userId={(session?.user as any)?.id || ''} />
    </ProtectedRoute>
  )
}