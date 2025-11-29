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
          <Button label="Отмена" outlined @click="showNameDialog = false" />
          <Button label="Сохранить" @click="updatePlanName" />
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
          <Button label="Отмена" outlined @click="showVariantsDialog = false" />
          <Button label="Сгенерировать (PRO)" disabled class="bg-[#2563EB]" />
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
          <Button label="Отмена" outlined @click="showBTIDialog = false" />
          <Button 
            label="Отправить заявку" 
            :disabled="!selectedService || !btiForm.name || !btiForm.phone"
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
          <Button label="Отмена" outlined @click="showDeleteDialog = false" />
          <Button label="Удалить" severity="danger" @click="deletePlan" />
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
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const planId = route.params.id
const editor = ref(null)

const planName = ref('')
const planDescription = ref('')
const editPlanName = ref('')
const editPlanDescription = ref('')
const totalArea = ref(65.5)
const roomsCount = ref(2)
const validationStatus = ref('valid') // 'valid', 'warning', 'error'

const showNameDialog = ref(false)
const showVariantsDialog = ref(false)
const showBTIDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedService = ref(null)

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

function updatePlanName() {
  planName.value = editPlanName.value
  planDescription.value = editPlanDescription.value
  showNameDialog.value = false
  // TODO: Сохранение на сервер
}

function savePlan() {
  // TODO: Сохранение планировки
  console.log('Сохранение планировки...')
}

function exportPDF() {
  // TODO: Экспорт в PDF
  console.log('Экспорт в PDF...')
}

function duplicatePlan() {
  // TODO: Дублирование планировки
  console.log('Дублирование планировки...')
}

function confirmDelete() {
  showDeleteDialog.value = true
}

function deletePlan() {
  // TODO: Удаление на сервере
  router.push('/panel/plane/list')
}

function submitBTIRequest() {
  if (!selectedService.value || !btiForm.value.name || !btiForm.value.phone) return
  
  // TODO: Отправка заявки на сервер
  console.log('Отправка заявки в БТИ:', {
    service: selectedService.value,
    form: btiForm.value
  })
  
  showBTIDialog.value = false
  // Показ уведомления об успешной отправке
}

onMounted(async () => {
  // Загрузка данных планировки
  // TODO: Загрузка с API
  if (route.query.name) {
    planName.value = route.query.name
    editPlanName.value = route.query.name
  } else {
    planName.value = `Планировка #${planId}`
    editPlanName.value = planName.value
  }
  
  if (route.query.description) {
    planDescription.value = route.query.description
    editPlanDescription.value = route.query.description
  }
})
</script>

<style scoped>
.min-h-0 {
  min-height: 0;
}
</style>
