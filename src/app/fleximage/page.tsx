'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import GenerateImageContent from './GenerateImageContent'

export default function GenerateImage() {
  return (
    <ProtectedRoute>
      <GenerateImageContent />
    </ProtectedRoute>
  )
}