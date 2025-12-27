import { createFileRoute, Link } from '@tanstack/react-router'
import { CalendarDays, ChevronRight, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { events, formatShortDate, formatPrice } from '@/lib/events-data'

export const Route = createFileRoute('/events/')({
  component: EventsPage,
})

function EventCard({ 
  id, 
  name, 
  date,
  venue,
  price,
}: { 
  id: string
  name: string
  date: string
  venue: string
  price: number
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
      <div className="min-w-0 flex-1 space-y-2">
        <h3 className="truncate font-semibold text-card-foreground group-hover:text-primary">
          {name}
        </h3>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>{formatShortDate(date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{venue}</span>
          </div>
        </div>
        <div className="text-sm font-semibold text-primary">
          {formatPrice(price)}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  )
}

function EventsPage() {
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
