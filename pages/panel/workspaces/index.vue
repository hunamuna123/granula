<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white mb-2">Рабочие пространства</h1>
        <p class="text-gray-400">Управляйте своими проектами и командами</p>
      </div>
      <NuxtLink to="/panel/workspaces/create">
        <Button label="Создать воркспейс" icon="pi pi-plus" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none" />
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
    </div>

    <!-- Список воркспейсов -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="bg-[#26272A] rounded-xl p-6 border border-[#26272A] animate-pulse">
        <div class="h-6 bg-[#18181B] rounded mb-4 w-3/4"></div>
        <div class="h-4 bg-[#18181B] rounded mb-2"></div>
        <div class="h-4 bg-[#18181B] rounded w-2/3"></div>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-900/20 border border-red-500/20 rounded-xl p-6 text-center">
      <p class="text-red-400 mb-4">{{ error }}</p>
      <Button label="Повторить" icon="pi pi-refresh" @click="loadWorkspaces" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none" />
    </div>

    <div v-else-if="filteredWorkspaces.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">Нет воркспейсов</h3>
      <p class="text-gray-400 mb-6">Создайте свой первый воркспейс для работы</p>
      <NuxtLink to="/panel/workspaces/create">
        <Button label="Создать воркспейс" icon="pi pi-plus" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none" />
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="workspace in filteredWorkspaces" 
        :key="workspace.id"
        class="bg-[#26272A] rounded-xl border border-[#26272A] hover:border-[#2563EB] transition-all cursor-pointer overflow-hidden group"
        @click="selectWorkspace(workspace)"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-[#2563EB]/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <!-- Активный индикатор -->
            <span v-if="currentWorkspaceId === workspace.id" class="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
              Активный
            </span>
          </div>
          
          <h3 class="text-lg font-semibold text-white mb-2 truncate">{{ workspace.name }}</h3>
          <p class="text-sm text-gray-400 mb-4 line-clamp-2">{{ workspace.description || 'Без описания' }}</p>
          
          <div class="flex items-center justify-between text-sm text-gray-400 mb-4">
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <span>{{ workspace.member_count }} участников</span>
            </div>
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formatDate(workspace.created_at) }}</span>
            </div>
          </div>

          <!-- Действия -->
          <div class="flex gap-2">
            <Button 
              label="Выбрать" 
              icon="pi pi-check" 
              :outlined="currentWorkspaceId !== workspace.id"
              size="small"
              :class="currentWorkspaceId === workspace.id 
                ? 'flex-1 bg-[#2563EB] border-[#2563EB] hover:bg-[#1d4ed8]' 
                : 'flex-1 border-[#26272A] text-white hover:bg-[#27272A]'"
              @click.stop="selectWorkspace(workspace)"
            />
            <Button 
              icon="pi pi-trash" 
              outlined 
              severity="danger"
              size="small"
              class="border-[#26272A] text-red-400 hover:bg-red-500/20"
              @click.stop="confirmDelete(workspace)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Пагинация -->
    <div v-if="pagination && pagination.total_pages > 1" class="flex justify-center gap-2">
      <Button 
        icon="pi pi-chevron-left" 
        outlined
        size="small"
        :disabled="pagination.page <= 1"
        class="border-[#26272A] text-white"
        @click="loadWorkspaces(pagination.page - 1)"
      />
      <span class="px-4 py-2 text-gray-400">
        {{ pagination.page }} / {{ pagination.total_pages }}
      </span>
      <Button 
        icon="pi pi-chevron-right" 
        outlined
        size="small"
        :disabled="pagination.page >= pagination.total_pages"
        class="border-[#26272A] text-white"
        @click="loadWorkspaces(pagination.page + 1)"
      />
    </div>

    <!-- Диалог удаления -->
    <Dialog 
      v-model:visible="deleteDialog" 
      modal 
      header="Удаление воркспейса"
      :style="{ width: '400px' }"
      class="p-fluid"
    >
      <p class="text-white mb-4">Вы уверены, что хотите удалить воркспейс "{{ workspaceToDelete?.name }}"?</p>
      <p class="text-gray-400 text-sm mb-6">Это действие нельзя отменить. Все данные воркспейса будут удалены.</p>
      <div class="flex gap-3 justify-end">
        <Button label="Отмена" outlined class="border-[#26272A] text-white hover:bg-[#27272A]" @click="deleteDialog = false" />
        <Button label="Удалить" severity="danger" class="border-none" :loading="deleting" @click="deleteWorkspace" />
      </div>
    </Dialog>
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
      workspaces: [],
      searchQuery: '',
      loading: false,
      error: null,
      deleteDialog: false,
      workspaceToDelete: null,
      deleting: false,
      apiStore: null,
      pagination: null
    }
  },
  created() {
    this.apiStore = useApiStore()
    this.accessTokenCookie = useCookie('access_token')
    this.workspaceIdCookie = useCookie('workspace_id', { maxAge: 60 * 60 * 24 * 365 })
  },
  computed: {
    currentWorkspaceId() {
      return this.workspaceIdCookie.value
    },
    filteredWorkspaces() {
      if (!this.searchQuery) return this.workspaces
      
      const query = this.searchQuery.toLowerCase()
      return this.workspaces.filter(ws => 
        ws.name.toLowerCase().includes(query) ||
        ws.description?.toLowerCase().includes(query)
      )
    }
  },
  async mounted() {
    await this.loadWorkspaces()
  },
  methods: {
    async loadWorkspaces(page = 1) {
      this.loading = true
      this.error = null
      
      try {
        const params = new URLSearchParams()
        params.append('page', page)
        params.append('limit', 20)
        if (this.searchQuery) {
          params.append('search', this.searchQuery)
        }
        
        const result = await $fetch(`${this.apiStore.url}api/v1/workspaces?${params.toString()}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          }
        })
        
        // API возвращает массив воркспейсов в поле data
        const data = result.data || result
        this.workspaces = Array.isArray(data) ? data : (data.workspaces || [])
        this.pagination = result.pagination || null
      } catch (error) {
        this.error = error.message || 'Ошибка загрузки воркспейсов'
      } finally {
        this.loading = false
      }
    },
    selectWorkspace(workspace) {
      // Сохраняем workspace_id в куки
      this.workspaceIdCookie.value = workspace.id
      
      // Показываем уведомление или переходим на страницу планировок
      this.$router.push('/panel/plane/list')
    },
    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    confirmDelete(workspace) {
      this.workspaceToDelete = workspace
      this.deleteDialog = true
    },
    async deleteWorkspace() {
      if (!this.workspaceToDelete) return
      
      this.deleting = true
      try {
        await $fetch(`${this.apiStore.url}api/v1/workspaces/${this.workspaceToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          }
        })
        
        // Если удалённый воркспейс был активным - очищаем куки
        if (this.workspaceIdCookie.value === this.workspaceToDelete.id) {
          this.workspaceIdCookie.value = null
        }
        
        this.workspaces = this.workspaces.filter(ws => ws.id !== this.workspaceToDelete.id)
        this.deleteDialog = false
        this.workspaceToDelete = null
      } catch (error) {
        console.error('Ошибка удаления:', error)
      } finally {
        this.deleting = false
      }
    }
  },
  watch: {
    searchQuery() {
      // Debounce search
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.loadWorkspaces()
      }, 300)
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

