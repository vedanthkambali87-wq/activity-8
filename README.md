# TicketDesk

A small React ticket booking demo with sample campus events.

Run it with:

```sh
npm install
npm run dev
```

Choose **Fill sample details**, then **Book ticket**. The booking appears in **My Ticket Bookings** and remains there after a page reload.

- Confirmed bookings use local storage: `ticket-bookings`.
- The unfinished form uses session storage: `ticket-booking-draft`.
- Session storage keeps the draft when you refresh the same tab. It clears when that tab session ends.

## Debug in browser developer tools

- **Console:** Check for storage errors.
- **Application → Local Storage:** Inspect the saved bookings JSON.
- **Application → Session Storage:** Inspect the current form draft.
- **Network:** Confirm the app and assets load; this sample does not call a booking server.

Bookings are stored only in this browser and are not real reservations.
