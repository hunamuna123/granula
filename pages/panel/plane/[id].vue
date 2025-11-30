<template>
  <div class="flex flex-col h-full">
    <!-- Заголовок -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-4">
        <NuxtLink to="/panel/plane/list">
          <Button 
            icon="pi pi-arrow-left" 
            outlined 
            size="small"
            class="border-[#26272A] text-white hover:bg-[#27272A]"
          />
        </NuxtLink>
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-white mb-1">{{ planName || 'Планировка' }}</h1>
          <p class="text-gray-400 text-xs sm:text-sm">{{ planDescription || 'Редактирование планировки' }}</p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
        <Button 
          label="Сохранить" 
          icon="pi pi-save" 
          class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none flex-1 sm:flex-none"
          @click="savePlan"
        />
        <Button 
          label="Генерировать" 
          icon="pi pi-magic"
          outlined
          class="border-[#26272A] text-white hover:bg-[#27272A] flex-1 sm:flex-none hidden sm:inline-flex"
          @click="showVariantsDialog = true"
        />
        <Button 
          label="БТИ" 
          icon="pi pi-send"
          outlined
          class="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/20 flex-1 sm:flex-none"
          @click="showBTIDialog = true"
        />
      </div>
    </div>

    <!-- Основной контент -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 min-h-0">
      <!-- Редактор планировки -->
      <div class="lg:col-span-3 bg-[#26272A] rounded-xl border border-[#26272A] overflow-hidden relative" style="min-height: 600px; height: calc(100vh - 200px);">
        <FloorPlanEditor ref="editor" />
      </div>

      <!-- Правая панель - Информация и инструменты -->
      <div class="lg:col-span-1 space-y-4 sm:space-y-6">
        <!-- Варианты планировки -->
        <div class="bg-[#26272A] rounded-xl p-4 border border-[#26272A]">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base font-semibold text-white">Варианты</h3>
            <Button 
              icon="pi pi-plus" 
              size="small"
              class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none w-8 h-8"
              @click="showVariantsDialog = true"
              :disabled="generatingVariants"
            />
          </div>
          
          <!-- Генерация в процессе -->
          <div v-if="generatingVariants" class="text-center py-4">
            <div class="animate-spin w-6 h-6 border-2 border-[#2563EB] border-t-transparent rounded-full mx-auto mb-2"></div>
            <div class="text-sm text-gray-400">Генерация...</div>
            <div class="text-xs text-gray-500 mt-1">{{ generationProgress }}%</div>
          </div>
          
          <!-- Список вариантов -->
          <div v-else class="space-y-2">
            <div 
              v-for="(variant, index) in variants" 
              :key="variant.id"
              class="p-3 rounded-lg cursor-pointer transition-all"
              :class="[
                activeVariantId === variant.id 
                  ? 'bg-[#2563EB]/20 border border-[#2563EB]' 
                  : 'bg-[#18181B] border border-transparent hover:border-[#26272A]'
              ]"
              @click="selectVariant(variant)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div 
                    class="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                    :class="activeVariantId === variant.id ? 'bg-[#2563EB] text-white' : 'bg-[#26272A] text-gray-400'"
                  >
                    {{ index + 1 }}
                  </div>
                  <div>
                    <div class="text-white text-sm font-medium">{{ variant.name }}</div>
                    <div class="text-xs text-gray-500">{{ variant.description || 'Вариант планировки' }}</div>
                  </div>
                </div>
                <div v-if="activeVariantId === variant.id" class="text-[#2563EB]">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Пустое состояние -->
            <div v-if="variants.length === 0" class="text-center py-4">
              <svg class="w-8 h-8 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div class="text-sm text-gray-400">Нет вариантов</div>
              <Button 
                label="Сгенерировать" 
                size="small"
                class="mt-2 bg-[#2563EB] hover:bg-[#1d4ed8] border-none text-xs"
                @click="showVariantsDialog = true"
              />
            </div>
          </div>
        </div>

        <!-- Информация о планировке -->
        <div class="bg-[#26272A] rounded-xl p-4 border border-[#26272A]">
          <h3 class="text-base font-semibold text-white mb-3">Информация</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <div class="text-xs text-gray-400">Площадь</div>
              <div class="text-white font-semibold">{{ totalArea.toFixed(1) }} м²</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-xs text-gray-400">Комнат</div>
              <div class="text-white font-medium">{{ roomsCount }}</div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-xs text-gray-400">Проверка</div>
              <span 
                :class="[
                  'px-2 py-0.5 rounded text-xs font-medium',
                  validationStatus === 'valid' ? 'bg-green-500/20 text-green-400' :
                  validationStatus === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  validationStatus === 'error' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                ]"
              >
                {{ getValidationLabel() }}
              </span>
            </div>
          </div>
        </div>

        <!-- Быстрые действия -->
        <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A]">
          <h3 class="text-lg font-semibold text-white mb-4">Действия</h3>
          <div class="space-y-2">
            <Button 
              label="Изменить название" 
              icon="pi pi-pencil" 
              outlined
              class="w-full justify-start border-[#26272A] text-white hover:bg-[#27272A]"
              @click="showNameDialog = true"
            />
            <Button 
              label="Экспорт PDF" 
              icon="pi pi-file-pdf" 
              outlined
              class="w-full justify-start border-[#26272A] text-white hover:bg-[#27272A]"
              @click="exportPDF"
            />
            <Button 
              label="Дублировать" 
              icon="pi pi-copy" 
              outlined
              class="w-full justify-start border-[#26272A] text-white hover:bg-[#27272A]"
              @click="duplicatePlan"
            />
            <Button 
              label="Удалить" 
              icon="pi pi-trash" 
              outlined
              severity="danger"
              class="w-full justify-start border-[#26272A] text-red-400 hover:bg-red-500/20"
              @click="confirmDelete"
            />
          </div>
        </div>

        <!-- История изменений -->
        <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A]">
          <h3 class="text-lg font-semibold text-white mb-4">История</h3>
          <div class="space-y-3 text-sm">
            <div v-for="(change, index) in recentChanges" :key="index" class="text-gray-400">
              <div class="flex items-center gap-2 mb-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-gray-500">{{ formatTime(change.time) }}</span>
              </div>
              <div class="text-white">{{ change.action }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Диалог изменения названия -->
    <Dialog 
      v-model:visible="showNameDialog" 
      modal 
      header="Изменить название"
      :style="{ width: '400px' }"
      class="p-fluid"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-white mb-2">Название</label>
          <InputText 
            v-model="editPlanName" 
            placeholder="Название планировки"
            class="w-full bg-[#18181B] border-[#26272A] text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-2">Описание</label>
          <Textarea 
            v-model="editPlanDescription" 
            placeholder="Описание планировки"
            rows="3"
            class="w-full bg-[#18181B] border-[#26272A] text-white"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button label="Отмена" outlined class="border-[#26272A] text-white hover:bg-[#27272A]" @click="showNameDialog = false" />
          <Button label="Сохранить" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none" @click="updatePlanName" />
        </div>
      </template>
    </Dialog>

    <!-- Диалог генерации вариантов -->
    <Dialog 
      v-model:visible="showVariantsDialog" 
      modal 
      header="Генерация вариантов планировки"
      :style="{ width: '550px' }"
    >
      <div class="space-y-4">
        <p class="text-gray-400">
          ИИ создаст альтернативные варианты планировки с учётом эргономики и строительных норм.
        </p>
        
        <!-- Количество вариантов -->
        <div>
          <label class="block text-sm font-medium text-white mb-2">Количество вариантов</label>
          <div class="flex gap-2">
            <button 
              v-for="n in [3, 4, 5]" 
              :key="n"
              class="flex-1 py-3 rounded-lg font-semibold transition-all"
              :class="variantsCount === n 
                ? 'bg-[#2563EB] text-white' 
                : 'bg-[#18181B] text-gray-400 hover:bg-[#26272A]'"
              @click="variantsCount = n"
            >
              {{ n }}
            </button>
          </div>
        </div>
        
        <!-- Опции генерации -->
        <div>
          <label class="block text-sm font-medium text-white mb-3">Параметры генерации</label>
          <div class="space-y-2">
            <label class="flex items-center gap-3 p-3 bg-[#18181B] rounded-lg cursor-pointer hover:bg-[#26272A]">
              <input type="checkbox" v-model="genOptions.keepWalls" class="accent-[#2563EB]">
              <div>
                <div class="text-white text-sm">Сохранить несущие стены</div>
                <div class="text-gray-500 text-xs">Варианты не будут менять капитальные стены</div>
              </div>
            </label>
            <label class="flex items-center gap-3 p-3 bg-[#18181B] rounded-lg cursor-pointer hover:bg-[#26272A]">
              <input type="checkbox" v-model="genOptions.keepWetZones" class="accent-[#2563EB]">
              <div>
                <div class="text-white text-sm">Сохранить мокрые зоны</div>
                <div class="text-gray-500 text-xs">Санузел и кухня останутся на месте</div>
              </div>
            </label>
            <label class="flex items-center gap-3 p-3 bg-[#18181B] rounded-lg cursor-pointer hover:bg-[#26272A]">
              <input type="checkbox" v-model="genOptions.optimizeArea" class="accent-[#2563EB]">
              <div>
                <div class="text-white text-sm">Оптимизировать площадь</div>
                <div class="text-gray-500 text-xs">Максимизировать полезную площадь комнат</div>
              </div>
            </label>
          </div>
        </div>
        
        <!-- Предупреждение -->
        <div class="bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-lg p-3">
          <p class="text-[#60A5FA] text-sm flex items-start gap-2">
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Генерация займёт около 30-60 секунд. Вы сможете переключаться между вариантами после завершения.
          </p>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button label="Отмена" outlined class="border-[#26272A] text-white hover:bg-[#27272A]" @click="showVariantsDialog = false" />
          <Button 
            :label="`Сгенерировать ${variantsCount} вариантов`" 
            icon="pi pi-magic"
            class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none"
            :loading="generatingVariants"
            @click="generateVariants"
          />
        </div>
      </template>
    </Dialog>

    <!-- Диалог оформления в БТИ -->
    <Dialog 
      v-model:visible="showBTIDialog" 
      modal 
      header="Оформление через БТИ"
      :style="{ width: '500px' }"
    >
      <div class="space-y-4">
        <p class="text-gray-400">Выберите услугу для оформления документов:</p>
        
        <div class="space-y-3">
          <div 
            v-for="service in btiServices" 
            :key="service.id"
            class="p-4 border border-[#26272A] rounded-lg hover:border-[#2563EB] cursor-pointer transition-colors"
            :class="{ 'border-[#2563EB] bg-[#2563EB]/10': selectedService === service.id }"
            @click="selectedService = service.id"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="text-white font-semibold mb-1">{{ service.name }}</div>
                <div class="text-gray-400 text-sm">{{ service.description }}</div>
              </div>
              <div class="text-white font-bold ml-4">{{ service.price }}</div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-[#26272A]">
          <label class="block text-sm font-medium text-white mb-2">Ваше имя</label>
          <InputText 
            v-model="btiForm.name" 
            placeholder="Иван Иванов"
            class="w-full bg-[#18181B] border-[#26272A] text-white mb-3"
          />
          <label class="block text-sm font-medium text-white mb-2">Телефон</label>
          <InputText 
            v-model="btiForm.phone" 
            placeholder="+7 (999) 123-45-67"
            class="w-full bg-[#18181B] border-[#26272A] text-white mb-3"
          />
          <label class="block text-sm font-medium text-white mb-2">Email</label>
          <InputText 
            v-model="btiForm.email" 
            type="email"
            placeholder="ivan@example.com"
            class="w-full bg-[#18181B] border-[#26272A] text-white mb-3"
          />
          <label class="block text-sm font-medium text-white mb-2">Комментарий</label>
          <Textarea 
            v-model="btiForm.comment" 
            placeholder="Дополнительная информация..."
            rows="3"
            class="w-full bg-[#18181B] border-[#26272A] text-white"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button label="Отмена" outlined class="border-[#26272A] text-white hover:bg-[#27272A]" @click="showBTIDialog = false" />
          <Button 
            label="Отправить заявку" 
            :disabled="!selectedService || !btiForm.name || !btiForm.phone"
            class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none"
            @click="submitBTIRequest"
          />
        </div>
      </template>
    </Dialog>

    <!-- Диалог удаления -->
    <Dialog 
      v-model:visible="showDeleteDialog" 
      modal 
      header="Удаление планировки"
      :style="{ width: '400px' }"
    >
      <p class="text-white mb-4">Вы уверены, что хотите удалить эту планировку?</p>
      <p class="text-gray-400 text-sm mb-6">Это действие нельзя отменить.</p>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button label="Отмена" outlined class="border-[#26272A] text-white hover:bg-[#27272A]" @click="showDeleteDialog = false" />
          <Button label="Удалить" severity="danger" class="border-none" @click="deletePlan" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'panel'
})

import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, useCookie } from '#imports'
import { api as useApiStore } from '@/store/api'

const route = useRoute()
const router = useRouter()
const apiStore = useApiStore()
const accessToken = useCookie('access_token')
const workspaceId = useCookie('workspace_id')

const planId = route.params.id  // UUID строка из URL
const editor = ref(null)
const floorPlan = ref(null)
const scene = ref(null)
const loading = ref(true)
const sceneLoading = ref(false)
const recognitionResult = ref(null)

const planName = ref('')
const planDescription = ref('')
const editPlanName = ref('')
const editPlanDescription = ref('')
const totalArea = ref(0)
const roomsCount = ref(0)
const validationStatus = ref('valid') // 'valid', 'warning', 'error'

const showNameDialog = ref(false)
const showVariantsDialog = ref(false)
const showBTIDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedService = ref(null)
const saving = ref(false)
const deleting = ref(false)

// Варианты планировки
const variants = ref([])
const activeVariantId = ref(null)
const generatingVariants = ref(false)
const generationProgress = ref(0)
const variantsCount = ref(3)
const genOptions = ref({
  keepWalls: true,
  keepWetZones: true,
  optimizeArea: false
})

const btiServices = [
  {
    id: 1,
    name: 'Консультация',
    description: 'Устная консультация по перепланировке',
    price: 'от 2 000 ₽'
  },
  {
    id: 2,
    name: 'Оформление документации',
    description: 'Подготовка всех необходимых документов',
    price: 'от 15 000 ₽'
  },
  {
    id: 3,
    name: 'Выезд эксперта',
    description: 'Выезд специалиста на объект',
    price: 'от 5 000 ₽'
  },
  {
    id: 4,
    name: 'Полный комплекс',
    description: 'Вся документация + выезд + оформление',
    price: 'от 30 000 ₽'
  }
]

const btiForm = ref({
  name: '',
  phone: '',
  email: '',
  comment: ''
})

const recentChanges = ref([
  { action: 'Стена добавлена', time: new Date(Date.now() - 5 * 60 * 1000) },
  { action: 'Мебель размещена', time: new Date(Date.now() - 15 * 60 * 1000) },
  { action: 'Планировка создана', time: new Date(Date.now() - 60 * 60 * 1000) }
])

function getValidationLabel() {
  const labels = {
    valid: 'Все в порядке',
    warning: 'Требует внимания',
    error: 'Нарушения найдены'
  }
  return labels[validationStatus.value] || 'Проверка...'
}

// Генерация вариантов планировки через API
async function generateVariants() {
  try {
    generatingVariants.value = true
    generationProgress.value = 0
    showVariantsDialog.value = false
    
    console.log('🎨 Starting AI generation with', variantsCount.value, 'variants')
    
    // Получаем текущие элементы сцены
    const currentElements = editor.value?.getSceneElements ? editor.value.getSceneElements() : null
    
    // Запускаем генерацию через API POST /ai/generate
    const genResult = await $fetch(`${apiStore.url}api/v1/ai/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: {
        scene_id: scene.value?.id || undefined,
        floor_plan_id: scene.value?.floor_plan_id || floorPlan.value?.id || planId,
        variants_count: variantsCount.value,
        options: {
          preserve_load_bearing_walls: genOptions.value.keepWalls,
          preserve_wet_zones: genOptions.value.keepWetZones,
          optimize_space: genOptions.value.optimizeArea
        },
        current_elements: currentElements
      }
    })
    
    const data = genResult.data || genResult
    const jobId = data.job_id
    
    console.log('📋 Generation job started:', jobId)
    
    if (jobId) {
      // Polling статуса генерации GET /ai/generate/{job_id}/status
      await pollGenerationStatus(jobId)
    } else if (data.variants) {
      // Если варианты вернулись сразу (синхронно)
      applyGeneratedVariants(data.variants)
    } else {
      console.warn('No job_id returned, creating mock variants')
      await createMockVariants()
    }
  } catch (error) {
    console.error('Ошибка генерации вариантов:', error)
    await createMockVariants()
  } finally {
    generatingVariants.value = false
    generationProgress.value = 100
  }
}

async function pollGenerationStatus(jobId) {
  let attempts = 0
  const maxAttempts = 60 // 2 минуты максимум
  
  console.log('⏳ Polling generation status for job:', jobId)
  
  while (attempts < maxAttempts) {
    try {
      // GET /ai/generate/{job_id}/status
      const result = await $fetch(`${apiStore.url}api/v1/ai/generate/${jobId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = result.data || result
      generationProgress.value = data.progress || Math.min(attempts * 3, 95)
      
      console.log(`📊 Generation progress: ${generationProgress.value}%, status: ${data.status}`)
      
      if (data.status === 'completed') {
        console.log('✅ Generation completed!')
        
        if (data.variants && data.variants.length > 0) {
          applyGeneratedVariants(data.variants)
        } else if (data.result?.variants) {
          applyGeneratedVariants(data.result.variants)
        } else {
          console.warn('No variants in response, creating mock')
          await createMockVariants()
        }
        return
      }
      
      if (data.status === 'failed') {
        console.error('❌ Генерация не удалась:', data.error || data.message)
        await createMockVariants()
        return
      }
      
      // Ждём 2 секунды перед следующим запросом
      await new Promise(resolve => setTimeout(resolve, 2000))
      attempts++
    } catch (e) {
      console.error('Ошибка polling:', e)
      attempts++
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  
  console.warn('⏰ Generation timeout, creating mock variants')
  await createMockVariants()
}

// Применяем сгенерированные варианты
function applyGeneratedVariants(generatedVariants) {
  console.log('🎨 Applying', generatedVariants.length, 'generated variants')
  
  variants.value = generatedVariants.map((v, i) => ({
    id: v.id || `variant_${Date.now()}_${i + 1}`,
    name: v.name || `Вариант ${i + 1}`,
    description: v.description || getVariantDescription(i),
    elements: v.elements,
    score: v.score,
    preview: v.preview_url
  }))
  
  // Добавляем текущую планировку как первый вариант (оригинал)
  const currentElements = editor.value?.getSceneElements ? editor.value.getSceneElements() : null
  if (currentElements) {
    variants.value.unshift({
      id: 'original',
      name: 'Текущая',
      description: 'Текущая планировка',
      elements: currentElements,
      isOriginal: true
    })
  }
  
  // Активируем первый вариант
  if (variants.value.length > 0) {
    activeVariantId.value = variants.value[0].id
  }
}

async function createMockVariants() {
  // Создаём демонстрационные варианты на основе текущей планировки
  const count = variantsCount.value
  const newVariants = []
  
  for (let i = 0; i < count; i++) {
    generationProgress.value = Math.round((i + 1) / count * 100)
    
    newVariants.push({
      id: `variant_${Date.now()}_${i + 1}`,
      name: `Вариант ${i + 1}`,
      description: getVariantDescription(i),
      elements: null, // Будем использовать текущие элементы с модификациями
      isOriginal: i === 0
    })
    
    await new Promise(resolve => setTimeout(resolve, 300))
  }
  
  variants.value = newVariants
  
  // Активируем первый вариант
  if (newVariants.length > 0) {
    activeVariantId.value = newVariants[0].id
  }
}

function getVariantDescription(index) {
  const descriptions = [
    'Текущая планировка',
    'Увеличенная гостиная',
    'Открытая кухня-студия',
    'Дополнительная комната',
    'Оптимизированное пространство'
  ]
  return descriptions[index] || `Альтернативный вариант ${index + 1}`
}

async function selectVariant(variant) {
  if (activeVariantId.value === variant.id) return
  
  activeVariantId.value = variant.id
  
  // Если у варианта есть элементы - загружаем их
  if (variant.elements && editor.value?.loadSceneElements) {
    editor.value.loadSceneElements({ elements: variant.elements }, null)
  }
  
  // Обновляем историю изменений
  recentChanges.value.unshift({
    action: `Переключено на "${variant.name}"`,
    time: new Date()
  })
  
  // Ограничиваем историю
  if (recentChanges.value.length > 10) {
    recentChanges.value = recentChanges.value.slice(0, 10)
  }
}

function formatTime(date) {
  if (!date) return ''
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'только что'
  if (minutes < 60) return `${minutes} мин. назад`
  if (hours < 24) return `${hours} ч. назад`
  return `${days} дн. назад`
}

// ============================================================================
// ГЛАВНАЯ ФУНКЦИЯ ЗАГРУЗКИ
// 
// 1. GET /workspaces/{workspace_id}/scenes - список сцен
// 2. Находим сцену по id из URL
// 3. Берём floor_plan_id из сцены
// 4. GET /floor-plans/{floor_plan_id} - получаем модель
// ============================================================================

async function loadFloorPlan() {
  try {
    loading.value = true
    
    // Проверяем, это свежее создание (есть флаг в localStorage)?
    const isNewlyCreated = typeof localStorage !== 'undefined' && 
      localStorage.getItem(`newly_created_${planId}`)
    
    if (isNewlyCreated) {
      // СОЗДАНИЕ: используем recognition-status (planId = floor_plan_id)
      console.log('🆕 Newly created floor plan - using recognition-status')
      localStorage.removeItem(`newly_created_${planId}`)
      await loadFromRecognitionStatus()
    } else {
      // ОТКРЫТИЕ: сначала ищем сцену, из неё берём floor_plan_id
      console.log('📂 Opening - loading scene first')
      await loadFromScenes()
    }
    
  } catch (error) {
    console.error('❌ Error loading floor plan:', error)
    planName.value = `Планировка #${planId}`
    editPlanName.value = planName.value
  } finally {
    loading.value = false
  }
}

// ОТКРЫТИЕ: 2 запроса - scenes → floor-plans
async function loadFromScenes() {
  if (!workspaceId.value) {
    console.log('⚠️ No workspace_id')
    return
  }
  
  // ========== ЗАПРОС 1: Получаем сцены ==========
  console.log('📡 [1/2] GET /workspaces/' + workspaceId.value + '/scenes')
  
  const scenesResult = await $fetch(`${apiStore.url}api/v1/workspaces/${workspaceId.value}/scenes`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken.value}`,
      'Content-Type': 'application/json'
    }
  })
  
  let scenes = scenesResult.data?.items || scenesResult.data?.scenes || scenesResult.data || scenesResult.scenes || scenesResult
  if (!Array.isArray(scenes)) scenes = []
  
  console.log('📋 Scenes:', scenes.map(s => ({ id: s.id, floor_plan_id: s.floor_plan_id, name: s.name })))
  console.log('🔎 Looking for planId:', planId)
  
  // Ищем сцену: сначала по floor_plan_id (если пришли из list.vue), потом по id (если пришли из create.vue)
  let targetScene = scenes.find(s => String(s.floor_plan_id) === String(planId))
  
  if (!targetScene) {
    // Может planId это scene_id?
    targetScene = scenes.find(s => String(s.id) === String(planId))
  }
  
  if (!targetScene) {
    console.log('❌ Scene not found for:', planId)
    return
  }
  
  console.log('✅ Found scene:', targetScene.name, '| floor_plan_id:', targetScene.floor_plan_id)
  
  scene.value = targetScene
  planName.value = targetScene.name || 'Планировка'
  planDescription.value = targetScene.description || ''
  editPlanName.value = planName.value
  editPlanDescription.value = planDescription.value
  
  // ========== ЗАПРОС 2: Получаем модель по floor_plan_id ==========
  const floorPlanId = targetScene.floor_plan_id
  
  if (!floorPlanId) {
    console.log('❌ Scene has no floor_plan_id!')
    return
  }
  
  console.log('📡 [2/2] GET /floor-plans/' + floorPlanId)
  
  const fpResult = await $fetch(`${apiStore.url}api/v1/floor-plans/${floorPlanId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken.value}`,
      'Content-Type': 'application/json'
    }
  })
  
  const fp = fpResult.data || fpResult
  floorPlan.value = fp
  
  console.log('✅ Floor plan loaded:', fp.name, '| has model:', !!fp.model)
  
  // Применяем модель к редактору
  if (fp.model) {
    console.log('🎨 Model:', { walls: fp.model.walls?.length, rooms: fp.model.rooms?.length })
    
    recognitionResult.value = fp.model
    
    if (fp.model.rooms) {
      roomsCount.value = fp.model.rooms.length
      totalArea.value = fp.model.rooms.reduce((sum, r) => sum + (r.area || 0), 0)
    }
    if (fp.model.total_area) {
      totalArea.value = fp.model.total_area
    }
    
    applyRecognitionResult(fp.model)
  }
  
  // Загружаем ветки
  await loadBranches()
}

// Fallback: GET /floor-plans/{id} напрямую (если planId это floor_plan_id)
async function loadFromFloorPlan() {
  console.log('🏠 GET /floor-plans/' + planId)
  
  const result = await $fetch(`${apiStore.url}api/v1/floor-plans/${planId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken.value}`,
      'Content-Type': 'application/json'
    }
  })
  
  floorPlan.value = result.data || result
  planName.value = floorPlan.value.name || `Планировка #${planId}`
  planDescription.value = floorPlan.value.description || ''
  editPlanName.value = planName.value
  editPlanDescription.value = planDescription.value
  
  if (floorPlan.value.workspace_id) {
    workspaceId.value = floorPlan.value.workspace_id
  }
  
  console.log('✅ Floor plan loaded:', {
    id: floorPlan.value.id,
    name: floorPlan.value.name,
    has_model: !!floorPlan.value.model
  })
  
  // Модель в поле "model"
  if (floorPlan.value.model) {
    console.log('🎨 Applying model from floor plan:', {
      walls: floorPlan.value.model.walls?.length || 0,
      rooms: floorPlan.value.model.rooms?.length || 0,
      openings: floorPlan.value.model.openings?.length || 0
    })
    
    recognitionResult.value = floorPlan.value.model
    
    // Статистика
    if (floorPlan.value.model.rooms) {
      roomsCount.value = floorPlan.value.model.rooms.length
      totalArea.value = floorPlan.value.model.rooms.reduce((sum, r) => sum + (r.area || 0), 0)
    }
    if (floorPlan.value.model.total_area) {
      totalArea.value = floorPlan.value.model.total_area
    }
    
    applyRecognitionResult(floorPlan.value.model)
    await findOrCreateScene()
    return
  }
  
  // Fallback: старые поля
  if (floorPlan.value.recognition_result) {
    recognitionResult.value = floorPlan.value.recognition_result
    applyRecognitionResult(floorPlan.value.recognition_result)
    await findOrCreateScene()
    return
  }
  
  if (floorPlan.value.elements) {
    applySceneElements({ elements: floorPlan.value.elements })
    await findOrCreateScene()
    return
  }
  
  console.log('⚠️ No model in floor plan response')
  await findOrCreateScene()
}

// СОЗДАНИЕ: GET /floor-plans/{id}/recognition-status - модель из распознавания
async function loadFromRecognitionStatus() {
  // Сначала получаем базовую инфу
  const fpResult = await $fetch(`${apiStore.url}api/v1/floor-plans/${planId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken.value}`,
      'Content-Type': 'application/json'
    }
  })
  
  floorPlan.value = fpResult.data || fpResult
  planName.value = floorPlan.value.name || `Планировка #${planId}`
  planDescription.value = floorPlan.value.description || ''
  editPlanName.value = planName.value
  editPlanDescription.value = planDescription.value
  
  if (floorPlan.value.workspace_id) {
    workspaceId.value = floorPlan.value.workspace_id
  }
  
  // Теперь получаем модель из recognition-status
  console.log('🤖 GET /floor-plans/' + planId + '/recognition-status')
  await loadRecognitionStatus()
}

// GET /floor-plans/{id}/recognition-status
async function loadRecognitionStatus() {
  try {
    const result = await $fetch(`${apiStore.url}api/v1/floor-plans/${planId}/recognition-status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = result.data || result
    console.log('📊 Recognition status:', data.status)
    
    if (data.status === 'completed' && data.result) {
      console.log('✅ Recognition completed - 3D model received')
      recognitionResult.value = data.result
      
      // Обновляем статистику
      if (data.result.rooms) {
        roomsCount.value = data.result.rooms.length
        totalArea.value = data.result.rooms.reduce((sum, room) => sum + (room.area || 0), 0)
      }
      if (data.result.total_area) {
        totalArea.value = data.result.total_area
      }
      
      // Применяем 3D модель к редактору
      applyRecognitionResult(data.result)
      
      // Ищем существующую сцену
      await findOrCreateScene()
      return
    }
    
    if (data.status === 'processing' || data.status === 'pending' || data.status === 'queued') {
      console.log('⏳ Recognition in progress, polling...')
      await pollRecognitionStatus()
      return
    }
    
    if (data.status === 'failed') {
      console.error('❌ Recognition failed:', data.error)
    }
    
    // Fallback - ищем сцену напрямую
    await findOrCreateScene()
    
  } catch (error) {
    console.error('⚠️ Recognition status error:', error)
    await findOrCreateScene()
  }
}

// Polling GET /floor-plans/{id}/recognition-status
async function pollRecognitionStatus() {
  let attempts = 0
  const maxAttempts = 60
  
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    attempts++
    
    try {
      const result = await $fetch(`${apiStore.url}api/v1/floor-plans/${planId}/recognition-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = result.data || result
      console.log(`⏳ Polling attempt ${attempts}: status = ${data.status}`)
      
      if (data.status === 'completed' && data.result) {
        console.log('✅ Recognition completed after polling')
        recognitionResult.value = data.result
        
        if (data.result.rooms) {
          roomsCount.value = data.result.rooms.length
          totalArea.value = data.result.rooms.reduce((sum, room) => sum + (room.area || 0), 0)
        }
        
        applyRecognitionResult(data.result)
        await findOrCreateScene()
        return
      }
      
      if (data.status === 'failed') {
        console.error('❌ Recognition failed during polling')
        break
      }
    } catch (e) {
      console.error('Polling error:', e)
    }
  }
  
  await findOrCreateScene()
}

// GET /ai/recognize/{job_id}/status
async function loadRecognitionByJobId(jobId) {
  console.log('📡 [2/5] Loading recognition by job_id:', jobId)
  
  try {
    const result = await $fetch(`${apiStore.url}api/v1/ai/recognize/${jobId}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = result.data || result
    
    if (data.status === 'completed' && data.result) {
      console.log('✅ Recognition completed via job_id')
      recognitionResult.value = data.result
      applyRecognitionResult(data.result)
      await findOrCreateScene()
      return
    }
    
    if (data.status === 'processing' || data.status === 'pending') {
      await pollRecognitionByJobId(jobId)
      return
    }
    
    await findOrCreateScene()
  } catch (error) {
    console.error('Error loading recognition by job_id:', error)
    await findOrCreateScene()
  }
}

// Polling через job_id (GET /ai/recognize/{job_id}/status)
async function pollRecognitionByJobId(jobId) {
  let attempts = 0
  const maxAttempts = 60
  
  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000))
    attempts++
    
    try {
      const result = await $fetch(`${apiStore.url}api/v1/ai/recognize/${jobId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = result.data || result
      
      if (data.status === 'completed' && data.result) {
        console.log('✅ Recognition completed via job_id polling')
        recognitionResult.value = data.result
        applyRecognitionResult(data.result)
        await findOrCreateScene()
        return
      }
      
      if (data.status === 'failed') {
        break
      }
    } catch (e) {
      console.error('Polling error:', e)
    }
  }
  
  await findOrCreateScene()
}

// Ищем существующую сцену или используем recognition result
async function findOrCreateScene() {
  if (!workspaceId.value) {
    console.log('⚠️ No workspace_id, skipping scene load')
    return
  }
  
  console.log('🔍 [3/5] Looking for scene in workspace:', workspaceId.value)
  
  try {
    // GET /workspaces/{workspace_id}/scenes
    const result = await $fetch(`${apiStore.url}api/v1/workspaces/${workspaceId.value}/scenes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    let scenes = result.data?.items || result.data?.scenes || result.data || result.scenes || result
    if (!Array.isArray(scenes)) scenes = []
    
    // Ищем сцену для этого floor_plan (приводим к одному типу для сравнения)
    const matchingScene = scenes.find(s => String(s.floor_plan_id) === String(planId))
    
    if (matchingScene) {
      console.log('✅ Found scene:', matchingScene.id)
      await loadSceneById(matchingScene.id)
    } else {
      console.log('⚠️ No scene found for this floor plan')
    }
  } catch (error) {
    console.error('Error finding scene:', error)
  }
}

// GET /scenes/{id}
async function loadSceneById(sceneId) {
  try {
    console.log('🎮 [4/5] GET /scenes/' + sceneId)
    
    const sceneDetails = await $fetch(`${apiStore.url}api/v1/scenes/${sceneId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    scene.value = sceneDetails.data || sceneDetails
    console.log('✅ Scene loaded:', scene.value.id, 'floor_plan_id:', scene.value.floor_plan_id)
    
    // ВАЖНО: Если у сцены есть floor_plan_id и модель ещё не загружена - загружаем!
    if (scene.value.floor_plan_id && !recognitionResult.value) {
      console.log('📦 Loading model from scene.floor_plan_id:', scene.value.floor_plan_id)
      await loadModelByFloorPlanId(scene.value.floor_plan_id)
    }
    
    // Если сцена имеет elements - применяем
    if (scene.value.elements) {
      if (scene.value.elements.rooms) {
        roomsCount.value = scene.value.elements.rooms.length
        totalArea.value = scene.value.elements.rooms.reduce((sum, room) => sum + (room.area || 0), 0)
      }
      
      // Применяем elements сцены к редактору
      applySceneElements(scene.value)
    } else if (recognitionResult.value) {
      // Если у сцены нет elements, но есть recognition - применяем его
      applyRecognitionResult(recognitionResult.value)
    }
    
    // Загружаем ветки (варианты) и проверку compliance
    await Promise.all([
      loadBranches(),
      loadSceneCompliance()
    ])
    
  } catch (error) {
    console.error('❌ Error loading scene:', error)
  }
}

// Загрузка модели по floor_plan_id
async function loadModelByFloorPlanId(floorPlanId) {
  console.log('🚀 loadModelByFloorPlanId called with:', floorPlanId, 'type:', typeof floorPlanId)
  
  if (!floorPlanId) {
    console.error('❌ floorPlanId is empty!')
    return
  }
  
  try {
    console.log('🏠 GET /floor-plans/' + floorPlanId)
    
    const result = await $fetch(`${apiStore.url}api/v1/floor-plans/${floorPlanId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    const fp = result.data || result
    
    if (fp.model) {
      console.log('✅ Model loaded from floor_plan:', {
        walls: fp.model.walls?.length || 0,
        rooms: fp.model.rooms?.length || 0
      })
      
      recognitionResult.value = fp.model
      
      // Обновляем статистику
      if (fp.model.rooms) {
        roomsCount.value = fp.model.rooms.length
        totalArea.value = fp.model.rooms.reduce((sum, r) => sum + (r.area || 0), 0)
      }
      if (fp.model.total_area) {
        totalArea.value = fp.model.total_area
      }
      
      // Применяем к редактору
      applyRecognitionResult(fp.model)
    }
  } catch (error) {
    console.error('❌ Error loading model by floor_plan_id:', error)
  }
}

// Применение elements сцены к редактору
function applySceneElements(sceneData) {
  if (!sceneData?.elements) return
  
  console.log('🎨 Applying scene elements:', {
    walls: sceneData.elements.walls?.length || 0,
    rooms: sceneData.elements.rooms?.length || 0
  })
  
  const passToEditor = () => {
    if (editor.value?.isReady?.value && editor.value?.loadSceneElements) {
      editor.value.loadSceneElements(sceneData, null)
      return true
    }
    if (editor.value?.loadSceneElements) {
      editor.value.loadSceneElements(sceneData, null)
      return true
    }
    return false
  }
  
  if (!passToEditor()) {
    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      if (passToEditor() || attempts >= 20) {
        clearInterval(interval)
      }
    }, 300)
  }
}

// GET /scenes/{scene_id}/branches - загрузка веток (вариантов)
async function loadBranches() {
  if (!scene.value?.id) return
  
  console.log('🌿 [5/5] Loading branches for scene:', scene.value.id)
  
  try {
    const result = await $fetch(`${apiStore.url}api/v1/scenes/${scene.value.id}/branches`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    const branches = result.data?.items || result.data || result.branches || []
    console.log('✅ Loaded', branches.length, 'branches')
    
    if (branches.length > 0) {
      variants.value = branches.map((b, i) => ({
        id: b.id,
        name: b.name || `Вариант ${i + 1}`,
        description: b.description,
        elements: b.elements,
        isActive: b.is_active
      }))
      
      // Находим активную ветку
      const active = branches.find(b => b.is_active)
      if (active) {
        activeVariantId.value = active.id
      } else if (variants.value.length > 0) {
        activeVariantId.value = variants.value[0].id
      }
    }
  } catch (error) {
    console.log('⚠️ Could not load branches:', error.message)
  }
}

// GET /scenes/{id}/compliance - проверка соответствия нормам
async function loadSceneCompliance() {
  if (!scene.value?.id) return
  
  try {
    const result = await $fetch(`${apiStore.url}api/v1/scenes/${scene.value.id}/compliance`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = result.data || result
    
    if (data.compliant !== undefined) {
      validationStatus.value = data.compliant ? 'valid' : 'error'
    } else if (data.violations && data.violations.length > 0) {
      validationStatus.value = 'error'
    } else if (data.warnings && data.warnings.length > 0) {
      validationStatus.value = 'warning'
    } else {
      validationStatus.value = 'valid'
    }
    
    console.log('📋 Compliance status:', validationStatus.value)
  } catch (error) {
    console.log('⚠️ Compliance check not available')
  }
}

// POST /scenes/{scene_id}/branches - создание новой ветки
async function createBranch(name, description = '') {
  if (!scene.value?.id) return null
  
  try {
    const result = await $fetch(`${apiStore.url}api/v1/scenes/${scene.value.id}/branches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: {
        name,
        description,
        elements: editor.value?.getSceneElements ? editor.value.getSceneElements() : null
      }
    })
    
    const branch = result.data || result
    console.log('✅ Branch created:', branch.id)
    
    // Добавляем в список
    variants.value.push({
      id: branch.id,
      name: branch.name,
      description: branch.description,
      elements: branch.elements,
      isActive: false
    })
    
    return branch
  } catch (error) {
    console.error('Error creating branch:', error)
    return null
  }
}

// POST /scenes/{scene_id}/branches/{id}/activate - активация ветки
async function activateBranch(branchId) {
  if (!scene.value?.id) return
  
  try {
    await $fetch(`${apiStore.url}api/v1/scenes/${scene.value.id}/branches/${branchId}/activate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    // Обновляем активную ветку
    variants.value.forEach(v => {
      v.isActive = v.id === branchId
    })
    activeVariantId.value = branchId
    
    console.log('✅ Branch activated:', branchId)
  } catch (error) {
    console.error('Error activating branch:', error)
  }
}

// GET /floor-plans/{id}/download-url - получение URL для скачивания
async function getDownloadUrl() {
  const fpId = scene.value?.floor_plan_id || floorPlan.value?.id || planId
  try {
    const result = await $fetch(`${apiStore.url}api/v1/floor-plans/${fpId}/download-url`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = result.data || result
    return data.url || data.download_url
  } catch (error) {
    console.error('Error getting download URL:', error)
    return null
  }
}


// Применение результата распознавания к 3D редактору
function applyRecognitionResult(result) {
  if (!result) {
    console.warn('⚠️ No recognition result to apply')
    return
  }
  
  console.log('🎨 Applying recognition result to 3D editor:', {
    walls: result.walls?.length || 0,
    rooms: result.rooms?.length || 0,
    openings: result.openings?.length || 0,
    total_area: result.total_area
  })
  
  // Обновляем площадь и количество комнат
  if (result.rooms) {
    roomsCount.value = result.rooms.length
    totalArea.value = result.rooms.reduce((sum, room) => sum + (room.area || 0), 0)
  }
  
  // Если есть total_area в результате - используем его
  if (result.total_area) {
    totalArea.value = result.total_area
  }
  
  // Функция для передачи данных в редактор
  const passToEditor = () => {
    // Проверяем что редактор готов
    if (editor.value?.isReady?.value && editor.value?.loadSceneElements) {
      console.log('🚀 Editor ready, passing data to loadSceneElements()')
      editor.value.loadSceneElements(null, result)
      return true
    }
    // Fallback - проверяем только наличие метода
    if (editor.value?.loadSceneElements) {
      console.log('🚀 Passing data to loadSceneElements() (fallback)')
      editor.value.loadSceneElements(null, result)
      return true
    }
    return false
  }
  
  // Пробуем сразу передать в редактор
  if (!passToEditor()) {
    // Если редактор ещё не готов - ждём с несколькими попытками
    let attempts = 0
    const maxAttempts = 20 // Увеличиваем количество попыток
    
    const interval = setInterval(() => {
      attempts++
      console.log(`⏳ Waiting for editor... attempt ${attempts}/${maxAttempts}`)
      
      if (passToEditor() || attempts >= maxAttempts) {
        clearInterval(interval)
        if (attempts >= maxAttempts) {
          console.warn('⚠️ Editor not ready after max attempts')
        }
      }
    }, 300) // Уменьшаем интервал
  }
}

async function updatePlanName() {
  const fpId = scene.value?.floor_plan_id || floorPlan.value?.id || planId
  try {
    saving.value = true
    await $fetch(`${apiStore.url}api/v1/floor-plans/${fpId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: {
        name: editPlanName.value,
        description: editPlanDescription.value || undefined
      }
    })
    
    planName.value = editPlanName.value
    planDescription.value = editPlanDescription.value
    showNameDialog.value = false
  } catch (error) {
    console.error('Ошибка обновления:', error)
  } finally {
    saving.value = false
  }
}

async function savePlan() {
  try {
    saving.value = true
    
    // Получаем текущие элементы сцены из редактора
    const elements = editor.value?.getSceneElements ? editor.value.getSceneElements() : null
    
    if (scene.value && scene.value.id) {
      // Обновляем существующую сцену
      await $fetch(`${apiStore.url}api/v1/workspaces/${workspaceId.value}/scenes/${scene.value.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: {
          name: planName.value,
          elements: elements
        }
      })
      
      // Также обновляем элементы отдельно если нужно
      if (elements) {
        await $fetch(`${apiStore.url}api/v1/workspaces/${workspaceId.value}/scenes/${scene.value.id}/elements`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken.value}`,
            'Content-Type': 'application/json'
          },
          body: {
            elements: elements
          }
        })
      }
    } else if (workspaceId.value) {
      // Создаём новую сцену
      const result = await $fetch(`${apiStore.url}api/v1/workspaces/${workspaceId.value}/scenes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: {
          name: planName.value,
          description: planDescription.value || undefined,
          floor_plan_id: scene.value?.floor_plan_id || floorPlan.value?.id || planId,
          elements: elements
        }
      })
      
      scene.value = result.data || result
    }
    
    // Обновляем floor plan (используем правильный floor_plan_id)
    const fpId = scene.value?.floor_plan_id || floorPlan.value?.id || planId
    await $fetch(`${apiStore.url}api/v1/floor-plans/${fpId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: {
        name: planName.value,
        description: planDescription.value || undefined
      }
    })
    
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  } finally {
    saving.value = false
  }
}

function exportPDF() {
  // Экспорт в PDF - заглушка
  console.log('Экспорт в PDF...')
}

async function duplicatePlan() {
  if (!scene.value || !workspaceId.value) return
  
  try {
    // Создаём новую ветку как дубликат
    const result = await $fetch(`${apiStore.url}api/v1/scenes/${scene.value.id}/branches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: {
        name: `${planName.value} (копия)`,
        description: 'Дубликат планировки'
      }
    })
    
    const branch = result.data || result
    if (branch?.id) {
      // Можно показать уведомление об успехе
    }
  } catch (error) {
    console.error('Ошибка дублирования:', error)
  }
}

function confirmDelete() {
  showDeleteDialog.value = true
}

async function deletePlan() {
  const fpId = scene.value?.floor_plan_id || floorPlan.value?.id || planId
  try {
    deleting.value = true
    await $fetch(`${apiStore.url}api/v1/floor-plans/${fpId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    router.push('/panel/plane/list')
  } catch (error) {
    console.error('Ошибка удаления:', error)
  } finally {
    deleting.value = false
  }
}

async function submitBTIRequest() {
  if (!selectedService.value || !btiForm.value.name || !btiForm.value.phone) return
  
  try {
    const serviceMap = {
      1: 'consultation',
      2: 'project',
      3: 'verification',
      4: 'approval'
    }
    
    await $fetch(`${apiStore.url}api/v1/requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: {
        workspace_id: workspaceId.value || undefined,
        title: `Заявка на ${btiServices[selectedService.value - 1]?.name || 'услугу'}`,
        description: btiForm.value.comment || undefined,
        category: serviceMap[selectedService.value] || 'consultation',
        priority: 'normal',
        contact: {
          name: btiForm.value.name,
          phone: btiForm.value.phone,
          email: btiForm.value.email || undefined
        }
      }
    })
    
    showBTIDialog.value = false
    btiForm.value = { name: '', phone: '', email: '', comment: '' }
    selectedService.value = null
    
    // Переход к списку заявок
    router.push('/panel/requests')
  } catch (error) {
    console.error('Ошибка создания заявки:', error)
  }
}

onMounted(async () => {
  await loadFloorPlan()
})
</script>

<style scoped>
.min-h-0 {
  min-height: 0;
}
</style>
