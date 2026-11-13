import { defineConfig } from 'vite'

// base './' permite publicar en GitHub Pages sin importar el nombre del repo
export default defineConfig({
  base: './',
  esbuild: { jsx: 'automatic' },
})
