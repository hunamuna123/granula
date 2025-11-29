<template>
  <div v-if="loading">
    <SkeletonHome />
  </div>
  
  <div v-else-if="error" class="min-h-screen">
    <div class="mx-auto">
      <div class="bg-[#18181B] border border-[#26272A] rounded-xl p-6">
        <h1 class="text-2xl font-bold text-white mb-6">Главная страница</h1>
        <div class="bg-red-900/20 border border-red-500/20 rounded-lg p-4 mb-4">
          <p class="text-red-400">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else-if="user" class="space-y-6">
    <!-- Welcome banner -->
    <div class="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-xl p-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white mb-2">
            Добро пожаловать, {{ user.name || user.email }}!
          </h1>
          <p class="text-white/80">
            Управляйте планировками, проверяйте соответствие нормам и общайтесь с AI ассистентом
          </p>
        </div>
        <div class="hidden md:block">
          <NuxtLink to="/panel/plane/create">
            <Button label="Создать планировку" icon="pi pi-plus" class="bg-white/20 hover:bg-white/30 border-none text-white" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <NuxtLink to="/panel/plane/create" class="block">
        <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A] hover:border-[#2563EB]/50 transition-colors group">
          <div class="w-12 h-12 bg-[#2563EB]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2563EB]/30 transition-colors">
            <svg class="w-6 h-6 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Создать планировку</h3>
          <p class="text-sm text-gray-400">Загрузите план квартиры для автоматической оцифровки</p>
        </div>
      </NuxtLink>

      <NuxtLink to="/panel/ai-chat" class="block">
        <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A] hover:border-[#2563EB]/50 transition-colors group">
          <div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
            <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">AI Ассистент</h3>
          <p class="text-sm text-gray-400">Задайте вопрос или получите рекомендации по планировке</p>
        </div>
      </NuxtLink>

      <NuxtLink to="/panel/compliance" class="block">
        <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A] hover:border-[#2563EB]/50 transition-colors group">
          <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Проверить нормы</h3>
          <p class="text-sm text-gray-400">Автоматическая проверка на соответствие СНиП</p>
        </div>
      </NuxtLink>
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
    }
  }
}
</script>
