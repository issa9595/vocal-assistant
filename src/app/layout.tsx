/**
 * @file layout.tsx
 * @description Layout racine de l'application Next.js.
 * 
 * Ce fichier définit:
 * - Les métadonnées SEO de l'application
 * - La configuration des polices Google
 * - La structure HTML de base
 * - L'import des styles globaux
 * 
 * Note: Ce fichier est un Server Component par défaut dans Next.js App Router.
 * Il ne peut pas contenir de hooks ou d'interactivité côté client.
 */

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/**
 * Configuration de la police principale (Geist Sans)
 * Variable CSS : --font-geist-sans
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Configuration de la police monospace (Geist Mono)
 * Variable CSS : --font-geist-mono
 * Utilisée pour le code ou les timestamps
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Métadonnées SEO de l'application
 * Utilisées par les moteurs de recherche et les réseaux sociaux
 */
export const metadata: Metadata = {
  title: "Lumia - Assistant Personnel Vocal",
  description:
    "Application mobile-first pour gérer votre agenda avec un assistant vocal IA. Planifiez vos tâches et réunions simplement en parlant.",
  keywords: ["agenda", "vocal", "IA", "assistant", "planning", "tâches"],
  authors: [{ name: "Voice Assistant Team" }],
  
  // Configuration pour les appareils mobiles (PWA ready)
  applicationName: "Lumia",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lumia",
  },
  
  // Open Graph pour le partage sur les réseaux sociaux
  openGraph: {
    type: "website",
    title: "Lumia - Assistant Personnel Vocal",
    description: "Gérez votre agenda avec votre voix",
    siteName: "Lumia",
  },
};

/**
 * Configuration du viewport pour mobile
 * Séparée des metadata dans Next.js 14+
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fdf8f8", // brand-white
};

/**
 * Props du RootLayout
 */
interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Composant RootLayout
 * 
 * Layout racine qui enveloppe toutes les pages de l'application.
 * Configure la structure HTML, les polices et les classes de base.
 * 
 * @param children - Contenu de la page (page.tsx)
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <head>
        {/* Adobe Typekit */}
        <link rel="stylesheet" href="https://use.typekit.net/cdn7gfp.css" />
      </head>
      {/* 
        Body avec les classes de polices et l'antialiasing
        - font-sans utilise la police Typekit (proxima-nova) définie dans globals.css
        - antialiased pour un rendu de texte plus lisse
        - Fond blanc et texte noir selon la nouvelle palette
      */}
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          font-sans antialiased
          bg-brand-white text-brand-black
        `}
      >
        {children}
      </body>
    </html>
  );
}
