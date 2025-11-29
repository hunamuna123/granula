export default defineNuxtRouteMiddleware((to) => {
  const accessToken = useCookie('access_token')
  const refreshToken = useCookie('refresh_token')

  // Если пользователь авторизован и пытается зайти на страницу логина/регистрации
  if ((accessToken.value || refreshToken.value) && to.path.startsWith('/auth/')) {
    return navigateTo('/panel')
  }
})
