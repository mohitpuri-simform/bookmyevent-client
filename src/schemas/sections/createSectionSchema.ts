import { z } from 'zod'

const MAX_SECTION_ROWS = 50
const MAX_SECTION_SEATS_PER_ROW = 50
const MAX_SECTION_SEATS = 500

const optionalAisle = z.preprocess(
  (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
  z.number().int().min(1).optional(),
)

export const createSectionSchema = z
  .object({
    name: z.string().trim().min(1, 'Section name is required.').max(100),
    rows: z.coerce
      .number()
      .int()
      .min(1, 'Must have at least 1 row.')
      .max(MAX_SECTION_ROWS, `Cannot exceed ${MAX_SECTION_ROWS} rows.`),
    seatsPerRow: z.coerce
      .number()
      .int()
      .min(1, 'Must have at least 1 seat per row.')
      .max(MAX_SECTION_SEATS_PER_ROW, `Cannot exceed ${MAX_SECTION_SEATS_PER_ROW} seats per row.`),
    price: z.coerce.number().min(0, 'Price cannot be negative.'),
    aisleAfterSeat: optionalAisle,
  })
  .refine((data) => data.rows * data.seatsPerRow <= MAX_SECTION_SEATS, {
    message: `A section can have at most ${MAX_SECTION_SEATS} seats (rows × seats per row).`,
    path: ['rows'],
  })
  .refine((data) => data.aisleAfterSeat == null || data.aisleAfterSeat <= data.seatsPerRow - 1, {
    message: 'Aisle position must fall between two seats in the row.',
    path: ['aisleAfterSeat'],
  })

export type CreateSectionFormInput = z.input<typeof createSectionSchema>
export type CreateSectionPayload = z.output<typeof createSectionSchema>
