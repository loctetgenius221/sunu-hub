import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { seo } from './seo.plugin.ts'

// https://vite.dev/config/
// Adresse publique du site (fichier .env, ou variable d'environnement de la plateforme d'hébergement).
const SITE_URL = process.env.VITE_SITE_URL || loadEnv('', process.cwd(), 'VITE_').VITE_SITE_URL || 'https://sunuhub.sn'

export default defineConfig({
  plugins: [
    vue(),
    // Plan du site et robots.txt, générés au build pour l'adresse publique du site.
    seo(SITE_URL),
    vueDevTools(),
    tailwindcss(),
    // Application installable et utilisable avec une connexion instable (TDR §7) :
    // le site est mis en cache à la première visite, les polices au premier usage.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'patterns/*.svg'],
      manifest: {
        name: 'SUNU HŪB',
        short_name: 'SUNU HŪB',
        description: 'La plateforme intelligente de la jeunesse sénégalaise : orientation, stages, bourses, concours et premiers emplois.',
        lang: 'fr',
        start_url: '/',
        display: 'standalone',
        theme_color: '#0c3470',
        background_color: '#ffffff',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: { cacheName: 'polices', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
