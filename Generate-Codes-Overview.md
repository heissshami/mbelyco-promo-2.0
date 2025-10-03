# Generate Codes — Full Feature Overview

## Overview

- The “Generate Codes” feature covers batch creation, code generation, validation, progress UI, and persistence.

- Two implementations exist:
  - Client-simulated generation in `app.js`: updates in-memory state (no DB persistence).

  - API-driven generation in `api-integration-generate.js` calling `api/generate-codes.js`: persists batches and codes to the database.

## UI Entry

- Trigger: `#cardGenerate` in `index.html` under the Promo Codes section.

- Action: Clicking opens the Generate Form modal `#generateFormModal` via `openGenerateForm()`.

## Form Fields

- Modal: `#generateFormModal` in `index.html`.
- Form: `#generateForm` with fields:
  - `#gfName`: Batch Name (required; client prepends `BATCH_` if missing)
  - `#gfTotal`: Total Codes (required, `min=1`, `max=100000`)
  - `#gfAmount`: Amount per Code (required, `min=1`)
  - `#gfCurrency`: Currency (defaults to `RWF`)
  - `#gfExpiry`: Expiration Date (required)
  - `#gfUser`: Assign to User (optional)
  - `#gfDesc`: Description (optional)
- Buttons: `#generateFormSubmit`, `#generateFormCancel`, `#generateFormClose`.

## Progress UI

- Modal: `#generatingModal` in `index.html`.
- Elements: `#genProgressFill` (bar), `#genProgressText` (“X of Y codes generated”), `#genEtaText` (ETA text).

## Client Flow (Simulated)

- File: `app.js`
- Entry points:
  - `openGenerateForm()` opens `#generateFormModal` (auth check `requireAuth()`).
  - `setupGenerateForm()` wires modal buttons and ESC to close; `#generateFormSubmit` triggers `onGenerateSubmit()`.
- Submission and validation:
  - `onGenerateSubmit()` reads fields, ensures `BATCH_` prefix, validates required fields.
  - Closes the form and calls `startGenerating({ name, total, amount, currency, expiry })`.
- Generation simulation:
  - `startGenerating()`:
    - Creates a batch object with a new `id` as `b{state.batches.length+1}` and unshifts into `state.batches`.
    - Shows `#generatingModal`, computes target duration `targetMs = min(8000, max(1500, total * 10))`.
    - Uses `requestAnimationFrame` to animate progress and ETA.
    - On completion:
      - Generates `total` codes via `generateCode(new Date())`, unshifts into `state.codes` with metadata.
      - Closes `#generatingModal`, calls `renderBatches()` and `renderCodes()`, shows success toast.
- Code algorithm:
  - `generateCode(createdAt)` format: `XXXX-XXYY-XXMM-XXDD` where `YY/MM/DD` come from `createdAt`.
  - Random segments from `randomCodePart()` using charset `ACEFGHJKLMNPRSTUWXYZ0123456789`.
- Supporting utilities:
  - `openModal(id)`, `closeModal(id)` manage modal visibility.
  - `toast()`, `fmtDateTime()` assist UX and display.

## API Flow (Server-backed)

- Client file: `api-integration-generate.js`
- Entry points:
  - `window.openGenerateForm()` opens `#generateFormModal` and calls `setupGenerateFormAPI()`.
  - `setupGenerateFormAPI()` attaches `submit` and button handlers; uses `form.reportValidity()` then dispatches `submit`.

- Submission and validation:
  - `window.onGenerateSubmit(event)` prevents default; reads inputs; performs client-side validation with `showToast()`.
  - Normalizes batch name to start with `BATCH_`.
  - Constructs `requestData` with: `name`, `total_codes`, `amount_per_code`, `currency`, `expiration_date`, `description`, `assigned_user`.
  
- Server call and progress:
  - Opens `#generatingModal`, resets progress UI to 0.
  - `fetch('/api/generate-codes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestData) })`.
  - On non-OK, shows error via `showToast` and closes progress modal.
  - On success:
    - Simulates progress in ~20 steps with `setInterval`.
    - Updates `#genProgressFill` and `#genProgressText`.
    - On completion, closes modals, shows success toast, refreshes UI via `renderBatches()` and `renderCodes()`, resets `#generateForm`.

## Backend Route

- File: `api/generate-codes.js`

- Method: `POST`

- Inputs: `name`, `total_codes`, `amount_per_code`, `currency` (default `RWF`), `expiration_date`, `description` (default “Generated batch”), `assigned_user` (default “Generator”).

- Validation:
  - Requires `name`, `total_codes`, `amount_per_code`, `expiration_date`.
  - Enforces `1 ≤ total_codes ≤ 100000`.
  - Normalizes `name` to start with `BATCH_`.

- Batch creation:
  - Computes `batchId` as `b{count+1}` via `SELECT COUNT(*) FROM batches`.
  - Inserts batch into `batches` with `status='active'` and `created_at=now`.

- Code generation:
  - Uses `generateCode(createdAt)` with the same format/charset as client.
  - Builds code payloads for `total_codes` items with batch metadata and `status='active'`.
  - Inserts each code into `promo_codes` via parameterized query.

- Response:
  - `201` with `{ success: true, message, batch: {...}, codes_generated }`.

- Errors:
  - `405` for non-POST, `400` for validation issues, `500` for server errors.

## Database Layer

- File: `db.js` uses `pg.Pool` with `process.env.DATABASE_URL`, `ssl.rejectUnauthorized=false`.

- Tables referenced: `batches`, `promo_codes`

- Schema:
> batches
  - id (uuid, pk)
  - batch_name (text, unique)
  - description (text)
  - total_codes (integer)
  - amount_per_code (numeric(14,2))
  - currency (text)
  - expiration_date (timestamptz)
  - assigned_user_id (uuid, fk users.id, null)
  - status (text)  // active, expired, blocked, archived
  - created_at, updated_at (timestamptz)

> promo_codes
  - id (uuid, pk)
  - code (text, unique)
  - batch_id (uuid, fk batches.id)
  - amount (numeric(14,2))
  - status (text)  // active, expired, redeemed, reported, blocked
  - created_at (timestamptz)
  - expires_at (timestamptz, null)
  - redeemed_at (timestamptz, null)
  - reported_at (timestamptz, null)
  - blocked_at (timestamptz, null)
  - metadata (jsonb, default '{}')
  - INDEX (batch_id, status), INDEX (status)

## Key IDs and Hooks

- Triggers: `#cardGenerate` → `openGenerateForm()`.

- Form fields: `#gfName`, `#gfTotal`, `#gfAmount`, `#gfCurrency`, `#gfExpiry`, `#gfUser`, `#gfDesc`.

- Buttons: `#generateFormSubmit`, `#generateFormCancel`, `#generateFormClose`.

- Progress modal elements: `#genProgressFill`, `#genProgressText`, `#genEtaText`.

- Functions: `openGenerateForm`, `setupGenerateForm`, `onGenerateSubmit`, `startGenerating`, `generateCode`, `randomCodePart`, `openModal`, `closeModal`.

## PRD Alignment & Permissions

- PRD permissions mention `promo-codes.generate`.

- PRD requirements: uniqueness and audit logs; server relies on randomness and does not explicitly enforce uniqueness or logging.

- PRD “real-time” progress is simulated; server inserts synchronously without streaming progress updates.

## Outputs and Side Effects

- API path: persists batch and codes to the database; returns success message; client simulates progress and refreshes UI.

## Notable Details & Considerations

- Code format is `XXXX-XXYY-XXMM-XXDD` with charset `ACEFGHJKLMNPRSTUWXYZ0123456789` (avoids ambiguous characters).

- Server’s `batchId` uses `COUNT(*)`; consider sequences/UUIDs to avoid race conditions.

- Code inserts are row-by-row; consider batching/bulk-insert for large `total_codes`.