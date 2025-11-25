import { defineConfig } from "bumpp"
import { exec } from "tinyexec"

export default defineConfig({
  execute: (opts) => {
    const { newVersion } = opts.state
    exec("npm", ["run", "changelog", "--tag", `v${newVersion}`])
  },
  push: false,
  all: true,
  confirm: false,
})
