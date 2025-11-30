<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white mb-2">Новая заявка</h1>
        <p class="text-gray-400">Создайте заявку на консультацию или услуги специалиста</p>
      </div>
      <NuxtLink to="/panel/requests">
        <Button label="Назад" icon="pi pi-arrow-left" outlined class="border-[#26272A] text-white hover:bg-[#27272A]" />
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Форма -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Выбор категории -->
        <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A]">
          <h3 class="text-lg font-semibold text-white mb-4">Выберите услугу</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="cat in serviceCategories" 
              :key="cat.code"
              :class="[
                'p-4 rounded-xl border-2 cursor-pointer transition-all',
                form.category === cat.code 
                  ? 'border-[#2563EB] bg-[#2563EB]/10' 
                  : 'border-[#26272A] hover:border-[#3f3f46]'
              ]"
              @click="form.category = cat.code"
            >
              <div class="flex items-start gap-3">
                <div :class="[
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                  form.category === cat.code ? 'bg-[#2563EB]/20' : 'bg-[#18181B]'
                ]">
                  <i :class="[cat.icon, form.category === cat.code ? 'text-[#2563EB]' : 'text-gray-400']"></i>
                </div>
                <div>
                  <div class="font-medium text-white">{{ cat.name }}</div>
                  <div class="text-sm text-gray-400 mt-1">{{ cat.description }}</div>
                  <div class="text-sm font-medium text-[#2563EB] mt-2">
                    от {{ formatPrice(cat.base_price) }} ₽
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p v-if="errors.category" class="text-sm text-red-400 mt-2">{{ errors.category }}</p>
        </div>

        <!-- Детали заявки -->
        <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A]">
          <h3 class="text-lg font-semibold text-white mb-4">Детали заявки</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Заголовок *</label>
              <InputText
                v-model="form.title"
                placeholder="Краткое описание заявки"
                class="w-full bg-[#18181B] border-[#26272A] text-white"
              />
              <p v-if="errors.title" class="text-sm text-red-400 mt-1">{{ errors.title }}</p>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Описание</label>
              <Textarea
                v-model="form.description"
                placeholder="Подробное описание вашего вопроса или задачи..."
                rows="3"
                class="w-full bg-[#18181B] border-[#26272A] text-white"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Приоритет</label>
              <Dropdown
                v-model="form.priority"
                :options="priorities"
                optionLabel="label"
                optionValue="value"
                placeholder="Выберите приоритет"
                class="w-full bg-[#18181B] border-[#26272A]"
              />
            </div>
          </div>
        </div>

        <!-- Контактная информация -->
        <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A]">
          <h3 class="text-lg font-semibold text-white mb-4">Контактная информация</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Имя *</label>
              <InputText
                v-model="form.contact_name"
                placeholder="Ваше имя"
                class="w-full bg-[#18181B] border-[#26272A] text-white"
              />
              <p v-if="errors.contact_name" class="text-sm text-red-400 mt-1">{{ errors.contact_name }}</p>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Телефон *</label>
              <InputText
                v-model="form.contact_phone"
                placeholder="+7 (999) 999-99-99"
                class="w-full bg-[#18181B] border-[#26272A] text-white"
              />
              <p v-if="errors.contact_phone" class="text-sm text-red-400 mt-1">{{ errors.contact_phone }}</p>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm text-gray-400 mb-2">Email</label>
              <InputText
                v-model="form.contact_email"
                type="email"
                placeholder="email@example.com"
                class="w-full bg-[#18181B] border-[#26272A] text-white"
              />
            </div>
          </div>
        </div>


        <!-- Кнопки -->
        <div class="flex gap-4">
          <Button 
            label="Создать заявку" 
            icon="pi pi-check"
            :loading="loading"
            class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none"
            @click="submitRequest"
          />
          <NuxtLink to="/panel/requests">
            <Button 
              label="Отмена" 
              outlined
              class="border-[#26272A] text-white hover:bg-[#27272A]"
            />
          </NuxtLink>
        </div>
      </div>

      <!-- Sidebar - Информация о выбранной услуге -->
      <div class="lg:col-span-1">
        <div class="bg-[#26272A] rounded-xl p-6 border border-[#26272A] sticky top-6">
          <h3 class="text-lg font-semibold text-white mb-4">Детали услуги</h3>
          
          <div v-if="selectedService" class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-[#2563EB]/20 rounded-lg flex items-center justify-center">
                <i :class="[selectedService.icon, 'text-xl text-[#2563EB]']"></i>
              </div>
              <div>
                <div class="font-medium text-white">{{ selectedService.name }}</div>
                <div class="text-sm text-gray-400">{{ selectedService.estimated_days }}</div>
              </div>
            </div>

            <div class="border-t border-[#18181B] pt-4">
              <div class="text-sm text-gray-400 mb-2">Что включено:</div>
              <ul class="space-y-2">
                <li 
                  v-for="item in selectedService.includes" 
                  :key="item"
                  class="flex items-start gap-2 text-sm text-gray-300"
                >
                  <i class="pi pi-check text-green-500 mt-0.5"></i>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <div class="border-t border-[#18181B] pt-4">
              <div class="flex items-baseline justify-between">
                <span class="text-sm text-gray-400">Стоимость от</span>
                <span class="text-2xl font-bold text-white">{{ formatPrice(selectedService.base_price) }} ₽</span>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <i class="pi pi-info-circle text-3xl text-gray-500 mb-2"></i>
            <p class="text-gray-400">Выберите услугу для просмотра деталей</p>
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
        category: null,
        title: '',
        description: '',
        priority: 'normal',
        contact_name: '',
        contact_phone: '',
        contact_email: ''
      },
      errors: {},
      loading: false,
      apiStore: null,
      priorities: [
        { label: 'Низкий', value: 'low' },
        { label: 'Обычный', value: 'normal' },
        { label: 'Высокий', value: 'high' },
        { label: 'Срочный', value: 'urgent' }
      ],
      serviceCategories: [
        {
          code: 'consultation',
          name: 'Консультация',
          description: 'Ответы на вопросы по перепланировке',
          icon: 'pi pi-comments',
          base_price: 2000,
          estimated_days: '1-2 дня',
          includes: [
            'Онлайн-консультация со специалистом',
            'Анализ вашей ситуации',
            'Рекомендации по дальнейшим действиям',
            'Ответы на все вопросы'
          ]
        },
        {
          code: 'verification',
          name: 'Проверка планировки',
          description: 'Проверка на соответствие нормам',
          icon: 'pi pi-shield',
          base_price: 5000,
          estimated_days: '2-3 дня',
          includes: [
            'Анализ планировки экспертом',
            'Проверка на соответствие СНиП',
            'Детальный отчёт о нарушениях',
            'Рекомендации по исправлению'
          ]
        },
        {
          code: 'project',
          name: 'Разработка проекта',
          description: 'Полный проект перепланировки',
          icon: 'pi pi-file-edit',
          base_price: 15000,
          estimated_days: '5-7 дней',
          includes: [
            'Подготовка проекта перепланировки',
            'Техническое заключение',
            'Пакет документов для БТИ',
            'Сопровождение подачи документов'
          ]
        },
        {
          code: 'approval',
          name: 'Согласование',
          description: 'Полное согласование перепланировки',
          icon: 'pi pi-star',
          base_price: 15000,
          estimated_days: '2-4 недели',
          includes: [
            'Выезд специалиста',
            'Разработка проекта',
            'Все необходимые документы',
            'Согласование в инстанциях',
            'Получение разрешения'
          ]
        }
      ]
    }
  },
  created() {
    this.apiStore = useApiStore()
    this.accessTokenCookie = useCookie('access_token')
  },
  computed: {
    selectedService() {
      if (!this.form.category) return null
      return this.serviceCategories.find(c => c.code === this.form.category)
    }
  },
  async mounted() {
    // Установим категорию из query параметра
    if (this.$route.query.type) {
      this.form.category = this.$route.query.type
    }
    this.workspaceIdCookie = useCookie('workspace_id')
  },
  methods: {
    validate() {
      this.errors = {}
      
      if (!this.form.category) {
        this.errors.category = 'Выберите услугу'
      }
      
      if (!this.form.title.trim()) {
        this.errors.title = 'Введите заголовок заявки'
      }
      
      if (!this.form.contact_name.trim()) {
        this.errors.contact_name = 'Введите имя'
      }
      
      if (!this.form.contact_phone.trim()) {
        this.errors.contact_phone = 'Введите телефон'
      } else if (!/^[\d\s\+\-\(\)]+$/.test(this.form.contact_phone)) {
        this.errors.contact_phone = 'Введите корректный номер телефона'
      }
      
      return Object.keys(this.errors).length === 0
    },
    async submitRequest() {
      if (!this.validate()) return
      
      this.loading = true
      
      try {
        const workspaceId = this.workspaceIdCookie?.value
        
        const result = await $fetch(`${this.apiStore.url}api/v1/requests`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          },
          body: {
            workspace_id: workspaceId || undefined,
            title: this.form.title.trim() || this.selectedService?.name || 'Заявка',
            description: this.form.description.trim() || undefined,
            category: this.form.category,
            priority: this.form.priority,
            contact: {
              name: this.form.contact_name.trim(),
              phone: this.form.contact_phone.trim(),
              email: this.form.contact_email.trim() || undefined
            }
          }
        })
        
        const request = result.data || result
        
        if (request && request.id) {
          this.$router.push(`/panel/requests/${request.id}`)
        } else {
          this.$router.push('/panel/requests')
        }
      } catch (error) {
        console.error('Ошибка создания заявки:', error)
      } finally {
        this.loading = false
      }
    },
    formatPrice(price) {
      return price.toLocaleString('ru-RU')
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
