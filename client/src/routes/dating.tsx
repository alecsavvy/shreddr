import { createFileRoute } from '@tanstack/react-router'
import { Heart } from 'lucide-react'

export const Route = createFileRoute('/dating')({
  component: DatingPage,
})

function DatingPage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Event Dating
        </h1>
        <p className="text-muted-foreground">
          Swipe left or right on events to find your perfect match
        </p>
      </section>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Heart className="h-6 w-6 text-primary" />
        </div>
        <p className="font-medium text-foreground">No events to show</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Check back later for new events
        </p>
      </div>
    </div>
  )
}
