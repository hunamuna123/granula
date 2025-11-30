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
          Для создания планировки необходимо сначала создать или выбрать рабочее пространство
        </p>
        <NuxtLink to="/panel/workspaces">
          <Button label="Перейти к воркспейсам" icon="pi pi-arrow-right" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none text-sm" />
        </NuxtLink>
      </div>
    </div>

    <template v-else>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Создать планировку</h1>
          <p class="text-sm sm:text-base text-gray-400">Загрузите план квартиры для автоматической оцифровки</p>
        </div>
        <NuxtLink to="/panel/plane/list" class="sm:flex-shrink-0">
          <Button label="Назад к списку" icon="pi pi-arrow-left" outlined class="w-full sm:w-auto border-[#26272A] text-white hover:bg-[#27272A] text-sm" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- Левая колонка - Загрузка и информация -->
      <div class="lg:col-span-1 space-y-4 sm:space-y-6 order-2 lg:order-1">
        <!-- Шаги -->
        <div class="bg-[#26272A] rounded-xl p-4 sm:p-6 border border-[#26272A]">
          <h3 class="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Процесс создания</h3>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div :class="[
                'flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm flex-shrink-0',
                step >= 1 ? 'bg-[#2563EB] text-white' : 'bg-[#18181B] text-gray-500'
              ]">
                1
              </div>
              <div class="flex-1">
                <div class="text-white font-medium mb-1">Загрузка плана</div>
                <div class="text-gray-400 text-sm">Фото или скан техпаспорта, чертежа или эскиза</div>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div :class="[
                'flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm flex-shrink-0',
                step >= 2 ? 'bg-[#2563EB] text-white' : 'bg-[#18181B] text-gray-500'
              ]">
                2
              </div>
              <div class="flex-1">
                <div class="text-white font-medium mb-1">Оцифровка</div>
                <div class="text-gray-400 text-sm">ИИ автоматически распознает план</div>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div :class="[
                'flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm flex-shrink-0',
                step >= 3 ? 'bg-[#2563EB] text-white' : 'bg-[#18181B] text-gray-500'
              ]">
                3
              </div>
              <div class="flex-1">
                <div class="text-white font-medium mb-1">Редактирование</div>
                <div class="text-gray-400 text-sm">Настройте планировку по своим требованиям</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Информация о загрузке -->
        <div class="bg-[#26272A] rounded-xl p-4 sm:p-6 border border-[#26272A]">
          <h3 class="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Рекомендации</h3>
          <ul class="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
            <li class="flex items-start gap-2">
              <svg class="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Используйте качественные фото с хорошим освещением</span>
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>План должен быть полностью виден в кадре</span>
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Поддерживаются форматы: JPG, PNG, PDF</span>
            </li>
            <li class="flex items-start gap-2">
              <svg class="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Размер файла до 10 МБ</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Правая колонка - Загрузка и превью -->
      <div class="lg:col-span-2 space-y-4 sm:space-y-6 order-1 lg:order-2">
        <!-- Зона загрузки -->
        <div class="bg-[#26272A] rounded-xl p-4 sm:p-6 border border-[#26272A]">
          <h3 class="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Загрузка плана</h3>
          
          <div 
            v-if="!uploadedFile"
            class="border-2 border-dashed border-[#26272A] rounded-xl p-6 sm:p-12 text-center hover:border-[#2563EB] transition-colors cursor-pointer"
            @click="triggerFileInput"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            :class="{ 'border-[#2563EB] bg-[#2563EB]/10': isDragging }"
          >
            <input 
              ref="fileInput"
              type="file" 
              accept="image/*,.pdf"
              class="hidden"
              @change="handleFileSelect"
            />
            <div class="space-y-3 sm:space-y-4">
              <div class="flex justify-center">
                <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p class="text-white text-sm sm:text-base font-medium mb-1 sm:mb-2">Перетащите файл сюда или нажмите для выбора</p>
                <p class="text-gray-400 text-xs sm:text-sm">JPG, PNG или PDF до 10 МБ</p>
              </div>
              <Button 
                label="Выбрать файл" 
                icon="pi pi-upload"
                class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none text-sm"
                @click.stop="triggerFileInput"
              />
            </div>
          </div>

          <!-- Загруженный файл -->
          <div v-else class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-[#18181B] rounded-lg">
              <div class="flex items-center gap-3">
                <svg class="w-10 h-10 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <div class="text-white font-medium">{{ uploadedFile.name }}</div>
                  <div class="text-gray-400 text-sm">{{ formatFileSize(uploadedFile.size) }}</div>
                </div>
              </div>
              <Button 
                icon="pi pi-times" 
                outlined 
                severity="danger"
                size="small"
                @click="removeFile"
              />
            </div>

            <!-- Превью изображения -->
            <div v-if="imagePreview" class="relative bg-[#18181B] rounded-lg overflow-hidden">
              <img :src="imagePreview" alt="Preview" class="w-full h-auto max-h-[400px] object-contain" />
            </div>

            <!-- Название планировки -->
            <div>
              <label class="block text-sm font-medium text-white mb-2">Название планировки *</label>
              <InputText 
                v-model="planName" 
                placeholder="Например: Квартира на Ленина, 10"
                class="w-full bg-[#18181B] border-[#26272A] text-white"
              />
            </div>

            <!-- Описание -->
            <div>
              <label class="block text-sm font-medium text-white mb-2">Описание (необязательно)</label>
              <Textarea 
                v-model="planDescription" 
                placeholder="Краткое описание планировки..."
                rows="3"
                class="w-full bg-[#18181B] border-[#26272A] text-white"
              />
            </div>

            <!-- Адрес -->
            <div>
              <label class="block text-sm font-medium text-white mb-2">Адрес (необязательно)</label>
              <InputText 
                v-model="planAddress" 
                placeholder="Город, улица, дом, квартира"
                class="w-full bg-[#18181B] border-[#26272A] text-white"
              />
            </div>
          </div>
        </div>

        <!-- Прогресс обработки -->
        <div v-if="processing" class="bg-[#26272A] rounded-xl p-6 border border-[#26272A]">
          <h3 class="text-lg font-semibold text-white mb-4">Обработка плана</h3>
          <ProgressBar :value="processingProgress" class="mb-4" />
          <p class="text-gray-400 text-sm">{{ processingStatus }}</p>
        </div>

        <!-- Ошибка -->
        <div v-if="error" class="bg-red-900/20 border border-red-500/20 rounded-xl p-4">
          <p class="text-red-400">{{ error }}</p>
        </div>

        <!-- Действия -->
        <div v-if="uploadedFile && !processing" class="flex gap-4">
          <Button 
            label="Начать оцифровку" 
            icon="pi pi-cog"
            :disabled="!planName.trim()"
            :loading="uploading"
            class="flex-1 bg-[#2563EB] hover:bg-[#1d4ed8] border-none"
            @click="startProcessing"
          />
          <Button 
            label="Отмена" 
            outlined
            class="border-[#26272A] text-white hover:bg-[#27272A]"
            @click="cancel"
          />
        </div>
      </div>
    </div>
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
      step: 1,
      isDragging: false,
      uploadedFile: null,
      imagePreview: null,
      planName: '',
      planDescription: '',
      planAddress: '',
      processing: false,
      uploading: false,
      processingProgress: 0,
      processingStatus: '',
      error: null,
      apiStore: null
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
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput?.click()
    },
    handleFileSelect(event) {
      const file = event.target.files?.[0]
      if (file) {
        this.processFile(file)
      }
    },
    handleDrop(event) {
      this.isDragging = false
      const file = event.dataTransfer?.files?.[0]
      if (file) {
        this.processFile(file)
      }
    },
    processFile(file) {
      this.error = null
      
      // Проверка типа файла
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        this.error = 'Неподдерживаемый формат файла. Используйте JPG, PNG или PDF.'
        return
      }

      // Проверка размера (10 МБ)
      if (file.size > 10 * 1024 * 1024) {
        this.error = 'Файл слишком большой. Максимальный размер: 10 МБ.'
        return
      }

      this.uploadedFile = file

      // Создание превью для изображений
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreview = e.target?.result
        }
        reader.readAsDataURL(file)
      } else {
        this.imagePreview = null
      }
    },
    removeFile() {
      this.uploadedFile = null
      this.imagePreview = null
      this.planName = ''
      this.planDescription = ''
      this.planAddress = ''
      this.error = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    },
    async startProcessing() {
      if (!this.uploadedFile || !this.planName.trim()) return

      this.error = null
      this.uploading = true
      this.step = 2
      
      try {
        // Создаём FormData для загрузки файла
        const formData = new FormData()
        formData.append('file', this.uploadedFile)
        formData.append('name', this.planName.trim())
        // Добавляем workspace_id
        if (this.workspaceIdCookie.value) {
          formData.append('workspace_id', this.workspaceIdCookie.value)
        }

        const result = await $fetch(`${this.apiStore.url}api/v1/floor-plans`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`
          },
          body: formData
        })
        
        const floorPlan = result.data || result
        
        if (floorPlan && floorPlan.id) {
          this.uploading = false
          this.processing = true
          this.processingStatus = 'Подготовка к распознаванию...'
          this.processingProgress = 10
          
          // Конвертируем изображение в base64
          const imageBase64 = await this.fileToBase64(this.uploadedFile)
          
          // Запускаем AI распознавание
          const recognizeResult = await $fetch(`${this.apiStore.url}api/v1/ai/recognize`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.accessTokenCookie.value}`,
              'Content-Type': 'application/json'
            },
            body: {
              floor_plan_id: floorPlan.id,
              image_base64: imageBase64,
              image_type: this.uploadedFile.type,
              options: {
                detect_load_bearing: true,
                detect_wet_zones: true,
                detect_furniture: false
              }
            }
          })
          
          const recognizeData = recognizeResult.data || recognizeResult
          
          if (recognizeData?.job_id) {
            await this.pollRecognitionStatus(recognizeData.job_id, floorPlan.id)
          } else {
            this.$router.push(`/panel/plane/${floorPlan.id}`)
          }
        }
      } catch (err) {
        this.error = err.data?.message || err.message || 'Ошибка создания планировки'
        this.uploading = false
        this.processing = false
      }
    },
    async fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          // Возвращаем ПОЛНЫЙ data URL (data:image/jpeg;base64,...)
          // API ожидает именно такой формат
          resolve(reader.result)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    },
    async pollRecognitionStatus(jobId, floorPlanId) {
      const self = this
      
      const pollInterval = setInterval(async () => {
        try {
          const result = await $fetch(`${this.apiStore.url}api/v1/ai/recognize/${jobId}/status`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${self.accessTokenCookie.value}`,
              'Content-Type': 'application/json'
            }
          })
          
          const data = result.data || result
          
          if (data?.status === 'completed') {
            clearInterval(pollInterval)
            self.step = 3
            self.processingProgress = 100
            self.processingStatus = 'Распознавание завершено!'
            
            console.log('✅ Recognition completed:', data.result)
            
            // Сохраняем recognition result в localStorage для передачи на страницу редактора
            if (data.result) {
              try {
                localStorage.setItem(`recognition_${floorPlanId}`, JSON.stringify(data.result))
              } catch (e) {
                console.warn('Could not save recognition result to localStorage:', e)
              }
            }
            
            // Создаём сцену (сервер сам заполняет elements из floor_plan_id)
            if (self.workspaceIdCookie.value) {
              try {
                const sceneResult = await $fetch(`${self.apiStore.url}api/v1/workspaces/${self.workspaceIdCookie.value}/scenes`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${self.accessTokenCookie.value}`,
                    'Content-Type': 'application/json'
                  },
                  body: {
                    name: self.planName.trim(),
                    description: 'Created from recognition result',
                    floor_plan_id: floorPlanId
                  }
                })
                
                const scene = sceneResult.data || sceneResult
                console.log('✅ Scene created:', scene?.id)
                
                // Сохраняем scene_id
                if (scene?.id) {
                  localStorage.setItem(`scene_${floorPlanId}`, scene.id)
                }
              } catch (e) {
                console.error('Ошибка создания сцены:', e)
              }
            }
            
            // Переходим на страницу редактирования
            self.$router.push(`/panel/plane/${floorPlanId}`)
            return
          }
          
          if (data?.status === 'failed') {
            clearInterval(pollInterval)
            self.error = data.error || 'Ошибка обработки планировки'
            self.processing = false
            return
          }
          
          // Обновляем прогресс
          if (data?.progress) {
            self.processingProgress = data.progress
            if (data.progress < 30) {
              self.processingStatus = 'Анализ изображения...'
            } else if (data.progress < 50) {
              self.processingStatus = 'Распознавание контуров...'
            } else if (data.progress < 70) {
              self.processingStatus = 'Определение стен и помещений...'
            } else if (data.progress < 90) {
              self.processingStatus = 'Измерение размеров...'
            } else {
              self.processingStatus = 'Создание 3D модели...'
            }
          }
        } catch {
          // Continue polling
        }
      }, 2000)
      
      // Timeout после 2 минут
      setTimeout(() => {
        clearInterval(pollInterval)
        if (self.processing) {
          self.$router.push(`/panel/plane/${floorPlanId}`)
        }
      }, 120000)
    },
    cancel() {
      this.$router.push('/panel/plane/list')
    },
    
    // Конвертация recognition result в scene elements
    convertRecognitionToScene(recognitionResult) {
      if (!recognitionResult) return null
      
      const elements = {
        walls: [],
        rooms: [],
        openings: [],
        furniture: [],
        utilities: []
      }
      
      // Конвертируем стены
      if (recognitionResult.walls) {
        elements.walls = recognitionResult.walls.map((wall, index) => ({
          id: wall.temp_id || `wall_${index}`,
          type: 'wall',
          name: wall.is_load_bearing ? 'Несущая стена' : 'Перегородка',
          start: { x: wall.start?.x || 0, y: 0, z: wall.start?.y || 0 },
          end: { x: wall.end?.x || 0, y: 0, z: wall.end?.y || 0 },
          height: 3.0,
          thickness: wall.thickness || 0.2,
          properties: {
            is_load_bearing: wall.is_load_bearing || false,
            material: wall.material || 'unknown',
            can_demolish: !wall.is_load_bearing,
            confidence: wall.confidence || 0
          },
          openings: [],
          metadata: {
            locked: wall.is_load_bearing,
            visible: true,
            selected: false
          }
        }))
      }
      
      // Конвертируем комнаты
      if (recognitionResult.rooms) {
        const roomTypeMap = {
          'LIVING': 'living',
          'BEDROOM': 'bedroom',
          'CHILDREN': 'bedroom',
          'OFFICE': 'living',
          'KITCHEN': 'kitchen',
          'KITCHEN_LIVING': 'kitchenGas',
          'BATHROOM': 'bathroom',
          'TOILET': 'toilet',
          'COMBINED_BATHROOM': 'combined',
          'HALLWAY': 'hallway',
          'STORAGE': 'storage',
          'LAUNDRY': 'combined',
          'BALCONY': 'balcony',
          'LOGGIA': 'loggia',
          'unknown': 'living'
        }
        
        // Создаём карту стен для вычисления полигонов комнат
        const wallsMap = {}
        elements.walls.forEach(w => { wallsMap[w.id] = w })
        
        elements.rooms = recognitionResult.rooms.map((room, index) => {
          let polygon = []
          
          // Если есть boundary - используем его
          if (room.boundary && room.boundary.length > 0) {
            polygon = room.boundary.map(point => ({
              x: point.x,
              z: point.y
            }))
          }
          // Иначе вычисляем из стен
          else if (room.wall_ids && room.wall_ids.length > 0) {
            const points = []
            room.wall_ids.forEach(wallId => {
              const wall = wallsMap[wallId]
              if (wall) {
                points.push({ x: wall.start.x, z: wall.start.z })
                points.push({ x: wall.end.x, z: wall.end.z })
              }
            })
            
            if (points.length > 0) {
              const centerX = points.reduce((s, p) => s + p.x, 0) / points.length
              const centerZ = points.reduce((s, p) => s + p.z, 0) / points.length
              
              // Удаляем дубликаты и сортируем по углу
              const unique = []
              points.forEach(p => {
                if (!unique.some(u => Math.abs(u.x - p.x) < 0.1 && Math.abs(u.z - p.z) < 0.1)) {
                  unique.push(p)
                }
              })
              
              unique.sort((a, b) => {
                return Math.atan2(a.z - centerZ, a.x - centerX) - Math.atan2(b.z - centerZ, b.x - centerX)
              })
              
              polygon = unique
            }
          }
          // Если ничего нет - создаём примерный полигон по площади
          else if (room.area) {
            const side = Math.sqrt(room.area)
            const offsetX = index * (side + 1)
            polygon = [
              { x: offsetX, z: 0 },
              { x: offsetX + side, z: 0 },
              { x: offsetX + side, z: side },
              { x: offsetX, z: side }
            ]
          }
          
          // Определяем название и тип
          let roomName = room.name
          let roomType = roomTypeMap[room.type] || 'living'
          
          if (!roomName || room.type === 'unknown') {
            if (room.is_wet_zone) {
              roomName = room.area > 6 ? 'Ванная комната' : 'Санузел'
              roomType = room.area > 6 ? 'bathroom' : 'combined'
            } else if (room.area > 20) {
              roomName = 'Гостиная'
              roomType = 'living'
            } else if (room.area > 12) {
              roomName = 'Спальня'
              roomType = 'bedroom'
            } else if (room.area > 8) {
              roomName = 'Кухня'
              roomType = 'kitchen'
            } else {
              roomName = `Комната ${index + 1}`
            }
          }
          
          return {
            id: room.temp_id || `room_${index}`,
            type: 'room',
            name: roomName,
            room_type: roomType,
            polygon: polygon,
            area: room.area || 0,
            perimeter: 0,
            wall_ids: room.wall_ids || [],
            properties: {
              has_wet_zone: room.is_wet_zone || false,
              has_ventilation: false,
              has_window: room.has_window || false,
              min_area: 0,
              confidence: room.confidence || 0
            }
          }
        })
      }
      
      // Конвертируем проёмы (двери/окна)
      if (recognitionResult.openings) {
        recognitionResult.openings.forEach((opening, index) => {
          elements.openings.push({
            id: opening.temp_id || `opening_${index}`,
            type: opening.type === 'door' ? 'door' : 'window',
            position: { x: opening.position?.x || 0, y: 0, z: opening.position?.y || 0 },
            width: opening.width || 0.9,
            height: opening.height || 2.1,
            wall_id: opening.wall_id,
            properties: {
              opens_to: opening.opens_to,
              confidence: opening.confidence || 0
            }
          })
        })
      }
      
      // Конвертируем оборудование в мебель
      if (recognitionResult.equipment) {
        elements.furniture = recognitionResult.equipment.map((equip, index) => ({
          id: equip.temp_id || `furn_${index}`,
          type: 'furniture',
          name: equip.type,
          furniture_type: equip.type,
          position: { x: equip.position?.x || 0, y: 0, z: equip.position?.y || 0 },
          rotation: { x: 0, y: 0, z: 0 },
          dimensions: {
            width: equip.dimensions?.width || 0.6,
            height: 0.85,
            depth: equip.dimensions?.depth || 0.6
          },
          room_id: equip.room_id,
          metadata: {
            category: 'equipment',
            confidence: equip.confidence || 0
          }
        }))
      }
      
      // Конвертируем инженерные элементы
      if (recognitionResult.utilities) {
        elements.utilities = recognitionResult.utilities.map((utility, index) => ({
          id: utility.temp_id || `utility_${index}`,
          type: 'utility',
          name: utility.type,
          utility_type: utility.type,
          position: { x: utility.position?.x || 0, y: 0, z: utility.position?.y || 0 },
          properties: {
            can_relocate: utility.can_relocate || false,
            protection_zone: utility.protection_zone || 0.3
          },
          room_id: utility.room_id
        }))
      }
      
      return elements
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
