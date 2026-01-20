"use client";

import Header from "./_sections/Header";
import Hero from "./_sections/Hero";
import ProblemMentalLoad from "./_sections/ProblemMentalLoad";
import WhatLumiaDoes from "./_sections/WhatLumiaDoes";
import AgentNotChat from "./_sections/AgentNotChat";
import Benefits from "./_sections/Benefits";
import HowItWorks from "./_sections/HowItWorks";
import ForWho from "./_sections/ForWho";
import DataAndImpact from "./_sections/DataAndImpact";
import FinalCTA from "./_sections/FinalCTA";
import Footer from "./_sections/Footer";

/**
 * Page d'accueil / Landing page de Lumia
 * 
 * Landing page complète avec design SaaS moderne :
 * - Sections modulaires dans _sections/
 * - Design épuré, beaucoup d'espace
 * - Contenu pédagogique en français
 * - Mobile-first, responsive desktop
 * 
 * Structure :
 * 1. Header (sticky)
 * 2. Hero (H1 + CTA + preview)
 * 3. Problème : Charge mentale
 * 4. Ce que fait Lumia
 * 5. Agent, pas un chat
 * 6. Bénéfices concrets
 * 7. Comment ça marche
 * 8. Pour qui ?
 * 9. Données & Impact
 * 10. CTA final
 * 11. Footer
 */
export default function AccueilPage() {
  return (
    <div className="
      min-h-screen
      bg-[var(--color-brand-white)]
      text-[var(--color-brand-black)]
      flex flex-col
    ">
      <Header />
      <Hero />
      <ProblemMentalLoad />
      <WhatLumiaDoes />
      <AgentNotChat />
      <Benefits />
      <HowItWorks />
      <ForWho />
      <DataAndImpact />
      <FinalCTA />
      <Footer />
    </div>
  );
}
