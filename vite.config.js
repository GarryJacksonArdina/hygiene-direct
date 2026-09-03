import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// PREVIEW_SINGLEFILE=1 builds one self contained HTML file (hash routing, mocked
// API) for sharing a clickable preview without a server. Normal builds ignore it.
const preview = process.env.PREVIEW_SINGLEFILE === '1'

export default defineConfig({
  base: preview ? './' : '/',
  define: { 'import.meta.env.VITE_PREVIEW_MOCK': JSON.stringify(preview ? '1' : '') },
  plugins: [react(), tailwindcss(), ...(preview ? [viteSingleFile()] : [])],
  build: preview ? { outDir: 'dist-preview', emptyOutDir: true } : {},
})
