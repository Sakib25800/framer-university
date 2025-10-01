-- User 1: Alice (no onboarding)
insert into auth.users (id, email, raw_user_meta_data)
values (
  gen_random_uuid(),
  'alice@example.com',
  jsonb_build_object(
    'first_name', 'Alice',
    'last_name', 'Walker'
  )
);

-- User 2: Bob (with onboarding)
with inserted_user as (
  insert into auth.users (id, email, raw_user_meta_data)
  values (
    gen_random_uuid(),
    'bob@example.com',
    jsonb_build_object(
      'first_name', 'Bob',
      'last_name', 'Johnson'
    )
  )
  returning id
)
insert into public.onboarding_responses (user_id, completed_at, experience, goal, source)
select
  id,
  now(),
  '3',
  'Building my first website',
  'X (Twitter)'
from inserted_user;

-- Seed avatars in storage
insert into storage.objects (id, bucket_id, name, owner)
values
  (gen_random_uuid(), 'avatars', 'avatars/alice.png', null),
  (gen_random_uuid(), 'avatars', 'avatars/bob.png', null);
