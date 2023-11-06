// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/main.scss'],
  ssr: true,
  
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