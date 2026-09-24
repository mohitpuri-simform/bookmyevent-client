import { cn } from '@/lib/utils'

/** Display-level status: splits the backend's `HELD` into "by me" vs "by someone else" (CLAUDE.md §Core UX states). */
export type SeatDisplayStatus = 'AVAILABLE' | 'HELD_BY_ME' | 'HELD_BY_OTHER' | 'BOOKED'

interface SeatMapGridSeat {
  id: string
  row: number
  col: number
  status: SeatDisplayStatus
}

interface SeatMapGridProps {
  rows: number
  seatsPerRow: number
  aisleAfterSeat?: number | null
  seats: SeatMapGridSeat[]
  onSeatClick?: (seatId: string) => void
  disabled?: boolean
}

const STATUS_STYLES: Record<SeatDisplayStatus, string> = {
  AVAILABLE: 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer',
  HELD_BY_ME:
    'border-amber-500/60 bg-amber-500/15 text-amber-700 dark:text-amber-400 cursor-pointer',
  HELD_BY_OTHER: 'border-border bg-muted text-muted-foreground cursor-not-allowed',
  BOOKED: 'border-border bg-foreground/10 text-muted-foreground cursor-not-allowed',
}

const SEAT_SIZE = '1.75rem'
const AISLE_SIZE = '1rem'

function seatColumnStart(col: number, aisleAfterSeat?: number | null): number {
  if (aisleAfterSeat != null && col > aisleAfterSeat) {
    return col + 1
  }
  return col
}

/**
 * Spreadsheet-style row label (1 -> A, 26 -> Z, 27 -> AA, ...).
 */
function rowLabel(n: number): string {
  let label = ''
  while (n > 0) {
    const remainder = (n - 1) % 26
    label = String.fromCharCode(65 + remainder) + label
    n = Math.floor((n - 1) / 26)
  }
  return label
}

/**
 * `row` is 1-based within its own section with row 1 rendered at the top, so
 * labels naturally reset to "A" for every section rather than continuing
 * across the whole event. The sequence runs bottom-to-top: the last
 * (bottommost) row is "A" and letters increase going up toward the stage.
 */
function displayRowLabel(row: number, totalRows: number): string {
  return rowLabel(totalRows - row + 1)
}

export function SeatMapGrid({
  rows,
  seatsPerRow,
  aisleAfterSeat,
  seats,
  onSeatClick,
  disabled,
}: SeatMapGridProps) {
  const hasAisle = aisleAfterSeat != null
  const columnTemplate = Array.from({ length: seatsPerRow }, () => SEAT_SIZE)
  if (hasAisle) {
    columnTemplate.splice(aisleAfterSeat, 0, AISLE_SIZE)
  }

  return (
    <div className="flex w-full justify-center gap-2">
      <div className="grid gap-1.5" style={{ gridTemplateRows: `repeat(${rows}, ${SEAT_SIZE})` }}>
        {Array.from({ length: rows }, (_, i) => i + 1).map((row) => (
          <span
            key={row}
            className="flex items-center justify-center text-[0.65rem] font-semibold text-muted-foreground"
          >
            {displayRowLabel(row, rows)}
          </span>
        ))}
      </div>
      <div
        className="grid w-fit gap-1.5"
        style={{
          gridTemplateColumns: columnTemplate.join(' '),
          gridTemplateRows: `repeat(${rows}, ${SEAT_SIZE})`,
        }}
      >
        {seats.map((seat) => {
          const selectable =
            !disabled &&
            (seat.status === 'AVAILABLE' || seat.status === 'HELD_BY_ME') &&
            !!onSeatClick

          return (
            <button
              key={`${seat.row}-${seat.col}`}
              type="button"
              disabled={!selectable}
              onClick={() => onSeatClick?.(seat.id)}
              title={`Row ${displayRowLabel(seat.row, rows)}, Seat ${seat.col}`}
              className={cn(
                'flex items-center justify-center rounded-md border text-[0.6rem] font-medium transition-colors disabled:cursor-not-allowed',
                STATUS_STYLES[seat.status],
              )}
              style={{
                gridColumnStart: seatColumnStart(seat.col, aisleAfterSeat),
                gridRowStart: seat.row,
              }}
            >
              {seat.col}
            </button>
          )
        })}
      </div>
    </div>
  )
}
