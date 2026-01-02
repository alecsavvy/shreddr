import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { usePhantom } from '@phantom/react-sdk'
import { Loader2, AlertCircle } from 'lucide-react'
import { useUser } from '@/hooks/use-user'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})

function AuthCallback() {
  const navigate = useNavigate()
  const { isConnected } = usePhantom()
  const { 
    registerUser, 
    isRegistered, 
    isLoading, 
    status, 
    error,
    isWalletConnected 
  } = useUser()
  const hasAttemptedRegistration = useRef(false)

  useEffect(() => {
    async function handleAuth() {
      // Wait until we have wallet connection info
      if (!isConnected || !isWalletConnected || isLoading) {
        return
      }

      // If already registered, go home
      if (isRegistered) {
        navigate({ to: '/' })
        return
      }

      // Try to register if we haven't already
      if (!hasAttemptedRegistration.current && status === 'idle') {
        hasAttemptedRegistration.current = true
        const success = await registerUser()
        if (success) {
          navigate({ to: '/' })
        }
      }
    }

    handleAuth()
  }, [isConnected, isWalletConnected, isLoading, isRegistered, status, registerUser, navigate])

  // Show error state
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="mt-4 font-medium text-foreground">Registration failed</p>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        <button
          onClick={() => {
            hasAttemptedRegistration.current = false
            registerUser()
          }}
          className={cn(
            'mt-4 rounded-lg bg-primary px-4 py-2',
            'text-sm font-medium text-primary-foreground',
            'transition-colors hover:bg-primary/90'
          )}
        >
          Try Again
        </button>
      </div>
    )
  }

  // Show signing state
  if (status === 'signing') {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 font-medium text-foreground">Sign to verify your wallet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Please approve the signature request in your wallet
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">
        {status === 'registering' ? 'Creating your account...' : 'Processing authentication...'}
      </p>
    </div>
  )
}
