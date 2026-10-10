/**
 * Display-only: the backend is what actually refuses to sell an ended event
 * (it uses the same rule — over once `endDate` has passed). This just lets the
 * UI say so up front instead of waiting for a rejected hold.
 */
export function hasEventEnded(event: { endDate: string }): boolean {
  return new Date(event.endDate).getTime() <= Date.now()
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/** Today's date as `yyyy-mm-dd` in the user's timezone, for `<input type="date" min>`. */
export function todayInputValue(): string {
  const now = new Date()
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/** Now as `yyyy-mm-ddThh:mm` in the user's timezone, for `<input type="datetime-local" min>`. */
export function nowDatetimeLocalValue(): string {
  const now = new Date()
  return `${todayInputValue()}T${pad(now.getHours())}:${pad(now.getMinutes())}`
}
