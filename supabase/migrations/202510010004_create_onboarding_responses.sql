create table public.onboarding_responses (
  user_id uuid primary key references auth.users(id),
  completed_at timestamp with time zone,
  experience text,
  goal text,
  source text
);

alter table public.onboarding_responses enable row level security;

create policy "Users can view their own onboarding response."
  on public.onboarding_responses for select using ((select auth.uid()) = user_id);

create policy "Users can insert their own onboarding response."
  on public.onboarding_responses for insert with check ((select auth.uid()) = user_id);

create policy "Users can update their own onboarding response."
  on public.onboarding_responses for update using ((select auth.uid()) = user_id);
