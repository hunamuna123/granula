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
        <!-- Информация о планировке -->
        <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A]">
          <h3 class="text-lg font-semibold text-white mb-4">Информация</h3>
          <div class="space-y-3">
            <div>
              <div class="text-xs text-gray-400 mb-1">Площадь</div>
              <div class="text-white font-semibold text-xl">{{ totalArea.toFixed(1) }} м²</div>
            </div>
            <div>
              <div class="text-xs text-gray-400 mb-1">Комнат</div>
              <div class="text-white font-medium">{{ roomsCount }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-400 mb-1">Статус проверки</div>
              <div class="flex items-center gap-2 mt-1">
                <span 
                  :class="[
                    'px-2 py-1 rounded text-xs font-medium',
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
      :style="{ width: '600px' }"
    >
      <div class="space-y-4">
        <p class="text-gray-400">
          ИИ сгенерирует 3-5 альтернативных вариантов планировки с учетом эргономики и норм.
        </p>
        <div class="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p class="text-yellow-400 text-sm">
            ⚠️ Генерация вариантов доступна только в PRO-версии. 
            <NuxtLink to="/panel/subscription" class="underline">Перейти к подписке</NuxtLink>
          </p>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button label="Отмена" outlined class="border-[#26272A] text-white hover:bg-[#27272A]" @click="showVariantsDialog = false" />
          <Button label="Сгенерировать (PRO)" disabled class="bg-[#2563EB] border-none" />
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

const planId = route.params.id
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

async function loadFloorPlan() {
  try {
    loading.value = true
    
    // Загружаем данные floor plan
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
    
    console.log('📋 Floor plan loaded:', floorPlan.value)
    
    // Сначала проверяем localStorage на наличие recognition result
    try {
      const savedRecognition = localStorage.getItem(`recognition_${planId}`)
      if (savedRecognition) {
        recognitionResult.value = JSON.parse(savedRecognition)
        console.log('📦 Recognition result from localStorage:', recognitionResult.value)
        
        // Применяем к редактору
        applyRecognitionResult(recognitionResult.value)
        
        // Очищаем localStorage
        localStorage.removeItem(`recognition_${planId}`)
        return
      }
    } catch (e) {
      console.warn('Could not load recognition from localStorage:', e)
    }
    
    // Пробуем загрузить сцену
    const savedSceneId = localStorage.getItem(`scene_${planId}`)
    if (savedSceneId) {
      await loadSceneById(savedSceneId)
      localStorage.removeItem(`scene_${planId}`)
    } else if (workspaceId.value) {
      await loadScene()
    }
    
  } catch (error) {
    console.error('Ошибка загрузки планировки:', error)
    planName.value = `Планировка #${planId}`
    editPlanName.value = planName.value
  } finally {
    loading.value = false
  }
}

// Загрузка сцены по ID (GET /scenes/{id})
async function loadSceneById(sceneId) {
  try {
    console.log('🎮 Loading scene by ID:', sceneId)
    
    const sceneDetails = await $fetch(`${apiStore.url}api/v1/scenes/${sceneId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    scene.value = sceneDetails.data || sceneDetails
    console.log('✅ Scene loaded:', scene.value)
    
    // Если сцена имеет elements - применяем
    if (scene.value.elements) {
      if (scene.value.elements.rooms) {
        roomsCount.value = scene.value.elements.rooms.length
        totalArea.value = scene.value.elements.rooms.reduce((sum, room) => sum + (room.area || 0), 0)
      }
      
      setTimeout(() => {
        if (editor.value?.loadSceneElements) {
          editor.value.loadSceneElements(scene.value, null)
        }
      }, 500)
    } else {
      // Сцена без elements - загружаем recognition
      await loadRecognitionResult()
    }
  } catch (error) {
    console.error('Ошибка загрузки сцены по ID:', error)
    await loadRecognitionResult()
  }
}

// Загрузка сцены из API
async function loadScene() {
  try {
    sceneLoading.value = true
    console.log('🔍 Looking for scenes in workspace:', workspaceId.value)
    
    // Получаем список сцен воркспейса
    const scenesResult = await $fetch(`${apiStore.url}api/v1/workspaces/${workspaceId.value}/scenes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    // API может вернуть разные форматы
    let scenes = scenesResult.data?.items || scenesResult.data?.scenes || scenesResult.data || scenesResult.scenes || scenesResult
    if (!Array.isArray(scenes)) scenes = []
    
    console.log('📋 Found scenes:', scenes.length)
    
    // Ищем сцену для этого floor_plan
    const matchingScene = scenes.find(s => s.floor_plan_id === planId)
    
    if (matchingScene) {
      console.log('✅ Found matching scene:', matchingScene.id)
      
      // Загружаем полную информацию через GET /scenes/{id}
      await loadSceneById(matchingScene.id)
    } else {
      console.log('⚠️ No scene found for floor plan, loading recognition...')
      await loadRecognitionResult()
    }
  } catch (error) {
    console.error('Ошибка загрузки сцены:', error)
    await loadRecognitionResult()
  } finally {
    sceneLoading.value = false
  }
}

// Загрузка результата распознавания
async function loadRecognitionResult() {
  console.log('🤖 Loading recognition result...')
  
  try {
    // Способ 1: Если есть recognition_job_id у floor plan
    if (floorPlan.value?.recognition_job_id) {
      console.log('📡 Fetching recognition by job_id:', floorPlan.value.recognition_job_id)
      
      const recognizeResult = await $fetch(`${apiStore.url}api/v1/ai/recognize/${floorPlan.value.recognition_job_id}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = recognizeResult.data || recognizeResult
      console.log('📦 Recognition status:', data?.status)
      
      if (data?.status === 'completed' && data?.result) {
        recognitionResult.value = data.result
        console.log('✅ Recognition result loaded:', {
          walls: data.result.walls?.length || 0,
          rooms: data.result.rooms?.length || 0,
          openings: data.result.openings?.length || 0
        })
        applyRecognitionResult(data.result)
        return
      }
    }
    
    // Способ 2: Пробуем получить статус распознавания через floor plan endpoint
    try {
      console.log('📡 Trying floor-plans recognition-status endpoint...')
      
      const statusResult = await $fetch(`${apiStore.url}api/v1/floor-plans/${planId}/recognition-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = statusResult.data || statusResult
      
      if (data?.status === 'completed' && data?.result) {
        recognitionResult.value = data.result
        console.log('✅ Recognition result from floor-plan endpoint')
        applyRecognitionResult(data.result)
        return
      }
    } catch (e) {
      console.log('⚠️ Recognition status endpoint not available')
    }
    
    console.log('ℹ️ No recognition result available, using default scene')
    
  } catch (error) {
    console.error('Ошибка загрузки результата распознавания:', error)
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
    if (editor.value?.loadSceneElements) {
      console.log('🚀 Passing data to FloorPlanEditor.loadSceneElements()')
      editor.value.loadSceneElements(null, result)
      return true
    }
    return false
  }
  
  // Пробуем сразу передать в редактор
  if (!passToEditor()) {
    // Если редактор ещё не готов - ждём с несколькими попытками
    let attempts = 0
    const maxAttempts = 10
    
    const interval = setInterval(() => {
      attempts++
      console.log(`⏳ Waiting for editor... attempt ${attempts}/${maxAttempts}`)
      
      if (passToEditor() || attempts >= maxAttempts) {
        clearInterval(interval)
        if (attempts >= maxAttempts) {
          console.warn('⚠️ Editor not ready after max attempts')
        }
      }
    }, 500)
  }
}

async function updatePlanName() {
  try {
    saving.value = true
    await $fetch(`${apiStore.url}api/v1/floor-plans/${planId}`, {
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
          floor_plan_id: planId,
          elements: elements
        }
      })
      
      scene.value = result.data || result
    }
    
    // Обновляем floor plan
    await $fetch(`${apiStore.url}api/v1/floor-plans/${planId}`, {
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
  try {
    deleting.value = true
    await $fetch(`${apiStore.url}api/v1/floor-plans/${planId}`, {
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
