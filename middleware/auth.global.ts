import { api as useApiStore } from '@/store/api'

export default defineNuxtRouteMiddleware(async (to) => {
  // Access Token - 15 минут
  const accessToken = useCookie('access_token', { maxAge: 60 * 15 })
  // Refresh Token - 7 дней
  const refreshToken = useCookie('refresh_token', { maxAge: 60 * 60 * 24 * 7 })

  const isProtectedRoute = to.path.startsWith('/panel')
  const isAuthPage = to.path.startsWith('/auth/')

  // Редирект с auth страниц если авторизован
  if (isAuthPage && accessToken.value) {
    return navigateTo('/panel')
  }

  // Для незащищённых роутов - пропускаем
  if (!isProtectedRoute) {
    return
  }

  // Нет токенов - на логин
  if (!accessToken.value && !refreshToken.value) {
    return navigateTo('/auth/login')
  }

  // Если нет access но есть refresh - обновляем
  if (!accessToken.value && refreshToken.value) {
    try {
      const apiStore = useApiStore()
      
      const data = await $fetch(`${apiStore.url}api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { refresh_token: refreshToken.value }
      })

      const result = (data as any).data || data
      
      if (result.access_token) {
        accessToken.value = result.access_token
        if (result.refresh_token) {
          refreshToken.value = result.refresh_token
        }
        return
      }
    } catch (error) {
      console.error('Ошибка обновления токена:', error)
      accessToken.value = null
      refreshToken.value = null
      return navigateTo('/auth/login')
    }
  }
})
