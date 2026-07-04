import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Règle stylistique : les apostrophes du texte français (l', d', n'…)
      // sont valides en JSX — les échapper en &apos; nuit à la lisibilité.
      "react/no-unescaped-entities": "off",
      // Passé en warning (non bloquant en CI) : le refactoring de ces
      // composants (setState dans useEffect) est suivi comme dette technique,
      // hors du périmètre du module DevOps.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
