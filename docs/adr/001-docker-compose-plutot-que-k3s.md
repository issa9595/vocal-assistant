# ADR 001 : Docker Compose plutôt que K3s pour la production

**Statut** : accepté · **Date** : 2026-07-04

## Contexte

Lumia est composé d'un service applicatif (Next.js full-stack : front +
API routes) et d'une stack d'observabilité (6 conteneurs). Le tout tourne
sur un **VPS Infomaniak unique** qui héberge déjà un autre projet
(portfolio) derrière Nginx Proxy Manager. Pas de besoin de scaling
horizontal à court terme : l'app est en phase MVP.

## Décision

Orchestration en production avec **Docker Compose** (fichier
`docker-compose.prod.yml`), pas K3s.

## Conséquences

+ Simplicité : un seul fichier YAML, déploiement en 2 commandes (`pull` + `up -d`)
+ ~300 Mo de RAM économisés par rapport à K3s, significatif sur un VPS mutualisé avec un autre projet
+ Cohérent avec l'existant du VPS (le portfolio est déjà en Compose + NPM)
+ Rollback trivial : `docker compose up -d` avec un tag d'image précédent
- Pas de scaling multi-nodes ni de rolling update natif (bref downtime au `up -d`)
- Migration vers K3s/K8s à prévoir si l'app doit scaler (les images et
  healthchecks sont déjà compatibles, la marche est faible)
