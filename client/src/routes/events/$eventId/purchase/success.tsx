import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/events/$eventId/purchase/success')({
  component: PurchaseSuccessPage,
})

function PurchaseSuccessPage() {
  const { eventId } = Route.useParams()

  return (
    <div>
      <h1>🎉 Purchase Successful!</h1>
      <p>Your ticket has been purchased successfully.</p>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/user/tickets">View My Tickets</Link>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/events/$eventId" params={{ eventId }}>Back to Event</Link>
      </div>
    </div>
  )
}

