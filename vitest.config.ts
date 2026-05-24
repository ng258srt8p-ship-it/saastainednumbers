import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@/calculators": path.resolve(__dirname, "calculators"),
      "@/lib": path.resolve(__dirname, "lib"),
      "@/i18n": path.resolve(__dirname, "i18n"),
    },
  },
});
