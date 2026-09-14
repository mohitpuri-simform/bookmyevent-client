# CLAUDE.md — Frontend

Guidance for Claude Code (or any engineer) working in `frontend/`.

## Project

**Event Ticket Booking POC — Web app.** A React app for two roles: users who browse events,
hold a seat, and pay; and organisers who manage their own events and view bookings for them.

The backend owns all the hard guarantees (one hold per seat, idempotent payment confirmation,
no partial bookings). The frontend's job is to **surface those states honestly** — a held seat,
an expiring hold, a failed payment, a confirmed ticket — not to re-implement any of that logic
client-side. Never assume a seat is yours until the API confirms it; never assume a hold is
still valid past its `expiresAt` without checking.

## Stack

| Concern   | Choice                                                         |
| --------- | -------------------------------------------------------------- |
| Framework | React                                                          |
| Backend   | Express API (see `backend/CLAUDE.md`)                          |
| Payments  | Stripe (Stripe.js / Stripe Elements on the client)             |
| Auth      | JWT/session token issued by backend, attached to all API calls |

## Roles and views

| Role          | Views                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------- |
| **User**      | Event list, event detail + seat map/slot picker, checkout (Stripe Elements), "My Bookings"     |
| **Organiser** | "My Events" list, create/manage event + seats, "Bookings" view scoped to their own events only |

There is no anonymous path — every screen that holds, pays, or books requires the user to be
authenticated. Design the app so an unauthenticated user is routed to login/signup before
reaching checkout, not just blocked at the API (that's the backend's job — the frontend just
shouldn't dead-end them there).

## Core UX states to handle explicitly

Because the backend models holds, expiry, and payment reconciliation carefully, the frontend
needs matching UI states — don't collapse these into a single generic "loading" or "error":

1. **Seat available** — selectable.
2. **Seat held (by someone else)** — shown as unavailable, not identical to "booked" if you want
   to distinguish them, but never selectable.
3. **Seat held by you, checkout in progress** — show a visible **countdown timer** to the hold's
   `expiresAt`. This is important: the user needs to know their hold can disappear if they
   dawdle on the payment form.
4. **Hold expired mid-checkout** — if the countdown hits zero (or the API returns "hold
   expired") before payment completes, stop the checkout flow and tell the user plainly, with a
   way to re-select the seat. Don't let them submit a payment against a dead hold.
5. **Payment processing** — after Stripe confirms client-side, there can be a gap before the
   backend's webhook-driven booking finalisation completes. Show a "confirming your booking"
   state rather than immediately declaring success — poll or await the backend's actual
   confirmation before showing the ticket reference.
6. **Booking confirmed** — show the ticket reference clearly; this is the thing the spec says
   must be safe to show even if the confirmation was delayed, so don't show it speculatively
   before the backend has actually finalised it.
7. **Payment failed / abandoned** — clear messaging, seat is released, easy path back to
   selecting a seat (possibly a different one, since the original may already be re-held).

## Data fetching and state

- Availability (seat status) should be re-fetched when entering an event page and after any
  hold attempt — don't rely on stale client state to decide what's selectable.
- Treat the hold's `expiresAt` from the API as authoritative for the countdown; don't compute
  your own local expiry independently of what the server issued.
- After Stripe payment confirmation on the client, don't assume success locally — wait for the
  backend to confirm the booking exists (poll `GET /holds/:id` or `GET /me/bookings`, or use a
  webhook-driven update if the backend exposes one) before rendering the ticket.
- "My Bookings" and "Organiser Bookings" should only ever call endpoints scoped to the logged-in
  user/organiser — don't pass or trust any user/organiser ID from client state for these calls;
  let the backend derive it from the auth token.

## Concurrency-awareness in UI

The backend guarantees only one of two simultaneous hold attempts succeeds. The frontend should:

- Handle the "seat unavailable" response gracefully when a hold attempt loses the race (this
  will happen in normal use, not just in tests) — refresh availability and let the user pick
  again, rather than treating it as an unexpected error.
- Avoid optimistic UI that marks a seat as "yours" before the hold API call actually returns
  success.

## Forms and validation

- Validate obviously bad input client-side for UX (empty fields, invalid dates on organiser
  event creation) but never treat client-side validation as sufficient — the backend re-validates
  everything, and the frontend should handle 4xx responses from the API gracefully rather than
  assuming its own validation was the last word.

## Testing priorities

1. Countdown/expiry UI: hold expires while checkout is open → user sees a clear message, not a
   stuck spinner or a successful-looking state.
2. Lost race UI: hold attempt returns "unavailable" → seat map updates, user isn't stuck.
3. Payment confirmation gap: client shows "confirming" rather than "confirmed" until the backend
   actually reports the booking exists.
4. Scoping: organiser view never renders another organiser's event data even if an ID is
   manipulated in the URL (the backend should 403/404 this — verify the frontend surfaces that
   as an error page, not a blank or broken render).

## Things to avoid

- No deciding "the seat is mine" or "the payment succeeded" purely from client-side Stripe.js
  callbacks — always confirm against the backend's booking state.
- No local/derived countdown timers that drift from the server's `expiresAt`.
- No passing user/organiser IDs from the frontend to scope "my bookings" queries — the backend
  derives identity from the auth token only.
- No silently retrying a hold on a seat that just came back "unavailable" — surface it and let
  the user choose again.
