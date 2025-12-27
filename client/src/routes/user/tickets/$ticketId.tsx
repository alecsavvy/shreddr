import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/user/tickets/$ticketId')({
  component: TicketDetailsPage,
})

function TicketDetailsPage() {
  const { ticketId } = Route.useParams()

  return (
    <div className="space-y-6">
      <Link 
        to="/user/tickets" 
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Tickets
      </Link>

      <section className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Ticket Details
        </h1>
        <p className="text-muted-foreground">
          Ticket ID: {ticketId}
        </p>
      </section>

      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
        <p className="text-muted-foreground">
          Ticket details coming soon...
        </p>
      </div>
    </div>
  )
}
