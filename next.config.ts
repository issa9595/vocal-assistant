import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy.
 * - script-src : 'unsafe-inline' requis par les scripts d'hydratation Next.js
 *   (durcissable plus tard avec des nonces via middleware) ;
 *   'unsafe-eval' uniquement en dev (HMR / React Refresh).
 * - connect-src : Supabase (auth + realtime). Gemini est appelé côté serveur
 *   uniquement, donc pas besoin de l'autoriser côté client.
 * - frame-ancestors 'none' : anti-clickjacking (équivalent moderne de X-Frame-Options).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Défense en profondeur (redondant avec frame-ancestors, mais gratuit)
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // L'app n'utilise que le micro (reconnaissance vocale) : on refuse le reste.
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), payment=(), usb=()" },
  // HSTS : sans effet en HTTP local (ignoré par les navigateurs hors HTTPS),
  // actif en prod derrière Nginx Proxy Manager.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // Build "standalone" : Next.js trace les dépendances et produit un serveur
  // autonome (server.js) : indispensable pour une image Docker minimale.
  output: "standalone",

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
