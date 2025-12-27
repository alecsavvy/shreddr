import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Ticket, CreditCard, Zap } from 'lucide-react'
import { useState } from 'react'
import { usePhantom } from '@phantom/react-sdk'
import { cn } from '@/lib/utils'
import { getEventById, formatEventDate, formatPrice } from '@/lib/events-data'
import { CoinflowCheckout, SimulatedCheckout } from '@/components/coinflow-checkout'
import { FullScreenModal } from '@/components/modal'
import type { SignedTicket } from '@/lib/types'

export const Route = createFileRoute('/events/$eventId/purchase/')({
  component: PurchasePage,
})

type CheckoutMode = 'select' | 'coinflow' | 'simulated'

function PurchasePage() {
  const { eventId } = Route.useParams()
  const event = getEventById(eventId)
  const navigate = useNavigate()
  const { isConnected } = usePhantom()
  const [mode, setMode] = useState<CheckoutMode>('select')

  if (!event) {
    return (
      <div className="space-y-6">
        <Link 
          to="/events" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>

        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <p className="font-medium text-foreground">Event not found</p>
        </div>
      </div>
    )
  }

  const handleSuccess = (ticket: SignedTicket) => {
    setMode('select')
    navigate({
      to: '/events/$eventId/purchase/success',
      params: { eventId },
      search: { ticketId: ticket.payload.ticketId },
    })
  }

  const handleError = (error: string) => {
    setMode('select')
    navigate({
      to: '/events/$eventId/purchase/failure',
      params: { eventId },
      search: { error },
    })
  }

  const closeModal = () => setMode('select')

  return (
    <div className="space-y-6">
      <Link 
        to="/events/$eventId" 
        params={{ eventId }}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Event
      </Link>

      <section className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Purchase Ticket
        </h1>
        <p className="text-muted-foreground">
          {event.name}
        </p>
      </section>

      {/* Order Summary */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">{event.name}</p>
            <p className="text-sm text-muted-foreground">{formatEventDate(event.date)}</p>
            <p className="text-sm text-muted-foreground">{event.venue}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">{formatPrice(event.price)}</p>
            <p className="text-xs text-muted-foreground">per ticket</p>
          </div>
        </div>
      </div>

      {!isConnected ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <Ticket className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-semibold text-foreground">Connect Your Wallet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                You need to connect your wallet to purchase tickets
              </p>
            </div>
            <Link
              to="/login"
              className={cn(
                'rounded-lg bg-primary px-4 py-2',
                'text-sm font-medium text-primary-foreground',
                'transition-colors hover:bg-primary/90'
              )}
            >
              Connect Wallet
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Select payment method:</p>
          
          <button
            onClick={() => setMode('coinflow')}
            className={cn(
              "flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4",
              "transition-all duration-200",
              "hover:border-primary/50 hover:bg-card/80",
              "active:scale-[0.98]"
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">Credit Card</p>
              <p className="text-sm text-muted-foreground">Pay with Coinflow (Sandbox)</p>
            </div>
          </button>

          <button
            onClick={() => setMode('simulated')}
            className={cn(
              "flex w-full items-center gap-4 rounded-xl border border-dashed border-border bg-card/50 p-4",
              "transition-all duration-200",
              "hover:border-primary/50 hover:bg-card/80",
              "active:scale-[0.98]"
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
              <Zap className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">Quick Test</p>
              <p className="text-sm text-muted-foreground">Skip payment, go to signing</p>
            </div>
          </button>
        </div>
      )}

      {/* Coinflow Modal */}
      <FullScreenModal
        isOpen={mode === 'coinflow'}
        onClose={closeModal}
        title="Secure Checkout"
      >
        <div className="mx-auto max-w-lg p-4">
          <CoinflowCheckout
            event={event}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>
      </FullScreenModal>

      {/* Simulated Checkout Modal */}
      <FullScreenModal
        isOpen={mode === 'simulated'}
        onClose={closeModal}
        title="Quick Test Checkout"
      >
        <div className="mx-auto max-w-lg p-4">
          <SimulatedCheckout
            event={event}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>
      </FullScreenModal>
    </div>
  )
}
