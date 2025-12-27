import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div>
      <h1>About Shreddr</h1>
      <p>Shreddr is a Progressive Web App (PWA) for discovering and purchasing event tickets.</p>
      
      <h2>Features</h2>
      <ul>
        <li>Discover events near you</li>
        <li>Swipe-style event matching</li>
        <li>Secure wallet-based authentication</li>
        <li>Easy ticket purchases with fiat</li>
      </ul>
      
      <div style={{ marginTop: '2rem' }}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  )
}
