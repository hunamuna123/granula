<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white mb-2">Проверка соответствия нормам</h1>
        <p class="text-gray-400">Автоматическая проверка на соответствие СНиП, Жилищному кодексу и другим нормам</p>
      </div>
    </div>

    <!-- Выбор сцены -->
    <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A]">
      <h3 class="text-lg font-semibold text-white mb-4">Выберите сцену для проверки</h3>
      <div>
        <label class="block text-sm text-gray-400 mb-2">Сцена</label>
        <Dropdown
          v-model="selectedScene"
          :options="scenes"
          optionLabel="name"
          optionValue="id"
          placeholder="Выберите сцену"
          class="w-full bg-[#18181B] border-[#26272A]"
        />
      </div>

      <div class="mt-6">
        <Button 
          label="Запустить проверку" 
          icon="pi pi-shield"
          :loading="checkingInProgress"
          :disabled="!selectedScene"
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
            :key="violation.rule_code"
            class="p-4"
          >
            <div class="flex items-start gap-4">
              <div :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                violation.severity === 'critical' ? 'bg-red-500/20' : 'bg-yellow-500/20'
              ]">
                <i :class="violation.severity === 'critical' ? 'pi pi-times text-red-500' : 'pi pi-exclamation-triangle text-yellow-500'"></i>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-medium text-white">{{ violation.rule_name }}</span>
                  <span :class="[
                    'px-2 py-0.5 text-xs rounded-full',
                    violation.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  ]">
                    {{ violation.severity === 'critical' ? 'Критично' : 'Предупреждение' }}
                  </span>
                  <span class="px-2 py-0.5 text-xs rounded-full bg-gray-500/20 text-gray-400">
                    {{ violation.rule_code }}
                  </span>
                </div>
                <p class="text-sm text-gray-400 mb-2">{{ violation.description }}</p>
                <div class="bg-[#18181B] rounded-lg p-3">
                  <p class="text-sm text-gray-300">
                    <strong class="text-[#2563EB]">Рекомендация:</strong> {{ violation.recommendation }}
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
      selectedScene: null,
      scenes: [],
      lastCheckResult: null,
      checkingInProgress: false,
      apiStore: null,
      categoryNames: {
        kitchen: 'Кухня',
        bathroom: 'Санузел',
        living: 'Жилые помещения',
        general: 'Общие требования'
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
    await this.fetchScenes()
  },
  methods: {
    async fetchScenes() {
      try {
        const workspaceId = useCookie('workspace_id').value
        if (!workspaceId) return
        
        const result = await $fetch(`${this.apiStore.url}api/v1/workspaces/${workspaceId}/scenes`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          }
        })
        // API может вернуть разные форматы
        const scenes = result.data?.items || result.data?.scenes || result.data || result.scenes || result
        this.scenes = Array.isArray(scenes) ? scenes : []
      } catch (error) {
        console.error('Ошибка загрузки сцен:', error)
      }
    },
    
    // GET /scenes/{id}/compliance - проверка сцены
    async runCheck() {
      if (!this.selectedScene) return
      
      this.checkingInProgress = true
      
      try {
        // Сначала пробуем GET /scenes/{id}/compliance
        const result = await $fetch(`${this.apiStore.url}api/v1/scenes/${this.selectedScene}/compliance`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          }
        })
        
        const data = result.data || result
        this.processComplianceResult(data)
      } catch (error) {
        // Fallback на POST /compliance/check
        try {
          const result = await $fetch(`${this.apiStore.url}api/v1/compliance/check`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.accessTokenCookie.value}`,
              'Content-Type': 'application/json'
            },
            body: {
              scene_id: this.selectedScene
            }
          })
          
          const data = result.data || result
          this.processComplianceResult(data)
        } catch (e) {
          console.error('Ошибка проверки:', e)
        }
      } finally {
        this.checkingInProgress = false
      }
    },
    
    processComplianceResult(data) {
      const violations = data.violations || []
      const warnings = data.warnings || []
      const passedRules = data.passed_rules || data.passed || 0
      const totalRules = data.total_rules || data.total || (violations.length + warnings.length + passedRules) || 1
      
      this.lastCheckResult = {
        is_compliant: data.compliant ?? data.is_compliant ?? (violations.length === 0),
        violations: violations,
        warnings: warnings,
        passed_rules: passedRules || Math.max(0, totalRules - violations.length - warnings.length),
        total_rules: totalRules,
        overall_score: data.score ?? data.overall_score ?? (violations.length === 0 ? 100 : Math.max(0, 100 - violations.length * 15 - warnings.length * 5))
      }
    },
    
    // POST /compliance/report - генерация отчёта
    async generateReport() {
      if (!this.selectedScene) return null
      
      try {
        const result = await $fetch(`${this.apiStore.url}api/v1/compliance/report`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          },
          body: {
            scene_id: this.selectedScene,
            format: 'pdf'
          }
        })
        
        const data = result.data || result
        return data.url || data.report_url
      } catch (error) {
        console.error('Ошибка генерации отчёта:', error)
        return null
      }
    },
    
    // GET /compliance/rules - список правил
    async fetchRules() {
      try {
        const result = await $fetch(`${this.apiStore.url}api/v1/compliance/rules`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          }
        })
        
        return result.data?.items || result.data || result.rules || []
      } catch (error) {
        console.error('Ошибка загрузки правил:', error)
        return []
      }
    },
    getCategoryName(category) {
      return this.categoryNames[category] || category
    },
    async exportPDF() {
      const url = await this.generateReport()
      if (url) {
        window.open(url, '_blank')
      } else {
        // Fallback - генерируем локально
        console.log('PDF generation not available from server')
      }
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
</style>
