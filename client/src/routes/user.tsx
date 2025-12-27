import { createFileRoute, Link } from '@tanstack/react-router'
import { usePhantom } from "@phantom/react-sdk"

export const Route = createFileRoute('/user')({
  component: UserPage,
})

function UserPage() {
  const { isConnected, user } = usePhantom()

  if (!isConnected) {
    return (
      <div>
        <h1>Profile</h1>
        <p>Please log in to view your profile.</p>
        <Link to="/login">Login</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>User ID: {user?.authUserId}</p>
      <p>Auth Provider: {user?.authProvider}</p>
      <h2>Wallets</h2>
      <ul>
        {user?.addresses.map((wallet) => (
          <li key={wallet.address}>{wallet.addressType}: {wallet.address}</li>
        ))}
      </ul>
      <nav>
        <ul>
          <li><Link to="/user/settings">Settings</Link></li>
          <li><Link to="/user/tickets">My Tickets</Link></li>
        </ul>
      </nav>
    </div>
  )
}

