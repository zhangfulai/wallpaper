export const useAuth = () => {
  const token = useState<string>('token', () => {
    if (process.client) {
      return localStorage.getItem('token') || ''
    }
    return ''
  })

  const user = useState<User | null>('user', () => null)
  const isInit = useState<boolean>('authInit', () => false)

  const setToken = (value: string) => {
    token.value = value
    if (process.client) {
      localStorage.setItem('token', value)
    }
  }

  const setUser = (value: User) => {
    user.value = value
  }

  const clearAuth = () => {
    token.value = ''
    user.value = null
    isInit.value = false
    if (process.client) {
      localStorage.removeItem('token')
    }
  }

  // 初始化：有 token 时获取用户信息
  const initAuth = async () => {
    if (!process.client || isInit.value) return

    const savedToken = localStorage.getItem('token')
    if (!savedToken) {
      isInit.value = true
      return
    }

    token.value = savedToken
    try {
      const data: any = await $fetch('/auth/profile', {
        baseURL: '/api',
        headers: { Authorization: `Bearer ${savedToken}` },
      })
      user.value = data
    } catch {
      // token 失效，清除
      clearAuth()
    } finally {
      isInit.value = true
    }
  }

  return { token, user, isInit, setToken, setUser, clearAuth, initAuth }
}
