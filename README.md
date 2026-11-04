# Baraka ERP

Baraka is an enterprise operations platform for finance, procurement, inventory, sales, control, reporting, and administration.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Next.js, usually `http://localhost:3000`.

## Current features

- Operations dashboard with analytics and monthly charts
- Owner Command Center with business pulse, recommended actions, profitability signals, and stock watch
- Cash Flow Center with liquidity forecast, collections, commitments, and safety-buffer recommendations
- Inventory Intelligence with reorder recommendations, dead-stock radar, and branch-transfer opportunities
- Approval Center with risk-prioritized queues, exposure totals, and recommended decision focus
- Sales orders and customer management
- Inventory, stock alerts, and branch transfers
- Purchase requests, purchase orders, suppliers, and receiving
- Accounts, invoices, payments, expenses, and reconciliation
- Exceptions, approvals, reviews, and audit-oriented workflows
- User, role, branch, and system settings screens
- English/Arabic toggle with RTL layout support
- Browser-persistent demo data for local development
- Supplier bill upload, image enhancement, and bilingual OCR

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local`.
3. Add your Supabase URL and publishable key:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

4. In Supabase **SQL Editor**, run [001_initial_schema.sql](supabase/migrations/001_initial_schema.sql), then [002_cogs_foundation.sql](supabase/migrations/002_cogs_foundation.sql), then [003_cogs_posting_engine.sql](supabase/migrations/003_cogs_posting_engine.sql).
5. Restart the development server.

For local UI preview only, set `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local`. This bypasses authentication only when running in development; production always requires Supabase authentication.

The migrations create branches, profiles, customers, sales orders, inventory, and the COGS foundation with Row Level Security enabled. The posting engine creates cost layers for receipts and posts COGS atomically for sale movements using each product's FIFO or weighted-average method. The current demo UI uses browser storage and mock data while the Supabase clients are ready for persistent query integration.

## Optional invoice AI

The invoice scanner works locally with bilingual OCR. For higher invoice accuracy, configure Azure AI Document Intelligence using server-only variables:

```env
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://your-resource.cognitiveservices.azure.com
AZURE_DOCUMENT_INTELLIGENCE_KEY=your-secret-key
AZURE_DOCUMENT_INTELLIGENCE_API_VERSION=2024-11-30
```

Never use `NEXT_PUBLIC_` for the Azure key. The scanner will use the secure server route at `/api/ocr/invoice` when Azure is configured and fall back to local OCR otherwise.

## Validate

```bash
npm run lint
npm run build
```
