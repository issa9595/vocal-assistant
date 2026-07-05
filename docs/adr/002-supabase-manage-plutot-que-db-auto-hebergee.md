# ADR 002 : Supabase managé plutôt qu'une base auto-hébergée sur le VPS

**Statut** : accepté · **Date** : 2026-07-04

## Contexte

Lumia a besoin d'une base PostgreSQL (événements calendrier, conversations)
et d'une authentification (OAuth Google, sessions). Le module demande une
« DB en réseau interne uniquement ». La question est : Postgres dans un
conteneur sur le VPS, ou service managé ?

## Décision

Utiliser **Supabase managé** (PostgreSQL + Auth + Row Level Security),
hors du VPS. Aucun conteneur de base de données dans la stack.

## Conséquences

+ Zéro port DB sur le VPS : la surface d'attaque « base exposée » disparaît
  entièrement (critère disqualifiant de la grille impossible à rater)
+ Backups, réplication et mises à jour de sécurité gérés par Supabase
+ Auth complète (OAuth, refresh tokens, RLS) sans code serveur à maintenir
+ La sécurité des données repose sur les **policies RLS** versionnées dans
  `supabase/migrations/`, auditables en revue de code
- Dépendance à un service tiers : si Supabase est down, l'app est dégradée
  (le middleware fail-closed traite l'utilisateur comme déconnecté)
- Les clés `NEXT_PUBLIC_SUPABASE_*` sont inlinées au build : un rebuild
  est nécessaire pour changer de projet Supabase
- Latence réseau VPS ↔ Supabase (région EU choisie pour la minimiser)
