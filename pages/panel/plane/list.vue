<template>
  <div class="space-y-6">
    <!-- Требуется выбрать воркспейс -->
    <div v-if="!hasWorkspace" class="text-center py-12">
      <div class="max-w-md mx-auto">
        <div class="w-20 h-20 bg-[#2563EB]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-3">Выберите рабочее пространство</h2>
        <p class="text-gray-400 mb-6">
          Для работы с планировками необходимо сначала создать или выбрать рабочее пространство
        </p>
        <NuxtLink to="/panel/workspaces">
          <Button label="Перейти к воркспейсам" icon="pi pi-arrow-right" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none" />
        </NuxtLink>
      </div>
    </div>

    <template v-else>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white mb-2">Мои планировки</h1>
          <p class="text-gray-400">Управляйте своими планировками квартир</p>
        </div>
        <NuxtLink to="/panel/plane/create">
          <Button label="Создать планировку" icon="pi pi-plus" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none" />
        </NuxtLink>
      </div>

      <!-- Фильтры и поиск -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <InputText 
          v-model="searchQuery" 
          placeholder="Поиск по названию..."
          class="w-full bg-[#26272A] border-[#26272A] text-white"
        />
      </div>
      <Dropdown 
        v-model="selectedStatus" 
        :options="statusOptions" 
        optionLabel="label"
        optionValue="value"
        placeholder="Все статусы"
        class="w-full sm:w-[200px] bg-[#26272A] border-[#26272A] text-white"
      />
    </div>

    <!-- Список планировок -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="bg-[#26272A] rounded-xl p-6 border border-[#26272A] animate-pulse">
        <div class="h-48 bg-[#18181B] rounded-lg mb-4"></div>
        <div class="h-4 bg-[#18181B] rounded mb-2"></div>
        <div class="h-4 bg-[#18181B] rounded w-2/3"></div>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-900/20 border border-red-500/20 rounded-xl p-6 text-center">
      <p class="text-red-400 mb-4">{{ error }}</p>
      <Button label="Повторить" icon="pi pi-refresh" @click="loadPlans" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none" />
    </div>

    <div v-else-if="filteredPlans.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">Нет планировок</h3>
      <p class="text-gray-400 mb-6">Создайте свою первую планировку</p>
      <NuxtLink to="/panel/plane/create">
        <Button label="Создать планировку" icon="pi pi-plus" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none" />
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="plan in filteredPlans" 
        :key="plan.id"
        class="bg-[#26272A] rounded-xl border border-[#26272A] hover:border-[#2563EB] transition-all cursor-pointer overflow-hidden group"
        @click="navigateToPlan(plan.id)"
      >
        <!-- Preview изображение -->
        <div class="relative h-48 bg-[#18181B] overflow-hidden">
          <img 
            v-if="plan.preview_url" 
            :src="plan.preview_url" 
            :alt="plan.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="absolute inset-0 flex items-center justify-center">
            <svg class="w-20 h-20 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <!-- Статус badge -->
          <div class="absolute top-3 right-3">
            <span :class="[
              'px-3 py-1 rounded-full text-xs font-medium',
              getStatusClass(plan.status)
            ]">
              {{ getStatusLabel(plan.status) }}
            </span>
          </div>
          <!-- Hover overlay -->
          <div class="absolute inset-0 bg-[#2563EB]/0 group-hover:bg-[#2563EB]/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span class="text-white font-medium">Открыть</span>
          </div>
        </div>

        <!-- Контент -->
        <div class="p-4">
          <h3 class="text-lg font-semibold text-white mb-2 truncate">{{ plan.name }}</h3>
          <p class="text-sm text-gray-400 mb-4 line-clamp-2">{{ plan.description || 'Без описания' }}</p>
          
          <div class="flex items-center justify-between text-sm text-gray-400 mb-4">
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
              <span>{{ formatDate(plan.updated_at) }}</span>
            </div>
          </div>

          <!-- Действия -->
          <div class="flex gap-2">
            <Button 
              label="Открыть" 
              icon="pi pi-eye" 
              outlined 
              size="small"
              class="flex-1 border-[#26272A] text-white hover:bg-[#27272A]"
              @click.stop="navigateToPlan(plan.id)"
            />
            <Button 
              icon="pi pi-trash" 
              outlined 
              severity="danger"
              size="small"
              class="border-[#26272A] text-red-400 hover:bg-red-500/20"
              @click.stop="confirmDelete(plan)"
            />
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
        :style="{ width: '400px' }"
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
      selectedStatus: null,
      loading: false,
      error: null,
      deleteDialog: false,
      planToDelete: null,
      deleting: false,
      apiStore: null,
      pagination: null,
      statusOptions: [
        { label: 'Все статусы', value: null },
        { label: 'Черновик', value: 'draft' },
        { label: 'Загружено', value: 'uploaded' },
        { label: 'Обработка', value: 'processing' },
        { label: 'Обработано', value: 'processed' },
        { label: 'В работе', value: 'in_progress' },
        { label: 'Завершено', value: 'completed' },
        { label: 'Ошибка', value: 'error' }
      ],
      statusClasses: {
        uploaded: 'bg-gray-500/20 text-gray-400',
        processing: 'bg-blue-500/20 text-blue-400',
        processed: 'bg-green-500/20 text-green-400',
        error: 'bg-red-500/20 text-red-400',
        draft: 'bg-yellow-500/20 text-yellow-400',
        in_progress: 'bg-blue-500/20 text-blue-400',
        completed: 'bg-green-500/20 text-green-400'
      },
      statusLabels: {
        uploaded: 'Загружено',
        processing: 'Обработка',
        processed: 'Обработано',
        error: 'Ошибка',
        draft: 'Черновик',
        in_progress: 'В работе',
        completed: 'Завершено'
      }
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
          plan.name.toLowerCase().includes(query) ||
          plan.description?.toLowerCase().includes(query)
        )
      }

      if (this.selectedStatus) {
        result = result.filter(plan => plan.status === this.selectedStatus)
      }

      return result
    }
  },
  async mounted() {
    if (this.hasWorkspace) {
      await this.loadPlans()
    }
  },
  watch: {
    selectedStatus() {
      this.loadPlans()
    }
  },
  methods: {
    async loadPlans(page = 1) {
      this.loading = true
      this.error = null
      
      try {
        // Формируем URL с query параметрами
        const params = new URLSearchParams()
        
        // Добавляем workspace_id
        if (this.workspaceIdCookie.value) {
          params.append('workspace_id', this.workspaceIdCookie.value)
        }
        
        // Добавляем статус фильтра
        if (this.selectedStatus) {
          params.append('status', this.selectedStatus)
        }
        
        // Добавляем пагинацию
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
        this.pagination = result.pagination || null
      } catch (error) {
        this.error = error.message || 'Ошибка загрузки планировок'
      } finally {
        this.loading = false
      }
    },
    getStatusClass(status) {
      return this.statusClasses[status] || 'bg-gray-500/20 text-gray-400'
    },
    getStatusLabel(status) {
      return this.statusLabels[status] || status
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
        if (this.workspaceIdCookie.value) {
          url += `?workspace_id=${this.workspaceIdCookie.value}`
        }
        
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
:deep(.p-dropdown) {
  background-color: #26272A !important;
  border-color: #26272A !important;
}

:deep(.p-dropdown .p-dropdown-label) {
  color: white !important;
}

:deep(.p-inputtext) {
  background-color: #26272A !important;
  border-color: #26272A !important;
  color: white !important;
}

:deep(.p-inputtext::placeholder) {
  color: #717177 !important;
}
</style>
