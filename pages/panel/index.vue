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
  
  <div v-else-if="user" class="space-y-4 sm:space-y-6">
    <!-- Welcome banner -->
    <div class="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-xl sm:rounded-2xl p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">
            Добро пожаловать, {{ user.name || user.email }}!
          </h1>
          <p class="text-white/80 text-sm sm:text-base">
            Управляйте планировками, проверяйте соответствие нормам и общайтесь с AI ассистентом
          </p>
        </div>
        <div class="sm:flex-shrink-0">
          <NuxtLink to="/panel/workspaces">
            <Button label="Мои воркспейсы" icon="pi pi-folder" class="w-full sm:w-auto bg-white/20 hover:bg-white/30 border-none text-white text-sm" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Активный воркспейс -->
    <div v-if="currentWorkspace" class="bg-[#26272A] rounded-xl p-4 sm:p-6 border border-[#26272A]">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-[#2563EB]/20 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-semibold text-white">{{ currentWorkspace.name }}</h2>
            <p class="text-xs sm:text-sm text-gray-400">Активный воркспейс • {{ currentWorkspace.floor_plan_count || 0 }} планировок</p>
          </div>
        </div>
        <NuxtLink :to="`/panel/workspaces/${currentWorkspace.id}`">
          <Button label="Открыть" outlined size="small" class="border-[#26272A] text-white hover:bg-[#27272A]" />
        </NuxtLink>
      </div>
      
      <!-- Быстрые действия в воркспейсе -->
      <div class="grid grid-cols-2 gap-3">
        <NuxtLink :to="`/panel/plane/create?workspace=${currentWorkspace.id}`" class="block">
          <div class="bg-[#18181B] rounded-lg p-3 hover:bg-[#18181B]/80 transition-colors text-center">
            <svg class="w-5 h-5 text-[#2563EB] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="text-sm text-white">Новая планировка</span>
          </div>
        </NuxtLink>
        <NuxtLink :to="`/panel/workspaces/${currentWorkspace.id}`" class="block">
          <div class="bg-[#18181B] rounded-lg p-3 hover:bg-[#18181B]/80 transition-colors text-center">
            <svg class="w-5 h-5 text-purple-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span class="text-sm text-white">Все планировки</span>
          </div>
        </NuxtLink>
      </div>
    </div>
    
    <!-- Если нет воркспейса -->
    <div v-else class="bg-[#26272A] rounded-xl p-6 border border-[#26272A] text-center">
      <div class="w-16 h-16 bg-[#2563EB]/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-white mb-2">Создайте первый воркспейс</h3>
      <p class="text-gray-400 mb-4">Воркспейс — это рабочее пространство для ваших планировок</p>
      <NuxtLink to="/panel/workspaces/create">
        <Button label="Создать воркспейс" icon="pi pi-plus" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none" />
      </NuxtLink>
    </div>

    <!-- Quick actions -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <NuxtLink to="/panel/workspaces" class="block">
        <div class="bg-[#26272A] rounded-xl p-4 sm:p-5 border border-[#26272A] hover:border-[#2563EB]/50 transition-colors group h-full">
          <div class="w-10 h-10 bg-[#2563EB]/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#2563EB]/30 transition-colors">
            <svg class="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-white mb-1">Воркспейсы</h3>
          <p class="text-xs text-gray-400">Управление рабочими пространствами</p>
        </div>
      </NuxtLink>

      <NuxtLink to="/panel/ai-chat" class="block">
        <div class="bg-[#26272A] rounded-xl p-4 sm:p-5 border border-[#26272A] hover:border-purple-500/50 transition-colors group h-full">
          <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-purple-500/30 transition-colors">
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-white mb-1">AI Ассистент</h3>
          <p class="text-xs text-gray-400">Консультации по планировкам</p>
        </div>
      </NuxtLink>

      <NuxtLink to="/panel/requests" class="block">
        <div class="bg-[#26272A] rounded-xl p-4 sm:p-5 border border-[#26272A] hover:border-amber-500/50 transition-colors group h-full">
          <div class="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-amber-500/30 transition-colors">
            <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-white mb-1">Заявки</h3>
          <p class="text-xs text-gray-400">Заявки на услуги БТИ</p>
        </div>
      </NuxtLink>

      <NuxtLink to="/panel/compliance" class="block">
        <div class="bg-[#26272A] rounded-xl p-4 sm:p-5 border border-[#26272A] hover:border-green-500/50 transition-colors group h-full">
          <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-500/30 transition-colors">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 class="text-base font-semibold text-white mb-1">Проверка норм</h3>
          <p class="text-xs text-gray-400">Соответствие СНиП и ЖК РФ</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Последние планировки -->
    <div v-if="recentPlans.length > 0" class="bg-[#26272A] rounded-xl border border-[#26272A]">
      <div class="p-4 border-b border-[#18181B] flex items-center justify-between">
        <h3 class="text-lg font-semibold text-white">Последние планировки</h3>
        <NuxtLink v-if="currentWorkspace" :to="`/panel/workspaces/${currentWorkspace.id}`">
          <Button label="Все" text size="small" class="text-[#2563EB]" />
        </NuxtLink>
      </div>
      <div class="divide-y divide-[#18181B]">
        <div 
          v-for="plan in recentPlans" 
          :key="plan.id"
          class="p-4 hover:bg-[#18181B]/50 transition-colors cursor-pointer"
          @click="$router.push(`/panel/plane/${plan.id}`)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-[#18181B] rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <div class="font-medium text-white">{{ plan.name }}</div>
                <div class="text-sm text-gray-400">{{ formatDate(plan.updated_at || plan.created_at) }}</div>
              </div>
            </div>
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
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
      currentWorkspace: null,
      recentPlans: [],
      loading: true,
      error: null,
      apiStore: null
    }
  },
  created() {
    this.apiStore = useApiStore()
    this.accessTokenCookie = useCookie('access_token')
    this.workspaceIdCookie = useCookie('workspace_id')
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        this.error = null
        
        // Load user data
        const userResult = await $fetch(`${this.apiStore.url}api/v1/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`
          }
        })
        this.user = userResult.data || userResult

        // Load current workspace if exists
        if (this.workspaceIdCookie.value) {
          try {
            const workspaceResult = await $fetch(`${this.apiStore.url}api/v1/workspaces/${this.workspaceIdCookie.value}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${this.accessTokenCookie.value}`
              }
            })
            this.currentWorkspace = workspaceResult.data || workspaceResult

            // Load recent floor plans
            const plansResult = await $fetch(`${this.apiStore.url}api/v1/floor-plans?workspace_id=${this.workspaceIdCookie.value}&limit=5`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${this.accessTokenCookie.value}`
              }
            })
            this.recentPlans = plansResult.data?.items || plansResult.floor_plans || plansResult.data || []
            if (!Array.isArray(this.recentPlans)) this.recentPlans = []
          } catch (e) {
            // Workspace might not exist anymore
            this.workspaceIdCookie.value = null
          }
        }
      } catch (error) {
        this.error = error.message || 'Произошла ошибка при загрузке данных'
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short'
      })
    }
  }
}
</script>
