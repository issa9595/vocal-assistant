-- ============================================
-- SCHÉMA SUPABASE POUR VOICE ASSISTANT
-- ============================================
-- 
-- Ce schéma définit les tables pour :
-- 1. L'historique de chat avec l'IA
-- 2. Les événements du calendrier
--
-- Pour l'instant, système mono-utilisateur avec user_id fixe "demo-user"
-- Le schéma est prêt pour être étendu avec l'authentification multi-utilisateurs
-- ============================================

-- ============================================
-- TABLE: conversations
-- ============================================
-- Une conversation = un fil de discussion avec l'IA
-- Peut correspondre à une journée, un sujet, etc.
-- ============================================

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default 'demo-user',
  title text,
  created_at timestamptz not null default now(),
  
  -- Index pour améliorer les performances
  constraint conversations_user_id_check check (char_length(user_id) > 0)
);

-- Index pour les requêtes par user_id
create index if not exists idx_conversations_user_id on public.conversations(user_id);
create index if not exists idx_conversations_created_at on public.conversations(created_at desc);

-- ============================================
-- TABLE: messages
-- ============================================
-- Les messages d'une conversation (user ↔ assistant)
-- ============================================

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now(),
  
  constraint messages_content_check check (char_length(content) > 0)
);

-- Index pour les requêtes par conversation_id
create index if not exists idx_messages_conversation_id on public.messages(conversation_id);
create index if not exists idx_messages_created_at on public.messages(created_at);

-- ============================================
-- TABLE: calendar_events
-- ============================================
-- Les événements du calendrier
-- ============================================

create table if not exists public.calendar_events (
  id text primary key, -- Format: "evt_timestamp_random"
  user_id text not null default 'demo-user',
  title text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  description text,
  location text,
  source text check (source in ('voice', 'manual', 'ai')) default 'manual',
  meta jsonb, -- Pour stocker groupId et autres métadonnées (ex: {"groupId": "group_123"})
  created_at timestamptz not null default now(),
  
  constraint calendar_events_title_check check (char_length(title) > 0),
  constraint calendar_events_date_check check (end_time > start_time)
);

-- Index pour les requêtes par user_id
create index if not exists idx_calendar_events_user_id on public.calendar_events(user_id);
-- Index pour les requêtes par date (pour filtrer par période)
create index if not exists idx_calendar_events_start_time on public.calendar_events(start_time);
create index if not exists idx_calendar_events_end_time on public.calendar_events(end_time);
-- Index pour les requêtes par groupId (via meta JSONB)
create index if not exists idx_calendar_events_meta_group_id on public.calendar_events using gin ((meta->'groupId'));

-- ============================================
-- POLITIQUES RLS (Row Level Security)
-- ============================================

alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.calendar_events enable row level security;

create policy "conversations_own_rows" on public.conversations
  for all
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

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

create policy "calendar_events_own_rows" on public.calendar_events
  for all
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

-- ============================================
-- FONCTIONS UTILITAIRES (optionnel)
-- ============================================

-- Fonction pour obtenir les événements d'une période
create or replace function get_events_for_period(
  p_user_id text,
  p_start_date timestamptz,
  p_end_date timestamptz
)
returns table (
  id text,
  user_id text,
  title text,
  start_time timestamptz,
  end_time timestamptz,
  description text,
  location text,
  source text,
  meta jsonb,
  created_at timestamptz
)
language sql
stable
as $$
  select 
    id,
    user_id,
    title,
    start_time,
    end_time,
    description,
    location,
    source,
    meta,
    created_at
  from public.calendar_events
  where 
    user_id = p_user_id
    and start_time >= p_start_date
    and start_time <= p_end_date
  order by start_time asc;
$$;

