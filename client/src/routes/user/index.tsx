import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { usePhantom } from "@phantom/react-sdk"
import { Settings, Ticket, ChevronRight, LogIn, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/user/')({
  component: UserPage,
})

function MenuButton({ 
  onClick,
  icon: Icon, 
  children 
}: { 
  onClick: () => void
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode 
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border border-border bg-card p-4",
        "transition-all duration-200",
        "hover:border-primary/50 hover:bg-card/80",
        "active:scale-[0.98]"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className="font-medium text-card-foreground">{children}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </button>
  )
}

function UserPage() {
  const { isConnected, user, sdk } = usePhantom()
  const navigate = useNavigate()

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Profile
          </h1>
          <p className="text-muted-foreground">
            Please log in to view your profile
          </p>
        </section>

        <Link
          to="/login"
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3",
            "text-base font-semibold text-primary-foreground",
            "transition-all duration-200",
            "hover:bg-primary/90 active:scale-[0.98]"
          )}
        >
          <LogIn className="h-5 w-5" />
          Login
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          User ID: {user?.authUserId}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Menu</h2>
        <div className="space-y-2">
          <MenuButton onClick={() => navigate({ to: '/user/settings' })} icon={Settings}>
            Settings
          </MenuButton>
          <MenuButton onClick={() => navigate({ to: '/user/tickets' })} icon={Ticket}>
            My Tickets
          </MenuButton>
        </div>
      </section>

      <section className="pt-4">
        <button
          onClick={async () => {
            await sdk?.disconnect()
            navigate({ to: '/' })
          }}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/50 px-6 py-3",
            "text-base font-semibold text-destructive",
            "transition-all duration-200",
            "hover:bg-destructive/10 active:scale-[0.98]"
          )}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </section>
    </div>
  )
}

