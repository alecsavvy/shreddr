import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/events/$eventId/purchase/failure')({
  component: PurchaseFailurePage,
})

function PurchaseFailurePage() {
  const { eventId } = Route.useParams()

  return (
    <div>
      <h1>❌ Purchase Failed</h1>
      <p>There was an issue processing your payment.</p>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/events/$eventId/purchase" params={{ eventId }}>
          <button>Try Again</button>
        </Link>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/events/$eventId" params={{ eventId }}>Back to Event</Link>
      </div>
    </div>
  )
}

