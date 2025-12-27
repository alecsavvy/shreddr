import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/user/tickets/$ticketId')({
  component: TicketDetailsPage,
})

function TicketDetailsPage() {
  const { ticketId } = Route.useParams()

  return (
    <div>
      <h1>Ticket Details</h1>
      <Link to="/user/tickets">← Back to My Tickets</Link>
      <div style={{ marginTop: '1rem' }}>
        <p>Ticket ID: {ticketId}</p>
        <p>Ticket details coming soon...</p>
      </div>
    </div>
  )
}

