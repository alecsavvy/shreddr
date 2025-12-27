import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/events/$eventId/')({
  component: EventDetailsPage,
})

function EventDetailsPage() {
  const { eventId } = Route.useParams()

  return (
    <div>
      <h1>Event Details</h1>
      <Link to="/events">← Back to Events</Link>
      <div style={{ marginTop: '1rem' }}>
        <p>Event ID: {eventId}</p>
        <p>Event details coming soon...</p>
        <Link to="/events/$eventId/purchase" params={{ eventId }}>
          <button style={{ marginTop: '1rem' }}>Purchase Ticket</button>
        </Link>
      </div>
    </div>
  )
}

