import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  server: {
    port: 5174,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        issue: resolve(__dirname, "issue.html"),
        validate: resolve(__dirname, "validate.html"),
      },
    },
  },
});
