import { useState, useCallback, useMemo } from 'react'
import { CoinflowPurchase } from '@coinflowlabs/react'
import { usePhantom, useSolana } from '@phantom/react-sdk'
import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js'
import { Loader2, CreditCard, AlertCircle, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import config from '@/config'
import type { Event, SignedTicket } from '@/lib/types'
import { useTickets, createTicketPayload } from '@/hooks/use-tickets'

interface CoinflowCheckoutProps {
  event: Event
  onSuccess: (ticket: SignedTicket) => void
  onError: (error: string) => void
  className?: string
  /** Price in cents to charge */
  priceInCents: number
}

type CheckoutStep = 'payment' | 'signing' | 'complete' | 'error'

// Create a Solana wallet adapter that bridges Phantom SDK to Coinflow's expected interface
function usePhantomSolanaWallet() {
  const { isConnected } = usePhantom()
  const { solana, isAvailable } = useSolana()
  
  // Get the public key from the Solana chain interface
  const walletAddress = solana?.publicKey || null
  
  const wallet = useMemo(() => {
    if (!walletAddress || !solana) return null
    
    const publicKey = new PublicKey(walletAddress)
    
    return {
      publicKey,
      signTransaction: async <T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> => {
        const result = await solana.signTransaction(transaction)
        if (!result) throw new Error('Failed to sign transaction')
        return result as T
      },
      sendTransaction: async <T extends Transaction | VersionedTransaction>(transaction: T): Promise<string> => {
        const result = await solana.signAndSendTransaction(transaction)
        if (!result?.signature) throw new Error('Failed to send transaction')
        return result.signature
      },
      signMessage: async (message: Uint8Array): Promise<Uint8Array> => {
        const result = await solana.signMessage(message)
        if (!result?.signature) throw new Error('Failed to sign message')
        return result.signature
      },
    }
  }, [walletAddress, solana])
  
  return { wallet, walletAddress, isConnected, isAvailable, solana }
}

export function CoinflowCheckout({ event, onSuccess, onError, className, priceInCents }: CoinflowCheckoutProps) {
  const { wallet, walletAddress, isConnected, isAvailable, solana } = usePhantomSolanaWallet()
  const { addTicket } = useTickets()
  const [step, setStep] = useState<CheckoutStep>('payment')
  const [error, setError] = useState<string | null>(null)
  const [iframeHeight, setIframeHeight] = useState('auto')

  // Create Solana connection
  const connection = useMemo(() => {
    return new Connection(config.rpcUrl, 'confirmed')
  }, [])

  // Handle successful payment from Coinflow
  const handlePaymentSuccess = useCallback(async () => {
    if (!walletAddress || !solana) {
      setError('Wallet not connected')
      setStep('error')
      onError('Wallet not connected')
      return
    }

    setStep('signing')

    try {
      // Create ticket payload
      const payload = createTicketPayload(
        event.id,
        event.name,
        event.date,
        walletAddress
      )

      // Sign the ticket payload with Phantom
      const message = JSON.stringify(payload)
      const encodedMessage = new TextEncoder().encode(message)
      
      // Request signature from Phantom
      const signResult = await solana.signMessage(encodedMessage)
      
      if (!signResult || !signResult.signature) {
        throw new Error('Failed to sign ticket')
      }

      // Convert signature to base64 for storage (more compact than hex)
      const signatureBase64 = btoa(String.fromCharCode(...signResult.signature))

      // Create signed ticket
      const signedTicket: SignedTicket = {
        payload,
        signature: signatureBase64,
        publicKey: walletAddress,
        redeemed: false,
      }

      // Add to local storage
      addTicket(signedTicket)

      setStep('complete')
      onSuccess(signedTicket)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create ticket'
      setError(errorMessage)
      setStep('error')
      onError(errorMessage)
    }
  }, [walletAddress, solana, event, addTicket, onSuccess, onError])

  // Handle payment error
  const handlePaymentError = useCallback((err: string) => {
    setError(err)
    setStep('error')
    onError(err)
  }, [onError])

  // Handle height changes from Coinflow iframe
  const handleHeightChange = useCallback((height: string) => {
    setIframeHeight(height)
  }, [])

  // Check if we have a connected wallet
  if (!isConnected || !isAvailable || !wallet || !walletAddress) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">
              {!isConnected ? 'Please connect your wallet to purchase tickets' : 
               !isAvailable ? 'Solana wallet not available' :
               'Wallet not ready'}
            </p>
            {isConnected && !walletAddress && (
              <p className="mt-2 text-sm text-muted-foreground">
                Your wallet is connected but no Solana address is available yet. 
                Please try refreshing the page.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'signing') {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div>
            <p className="font-semibold text-foreground">Signing Your Ticket</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Please approve the signature request in your wallet
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className={cn('rounded-xl border border-destructive/50 bg-card p-6', className)}>
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <div>
            <p className="font-semibold text-foreground">Something went wrong</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
          <button
            onClick={() => setStep('payment')}
            className={cn(
              'rounded-lg bg-primary px-4 py-2',
              'text-sm font-medium text-primary-foreground',
              'transition-colors hover:bg-primary/90'
            )}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Payment step - show Coinflow checkout
  return (
    <div className={cn('flex flex-col rounded-xl border border-border', className)}>
      <div className="shrink-0 border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Secure Checkout</span>
          </div>
          <a 
            href="https://coinflow.cash" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Powered by Coinflow
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
      
      <div 
        className="min-h-0 flex-1 overflow-hidden rounded-b-xl [&>iframe]:!bg-transparent [&>iframe]:!h-full"
        style={{ height: iframeHeight === 'auto' ? undefined : iframeHeight }}
      >
        <CoinflowPurchase
          wallet={wallet}
          connection={connection}
          merchantId={config.coinflow.merchantId}
          env={config.coinflow.env}
          blockchain={config.coinflow.blockchain}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          handleHeightChange={handleHeightChange}
          subtotal={{ cents: priceInCents }}
          chargebackProtectionData={[
            {
              productName: event.name,
              productType: 'event_ticket',
              quantity: 1,
            },
          ]}
        />
      </div>
    </div>
  )
}

interface SimulatedCheckoutProps {
  event: Event
  onSuccess: (ticket: SignedTicket) => void
  onError: (error: string) => void
  className?: string
}

/**
 * Simulated checkout for development/testing
 * Skips Coinflow and goes directly to signing
 */
export function SimulatedCheckout({ event, onSuccess, onError, className }: SimulatedCheckoutProps) {
  const { isConnected } = usePhantom()
  const { solana, isAvailable } = useSolana()
  const { addTicket } = useTickets()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const walletAddress = solana?.publicKey || ''

  const handlePurchase = async () => {
    if (!walletAddress || !solana) {
      setError('Wallet not connected')
      onError('Wallet not connected')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create ticket payload
      const payload = createTicketPayload(
        event.id,
        event.name,
        event.date,
        walletAddress
      )

      // Sign the ticket payload with Phantom
      const message = JSON.stringify(payload)
      const encodedMessage = new TextEncoder().encode(message)
      
      const signResult = await solana.signMessage(encodedMessage)
      
      if (!signResult || !signResult.signature) {
        throw new Error('Failed to sign ticket')
      }

      // Convert signature to base64
      const signatureBase64 = btoa(String.fromCharCode(...signResult.signature))

      // Create signed ticket
      const signedTicket: SignedTicket = {
        payload,
        signature: signatureBase64,
        publicKey: walletAddress,
        redeemed: false,
      }

      // Add to local storage
      addTicket(signedTicket)

      onSuccess(signedTicket)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create ticket'
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Check if we have a connected wallet
  if (!isConnected || !isAvailable || !walletAddress) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-6', className)}>
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">
              {!isConnected ? 'Please connect your wallet to purchase tickets' : 
               !isAvailable ? 'Solana wallet not available' :
               'Wallet not ready'}
            </p>
            {isConnected && !walletAddress && (
              <p className="mt-2 text-sm text-muted-foreground">
                Your wallet is connected but no Solana address is available yet. 
                Please try refreshing the page.
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      
      <button
        onClick={handlePurchase}
        disabled={loading}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3',
          'text-base font-semibold text-primary-foreground',
          'transition-all duration-200',
          'hover:bg-primary/90 active:scale-[0.98]',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Signing Ticket...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Purchase Ticket (Simulated)
          </>
        )}
      </button>
      
      <p className="text-center text-xs text-muted-foreground">
        This simulates a successful payment and proceeds to ticket signing
      </p>
    </div>
  )
}
