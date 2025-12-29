import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Library build config
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "react-super-switch",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.esm.js" : "index.cjs.js"),
    },
    rollupOptions: {
      // Don't bundle peer dependencies
      external: ["react", "react-dom"],
      output: {
        // Ensure named exports in bundles to avoid `.default` accessors
        exports: "named",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
