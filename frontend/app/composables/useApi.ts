import { message } from 'ant-design-vue'

export const useApi = () => {
  const { token, clearAuth } = useAuth()

  const request = async (url: string, options: any = {}) => {
    const headers: any = {
      ...(options.headers || {}),
    }

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    if (options.body instanceof FormData) {
      delete headers['Content-Type']
    }

    try {
      const res: any = await $fetch(url, {
        baseURL: '/api',
        ...options,
        headers,
        onResponseError({ response }) {
          const data = response._data
          let msg = data?.message || '请求失败'
          if (Array.isArray(msg)) msg = msg.join('；')
          message.error(msg)

          if (response.status === 401) {
            clearAuth()
            navigateTo('/login')
          }
        },
      })
      return res
    } catch (err: any) {
      throw err
    }
  }

  const get = (url: string, params?: any) => request(url, { method: 'GET', params })
  const post = (url: string, body?: any) => request(url, { method: 'POST', body })
  const patch = (url: string, body?: any) => request(url, { method: 'PATCH', body })
  const del = (url: string) => request(url, { method: 'DELETE' })

  return { get, post, patch, del }
}
