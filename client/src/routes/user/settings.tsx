import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/user/settings')({
  component: UserSettingsPage,
})

type Theme = 'light' | 'dark' | 'system'

const themeOptions: { value: Theme; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

function UserSettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-6">
      <Link 
        to="/user" 
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Profile
      </Link>

      <section className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Choose your preferred theme
            </p>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-3",
                    "transition-all duration-200",
                    "hover:bg-secondary/50",
                    theme === value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
