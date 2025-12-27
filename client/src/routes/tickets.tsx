import { createFileRoute, Link } from '@tanstack/react-router'
import { usePhantom } from "@phantom/react-sdk"
import { Ticket, Calendar, LogIn, ChevronRight, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTickets } from '@/hooks/use-tickets'
import { formatShortDate } from '@/lib/events-data'

export const Route = createFileRoute('/tickets')({
  component: TicketsPage,
})

function TicketCard({ 
  ticketId,
  eventName,
  eventDate,
  redeemed,
}: { 
  ticketId: string
  eventName: string
  eventDate: string
  redeemed: boolean
}) {
  return (
    <Link
      to="/user/tickets/$ticketId"
      params={{ ticketId }}
      className={cn(
        "group flex items-center justify-between rounded-xl border bg-card p-4",
        "transition-all duration-200",
        "active:scale-[0.98]",
        redeemed 
          ? "border-muted opacity-75"
          : "border-border hover:border-primary/50 hover:bg-card/80"
      )}
    >
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <h3 className={cn(
            "truncate font-semibold",
            redeemed 
              ? "text-muted-foreground"
              : "text-card-foreground group-hover:text-primary"
          )}>
            {eventName}
          </h3>
          {redeemed && (
            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-500">
              <CheckCircle className="h-3 w-3" />
              Used
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>{formatShortDate(eventDate)}</span>
        </div>
        <p className="font-mono text-xs text-muted-foreground">{ticketId}</p>
      </div>
      <ChevronRight className={cn(
        "h-5 w-5 shrink-0 transition-transform",
        redeemed
          ? "text-muted-foreground"
          : "text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary"
      )} />
    </Link>
  )
}

function TicketsPage() {
  const { isConnected } = usePhantom()
  const { tickets } = useTickets()

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Tickets
          </h1>
          <p className="text-muted-foreground">
            Log in to view your tickets
          </p>
        </section>

        <Link
          to="/login"
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3",
            "text-base font-semibold text-primary-foreground",
            "transition-all duration-200",
            "hover:bg-primary/90 active:scale-[0.98]"
          )}
        >
          <LogIn className="h-5 w-5" />
          Login
        </Link>
      </div>
    )
  }

  // Separate active and used tickets
  const activeTickets = tickets.filter(t => !t.redeemed)
  const usedTickets = tickets.filter(t => t.redeemed)

  if (tickets.length === 0) {
    return (
      <div className="space-y-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Tickets
          </h1>
          <p className="text-muted-foreground">
            Your event tickets appear here
          </p>
        </section>

        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Ticket className="h-6 w-6 text-primary" />
          </div>
          <p className="font-medium text-foreground">No tickets yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse events to get started
          </p>
          <Link
            to="/events"
            className={cn(
              "mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2",
              "text-sm font-medium text-primary-foreground",
              "transition-colors hover:bg-primary/90"
            )}
          >
            <Calendar className="h-4 w-4" />
            Browse Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My Tickets
        </h1>
        <p className="text-muted-foreground">
          {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} total
        </p>
      </section>

      {activeTickets.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <div className="h-2 w-2 rounded-full bg-primary" />
            Active Tickets ({activeTickets.length})
          </h2>
          <div className="space-y-2">
            {activeTickets.map((ticket) => (
              <TicketCard
                key={ticket.payload.ticketId}
                ticketId={ticket.payload.ticketId}
                eventName={ticket.payload.eventName}
                eventDate={ticket.payload.eventDate}
                redeemed={ticket.redeemed}
              />
            ))}
          </div>
        </section>
      )}

      {usedTickets.length > 0 && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Used Tickets ({usedTickets.length})
          </h2>
          <div className="space-y-2">
            {usedTickets.map((ticket) => (
              <TicketCard
                key={ticket.payload.ticketId}
                ticketId={ticket.payload.ticketId}
                eventName={ticket.payload.eventName}
                eventDate={ticket.payload.eventDate}
                redeemed={ticket.redeemed}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
