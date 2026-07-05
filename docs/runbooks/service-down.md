# Runbook : Service Lumia down

## Détection

- Alerte Discord `🚨 [CRITICAL] LumiaAppDown` (Alertmanager)
- Monitor Uptime Kuma rouge sur `https://lumia.issa.madayev.mds-nantes.fr/api/health`
- Alerte `ContainerRestarting` (crash loop)

## Diagnostic (sur le VPS)

```bash
cd ~/projects/lumia

# 1. Etat des conteneurs : lequel est down / unhealthy ?
docker compose -f docker-compose.prod.yml ps

# 2. Logs du service en erreur
docker logs lumia-app --tail 100

# 3. Crash loop ? (RestartCount élevé)
docker inspect lumia-app --format '{{.RestartCount}} / {{.State.Status}} / OOMKilled: {{.State.OOMKilled}}'

# 4. Ressources du VPS
df -h /          # disque plein ? → runbook disk-full.md
free -m          # mémoire saturée ?
```

## Mitigation

| Cause identifiée | Action |
|---|---|
| `OOMKilled: true` | `docker compose -f docker-compose.prod.yml restart app`, puis ajouter une limite `mem_limit` supérieure ou investiguer la fuite |
| Disque plein | → runbook `disk-full.md` |
| Erreur applicative après un déploiement | **Rollback** (ci-dessous) |
| `.env` manquant/incorrect | Vérifier `~/projects/lumia/.env`, recréer depuis `.env.example`, `up -d` |
| Supabase down (login KO mais app up) | Vérifier https://status.supabase.com (rien à faire côté VPS) |
| NPM down (tout le VPS inaccessible) | `docker restart <conteneur-npm>` ; vérifier les certificats |

### Rollback vers l'image précédente

```bash
# Lister les tags disponibles sur GHCR (ou voir les runs GitHub Actions)
# Chaque commit a un tag sha-XXXXXXX
docker pull ghcr.io/issa9595/vocal-assistant:sha-<COMMIT_PRECEDENT>
docker tag ghcr.io/issa9595/vocal-assistant:sha-<COMMIT_PRECEDENT> ghcr.io/issa9595/vocal-assistant:latest
docker compose -f docker-compose.prod.yml up -d app
```

## Vérification post-incident

```bash
curl -s https://lumia.issa.madayev.mds-nantes.fr/api/health   # {"status":"ok",...}
docker compose -f docker-compose.prod.yml ps # tous "healthy"
```

L'alerte Discord doit passer en **resolved** dans les 2 minutes.
