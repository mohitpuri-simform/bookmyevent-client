/**
 * Display-only: the backend is what actually refuses to sell an ended event
 * (same rule — an event is expired from the day after its `endDate`). This just lets the
 * UI say so up front instead of waiting for a rejected hold.
 */
export function hasEventEnded(event: { endDate: string }): boolean {
  return event.endDate.slice(0, 10) < todayInputValue()
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

/** Today's date in IST (the app's fixed timezone) as `yyyy-mm-dd`, for `<input type="date" min>`. */
export function todayInputValue(): string {
  return new Date(Date.now() + IST_OFFSET_MS).toISOString().slice(0, 10)
}

function formatDay(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** e.g. `Starts 12 Oct 2026` — events are scheduled by day, not time. */
export function formatEventStart(date: string): string {
  return `Starts ${formatDay(date)}`
}

/** e.g. `Ends 14 Oct 2026`. */
export function formatEventEnd(endDate: string): string {
  return `Ends ${formatDay(endDate)}`
}
