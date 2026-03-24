"use client";

/**
 * Footer minimaliste
 */
export default function Footer() {
  return (
    <footer className="
      w-full
      py-8 md:py-12
      border-t border-(--border-subtle)
      bg-(--color-brand-white)
    ">
      <div className="
        max-w-6xl
        mx-auto
        px-4 md:px-8 lg:px-12
        text-center
        text-sm md:text-base
        landing-muted
      ">
        <p>
          © 2025{" "}
          <span className="landing-gradient-text font-bold">
            Lumia
          </span>
          . Tous droits réservés.
        </p>
        <p className="mt-2 text-xs md:text-sm">
          Created by{" "}
          <a
            href="https://mada-dev.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold landing-link"
          >
            MADA-DEV.COM
          </a>
        </p>
      </div>
    </footer>
  );
}

