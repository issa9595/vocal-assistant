import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    // Tests unitaires de logique pure : pas besoin de DOM.
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "coverage",
      include: ["src/lib/**"],
      exclude: ["**/*.d.ts"],
    },
  },
  resolve: {
    alias: {
      // Miroir de l'alias "@/*" -> "src/*" du tsconfig.json.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
