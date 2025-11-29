import { useCookie } from '#app'

const API_URL = 'https://api.granula.raitokyokai.tech/'

export const useAuth = () => {
  const accessToken = useCookie('access_token')
  const refreshToken = useCookie('refresh_token')

  const logout = () => {
    accessToken.value = null
    refreshToken.value = null
    navigateTo('/auth/login')
  }

  const isAuthenticated = () => {
    return !!(accessToken.value || refreshToken.value)
  }

  const getUserData = async () => {
    try {
      const result = await $fetch(`${API_URL}api/v1/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`
        }
      })
      
      // API возвращает: id, email, name, avatar_url, phone, created_at, updated_at
      return result
    } catch (error) {
      console.error('Ошибка при загрузке данных пользователя:', error)
      throw error
    }
  }

  const updateProfile = async (data) => {
    try {
      const result = await $fetch(`${API_URL}api/v1/users/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: data
      })
      
      return result
    } catch (error) {
      console.error('Ошибка обновления профиля:', error)
      throw error
    }
  }

  const refreshTokens = async () => {
    try {
      const result = await $fetch(`${API_URL}api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          refresh_token: refreshToken.value
        }
      })
      
      const data = result.data || result
      
      if (data.access_token) {
        accessToken.value = data.access_token
        refreshToken.value = data.refresh_token
        return true
      }
      return false
    } catch (error) {
      console.error('Ошибка обновления токенов:', error)
      return false
    }
  }

  return {
    logout,
    isAuthenticated,
    getUserData,
    updateProfile,
    refreshTokens,
    accessToken,
    refreshToken,
    API_URL
  }
}
