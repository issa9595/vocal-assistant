import { redirect } from "next/navigation";

/**
 * Page racine (/) - Redirige automatiquement vers /accueil
 * 
 * Cette redirection permet d'afficher la landing page par défaut
 * lorsque quelqu'un accède au site via la racine.
 */
export default function Home() {
  redirect("/accueil");
}

