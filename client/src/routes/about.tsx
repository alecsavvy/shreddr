import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Calendar, Heart, Wallet, CreditCard } from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: About,
})

const features = [
  { icon: Calendar, text: 'Discover events near you' },
  { icon: Heart, text: 'Swipe-style event matching' },
  { icon: Wallet, text: 'Secure wallet-based authentication' },
  { icon: CreditCard, text: 'Easy ticket purchases with fiat' },
]

function About() {
  return (
    <div className="space-y-6">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <section className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          About Shreddr
        </h1>
        <p className="text-muted-foreground">
          Shreddr is a Progressive Web App (PWA) for discovering and purchasing event tickets.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Features</h2>
        <div className="space-y-3">
          {features.map(({ icon: Icon, text }) => (
            <div 
              key={text} 
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium text-card-foreground">{text}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
