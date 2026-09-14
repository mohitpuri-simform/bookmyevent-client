import { ArrowRight, CalendarCheck, ShieldCheck, Sparkles, Ticket } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { routes } from '../../constants/routes'
import { useAuth } from '../../hooks/auth/useAuth'

const features = [
  {
    icon: Ticket,
    title: 'Hold your seat',
    description: 'Reserve a seat while you check out — nobody else can take it while you pay.',
  },
  {
    icon: CalendarCheck,
    title: 'Run your own events',
    description: 'Organisers create events, manage seat inventory, and track every booking.',
  },
  {
    icon: ShieldCheck,
    title: 'Built on solid guarantees',
    description: 'No double-booked seats, no partial bookings — even under heavy concurrency.',
  },
]

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-1 flex-col items-center px-6">
      <section className="flex max-w-2xl flex-col items-center gap-6 pt-24 pb-16 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5" />
          Now booking beta
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Book events without the hassle
        </h1>
        <p className="max-w-lg text-balance text-muted-foreground sm:text-lg">
          Browse events, hold your seat, and check out securely — or create and manage your own
          events as an organiser.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {user ? (
            <Button size="lg" asChild>
              <Link to={routes.dashboard}>
                Go to dashboard
                <ArrowRight />
              </Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link to={routes.auth.register}>
                  Get started
                  <ArrowRight />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to={routes.auth.login}>Log in</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      <section className="grid w-full max-w-4xl gap-4 pb-24 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="text-left">
            <CardHeader>
              <span className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4.5" />
              </span>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
