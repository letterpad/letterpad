import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ["src/**/*@(ts|tsx)"],
    format: ["esm"],
    sourcemap: false,
    clean: false,
    external: ["react", "react-dom", "next-auth"],
    dts: true,
    treeshake: true,
})