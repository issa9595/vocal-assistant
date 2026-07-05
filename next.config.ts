import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build "standalone" : Next.js trace les dépendances et produit un serveur
  // autonome (server.js) : indispensable pour une image Docker minimale.
  output: "standalone",
};

export default nextConfig;
