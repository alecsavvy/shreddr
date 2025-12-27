import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/user/tickets/')({
  component: UserTicketsPage,
})

function UserTicketsPage() {
  return (
    <div>
      <h1>My Tickets</h1>
      <Link to="/user">← Back to Profile</Link>
      <div style={{ marginTop: '1rem' }}>
        <p>No tickets yet.</p>
        <Link to="/events">Browse Events</Link>
      </div>
    </div>
  )
}

