create table if not exists patient_waitlist (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name  text not null,
  phone      text not null,
  consented_at timestamptz not null,
  created_at   timestamptz not null default now()
);
