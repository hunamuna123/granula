<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white mb-2">Создать планировку</h1>
        <p class="text-gray-400">Загрузите план квартиры для автоматической оцифровки</p>
      </div>
      <NuxtLink to="/panel/plane/list">
        <Button label="Назад к списку" icon="pi pi-arrow-left" outlined class="border-[#26272A] text-white hover:bg-[#27272A]" />
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Левая колонка - Загрузка и информация -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Шаги -->
        <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A]">
          <h3 class="text-lg font-semibold text-white mb-4">Процесс создания</h3>
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
        <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A]">
          <h3 class="text-lg font-semibold text-white mb-4">Рекомендации</h3>
          <ul class="space-y-3 text-sm text-gray-400">
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
      <div class="lg:col-span-2 space-y-6">
        <!-- Зона загрузки -->
        <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A]">
          <h3 class="text-lg font-semibold text-white mb-4">Загрузка плана</h3>
          
          <div 
            v-if="!uploadedFile"
            class="border-2 border-dashed border-[#26272A] rounded-xl p-12 text-center hover:border-[#2563EB] transition-colors cursor-pointer"
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
            <div class="space-y-4">
              <div class="flex justify-center">
                <svg class="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p class="text-white font-medium mb-2">Перетащите файл сюда или нажмите для выбора</p>
                <p class="text-gray-400 text-sm">JPG, PNG или PDF до 10 МБ</p>
              </div>
              <Button 
                label="Выбрать файл" 
                icon="pi pi-upload"
                class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none"
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
        if (this.planDescription.trim()) {
          formData.append('description', this.planDescription.trim())
        }
        if (this.planAddress.trim()) {
          formData.append('address', this.planAddress.trim())
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
          
          // Запускаем обработку
          const processResult = await $fetch(`${this.apiStore.url}api/v1/floor-plans/${floorPlan.id}/process`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.accessTokenCookie.value}`,
              'Content-Type': 'application/json'
            },
            body: {
              create_scene: true,
              run_compliance: true
            }
          })
          
          const processData = processResult.data || processResult
          
          if (processData?.task_id) {
            await this.pollProcessingStatus(processData.task_id, floorPlan.id)
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
    async pollProcessingStatus(taskId, floorPlanId) {
      const steps = [
        { progress: 20, status: 'Анализ изображения...' },
        { progress: 40, status: 'Распознавание контуров...' },
        { progress: 60, status: 'Определение стен и помещений...' },
        { progress: 80, status: 'Измерение размеров...' },
        { progress: 100, status: 'Создание 3D модели...' }
      ]
      
      let stepIndex = 0
      const self = this
      
      const pollInterval = setInterval(async () => {
        try {
          const result = await $fetch(`${this.apiStore.url}api/v1/floor-plans/tasks/${taskId}`, {
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
            self.$router.push(`/panel/plane/${floorPlanId}`)
            return
          }
          
          if (data?.status === 'failed') {
            clearInterval(pollInterval)
            self.error = 'Ошибка обработки планировки'
            self.processing = false
            return
          }
          
          // Обновляем прогресс
          if (data?.progress) {
            self.processingProgress = data.progress
          } else if (stepIndex < steps.length) {
            self.processingProgress = steps[stepIndex].progress
            self.processingStatus = steps[stepIndex].status
            stepIndex++
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
