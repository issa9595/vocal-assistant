# ADR 003 — Nginx Proxy Manager mutualisé plutôt que Traefik dédié

**Statut** : accepté · **Date** : 2026-07-04

## Contexte

La grille demande un reverse proxy avec HTTPS Let's Encrypt automatique
(Traefik / Caddy / NPM). Le VPS héberge déjà **Nginx Proxy Manager**,
qui sert le portfolio via le réseau Docker externe `public_network`.

## Décision

Réutiliser le **NPM existant** comme point d'entrée unique du VPS.
Les services exposés de Lumia (app, Grafana, Uptime Kuma) rejoignent
`public_network` ; NPM les atteint par leur nom de conteneur.

## Conséquences

+ Un seul composant écoute sur 80/443 pour tout le VPS — pas de conflit
  de ports entre projets
+ Certificats Let's Encrypt renouvelés automatiquement, UI simple
+ Headers de sécurité centralisés par proxy host (onglet Advanced),
  documentés dans `docs/deployment/vps-security.md`
- Configuration cliquée dans une UI → non versionnable dans Git
  (compensé par la documentation exhaustive des proxy hosts)
- Contrairement à Traefik, pas de découverte automatique par labels :
  chaque nouveau service exposé demande une action manuelle dans l'UI
- L'admin NPM (port 81) doit rester fermé au public (accès par tunnel SSH)
