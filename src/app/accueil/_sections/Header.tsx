"use client";

import Link from "next/link";

/**
 * Header de la landing page
 * Sticky avec logo et CTA
 */
export default function Header() {
  return (
    <header className="
      sticky top-0 z-50
      w-full
      bg-[var(--color-brand-white)]
      border-b border-[#3D3D3D0D]
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
        <h1 className="
          text-2xl md:text-3xl
          font-bold
          tracking-tight
        ">
          <span className="
            bg-gradient-to-r from-[#F8C4C5] to-[#FFF4C7]
            bg-clip-text
            text-transparent
          ">
            Lumia
          </span>
        </h1>

        {/* CTA */}
        <Link
          href="/app"
          className="
            px-4 md:px-6
            py-2 md:py-2.5
            bg-[var(--color-brand-white)]
            border border-[#3D3D3D0D]
            text-[var(--color-brand-black)]
            font-medium
            text-sm md:text-base
            rounded-full
            shadow-soft
            hover:shadow-medium
            hover:bg-gradient-to-r hover:from-[#F8C4C5] hover:to-[#FFF4C7]
            hover:text-white
            transition-all duration-300
          "
        >
          Accéder à l'app
        </Link>
      </div>
    </header>
  );
}

