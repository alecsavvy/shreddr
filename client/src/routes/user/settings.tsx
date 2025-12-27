import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/user/settings')({
  component: UserSettingsPage,
})

function UserSettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      <Link to="/user">← Back to Profile</Link>
      <div style={{ marginTop: '1rem' }}>
        <p>Settings page coming soon...</p>
      </div>
    </div>
  )
}

