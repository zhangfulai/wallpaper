export const useAuth = () => {
  const token = useState<string>('token', () => {
    if (process.client) {
      return localStorage.getItem('token') || ''
    }
    return ''
  })

  const user = useState<User | null>('user', () => null)

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
    if (process.client) {
      localStorage.removeItem('token')
    }
  }

  return { token, user, setToken, setUser, clearAuth }
}
