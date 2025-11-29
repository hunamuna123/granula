import tailwindcss from "@tailwindcss/vite";
import Aura from '@primeuix/themes/aura';
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: [
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    '@tresjs/nuxt'
  ],
  primevue: {
    options: {
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.p-dark'
        }
      }
    }
  },
  app: {
    head: {
      htmlAttrs: {
        class: 'p-dark'
      },
      title: 'Гранула - 3D планировка квартир с проверкой норм',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Превратите план квартиры в 3D модель для законной перепланировки. Автоматическое распознавание планов, проверка норм СНиП и Жилищного кодекса РФ.' },
        { name: 'keywords', content: 'перепланировка квартиры, 3D планировка, распознавание планов, проверка норм, БТИ, СНиП, планировка квартиры' },
        { name: 'author', content: 'Гранула' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: 'Гранула - 3D планировка квартир с проверкой норм' },
        { property: 'og:description', content: 'Превратите план квартиры в 3D модель для законной перепланировки. Автоматическое распознавание планов, проверка норм СНиП и Жилищного кодекса РФ.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Гранула' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Гранула - 3D планировка квартир с проверкой норм' },
        { name: 'twitter:description', content: 'Превратите план квартиры в 3D модель для законной перепланировки.' },
        { name: 'theme-color', content: '#2563EB' },
        { name: 'msapplication-TileColor', content: '#2563EB' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'Гранула' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/icon-192.png' },
        { rel: 'manifest', href: '/manifest.json' }
      ]
    }
  },
  vite: {
    plugins: [
      tailwindcss({
        config: './tailwind.config.js'
      }),
    ],
  },
  nitro: {
    compressPublicAssets: true,
    minify: true
  },
  experimental: {
    payloadExtraction: false
  }
});