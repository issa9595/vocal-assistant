# Sécurité du VPS (Infomaniak) : hardening et configuration NPM

Le VPS héberge déjà le portfolio derrière **Nginx Proxy Manager (NPM)**.
Ce document décrit le durcissement appliqué et comment le **vérifier**
(le script `scripts/check-vps-security.sh` automatise les checks).

## 1. SSH durci

Fichier : `/etc/ssh/sshd_config`

```
PasswordAuthentication no        # login par clé uniquement
PermitRootLogin no               # root désactivé
PubkeyAuthentication yes
MaxAuthTries 3
```

Appliquer : `sudo systemctl restart ssh`

> ⚠️ Toujours garder une session SSH ouverte pendant le changement,
> et tester la connexion par clé dans un second terminal AVANT de fermer.

Vérification depuis ta machine :

```bash
ssh -o PreferredAuthentications=password user@VPS_IP
# Attendu : "Permission denied (publickey)" → mot de passe refusé ✅
```

## 2. Pare-feu UFW

Seuls les ports nécessaires sont ouverts :

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (redirect → HTTPS par NPM)
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status verbose
```

**Aucun autre port n'est publié** : ni la DB (Supabase est managée, hors VPS),
ni Prometheus/Alertmanager (réseau Docker interne `lumia-internal` uniquement),
ni le port 81 d'admin NPM (voir §4).

## 3. fail2ban

```bash
sudo apt install fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
```

Dans `/etc/fail2ban/jail.local` :

```ini
[sshd]
enabled = true
maxretry = 5
bantime = 1h
findtime = 10m
```

```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd   # vérifie le jail actif
```

## 4. Nginx Proxy Manager

### Proxy Hosts à créer (UI NPM)

| Domaine | Forward Hostname | Port | Options |
|---|---|---|---|
| `lumia.issa.madayev.mds-nantes.fr` | `lumia-app` | 3000 | Websockets ON, Block Common Exploits ON |
| `grafana.lumia.issa.madayev.mds-nantes.fr` | `lumia-grafana` | 3000 | Websockets ON |
| `status.lumia.issa.madayev.mds-nantes.fr` | `lumia-uptime-kuma` | 3001 | Websockets ON |

Pour chaque host, onglet **SSL** :
- Certificat **Let's Encrypt** (Request a new certificate)
- ✅ Force SSL (redirect HTTP → HTTPS)
- ✅ HTTP/2 Support
- ⬜ HSTS Enabled : laissé décoché. Le header HSTS est posé par le bloc
  Advanced ci-dessous (version plus complète avec includeSubDomains et
  preload) ; cocher la case créerait un header en double.

> NPM joint les conteneurs par leur **nom** car ils partagent le réseau
> Docker externe `public_network`.

### Headers de sécurité (onglet Advanced de chaque Proxy Host)

Piège nginx important : NPM ajoute son propre `add_header X-Served-By` dans
le bloc `location /` qu'il génère. Or en nginx, dès qu'un bloc location
contient un `add_header`, il ignore tous ceux du niveau serveur. Des
`add_header` posés "nus" dans l'onglet Advanced ne sortent donc jamais.
La solution : déclarer soi-même le `location /` (NPM le détecte et ne
génère pas le sien) avec les headers à l'intérieur, et laisser
`include conf.d/include/proxy.conf` gérer le proxy_pass et les en-têtes
de forwarding (ne PAS ajouter de proxy_pass manuel : il est déjà dans
l'include, le doubler invalide la config).

Bloc Advanced du host de **l'app Lumia** (CSP complète, micro autorisé
pour l'assistant vocal) :

```nginx
location / {
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), geolocation=(), payment=(), microphone=(self)" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co; font-src 'self' data:; frame-ancestors 'none'" always;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $http_connection;
    include conf.d/include/proxy.conf;
}
```

Bloc Advanced des hosts **Grafana** et **Uptime Kuma** (sans CSP, qui
casserait leurs interfaces ; micro bloqué) :

```nginx
location / {
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), geolocation=(), payment=(), microphone=()" always;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $http_connection;
    include conf.d/include/proxy.conf;
}
```

### Port d'admin NPM (81)

Le port 81 ne doit **pas** être ouvert dans UFW. Administration via tunnel SSH :

```bash
ssh -L 8181:127.0.0.1:81 user@VPS_IP
# puis http://localhost:8181 dans le navigateur
```

## 5. Secrets

- `.env` présent **uniquement sur le VPS** (`~/projects/lumia/.env`), jamais commité
  (`.gitignore` + `.dockerignore`).
- Webhook Discord dans `monitoring/alertmanager/discord_webhook` (gitignoré).
- Secrets CI dans **GitHub Secrets** (`SSH_PRIVATE_KEY`, `SSH_HOST`…), variables
  publiques dans **GitHub Variables** (`LUMIA_DOMAIN`, `NEXT_PUBLIC_*`).
- Rotation recommandée : clés API et webhook tous les 90 jours
  (voir `docs/runbooks/rotate-secrets.md`).

## 6. Audits externes

```bash
# Scan Nmap depuis l'extérieur (ta machine, pas le VPS)
nmap -Pn <VPS_IP>
# Attendu : seuls 22, 80, 443 open

# Headers HTTPS
curl -sI https://lumia.issa.madayev.mds-nantes.fr | grep -iE "strict-transport|x-frame|content-security"
```

- Mozilla Observatory : https://developer.mozilla.org/en-US/observatory : viser **A**
- SSL Labs : https://www.ssllabs.com/ssltest/ : viser **A**

## 7. Installation initiale de Lumia sur le VPS

```bash
# 1. Cloner le repo (les fichiers compose/monitoring sont versionnés)
mkdir -p ~/projects && cd ~/projects
git clone https://github.com/issa9595/vocal-assistant.git lumia
cd lumia

# 2. Créer les secrets (jamais commités)
cp .env.example .env && nano .env                      # GEMINI_API_KEY, GRAFANA_ADMIN_PASSWORD, LUMIA_DOMAIN…
echo "https://discord.com/api/webhooks/…" > monitoring/alertmanager/discord_webhook
chmod 600 .env monitoring/alertmanager/discord_webhook

# 3. Vérifier que le réseau NPM existe
docker network inspect public_network >/dev/null 2>&1 || docker network create public_network

# 4. Premier démarrage
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps          # tous "healthy"
```

Ensuite : créer les Proxy Hosts dans NPM (§4), configurer Uptime Kuma
(monitor HTTPS sur `https://lumia.issa.madayev.mds-nantes.fr/api/health` + notification Discord).
