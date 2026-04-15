# Auth Design — Lumia

**Date :** 2026-04-15  
**Scope :** Inscription et connexion utilisateur  
**Stack :** Next.js 16, Supabase Auth, `@supabase/ssr`, Tailwind v4

---

## 1. Architecture

### Dépendance ajoutée
- `@supabase/ssr` — package officiel Supabase pour Next.js App Router, gère les sessions via cookies HTTP-only.

### Clients Supabase

| Fichier | Fonction | Usage |
|---|---|---|
| `src/lib/supabase/client.ts` | `createBrowserClient` (`@supabase/ssr`) | Composants client (`"use client"`) |
| `src/lib/supabase/server.ts` | `createServerClient` (`@supabase/ssr`) avec cookies | Route handlers, server components |

### Middleware (`src/middleware.ts`)
- Intercepte toutes les requêtes
- Rafraîchit le token de session silencieusement (obligatoire avec `@supabase/ssr`)
- Redirige vers `/auth` si une route protégée est accédée sans session active

**Routes protégées :** `/app` et `/api/*`  
**Routes publiques :** `/accueil`, `/auth`, `/auth/callback`

---

## 2. Pages et fichiers

### Nouveaux fichiers

| Fichier | Description |
|---|---|
| `src/app/auth/page.tsx` | Page auth avec bascule connexion / inscription |
| `src/app/auth/callback/route.ts` | Route handler OAuth — échange le code contre une session |
| `src/middleware.ts` | Middleware Next.js de protection des routes |

### Fichiers modifiés

| Fichier | Modification |
|---|---|
| `src/lib/supabase/client.ts` | Remplacer par `createBrowserClient`, activer `persistSession` |
| `src/lib/supabase/server.ts` | Remplacer par `createServerClient` avec cookies |
| `src/app/app/page.tsx` | Ajouter bouton de déconnexion dans le header |
| `src/app/accueil/_sections/Header.tsx` | Ajouter boutons "Se connecter" / "S'inscrire" → `/auth` |

---

## 3. Page `/auth`

Page unique avec deux modes : **Connexion** et **Inscription** (bascule via onglets ou lien).

### Connexion
- Champs : email, mot de passe
- Action : `supabase.auth.signInWithPassword({ email, password })`
- Succès → redirect `/app`
- Erreur → message inline (ex : "Email ou mot de passe incorrect")

### Inscription
- Champs : email, mot de passe, confirmation mot de passe
- Validation côté client : mot de passe ≥ 8 caractères, correspondance confirmation
- Action : `supabase.auth.signUp({ email, password })`
- Succès → message "Vérifie ta boîte mail pour confirmer ton compte"
- Erreur → message inline (ex : "Cet email est déjà utilisé")

### Google OAuth
- Bouton "Continuer avec Google" (présent dans les deux modes)
- Action : `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '/auth/callback' } })`
- Redirect Google → retour `/auth/callback` → session → redirect `/app`

---

## 4. Route `/auth/callback`

Handler serveur (`GET`) :
1. Récupère le `code` depuis les query params
2. Appelle `supabase.auth.exchangeCodeForSession(code)`
3. Redirect vers `/app`
4. En cas d'erreur → redirect vers `/auth?error=callback`

---

## 5. Flux utilisateur

### Inscription email
```
/auth (mode inscription)
  → signUp()
  → email de confirmation envoyé
  → clic sur le lien
  → /auth/callback
  → session créée
  → /app
```

### Connexion email
```
/auth (mode connexion)
  → signInWithPassword()
  → session créée
  → /app
```

### Connexion Google
```
/auth
  → signInWithOAuth('google')
  → Google OAuth
  → /auth/callback
  → session créée
  → /app
```

### Déconnexion
```
Header de /app
  → signOut()
  → /accueil
```

### Accès non autorisé
```
/app (sans session)
  → middleware détecte l'absence de session
  → redirect /auth
```

---

## 6. Header `/accueil`

- **Non connecté :** boutons "Se connecter" et "S'inscrire" → `/auth`
- **Connecté :** email de l'utilisateur + bouton "Se déconnecter"
- Détection de session via `supabase.auth.getUser()` côté client au montage

---

## 7. Gestion des erreurs

| Cas | Comportement |
|---|---|
| Email déjà utilisé | Message inline sous le champ email |
| Mot de passe incorrect | Message inline générique (ne pas préciser lequel est faux) |
| Confirmation mot de passe non identique | Validation client avant envoi |
| Erreur réseau | Message générique "Une erreur est survenue, réessaie" |
| Erreur callback OAuth | Redirect `/auth?error=callback` + message affiché |

---

## 8. Configuration Supabase (hors code)

À faire dans le dashboard Supabase avant l'implémentation :
1. Activer le provider **Google** dans Authentication > Providers
2. Configurer les **Redirect URLs** : `http://localhost:3000/auth/callback` (dev) et l'URL de prod
3. Vérifier que l'envoi d'email de confirmation est activé

---

## 9. Ce qui n'est PAS dans ce scope

- Réinitialisation de mot de passe (forgot password)
- Gestion de profil utilisateur
- Liaison des données existantes (conversations, events) à l'utilisateur
- Rate limiting côté application (géré par Supabase nativement)
