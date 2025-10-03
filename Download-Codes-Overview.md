# Download Codes — Full Feature Overview

## Overview

- The “Download Codes” feature lets users download promo codes for a selected batch as PDF or CSV, with client-side progress UI and either client-generated files or server-generated files via an API.
- Two implementations exist:
  - Generated downloads in `app.js`: builds CSV or PDF triggers browser download.

## UI Entry

- Triggers in `index.html`:
  - Buttons: `#btnDownloadCodes`, `#btnCodesDownload` (attach to `openDownloadModal()`)

- Action: Clicking opens the Download Form modal `#downloadModal` via `openDownloadModal()`.

## Form & Progress UI

- Modal: `#downloadModal` in `index.html`.
- Form elements:
  - `#dlFormatGroup` with radio inputs `name="dlFormat"` and values `pdf` (default checked) or `csv`.
  - `#downloadBatch`: batch dropdown populated from `state.batches`.
  - `#downloadStatus`: status filter dropdown with values: `all`, `active` (default), `used`, `redeemed`, `expired`, `blocked` (currently visual only; not applied in client code).
  - Buttons: `#downloadConfirm`, `#downloadCancel`, `#downloadClose`.
- Progress Modal: `#downloadProgressModal`.
- Progress elements: `#downloadProgressFill` (bar), `#downloadProgressText` (“X of Y codes processed”), `#downloadEtaText` (ETA).

## Client Flow (Local)

- File: `app.js`
- Key functions:
  - `openDownloadModal(batchId)`: opens `#downloadModal`, populates `#downloadBatch` options; supports preselecting a batch.
  - `handleDownloadConfirm()`: validates form via `validateDownloadForm()`, resolves `batchId` and selected `format`, then calls `downloadCodesWithProgress(format, batch)`.
  - `validateDownloadForm()`: checks radio selection and batch dropdown; shows inline errors in `#downloadModal` using `clearFormErrors()` and `showFormError()`.
  - `downloadCodesWithProgress(format, batch)`: closes the form modal, opens `#downloadProgressModal`, simulates progress with `requestAnimationFrame`, displays processed count and ETA, then dispatches to `downloadCSV(batch)` or `downloadPDF(batch)`, shows success toast, and closes the progress modal.
  - `downloadCSV(batch)`: builds CSV headers `[code,batch,amount,currency,status,created]`; filters `state.codes` by `batch.id`; serializes to CSV; creates a blob and uses an anchor click to download; filename via `formatDownloadName(batch.name, 'csv', ts)`; shows toast.
  - `downloadPDF(batch)`: collects items from `state.codes` by `batch.id`; calls `renderCodesPdf({ batchName, generatedAt, items })`; saves with filename from `formatDownloadName(batch.name, 'pdf', ts)`; shows toast.
- Data sources: Uses in-memory `state.batches` and `state.codes`. No DB fetch in this path.
- Status filter note: `#downloadStatus` is present in UI but not applied to data selection in `downloadCSV`/`downloadPDF`.

## API-Driven Flow

- File: `.legacy-2.0/api-integration-download.js`
- Key functions:
  - `window.openDownloadModal(batchId)`: populates `#downloadBatch` from `window.state.batches`, sets selected `batchId` if provided, then opens the modal via the app’s modal system; falls back to `alert` if not available.
  - `window.handleDownloadConfirm()`: validates the form, reads `batchId` and `dlFormat` from DOM, finds `batch` in `window.state.batches`, then calls `downloadCodesWithProgressAPI(format, batch)`.
  - `downloadCodesWithProgressAPI(format, batch)`: closes `#downloadModal`, opens `#downloadProgressModal`, simulates progress similarly to client path, then calls `performAPIDownload(format, batch)`; on completion, shows toast and closes the progress modal.
  - `performAPIDownload(format, batch)`: POSTs to `/api/download-codes` with `{ batchId, format }`; verifies response; derives `filename` from `Content-Disposition` or fallback `${batch.name}_YYYY-MM-DD.format`; reads response as `blob`; triggers browser download via anchor; shows success toast; handles errors and closes progress modal.
- Validation helpers: `validateDownloadForm()`, `clearFormErrors()`, `showFormError()` copied for API path.

## Backend Route

- File: `api/download-codes.js`
- Method: `POST`
- Request body: `{ batchId, format }`, where `format` ∈ {`csv`,`pdf`}.
- Behavior:
  - Validates inputs and method.
  - Queries `batches` by `id` and `promo_codes` by `batch_id` using `db.query`.
  - Returns 404 if batch or codes not found.
  - CSV: constructs headers `[code, batch, amount, currency, status, created]`; serializes rows; sets `Content-Type: text/csv` and `Content-Disposition` filename `${sanitized_batch_name}_${timestamp}.csv`; responds with CSV string.
  - PDF: creates `jsPDF` document, A4 portrait; 3×4 grid per page (12 codes/page); draws header/footer with batch name, generation date, page numbers; draws code cells with amount and currency; sets `Content-Type: application/pdf` and `Content-Disposition` filename `${sanitized_batch_name}_${timestamp}.pdf`; responds with PDF buffer.
- Dependencies: `jsPDF` for PDF rendering; `../db` uses `pg` connection pool configured by `DATABASE_URL`.

## Key IDs & Hooks

- Modals: `#downloadModal`, `#downloadProgressModal`.
- Elements: `#dlFormatGroup`, `input[name="dlFormat"]`, `#downloadBatch`, `#downloadStatus`, `#downloadConfirm`, `#downloadCancel`, `#downloadClose`, `#downloadProgressFill`, `#downloadProgressText`, `#downloadEtaText`.
- Client functions: `openDownloadModal`, `handleDownloadConfirm`, `validateDownloadForm`, `downloadCodesWithProgress`, `downloadCSV`, `downloadPDF`, `formatDownloadName`, `renderCodesPdf`.
- API functions: `window.openDownloadModal`, `window.handleDownloadConfirm`, `downloadCodesWithProgressAPI`, `performAPIDownload`, `validateDownloadForm`.

## PRD Alignment & Differences

- PRD target endpoint: `/api/v1/admin/promo-codes/download`; current route is `/api/download-codes`.
- Progress tracking: implemented as simulated progress UI; no server-sent events or real-time chunking.
- Status filter: UI includes `#downloadStatus` but backend `api/download-codes.js` does not accept a status filter and client ignores it; enhancement needed to filter codes by status.
- RBAC/permissions: no explicit admin checks in the route; PRD mentions admin context.
- PDF specifics: matches 12 codes per A4 page and includes header/footer and page counts; branding elements (logo, contacts) not observed.
- CSV specifics: includes columns per PRD, UTF-8 implied via header, escaping done for quotes; batch-only selection satisfied.

## Outputs & Side Effects

- Client path: triggers immediate browser download using Blob/object URL; filenames use `formatDownloadName()`; no server interaction.
- API path: triggers server download via fetch and writes blob to disk; filenames derived from `Content-Disposition` or fallback.
- UI: Progress modal opens during simulated processing; closes after success or error.

## Notable Considerations

- Unused status filter: consider wiring `#downloadStatus` into both client and backend.
- Large batches: client path loads all `state.codes` for the batch into memory; server path streams a single blob—consider pagination/streaming for extremely large datasets.
- Error handling: API path has basic toast feedback; client path assumes success; unify error handling and retries.
- Accessibility: progress modal uses text updates; ensure focus management and keyboard interaction for `#downloadModal` and `#downloadProgressModal`.