export const PAGE_SIZE = 10

/**
 * The checkout confirmation poll needs every booking from the cart it just paid
 * for (a cart is capped at 20 holds), newest first — so it asks for the API's
 * maximum page size rather than the display default.
 */
export const MAX_PAGE_SIZE = 50
