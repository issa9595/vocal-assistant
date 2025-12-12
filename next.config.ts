import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "geolocation=()" },
  // Adaptez la CSP aux domaines réellement utilisés (Supabase, Gemini, Typekit)
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com",
      "img-src 'self' data:",
      "style-src 'self' 'unsafe-inline' https://use.typekit.net",
      "font-src 'self' https://use.typekit.net",
      "script-src 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
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
