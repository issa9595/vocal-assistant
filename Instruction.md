# Instruction.md - Journal des actions

> Ce fichier trace les actions effectuées sur le projet "Lumia".
> Dernière mise à jour : 10 décembre 2025

---

## 📋 Résumé du projet

**Lumia** est une application web mobile-first permettant de gérer un **calendrier** (jour/semaine/mois) via un assistant vocal IA connecté à **Gemini 2.5 Flash**.

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

### Session 16 du 11/12/2025 - Correction de l'erreur "The default export is not a React Component"

#### 1. Problème identifié
- **Erreur** : "The default export is not a React Component in '/page'"
- **Cause** : Le fichier `src/app/page.tsx` était complètement vide
  - Next.js ne trouvait pas de composant React par défaut à exporter
  - L'application ne pouvait pas démarrer

#### 2. Solution appliquée
- **Recréation complète du fichier `page.tsx`** :
  - Composant `Home` exporté par défaut
  - Utilisation du store `useCalendarStore` pour gérer `viewMode`
  - Header avec titre "Lumia" et `ViewSelector`
  - Affichage conditionnel des vues selon `viewMode` :
    - `DailyCalendar` pour `viewMode === "day"`
    - `WeekView` pour `viewMode === "week"`
    - `MonthView` pour `viewMode === "month"`
    - `YearView` pour `viewMode === "year"`
  - `AiFabButton` pour ouvrir la modale IA
  - `AiModal` pour l'assistant vocal
- **Layout responsive** :
  - Mobile : colonne unique, `max-w-md`, centré
  - Desktop (md+) : layout avec calendrier pleine largeur
  - Marges latérales adaptatives : `px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-20`

#### 3. Structure du composant
```typescript
export default function Home() {
  const { viewMode } = useCalendarStore();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <div>
      <header>
        {/* Titre "Lumia" + ViewSelector */}
      </header>
      <main>
        {/* Affichage conditionnel des vues */}
      </main>
      <AiFabButton />
      <AiModal />
    </div>
  );
}
```

#### 4. Principes appliqués
- **Composant React valide** : Export par défaut d'un composant fonctionnel
- **Client-side rendering** : Directive `"use client"` pour les hooks React
- **Responsive design** : Layout adaptatif avec breakpoints Tailwind
- **Cohérence** : Structure alignée avec les autres composants du projet

---

### Session 17 du 11/12/2025 - Ajout d'une page d'accueil / landing page

#### 1. Restructuration du routage
- **Déplacement de l'application** : L'application principale a été déplacée de `/` vers `/app`
  - Nouveau fichier : `src/app/app/page.tsx` (ancien contenu de `page.tsx`)
  - Composant renommé : `Home` → `AppPage`
- **Redirection automatique** : La route racine `/` redirige maintenant automatiquement vers `/accueil`
  - Fichier `src/app/page.tsx` : Server Component avec `redirect("/accueil")`
  - Utilisation de `next/navigation` pour la redirection côté serveur

#### 2. Création de la landing page (`/accueil`)
- **Fichier créé** : `src/app/accueil/page.tsx`
- **Design minimaliste et moderne** :
  - Fond blanc (`bg-[var(--color-brand-white)]`)
  - Texte noir (`text-[var(--color-brand-black)]`)
  - Dégradé vert-bleu pour les éléments interactifs
  - Typographie cohérente avec le reste de l'application
- **Structure** :
  - Header avec logo "Lumia"
  - Section hero avec titre principal et description
  - Bouton CTA "Accéder à l'app" pointant vers `/app`
  - Section features avec 3 cartes (Reconnaissance vocale, Calendrier intelligent, IA avancée)
  - Footer minimaliste
- **Responsive** :
  - Mobile-first : Layout en colonne unique
  - Desktop (md+) : Grille 3 colonnes pour les features
  - Tailles de texte adaptatives : `text-4xl md:text-5xl lg:text-6xl xl:text-7xl`
  - Espacements généreux : `space-y-8 md:space-y-12`
- **Interactivité** :
  - Bouton CTA avec hover effect (`hover:scale-105`, `hover:shadow-medium`)
  - Cartes features avec hover effect
  - Transitions fluides : `transition-all duration-200`

#### 3. Principes appliqués
- **SOLID** : Séparation des responsabilités (landing page vs application)
- **Clean Code** : Code lisible avec commentaires explicatifs
- **Clean Architecture** : Structure de routes claire et logique
- **Design cohérent** : Utilisation de la même palette de couleurs et tokens de design
- **Accessibilité** : Structure sémantique (header, main, footer)

#### 4. Flux de navigation
1. **Accès à la racine (`/`)** : Redirection automatique vers `/accueil`
2. **Landing page (`/accueil`)** : Présentation de l'application avec bouton CTA
3. **Application (`/app`)** : Application complète avec calendrier et assistant vocal

---

### Session 18 du 11/12/2025 - Refonte complète de la landing page avec contenu pédagogique

#### 1. Réécriture complète de la landing page
- **Fichier modifié** : `src/app/accueil/page.tsx`
- **Nom de l'application** : Changement de "Lumia" vers "My Voice Planner"
- **Structure complète** : 7 sections pédagogiques avec contenu en français

#### 2. Sections créées

**Header fixe** :
- Logo "My Voice Planner" à gauche
- Bouton "Accéder à l'app" à droite (pointe vers `/`)
- Sticky avec ombre légère en desktop
- Responsive : colonne sur mobile, ligne sur desktop

**Hero principal** :
- Titre impactant : "Organise ta journée, juste avec ta voix."
- Sous-titre expliquant le fonctionnement (parler → IA comprend → calendrier se remplit → étapes cachées)
- 2 CTA : bouton principal "Accéder à l'app" + lien "Voir comment ça marche" (scroll vers `#comment-ca-marche`)
- Hauteur minimum 70vh, centré verticalement

**Section "Ce que fait My Voice Planner"** :
- 3 cards en grid (1 col mobile, 3 cols desktop) :
  1. "Parle, l'IA t'écoute" - Explication de la saisie vocale
  2. "Le calendrier se remplit seul" - Création automatique d'événements
  3. "Elle anticipe les étapes cachées" - Planification intelligente
- Chaque card avec icône emoji, titre, texte 2-3 phrases

**Section "Les bénéfices concrets"** :
- 4 bénéfices en grid 2x2 (1 col mobile, 2 cols desktop) :
  - Gagner du temps
  - Moins de charge mentale
  - Une vue claire de ta journée
  - Toujours avec toi
- Textes simples et accessibles

**Section "Comment ça marche ?"** :
- Ancre `id="comment-ca-marche"` pour le scroll
- 3 étapes numérotées (verticales mobile, horizontales desktop) :
  1. Tu parles à l'assistant
  2. L'IA analyse et planifie
  3. Le calendrier se met à jour
- Encadré d'exemple concret montrant :
  - Ce que l'utilisateur dit (exemple : dîner lasagnes)
  - Ce que l'app crée (liste des événements planifiés)

**Section "Pour qui ?"** :
- 3 profils en grid (1 col mobile, 3 cols desktop) :
  - Étudiants / Freelances
  - Salariés débordés
  - Personnes qui n'aiment pas les apps compliquées
- 1-2 phrases par profil

**Section "Appel à l'action final"** :
- Fond avec dégradé vert-bleu
- Titre : "Prêt à laisser ta voix planifier pour toi ?"
- Texte d'accompagnement
- Bouton "Accéder à l'app" pointant vers `/`

#### 3. Design et style
- **Cohérence visuelle** : Utilisation de la palette existante (blanc, noir, dégradé vert-bleu)
- **Mobile-first** : Layout en colonne sur mobile, grid/flex sur desktop
- **Tokens de design** : `rounded-soft`, `shadow-soft`, `border-[#3D3D3D0D]`
- **Typographie** : Tailles adaptatives (`text-3xl md:text-4xl lg:text-5xl`)
- **Espacements** : `px-4 md:px-8 lg:px-12`, `py-12 md:py-16 lg:py-20`
- **Interactivité** : Hover effects légers (`hover:scale-105`, `hover:shadow-medium`)

#### 4. Contenu en français
- **Textes pédagogiques** : Phrases courtes, claires, sans jargon
- **Exemples concrets** : Cas d'usage réel (dîner lasagnes avec toutes les étapes)
- **Ton accessible** : Tutoiement, langage simple et direct

#### 5. Navigation
- **Bouton "Accéder à l'app"** : Pointe vers `/` (route racine qui redirige vers `/accueil` puis vers `/app`)
- **Lien "Voir comment ça marche"** : Scroll smooth vers `#comment-ca-marche`
- **Smooth scrolling** : Activé via CSS global (`scroll-behavior: smooth`)

#### 6. Principes appliqués
- **SOLID** : Sections bien séparées, responsabilités claires
- **Clean Code** : Commentaires pour chaque section, code lisible
- **Clean Architecture** : Structure logique et maintenable
- **Accessibilité** : Structure sémantique (header, sections, footer)
- **Responsive** : Mobile-first avec breakpoints Tailwind

---

### Session 19 du 11/12/2025 - Alignement du chat avec le pattern du calendrier

#### 1. Objectif
Reproduire exactement la logique du calendrier pour le chat/conversations :
- Store Zustand avec persist (localStorage)
- Hydratation depuis Supabase via API route
- Synchronisation automatique lors des modifications
- Utilisation de `DEMO_USER_ID` pour l'instant (comme le calendrier)
- Si pas de user → localStorage uniquement
- Si user connecté → Supabase + localStorage (cache)

#### 2. Store chat créé (`src/store/useChatStore.ts`)
- **Structure alignée avec `useCalendarStore`** :
  - `messages: Message[]` : Liste des messages
  - `conversationId: string | null` : ID de la conversation courante
  - `isHydrated: boolean` : Indique si les données ont été chargées depuis Supabase
  - `addMessage()` : Ajoute un message et synchronise avec Supabase si `conversationId` existe
  - `addMessages()` : Ajoute plusieurs messages (pour l'hydratation)
  - `setMessages()` : Définit les messages (pour l'hydratation)
  - `setConversationId()` : Définit l'ID de la conversation
  - `clearConversation()` : Vide la conversation
  - `hydrateFromSupabase()` : Charge les messages depuis `/api/conversations/current`
- **Persistance localStorage** : Même pattern que le calendrier avec validation des dates
- **Synchronisation automatique** : `addMessage()` appelle `/api/conversations/[id]/messages` si `conversationId` existe

#### 3. Adaptation de `AiModal.tsx`
- **Remplacement de `useState` par le store** :
  - `messages` → `useChatStore().messages`
  - `currentConversationId` → `useChatStore().conversationId`
- **Hydratation au montage** :
  - Appel de `hydrateFromSupabase()` quand la modale s'ouvre (comme pour le calendrier)
  - Remplacement du `useEffect` de chargement manuel par l'appel au store
- **Ajout de messages** :
  - Utilisation de `addMessage()` au lieu de `setMessages()`
  - Le store gère automatiquement la synchronisation avec Supabase
- **Création de conversation** :
  - Si `conversationId` n'existe pas, création via `/api/conversations`
  - Mise à jour du store avec `setConversationId()`
  - Les messages suivants seront automatiquement synchronisés

#### 4. Pattern aligné avec le calendrier
- **Même structure de store** : Zustand + persist
- **Même logique d'hydratation** : `hydrateFromSupabase()` appelle l'API route
- **Même logique de synchronisation** : Appel API automatique dans les méthodes d'ajout
- **Même gestion user/no-user** : Utilisation de `DEMO_USER_ID` (comme le calendrier)
- **Même fallback** : Si Supabase n'est pas configuré, localStorage uniquement

#### 5. API routes utilisées
- **GET `/api/conversations/current`** : Hydratation (comme GET `/api/events`)
  - Retourne la dernière conversation et ses messages
  - Utilisé par `hydrateFromSupabase()`
- **POST `/api/conversations/[id]/messages`** : Synchronisation (comme POST `/api/events`)
  - Ajoute un message à une conversation
  - Appelé automatiquement par `addMessage()` si `conversationId` existe

#### 6. Principes appliqués
- **Pas de duplication de logique** : Le store gère tout (comme pour le calendrier)
- **Synchronisation automatique** : Pas besoin d'appeler manuellement l'API
- **Cohérence** : Même pattern pour calendrier et chat
- **Fallback gracieux** : Si Supabase n'est pas configuré, fonctionnement local uniquement

---

### Session 20 du 11/12/2025 - Refactorisation et redesign de la landing page

#### 1. Refactorisation en composants séparés
- **Structure créée** : `src/components/landing/` avec 8 composants modulaires
  - `LandingHeader.tsx` : Header fixe avec logo et CTA
  - `LandingHero.tsx` : Section hero principale avec titre et CTA
  - `LandingFeatures.tsx` : Section "Ce que fait l'app" (3 features)
  - `LandingBenefits.tsx` : Section "Pourquoi l'utiliser ?" (4 bénéfices)
  - `LandingHowItWorks.tsx` : Section "Comment ça marche ?" (3 étapes + exemple)
  - `LandingTargetAudience.tsx` : Section "Pour qui ?" (3 profils)
  - `LandingCTA.tsx` : Section CTA finale avec dégradé
  - `LandingFooter.tsx` : Footer minimaliste
  - `index.ts` : Barrel export pour faciliter les imports
- **Page principale refactorisée** : `src/app/accueil/page.tsx` utilise maintenant les composants modulaires
- **Avantages** : Code plus maintenable, réutilisable, et facile à tester

#### 2. Redesign moderne et épuré
- **Typographie soignée** :
  - Tailles augmentées : `text-4xl md:text-5xl lg:text-6xl xl:text-7xl` pour le hero
  - Hiérarchie claire : `font-bold` pour les titres, `font-light` pour les sous-titres
  - Espacements généreux : `space-y-8 md:space-y-12` entre les éléments
- **Grands espacements** :
  - Padding vertical : `py-20 md:py-32` pour les sections
  - Padding horizontal : `px-6 md:px-12 lg:px-16` pour les marges latérales
  - Gaps entre éléments : `gap-8 md:gap-12 lg:gap-16` pour les grids
- **Design minimaliste** :
  - Bordures discrètes : `border-[#3D3D3D0D]` (opacité 5%)
  - Ombres douces : `shadow-soft` avec `hover:shadow-medium`
  - Transitions fluides : `transition-all duration-300`
- **Hiérarchie visuelle** :
  - Hero avec hauteur minimale : `min-h-[85vh]`
  - Cards avec hover effects subtils : `hover:scale-110` pour les icônes
  - Dégradés utilisés avec parcimonie (hero, CTA, logo)

#### 3. Corrections des liens
- **Tous les liens CTA** : Pointent maintenant vers `/` au lieu de `/app`
  - `LandingHeader` : Bouton "Accéder à l'app" → `/`
  - `LandingHero` : Bouton principal et lien secondaire → `/`
  - `LandingCTA` : Bouton "Accéder à l'app" → `/`
- **Cohérence** : Tous les boutons d'accès à l'application pointent vers la route racine

#### 4. Principes appliqués
- **SOLID** : Chaque composant a une responsabilité unique
- **Clean Code** : Code lisible avec commentaires explicatifs
- **Clean Architecture** : Séparation claire entre composants UI et page principale
- **Design System** : Utilisation cohérente de la palette de couleurs et tokens de design
- **Responsive** : Mobile-first avec breakpoints Tailwind (`md:`, `lg:`, `xl:`)
- **Accessibilité** : Structure sémantique (header, sections, footer)

#### 5. Améliorations UX
- **Backdrop blur** : Header avec `backdrop-blur-sm` pour un effet moderne
- **Hover states** : Transitions douces sur tous les éléments interactifs
- **Typographie responsive** : Tailles adaptatives selon la taille d'écran
- **Espacements généreux** : Design aéré et premium

---

### Session 21 du 11/12/2025 - Refonte complète de la landing page avec nouveau pitch

#### 1. Refactorisation complète en sections modulaires
- **Nouvelle structure** : `src/app/accueil/_sections/` avec 11 composants
  - `Header.tsx` : Header sticky avec logo et CTA
  - `Hero.tsx` : Hero avec H1, sous-titre, CTA + preview card (desktop)
  - `ProblemMentalLoad.tsx` : Section problème charge mentale avec chiffres et exemples
  - `WhatLumiaDoes.tsx` : Section "Ce que fait Lumia" (3 features)
  - `AgentNotChat.tsx` : Section "Agent, pas un chat"
  - `Benefits.tsx` : Section bénéfices concrets
  - `HowItWorks.tsx` : Section "Comment ça marche ?" avec ancre `#comment-ca-marche`
  - `ForWho.tsx` : Section "Pour qui ?" (3 profils)
  - `DataAndImpact.tsx` : Section données & impact (IA responsable)
  - `FinalCTA.tsx` : CTA final avec dégradé vert/bleu
  - `Footer.tsx` : Footer minimaliste
- **Page principale simplifiée** : `src/app/accueil/page.tsx` compose simplement les sections dans l'ordre
- **Anciens composants supprimés** : `src/components/landing/` supprimé (remplacé par `_sections/`)

#### 2. Design SaaS moderne appliqué
- **Layout aéré** :
  - Conteneur commun : `max-w-6xl mx-auto px-4 md:px-8 lg:px-12`
  - Padding vertical cohérent : `py-16 md:py-24` (ou `py-24 lg:py-32` pour hero/CTA)
  - Espacements généreux entre sections
- **Cards modernes** :
  - `rounded-2xl` (arrondis prononcés)
  - `border border-[#3D3D3D0D]` (bordures fines)
  - `shadow-soft` avec `hover:shadow-medium`
  - Fond blanc ou pastel très léger
- **Typographie soignée** :
  - Titres : `text-3xl md:text-4xl lg:text-5xl` (ou plus grands pour hero)
  - Sous-titres : `text-lg md:text-xl lg:text-2xl` avec `font-light`
  - Texte : `text-base md:text-lg` avec `text-[#3D3D3D80]`
- **Boutons** :
  - `rounded-full` (complètement arrondis)
  - Padding réduit : `px-6 md:px-8 lg:px-10 py-2.5 md:py-3 lg:py-3.5`
  - Tailles de texte : `text-sm md:text-base lg:text-lg`

#### 3. Contenu intégré (textes exacts)
- **Hero** : "Arrêtez de penser à tout. Lumia organise votre vie pour vous."
- **Problème** : Charge mentale avec chiffres (88%, 68%/38%) et exemples concrets
- **Features** : 3 cards avec descriptions détaillées
- **Agent** : Distinction claire entre chat et agent proactif
- **Bénéfices** : Liste de 5 bénéfices concrets
- **Comment ça marche** : 3 étapes numérotées + exemple encadré
- **Pour qui** : 3 profils cibles avec conclusion
- **Données** : Section sur l'IA responsable
- **CTA final** : Slogan "Arrêtez de penser votre vie. Commencez à la vivre."

#### 4. Responsive optimisé
- **Mobile-first** : Layout vertical simple, CTA accessible
- **Desktop** :
  - Hero en 2 colonnes (`lg:grid-cols-2`) avec preview card à droite
  - Grids 3 colonnes pour features (`md:grid-cols-3`)
  - Grids 2 colonnes pour chiffres et listes (`md:grid-cols-2`)
- **Breakpoints cohérents** : `md:` (768px), `lg:` (1024px), `xl:` (1280px)

#### 5. Principes appliqués
- **SOLID** : Chaque section est un composant indépendant avec responsabilité unique
- **Clean Code** : Commentaires explicatifs, code lisible
- **Clean Architecture** : Séparation claire entre sections et page principale
- **Design System** : Cohérence avec palette brand (blanc, noir, pastels, gradients)
- **Accessibilité** : Structure sémantique (header, sections, footer)
- **Maintenabilité** : Sections modulaires faciles à modifier indépendamment

#### 6. Améliorations UX
- **Preview card** : Hero avec exemple visuel de planning (desktop uniquement)
- **Chiffres visuels** : Cards avec statistiques mises en avant
- **Exemples concrets** : Encadrés avec "Phrase" → "Résultat"
- **Ancre de navigation** : `#comment-ca-marche` pour scroll smooth
- **CTA multiples** : Boutons "Accéder à l'app" dans header, hero et CTA final

---

 *Fichier mis à jour automatiquement - Session 21 du 11/12/2025*

---

### Session 22 du 12/03/2026 - Refactorisation du composant AiFabButton

- **Refactor UI** : simplification de `AiFabButton.tsx` avec :
  - Composant typé `FC<AiFabButtonProps>` et constante `BUTTON_BASE_CLASSES` pour centraliser les classes Tailwind.
  - Suppression des commentaires et blocs JSX morts (badge de notification commenté).
  - Conservation du comportement existant (position fixe, animations, accessibilité ARIA).
- **Qualité code** : correction des avertissements Tailwind (utilisation de `text-(--color-brand-black)` et `bg-linear-to-tr`).

---

### Session 23 du 12/03/2026 - Demande de résumé du projet

- **Action** : Fourniture d'un résumé global du projet pour l'IA, structuré en deux parties (fonctionnelle et technique), basé sur l'état actuel documenté dans ce fichier et dans le code.

---

### Session 24 du 24/03/2026 - Ajout d'un crédit dans le footer

- **Footer** : ajout d'une ligne de crédit "Created by MADA-DEV.COM" dans `src/app/accueil/_sections/Footer.tsx`.
- **Lien externe** : insertion d'un lien cliquable vers `https://mada-dev.com` avec ouverture dans un nouvel onglet (`target="_blank"` + `rel="noopener noreferrer"`).

---

### Session 25 du 24/03/2026 - Amélioration accessibilité visuelle de la landing page

- **Palette et contrastes** : ajout de variables CSS d'accessibilité dans `src/app/globals.css` (`--text-secondary-accessible`, `--text-muted-accessible`, `--border-subtle`, `--surface-soft`, `--focus-ring`).
- **Focus clavier** : renforcement du style `:focus-visible` (outline plus visible) pour améliorer la navigation clavier.
- **Design system landing** : création de classes utilitaires globales (`landing-muted`, `landing-subtle`, `landing-card`, `landing-gradient-text`, `landing-link`) pour harmoniser lisibilité et cohérence.
- **Refonte sections accueil** : application des nouvelles classes et contrastes sur l'ensemble des sections de `src/app/accueil/_sections/` (dont `Footer.tsx`, `Header.tsx`, `Hero.tsx`, `ProblemMentalLoad.tsx`, `WhatLumiaDoes.tsx`, `AgentNotChat.tsx`, `Benefits.tsx`, `HowItWorks.tsx`, `ForWho.tsx`, `DataAndImpact.tsx`, `FinalCTA.tsx`) sans modifier les textes.
- **CTA et liens** : suppression des états hover à faible contraste (texte blanc sur fond pastel), remplacés par des variantes plus lisibles.

---

### Session 26 du 24/03/2026 - Correction des warnings Tailwind

- **Qualité code** : correction des warnings de classes Tailwind dans les sections de `src/app/accueil/_sections/`.
- **Conventions v4** : remplacement des syntaxes `bg-[var(...)]`, `text-[var(...)]`, `border-[var(...)]`, `hover:bg-[var(...)]` par les formes recommandées `bg-(--...)`, `text-(--...)`, `border-(--...)`, `hover:bg-(--...)`.
- **Nettoyage CTA final** : correction de la classe de paragraphe dans `FinalCTA.tsx` pour éviter les doublons/incohérences (`landing-muted` proprement appliquée).
- **Validation** : relance du lint sur tous les fichiers modifiés de la landing, résultat sans erreur/avertissement sur ce scope.

