import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { usePhantom } from "@phantom/react-sdk"
import { ArrowLeft } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { CoinflowCheckout } from '@/components/coinflow-checkout'
import { getEventById } from '@/lib/events-data'
import type { SignedTicket } from '@/lib/types'

export const Route = createFileRoute('/events/$eventId/purchase/payment')({
  component: PaymentPage,
})

function PaymentPage() {
  const { eventId } = Route.useParams()
  const { isConnected } = usePhantom()
  const event = getEventById(eventId)
  const navigate = useNavigate()

  // Redirect to profile page if not logged in
  useEffect(() => {
    if (!isConnected) {
      navigate({ to: '/user' })
    }
  }, [isConnected, navigate])

  const handleSuccess = useCallback((ticket: SignedTicket) => {
    navigate({
      to: '/events/$eventId/purchase/success',
      params: { eventId },
      search: { ticketId: ticket.payload.ticketId },
    })
  }, [eventId, navigate])

  const handleError = useCallback((error: string) => {
    navigate({
      to: '/events/$eventId/purchase/failure',
      params: { eventId },
      search: { error },
    })
  }, [eventId, navigate])

  if (!event) {
    return (
      <div className="flex min-h-[80vh] flex-col space-y-6">
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

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col">
      <div className="shrink-0 pb-4">
        <Link 
          to="/events/$eventId" 
          params={{ eventId }}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Event
        </Link>
      </div>

      <CoinflowCheckout
        event={event}
        priceInCents={event.price}
        onSuccess={handleSuccess}
        onError={handleError}
        className="min-h-0 flex-1"
      />
    </div>
  )
}

