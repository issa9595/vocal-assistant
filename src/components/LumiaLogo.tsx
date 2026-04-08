interface LumiaLogoProps {
  className?: string;
  height?: number;
}

const PATHS = {
  L: "M59.72,753.51h4.09v19.74h-4.09v-19.74Z",
  u: "M66.42,766.69v-7.12h3.78v7.12c0,2.17.96,3.09,2.37,3.09s2.37-.92,2.37-3.09v-7.12h3.78v7.12c0,4.61-2.47,6.98-6.15,6.98s-6.15-2.33-6.15-6.98Z",
  m1: "M89.1,766.1v7.11s3.87,0,3.87,0v-7.11c0-2.17.98-3.08,2.43-3.08s2.43.92,2.43,3.08v7.11s3.87,0,3.87,0v-7.11c0-4.61-2.53-6.97-6.3-6.98s-6.3,2.33-6.3,6.97Z",
  m2: "M80.39,766.1v7.11s3.87,0,3.87,0v-7.11c0-2.17.98-3.08,2.43-3.08s2.43.92,2.43,3.08v7.11s3.87,0,3.87,0v-7.11c0-4.61-2.53-6.97-6.3-6.98-3.77,0-6.3,2.33-6.3,6.97Z",
  iDot: "M106.35,758.31s.02,0,.02,0c1.37-.12,2.37-1.2,2.37-2.65,0-1.53-1.12-2.67-2.62-2.67-1.32,0-2.34.88-2.57,2.13,0,0,0,0,0,.01-.19,1.43-.22,1.58-.66,2.12-.24.29,2.24,1.18,3.47,1.05Z",
  a: "M109.96,766.61c0-4.42,3-7.39,7.28-7.39s7.17,2.86,7.17,7.37v6.73h-3.76v-2.28c-.71,1.7-2.24,2.64-4.17,2.64-3,0-6.51-2.28-6.51-7.06ZM120.32,766.45c0-1.97-1.25-3.34-3.11-3.34s-3.11,1.36-3.11,3.34,1.25,3.34,3.11,3.34,3.11-1.36,3.11-3.34Z",
};

export default function LumiaLogo({ className = "", height = 28 }: LumiaLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="59 749 70 28"
      height={height}
      aria-label="Lumia"
      className={className}
    >
      <defs>
        {/* Gradient qui balaye de gauche à droite */}
        <linearGradient id="lg-sweep" x1="-70" y1="0" x2="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#efb4c8" stopOpacity="0" />
          <stop offset="0.3" stopColor="#efb4c8" />
          <stop offset="0.7" stopColor="#f8cebd" />
          <stop offset="1" stopColor="#f8cebd" stopOpacity="0" />
          <animate attributeName="x1" from="-70" to="129" dur="2.5s" fill="freeze" begin="0.3s" />
          <animate attributeName="x2" from="0" to="199" dur="2.5s" fill="freeze" begin="0.3s" />
        </linearGradient>

        {/* Clip path = formes du texte */}
        <clipPath id="lg-clip">
          <path d={PATHS.L} />
          <path d={PATHS.u} />
          <path d={PATHS.m1} />
          <path d={PATHS.m2} />
          <rect x="104.07" y="759.58" width="4.09" height="13.73" />
          <path d={PATHS.iDot} />
          <path d={PATHS.a} />
        </clipPath>
      </defs>

      {/* Logo noir de base */}
      <g fill="#3d3d3d">
        <path d={PATHS.L} />
        <path d={PATHS.u} />
        <path d={PATHS.m1} />
        <path d={PATHS.m2} />
        <rect x="104.07" y="759.58" width="4.09" height="13.73" />
        <path d={PATHS.iDot} />
        <path d={PATHS.a} />
      </g>

      {/* Overlay dégradé animé, clippé sur les formes du texte */}
      <rect
        x="59" y="749" width="70" height="28"
        fill="url(#lg-sweep)"
        clipPath="url(#lg-clip)"
        style={{ animation: "lumia-sweep-fade 3.2s ease-out forwards 0.3s", opacity: 0 }}
      />

      <style>{`
        @keyframes lumia-sweep-fade {
          0%   { opacity: 1; }
          75%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </svg>
  );
}
