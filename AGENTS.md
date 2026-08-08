# Agent Instructions

## Project overview

This is a client-side-only Svelte 5 + Vite app for generating printable Cub Scout den schedule calendars. There is no backend. The output is a single-page printable document styled to resemble the reference in `prior-work/Den Schedule Template.docx`.

## Tech stack

- **Svelte 5** with runes (`$state`, `$derived`, `$props`, `$bindable`)
- **Vite 8** for dev/build
- No TypeScript, no Tailwind, no SvelteKit — plain Svelte + Vite
- No dependencies beyond Svelte and Vite

## Key files

- `src/App.svelte` — Root component, holds all app state, renders editor + preview side-by-side
- `src/lib/EventEditor.svelte` — Left pane: pack settings, rank picker, paste-from-spreadsheet textarea, editable events table
- `src/lib/CalendarPreview.svelte` — Right pane: print-ready calendar preview, groups events by month, uses rank colors/insignia
- `src/app.css` — Global styles including scout color CSS custom properties and `@media print` rules
- `scouts-assets/` — Source scout rank insignia JPGs and `scouts.css` with color definitions
- `public/` — Copies of insignia JPGs for serving (referenced as `/{filename}.jpg` in components)
- `prior-work/Den Schedule Template.docx` — The reference document showing desired output format

## Architecture notes

- All state lives in `App.svelte` and is passed down via props/bindable
- The calendar preview is styled to 8.5x11in page size with print-specific CSS
- Paste handling: the `EventEditor` has a `<textarea>` paste area that intercepts paste events, parses tab-separated (Excel/Sheets default), comma-separated, or pipe-separated rows into `{ date, title, location }` objects
- Date parsing supports ISO, `MM/DD/YYYY`, and other formats `new Date()` can handle
- `@media print` in `app.css` hides the editor pane so only the calendar preview prints

## Scout color CSS custom properties

Defined in `src/app.css` `:root` and used throughout via `var(--rank-name)`:
- `--lion`, `--tiger`, `--wolf`, `--bear`, `--webelos`, `--arrow-of-light`
- `--cub-blue`, `--cub-yellow`

## Conventions

- No TypeScript — use plain JS
- Keep it simple: no routing, no stores, no external component libraries
- Svelte 5 runes only (no legacy `$:` reactive declarations or `export let`)
- Rank insignia images are in `public/` and referenced by filename directly (e.g. `src="/{rankImages[selectedRank]}"`)
