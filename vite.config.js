import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  base: "./",
  plugins: [react(), viteSingleFile()],
  build: { target: "es2020", assetsInlineLimit: 100 * 1024 * 1024 },
});
