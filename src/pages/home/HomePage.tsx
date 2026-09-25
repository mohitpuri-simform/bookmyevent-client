import { CalendarCheck, ShieldCheck, Sparkles, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { routes } from '../../constants/routes'

const HIGHLIGHTS = [
  {
    icon: Ticket,
    title: 'Real-time seat holds',
    description:
      'Pick a seat and it’s reserved just for you while you check out — no race conditions.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure checkout',
    description: 'Payments run through Stripe, so your card details never touch our servers.',
  },
  {
    icon: CalendarCheck,
    title: 'One place for your tickets',
    description: 'Every confirmed booking and ticket reference, always a click away.',
  },
]

export function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="size-7" />
        </span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Book your next event in minutes
        </h1>
        <p className="max-w-xl text-balance text-muted-foreground sm:text-lg">
          Browse events, hold your favourite seat, and check out securely — all in one place.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link to={routes.events.list}>Browse events</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to={routes.auth.register}>Sign up</Link>
          </Button>
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/10">
        <div className="mx-auto grid w-full max-w-4xl gap-6 px-6 py-16 sm:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h2 className="text-sm font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
