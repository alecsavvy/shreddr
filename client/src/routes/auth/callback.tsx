import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { usePhantom } from '@phantom/react-sdk'
import { Loader2 } from 'lucide-react'
import { consumeAuthRedirect } from '@/lib/auth-redirect'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})

function AuthCallback() {
  const navigate = useNavigate()
  const { isConnected } = usePhantom()

  useEffect(() => {
    if (isConnected) {
      navigate({ to: consumeAuthRedirect() })
    }
  }, [isConnected, navigate])

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Processing authentication...</p>
    </div>
  )
}
