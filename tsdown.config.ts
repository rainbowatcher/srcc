import { defineConfig } from "tsdown"

export default defineConfig({
  entry: "src/extension.ts",
  outDir: "dist",
  minify: true,
  clean: true,
  external: ["vscode"],
  platform: "node",
  format: "cjs"
})