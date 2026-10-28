# Jireh Patient Waitlist

A Next.js application for managing patient waitlists with Supabase and Resend email notifications.

## Project

This project manages patient waitlist signups with secure authentication and email notifications. Built with Next.js, TypeScript, Tailwind CSS, and integrated with Supabase for data persistence and Resend for email delivery.

## Local setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Jireh-Health/jireh-patient-waitlist.git
   cd jireh-patient-waitlist
   ```

2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. In the SQL Editor, run the schema from `supabase/schema.sql`:
   ```sql
   create table if not exists patient_waitlist (
     id uuid primary key default gen_random_uuid(),
     first_name text not null,
     last_name  text not null,
     phone      text not null,
     consented_at timestamptz not null,
     created_at   timestamptz not null default now()
   );
   ```

3. Copy your Supabase URL and anon key from the project settings and paste them into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## Resend setup

1. Create a Resend account at [resend.com](https://resend.com)

2. Generate an API key in your Resend dashboard

3. Set the API key and notification email in `.env.local`:
   ```
   RESEND_API_KEY=your-api-key
   NOTIFICATION_EMAIL=your-notification-email@example.com
   ```

## Deployment

Deploy to Vercel:

1. Connect your GitHub repository to Vercel at [vercel.com/new](https://vercel.com/new)

2. Set the following environment variables in your Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
   - `NOTIFICATION_EMAIL`

3. Set your production domain to `app.jireh-health.com` in the Vercel project domains settings

4. Deploy by pushing to your main branch
