# Import Codes — Feature Overview

This document summarizes the "Import Codes" functionality across the prototype. Like "Generate Codes" and "Download Codes", there are two client-side paths observed: a local simulation path within `app.js`, and an API-driven path via `api-integration-import.js` that posts to the backend route `api/import-codes.js`.

## UI Entry Points

- File: `.legacy-2.0/index.html`
- Locations:
  - Quick Actions → `button[data-action="import"]` opens Import modal.
  - Batches → `div.feature-card[data-card-action="import"]` includes hidden `#importFile` input.
  - Import Modal `#importModal`:
    - Dropzone: `#importDrop` (click/drag-drop to select file); hidden file input: `#importFileModal`.
    - Options: `#importSkipDup` (skip duplicates), `#importValidate` (validate format), `#importNotify` (notify on completion).
    - Template button: `#downloadCsvTemplate`.
    - Progress UI: `#importProgressFill`, `#importProgressText`, `#importEtaText` inside `.progress-container`.
    - Actions: `#importCancel`, `#cancelImportBtn` (shown during progress), `#importBtn`.

## Client-Side Flow (Local Simulation)

- File: `.legacy-2.0/app.js`
- Key hooks and handlers:
  - Modal open: `openModal('importModal')` bound to `#btnImportCodes`/`#cardImport`.
  - File handlers:
    - `#importFile` and `#importFileModal` dispatch to `handleImportFile(file)` and reset input; modal closes on `#importFileModal` change.
    - `#importDrop` supports click/keyboard triggers and drag-drop; calls `handleImportFile(file)`.
  - `importCodesWithProgress()` simulates progress:
    - Shows `.progress-container`, hides `#importBtn`, shows `#cancelImportBtn`.
    - Calculates a random `totalCodes` (100–600), animates progress with `requestAnimationFrame`, updates `#importProgressFill`, `#importProgressText`, `#importEtaText`.
    - On completion, hides progress UI, restores buttons, shows success toast via `showSuccessMessage()`, and closes `#importModal`.
  - `handleImportFile(file)` (local CSV ingest):
    - Reads CSV, parses columns: `code,batch,amount,currency,status,created`.
    - Determines `batchName` from file content or defaults to `IMPORTED_BATCH`.
    - Creates or finds batch in `state.batches`; inserts codes into `state.codes` with generated ids; updates `batch.total_codes`.
    - Refreshes UI (`renderBatches`, `renderCodes`); shows success toast. No server interaction.

## API-Driven Flow (Client → Server)

- File: `.legacy-2.0/api-integration-import.js`
- Key functions:
  - `window.handleImportFile(file)`: reads file text; collects options (currently referenced as `#skipDuplicates`, `#validateFormat`, `#sendNotifications` — note mismatch with actual IDs); POSTs JSON to `/api/import-codes` with `{ file, fileName, importType: 'csv', options }`; handles success/error; refreshes UI and resets inputs; closes modal via `Modal` if available.
  - `window.importCodesWithProgress(file, options)`: shows a separate progress modal (`#importProgressModal`) if present (not defined in HTML); simulates progress to 70%, then uploads; on success, completes to 100%, closes modal, shows toast, refreshes UI.
  - Event wiring:
    - `#importFile` → `change` → `window.handleImportFile`.
    - `#importSettings` → `change` → `window.importSettings` (settings JSON import).
    - `#importBtn` → `onclick`: if `#importFileModal` has files, calls `window.importCodesWithProgress(files[0], { skipDuplicates, validateFormat, sendNotifications })`; otherwise shows error toast.
    - `#importDrop` drag/drop: populates `#importFileModal` and triggers `window.importCodesWithProgress(file, options)`.
  - `window.importSettings(event)`: reads JSON settings and posts to `/api/import-codes` with `importType: 'settings'`.

## Backend Route

- File: `.legacy-2.0/api/import-codes.js`
- Endpoint: `POST /api/import-codes`
- Behavior:
  - Validates presence of `file` and `fileName`.
  - Detects import type: CSV for codes; JSON for settings.
  - CSV path:
    - Parses CSV rows (`parseCSV`), extracting `code,batch,amount,currency,status,created`.
    - Ensures batch exists in `batches` table (create if missing), then inserts codes into `promo_codes` in batches of 100.
    - Updates `total_codes` for existing batch; returns `200` with `importedCount`, `batchName`, `batchId`.
  - Settings path:
    - Validates JSON structure via `validateSettings`, returns `200` success with `settings` echo.
  - Error handling: responds with `400` for invalid input/parse errors; `500` for server errors.

## Key IDs & Hooks

- Modal: `#importModal` with `#importClose`, `#importCancel`, `#cancelImportBtn`, `#importBtn`.
- File inputs: `#importFile`, `#importFileModal`; Dropzone: `#importDrop`.
- Options: `#importSkipDup`, `#importValidate`, `#importNotify` (note: integration script expects `#skipDuplicates`, `#validateFormat`, `#sendNotifications`).
- Progress UI: `#importProgressFill`, `#importProgressText`, `#importEtaText` (local simulation). No `#importProgressModal` defined in HTML.

## PRD Alignment & Discrepancies

- Local vs API: local path imports directly into in-memory `state` without backend; API path persists to Supabase.
- Options IDs mismatch: UI uses `#importSkipDup`, `#importValidate`, `#importNotify`, whereas API integration reads `#skipDuplicates`, `#validateFormat`, `#sendNotifications`. Options may not be captured unless reconciled.
- Progress modal: API integration expects `#importProgressModal` and `#importProgressBar`, which are not present in `index.html`; local path uses inline `.progress-container` instead.
- Auth/RBAC: local `requireAuth()` gate exists; API path relies on client auth only; backend uses service key and allows all origins.
- File size limits and validation: UI indicates max 10MB, but no enforcement in client or backend; backend parses CSV without streaming.

## Outputs & Side Effects

- Local path: updates `state.batches` and `state.codes`, shows toast, re-renders lists; filenames not used for local import.
- API path: persists to Supabase tables; closes modal and resets file inputs; shows toast; re-renders via client.

## Notable Considerations

- Large imports: backend inserts in chunks of 100; client uses full-file read. Consider server-side streaming and stronger validation.
- Duplicate handling: UI offers a "Skip duplicate codes" option but backend does not enforce uniqueness; consider deduplication or DB constraints.
- Data integrity: CSV parsing is naive (comma-split, basic quote handling) and may break with embedded commas/quotes; consider robust CSV parsing.
- Accessibility: ensure focus management and keyboard support for dropzone and progress; `#cancelImportBtn` becomes visible only during progress.
- Security: Service key in backend requires secure hosting; CORS `*` opens endpoint publicly—restrict as needed.