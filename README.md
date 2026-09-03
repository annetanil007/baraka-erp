This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.


You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
## Baraka | Enterprise Management & Control Platform

Next.js ERP workspace for operations, procurement, finance, inventory and control workflows.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` or the port shown by Next.js.

## Connect Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local`.
3. In Supabase Project Settings, copy the Project URL and publishable anon key into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```
4. Open Supabase SQL Editor and run `supabase/migrations/001_initial_schema.sql`.
5. Restart `npm run dev`.

The migration creates branches, user profiles, customers, sales orders and audit logs with Row Level Security enabled. The current UI keeps mock data as its demo fallback; the Supabase clients in `src/lib/supabase` are ready for wiring the forms and queries to persistence.

## Improve invoice scanning with Azure

The invoice scanner first uses Azure AI Document Intelligence when configured, then falls back to local English/Arabic OCR if Azure is unavailable.

1. Create an Azure AI Document Intelligence resource. The Free tier currently includes up to 500 pages per month.
2. In Azure Portal, open the resource and copy its Endpoint and Key 1.
3. Add these server-only values to `.env.local`:

```env
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://your-resource.cognitiveservices.azure.com
AZURE_DOCUMENT_INTELLIGENCE_KEY=your-secret-key
AZURE_DOCUMENT_INTELLIGENCE_API_VERSION=2024-11-30
```

4. Restart `npm run dev` and use **Finance → Invoices → Scan Bill**.

The key intentionally does not use `NEXT_PUBLIC_`; it is only used by the server route at `/api/ocr/invoice` and is never sent to the browser.

## Validate

```bash
npm run lint
npm run build
```
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:


You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Enterprise Management & Control Platform

Next.js ERP workspace for operations, procurement, finance, inventory and control workflows.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` or the port shown by Next.js.

## Connect Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local`.
3. In Supabase Project Settings, copy the Project URL and publishable anon key into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-anon-key
```

4. Open Supabase SQL Editor and run `supabase/migrations/001_initial_schema.sql`.
5. Restart `npm run dev`.

The migration creates branches, user profiles, customers, sales orders and audit logs with Row Level Security enabled. The current UI keeps mock data as its demo fallback; the Supabase clients in `src/lib/supabase` are ready for wiring the forms and queries to persistence.

## Validate

```bash
npm run lint
npm run build
```
