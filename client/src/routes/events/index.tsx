import { createFileRoute, Link } from '@tanstack/react-router'
import { CalendarDays, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/events/')({
  component: EventsPage,
})

function EventCard({ 
  id, 
  name, 
  date 
}: { 
  id: string
  name: string
  date: string
}) {
  return (
    <Link
      to="/events/$eventId"
      params={{ eventId: id }}
      className={cn(
        "group flex items-center justify-between rounded-xl border border-border bg-card p-4",
        "transition-all duration-200",
        "hover:border-primary/50 hover:bg-card/80",
        "active:scale-[0.98]"
      )}
    >
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="truncate font-semibold text-card-foreground group-hover:text-primary">
          {name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span>{new Date(date).toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}</span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  )
}

function EventsPage() {
  // Placeholder events data
  const events = [
    { id: '1', name: 'Summer Music Festival', date: '2025-07-15' },
    { id: '2', name: 'Tech Conference 2025', date: '2025-08-20' },
    { id: '3', name: 'Art Gallery Opening', date: '2025-06-10' },
  ]

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Events
        </h1>
        <p className="text-muted-foreground">
          Browse all upcoming events
        </p>
      </section>

      <div className="space-y-3">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  )
}
