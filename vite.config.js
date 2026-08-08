import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built site works from any subpath, including the
  // GitHub Pages project URL (/Den-Calendar-Composer/).
  base: './',
  plugins: [svelte()],
})
