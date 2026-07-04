# Runbook : Rotation des secrets (tous les 90 jours ou après fuite)

## Secrets concernés

| Secret | Où il vit | Impact rotation |
|---|---|---|
| `GEMINI_API_KEY` | `.env` VPS + Google AI Studio | Assistant IA down pendant la bascule |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | GitHub Variables + build | Rebuild d'image requis |
| Clé SSH de déploiement | GitHub Secrets + `authorized_keys` VPS | CI deploy KO si désynchro |
| `GRAFANA_ADMIN_PASSWORD` | `.env` VPS | Session Grafana à rouvrir |
| Webhook Discord | `monitoring/alertmanager/discord_webhook` VPS | Alertes muettes si invalide |

## Procédure

### 1. GEMINI_API_KEY

```bash
# a. Générer une nouvelle clé sur https://aistudio.google.com/apikey
# b. Sur le VPS :
cd ~/projects/lumia && nano .env      # remplacer GEMINI_API_KEY
docker compose -f docker-compose.prod.yml up -d app
curl -s https://<LUMIA_DOMAIN>/api/health
# c. Révoquer l'ancienne clé dans AI Studio SEULEMENT après vérification
```

### 2. Clé anon Supabase

```bash
# a. Dashboard Supabase → Settings → API → "Roll" la clé anon
# b. Mettre à jour la GitHub Variable NEXT_PUBLIC_SUPABASE_ANON_KEY
#    (repo → Settings → Secrets and variables → Actions → Variables)
# c. Mettre à jour .env sur le VPS (pour les usages runtime/SSR)
# d. Relancer le pipeline (workflow_dispatch) → rebuild + deploy automatique
```

### 3. Clé SSH de déploiement CI

```bash
# a. Générer une paire dédiée CI (sur ta machine) :
ssh-keygen -t ed25519 -f lumia-deploy -C "github-actions-lumia"
# b. Ajouter lumia-deploy.pub dans ~/.ssh/authorized_keys du VPS
# c. Remplacer le GitHub Secret SSH_PRIVATE_KEY par le contenu de lumia-deploy
# d. Relancer un deploy pour valider, PUIS supprimer l'ancienne clé de authorized_keys
```

### 4. Webhook Discord

```bash
# a. Discord → Paramètres du salon → Intégrations → nouveau webhook
# b. Sur le VPS :
echo "https://discord.com/api/webhooks/NOUVEAU" > ~/projects/lumia/monitoring/alertmanager/discord_webhook
docker compose -f docker-compose.prod.yml restart alertmanager
# c. Tester : arrêter 2 min un exporter → alerte attendue
docker stop lumia-node-exporter && sleep 180 && docker start lumia-node-exporter
```

## Règle d'or

Toujours **créer le nouveau secret → basculer → vérifier → révoquer l'ancien**,
dans cet ordre. Jamais révoquer avant d'avoir vérifié.
