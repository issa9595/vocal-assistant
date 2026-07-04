# Runbook : Disque plein sur le VPS

## Détection

- Alerte Discord `🚨 [CRITICAL] DiskSpaceLow` (< 10% libre pendant 5 min)
- Symptômes secondaires : builds qui échouent, conteneurs qui crashent,
  `no space left on device` dans les logs

## Diagnostic

```bash
# 1. Vue d'ensemble
df -h /

# 2. Qui consomme ? (en général : Docker)
sudo du -xh / --max-depth=1 2>/dev/null | sort -rh | head -10
docker system df

# 3. Détail Docker : images orphelines, volumes, build cache
docker images --format '{{.Repository}}:{{.Tag}} {{.Size}}' | sort -k2 -rh | head
docker volume ls -q | xargs -I{} docker volume inspect {} --format '{{.Name}} {{.Mountpoint}}'
```

## Mitigation

```bash
# 1. Nettoyage sans risque : images non utilisées de plus de 7 jours + build cache
docker image prune -af --filter "until=168h"
docker builder prune -af

# 2. Logs de conteneurs trop gros (normalement limités par la config logging du compose)
sudo du -sh /var/lib/docker/containers/*/*-json.log | sort -rh | head
# Si un log explose malgré max-size, truncate :
sudo truncate -s 0 /var/lib/docker/containers/<ID>/<ID>-json.log

# 3. Vieux journaux systemd
sudo journalctl --vacuum-time=7d

# 4. ⚠️ EN DERNIER RECOURS et avec certitude : volumes orphelins
# (vérifier qu'aucun volume listé n'appartient à Grafana/Prometheus/Uptime Kuma !)
docker volume prune -f
```

## Prévention (déjà en place, à vérifier)

- Rotation des logs : `logging.options.max-size` dans `docker-compose.prod.yml`
- Prometheus : rétention 15 jours (`--storage.tsdb.retention.time=15d`)
- Nettoyage post-deploy dans la CI : `docker image prune -af --filter "until=168h"`

## Vérification

```bash
df -h /   # > 20% libre attendu
```

L'alerte `DiskSpaceLow` doit se résoudre en ~5 minutes.
