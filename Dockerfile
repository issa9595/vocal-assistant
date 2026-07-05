# syntax=docker/dockerfile:1

# ============================================================
# Lumia, assistant vocal (Next.js 16, App Router)
# Image multi-stage : deps → build → runtime alpine non-root
# ============================================================

# Version Node pinnée (jamais de "latest" : builds reproductibles).
# Penser à mettre à jour vers la dernière LTS régulièrement.
ARG NODE_VERSION=24.13.0-alpine

# ============================================================
# Stage 1 : Installation des dépendances
# ============================================================
FROM node:${NODE_VERSION} AS deps

WORKDIR /app

# On copie uniquement les manifests d'abord pour profiter du cache Docker :
# tant que package-lock.json ne change pas, ce layer est réutilisé.
COPY package.json package-lock.json ./

# Lockfile gelé (npm ci) = installation reproductible.
# Cache npm monté pour accélérer les rebuilds (BuildKit).
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# ============================================================
# Stage 2 : Build Next.js (mode standalone)
# ============================================================
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Les variables NEXT_PUBLIC_* sont inlinées dans le bundle client AU BUILD.
# Elles sont passées en build-args par la CI (ce ne sont PAS des secrets :
# l'URL Supabase et l'anon key sont publiques par design, protégées par RLS).
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ============================================================
# Stage 3 : Runtime minimal
# ============================================================
FROM node:${NODE_VERSION} AS runner

WORKDIR /app

# Correctifs sécurité OS + suppression de npm/npx inutiles au runtime
# (réduit la surface d'attaque et les CVE node-pkg détectées par Trivy).
RUN apk upgrade --no-cache \
  && rm -rf /usr/local/lib/node_modules/npm \
            /usr/local/bin/npm /usr/local/bin/npx

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Assets publics + output standalone (server.js + node_modules tracés)
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Utilisateur non-root (l'image node fournit l'utilisateur "node", uid 1000)
USER node

EXPOSE 3000

# Healthcheck natif Docker : interroge /api/health (endpoint sans dépendance externe).
# wget est fourni par busybox dans alpine.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
