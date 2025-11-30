<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white mb-2">Создать воркспейс</h1>
        <p class="text-gray-400">Создайте новое рабочее пространство для проекта</p>
      </div>
      <NuxtLink to="/panel/workspaces">
        <Button label="Назад к списку" icon="pi pi-arrow-left" outlined class="border-[#26272A] text-white hover:bg-[#27272A]" />
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Левая колонка - Форма -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A]">
          <h3 class="text-lg font-semibold text-white mb-4">Информация о воркспейсе</h3>
          
          <div class="space-y-4">
            <!-- Название -->
            <div>
              <label class="block text-sm font-medium text-white mb-2">Название *</label>
              <InputText 
                v-model="form.name" 
                placeholder="Например: Квартира на Ленина 15"
                class="w-full bg-[#18181B] border-[#26272A] text-white"
                :class="{ 'border-red-500': errors.name }"
              />
              <p v-if="errors.name" class="text-sm text-red-400 mt-1">{{ errors.name }}</p>
            </div>

            <!-- Описание -->
            <div>
              <label class="block text-sm font-medium text-white mb-2">Описание (необязательно)</label>
              <Textarea 
                v-model="form.description" 
                placeholder="Краткое описание квартиры..."
                rows="3"
                class="w-full bg-[#18181B] border-[#26272A] text-white"
              />
            </div>

            <!-- Адрес -->
            <div>
              <label class="block text-sm font-medium text-white mb-2">Адрес (необязательно)</label>
              <InputText 
                v-model="form.address" 
                placeholder="г. Москва, ул. Ленина, д. 15, кв. 42"
                class="w-full bg-[#18181B] border-[#26272A] text-white"
              />
            </div>

            <!-- Площадь и комнаты -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-white mb-2">Площадь, м²</label>
                <InputNumber 
                  v-model="form.total_area" 
                  placeholder="54.5"
                  :minFractionDigits="1"
                  :maxFractionDigits="2"
                  class="w-full bg-[#18181B] border-[#26272A] text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-white mb-2">Количество комнат</label>
                <InputNumber 
                  v-model="form.rooms_count" 
                  placeholder="2"
                  :min="1"
                  :max="20"
                  class="w-full bg-[#18181B] border-[#26272A] text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Ошибка -->
        <div v-if="error" class="bg-red-900/20 border border-red-500/20 rounded-xl p-4">
          <p class="text-red-400">{{ error }}</p>
        </div>

        <!-- Действия -->
        <div class="flex gap-4">
          <Button 
            label="Создать воркспейс" 
            icon="pi pi-check"
            :disabled="!form.name.trim()"
            :loading="loading"
            class="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] border-none"
            @click="createWorkspace"
          />
          <NuxtLink to="/panel/workspaces">
            <Button 
              label="Отмена" 
              outlined
              class="border-[#26272A] text-white hover:bg-[#27272A]"
            />
          </NuxtLink>
        </div>
      </div>

      <!-- Правая колонка - Информация -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A]">
          <h3 class="text-lg font-semibold text-white mb-4">О воркспейсах</h3>
          <div class="space-y-4 text-sm text-gray-400">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-[#2563EB]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <div class="text-white font-medium mb-1">Организация проектов</div>
                <p>Воркспейс позволяет группировать планировки и сцены в рамках одного проекта</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-[#2563EB]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <div class="text-white font-medium mb-1">Командная работа</div>
                <p>Приглашайте участников для совместной работы над проектом</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-[#2563EB]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div class="text-white font-medium mb-1">Управление доступом</div>
                <p>Контролируйте, кто может просматривать и редактировать данные проекта</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Подсказка -->
        <div class="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-sm text-blue-300">
              <p>После создания воркспейса вы сможете добавлять в него планировки и приглашать участников.</p>
            </div>
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
import { useCookie } from "#app"
import { api as useApiStore } from '@/store/api'

export default {
  data() {
    return {
      form: {
        name: '',
        description: '',
        address: '',
        total_area: null,
        rooms_count: null
      },
      errors: {},
      loading: false,
      error: null,
      apiStore: null
    }
  },
  created() {
    this.apiStore = useApiStore()
    this.accessTokenCookie = useCookie('access_token')
    this.workspaceIdCookie = useCookie('workspace_id', { maxAge: 60 * 60 * 24 * 365 })
  },
  methods: {
    validate() {
      this.errors = {}
      
      if (!this.form.name.trim()) {
        this.errors.name = 'Введите название воркспейса'
        return false
      }
      
      if (this.form.name.trim().length < 2) {
        this.errors.name = 'Название должно быть не менее 2 символов'
        return false
      }
      
      return true
    },
    async createWorkspace() {
      if (!this.validate()) return

      this.error = null
      this.loading = true
      
      try {
        const body = {
          name: this.form.name.trim(),
          description: this.form.description.trim() || undefined,
          address: this.form.address.trim() || undefined,
          total_area: this.form.total_area || undefined,
          rooms_count: this.form.rooms_count || undefined
        }
        
        const result = await $fetch(`${this.apiStore.url}api/v1/workspaces`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          },
          body
        })
        
        const workspace = result.data || result
        
        if (workspace && workspace.id) {
          // Сохраняем ID созданного воркспейса в куки
          this.workspaceIdCookie.value = workspace.id
          
          // Переходим на список планировок
          this.$router.push('/panel/plane/list')
        }
      } catch (err) {
        this.error = err.data?.message || err.message || 'Ошибка создания воркспейса'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
:deep(.p-inputtext) {
  background-color: #18181B !important;
  border-color: #26272A !important;
  color: white !important;
}

:deep(.p-inputtext::placeholder) {
  color: #717177 !important;
}

:deep(.p-inputtextarea) {
  background-color: #18181B !important;
  border-color: #26272A !important;
  color: white !important;
}

:deep(.p-inputtextarea::placeholder) {
  color: #717177 !important;
}
</style>

