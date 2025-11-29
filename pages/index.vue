<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: false
})

const selectedService = ref('documentation')
const showServiceModal = ref(false)
const serviceForm = ref({
  name: '',
  phone: '',
  email: ''
})


const features = [
  {
    icon: 'Network',
    title: 'Распознавание планов',
    description: 'Автоматическое распознавание границ квартиры, размеров, стен, дверей, окон и помещений с помощью ИИ'
  },
  {
    icon: 'Home',
    title: '3D модель',
    description: 'Создание цифрового плана в 2.5D с возможностью просмотра и редактирования'
  },
  {
    icon: 'Edit',
    title: 'Редактор планировки',
    description: 'Сносите стены, добавляйте перегородки, перемещайте двери и меняйте назначение помещений'
  },
  {
    icon: 'Support',
    title: 'Проверка норм',
    description: 'Автоматическая проверка соответствия СНиП, Жилищного кодекса РФ и других нормативов'
  },
  {
    icon: 'Settings',
    title: 'Расстановка мебели',
    description: 'Добавляйте мебель и фурнитурные объекты для визуализации будущего интерьера'
  },
  {
    icon: 'Speed',
    title: 'Генерация вариантов',
    description: 'ИИ предлагает 3-5 готовых вариантов планировки с учетом эргономики и норм'
  }
]

const proFeatures = [
  'Супер-точная генерация планировок (10–20 вариантов)',
  'Генерация стилей интерьера (лофт, минимализм, сканди)',
  'Автоподбор мебели',
  'AR-режим просмотра',
  'Реалистичный рендер (фотореализм)',
  'Export в PDF/чертёж для подрядчиков',
  'Подбор дизайна кухни и шкафов по размерам',
  'Интеллектуальный расчёт стоимости ремонта',
  'AI консультант по перепланировкам'
]

const additionalFeatures = [
  'Автоматический расчёт площади помещений',
  'Оценка стоимости ремонта (черновая)',
  'Экспорт PDF плана',
  'Фото-рендер комнаты',
  'История изменений',
  'Совместное редактирование (Figma-style)',
  'Загрузка нескольких квартир для сравнения'
]

const services = [
  { value: 'consultation', label: 'Консультация', price: 'от 2 000 ₽' },
  { value: 'documentation', label: 'Оформление документации', price: 'от 15 000 ₽' },
  { value: 'expert', label: 'Выезд эксперта', price: 'от 5 000 ₽' },
  { value: 'full', label: 'Полный комплекс', price: 'от 30 000 ₽' }
]

const submitServiceRequest = () => {
  // Handle form submission
  showServiceModal.value = false
}

</script>

<template>
  
  <div class="min-h-screen bg-[#09090B]">
    <HeaderNavbar />
    
    <!-- Hero Section with 3D Model -->
    <section class="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="space-y-4">
              <h1 class="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Превратите план квартиры в
                <span class="text-[#2563EB]">3D модель</span>
                для законной перепланировки
              </h1>
              <p class="text-xl text-gray-400 leading-relaxed">
                Цифровой сервис с ИИ, который автоматически распознает план, создает 3D модель и проверяет перепланировку на соответствие нормам
              </p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4">
              <Button 
                label="Начать бесплатно" 
                size="large"
                class="bg-[#2563EB] hover:bg-[#1D4ED8] border-none text-white px-8 py-6 text-lg rounded-xl"
                @click="() => {}"
              />
              <Button 
                label="Посмотреть демо" 
                size="large"
                outlined
                class="border-[#26272A] text-white hover:bg-[#18181B] px-8 py-6 text-lg rounded-xl"
                @click="() => {}"
              />
            </div>

            <div class="flex items-center gap-6 pt-4">
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div class="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <span class="text-gray-400">Бесплатно для всех</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div class="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <span class="text-gray-400">Проверка норм</span>
              </div>
            </div>
          </div>
          
          <!-- 3D Model Preview -->
          <div class="relative">
            <div class="bg-gradient-to-br from-[#2563EB]/20 to-[#1D4ED8]/10 rounded-4xl p-8 backdrop-blur-sm border border-[#26272A] shadow-2xl">
              <div class="bg-[#18181B] rounded-2xl p-6 space-y-4 border border-[#26272A]">
                <div class="h-96 bg-gradient-to-br from-[#09090B] to-[#18181B] rounded-xl overflow-hidden relative border border-[#26272A] flex items-center justify-center">
                  <div class="text-center space-y-4">
                    <div class="w-24 h-24 bg-[#2563EB]/20 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
                      <i class="pi pi-cube text-5xl text-[#2563EB]"></i>
                    </div>
                    <p class="text-white font-medium">3D модель квартиры</p>
                    <p class="text-gray-500 text-sm">Интерактивная визуализация</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3D Constructor Preview -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-[#18181B]/50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-white mb-4">Конструктор планировки</h2>
          <p class="text-xl text-gray-400">Создавайте и редактируйте планировку в реальном времени</p>
        </div>

        <div class="grid lg:grid-cols-2 gap-8 items-center">
          <div class="space-y-6">
            <div class="bg-[#18181B] rounded-4xl p-8 border border-[#26272A]">
              <h3 class="text-2xl font-bold text-white mb-4">Возможности редактора</h3>
              <ul class="space-y-3">
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-lg bg-[#2563EB]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i class="pi pi-check text-[#2563EB] text-sm"></i>
                  </div>
                  <div>
                    <p class="text-white font-medium">Снос и добавление стен</p>
                    <p class="text-gray-400 text-sm">Перетаскивайте стены, добавляйте перегородки</p>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-lg bg-[#2563EB]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i class="pi pi-check text-[#2563EB] text-sm"></i>
                  </div>
                  <div>
                    <p class="text-white font-medium">Расстановка мебели</p>
                    <p class="text-gray-400 text-sm">Кровати, диваны, столы и другая мебель</p>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-lg bg-[#2563EB]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i class="pi pi-check text-[#2563EB] text-sm"></i>
                  </div>
                  <div>
                    <p class="text-white font-medium">Режимы просмотра</p>
                    <p class="text-gray-400 text-sm">Вид сверху (2.5D) и от первого лица</p>
                  </div>
                </li>
                <li class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-lg bg-[#2563EB]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i class="pi pi-check text-[#2563EB] text-sm"></i>
                  </div>
                  <div>
                    <p class="text-white font-medium">Проверка норм в реальном времени</p>
                    <p class="text-gray-400 text-sm">Автоматическая проверка соответствия СНиП</p>
                  </div>
                </li>
              </ul>
            </div>

            <Button 
              label="Открыть конструктор" 
              size="large"
              class="w-full bg-[#2563EB] hover:bg-[#1D4ED8] border-none text-white py-6 text-lg rounded-xl"
              @click="() => {}"
            />
          </div>

          <div class="relative">
            <div class="bg-gradient-to-br from-[#2563EB]/20 to-[#1D4ED8]/10 rounded-4xl p-8 backdrop-blur-sm border border-[#26272A]">
              <div class="bg-[#18181B] rounded-2xl p-6 space-y-4">
                <div class="h-96 bg-[#09090B] rounded-xl overflow-hidden relative border border-[#26272A] flex items-center justify-center">
                  <div class="text-center space-y-4">
                    <div class="w-20 h-20 bg-[#2563EB]/20 rounded-2xl flex items-center justify-center mx-auto">
                      <i class="pi pi-cube text-4xl text-[#2563EB]"></i>
                    </div>
                    <p class="text-gray-400">3D конструктор планировки</p>
                    <p class="text-gray-500 text-sm">Интерактивный редактор с перетаскиванием элементов</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#09090B] to-[#18181B]/30">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-white mb-4">Как это работает</h2>
          <p class="text-xl text-gray-400">Простой процесс от загрузки плана до готового проекта</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-[#18181B] border border-[#26272A] rounded-4xl p-8 hover:border-[#2563EB]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#2563EB]/10">
            <div class="text-center space-y-4">
              <div class="w-20 h-20 bg-gradient-to-br from-[#2563EB]/30 to-[#1D4ED8]/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <IconsNetwork class="w-10 h-10 text-[#2563EB]" />
              </div>
              <div class="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center mx-auto font-bold">1</div>
              <h3 class="text-2xl font-bold text-white mt-4">Загрузите план</h3>
              <p class="text-gray-400 leading-relaxed">Фото техпаспорта, скан чертежа или план квартиры</p>
            </div>
          </div>

          <div class="bg-[#18181B] border border-[#26272A] rounded-4xl p-8 hover:border-[#2563EB]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#2563EB]/10">
            <div class="text-center space-y-4">
              <div class="w-20 h-20 bg-gradient-to-br from-[#2563EB]/30 to-[#1D4ED8]/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <IconsSpeed class="w-10 h-10 text-[#2563EB]" />
              </div>
              <div class="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center mx-auto font-bold">2</div>
              <h3 class="text-2xl font-bold text-white mt-4">ИИ распознает</h3>
              <p class="text-gray-400 leading-relaxed">Автоматически определяет стены, двери, окна, помещения и размеры</p>
            </div>
          </div>

          <div class="bg-[#18181B] border border-[#26272A] rounded-4xl p-8 hover:border-[#2563EB]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#2563EB]/10">
            <div class="text-center space-y-4">
              <div class="w-20 h-20 bg-gradient-to-br from-[#2563EB]/30 to-[#1D4ED8]/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <IconsEdit class="w-10 h-10 text-[#2563EB]" />
              </div>
              <div class="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center mx-auto font-bold">3</div>
              <h3 class="text-2xl font-bold text-white mt-4">Редактируйте</h3>
              <p class="text-gray-400 leading-relaxed">Создавайте перепланировку с автоматической проверкой норм</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-white mb-4">Возможности редактора</h2>
          <p class="text-xl text-gray-400">Все инструменты для создания идеальной планировки</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="feature in features" :key="feature.title" 
               class="bg-[#18181B] border border-[#26272A] rounded-4xl p-6 hover:border-[#2563EB]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#2563EB]/10 group">
            <div class="space-y-4">
              <div class="w-14 h-14 bg-gradient-to-br from-[#2563EB]/30 to-[#1D4ED8]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <IconsNetwork v-if="feature.icon === 'Network'" class="w-7 h-7 text-[#2563EB]" />
                <IconsHome v-else-if="feature.icon === 'Home'" class="w-7 h-7 text-[#2563EB]" />
                <IconsEdit v-else-if="feature.icon === 'Edit'" class="w-7 h-7 text-[#2563EB]" />
                <IconsSupport v-else-if="feature.icon === 'Support'" class="w-7 h-7 text-[#2563EB]" />
                <IconsSettings v-else-if="feature.icon === 'Settings'" class="w-7 h-7 text-[#2563EB]" />
                <IconsSpeed v-else-if="feature.icon === 'Speed'" class="w-7 h-7 text-[#2563EB]" />
              </div>
              <h3 class="text-xl font-bold text-white">{{ feature.title }}</h3>
              <p class="text-gray-400 leading-relaxed">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Norms Check Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#18181B]/50 to-[#09090B]">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div>
              <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6">Модуль проверки норм</h2>
              <p class="text-xl text-gray-400 leading-relaxed">
                Автоматическая проверка соответствия СНиП, Жилищного кодекса РФ и других нормативов при каждом действии
              </p>
            </div>
            
            <div class="space-y-4">
              <div class="flex items-start gap-4 p-5 bg-[#18181B] rounded-2xl border border-red-500/30 hover:border-red-500/50 transition-colors">
                <div class="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-times text-red-400 text-xl"></i>
                </div>
                <div>
                  <p class="text-white font-bold text-lg mb-1">Запрещено</p>
                  <p class="text-gray-400">Снос несущей стены</p>
                </div>
              </div>
              
              <div class="flex items-start gap-4 p-5 bg-[#18181B] rounded-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-colors">
                <div class="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-exclamation-triangle text-yellow-400 text-xl"></i>
                </div>
                <div>
                  <p class="text-white font-bold text-lg mb-1">Сомнительно</p>
                  <p class="text-gray-400">Проход стал меньше 70 см</p>
                </div>
              </div>
              
              <div class="flex items-start gap-4 p-5 bg-[#18181B] rounded-2xl border border-green-500/30 hover:border-green-500/50 transition-colors">
                <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-check text-green-400 text-xl"></i>
                </div>
                <div>
                  <p class="text-white font-bold text-lg mb-1">Разрешено</p>
                  <p class="text-gray-400">Действие соответствует нормам</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-[#18181B] to-[#09090B] rounded-4xl p-8 border border-[#26272A] shadow-2xl">
            <h3 class="text-2xl font-bold text-white mb-6">Примеры проверки</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-5 bg-[#09090B] rounded-xl border border-[#26272A] hover:border-[#2563EB]/30 transition-colors">
                <span class="text-gray-300 font-medium">Объединение кухни и гостиной</span>
                <Badge value="Проверка..." severity="info" />
              </div>
              <div class="flex items-center justify-between p-5 bg-[#09090B] rounded-xl border border-[#26272A] hover:border-green-500/30 transition-colors">
                <span class="text-gray-300 font-medium">Снос перегородки</span>
                <Badge value="OK" severity="success" />
              </div>
              <div class="flex items-center justify-between p-5 bg-[#09090B] rounded-xl border border-[#26272A] hover:border-yellow-500/30 transition-colors">
                <span class="text-gray-300 font-medium">Установка перегородки</span>
                <Badge value="Предупреждение" severity="warn" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PRO Features -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#09090B] to-[#18181B]/30">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <Badge value="PRO" severity="info" class="mb-6 text-base px-4 py-2" />
          <h2 class="text-4xl lg:text-5xl font-bold text-white mb-4">Расширенные возможности</h2>
          <p class="text-xl text-gray-400">PRO функции для профессионалов и тех, кто хочет больше</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="(feature, index) in proFeatures" :key="index" 
               class="p-5 bg-[#18181B] rounded-2xl border border-[#26272A] flex items-start gap-3 hover:border-[#2563EB]/50 hover:bg-[#18181B]/80 transition-all duration-300">
            <div class="w-8 h-8 rounded-lg bg-[#2563EB]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <IconsSpeed class="w-5 h-5 text-[#2563EB]" />
            </div>
            <span class="text-gray-300 leading-relaxed">{{ feature }}</span>
          </div>
        </div>

        <div class="text-center mt-12">
          <Button 
            label="Узнать больше о PRO" 
            size="large"
            outlined
            class="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/10 px-8 py-6 text-lg rounded-xl"
            @click="() => {}"
          />
        </div>
      </div>
    </section>

    <!-- Additional Features -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-white mb-4">Дополнительные функции</h2>
          <p class="text-xl text-gray-400">Все что нужно для комфортной работы</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="(feature, index) in additionalFeatures" :key="index" 
               class="p-6 bg-[#18181B] rounded-2xl border border-[#26272A] text-center hover:border-[#2563EB]/50 hover:shadow-lg hover:shadow-[#2563EB]/10 transition-all duration-300">
            <div class="w-12 h-12 bg-gradient-to-br from-[#2563EB]/30 to-[#1D4ED8]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <IconsSupport class="w-6 h-6 text-[#2563EB]" />
            </div>
            <p class="text-gray-300 text-sm leading-relaxed">{{ feature }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- BTI Services -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#18181B]/50 to-[#09090B]">
      <div class="max-w-4xl mx-auto">
        <div class="bg-gradient-to-br from-[#18181B] to-[#09090B] border border-[#26272A] rounded-4xl p-8 shadow-2xl">
          <div class="text-center mb-8">
            <h2 class="text-3xl lg:text-4xl font-bold text-white mb-3">Оформить заявку на услуги БТИ</h2>
            <p class="text-gray-400 text-lg">После создания проекта мы поможем официально согласовать перепланировку</p>
          </div>
          
          <div class="space-y-6">
            <div>
              <label class="block text-white mb-4 font-semibold text-lg">Тип услуги:</label>
              <div class="space-y-3">
                <div v-for="service in services" :key="service.value" 
                     class="flex items-center gap-4 p-5 bg-[#09090B] rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                     :class="selectedService === service.value ? 'border-[#2563EB] bg-[#2563EB]/10 shadow-lg shadow-[#2563EB]/20' : 'border-[#26272A] hover:border-[#2563EB]/50'"
                     @click="selectedService = service.value">
                  <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                       :class="selectedService === service.value ? 'border-[#2563EB]' : 'border-[#26272A]'">
                    <div v-if="selectedService === service.value" class="w-3.5 h-3.5 rounded-full bg-[#2563EB]"></div>
                  </div>
                  <div class="flex-1 cursor-pointer">
                    <div class="flex justify-between items-center">
                      <span class="text-white font-medium">{{ service.label }}</span>
                      <span class="text-[#2563EB] font-bold">{{ service.price }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-3 gap-4">
              <div>
                <label class="block text-gray-400 mb-2 text-sm font-medium">Имя</label>
                <InputText v-model="serviceForm.name" placeholder="Ваше имя" class="w-full bg-[#09090B] border-[#26272A] text-white rounded-xl" />
              </div>
              <div>
                <label class="block text-gray-400 mb-2 text-sm font-medium">Телефон</label>
                <InputText v-model="serviceForm.phone" placeholder="+7 (___) ___-__-__" class="w-full bg-[#09090B] border-[#26272A] text-white rounded-xl" />
              </div>
              <div>
                <label class="block text-gray-400 mb-2 text-sm font-medium">Email</label>
                <InputText v-model="serviceForm.email" placeholder="email@example.com" class="w-full bg-[#09090B] border-[#26272A] text-white rounded-xl" />
              </div>
            </div>

            <Button 
              label="Отправить заявку" 
              class="w-full bg-[#2563EB] hover:bg-[#1D4ED8] border-none text-white py-6 text-lg rounded-xl shadow-lg"
              @click="submitServiceRequest"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#2563EB]/20 to-[#1D4ED8]/10 rounded-4xl mx-4 sm:mx-6 lg:mx-8">
      <div class="max-w-4xl mx-auto text-center space-y-8">
        <h2 class="text-4xl lg:text-5xl font-bold text-white">
          Начните создавать идеальную планировку уже сегодня
        </h2>
        <p class="text-xl text-gray-400">
          Бесплатно для всех. Никаких ограничений. Платите только за то, что вам нужно.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            label="Создать проект бесплатно" 
            size="large"
            class="bg-[#2563EB] hover:bg-[#1D4ED8] border-none text-white px-8 py-6 text-lg rounded-xl"
            @click="() => {}"
          />
          <Button 
            label="Связаться с нами" 
            size="large"
            outlined
            class="border-[#26272A] text-white hover:bg-[#18181B] px-8 py-6 text-lg rounded-xl"
            @click="() => {}"
          />
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 px-4 sm:px-6 lg:px-8 border-t border-[#26272A] bg-[#09090B]">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-4 gap-8">
          <div>
            <IconsLogo class="h-8 w-auto fill-current text-white mb-4" />
            <p class="text-gray-400 text-sm">Цифровой сервис для создания и проверки перепланировок квартир</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">Продукт</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Возможности</a></li>
              <li><a href="#" class="hover:text-white transition-colors">PRO версия</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Цены</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">Компания</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">О нас</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Контакты</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Блог</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-4">Поддержка</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">Помощь</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Документация</a></li>
              <li><a href="#" class="hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-[#26272A] text-center text-gray-400 text-sm">
          <p>© 2024 Гранула. Все права защищены.</p>
        </div>
    </div>
    </footer>
  </div>
</template>

<style scoped>
:deep(.p-card) {
  background: #18181B;
  border-color: #26272A;
  color: rgba(255, 255, 255, 0.87);
}

:deep(.p-card-body) {
  padding: 1.5rem;
}

:deep(.p-card-title) {
  color: white;
  font-weight: 600;
}

:deep(.p-button) {
  font-weight: 500;
}

:deep(.p-inputtext) {
  background-color: #09090B;
  border-color: #26272A;
  color: white;
}

:deep(.p-inputtext::placeholder) {
  color: #717177;
}

:deep(.p-inputtext:focus) {
  border-color: #2563EB;
  box-shadow: 0 0 0 1px #2563EB;
}

:deep(.p-badge) {
  font-weight: 500;
}

:deep(.p-badge.p-badge-success) {
  background: #10b981;
  color: white;
}

:deep(.p-badge.p-badge-warn) {
  background: #f59e0b;
  color: white;
}

:deep(.p-badge.p-badge-info) {
  background: #2563EB;
  color: white;
}
</style>
