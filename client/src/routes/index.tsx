import { createFileRoute, Link } from '@tanstack/react-router'
import { MapPin, CalendarDays, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { events } from '@/lib/events-data'

export const Route = createFileRoute('/')({
  component: Index,
})

function EventCard({ 
  id, 
  name, 
  date, 
  location 
}: { 
  id: string
  name: string
  date: string
  location: string
}) {
  return (
    <Link
      to="/events/$eventId"
      params={{ eventId: id }}
      className={cn(
        "group block rounded-xl border border-border bg-card p-4",
        "transition-all duration-200",
        "hover:border-primary/50 hover:bg-card/80 hover:shadow-sm",
        "active:scale-[0.98]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="truncate text-base font-semibold text-card-foreground group-hover:text-primary">
            {name}
          </h3>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span>{new Date(date).toLocaleDateString('en-US', { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </Link>
  )
}

function Index() {
  // Placeholder upcoming events based on user location
  const upcomingEvents = events.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome to Shreddr
        </h1>
        <p className="text-muted-foreground">
          Discover events near you
        </p>
      </section>

      {/* Upcoming Events */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Upcoming Events
          </h2>
          <Link 
            to="/events" 
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            View all
          </Link>
        </div>
        
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </section>
    </div>
  )
}
