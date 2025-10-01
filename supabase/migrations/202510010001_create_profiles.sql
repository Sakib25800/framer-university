create table public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone default now(),
  first_name text,
  last_name text
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select using (true);

create policy "Users can insert their own profile."
  on public.profiles for insert with check ((select auth.uid()) = id);

create policy "Users can update their own profile."
  on public.profiles for update using ((select auth.uid()) = id);
