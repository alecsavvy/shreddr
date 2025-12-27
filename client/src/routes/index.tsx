import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  // Placeholder upcoming events based on user location
  const upcomingEvents = [
    { id: '1', name: 'Summer Music Festival', date: '2025-07-15', location: 'Los Angeles, CA' },
    { id: '2', name: 'Tech Conference 2025', date: '2025-08-20', location: 'San Francisco, CA' },
    { id: '3', name: 'Art Gallery Opening', date: '2025-06-10', location: 'New York, NY' },
  ]

  return (
    <div>
      <h1>Welcome to Shreddr</h1>
      <p>Discover events near you</p>
      
      <h2>Upcoming Events</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {upcomingEvents.map((event) => (
          <li key={event.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
            <Link to="/events/$eventId" params={{ eventId: event.id }}>
              <h3>{event.name}</h3>
              <p>{event.date}</p>
              <p>{event.location}</p>
            </Link>
          </li>
        ))}
      </ul>
      
      <div style={{ marginTop: '2rem' }}>
        <Link to="/events">View All Events →</Link>
      </div>
    </div>
  )
}
