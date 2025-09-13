# UI/UX Design Guide

## Design System Specifications
- Typography: System UI stack; scale: 12, 14, 16, 18, 20, 24, 32
- Colors: Use Tailwind CSS with brand tokens (primary, secondary, success, warning, danger, neutral)
- Spacing: 4px baseline grid (4, 8, 12, 16, 24, 32, 48)
- Components: Based on shadcn/ui primitives customized to brand
- Icons: Lucide or Heroicons
- Dark Mode: System + manual toggle

## UI Component Guidelines
- Layout: Responsive admin shell with sidebar + topbar, content area
- Inputs: Use consistent validation messaging; inline errors; helper text
- Buttons: Primary, Secondary, Destructive, Link; sizes sm/md/lg
- Tables: Paginated, sortable, filterable; sticky header; responsive on mobile
- Modals/Sheets: For create/edit forms and bulk actions
- Toasts: For success/error/async updates

## User Experience Flow Diagrams (High-level)
- Authentication: Login -> MFA (admin) -> Dashboard
- Batch Management: List -> Create -> Assign -> Generate/Import -> Monitor -> Export
- Promo Codes: List -> Generate -> Change Status -> Bulk Ops -> Download
- Redemptions: Monitor -> Search -> Audit
- Disbursements: Queue -> Retry -> Reconcile -> Reports
- Settings: Sections (Branding, USSD, Payments, Business Rules, Security, Notifications, Analytics, Integrations, Backup)

## Responsive Design Requirements
- Mobile-first, then enhance for tablet/desktop
- Breakpoints: sm 640, md 768, lg 1024, xl 1280, 2xl 1536
- Grid: 12-column desktop, single column mobile; cards stack
- Tables on mobile: collapse to cards or use horizontal scroll

## Accessibility Standards
- WCAG 2.1 AA
- Color contrast >= 4.5:1 for text
- Keyboard navigation for all interactive elements
- ARIA annotations for complex widgets
- Focus styles visible and consistent

## Style Guide and Branding
- Logo: logo.svg as primary; favicon.ico
- Brand Colors (example):
  - Primary: #0EA5E9
  - Secondary: #1E293B
  - Success: #10B981, Warning: #F59E0B, Danger: #EF4444
- Shadows, radii, borders: subtle depth; rounded-md default

## Component Library Organization
- Foundations: colors, spacing, typography in Tailwind config
- Atoms: buttons, inputs, badges, tags
- Molecules: forms, tables, filters, pagination
- Organisms: dashboards, wizards, settings panels
- Templates: admin shell, auth pages, lists/detail views

## User Journey Maps (Summaries)
- Admin Registration: visible only if enabled -> Request -> Super Admin approval -> Email with creds -> Login
- USSD Customer: Dials code -> Auto-register -> Redeem -> Receive MoMo payout -> Audit log entry

## Wireframe References (Textual)
- Dashboard: KPI cards (total redemptions, active batches, uptime), recent activity, quick actions
- Batches: List with actions; Create form; Detail with stats and actions (Generate/Import/Download)
- Promo Codes: List + filters; status badges; bulk action bar; details drawer
- Transactions: Stream/monitor view with live updates; filters by time/batch
- Reports: Builder/selector; table + chart; export buttons
- Settings: Left nav of categories; right pane with forms; save with confirmation

## Design Tool Integration
- Tailwind CSS and shadcn/ui as implementation baseline
- Tokenize colors/spacing in Tailwind; document in README of UI package if created
- Maintain component stories (optional Storybook) for complex widgets

## Responsive and Accessibility Testing Checklist
- [ ] Keyboard-only navigation across all pages
- [ ] Screen reader announcements for key actions
- [ ] Color contrast verification for themes
- [ ] Touch target sizing >= 44x44px
- [ ] Test on common browsers and devices

## Notes on Data Density and Performance
- Prefer virtualization for long tables (>500 rows)
- Use skeletons and optimistic UI for async operations
- Debounce search inputs; server-side pagination
- Background exports with notifications when ready