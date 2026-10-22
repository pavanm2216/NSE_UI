import { defineConfig } from "vitest/config";
import typescriptPlugin from './scripts/typescript-plugin';
import path from "path";

export default defineConfig({
  plugins: [typescriptPlugin()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    maxWorkers: 2,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
