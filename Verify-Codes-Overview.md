# Verify Codes — Full Feature Overview

## Overview

- The “Verify Codes” feature lets users check a promo code’s validity, status, and value, and optionally redeem active codes by providing a phone number.
- Current implementation is a standalone page `verify.html` with client-side prototype logic using sample data; there is no API call or DB persistence in this path.

## UI Entry

- Entry points:
  - Dashboard quick action in `index.html`: `onclick="window.location.href='./verify.html'"`.
  - Login redirect in `login.html`: navigates to `verify.html` after login.
  - Router guard in `app.js`: treats `verify.html` as an allowed public page.
- Page: `verify.html` with a centered card and form.

## Form & Elements

- Form: `#verifyForm` with input `#promoCode` and submit button `#checkBtn`.
- Helper: `#codeHelp` for guidance messages.
- Value display: `#value-wrapper` containing readonly `#promoValue` and gem icon.
- Result container: `#result` renders status, actions, and messages.
- Action area (rendered dynamically inside `#result` when status is `active`):
  - Phone number wrapper `#phone-number-wrapper` with input `#phoneNumber`.
  - Buttons: `#redeemBtn` (accent) and `#checkOtherBtn` (secondary).

## Client Flow (verify.html)

- Normalization & validation:
  - `normalizeCode()` uppercases and removes spaces.
  - `isFormatValid()` enforces 4-4-4-4 alphanumeric blocks: `^[A-Z0-9]{4}-...`.
- Status derivation:
  - Primary lookup via `sampleCodes` map (prototype dataset).
  - Fallback: `parseDateFromCode()` extracts YY-MM-DD hint from code; `computeStatusByDate()` marks `active` for 90 days from derived date else `expired`.
- Submit handler `#verifyForm`:
  - Prevents default, normalizes input, clears previous result/value UI.
  - Validates format; simulates async delay; determines status and amount.
  - Renders result via `renderResult({ ok, message, status, createdAt, amount })`.
  - If `active`: reveals phone input and value; enables redeem only when phone filled.
- Result actions handler (delegated on `#result`):
  - `#redeemBtn`: requires `lastCheck.status==='active'` and phone; simulates delay, marks code as `redeemed` in `sampleCodes`, updates UI message.
  - `#checkOtherBtn`: clears input/result/value and focuses `#promoCode`.
- Icons: lucide initialized after render.

## Backend/API

- No dedicated API integration is implemented in `verify.html` (prototype).
- PRD specifies endpoints like `promo-codes.validate` and USSD redemption flow, but they are not wired here.

## Key IDs & Hooks

- Inputs: `#promoCode`, `#promoValue`, `#phoneNumber`.
- Buttons: `#checkBtn`, `#redeemBtn`, `#checkOtherBtn`.
- Containers: `#value-wrapper`, `#result`, `#phone-number-wrapper`.
- Helpers: `normalizeCode`, `isFormatValid`, `parseDateFromCode`, `computeStatusByDate`, `renderResult`.

## PRD Alignment & Gaps

- Alignment:
  - Supports code format validation and status display.
  - Simulates redemption action and confirmation.
- Gaps:
  - No real API validation (`/promo-codes/validate`) or DB lookup.
  - No proper statuses beyond prototype (`blocked`, `redeemed`, `expired`, `active`). Missing `used`, `reported`, etc.
  - No audit logging, rate limiting, or RBAC.
  - No disbursement queue or MoMo integration; redemption is local-only.
  - No idempotency or concurrency control.

## Outputs & Side Effects

- Output: Status message and badge in `#result`; optional value display in `#promoValue`.
- Side effects: When redeeming, updates `sampleCodes` map in-memory.

## Notable Considerations

- Accessibility: `aria-live` on `#result` for status; ensure form labels and aria attributes remain consistent.
- Security: Add server validation to prevent guessing/abuse; enforce rate limiting.
- Data integrity: Avoid deriving status from code; use DB with `promo_codes` statuses and expiration.
- UX: Provide clearer error messages, keyboard support for actions, and persist value display.
- Internationalization: Consider multi-language support per USSD/PRD.

## Suggested Next Steps

- Implement API endpoint for validation (e.g., `POST /api/validate-code` or `GET /api/promo-codes/validate?code=...`).
- Hook `verify.html` to call the API and render real results.
- Implement redemption API (`POST /api/redeem`) that validates, creates a redemption record, and enqueues disbursement.
- Add RBAC and authentication where applicable; tighten CORS.
- Add audit logging for checks and redemptions; show history.
- Replace `sampleCodes` with DB-backed queries; support complete status set.