"use client";

/**
 * Footer minimaliste
 */
export default function Footer() {
  return (
    <footer className="
      w-full
      py-8 md:py-12
      border-t border-[#3D3D3D0D]
      bg-[var(--color-brand-white)]
    ">
      <div className="
        max-w-6xl
        mx-auto
        px-4 md:px-8 lg:px-12
        text-center
        text-sm md:text-base
        text-[#3D3D3D80]
      ">
        <p>
          © 2025{" "}
          <span className="
            bg-gradient-to-r from-[#F8C4C5] to-[#FFF4C7]
            bg-clip-text
            text-transparent
            font-bold
          ">
            Lumia
          </span>
          . Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}

