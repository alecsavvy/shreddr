import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Ticket } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/events/$eventId/')({
  component: EventDetailsPage,
})

function EventDetailsPage() {
  const { eventId } = Route.useParams()

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
          Event Details
        </h1>
        <p className="text-muted-foreground">
          Event ID: {eventId}
        </p>
      </section>

      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground">
          Event details coming soon...
        </p>
      </div>

      <Link
        to="/events/$eventId/purchase"
        params={{ eventId }}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3",
          "text-base font-semibold text-primary-foreground",
          "transition-all duration-200",
          "hover:bg-primary/90 active:scale-[0.98]"
        )}
      >
        <Ticket className="h-5 w-5" />
        Purchase Ticket
      </Link>
    </div>
  )
}
