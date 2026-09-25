import {
  Clapperboard,
  Drama,
  Music,
  PartyPopper,
  Sparkles,
  Ticket,
  Trophy,
  type LucideIcon,
} from 'lucide-react'

// No poster art in the data model — these generate a distinct, deterministic
// "cover" per event (by id) instead, so the same event always looks the same
// across the events grid, bookings list, and detail pages.
const POSTER_GRADIENTS = [
  'from-indigo-500/35 via-indigo-950/50 to-background',
  'from-rose-500/35 via-rose-950/50 to-background',
  'from-amber-500/30 via-amber-950/50 to-background',
  'from-emerald-500/30 via-emerald-950/50 to-background',
  'from-sky-500/35 via-sky-950/50 to-background',
  'from-fuchsia-500/30 via-fuchsia-950/50 to-background',
  'from-teal-500/30 via-teal-950/50 to-background',
  'from-orange-500/30 via-orange-950/50 to-background',
] as const

const POSTER_ICONS: LucideIcon[] = [
  Ticket,
  Clapperboard,
  Music,
  PartyPopper,
  Sparkles,
  Drama,
  Trophy,
]

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

export function posterGradient(seed: string): string {
  return POSTER_GRADIENTS[hashString(seed) % POSTER_GRADIENTS.length]
}

export function posterIcon(seed: string): LucideIcon {
  return POSTER_ICONS[hashString(`icon:${seed}`) % POSTER_ICONS.length]
}
