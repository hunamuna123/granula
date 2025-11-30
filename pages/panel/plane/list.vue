<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Требуется выбрать воркспейс -->
    <div v-if="!hasWorkspace" class="text-center py-8 sm:py-12">
      <div class="max-w-md mx-auto px-4">
        <div class="w-16 h-16 sm:w-20 sm:h-20 bg-[#2563EB]/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <svg class="w-8 h-8 sm:w-10 sm:h-10 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">Выберите рабочее пространство</h2>
        <p class="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">
          Для работы с планировками необходимо сначала создать или выбрать рабочее пространство
        </p>
        <NuxtLink to="/panel/workspaces">
          <Button label="Перейти к воркспейсам" icon="pi pi-arrow-right" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none text-sm" />
        </NuxtLink>
      </div>
    </div>

    <template v-else>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Мои планировки</h1>
          <p class="text-sm sm:text-base text-gray-400">
            <NuxtLink v-if="workspaceName" :to="`/panel/workspaces/${workspaceIdCookie.value}`" class="text-[#2563EB] hover:underline">
              {{ workspaceName }}
            </NuxtLink>
          </p>
        </div>
        <NuxtLink to="/panel/plane/create" class="sm:flex-shrink-0">
          <Button label="Создать планировку" icon="pi pi-plus" class="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1d4ed8] border-none text-sm" />
        </NuxtLink>
      </div>

      <!-- Поиск -->
      <div class="flex gap-4">
        <div class="flex-1">
          <InputText 
            v-model="searchQuery" 
            placeholder="Поиск по названию..."
            class="w-full bg-[#26272A] border-[#26272A] text-white"
          />
        </div>
      </div>

      <!-- Список планировок -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div v-for="i in 6" :key="i" class="bg-[#26272A] rounded-xl p-4 sm:p-6 border border-[#26272A] animate-pulse">
          <div class="h-36 sm:h-48 bg-[#18181B] rounded-lg mb-3 sm:mb-4"></div>
          <div class="h-4 bg-[#18181B] rounded mb-2"></div>
          <div class="h-4 bg-[#18181B] rounded w-2/3"></div>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-900/20 border border-red-500/20 rounded-xl p-6 text-center">
        <p class="text-red-400 mb-4">{{ error }}</p>
        <Button label="Повторить" icon="pi pi-refresh" @click="loadPlans" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none" />
      </div>

      <div v-else-if="filteredPlans.length === 0" class="text-center py-8 sm:py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h3 class="text-lg sm:text-xl font-semibold text-white mb-2">Нет планировок</h3>
        <p class="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 px-4">Создайте свою первую планировку</p>
        <NuxtLink to="/panel/plane/create">
          <Button label="Создать планировку" icon="pi pi-plus" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none text-sm" />
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div 
          v-for="plan in filteredPlans" 
          :key="plan.id"
          class="bg-[#26272A] rounded-xl border border-[#26272A] hover:border-[#2563EB] transition-all cursor-pointer overflow-hidden group"
          @click="navigateToPlan(plan.id)"
        >
          <!-- Preview изображение -->
          <div class="relative h-36 sm:h-48 bg-[#18181B] overflow-hidden">
            <img 
              v-if="plan.preview_url || plan.image_url" 
              :src="plan.preview_url || plan.image_url" 
              :alt="plan.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="absolute inset-0 flex items-center justify-center">
              <svg class="w-16 h-16 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-[#2563EB]/0 group-hover:bg-[#2563EB]/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span class="text-white font-medium bg-[#2563EB] px-4 py-2 rounded-lg">Открыть</span>
            </div>
          </div>

          <!-- Контент -->
          <div class="p-3 sm:p-4">
            <h3 class="text-base sm:text-lg font-semibold text-white mb-2 truncate">{{ plan.name }}</h3>
            
            <div class="flex items-center justify-between text-xs sm:text-sm text-gray-400">
              <div v-if="plan.area" class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>{{ plan.area }} м²</span>
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ formatDate(plan.updated_at || plan.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Пагинация -->
      <div v-if="pagination && pagination.total_pages > 1" class="flex justify-center gap-2 mt-6">
        <Button 
          icon="pi pi-chevron-left" 
          outlined
          size="small"
          :disabled="!pagination.page || pagination.page <= 1"
          class="border-[#26272A] text-white"
          @click="loadPlans(pagination.page - 1)"
        />
        <span class="px-4 py-2 text-gray-400">
          {{ pagination.page || 1 }} / {{ pagination.total_pages }}
        </span>
        <Button 
          icon="pi pi-chevron-right" 
          outlined
          size="small"
          :disabled="pagination.page >= pagination.total_pages"
          class="border-[#26272A] text-white"
          @click="loadPlans(pagination.page + 1)"
        />
      </div>

      <!-- Диалог удаления -->
      <Dialog 
        v-model:visible="deleteDialog" 
        modal 
        header="Удаление планировки"
        :style="{ width: '90vw', maxWidth: '400px' }"
        class="p-fluid"
      >
        <p class="text-white mb-4">Вы уверены, что хотите удалить планировку "{{ planToDelete?.name }}"?</p>
        <p class="text-gray-400 text-sm mb-6">Это действие нельзя отменить.</p>
        <div class="flex gap-3 justify-end">
          <Button label="Отмена" outlined class="border-[#26272A] text-white hover:bg-[#27272A]" @click="deleteDialog = false" />
          <Button label="Удалить" severity="danger" class="border-none" :loading="deleting" @click="deletePlan" />
        </div>
      </Dialog>
    </template>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'panel'
})
</script>

<script>
import { useCookie } from "#app"
import { api as useApiStore } from '@/store/api'

export default {
  data() {
    return {
      floorPlans: [],
      searchQuery: '',
      loading: false,
      error: null,
      deleteDialog: false,
      planToDelete: null,
      deleting: false,
      apiStore: null,
      pagination: null,
      workspaceName: ''
    }
  },
  created() {
    this.apiStore = useApiStore()
    this.accessTokenCookie = useCookie('access_token')
    this.workspaceIdCookie = useCookie('workspace_id')
  },
  computed: {
    hasWorkspace() {
      return !!this.workspaceIdCookie?.value
    },
    filteredPlans() {
      let result = this.floorPlans

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(plan => 
          plan.name?.toLowerCase().includes(query) ||
          plan.description?.toLowerCase().includes(query)
        )
      }

      return result
    }
  },
  async mounted() {
    if (this.hasWorkspace) {
      await Promise.all([this.loadPlans(), this.loadWorkspaceName()])
    }
  },
  methods: {
    async loadWorkspaceName() {
      try {
        const result = await $fetch(`${this.apiStore.url}api/v1/workspaces/${this.workspaceIdCookie.value}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`
          }
        })
        const workspace = result.data || result
        this.workspaceName = workspace.name || ''
      } catch (e) {
        console.log('Could not load workspace name')
      }
    },
    async loadPlans(page = 1) {
      this.loading = true
      this.error = null
      
      try {
        const params = new URLSearchParams()
        
        if (this.workspaceIdCookie.value) {
          params.append('workspace_id', this.workspaceIdCookie.value)
        }
        
        params.append('page', page)
        params.append('limit', 20)
        
        let url = `${this.apiStore.url}api/v1/floor-plans`
        const queryString = params.toString()
        if (queryString) {
          url += `?${queryString}`
        }
        
        const result = await $fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          }
        })
        
        // API возвращает { data: { items: [...], total: N }, pagination: {...} }
        this.floorPlans = result.data?.items || result.floor_plans || result.data || []
        if (!Array.isArray(this.floorPlans)) this.floorPlans = []
        this.pagination = result.pagination || null
      } catch (error) {
        this.error = error.message || 'Ошибка загрузки планировок'
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    navigateToPlan(id) {
      this.$router.push(`/panel/plane/${id}`)
    },
    confirmDelete(plan) {
      this.planToDelete = plan
      this.deleteDialog = true
    },
    async deletePlan() {
      if (!this.planToDelete) return
      
      this.deleting = true
      try {
        let url = `${this.apiStore.url}api/v1/floor-plans/${this.planToDelete.id}`
        
        await $fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          }
        })
        
        this.floorPlans = this.floorPlans.filter(p => p.id !== this.planToDelete.id)
        this.deleteDialog = false
        this.planToDelete = null
      } catch (error) {
        console.error('Ошибка удаления:', error)
      } finally {
        this.deleting = false
      }
    }
  }
}
</script>

<style scoped>
:deep(.p-inputtext) {
  background-color: #26272A !important;
  border-color: #26272A !important;
  color: white !important;
}

:deep(.p-inputtext::placeholder) {
  color: #717177 !important;
}
</style>
