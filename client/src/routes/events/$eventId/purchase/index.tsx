import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/events/$eventId/purchase/')({
  component: PurchasePage,
})

function PurchasePage() {
  const { eventId } = Route.useParams()

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
          Event ID: {eventId}
        </p>
      </section>

      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground">
          Coinflow payment integration coming soon...
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/events/$eventId/purchase/success"
          params={{ eventId }}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3",
            "text-sm font-semibold text-primary-foreground",
            "transition-all duration-200",
            "hover:bg-primary/90 active:scale-[0.98]"
          )}
        >
          <CheckCircle className="h-4 w-4" />
          Simulate Success
        </Link>
        <Link
          to="/events/$eventId/purchase/failure"
          params={{ eventId }}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 py-3",
            "text-sm font-semibold text-secondary-foreground",
            "transition-all duration-200",
            "hover:bg-secondary/80 active:scale-[0.98]"
          )}
        >
          <XCircle className="h-4 w-4" />
          Simulate Failure
        </Link>
      </div>
    </div>
  )
}
