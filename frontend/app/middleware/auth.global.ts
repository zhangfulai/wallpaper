export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  const { token, isInit, initAuth } = useAuth()

  // 首次加载时初始化认证状态
  if (!isInit.value) {
    await initAuth()
  }

  if (to.path !== '/login' && !token.value) {
    return navigateTo('/login')
  }

  if (to.path === '/login' && token.value) {
    return navigateTo('/dashboard')
  }
})
