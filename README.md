# To‑Do List (HTML, CSS, JavaScript)

A simple, responsive to‑do list app that stores tasks in your browser using localStorage.

## Features

- Add tasks with the input and Add button (Enter also works)
- Mark tasks as done with a checkbox
- Edit tasks by double‑clicking the text (Enter to save, Esc to cancel)
- Delete tasks with the trash button
- Filters: All / Active / Completed
- Clear Completed action
- Persistent storage with `localStorage` (survives reloads)
- Accessible keyboard interactions and ARIA labels

## Files

- `index.html` — App structure
- `styles.css` — Styling, hover effects, color-coded statuses
- `app.js` — App logic and persistence

## Run locally

Just open `index.html` in your browser. If you prefer a local server, any static server works.

## Manual test checklist

- Persistence: Add a few tasks, reload the page — tasks should remain.
- Mark as Done: Check/uncheck; completed items show strikethrough and green tint.
- Edit: Double‑click a task, change text, press Enter to save; press Esc to cancel.
- Delete: Remove a task; it disappears and doesn’t come back on reload.
- Filters: Switch among All / Active / Completed; counts update accordingly.
- Responsiveness: Shrink the window or use mobile view — layout remains usable.

## Notes

No build step or external dependencies are required. Everything runs in the browser.