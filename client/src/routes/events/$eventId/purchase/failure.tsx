import { createFileRoute, Link } from '@tanstack/react-router'
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/events/$eventId/purchase/failure')({
  component: PurchaseFailurePage,
  validateSearch: (search: Record<string, unknown>) => ({
    error: search.error as string | undefined,
  }),
})

function PurchaseFailurePage() {
  const { eventId } = Route.useParams()
  const { error } = Route.useSearch()

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Purchase Failed
        </h1>
        <p className="mt-2 text-muted-foreground">
          {error || "Something went wrong with your purchase"}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-center text-sm text-muted-foreground">
          Don't worry, you haven't been charged. Please try again or contact support if the problem persists.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link
          to="/events/$eventId/purchase/payment"
          params={{ eventId }}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3",
            "text-base font-semibold text-primary-foreground",
            "transition-all duration-200",
            "hover:bg-primary/90 active:scale-[0.98]"
          )}
        >
          <RefreshCw className="h-5 w-5" />
          Try Again
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
          <ArrowLeft className="h-5 w-5" />
          Back to Event
        </Link>
      </div>
    </div>
  )
}
