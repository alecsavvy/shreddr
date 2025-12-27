import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Home, Calendar, Ticket, User, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'

const NavLink = ({ 
  to, 
  children, 
  icon: Icon 
}: { 
  to: string
  children: React.ReactNode
  icon: React.ComponentType<{ className?: string }>
}) => (
  <Link
    to={to}
    className={cn(
      "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium",
      "text-muted-foreground transition-colors",
      "hover:text-primary active:text-primary",
      "[&.active]:text-primary"
    )}
  >
    <Icon className="h-5 w-5" />
    <span>{children}</span>
  </Link>
)

const RootLayout = () => (
  <div className="flex min-h-screen min-h-dvh flex-col bg-background">
    {/* Header */}
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link 
        to="/" 
        className="text-foreground transition-colors hover:text-primary"
      >
        <Logo />
      </Link>
      <button 
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
      </button>
    </header>

    {/* Main Content */}
    <main className="flex-1 overflow-auto">
      <div className="mx-auto w-full max-w-lg px-4 py-6">
        <Outlet />
      </div>
    </main>

    {/* Footer Navigation */}
    <footer className="sticky bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex items-center justify-around py-1">
        <NavLink to="/" icon={Home}>
          Home
        </NavLink>
        <NavLink to="/events" icon={Calendar}>
          Events
        </NavLink>
        <NavLink to="/tickets" icon={Ticket}>
          Tickets
        </NavLink>
        <NavLink to="/user" icon={User}>
          Profile
        </NavLink>
      </nav>
      {/* Safe area for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </footer>

    { /* <TanStackRouterDevtools /> */ }
  </div>
)

export const Route = createRootRoute({ component: RootLayout })
