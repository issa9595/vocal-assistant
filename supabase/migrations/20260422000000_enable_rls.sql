-- Enable Row Level Security on all user tables
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.calendar_events enable row level security;

-- conversations: each user sees only their own rows
create policy "conversations_own_rows" on public.conversations
  for all
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

-- messages: access via conversation ownership
create policy "messages_via_conversations" on public.messages
  for all
  using (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
        and conversations.user_id = auth.uid()::text
    )
  )
  with check (
    exists (
      select 1 from public.conversations
      where conversations.id = messages.conversation_id
        and conversations.user_id = auth.uid()::text
    )
  );

-- calendar_events: each user sees only their own rows
create policy "calendar_events_own_rows" on public.calendar_events
  for all
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);
