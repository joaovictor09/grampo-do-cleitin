import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main/server.ts"],
  outDir: "build",
  format: ["esm"],
  target: "es2020",
  clean: true,
});
