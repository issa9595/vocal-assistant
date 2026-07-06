# Audit de sécurité — Lumia (vocal-assistant)

Date : 2026-07-06 · Périmètre : code applicatif (Next.js 16), Supabase (RLS), Docker, CI/CD, monitoring.

## Synthèse

> **Mise à jour 2026-07-06 : tous les points ont été corrigés** (voir section
> "Correctifs appliqués" en bas). Seul résidu : 2 vulns npm *moderate*
> (postcss embarqué dans next, correctif stable non publié) — acceptées,
> surveillées par le gate CI.

| # | Sévérité | Constat | Statut |
|---|----------|---------|--------|
| 1 | 🔴 Critique | `/api/assistant` accessible sans authentification | ✅ Corrigé |
| 2 | 🟠 Élevé | Aucun rate limiting côté serveur sur les API | ✅ Corrigé |
| 3 | 🟠 Élevé | 2 vulnérabilités high dans les dépendances prod (`ws`, `minimatch`) | ✅ Corrigé |
| 4 | 🟡 Moyen | Aucun header de sécurité HTTP configuré (CSP, HSTS, X-Frame-Options…) | ✅ Corrigé |
| 5 | 🟡 Moyen | Payload `/api/assistant` non validé en profondeur (injection de prompt via `conversationHistory`/`currentEvents`, `now` contrôlé par le client) | ✅ Corrigé |
| 6 | 🟡 Moyen | Pas de limite de taille sur les bodies JSON (`content` des messages illimité) | ✅ Corrigé |
| 7 | 🔵 Faible | Grafana admin/password via env, user par défaut `admin` | ✅ Corrigé |
| 8 | 🔵 Faible | `script_stop: true` déprécié + `git pull` sur le VPS pendant le deploy | ✅ Corrigé |

## 🔴 1. `/api/assistant` sans authentification (critique)

`src/app/api/assistant/route.ts` — le handler `POST` ne fait **aucun** `supabase.auth.getUser()` (contrairement à toutes les autres routes). Le middleware matche `/api/*` mais ne redirige que les chemins `/app` : il laisse passer les requêtes API non authentifiées.

Impact : n'importe qui sur Internet peut consommer ta clé Gemini (`curl -X POST https://<domaine>/api/assistant`) → épuisement de quota, coûts, et usage de ton LLM comme proxy gratuit.

Correctif :

```ts
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
```

## 🟠 2. Pas de rate limiting

Aucune limite serveur sur `/api/assistant` ni sur les routes CRUD. Même authentifié, un compte peut brûler le quota Gemini ou spammer la DB.

Correctif : rate limit par user/IP (in-memory type `lru-cache` suffit pour un seul conteneur, ou au niveau Nginx Proxy Manager avec `limit_req`).

## 🟠 3. Dépendances vulnérables

`npm audit --omit=dev` : 5 vulns (2 high, 3 moderate) — `ws` 8.x (memory disclosure + DoS), `minimatch` (ReDoS), `brace-expansion`, `postcss` (via next). Toutes sauf postcss corrigeables via `npm audit fix` (sans breaking change). Le scan Trivy en CI couvre l'image OS mais ces vulns npm sont dans le bundle applicatif.

Correctif : `npm audit fix`, puis ajouter `npm audit --omit=dev --audit-level=high` en CI.

## 🟡 4. Headers de sécurité absents

`next.config.ts` ne définit aucun header. Pas de CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. HSTS dépend de la config NPM (à vérifier côté VPS).

Correctif : bloc `headers()` dans `next.config.ts` (au minimum `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`), CSP en mode report-only pour commencer.

## 🟡 5. Entrées client injectées dans le prompt système

`/api/assistant` : `currentEvents`, `viewMode`, `referenceDate`, `now` et `conversationHistory` viennent du client sans validation et sont interpolés dans `SYSTEM_PROMPT`. Un client malveillant peut réécrire les instructions système. Comme les actions retournées sont exécutées côté client sur ses propres données (RLS), l'impact reste limité à l'abus du LLM — mais valider types/tailles (zod) et borner `conversationHistory` (ex. 20 messages max) est nécessaire, surtout combiné au point 1.

## 🟡 6. Pas de limite de taille des payloads

`POST /api/conversations/[id]/messages` accepte un `content` de taille arbitraire → stockage illimité en DB par user. Idem `title`. Ajouter des bornes (ex. `content` ≤ 10 000 chars) côté API et/ou contrainte `check` en SQL.

## 🔵 7. Grafana

`GF_SECURITY_ADMIN_USER` par défaut `admin` et Grafana exposé publiquement via NPM. Mot de passe requis (bon), signup désactivé (bon). Recommandé : user admin non trivial, et idéalement restreindre l'accès par IP ou auth NPM devant.

## 🔵 8. Chaîne de déploiement

`appleboy/ssh-action` avec `script_stop: true` (déprécié, préférer `set -e` dans le script). Le `git pull --ff-only` sur le VPS implique un clone du repo en prod — OK, mais toute compromission du repo GitHub = exécution sur le VPS ; la protection d'environnement GitHub (required reviewers) mentionnée en commentaire mérite d'être réellement activée.

## ✅ Points solides

- `.env` non commité, absent de l'historique git (vérifié par recherche de motifs `AIzaSy`/JWT sur tout l'historique) ; `.dockerignore` et `.gitignore` corrects ; webhook Discord en fichier gitignoré monté en `:ro`.
- RLS activé sur les 3 tables avec policies `using` + `with check` correctes, y compris ownership des messages via la conversation.
- Toutes les routes CRUD vérifient `getUser()` **et** filtrent par `user_id` (défense en profondeur avec RLS).
- Middleware : `getUser()` (vérif serveur) plutôt que `getSession()`, fail-closed si Supabase injoignable.
- Callback OAuth : pas d'open redirect (destination codée en dur `/app`, PKCE).
- Docker : multi-stage, non-root, version Node pinnée, npm supprimé du runtime, healthcheck sans dépendance externe.
- Compose prod : aucun port publié, réseau interne séparé, monitoring interne non exposé, logs bornés.
- CI : Trivy bloquant sur CRITICAL/HIGH, permissions workflows minimales, secrets via GitHub Secrets.
- Aucune utilisation de `dangerouslySetInnerHTML`/`eval` ; clé Gemini utilisée uniquement côté serveur.

## Correctifs appliqués (2026-07-06)

1. **Auth `/api/assistant`** : `getUser()` + 401, comme les autres routes (`src/app/api/assistant/route.ts`).
2. **Vulns npm** : `npm audit fix` (ws, minimatch, brace-expansion) + next/eslint-config-next `^16.2.10` dans package.json (lockfile mis à jour ; relancer `npm install` en local) + step CI `npm audit --omit=dev --audit-level=high` dans `lint.yml`. Résidu accepté : postcss *moderate* via next (fix stable non publié).
3. **Rate limiting** : `src/lib/rate-limit.ts` (in-memory, mono-conteneur cf. ADR 001) appliqué par user : assistant 10/min, events 60/min, messages 60/min, conversations 30/min. Réponses 429 + `Retry-After` (déjà gérées par le client).
4. **Headers** : CSP complète (frame-ancestors 'none', connect-src limité à Supabase), X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS — `next.config.ts`.
5. **Validation payloads** : validation stricte sans dépendance de `/api/assistant` (types, tailles, historique borné à 20 messages, `now` toujours calculé serveur), bornes sur `content` (10 000), `title` (200/300), max 50 évènements/requête.
6. **Grafana** : `GRAFANA_ADMIN_USER` requis (plus de fallback `admin`), cookies secure, gravatar/analytics off. **Deploy** : `set -euo pipefail` remplace `script_stop` (déprécié).

Vérification : `tsc --noEmit` ✅ · `npm run lint` ✅ (0 erreur) · 19 tests Vitest ✅.

Restent côté GitHub/VPS (hors code) : activer la protection d'environnement `production` (required reviewers) et vérifier la config HTTPS/HSTS de Nginx Proxy Manager.
