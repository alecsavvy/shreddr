import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const RootLayout = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    {/* Header */}
    <header style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '1.25rem' }}>
        Shreddr
      </Link>
      <button style={{ padding: '0.5rem' }}>☰</button>
    </header>

    {/* Main Content */}
    <main style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
      <Outlet />
    </main>

    {/* Footer Navigation */}
    <footer style={{ padding: '1rem', borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'space-around' }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        🏠 Home
      </Link>
      <Link to="/events" style={{ textDecoration: 'none' }}>
        🎫 Events
      </Link>
      <Link to="/dating" style={{ textDecoration: 'none' }}>
        💘 Dating
      </Link>
      <Link to="/user" style={{ textDecoration: 'none' }}>
        👤 Profile
      </Link>
    </footer>

    <TanStackRouterDevtools />
  </div>
)

export const Route = createRootRoute({ component: RootLayout })
