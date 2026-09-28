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
 * `row` is 1-based within its own section with row 1 stored bottommost, so
 * the sequence runs bottom-to-top: the last (bottommost) row is "A" and
 * letters increase going up toward the stage.
 */
export function displayRowLabel(row: number, totalRows: number): string {
  return rowLabel(totalRows - row + 1)
}

/** Seat label as shown in the seat map preview, e.g. row 1 of 3, col 1 -> "A1". */
export function seatLabel(row: number, col: number, totalRows: number): string {
  return `${displayRowLabel(row, totalRows)}${col}`
}
