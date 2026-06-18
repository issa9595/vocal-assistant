"use client";

import LumiaLogo from "@/components/LumiaLogo";

/**
 * Footer — panneau en verre, cohérent avec le header
 */
export default function Footer() {
  return (
    <footer className="w-full px-3 md:px-6 pb-4 md:pb-6 mt-4">
      <div className="
        glass-panel glass-grain glass-highlight
        max-w-6xl mx-auto rounded-[1.5rem]
        px-6 md:px-10 py-8 md:py-10
        flex flex-col items-center gap-4 text-center
      ">
        <LumiaLogo height={26} />

        <p className="text-sm md:text-base landing-muted">
          © 2025{" "}
          <span className="landing-gradient-text font-bold">Lumia</span>
          . Tous droits réservés.
        </p>

        <p className="text-xs md:text-sm landing-subtle">
          Created by{" "}
          <a
            href="https://mada-dev.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold landing-link cursor-pointer"
          >
            MADA-DEV.COM
          </a>
        </p>
      </div>
    </footer>
  );
}
