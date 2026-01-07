import { createFileRoute, Link } from '@tanstack/react-router'
import { usePhantom } from "@phantom/react-sdk"
import { ArrowLeft, Ticket, CalendarDays, MapPin, QrCode, Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { getEventById, formatEventDate, formatPrice } from '@/lib/events-data'
import { EventQR } from '@/components/event-qr'
import { Modal } from '@/components/modal'
import { useTickets } from '@/hooks/use-tickets'
import { LoginLink } from '@/components/login-link'

export const Route = createFileRoute('/events/$eventId/')({
  component: EventDetailsPage,
})

function EventDetailsPage() {
  const { eventId } = Route.useParams()
  const { isConnected } = usePhantom()
  const event = getEventById(eventId)
  const [showQR, setShowQR] = useState(false)
  const { getTicketsForEvent } = useTickets()
  
  // Check if user already has a ticket for this event
  const userTickets = getTicketsForEvent(eventId)
  const hasTicket = userTickets.length > 0
  const firstTicket = userTickets[0]

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
          <p className="mt-1 text-sm text-muted-foreground">
            The event you're looking for doesn't exist
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link 
        to="/events" 
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      <section className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {event.name}
        </h1>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>{formatEventDate(event.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{event.location}</span>
          </div>
        </div>
      </section>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-foreground leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* Ticket Action Card */}
      {hasTicket ? (
        <Link
          to="/user/tickets/$ticketId"
          params={{ ticketId: firstTicket.payload.ticketId }}
          className={cn(
            "block rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4",
            "transition-all duration-200",
            "hover:border-emerald-500/50 hover:bg-emerald-500/15 active:scale-[0.98]"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-400">
                <Check className="h-4 w-4" />
                You're going!
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Tap to view your ticket
              </p>
            </div>
            <Ticket className="h-8 w-8 text-emerald-500/50" />
          </div>
        </Link>
      ) : isConnected ? (
        <Link
          to="/events/$eventId/purchase/payment"
          params={{ eventId }}
          className={cn(
            "group block rounded-xl border border-primary/30 bg-primary/5 p-4",
            "transition-all duration-200",
            "hover:border-primary/50 hover:bg-primary/10 active:scale-[0.98]"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ticket Price</p>
              <p className="text-2xl font-bold text-primary">{formatPrice(event.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary opacity-70 transition-opacity group-hover:opacity-100">
                Purchase
              </span>
              <Ticket className="h-8 w-8 text-primary/50" />
            </div>
          </div>
        </Link>
      ) : (
        <LoginLink
          className={cn(
            "group block rounded-xl border border-primary/30 bg-primary/5 p-4",
            "transition-all duration-200",
            "hover:border-primary/50 hover:bg-primary/10 active:scale-[0.98]"
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ticket Price</p>
              <p className="text-2xl font-bold text-primary">{formatPrice(event.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary opacity-70 transition-opacity group-hover:opacity-100">
                Purchase
              </span>
              <Ticket className="h-8 w-8 text-primary/50" />
            </div>
          </div>
        </LoginLink>
      )}

      {/* QR Code Button */}
      <button
        onClick={() => setShowQR(true)}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 py-3",
          "text-sm font-semibold text-secondary-foreground",
          "transition-all duration-200",
          "hover:bg-secondary/80 active:scale-[0.98]"
        )}
      >
        <QrCode className="h-4 w-4" />
        Share Event QR
      </button>

      {/* QR Code Modal */}
      <Modal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        title="Share Event"
        className="max-w-sm"
      >
        <div className="flex flex-col items-center py-4">
          <EventQR 
            eventId={event.id} 
            eventName={event.name} 
            eventDate={event.date}
            eventVenue={event.location}
            size={250} 
          />
          
          <div className="mt-6 text-center">
            <p className="font-semibold text-white">{event.name}</p>
            <p className="text-sm text-white/70">{formatEventDate(event.date)}</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
