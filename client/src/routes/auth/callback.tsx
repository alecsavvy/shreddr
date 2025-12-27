import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { usePhantom } from '@phantom/react-sdk'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})

function AuthCallback() {
  const navigate = useNavigate()
  const { isConnected } = usePhantom()

  useEffect(() => {
    // Redirect to home after auth callback is processed
    if (isConnected) {
      navigate({ to: '/' })
    }
  }, [isConnected, navigate])

  return (
    <div>
      <p>Processing authentication...</p>
    </div>
  )
}
