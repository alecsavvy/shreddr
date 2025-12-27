import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/events/$eventId/purchase/')({
  component: PurchasePage,
})

function PurchasePage() {
  const { eventId } = Route.useParams()

  return (
    <div>
      <h1>Purchase Ticket</h1>
      <Link to="/events/$eventId" params={{ eventId }}>← Back to Event</Link>
      <div style={{ marginTop: '1rem' }}>
        <p>Event ID: {eventId}</p>
        <p>Coinflow payment integration coming soon...</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <Link to="/events/$eventId/purchase/success" params={{ eventId }}>
            <button>Simulate Success</button>
          </Link>
          <Link to="/events/$eventId/purchase/failure" params={{ eventId }}>
            <button>Simulate Failure</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
