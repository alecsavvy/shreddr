import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/events/')({
  component: EventsPage,
})

function EventsPage() {
  // Placeholder events data
  const events = [
    { id: '1', name: 'Summer Music Festival', date: '2025-07-15' },
    { id: '2', name: 'Tech Conference 2025', date: '2025-08-20' },
    { id: '3', name: 'Art Gallery Opening', date: '2025-06-10' },
  ]

  return (
    <div>
      <h1>Events</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.map((event) => (
          <li key={event.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
            <Link to="/events/$eventId" params={{ eventId: event.id }}>
              <h3>{event.name}</h3>
              <p>{event.date}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

