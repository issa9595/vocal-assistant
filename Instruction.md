# Instruction.md - Journal des actions

> Ce fichier trace les actions effectuées sur le projet "Helpiya".
> Dernière mise à jour : 10 décembre 2025

---

## 📋 Résumé du projet

**Helpiya** est une application web mobile-first permettant de gérer un **calendrier** (jour/semaine/mois) via un assistant vocal IA connecté à **Gemini 2.5 Flash**.

### Stack technique
- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS v4
- **React** : v19
- **State Management** : Zustand (avec persistance Supabase)
- **Base de données** : Supabase (PostgreSQL)
- **IA** : Google Gemini 2.5 Flash (via @google/genai)

---

## ✅ Actions réalisées

### Session 1 du 10/12/2025 - Structure initiale

#### 1. Structure de fichiers créée

```
src/
├── app/
│   ├── globals.css      # Styles globaux + animations
│   ├── layout.tsx       # Layout racine avec métadonnées
│   └── page.tsx         # Page d'accueil / Dashboard
├── components/
│   ├── index.ts         # Barrel export
│   ├── Agenda.tsx       # Composant agenda/liste de tâches
│   ├── AiFabButton.tsx  # Bouton flottant IA (FAB)
│   └── AiModal.tsx      # Modale assistant vocal
├── hooks/
│   └── useSpeechRecognition.ts  # Hook reconnaissance vocale
└── types/
    └── message.ts       # Types TypeScript centralisés
```

#### 2. Composants initiaux
- Dashboard mobile-first
- Agenda avec données mock
- Modale avec reconnaissance vocale
- Réponses simulées (stub)

---

### Session 2 du 10/12/2025 - Intégration Gemini + Zustand

#### 8. Correction erreur "aborted"
- Gestion silencieuse de l'erreur "aborted" dans `useSpeechRecognition`
- Protection contre les démarrages multiples avec `isStartingRef`
- Amélioration de la robustesse de la reconnaissance vocale

---

### Session 3 du 10/12/2025 - Planning intelligent avec décomposition automatique

---

### Session 4 du 10/12/2025 - Refonte : Suppression des tâches, planification dans les créneaux libres

---

### Session 5 du 10/12/2025 - Intégration Supabase

#### 1. Dépendances ajoutées
```bash
npm install zustand @google/genai
```

#### 2. Nouvelle structure de fichiers

```
src/
├── app/
│   ├── api/
│   │   └── assistant/
│   │       └── route.ts    # API Route Gemini
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Agenda.tsx          # ✨ Connecté au store Zustand
│   ├── AiFabButton.tsx
│   └── AiModal.tsx         # ✨ Connecté à l'API Gemini
├── hooks/
│   └── useSpeechRecognition.ts
├── store/
│   └── useAgendaStore.ts   # 🆕 Store Zustand pour l'agenda
└── types/
    └── message.ts          # ✨ Types enrichis (actions IA)
```

#### 3. Types TypeScript enrichis (`src/types/message.ts`)
- `Task` : nouveau format avec `time: string` (HH:mm), `fromVoice?: boolean`
- `AssistantActionType` : union type pour les actions (add_task, complete_task, etc.)
- `AddTaskAction`, `CompleteTaskAction`, `DeleteTaskAction`, `ListTasksAction`
- `AssistantResponse` : réponse complète avec message + action
- `GeminiRequestPayload` : payload pour l'API

#### 4. Store Zustand (`src/store/useAgendaStore.ts`)
- État global des tâches
- Actions CRUD : `addTask`, `removeTask`, `toggleTask`, `completeTask`, `updateTask`
- Méthodes utilitaires : `findTaskByTitle`, `getPendingTasks`, `getCompletedTasks`
- Persistance localStorage avec middleware `persist`
- Sérialisation personnalisée des dates

#### 5. API Route Gemini (`src/app/api/assistant/route.ts`)
- Connexion à Gemini 2.5 Flash via `@google/genai`
- **Function Calling** (calendrier) :
  - `add_event` : Ajoute un évènement (titre + start/end)
  - `update_event` : Met à jour un évènement
  - `delete_event` : Supprime un évènement
  - `list_events` : Liste les évènements (jour/semaine/mois)
- Utilise `parametersJsonSchema` (JSON Schema standard)
- Prompt avec contexte : vue actuelle (jour/semaine/mois), date de référence, évènements existants
- Mode fallback si API non configurée

#### 6. Composant Calendrier
- Nouveau composant `CalendarView` (Jour / Semaine / Mois)
- Sélecteur de vue + navigation (précédent / suivant / aujourd'hui)
- Liste des évènements triés par date/heure
- Badge vocal pour les évènements créés par l'assistant

#### 7. Composant AiModal mis à jour
- Appel à l'API `/api/assistant` au lieu du stub
- Exécution des actions calendrier retournées par Gemini
- Suggestions d'actions dans l'écran d'accueil
- Mention "Propulsé par Gemini"

---

## 🎯 Fonctionnalités implémentées

| Fonctionnalité | Statut | Notes |
|----------------|--------|-------|
| Dashboard mobile-first | ✅ | max-w-md centré |
| Calendrier (jour/semaine/mois) | ✅ | Vue + navigation + sélecteur |
| Store calendrier | ✅ | Zustand + localStorage |
| Bouton IA flottant (FAB) | ✅ | Position fixe bas-droite |
| Modale assistant | ✅ | Plein écran mobile |
| Historique conversation | ✅ | Bulles chat user/assistant |
| Reconnaissance vocale | ✅ | API Web Speech (fr-FR) |
| Bouton micro interactif | ✅ | États visuels et animations |
| **Gemini 2.5 Flash** | ✅ | Function calling |
| **Ajout d'évènements via vocal** | ✅ | "Ajoute un rendez-vous demain 14h" |
| **Suppression/MAJ d'évènements** | ✅ | delete_event / update_event |
| **Planning intelligent** | ✅ | Décomposition automatique en sous-tâches |
| **Système de planning items** | ✅ | Événements + tâches avec relations parent/enfant |
| **Affichage des tâches** | ✅ | Section tâches dans la vue jour |
| Persistance localStorage | ✅ | Évènements + planning items sauvegardés |
| Thème sombre | ✅ | zinc-950 comme base |

---

## ⚙️ Configuration requise

### Variable d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
GEMINI_API_KEY=votre_cle_api_gemini
```

**Obtenir une clé API** : https://makersuite.google.com/app/apikey

### Mode fallback

Si la clé API n'est pas configurée, l'application fonctionne en mode fallback avec des réponses basiques basées sur des mots-clés.

---

## 🚀 Utilisation

### Commandes vocales supportées

| Commande exemple | Action |
|------------------|--------|
| "Ajoute un rendez-vous demain à 14h" | Crée un événement "rendez-vous" |
| "Programme un appel avec Jean à 10h30" | Crée un événement "appel avec Jean" |
| "Supprime le rendez-vous de demain" | Supprime l'événement correspondant |
| "Qu'est-ce que j'ai cette semaine ?" | Liste les événements |
| **"J'ai un dîner ce soir à 19h, je vais faire des lasagnes, j'ai pas encore fait les courses"** | **Crée un plan avec événement + sous-tâches** |
| **"Je dois organiser une réunion demain à 10h avec l'équipe, préparer l'ordre du jour et envoyer les invitations"** | **Crée un plan structuré** |
| "Bonjour" | Réponse conversationnelle |

### Fonctionnement

1. Cliquez sur le **bouton violet** en bas à droite
2. Dans la modale, appuyez sur le **bouton micro**
3. Parlez naturellement en français
4. L'assistant :
   - Transcrit votre message
   - L'envoie à Gemini
   - Exécute l'action correspondante
   - Affiche la réponse

---

#### 1. Refonte des types TypeScript (`src/types/message.ts`)
- **Suppression** : `PlanningItemKind` et `PlanningItem` (plus de système de tâches)
- **Enrichissement** : `CalendarEvent` avec `meta.groupId` pour relier les événements d'un même plan
- **Modification** : `CreatePlanAction` ne crée plus que des événements (plus de tâches)
  - `plan.events` : Array d'événements avec `title`, `start`, `end`, `description?`, `location?`
  - `plan.groupId` : Identifiant pour relier les événements d'un même plan
- **Simplification** : `GeminiRequestPayload` ne contient plus `currentPlanningItems`

#### 2. Store refondu (`src/store/useCalendarStore.ts`)
- **Suppression** : Toutes les méthodes liées aux planning items
- **Nouvelle méthode** : `addEvents` : Ajoute plusieurs événements en une fois
- **Nouvelle méthode** : `getEventsByGroupId` : Récupère les événements d'un même plan
- **Nouvelles méthodes pour les créneaux libres** :
  - `findFreeSlots(startDate, endDate, minDuration?)` : Trouve les créneaux libres dans une période
  - `canFitEvent(start, end)` : Vérifie si un événement peut être placé sans chevauchement
- **Type exporté** : `FreeSlot` : Représente un créneau libre avec `start`, `end`, `duration`
- Persistance localStorage simplifiée (plus de planning items)

#### 3. Fonction `create_plan` refondue (`src/app/api/assistant/route.ts`)
- **Modification majeure** : Ne crée plus que des événements (plus de tâches)
- Paramètres :
  - `groupId` (optionnel) : Identifiant pour relier les événements
  - `events` : Array d'événements avec `title`, `start` (REQUIS), `end` (REQUIS), `description?`, `location?`
- **Prompt système refondu** :
  - Instructions pour analyser et décomposer en étapes
  - Estimation des durées pour chaque étape
  - **Planification dans les créneaux libres** : L'IA doit analyser les événements existants et trouver les créneaux disponibles
  - Ordre logique : Les étapes doivent être planifiées dans l'ordre (ex: courses avant préparation)
  - Contrainte d'échéance : Tous les événements doivent se terminer avant l'échéance finale
  - Gestion des conflits : Si pas assez de créneaux libres, l'IA doit l'expliquer
- **Suppression** : `formatPlanningItemsForContext` (plus de planning items)

#### 4. Composant CalendarView simplifié (`src/components/CalendarView.tsx`)
- **Suppression** : Affichage des tâches et composant `PlanningTaskCard`
- **Simplification** : Affichage uniquement des événements de calendrier
- Compteur simplifié (uniquement événements)

#### 5. Composant AiModal adapté (`src/components/AiModal.tsx`)
- Gestion de l'action `create_plan` :
  - Création de plusieurs événements en une fois via `addEvents`
  - Attribution automatique d'un `groupId` pour relier les événements d'un même plan
  - Tous les événements créés ont `source: "ai"`
- Payload simplifié : plus de `currentPlanningItems`
- Exécution des actions via `addEvents` du store

#### 6. Nouveau comportement intelligent de l'IA
L'assistant peut maintenant :
- **Analyser** une demande complexe au-delà de ce qui est explicitement formulé
- **Anticiper** les étapes nécessaires pour accomplir un objectif
- **Estimer les durées** pour chaque étape (ex: courses = 1h, préparation = 1h)
- **Trouver les créneaux libres** dans le calendrier existant
- **Planifier intelligemment** : placer les événements dans les créneaux disponibles avant l'échéance
- **Respecter l'ordre logique** : courses avant préparation, préparation avant cuisson, etc.
- **Gérer les conflits** : expliquer si pas assez de créneaux libres

**Exemple de demande** :
> "J'ai un dîner ce soir à 19h, je vais faire des lasagnes, j'ai pas encore fait les courses et rien n'est prêt."

**Réponse de l'IA** :
1. Analyse : Il faut faire les courses, préparer, cuire, et dresser la table. Tout doit être fini avant 19h.
2. Estimation des durées : courses (1h), préparation (1h), cuisson (45min), dressage (15min)
3. Recherche des créneaux libres dans le calendrier avant 19h
4. Création d'événements dans les créneaux libres :
   - "Faire les courses" (ex: 15h-16h)
   - "Préparation des lasagnes" (ex: 16h-17h)
   - "Cuisson des lasagnes" (ex: 17h30-18h15)
   - "Dresser la table" (ex: 18h30-18h45)
   - "Dîner lasagnes" (19h-20h30)
5. Tous les événements ont le même `groupId` pour les relier

---

## 🚧 Prochaines étapes suggérées

1. **Text-to-Speech**
   - Faire parler l'assistant avec Web Speech Synthesis
   - Option pour activer/désactiver

2. **Améliorations planning**
   - Édition manuelle des tâches
   - Réorganisation par drag & drop
   - Filtres (complétées / non complétées)

3. **PWA**
   - Service Worker
   - Manifest.json
   - Installation sur écran d'accueil

4. **Améliorations UX**
   - Notifications de rappel
   - Gestion des récurrences
   - Export/import des plans
   - Vue hiérarchique des sous-tâches

---

## 📝 Notes techniques

### Principes appliqués
- **SOLID** : Composants avec responsabilité unique
- **Clean Code** : Nommage explicite, commentaires détaillés
- **Clean Architecture** : Séparation types/hooks/store/components

### Architecture Gemini
- Le function calling permet à Gemini de "décider" quelle action exécuter
- Le prompt système contient le contexte des événements et planning items actuels
- Les actions sont exécutées côté client après réception de la réponse
- **Nouveau** : Fonction `create_plan` pour créer des plans structurés avec plusieurs items
- **Nouveau** : L'IA analyse et anticipe les tâches nécessaires pour accomplir un objectif

### Compatibilité navigateurs
- Reconnaissance vocale : Chrome/Edge/Safari
- Firefox : support limité de Web Speech API
- Fallback gracieux si API non disponible

---

---

## 📊 Structure des données

### CalendarEvent (source unique de vérité)
```typescript
{
  id: string;
  title: string;
  start: Date;          // REQUIS
  end: Date;            // REQUIS
  createdAt: Date;
  source?: "voice" | "manual" | "ai";
  description?: string;
  location?: string;
  meta?: {
    groupId?: string;   // Pour relier plusieurs événements à un même objectif
  };
}
```

### Relations
- Tous les items sont des événements avec date/heure de début et de fin
- Les événements d'un même plan sont liés via `meta.groupId`
- Plus de système de "tâches" abstraites

---

---

## 🔄 Changements majeurs (Session 4)

### Suppression du système de tâches
- **Avant** : Système hybride avec événements + tâches (PlanningItem)
- **Après** : Uniquement des événements de calendrier (CalendarEvent)
- **Raison** : Simplification et cohérence - tout doit avoir une date/heure

### Planification intelligente dans les créneaux libres
- L'IA analyse les événements existants pour trouver les créneaux libres
- Planifie automatiquement les étapes dans les créneaux disponibles
- Respecte l'ordre logique et les contraintes d'échéance
- Gère les conflits (manque de créneaux libres)

---

### Session 5 du 10/12/2025 - Intégration Supabase

#### 1. Installation et configuration
- **Dépendance ajoutée** : `@supabase/supabase-js`
- **Structure créée** :
  - `src/lib/supabase/client.ts` : Client Supabase côté client
  - `src/lib/supabase/server.ts` : Client Supabase côté serveur
  - `src/lib/supabase/types.ts` : Types TypeScript pour les tables
  - `supabase/schema.sql` : Schéma SQL complet

#### 2. Variables d'environnement
- `NEXT_PUBLIC_SUPABASE_URL` : URL du projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme (publique)
- Voir `SUPABASE_SETUP.md` pour la configuration complète

#### 3. Schéma de base de données
**Table `conversations`** :
- `id` (UUID), `user_id` (text), `title` (text), `created_at` (timestamp)
- Index sur `user_id` et `created_at`

**Table `messages`** :
- `id` (UUID), `conversation_id` (UUID), `role` (user|assistant), `content` (text), `created_at` (timestamp)
- Index sur `conversation_id` et `created_at`
- Foreign key vers `conversations`

**Table `calendar_events`** :
- `id` (text), `user_id` (text), `title` (text), `start` (timestamp), `end` (timestamp)
- `description`, `location`, `source` (voice|manual|ai), `meta` (JSONB), `created_at`
- Index sur `user_id`, `start`, `end`, et `meta->groupId`
- Contrainte : `end > start`

#### 4. API Routes créées
**Conversations** :
- `GET /api/conversations` : Liste les conversations
- `POST /api/conversations` : Crée une conversation
- `GET /api/conversations/[id]/messages` : Récupère les messages
- `POST /api/conversations/[id]/messages` : Ajoute un message

**Événements** :
- `GET /api/events` : Liste les événements (filtres: ?start=...&end=...)
- `POST /api/events` : Crée un ou plusieurs événements
- `PUT /api/events/[id]` : Met à jour un événement
- `DELETE /api/events/[id]` : Supprime un événement

#### 5. Gestion des erreurs
- Vérification de configuration Supabase avec `isSupabaseConfigured()`
- Messages d'erreur clairs si Supabase n'est pas configuré
- Clients Supabase tolérants pour le build (placeholders si non configuré)

#### 6. Système mono-utilisateur
- `user_id` fixe : "demo-user" pour l'instant
- RLS désactivé (sera activé avec l'authentification)
- Prêt pour extension multi-utilisateurs

#### 7. Documentation
- `SUPABASE_SETUP.md` : Guide complet de configuration
- `.env.example` : Template pour les variables d'environnement

---

## ✅ Session 6 du 10/12/2025 - Intégration Frontend ↔ Supabase

### 1. Types Supabase simplifiés créés

**Fichier** : `src/types/supabase.ts`
- `Conversation` : Type pour une conversation
- `Message` : Type pour un message
- `CalendarEventDB` : Type pour un événement (format Supabase avec `start_time`/`end_time`)
- Types `Insert` pour créer de nouvelles entrées

### 2. Fonctions serveur créées

**Conversations** (`src/lib/supabase/conversations.ts`) :
- `getConversations()` : Liste toutes les conversations
- `getConversationById(id)` : Récupère une conversation par ID
- `createConversation(insert)` : Crée une nouvelle conversation
- `getMessagesByConversationId(conversationId)` : Récupère les messages d'une conversation
- `createMessage(insert)` : Crée un nouveau message
- `getOrCreateLatestConversation()` : Récupère ou crée la dernière conversation

**Événements** (`src/lib/supabase/events.ts`) :
- `getCalendarEvents(startDate?, endDate?)` : Récupère les événements (optionnellement filtrés)
- `getCalendarEventById(id)` : Récupère un événement par ID
- `createCalendarEvents(events)` : Crée un ou plusieurs événements
- `updateCalendarEvent(id, updates)` : Met à jour un événement
- `deleteCalendarEvent(id)` : Supprime un événement

### 3. API Routes supplémentaires

- `GET /api/conversations/current` : Récupère la conversation actuelle et ses messages

### 4. Composants adaptés

**AiModal** (`src/components/AiModal.tsx`) :
- ✅ Charge la conversation actuelle et ses messages au montage (via `/api/conversations/current`)
- ✅ Sauvegarde automatiquement les messages utilisateur et assistant dans Supabase
- ✅ Crée une nouvelle conversation si nécessaire
- ✅ Affiche un indicateur de chargement initial (`isLoadingInitial`)

**CalendarView** (`src/components/CalendarView.tsx`) :
- ✅ Appelle `hydrateFromSupabase()` au montage pour charger les événements

**useCalendarStore** (`src/store/useCalendarStore.ts`) :
- ✅ Nouvelle méthode `hydrateFromSupabase()` : charge les événements depuis Supabase au démarrage
- ✅ Nouvelle méthode `setEvents(events)` : définit les événements (pour l'hydratation)
- ✅ Nouvelle propriété `isHydrated` : indique si les données ont été chargées
- ✅ Synchronisation automatique avec Supabase lors de :
  - `addEvent()` : POST `/api/events`
  - `addEvents()` : POST `/api/events` (batch)
  - `updateEvent()` : PUT `/api/events/[id]`
  - `deleteEvent()` : DELETE `/api/events/[id]`
- ✅ Fallback sur les événements par défaut si Supabase n'est pas configuré

### 5. Architecture de synchronisation

**Flux de données** :
1. **Au démarrage** :
   - `CalendarView` appelle `hydrateFromSupabase()` → charge les événements depuis `/api/events`
   - `AiModal` charge la conversation actuelle depuis `/api/conversations/current`
2. **Lors des modifications** :
   - Les actions du store (add/update/delete) synchronisent automatiquement avec Supabase via les API routes
   - Les messages sont sauvegardés dans Supabase lors de l'envoi/réception

**Séparation des responsabilités** :
- **Fonctions serveur** (`src/lib/supabase/`) : Logique métier, accès direct à Supabase
- **API Routes** (`src/app/api/`) : Endpoints HTTP pour le frontend
- **Store Zustand** : État local + synchronisation avec Supabase
- **Composants** : UI + appels aux API routes

---

## ⚠️ Prochaines étapes (optionnelles)

1. ✅ **Adapter AiModal** : Utiliser `/api/conversations` au lieu de localStorage pour l'historique (fait)
2. ✅ **Adapter useCalendarStore** : Utiliser `/api/events` au lieu de localStorage pour les événements (fait)
3. ✅ **Synchronisation** : Charger les données depuis Supabase au démarrage (fait)
4. **Gestion des erreurs réseau** : Améliorer la gestion des erreurs de connexion
5. **Optimistic updates** : Mettre à jour l'UI immédiatement avant la confirmation serveur
6. **Authentification** : Remplacer `DEMO_USER_ID` par un système d'auth réel

---

### Session 6 du 11/12/2025 - Refonte design avec nouvelle palette minimaliste

#### 1. Configuration Tailwind avec nouvelle palette
- Création de `tailwind.config.ts` avec la palette de couleurs :
  - Noir : `#3D3D3D`
  - Blanc : `#FAFAFA` (couleur dominante)
  - Bleu : `#CDE8FA`
  - Vert : `#CCE3C3`
  - Rose : `#F8C4C5`
  - Jaune : `#FFF4C7`
  - Dégradés : `gradient-green-blue` et `gradient-pink-yellow`
- Ajout de tokens de design : `borderRadius` (soft: 12px, medium: 16px, large: 24px), `boxShadow` (soft, medium)

#### 2. Adaptation de tous les composants
- **DailyCalendar** : Fond blanc, événements avec couleurs pastel selon la source (bleu pour AI, vert pour voice, rose pour manual, jaune par défaut)
- **WeekView, MonthView, YearView** : Adaptation complète avec la nouvelle palette (fond blanc, bordures fines, textes noirs avec opacité)
- **ViewSelector** : Select minimaliste avec bordures fines et ombre légère
- **AiFabButton** : Dégradé rose-jaune, icône noire, ombres douces
- **AiModal** : Fond blanc, bulles de chat avec bleu (user) et vert (assistant), bouton micro avec dégradé rose-jaune
- **page.tsx** : Header et fond adaptés (fond blanc, texte noir)

#### 3. Mise à jour globals.css
- Variables CSS mises à jour pour le thème clair (fond blanc, texte noir)
- Scrollbar personnalisée avec opacité réduite (rgba(61, 61, 61, 0.3))
- Fond blanc par défaut pour `body`

#### 4. Correction du bug de répétition d'événements
- Refactorisation de `DailyCalendar` pour afficher chaque événement UNE SEULE FOIS
- Timeline absolue avec positionnement correct des événements (calcul de position par rapport au début de la journée)
- Plus de duplication par créneau horaire

---

### Session 7 du 11/12/2025 - Design responsive pour tablette et desktop

#### 1. Layout principal responsive (`page.tsx`)
- **Mobile (base)** : Structure inchangée (colonne unique, `max-w-md`, centré)
- **Tablette/Desktop (md+)** :
  - Layout multi-colonnes : `md:flex-row` avec `md:gap-6`
  - Colonne principale (calendrier) : `md:flex-[2]`
  - Colonne secondaire (sidebar) : `md:flex-[1]` avec bouton IA et résumé
  - Largeurs max : `md:max-w-4xl`, `lg:max-w-5xl`, `xl:max-w-6xl`
  - Marges latérales : `md:px-6`, `lg:px-8`, `xl:px-12`
- **Bouton FAB** : Masqué sur desktop (`md:hidden`), remplacé par bouton dans sidebar

#### 2. DailyCalendar responsive
- **Mobile** : Timeline verticale pleine largeur, navigation horizontale
- **Desktop (md+)** :
  - Layout horizontal : sidebar de navigation à gauche (`md:w-64 lg:w-80`)
  - Timeline principale à droite avec labels d'heures plus larges
  - Résumé des événements du jour dans une colonne à droite (desktop uniquement)
  - Hauteur minimale augmentée : `md:min-h-[70vh]`

#### 3. WeekView responsive
- **Mobile** : Liste verticale, jours empilés
- **Tablette (md+)** : Grille 2 colonnes (`md:grid-cols-2`)
- **Desktop (lg+)** : Grille 4 colonnes (`lg:grid-cols-4`)
- Chaque jour dans une Card avec bordure et ombre
- Textes et espacements adaptés selon breakpoint

#### 4. MonthView et YearView responsive
- **MonthView** :
  - Mobile : Liste verticale simple
  - Desktop : Marges latérales (`md:px-6 lg:px-8`), `max-w-3xl/4xl/5xl` centré
  - Sélecteurs mois/année en ligne sur desktop (`md:flex-row`)
- **YearView** :
  - Mobile : Liste verticale, mois empilés
  - Tablette (md+) : Grille 2 colonnes (`md:grid-cols-2`)
  - Desktop (lg+) : Grille 3 colonnes (`lg:grid-cols-3`)
  - Chaque mois dans une Card avec bordure et ombre

#### 5. ViewSelector et header responsive
- **ViewSelector** :
  - Mobile : `w-full` (pleine largeur)
  - Desktop : `md:w-auto` avec `md:min-w-[140px]`
- **Header principal** :
  - Mobile : Titre et sélecteur empilés verticalement
  - Desktop : `md:flex-row md:items-center md:justify-between` (titre à gauche, sélecteur à droite)

#### 6. Principes appliqués
- **Mobile-first inchangé** : Toutes les classes de base restent pour mobile
- **Breakpoints Tailwind** : Utilisation exclusive de `md:`, `lg:`, `xl:` pour les adaptations
- **Cohérence visuelle** : Même palette de couleurs, mêmes composants UI, mêmes tokens de design
- **Commentaires explicatifs** : Ajout de commentaires dans le code pour expliquer les choix de breakpoints

#### 7. Structure des breakpoints utilisés
- `sm` (≥640px) : Mobile large / petit tablet (peu utilisé)
- `md` (≥768px) : Tablette - passage à layout multi-colonnes
- `lg` (≥1024px) : Laptop - affinage des largeurs et espacements
- `xl` (≥1280px) : Grand écran - marges latérales augmentées

---

### Session 8 du 11/12/2025 - Identité visuelle unifiée avec dégradé vert → bleu

#### 1. Dégradé principal pour les événements
- **Ajout dans `globals.css`** : Variable CSS `--gradient-brand-green-blue` avec `linear-gradient(135deg, #CCE3C3 0%, #CDE8FA 100%)`
- **Couleurs** :
  - Vert : `#CCE3C3`
  - Bleu : `#CDE8FA`
  - Dégradé : `linear-gradient(135deg, #CCE3C3 0%, #CDE8FA 100%)`

#### 2. Application du dégradé à tous les événements
- **DailyCalendar** :
  - `EventCard` : Dégradé appliqué, `border-none` pour design minimaliste
  - Résumé des événements (sidebar desktop) : Dégradé appliqué
- **WeekView** : Tous les événements individuels avec dégradé, suppression de l'indicateur coloré latéral
- **MonthView** : Tous les événements avec dégradé, `border-none`
- **YearView** : Tous les événements avec dégradé, `border-none`

#### 3. Principes de design appliqués
- **Texte lisible** : Tous les textes utilisent `text-[var(--color-brand-black)]` (`#3D3D3D`) pour une lisibilité optimale sur le dégradé
- **Bordures discrètes** : `border-none` sur tous les événements pour un design minimaliste
- **Cohérence visuelle** : Même style appliqué sur toutes les vues (Daily / Weekly / Monthly / Yearly)
- **Responsive maintenu** : Les adaptations desktop/tablette restent fonctionnelles

#### 4. Style unifié
- Tous les événements utilisent : `bg-[linear-gradient(135deg,#CCE3C3_0%,#CDE8FA_100%)]`
- Bordures : `border-none`
- Ombres : `shadow-soft` avec `hover:shadow-medium`
- Transitions : `transition-all duration-200`

---

### Session 9 du 11/12/2025 - Layout desktop 50/50 avec espacements généreux

#### 1. Layout 50/50 sur desktop
- **Mobile (base)** : Structure inchangée (colonne unique, `max-w-md`, centré)
- **Desktop (md+)** :
  - Layout horizontal en deux colonnes égales : `md:w-1/2` pour chaque colonne
  - Colonne principale (gauche) : Calendrier - 50% de la largeur
  - Colonne secondaire (droite) : Assistant / événements du jour / panneaux contextuels - 50% de la largeur
  - Suppression de `max-w-*` sur desktop pour utiliser toute la largeur disponible

#### 2. Espacements et marges augmentés
- **Marges latérales** :
  - `md:px-8` (tablette)
  - `lg:px-12` (laptop)
  - `xl:px-16` (grand écran)
  - `2xl:px-20` (très grand écran)
- **Espacements entre colonnes** :
  - `md:gap-8` (tablette)
  - `lg:gap-12` (laptop)
  - `xl:gap-16` (grand écran)
- **Padding vertical** :
  - `md:pb-8`, `lg:pb-12` pour plus d'espace en bas

#### 3. Colonne secondaire (sidebar) améliorée
- **Largeur** : `md:w-1/2` (50% de la page)
- **Espacements internes** : `p-6 lg:p-8 xl:p-10` pour les cards
- **Gaps entre éléments** : `md:gap-6 lg:gap-8`
- **Bouton IA** : Tailles augmentées (`py-4 lg:py-5 xl:py-6`, icônes plus grandes)
- **Texte** : Tailles augmentées (`text-base lg:text-lg xl:text-xl`)
- **Espace réservé** : Panneau pour "Événements du jour" ajouté

#### 4. Header adapté
- **Padding top** : `md:pt-6 lg:pt-8 xl:pt-12`
- **Padding bottom** : `md:pb-8 lg:pb-10`
- **Gaps** : `md:gap-6 lg:gap-8`

#### 5. Principes respectés
- **Mobile inchangé** : Toutes les classes de base restent pour mobile
- **Breakpoints Tailwind uniquement** : Utilisation exclusive de `md:`, `lg:`, `xl:`, `2xl:`
- **Design aéré** : Beaucoup plus d'espace entre les blocs sur desktop
- **Largeur optimale** : Le calendrier occupe exactement 50% de la page sur desktop

---

### Session 10 du 11/12/2025 - Layout desktop 80/20 optimisé pour la vue semaine

#### 1. Layout 80/20 sur desktop
- **Mobile (base)** : Structure inchangée (colonne unique, `max-w-md`, centré)
- **Desktop (md+)** :
  - Layout horizontal en deux colonnes : `md:w-4/5` (80%) pour le calendrier, `md:w-1/5` (20%) pour le panneau
  - Colonne principale (gauche) : Calendrier - 80% de la largeur pour une meilleure visibilité
  - Colonne secondaire (droite) : Panneau réduit "Événements du jour" - 20% de la largeur
  - Conteneur central : `md:max-w-7xl` avec marges latérales adaptées

#### 2. Panneau "Événements du jour" réduit
- **Design compact** : `p-4 lg:p-5` (au lieu de `p-6 lg:p-8 xl:p-10`)
- **Texte réduit** : `text-sm lg:text-base` pour le titre, `text-xs lg:text-sm` pour le contenu
- **Position** : En haut à droite, prend peu de place
- **Espacement** : `md:gap-4` entre les éléments

#### 3. Bouton chat vocal en FAB rond flottant (desktop)
- **Remplacement** : Le gros bouton card est remplacé par un petit FAB rond flottant
- **Position** : `md:fixed md:top-6 md:right-6` (en haut à droite)
- **Taille** : `w-14 h-14 lg:w-16 lg:h-16` (compact et discret)
- **Style** : Dégradé rose-jaune, ombre moyenne, hover scale
- **Mobile** : FAB existant inchangé (via `AiFabButton`)

#### 4. Espacements optimisés
- **Marges latérales** : `md:px-4 lg:px-8 xl:px-12 2xl:px-16` (réduites pour plus d'espace au calendrier)
- **Gaps entre colonnes** : `md:gap-6 lg:gap-10` (optimisé pour le layout 80/20)
- **Padding vertical** : `md:pb-6 lg:pb-8` (réduit pour plus d'espace)

#### 5. Principes respectés
- **Mobile inchangé** : Toutes les classes de base restent pour mobile
- **Breakpoints Tailwind uniquement** : Utilisation exclusive de `md:`, `lg:`, `xl:`, `2xl:`
- **Vue semaine optimisée** : Le calendrier occupe maintenant 80% de la largeur pour une meilleure lisibilité
- **Design épuré** : Panneau réduit et FAB discret pour ne pas encombrer l'interface

---

### Session 11 du 11/12/2025 - Ajustement des tailles de texte pour la vue semaine

#### 1. Optimisation des tailles de texte dans WeekView
- **Titre d'événement** : Réduit de `text-sm md:text-base lg:text-lg` à `text-xs md:text-sm`
  - Ajout de `line-clamp-2` et `leading-tight` pour éviter les débordements
- **Heure** : Réduit de `text-xs md:text-sm` à `text-[10px] md:text-xs`
  - Largeur réduite : `w-10 md:w-12` (au lieu de `w-12 md:w-14`)
- **Description** : Réduit de `text-xs md:text-sm` à `text-[10px] md:text-xs`
  - `line-clamp-2` au lieu de `line-clamp-2 md:line-clamp-3`
- **Location** : Réduit de `text-xs md:text-sm` à `text-[10px] md:text-xs`

#### 2. En-têtes et labels optimisés
- **En-tête du jour** : Réduit de `text-lg md:text-xl lg:text-2xl` à `text-base md:text-lg`
- **Badge "Aujourd'hui"** : Réduit de `text-[10px] md:text-xs` à `text-[9px] md:text-[10px]`
- **Compteur d'événements** : Réduit de `text-xs md:text-sm` à `text-[10px] md:text-xs`
- **Titre de la semaine** : Réduit de `text-xl md:text-2xl lg:text-3xl` à `text-lg md:text-xl lg:text-2xl`
- **Sous-titre "Cette semaine"** : Réduit de `text-xs md:text-sm` à `text-[10px] md:text-xs`

#### 3. Espacements réduits
- **Padding des cartes de jour** : `p-3 md:p-4` (au lieu de `p-4 md:p-5 lg:p-6`)
- **Gap entre événements** : `gap-2` (au lieu de `gap-2 md:gap-3`)
- **Gap dans les événements** : `gap-2 md:gap-3` (au lieu de `gap-3 md:gap-4`)
- **Padding des événements** : `p-2.5 md:p-3` (au lieu de `p-3 md:p-4`)
- **Marges des en-têtes** : `mb-2 md:mb-3` et `pb-2 md:pb-3` (réduites)

#### 4. Principes appliqués
- **Texte adaptatif** : Tailles réduites pour mieux s'adapter au layout 80/20
- **Lisibilité maintenue** : Textes toujours lisibles mais plus compacts
- **Responsive** : Adaptations via breakpoints `md:` et `lg:`
- **Line-clamp** : Utilisation de `line-clamp-2` pour éviter les débordements

---

---

### Session 12 du 11/12/2025 - Réduction et alignement de la section de navigation

#### 1. Section de navigation compacte dans DailyCalendar
- **Header réduit** :
  - Padding réduit : `px-3 md:px-4` (au lieu de `px-4 md:px-6 lg:px-8`)
  - Padding vertical réduit : `py-3 md:py-4` (au lieu de `py-4 md:py-6`)
  - Largeur sidebar réduite : `md:w-48 lg:w-56` (au lieu de `md:w-64 lg:w-80`)
- **Boutons de navigation** :
  - Taille réduite : `w-8 h-8 md:w-9 md:h-9` (au lieu de `w-10 h-10 md:w-12 md:h-12`)
  - Icônes réduites : `w-4 h-4` (au lieu de `w-5 h-5 md:w-6 md:h-6`)
  - Ajout de `flex-shrink-0` pour un meilleur alignement
- **Date et texte** :
  - Taille de date réduite : `text-base md:text-lg` (au lieu de `text-xl md:text-2xl lg:text-3xl`)
  - Texte "Aujourd'hui" réduit : `text-[10px]` (au lieu de `text-xs md:text-sm`)
  - Padding horizontal réduit : `px-2 md:px-0`
  - `leading-tight` pour un meilleur espacement vertical
- **Espacements réduits** :
  - Gaps : `gap-3 md:gap-3` (au lieu de `gap-4 md:gap-6`)
  - Marges : `mb-2 md:mb-4` (au lieu de `mb-3 md:mb-6`)
- **Bouton "Aujourd'hui"** :
  - Padding réduit : `py-2 px-3` (au lieu de `py-3 px-4`)
  - Texte réduit : `text-xs` (au lieu de `text-sm`)
  - Marge top : `mt-2 md:mt-2`

#### 2. Principes appliqués
- **Section compacte** : La navigation prend moins d'espace tout en restant fonctionnelle
- **Alignement amélioré** : Utilisation de `flex-shrink-0` et ajustements de padding pour un alignement parfait
- **Cohérence visuelle** : Tailles réduites mais proportions maintenues
- **Responsive maintenu** : Adaptations via breakpoints `md:` et `lg:`

---

### Session 13 du 11/12/2025 - Réorganisation des boutons de navigation

#### 1. Boutons côte à côte sous la date
- **Structure réorganisée** :
  - Date placée en haut (centrée sur mobile, alignée à gauche sur desktop)
  - Boutons précédent et suivant placés côte à côte en bas de la date
  - Layout en colonne : `flex flex-col` pour organiser date puis boutons
- **Boutons de navigation** :
  - Conteneur flex horizontal : `flex flex-row` avec `gap-2`
  - Centrés sur mobile : `justify-center`
  - Alignés à gauche sur desktop : `md:justify-start`
  - Même taille et style que précédemment
- **Date** :
  - Largeur pleine : `w-full` pour occuper tout l'espace disponible
  - Centrée sur mobile : `text-center`
  - Alignée à gauche sur desktop : `md:text-left`

#### 2. Principes appliqués
- **Hiérarchie visuelle claire** : Date en haut, contrôles en bas
- **Espacement cohérent** : Gaps uniformes (`gap-3 md:gap-3` pour le conteneur principal, `gap-2` pour les boutons)
- **Responsive maintenu** : Adaptations via breakpoints `md:`
- **UX améliorée** : Boutons regroupés pour une navigation plus intuitive

---

### Session 14 du 11/12/2025 - Correction de l'erreur "Rendered fewer hooks than expected" dans YearView

#### 1. Problème identifié
- **Erreur** : "Rendered fewer hooks than expected" lors du changement d'année dans la vue année
- **Cause** : Utilisation de `useMemo` à l'intérieur d'un `.map()` (ligne 225)
  - Le nombre de hooks appelés variait selon le nombre d'événements
  - Quand on changeait d'année, le nombre d'événements changeait, donc le nombre de hooks changeait
  - React exige que le nombre de hooks soit constant entre les rendus

#### 2. Solution appliquée
- **Remplacement de `useMemo` par un calcul simple** :
  - Le calcul `isToday` est très rapide et ne nécessite pas de mémorisation
  - Suppression de `useMemo` dans le `.map()` pour éviter les hooks conditionnels
  - Calcul direct : `const isToday = today.getTime() === dayStart.getTime()`
- **Principe respecté** : Les hooks doivent toujours être appelés dans le même ordre et en même nombre à chaque rendu

#### 3. Code corrigé
```typescript
// Avant (problématique)
const isToday = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  return today.getTime() === dayStart.getTime();
}, [date]);

// Après (corrigé)
const today = new Date();
today.setHours(0, 0, 0, 0);
const dayStart = new Date(date);
dayStart.setHours(0, 0, 0, 0);
const isToday = today.getTime() === dayStart.getTime();
```

#### 4. Principes appliqués
- **Règles des hooks React** : Les hooks doivent être appelés au même niveau, dans le même ordre, à chaque rendu
- **Performance** : Le calcul simple est suffisant pour cette vérification
- **Maintenabilité** : Code plus simple et plus lisible

---

### Session 15 du 11/12/2025 - Correction de l'erreur "Rendered fewer hooks than expected" dans MonthView

#### 1. Problème identifié
- **Erreur** : "Rendered fewer hooks than expected" lors du changement de mois dans la vue mois
- **Cause** : Utilisation de `useMemo` à l'intérieur d'un `.map()` (ligne 224)
  - Le nombre de hooks appelés variait selon le nombre de jours avec événements
  - Quand on changeait de mois, le nombre de jours avec événements changeait, donc le nombre de hooks changeait
  - React exige que le nombre de hooks soit constant entre les rendus

#### 2. Solution appliquée
- **Remplacement de `useMemo` par un calcul simple** :
  - Le calcul `isToday` est très rapide et ne nécessite pas de mémorisation
  - Suppression de `useMemo` dans le `.map()` pour éviter les hooks conditionnels
  - Calcul direct : `const isToday = today.getTime() === dayStart.getTime()`
- **Principe respecté** : Les hooks doivent toujours être appelés dans le même ordre et en même nombre à chaque rendu

#### 3. Code corrigé
```typescript
// Avant (problématique)
const isToday = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  return today.getTime() === dayStart.getTime();
}, [date]);

// Après (corrigé)
const today = new Date();
today.setHours(0, 0, 0, 0);
const dayStart = new Date(date);
dayStart.setHours(0, 0, 0, 0);
const isToday = today.getTime() === dayStart.getTime();
```

#### 4. Principes appliqués
- **Règles des hooks React** : Les hooks doivent être appelés au même niveau, dans le même ordre, à chaque rendu
- **Performance** : Le calcul simple est suffisant pour cette vérification
- **Maintenabilité** : Code plus simple et plus lisible
- **Cohérence** : Même correction que pour YearView pour maintenir la cohérence du code

---

*Fichier mis à jour automatiquement - Session 15 du 11/12/2025*
