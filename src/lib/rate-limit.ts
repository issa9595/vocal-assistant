/**
 * @file rate-limit.ts
 * @description Rate limiter in-memory (fenêtre glissante simplifiée).
 *
 * Suffisant pour un déploiement mono-conteneur (cf. ADR 001 : Docker Compose,
 * une seule instance de l'app). Si l'app est un jour répliquée, remplacer
 * par un store partagé (Redis / Upstash).
 *
 * Usage :
 *   const rate = checkRateLimit(`assistant:${user.id}`, { limit: 10, windowMs: 60_000 });
 *   if (!rate.allowed) → répondre 429 avec Retry-After.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

export interface RateLimitOptions {
  /** Nombre max de requêtes par fenêtre. */
  limit: number;
  /** Durée de la fenêtre en millisecondes. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Requêtes restantes dans la fenêtre courante. */
  remaining: number;
  /** Secondes avant réinitialisation (pour l'en-tête Retry-After). */
  retryAfterSeconds: number;
}

const buckets = new Map<string, Bucket>();

/** Purge paresseuse : évite une fuite mémoire sans setInterval (compatible edge/serverless). */
const MAX_BUCKETS = 10_000;

function purgeExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Vérifie et consomme une unité de quota pour la clé donnée.
 * @param key Identifiant du client (ex: `assistant:<userId>`)
 */
export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();

  if (buckets.size > MAX_BUCKETS) purgeExpired(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.limit - 1, retryAfterSeconds: 0 };
  }

  if (bucket.count >= options.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: options.limit - bucket.count,
    retryAfterSeconds: 0,
  };
}

/** Réservé aux tests : vide l'état du limiteur. */
export function resetRateLimiter() {
  buckets.clear();
}
