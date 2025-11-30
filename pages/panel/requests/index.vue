<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Заявки на экспертов</h1>
        <p class="text-sm sm:text-base text-gray-400">Управляйте заявками на консультации и услуги специалистов</p>
      </div>
      <NuxtLink to="/panel/requests/create" class="sm:flex-shrink-0">
        <Button label="Новая заявка" icon="pi pi-plus" class="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1d4ed8] border-none text-sm" />
      </NuxtLink>
    </div>

    <!-- Фильтры -->
    <div class="flex flex-col gap-3 sm:gap-4">
      <div class="flex-1">
        <InputText 
          v-model="searchQuery" 
          placeholder="Поиск по номеру заявки..."
          class="w-full bg-[#26272A] border-[#26272A] text-white text-sm"
        />
      </div>
      <div class="grid grid-cols-2 sm:flex gap-2 sm:gap-4">
        <Dropdown 
          v-model="statusFilter" 
          :options="statusOptions" 
          optionLabel="label"
          optionValue="value"
          placeholder="Все статусы"
          class="w-full sm:w-[160px] bg-[#26272A] border-[#26272A] text-sm"
        />
        <Dropdown 
          v-model="categoryFilter" 
          :options="categoryOptions" 
          optionLabel="label"
          optionValue="value"
          placeholder="Все категории"
          class="w-full sm:w-[160px] bg-[#26272A] border-[#26272A] text-sm"
        />
      </div>
    </div>

    <!-- Список заявок -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-[#26272A] rounded-xl p-6 border border-[#26272A] animate-pulse">
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <div class="h-5 bg-[#18181B] rounded w-48"></div>
            <div class="h-4 bg-[#18181B] rounded w-32"></div>
          </div>
          <div class="h-8 bg-[#18181B] rounded w-24"></div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredRequests.length === 0" class="bg-[#26272A] rounded-xl p-8 sm:p-12 text-center">
      <div class="w-16 h-16 sm:w-20 sm:h-20 bg-[#2563EB]/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-inbox text-2xl sm:text-4xl text-[#2563EB]"></i>
      </div>
      <h3 class="text-lg sm:text-xl font-semibold text-white mb-2">Нет заявок</h3>
      <p class="text-sm sm:text-base text-gray-400 max-w-md mx-auto mb-4 sm:mb-6 px-4">
        Создайте первую заявку на консультацию или услуги специалиста
      </p>
      <NuxtLink to="/panel/requests/create">
        <Button label="Создать заявку" icon="pi pi-plus" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none text-sm" />
      </NuxtLink>
    </div>

    <div v-else class="space-y-3 sm:space-y-4">
      <div 
        v-for="request in filteredRequests" 
        :key="request.id"
        class="bg-[#26272A] rounded-xl p-4 sm:p-6 border border-[#26272A] hover:border-[#2563EB]/50 transition-colors cursor-pointer"
        @click="viewRequest(request.id)"
      >
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
              <span class="text-base sm:text-lg font-semibold text-white">
                Заявка #{{ request.id.slice(0, 8) }}
              </span>
              <span :class="[
                'px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium',
                getStatusColor(request.status)
              ]">
                {{ getStatusName(request.status) }}
              </span>
            </div>
            <div class="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">
              <span class="flex items-center gap-1">
                <i class="pi pi-tag text-xs"></i>
                {{ getCategoryName(request.category) }}
              </span>
              <span class="flex items-center gap-1">
                <i class="pi pi-calendar text-xs"></i>
                {{ formatDate(request.created_at) }}
              </span>
              <span v-if="request.price" class="flex items-center gap-1">
                <i class="pi pi-wallet text-xs"></i>
                {{ formatPrice(request.price) }} ₽
              </span>
            </div>
            <div class="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <span class="text-gray-300">
                <strong>Контакт:</strong> {{ request.contact_name }}
              </span>
              <span class="text-gray-400">{{ request.contact_phone }}</span>
            </div>
            <p v-if="request.comment" class="text-xs sm:text-sm text-gray-400 mt-2 line-clamp-2">
              {{ request.comment }}
            </p>
            
            <!-- Связанная планировка -->
            <div v-if="request.floor_plan" class="mt-3 pt-3 border-t border-[#18181B]">
              <div class="flex items-center gap-2 text-xs text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>{{ request.floor_plan.name }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-start">
            <Button 
              v-if="request.status === 'pending' || request.status === 'draft'"
              icon="pi pi-times" 
              outlined
              severity="danger"
              size="small"
              class="border-[#26272A]"
              @click.stop="confirmCancel(request)"
            />
            <Button 
              icon="pi pi-chevron-right" 
              outlined
              size="small"
              class="border-[#26272A] text-white"
              @click.stop="viewRequest(request.id)"
            />
          </div>
        </div>

        <!-- Назначенный эксперт -->
        <div v-if="request.assigned_expert" class="mt-4 pt-4 border-t border-[#18181B]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#2563EB]/20 rounded-full flex items-center justify-center">
              <i class="pi pi-user text-[#2563EB]"></i>
            </div>
            <div>
              <div class="text-sm font-medium text-white">{{ request.assigned_expert.name }}</div>
              <div class="text-xs text-gray-400">{{ request.assigned_expert.specialization }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Dialog -->
    <Dialog 
      v-model:visible="cancelDialog" 
      modal 
      header="Отмена заявки"
      :style="{ width: '90vw', maxWidth: '400px' }"
    >
      <p class="text-white mb-4">Вы уверены, что хотите отменить заявку?</p>
      <p class="text-gray-400 text-sm mb-6">Это действие нельзя отменить.</p>
      <div class="flex gap-3 justify-end">
        <Button label="Нет" outlined class="border-[#26272A] text-white hover:bg-[#27272A]" @click="cancelDialog = false" />
        <Button label="Да, отменить" severity="danger" class="border-none" @click="cancelRequest" />
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
      requests: [],
      loading: false,
      searchQuery: '',
      statusFilter: null,
      categoryFilter: null,
      cancelDialog: false,
      requestToCancel: null,
      apiStore: null,
      statusOptions: [
        { label: 'Все статусы', value: null },
        { label: 'Черновик', value: 'draft' },
        { label: 'Ожидает', value: 'pending' },
        { label: 'На проверке', value: 'review' },
        { label: 'В работе', value: 'in_progress' },
        { label: 'Готово к выдаче', value: 'ready' },
        { label: 'Завершена', value: 'completed' },
        { label: 'Отменена', value: 'cancelled' }
      ],
      categoryOptions: [
        { label: 'Все категории', value: null },
        { label: 'Консультация', value: 'consultation' },
        { label: 'Документы', value: 'documentation' },
        { label: 'Выезд эксперта', value: 'expert_visit' },
        { label: 'Полный пакет', value: 'full_package' }
      ],
      statusColors: {
        draft: 'bg-gray-500/20 text-gray-400',
        pending: 'bg-yellow-500/20 text-yellow-400',
        review: 'bg-purple-500/20 text-purple-400',
        in_progress: 'bg-blue-500/20 text-blue-400',
        ready: 'bg-cyan-500/20 text-cyan-400',
        completed: 'bg-green-500/20 text-green-400',
        cancelled: 'bg-red-500/20 text-red-400'
      },
      statusNames: {
        draft: 'Черновик',
        pending: 'Ожидает',
        review: 'На проверке',
        in_progress: 'В работе',
        ready: 'Готово к выдаче',
        completed: 'Завершена',
        cancelled: 'Отменена'
      },
      categoryNames: {
        consultation: 'Консультация',
        documentation: 'Документы',
        expert_visit: 'Выезд эксперта',
        full_package: 'Полный пакет'
      }
    }
  },
  created() {
    this.apiStore = useApiStore()
    this.accessTokenCookie = useCookie('access_token')
  },
  computed: {
    filteredRequests() {
      let result = this.requests

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(r => 
          r.id.toLowerCase().includes(query) ||
          r.contact_name?.toLowerCase().includes(query)
        )
      }

      if (this.statusFilter) {
        result = result.filter(r => r.status === this.statusFilter)
      }

      if (this.categoryFilter) {
        result = result.filter(r => r.category === this.categoryFilter)
      }

      return result
    }
  },
  async mounted() {
    await this.fetchRequests()
  },
  methods: {
    async fetchRequests() {
      this.loading = true
      try {
        const result = await $fetch(`${this.apiStore.url}api/v1/requests`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          }
        })
        // API возвращает { data: { items: [...] } } или { data: [...] }
        this.requests = result.data?.items || result.requests || result.data || []
        if (!Array.isArray(this.requests)) this.requests = []
      } catch (error) {
        console.error('Ошибка загрузки заявок:', error)
        this.requests = []
      } finally {
        this.loading = false
      }
    },
    getStatusColor(status) {
      return this.statusColors[status] || 'bg-gray-500/20 text-gray-400'
    },
    getStatusName(status) {
      return this.statusNames[status] || status
    },
    getCategoryName(category) {
      return this.categoryNames[category] || category
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    },
    formatPrice(price) {
      return price.toLocaleString('ru-RU')
    },
    viewRequest(id) {
      this.$router.push(`/panel/requests/${id}`)
    },
    confirmCancel(request) {
      this.requestToCancel = request
      this.cancelDialog = true
    },
    async cancelRequest() {
      if (!this.requestToCancel) return
      
      try {
        await $fetch(`${this.apiStore.url}api/v1/requests/${this.requestToCancel.id}/cancel`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          }
        })
        
        const request = this.requests.find(r => r.id === this.requestToCancel.id)
        if (request) {
          request.status = 'cancelled'
        }
        
        this.cancelDialog = false
        this.requestToCancel = null
      } catch (error) {
        console.error('Ошибка отмены:', error)
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
