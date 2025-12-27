import { createFileRoute, Link } from '@tanstack/react-router'
import { usePhantom } from "@phantom/react-sdk"
import { Ticket, Calendar, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/tickets')({
  component: TicketsPage,
})

function TicketsPage() {
  const { isConnected } = usePhantom()

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

  // Placeholder - no tickets yet
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

