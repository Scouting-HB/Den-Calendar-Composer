# Den Schedule Calendar Builder

A client-side Svelte + Vite app for building printable Cub Scout den schedule calendars. Paste event data from a spreadsheet, pick a rank, and print a nicely formatted calendar handout.

## Setup

```bash
npm install
npm run dev
```

## How it works

- **Left pane (editor):** Configure pack name, calendar title, default meeting location, and rank. Add events manually or paste tab-separated rows (Date | Title | Location) from Excel or Google Sheets.
- **Right pane (preview):** Live preview of the printable calendar, styled with rank colors and insignia badges, grouped by month.
- **Print:** Click "Print / Save PDF" to print. The editor pane is hidden in print mode so only the calendar prints.

## Project structure

```
src/
  App.svelte              - Main layout: editor + preview side by side
  app.css                 - Global styles and CSS custom properties (scout colors)
  main.js                 - Svelte mount entrypoint
  lib/
    EventEditor.svelte    - Editor pane: settings, rank picker, paste area, events table
    CalendarPreview.svelte - Print-ready calendar preview grouped by month

scouts-assets/            - Source rank insignia JPGs and scouts.css color definitions
public/                   - Rank insignia JPGs copied here for serving

prior-work/
  Den Schedule Template.docx - Reference document showing the target output format
```

## Scout rank colors (from scouts-assets/scouts.css)

| Rank | Color |
|------|-------|
| Lion | `#EEC250` |
| Tiger | `#DA834C` |
| Wolf | `#C6443F` |
| Bear | `#9FC2DC` |
| Webelos | `#8E9F63` |
| Arrow of Light | `#E9D8C5` |
| Cub Blue | `#002F6D` |
| Cub Yellow | `#FFCE04` |

## Status

Work in progress. Core functionality is in place:
- [x] Rank picker with insignia icons
- [x] Paste from spreadsheet (tab, comma, or pipe separated)
- [x] Live calendar preview with rank theming
- [x] Print/PDF support
- [ ] Polish layout and typography to better match the prior-work docx
- [ ] Improve date column sizing in editor table
