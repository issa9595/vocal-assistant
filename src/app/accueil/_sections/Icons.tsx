/**
 * @file Icons.tsx
 * @description Jeu d'icônes du site vitrine Lumia.
 * Famille unique, style Lucide (24×24, contour, stroke 1.75, bouts arrondis)
 * pour une cohérence stricte avec l'iconographie de l'app. Aucun emoji.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 24, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Micro — voix */
export const MicIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
    <path d="M19 10a7 7 0 0 1-14 0" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </Base>
);

/** Ondes sonores — assistant à l'écoute */
export const WavesIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M2 12h2" />
    <path d="M6 8v8" />
    <path d="M10 4v16" />
    <path d="M14 7v10" />
    <path d="M18 9v6" />
    <path d="M22 12h0" />
  </Base>
);

/** Étincelles — compréhension de l'intention */
export const SparklesIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
    <path d="M19 14l.7 1.9L21.6 16.6 19.7 17.3 19 19.2 18.3 17.3 16.4 16.6 18.3 15.9 19 14z" />
  </Base>
);

/** Calendrier validé — planification */
export const CalendarCheckIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="4" width="18" height="17" rx="3" />
    <path d="M3 9h18" />
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <path d="M9 15l2 2 4-4" />
  </Base>
);

/** Cerveau — charge mentale */
export const BrainIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M9.5 4a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 5 9a2.5 2.5 0 0 0 1 2 2.5 2.5 0 0 0 0 4 2.5 2.5 0 0 0 2.5 3A2 2 0 0 0 12 20V5.5A1.5 1.5 0 0 0 10.5 4z" />
    <path d="M14.5 4a2.5 2.5 0 0 1 2.5 2.5A2.5 2.5 0 0 1 19 9a2.5 2.5 0 0 1-1 2 2.5 2.5 0 0 1 0 4 2.5 2.5 0 0 1-2.5 3A2 2 0 0 1 12 20" />
  </Base>
);

/** Horloge — temps gagné */
export const ClockIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Base>
);

/** Check léger */
export const CheckIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </Base>
);

/** Flèche droite — CTA */
export const ArrowRightIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </Base>
);

/** Chevron bas — scroll */
export const ChevronDownIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 9l6 6 6-6" />
  </Base>
);

/** Bouclier — données protégées */
export const ShieldIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </Base>
);

/** Feuille — IA responsable */
export const LeafIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 19c0-7 5-13 14-14 1 9-4 15-12 15a6 6 0 0 1-2-1z" />
    <path d="M5 19c2-4 5-7 9-9" />
  </Base>
);

/** Cœur — bien-être */
export const HeartIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 20s-7-4.5-9.2-8.6A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 9.2 5.4C19 15.5 12 20 12 20z" />
  </Base>
);

/** Chapeau de diplômé — étudiants */
export const GraduationCapIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M2 9l10-4 10 4-10 4L2 9z" />
    <path d="M6 11v4c0 1.3 2.7 2.5 6 2.5s6-1.2 6-2.5v-4" />
    <path d="M22 9v5" />
  </Base>
);

/** Mallette — salariés & managers */
export const BriefcaseIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" />
    <path d="M3 12h18" />
  </Base>
);

/** Plume — ceux qui détestent planifier */
export const FeatherIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 4a6 6 0 0 0-8.5 0L5 10.5V19h8.5L20 12.5A6 6 0 0 0 20 4z" />
    <path d="M16 8L5 19" />
    <path d="M14 10h-4v4" />
  </Base>
);

/** Liste — priorités */
export const ListIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 6h12" />
    <path d="M8 12h12" />
    <path d="M8 18h12" />
    <path d="M4 6h.01" />
    <path d="M4 12h.01" />
    <path d="M4 18h.01" />
  </Base>
);

/** Cloche — rappels */
export const BellIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
    <path d="M10.5 19a1.8 1.8 0 0 0 3 0" />
  </Base>
);

/** Lecture — « voir la démo » */
export const PlayIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8.5l5 3.5-5 3.5z" />
  </Base>
);

/** Connexion — outils du quotidien */
export const PlugIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 2v6" />
    <path d="M15 2v6" />
    <path d="M7 8h10v3a5 5 0 0 1-10 0V8z" />
    <path d="M12 16v6" />
  </Base>
);
