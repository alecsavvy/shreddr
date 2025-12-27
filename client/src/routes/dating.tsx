import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dating')({
  component: DatingPage,
})

function DatingPage() {
  return (
    <div>
      <h1>Event Dating</h1>
      <p>Swipe left or right on events to find your perfect match!</p>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>No events to show</p>
        <p>Check back later for new events!</p>
      </div>
    </div>
  )
}

