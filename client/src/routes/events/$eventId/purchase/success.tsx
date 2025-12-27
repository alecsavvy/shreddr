import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckCircle, Ticket, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/events/$eventId/purchase/success')({
  component: PurchaseSuccessPage,
})

function PurchaseSuccessPage() {
  const { eventId } = Route.useParams()

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Purchase Successful
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your ticket has been purchased successfully.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          to="/user/tickets"
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3",
            "text-base font-semibold text-primary-foreground",
            "transition-all duration-200",
            "hover:bg-primary/90 active:scale-[0.98]"
          )}
        >
          <Ticket className="h-5 w-5" />
          View My Tickets
        </Link>
        <Link
          to="/events/$eventId"
          params={{ eventId }}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3",
            "text-base font-semibold text-secondary-foreground",
            "transition-all duration-200",
            "hover:bg-secondary/80 active:scale-[0.98]"
          )}
        >
          Back to Event
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  )
}
