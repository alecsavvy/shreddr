import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, CalendarDays, MapPin, Wallet, ExternalLink, QrCode } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTickets } from '@/hooks/use-tickets'
import { getEventById, formatEventDate } from '@/lib/events-data'
import { TicketQR } from '@/components/ticket-qr'
import { Modal } from '@/components/modal'

export const Route = createFileRoute('/user/tickets/$ticketId')({
  component: TicketDetailsPage,
})

function TicketDetailsPage() {
  const { ticketId } = Route.useParams()
  const { getTicket } = useTickets()
  const [showQR, setShowQR] = useState(false)
  
  const ticket = getTicket(ticketId)
  const event = ticket ? getEventById(ticket.payload.eventId) : undefined

  if (!ticket) {
    return (
      <div className="space-y-6">
        <Link 
          to="/tickets" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Tickets
        </Link>

        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <p className="font-medium text-foreground">Ticket not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This ticket doesn't exist or has been removed
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link 
        to="/tickets" 
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Tickets
      </Link>

      <section className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {ticket.payload.eventName}
        </h1>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>{formatEventDate(ticket.payload.eventDate)}</span>
          </div>
          {event && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{event.venue}</span>
            </div>
          )}
        </div>
      </section>

      {/* View QR Button */}
      <button
        onClick={() => setShowQR(true)}
        className={cn(
          "flex w-full items-center justify-center gap-3 rounded-xl p-6",
          "transition-all duration-200",
          "active:scale-[0.98]",
          ticket.redeemed
            ? "border border-muted bg-muted/20 text-muted-foreground"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        <QrCode className="h-8 w-8" />
        <div className="text-left">
          <p className="text-lg font-semibold">
            {ticket.redeemed ? 'View Used Ticket' : 'Show QR Code'}
          </p>
          <p className="text-sm opacity-80">
            {ticket.redeemed ? 'This ticket has been redeemed' : 'Tap to display for entry'}
          </p>
        </div>
      </button>

      {/* Ticket Info */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Ticket ID</span>
          <span className="font-mono text-foreground">{ticket.payload.ticketId}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Purchased</span>
          <span className="text-foreground">
            {new Date(ticket.payload.purchasedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <span className={cn(
            "font-medium",
            ticket.redeemed ? "text-green-500" : "text-primary"
          )}>
            {ticket.redeemed ? 'Used' : 'Active'}
          </span>
        </div>
        {ticket.redeemedAt && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Redeemed</span>
            <span className="text-foreground">
              {new Date(ticket.redeemedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>

      {/* Wallet Pass Buttons */}
      {!ticket.redeemed && (
        <div className="space-y-3">
          <p className="text-center text-sm text-muted-foreground">
            Add to your digital wallet for easy access
          </p>
          
          <button
            onClick={() => {
              alert('Apple Wallet integration coming soon!')
            }}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3",
              "text-base font-semibold text-white",
              "transition-all duration-200",
              "hover:bg-black/90 active:scale-[0.98]"
            )}
          >
            <Wallet className="h-5 w-5" />
            Add to Apple Wallet
          </button>

          <button
            onClick={() => {
              alert('Google Wallet integration coming soon!')
            }}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 py-3",
              "text-base font-semibold text-gray-800",
              "transition-all duration-200",
              "hover:bg-gray-50 active:scale-[0.98]"
            )}
          >
            <Wallet className="h-5 w-5" />
            Add to Google Wallet
          </button>
        </div>
      )}

      {/* View Event Link */}
      {event && (
        <Link
          to="/events/$eventId"
          params={{ eventId: event.id }}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3",
            "text-base font-semibold text-secondary-foreground",
            "transition-all duration-200",
            "hover:bg-secondary/80 active:scale-[0.98]"
          )}
        >
          <ExternalLink className="h-5 w-5" />
          View Event Details
        </Link>
      )}

      {/* QR Code Modal */}
      <Modal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        className="max-w-sm"
      >
        <div className="flex flex-col items-center py-4">
          <TicketQR ticket={ticket} size={280} />
          
          {event && (
            <div className="mt-6 text-center">
              <p className="font-semibold text-white">{event.name}</p>
              <p className="text-sm text-white/70">{formatEventDate(event.date)}</p>
              <p className="text-sm text-white/70">{event.venue}</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
