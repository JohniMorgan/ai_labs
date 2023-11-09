// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/main.scss'],
  ssr: false,
  app: {
    buildAssetsDir: 'assets',
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/_colors.scss" as *;'
        }
      }
    },
  },
  
  experimental: {
    renderJsonPayloads: false
  },

  modules: ['@invictus.codes/nuxt-vuetify', '@pinia/nuxt']
})