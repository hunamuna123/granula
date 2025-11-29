<template>
  <div v-if="loading">
    <SkeletonProfile />
  </div>

  <div v-else-if="error" class="min-h-screen p-2">
    <div class="mx-auto">
      <div class="bg-[#18181B] border border-[#26272A] rounded-xl p-6">
        <h1 class="text-2xl font-bold text-white mb-6">Профиль</h1>
        <div class="bg-red-900/20 border border-red-500/20 rounded-lg p-4 mb-4">
          <p class="text-red-400">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="user" class="min-h-screen p-2">
    <div class="mx-auto">
  
      <!-- Header с аватаром -->
      <div class="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-xl p-6 mb-6">
        <div class="flex items-center space-x-4">
          <div v-if="user.avatar_url" class="w-16 h-16 rounded-full overflow-hidden">
            <img :src="user.avatar_url" :alt="user.name" class="w-full h-full object-cover" />
          </div>
          <div v-else class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <span class="text-2xl font-bold text-white">
              {{ user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white">{{ user.name || 'Пользователь' }}</h1>
            <p class="text-white/80">{{ user.email }}</p>
          </div>
        </div>
      </div>

      <!-- Основная информация -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-[#18181B] border border-[#26272A] rounded-xl p-6">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-[#2563EB]/20 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-white">Основная информация</h2>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-[#26272A] rounded-lg">
              <div class="flex items-center">
                <svg class="w-4 h-4 text-[#717177] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                  </path>
                </svg>
                <span class="text-gray-300">Email</span>
              </div>
              <span class="text-white font-medium">{{ user.email }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-[#26272A] rounded-lg">
              <div class="flex items-center">
                <svg class="w-4 h-4 text-[#717177] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="text-gray-300">Имя</span>
              </div>
              <span class="text-white font-medium">{{ user.name || 'Не указано' }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-[#26272A] rounded-lg">
              <div class="flex items-center">
                <svg class="w-4 h-4 text-[#717177] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span class="text-gray-300">Телефон</span>
              </div>
              <span class="text-white font-medium">{{ user.phone || 'Не указан' }}</span>
            </div>
          </div>
        </div>

        <!-- Даты -->
        <div class="bg-[#18181B] border border-[#26272A] rounded-xl p-6">
          <div class="flex items-center mb-4">
            <div class="w-10 h-10 bg-[#2563EB]/20 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-white">Даты</h2>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-[#26272A] rounded-lg">
              <div class="flex items-center">
                <svg class="w-4 h-4 text-[#717177] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-300">Дата регистрации</span>
              </div>
              <span class="text-white font-medium">{{ formatDate(user.created_at) }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-[#26272A] rounded-lg">
              <div class="flex items-center">
                <svg class="w-4 h-4 text-[#717177] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span class="text-gray-300">Последнее обновление</span>
              </div>
              <span class="text-white font-medium">{{ formatDate(user.updated_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Выход -->
      <div class="bg-[#18181B] border border-[#26272A] rounded-xl p-6">
        <Button 
          label="Выйти из аккаунта" 
          severity="danger"
          outlined
          @click="handleLogout"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'panel'
})
</script>

<script>
import { useCookie } from '#app'
import { api as useApiStore } from '@/store/api'

export default {
  data() {
    return {
      user: null,
      loading: true,
      error: null,
      apiStore: null
    }
  },
  created() {
    this.apiStore = useApiStore()
    this.accessTokenCookie = useCookie('access_token')
    this.refreshTokenCookie = useCookie('refresh_token')
  },
  async mounted() {
    await this.loadUserData()
  },
  methods: {
    async loadUserData() {
      try {
        this.loading = true
        this.error = null
        
        const result = await $fetch(`${this.apiStore.url}api/v1/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`
          }
        })
        
        // API возвращает данные в поле data
        this.user = result.data || result
      } catch (error) {
        this.error = error.message || 'Произошла ошибка при загрузке данных'
      } finally {
        this.loading = false
      }
    },
    handleLogout() {
      this.accessTokenCookie.value = null
      this.refreshTokenCookie.value = null
      this.$router.push('/auth/login')
    },
    formatDate(timestamp) {
      if (!timestamp) return 'Не указано'
      // API возвращает Unix timestamp в секундах
      const date = typeof timestamp === 'number' 
        ? new Date(timestamp * 1000) 
        : new Date(timestamp)
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }
  }
}
</script>
