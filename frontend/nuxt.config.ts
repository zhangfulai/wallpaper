export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@ant-design-vue/nuxt'],
  css: ['ant-design-vue/dist/reset.css'],
  devServer: {
    port: 5173,
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
