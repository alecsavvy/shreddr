import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { CheckCircle, Ticket, ArrowRight, Wallet, QrCode } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTickets } from '@/hooks/use-tickets'
import { TicketQR } from '@/components/ticket-qr'
import { Modal } from '@/components/modal'
import { getEventById, formatEventDate } from '@/lib/events-data'

export const Route = createFileRoute('/events/$eventId/purchase/success')({
  component: PurchaseSuccessPage,
  validateSearch: (search: Record<string, unknown>) => ({
    ticketId: search.ticketId as string | undefined,
  }),
})

function PurchaseSuccessPage() {
  const { eventId } = Route.useParams()
  const { ticketId } = Route.useSearch()
  const { getTicket } = useTickets()
  const [showQR, setShowQR] = useState(false)
  const event = getEventById(eventId)
  
  const ticket = ticketId ? getTicket(ticketId) : undefined

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Purchase Successful!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your ticket is ready
        </p>
      </div>

      {/* View Ticket QR Button */}
      {ticket && (
        <button
          onClick={() => setShowQR(true)}
          className={cn(
            "flex w-full items-center justify-center gap-3 rounded-xl bg-primary p-6",
            "text-primary-foreground",
            "transition-all duration-200",
            "hover:bg-primary/90 active:scale-[0.98]"
          )}
        >
          <QrCode className="h-8 w-8" />
          <div className="text-left">
            <p className="text-lg font-semibold">View Your Ticket</p>
            <p className="text-sm opacity-80">Tap to show QR code</p>
          </div>
        </button>
      )}

      {/* Wallet Pass Buttons */}
      <div className="space-y-3">
        <p className="text-center text-sm text-muted-foreground">
          Add to your digital wallet for easy access
        </p>
        
        <button
          onClick={() => {
            alert('Apple Wallet integration coming soon! The signed ticket QR will be embedded in the pass.')
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
            alert('Google Wallet integration coming soon! The signed ticket QR will be embedded in the pass.')
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

      <div className="flex flex-col gap-3">
        <Link
          to="/tickets"
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3",
            "text-base font-semibold text-secondary-foreground",
            "transition-all duration-200",
            "hover:bg-secondary/80 active:scale-[0.98]"
          )}
        >
          <Ticket className="h-5 w-5" />
          View All My Tickets
        </Link>
        <Link
          to="/events/$eventId"
          params={{ eventId }}
          className={cn(
            "flex items-center justify-center gap-2 text-sm text-muted-foreground",
            "transition-colors hover:text-foreground"
          )}
        >
          Back to Event
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* QR Code Modal */}
      {ticket && (
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
      )}
    </div>
  )
}
