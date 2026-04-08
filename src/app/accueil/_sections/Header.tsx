"use client";

import Link from "next/link";
import LumiaLogo from "@/components/LumiaLogo";

/**
 * Header de la landing page
 * Sticky avec logo et CTA
 */
export default function Header() {
  return (
    <header className="
      sticky top-0 z-50
      w-full
      bg-(--color-brand-white)
      border-b border-(--border-subtle)
      backdrop-blur-sm bg-opacity-95
    ">
      <div className="
        max-w-6xl
        mx-auto
        px-4 md:px-8 lg:px-12
        py-4 md:py-5
        flex
        items-center
        justify-between
      ">
        {/* Logo */}
        <h1>
          <LumiaLogo height={28} />
        </h1>

        {/* CTA */}
        <Link
          href="/app"
          className="
            px-4 md:px-6
            py-2 md:py-2.5
            bg-(--color-brand-white)
            border border-(--border-subtle)
            text-(--color-brand-black)
            font-medium
            text-sm md:text-base
            rounded-full
            shadow-soft
            hover:shadow-medium
            hover:bg-(--surface-soft)
            transition-all duration-300
          "
        >
          Accéder à l'app
        </Link>
      </div>
    </header>
  );
}

