"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Détecte l'entrée d'un élément dans le viewport (une seule fois).
 * Robuste : repli visible si pas d'IntersectionObserver, et apparition
 * immédiate si l'utilisateur préfère réduire les animations.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.18) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/**
 * Enveloppe une zone : applique la révélation `.landing-reveal` (flou → net,
 * montée) quand elle entre dans le viewport, avec un délai de stagger optionnel.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      className={`landing-reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
