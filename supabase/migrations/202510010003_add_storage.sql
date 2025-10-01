insert into storage.buckets (id, name)
values ('avatars', 'avatars')
on conflict (id) do nothing;

create policy "Avatar images are publicly accessible."
  on storage.objects for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar."
  on storage.objects for insert with check (bucket_id = 'avatars');

create policy "Anyone can update their own avatar."
  on storage.objects for update using ((select auth.uid()) = owner)
  with check (bucket_id = 'avatars');
