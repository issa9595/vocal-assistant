# Configuration Supabase

Ce guide explique comment configurer Supabase pour persister les données de l'application.

## 📋 Prérequis

1. Un compte Supabase (gratuit) : https://supabase.com
2. Un projet Supabase créé

## 🔧 Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur https://supabase.com/dashboard
2. Créez un nouveau projet
3. Notez l'URL du projet et la clé anonyme (anon key)

### 2. Exécuter le schéma SQL

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Copiez le contenu du fichier `supabase/schema.sql`
3. Exécutez le script SQL dans l'éditeur

Cela créera les tables :
- `conversations` : Historique des conversations avec l'IA
- `messages` : Messages individuels (user ↔ assistant)
- `calendar_events` : Événements du calendrier

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key-ici

# Gemini (existant)
GEMINI_API_KEY=votre-cle-api-gemini
```

**Où trouver ces valeurs :**
- `NEXT_PUBLIC_SUPABASE_URL` : Dans votre projet Supabase → Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Dans votre projet Supabase → Settings → API → Project API keys → `anon` `public`

### 4. Redémarrer le serveur de développement

```bash
npm run dev
```

## 📊 Structure des données

### Table `conversations`
- `id` : UUID (généré automatiquement)
- `user_id` : Text (pour l'instant fixe "demo-user")
- `title` : Text (optionnel)
- `created_at` : Timestamp

### Table `messages`
- `id` : UUID (généré automatiquement)
- `conversation_id` : UUID (référence à conversations)
- `role` : "user" | "assistant"
- `content` : Text
- `created_at` : Timestamp

### Table `calendar_events`
- `id` : Text (format: "evt_timestamp_random")
- `user_id` : Text (pour l'instant fixe "demo-user")
- `title` : Text
- `start` : Timestamp
- `end` : Timestamp
- `description` : Text (optionnel)
- `location` : Text (optionnel)
- `source` : "voice" | "manual" | "ai"
- `meta` : JSONB (pour stocker groupId et autres métadonnées)
- `created_at` : Timestamp

## 🔌 API Routes disponibles

### Conversations
- `GET /api/conversations` : Liste les conversations
- `POST /api/conversations` : Crée une conversation
- `GET /api/conversations/[id]/messages` : Récupère les messages
- `POST /api/conversations/[id]/messages` : Ajoute un message

### Événements
- `GET /api/events` : Liste les événements (filtres: ?start=...&end=...)
- `POST /api/events` : Crée un ou plusieurs événements
- `PUT /api/events/[id]` : Met à jour un événement
- `DELETE /api/events/[id]` : Supprime un événement

## 🚀 Prochaines étapes

Une fois Supabase configuré, les composants `AiModal` et `useCalendarStore` devront être adaptés pour utiliser ces API routes au lieu de localStorage.

## ⚠️ Notes importantes

- Pour l'instant, le système utilise un `user_id` fixe "demo-user"
- RLS (Row Level Security) est désactivé pour simplifier
- Quand l'authentification sera implémentée, il faudra :
  - Activer RLS
  - Créer des politiques de sécurité
  - Utiliser le vrai `user_id` depuis la session

