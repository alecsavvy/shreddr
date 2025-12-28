import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Ticket, CreditCard } from 'lucide-react'
import { usePhantom } from '@phantom/react-sdk'
import { cn } from '@/lib/utils'
import { getEventById, formatEventDate, formatPrice } from '@/lib/events-data'

export const Route = createFileRoute('/events/$eventId/purchase/')({
  component: PurchasePage,
})

function PurchasePage() {
  const { eventId } = Route.useParams()
  const event = getEventById(eventId)
  const { isConnected } = usePhantom()

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
          <Link
            to="/events/$eventId/purchase/payment"
            params={{ eventId }}
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
              <p className="text-sm text-muted-foreground">Pay with Coinflow</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
