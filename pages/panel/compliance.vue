<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white mb-2">Проверка соответствия нормам</h1>
        <p class="text-gray-400">Автоматическая проверка на соответствие СНиП, Жилищному кодексу и другим нормам</p>
      </div>
    </div>

    <!-- Выбор планировки -->
    <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A]">
      <h3 class="text-lg font-semibold text-white mb-4">Выберите планировку для проверки</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-gray-400 mb-2">Планировка</label>
          <Dropdown
            v-model="selectedFloorPlan"
            :options="floorPlans"
            optionLabel="name"
            optionValue="id"
            placeholder="Выберите планировку"
            class="w-full bg-[#18181B] border-[#26272A]"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-400 mb-2">Тип операции</label>
          <Dropdown
            v-model="operationType"
            :options="operationTypes"
            optionLabel="label"
            optionValue="value"
            placeholder="Выберите тип"
            class="w-full bg-[#18181B] border-[#26272A]"
          />
        </div>
      </div>
      
      <div class="mt-4">
        <label class="block text-sm text-gray-400 mb-2">Категории проверки</label>
        <div class="flex flex-wrap gap-2">
          <div v-for="cat in categories" :key="cat.value" class="flex items-center">
            <Checkbox 
              v-model="selectedCategories" 
              :inputId="cat.value" 
              :value="cat.value"
            />
            <label :for="cat.value" class="ml-2 text-sm text-white">{{ cat.label }}</label>
          </div>
        </div>
      </div>

      <div class="mt-6">
        <Button 
          label="Запустить проверку" 
          icon="pi pi-shield"
          :loading="checkingInProgress"
          :disabled="!selectedFloorPlan"
          class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none"
          @click="runCheck"
        />
      </div>
    </div>

    <!-- Результаты проверки -->
    <div v-if="lastCheckResult" class="space-y-6">
      <!-- Общий статус -->
      <div :class="[
        'rounded-xl p-6 border',
        lastCheckResult.is_compliant 
          ? 'bg-green-900/20 border-green-500/30' 
          : 'bg-red-900/20 border-red-500/30'
      ]">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div :class="[
              'w-16 h-16 rounded-full flex items-center justify-center',
              lastCheckResult.is_compliant ? 'bg-green-500/20' : 'bg-red-500/20'
            ]">
              <i :class="[
                'text-3xl',
                lastCheckResult.is_compliant ? 'pi pi-check-circle text-green-500' : 'pi pi-times-circle text-red-500'
              ]"></i>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">
                {{ lastCheckResult.is_compliant ? 'Соответствует нормам' : 'Обнаружены нарушения' }}
              </h3>
              <p class="text-gray-400">
                Проверено правил: {{ lastCheckResult.passed_rules }} из {{ lastCheckResult.total_rules }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-4xl font-bold" :class="lastCheckResult.is_compliant ? 'text-green-500' : 'text-red-500'">
              {{ lastCheckResult.overall_score }}%
            </div>
            <p class="text-sm text-gray-400">Общий балл</p>
          </div>
        </div>
      </div>

      <!-- Статистика -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-[#26272A] rounded-xl p-4 border border-[#26272A]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <i class="pi pi-times text-red-500"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-white">{{ violationStats.errors }}</div>
              <div class="text-sm text-gray-400">Нарушений</div>
            </div>
          </div>
        </div>
        <div class="bg-[#26272A] rounded-xl p-4 border border-[#26272A]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <i class="pi pi-exclamation-triangle text-yellow-500"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-white">{{ violationStats.warnings }}</div>
              <div class="text-sm text-gray-400">Предупреждений</div>
            </div>
          </div>
        </div>
        <div class="bg-[#26272A] rounded-xl p-4 border border-[#26272A]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <i class="pi pi-check text-green-500"></i>
            </div>
            <div>
              <div class="text-2xl font-bold text-white">{{ lastCheckResult.passed_rules }}</div>
              <div class="text-sm text-gray-400">Пройдено</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Список нарушений -->
      <div v-if="lastCheckResult.violations && lastCheckResult.violations.length > 0" class="bg-[#26272A] rounded-xl border border-[#26272A]">
        <div class="p-4 border-b border-[#26272A]">
          <h3 class="text-lg font-semibold text-white">Нарушения</h3>
        </div>
        <div class="divide-y divide-[#26272A]">
          <div 
            v-for="violation in lastCheckResult.violations" 
            :key="violation.rule_id"
            class="p-4"
          >
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="pi pi-times text-red-500"></i>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-medium text-white">{{ violation.rule_name }}</span>
                  <span class="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400">
                    {{ getCategoryName(violation.category) }}
                  </span>
                </div>
                <p class="text-sm text-gray-400 mb-2">{{ violation.description }}</p>
                <div class="bg-[#18181B] rounded-lg p-3">
                  <p class="text-sm text-gray-300">
                    <strong class="text-[#2563EB]">Рекомендация:</strong> {{ violation.recommendation }}
                  </p>
                  <p v-if="violation.legal_reference" class="text-xs text-gray-500 mt-1">
                    {{ violation.legal_reference }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Действия -->
      <div class="flex gap-4">
        <Button 
          label="Экспорт отчёта PDF" 
          icon="pi pi-file-pdf"
          outlined
          class="border-[#26272A] text-white hover:bg-[#27272A]"
          @click="exportPDF"
        />
        <Button 
          label="Заказать консультацию" 
          icon="pi pi-user"
          class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none"
          @click="orderConsultation"
        />
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!checkingInProgress" class="bg-[#26272A] rounded-xl p-12 text-center">
      <div class="w-20 h-20 bg-[#2563EB]/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-shield text-4xl text-[#2563EB]"></i>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">Проверка не выполнена</h3>
      <p class="text-gray-400 max-w-md mx-auto">
        Выберите планировку и запустите проверку, чтобы узнать о соответствии нормам СНиП и другим требованиям
      </p>
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
      selectedFloorPlan: null,
      operationType: 'renovation',
      selectedCategories: ['snip', 'housing_code', 'fire_safety', 'sanitary'],
      floorPlans: [],
      lastCheckResult: null,
      checkingInProgress: false,
      apiStore: null,
      operationTypes: [
        { label: 'Строительство', value: 'construction' },
        { label: 'Ремонт', value: 'renovation' },
        { label: 'Перепланировка', value: 'redevelopment' }
      ],
      categories: [
        { label: 'СНиП', value: 'snip' },
        { label: 'Жилищный кодекс', value: 'housing_code' },
        { label: 'Пожарная безопасность', value: 'fire_safety' },
        { label: 'СанПиН', value: 'sanitary' }
      ],
      categoryNames: {
        snip: 'СНиП',
        housing_code: 'Жилищный кодекс',
        fire_safety: 'Пожарная безопасность',
        sanitary: 'СанПиН'
      }
    }
  },
  created() {
    this.apiStore = useApiStore()
    this.accessTokenCookie = useCookie('access_token')
  },
  computed: {
    violationStats() {
      if (!this.lastCheckResult) {
        return { errors: 0, warnings: 0 }
      }
      return {
        errors: this.lastCheckResult.violations?.length || 0,
        warnings: this.lastCheckResult.warnings?.length || 0
      }
    }
  },
  async mounted() {
    await this.fetchFloorPlans()
  },
  methods: {
    async fetchFloorPlans() {
      try {
        const result = await $fetch(`${this.apiStore.url}api/v1/floor-plans`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          }
        })
        this.floorPlans = result.floor_plans || result.data || []
      } catch (error) {
        console.error('Ошибка загрузки планировок:', error)
      }
    },
    async runCheck() {
      if (!this.selectedFloorPlan) return
      
      this.checkingInProgress = true
      
      try {
        const result = await $fetch(`${this.apiStore.url}api/v1/compliance/check`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          },
          body: {
            floor_plan_id: this.selectedFloorPlan,
            operation_type: this.operationType,
            check_categories: this.selectedCategories
          }
        })
        
        this.lastCheckResult = result.data || result
      } catch (error) {
        console.error('Ошибка проверки:', error)
      } finally {
        this.checkingInProgress = false
      }
    },
    getCategoryName(category) {
      return this.categoryNames[category] || category
    },
    exportPDF() {
      console.log('Export PDF')
    },
    orderConsultation() {
      this.$router.push('/panel/requests/create?type=consultation')
    }
  }
}
</script>

<style scoped>
:deep(.p-dropdown) {
  background-color: #18181B !important;
  border-color: #26272A !important;
}

:deep(.p-dropdown .p-dropdown-label) {
  color: white !important;
}

:deep(.p-checkbox .p-checkbox-box) {
  background-color: #18181B !important;
  border-color: #26272A !important;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background-color: #2563EB !important;
  border-color: #2563EB !important;
}
</style>
