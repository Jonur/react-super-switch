import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "react-super-switch",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.esm.js" : "index.cjs.js"),
    },
    emptyOutDir: false,
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        exports: "named",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.unit.test.ts", "src/**/*.unit.test.tsx"],
    exclude: [
      "**/index.ts",
      "**/index.tsx",
      "**/constants.ts",
      "**/types.ts",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/node_modules/**",
    ],
    setupFiles: ["src/__specs__/setupTests.ts"],
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: [
        "**/*.unit.test.ts",
        "**/index.ts",
        "**/index.tsx",
        "**/constants.ts",
        "**/types.ts",
        "**/*.d.ts",
        "src/__specs__/**",
      ],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
});
