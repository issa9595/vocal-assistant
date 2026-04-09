/**
 * @file LumiaMarkLogo.tsx
 * @description Monogramme Lumia — le "m" seul, avec dégradé vertical sombre→clair.
 */

interface LumiaMarkLogoProps {
  height?: number;
  className?: string;
}

export default function LumiaMarkLogo({ height = 40, className = "" }: LumiaMarkLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="38 669 106 50"
      height={height}
      aria-label="Lumia"
      className={className}
    >
      <defs>
        <linearGradient id="mark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d3d3d" />
          <stop offset="100%" stopColor="#b0b0b0" />
        </linearGradient>
      </defs>
      {/* Arche gauche du m */}
      <path
        fill="url(#mark-grad)"
        d="M60.32,693.62v22.37s12.43,0,12.43,0v-22.37c0-6.82,3.15-9.7,7.79-9.7,4.64,0,7.79,2.88,7.79,9.7v22.37s12.43,0,12.43,0v-22.37c0-14.51-8.12-21.94-20.21-21.94-12.09,0-20.21,7.34-20.21,21.94Z"
      />
      {/* Arche droite du m */}
      <path
        fill="url(#mark-grad)"
        d="M88.25,692.46v23.53s12.43,0,12.43,0v-22.37c0-6.82,3.15-9.7,7.79-9.7,4.64,0,7.79,2.88,7.79,9.7v22.37s12.43,0,12.43,0v-22.37c0-14.51-8.12-21.94-20.21-21.94-12.09,0-20.21,6.18-20.21,20.78Z"
      />
    </svg>
  );
}
