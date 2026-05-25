export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return

  const { token } = useAuth()

  if (to.path !== '/login' && !token.value) {
    return navigateTo('/login')
  }

  if (to.path === '/login' && token.value) {
    return navigateTo('/dashboard')
  }
})
