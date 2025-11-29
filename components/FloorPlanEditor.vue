<template>
  <div class="w-full h-full relative overflow-hidden bg-[#09090B]" style="position: relative; width: 100%; height: 100%; min-height: 600px;">
    <!-- Canvas контейнер -->
    <div ref="container" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; outline: none;" tabindex="0"></div>
    
    <!-- Уведомление о блокировке (по нормам РФ) -->
    <Transition name="slide-down">
      <div 
        v-if="blockNotification" 
        class="block-notification"
      >
        <div class="block-notification-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <div class="block-notification-content">
          <div class="block-notification-title">
            🚫 {{ blockNotification.reason }}
          </div>
          <div class="block-notification-description">
            {{ blockNotification.description }}
          </div>
          <div class="block-notification-law">
            <span class="law-icon">📜</span>
            {{ blockNotification.law }}
          </div>
        </div>
        <button @click="hideBlockNotification" class="block-notification-close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </Transition>
    
    <!-- Toast панель информации -->
    <Transition name="slide-down">
      <div 
        v-if="selectedObject" 
        class="absolute top-4 left-4 z-50 bg-[#18181B] rounded-xl p-3 sm:p-4 border border-[#26272A] shadow-2xl max-w-[320px] sm:max-w-[380px]"
      >
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-base sm:text-lg font-semibold text-white pr-2">{{ selectedObject.name }}</h3>
          <div class="flex gap-2">
            <button 
              v-if="selectedObject.type !== 'floor'"
              @click="deleteSelectedObject"
              class="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
              title="Удалить"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button 
              @click="clearSelection"
              class="text-gray-400 hover:text-white transition-colors flex-shrink-0"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="space-y-3 text-xs sm:text-sm">
          <!-- Предупреждение о защите -->
          <div 
            v-if="selectedObject.isLoadBearing || selectedObject.isExterior || selectedObject.isPerimeter || (selectedObject.furnitureType === 'stove' && selectedObject.hasGas)"
            class="protection-warning"
          >
            <div class="protection-warning-icon">🔒</div>
            <div class="protection-warning-text">
              <div class="font-medium">Защищённый элемент</div>
              <div class="text-[10px] opacity-80">
                {{ selectedObject.isLoadBearing ? 'Несущая конструкция' : (selectedObject.isExterior || selectedObject.isPerimeter) ? 'Наружная стена' : 'Газовое оборудование' }}
                — изменение запрещено по нормам РФ
              </div>
            </div>
          </div>
          
          <!-- Информация о стене -->
          <div v-if="selectedObject.type === 'wall'" class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Тип:</span>
              <span 
                class="font-medium"
                :class="selectedObject.isLoadBearing ? 'text-red-400' : 'text-green-400'"
              >
                {{ selectedObject.isLoadBearing ? '🔴 Несущая' : '🟢 Ненесущая' }}
              </span>
            </div>
            
            <div class="pt-2 border-t border-[#26272A] space-y-2">
              <div class="text-xs text-gray-400 mb-2">Размеры:</div>
              <div class="space-y-2">
                <div>
                  <label class="text-gray-400 text-xs mb-1 block">Длина (м)</label>
                  <input 
                    type="number" 
                    v-model.number="editingDimensions.length"
                    @change="updateObjectDimensions"
                    step="0.1"
                    min="0.1"
                    class="w-full px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-sm focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
                <div>
                  <label class="text-gray-400 text-xs mb-1 block">Высота (м)</label>
                  <input 
                    type="number" 
                    v-model.number="editingDimensions.height"
                    @change="updateObjectDimensions"
                    step="0.1"
                    min="0.1"
                    class="w-full px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-sm focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
                <div>
                  <label class="text-gray-400 text-xs mb-1 block">Толщина (м)</label>
                  <input 
                    type="number" 
                    v-model.number="editingDimensions.thickness"
                    @change="updateObjectDimensions"
                    step="0.01"
                    min="0.01"
                    class="w-full px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-sm focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div class="pt-2 border-t border-[#26272A] space-y-2">
              <div class="text-xs text-gray-400 mb-2">Позиция:</div>
              <div class="grid grid-cols-3 gap-1.5">
                <input 
                  type="number"
                  v-model.number="editingPosition.x"
                  @change="updateObjectPosition"
                  step="0.1"
                  placeholder="X"
                  class="px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-xs focus:border-[#2563EB] focus:outline-none"
                />
                <input 
                  type="number"
                  v-model.number="editingPosition.y"
                  @change="updateObjectPosition"
                  step="0.1"
                  placeholder="Y"
                  class="px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-xs focus:border-[#2563EB] focus:outline-none"
                />
                <input 
                  type="number"
                  v-model.number="editingPosition.z"
                  @change="updateObjectPosition"
                  step="0.1"
                  placeholder="Z"
                  class="px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-xs focus:border-[#2563EB] focus:outline-none"
                />
              </div>
            </div>
            
            <div class="pt-2 border-t border-[#26272A]">
              <div class="text-xs text-gray-400 mb-2">Поворот:</div>
              <input 
                type="number"
                v-model.number="editingRotation.y"
                @change="updateObjectRotation"
                step="1"
                placeholder="Угол (град)"
                class="w-full px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-xs focus:border-[#2563EB] focus:outline-none"
              />
            </div>
            
            <div class="flex justify-between items-center pt-2 border-t border-[#26272A]">
              <span class="text-gray-400">Периметр:</span>
              <span class="text-white font-medium">{{ selectedObject.isPerimeter ? 'Да' : 'Нет' }}</span>
            </div>
          </div>
          
          <!-- Информация о мебели -->
          <div v-else-if="selectedObject.type === 'furniture'" class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Тип:</span>
              <span class="text-white font-medium">{{ selectedObject.furnitureType }}</span>
            </div>
            
            <div class="pt-2 border-t border-[#26272A] space-y-2">
              <div class="text-xs text-gray-400 mb-2">Размеры:</div>
              <div class="space-y-2">
                <div>
                  <label class="text-gray-400 text-xs mb-1 block">Длина (м)</label>
                  <input 
                    type="number" 
                    v-model.number="editingDimensions.length"
                    @change="updateObjectDimensions"
                    step="0.1"
                    min="0.1"
                    class="w-full px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-sm focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
                <div>
                  <label class="text-gray-400 text-xs mb-1 block">Ширина (м)</label>
                  <input 
                    type="number" 
                    v-model.number="editingDimensions.width"
                    @change="updateObjectDimensions"
                    step="0.1"
                    min="0.1"
                    class="w-full px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-sm focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
                <div>
                  <label class="text-gray-400 text-xs mb-1 block">Высота (м)</label>
                  <input 
                    type="number" 
                    v-model.number="editingDimensions.height"
                    @change="updateObjectDimensions"
                    step="0.1"
                    min="0.1"
                    class="w-full px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-sm focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div class="pt-2 border-t border-[#26272A] space-y-2">
              <div class="text-xs text-gray-400 mb-2">Позиция:</div>
              <div class="grid grid-cols-3 gap-1.5">
                <input 
                  type="number"
                  v-model.number="editingPosition.x"
                  @change="updateObjectPosition"
                  step="0.1"
                  placeholder="X"
                  class="px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-xs focus:border-[#2563EB] focus:outline-none"
                />
                <input 
                  type="number"
                  v-model.number="editingPosition.y"
                  @change="updateObjectPosition"
                  step="0.1"
                  placeholder="Y"
                  class="px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-xs focus:border-[#2563EB] focus:outline-none"
                />
                <input 
                  type="number"
                  v-model.number="editingPosition.z"
                  @change="updateObjectPosition"
                  step="0.1"
                  placeholder="Z"
                  class="px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-xs focus:border-[#2563EB] focus:outline-none"
                />
              </div>
            </div>
            
            <div class="pt-2 border-t border-[#26272A]">
              <div class="text-xs text-gray-400 mb-2">Поворот:</div>
              <input 
                type="number"
                v-model.number="editingRotation.y"
                @change="updateObjectRotation"
                step="1"
                placeholder="Угол (град)"
                class="w-full px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-xs focus:border-[#2563EB] focus:outline-none"
              />
            </div>
          </div>
          
          <!-- Информация о двери -->
          <div v-else-if="selectedObject.type === 'door'" class="space-y-2">
            <div class="pt-2 border-t border-[#26272A] space-y-2">
              <div class="text-xs text-gray-400 mb-2">Размеры:</div>
              <div class="space-y-2">
                <div>
                  <label class="text-gray-400 text-xs mb-1 block">Ширина (м)</label>
                  <input 
                    type="number" 
                    v-model.number="editingDimensions.width"
                    @change="updateObjectDimensions"
                    step="0.1"
                    min="0.1"
                    class="w-full px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-sm focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
                <div>
                  <label class="text-gray-400 text-xs mb-1 block">Высота (м)</label>
                  <input 
                    type="number" 
                    v-model.number="editingDimensions.height"
                    @change="updateObjectDimensions"
                    step="0.1"
                    min="0.1"
                    class="w-full px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-sm focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div class="pt-2 border-t border-[#26272A] space-y-2">
              <div class="text-xs text-gray-400 mb-2">Позиция:</div>
              <div class="grid grid-cols-3 gap-1.5">
                <input 
                  type="number"
                  v-model.number="editingPosition.x"
                  @change="updateObjectPosition"
                  step="0.1"
                  placeholder="X"
                  class="px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-xs focus:border-[#2563EB] focus:outline-none"
                />
                <input 
                  type="number"
                  v-model.number="editingPosition.y"
                  @change="updateObjectPosition"
                  step="0.1"
                  placeholder="Y"
                  class="px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-xs focus:border-[#2563EB] focus:outline-none"
                />
                <input 
                  type="number"
                  v-model.number="editingPosition.z"
                  @change="updateObjectPosition"
                  step="0.1"
                  placeholder="Z"
                  class="px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-xs focus:border-[#2563EB] focus:outline-none"
                />
              </div>
            </div>
            
            <div class="flex justify-between items-center pt-2 border-t border-[#26272A]">
              <span class="text-gray-400">Открывание:</span>
              <span class="text-white font-medium">{{ selectedObject.openSide || 'Правое' }}</span>
            </div>
          </div>
          
          <!-- Информация о перегородке -->
          <div v-else-if="selectedObject.type === 'partition'" class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Тип:</span>
              <span class="text-white font-medium">Перегородка</span>
            </div>
            
            <div class="pt-2 border-t border-[#26272A] space-y-2">
              <div class="text-xs text-gray-400 mb-2">Размеры:</div>
              <div class="space-y-2">
                <div>
                  <label class="text-gray-400 text-xs mb-1 block">Длина (м)</label>
                  <input 
                    type="number" 
                    v-model.number="editingDimensions.length"
                    @change="updateObjectDimensions"
                    step="0.1"
                    min="0.1"
                    class="w-full px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-sm focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
                <div>
                  <label class="text-gray-400 text-xs mb-1 block">Высота (м)</label>
                  <input 
                    type="number" 
                    v-model.number="editingDimensions.height"
                    @change="updateObjectDimensions"
                    step="0.1"
                    min="0.1"
                    class="w-full px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-sm focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
                <div>
                  <label class="text-gray-400 text-xs mb-1 block">Толщина (м)</label>
                  <input 
                    type="number" 
                    v-model.number="editingDimensions.thickness"
                    @change="updateObjectDimensions"
                    step="0.01"
                    min="0.01"
                    class="w-full px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-sm focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div class="pt-2 border-t border-[#26272A] space-y-2">
              <div class="text-xs text-gray-400 mb-2">Позиция:</div>
              <div class="grid grid-cols-3 gap-1.5">
                <input 
                  type="number"
                  v-model.number="editingPosition.x"
                  @change="updateObjectPosition"
                  step="0.1"
                  placeholder="X"
                  class="px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-xs focus:border-[#2563EB] focus:outline-none"
                />
                <input 
                  type="number"
                  v-model.number="editingPosition.y"
                  @change="updateObjectPosition"
                  step="0.1"
                  placeholder="Y"
                  class="px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-xs focus:border-[#2563EB] focus:outline-none"
                />
                <input 
                  type="number"
                  v-model.number="editingPosition.z"
                  @change="updateObjectPosition"
                  step="0.1"
                  placeholder="Z"
                  class="px-2 py-1 bg-[#26272A] border border-[#26272A] rounded text-white text-xs focus:border-[#2563EB] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Панель инструментов (сверху справа) -->
    <div class="absolute top-4 right-0 z-40 flex">
      <!-- Ярлык для открытия панели когда она скрыта -->
      <button 
        v-if="!panelOpen"
        @click="panelOpen = true"
        class="panel-tab"
        title="Открыть панель инструментов"
      >
        <span>🔧</span>
      </button>
      
      <!-- Основная панель -->
      <div 
        class="panel-container"
        :class="panelOpen ? 'panel-open' : 'panel-closed'"
      >
        <!-- Кнопка скрыть панель -->
        <button 
          @click="panelOpen = false"
          class="panel-close-btn"
          title="Скрыть панель"
        >
          ›
        </button>
        
        <!-- Скроллируемый контент -->
        <div class="panel-scroll">
          <!-- Конструкции -->
          <div class="panel-section" :class="{ 'section-collapsed': !sections.constructions }">
            <button @click="sections.constructions = !sections.constructions" class="section-header">
              <span>🏗️ Конструкции</span>
              <span class="section-arrow" :class="{ 'arrow-down': sections.constructions }">‹</span>
            </button>
            <div v-show="sections.constructions" class="section-content">
              <button @click="addNewWall" class="btn-tool" title="Клавиша 1">
                <span>🧱</span><span>Стена</span>
              </button>
              <button @click="addNewPartition" class="btn-tool" title="Клавиша 2">
                <span>📏</span><span>Перегородка</span>
              </button>
              <button @click="addNewDoor" class="btn-tool" title="Клавиша 5">
                <span>🚪</span><span>Дверь</span>
              </button>
              <button @click="addNewWindow" class="btn-tool" title="Клавиша 6">
                <span>🪟</span><span>Окно</span>
              </button>
            </div>
          </div>
          
          <!-- Мебель гостиной -->
          <div class="panel-section" :class="{ 'section-collapsed': !sections.living }">
            <button @click="sections.living = !sections.living" class="section-header">
              <span>🛋️ Гостиная</span>
              <span class="section-arrow" :class="{ 'arrow-down': sections.living }">‹</span>
            </button>
            <div v-show="sections.living" class="section-content">
              <button @click="addNewSofa" class="btn-tool" title="Клавиша 7">
                <span>🛋️</span><span>Диван</span>
              </button>
              <button @click="addNewTable" class="btn-tool" title="Клавиша 3">
                <span>🪑</span><span>Стол</span>
              </button>
              <button @click="addNewChair" class="btn-tool" title="Клавиша 4">
                <span>💺</span><span>Стул</span>
              </button>
              <button @click="addNewTV" class="btn-tool">
                <span>📺</span><span>ТВ тумба</span>
              </button>
            </div>
          </div>
          
          <!-- Мебель спальни -->
          <div class="panel-section" :class="{ 'section-collapsed': !sections.bedroom }">
            <button @click="sections.bedroom = !sections.bedroom" class="section-header">
              <span>🛏️ Спальня</span>
              <span class="section-arrow" :class="{ 'arrow-down': sections.bedroom }">‹</span>
            </button>
            <div v-show="sections.bedroom" class="section-content">
              <button @click="addNewBed" class="btn-tool" title="Клавиша 8">
                <span>🛏️</span><span>Кровать</span>
              </button>
              <button @click="addNewWardrobe" class="btn-tool" title="Клавиша 9">
                <span>🗄️</span><span>Шкаф</span>
              </button>
              <button @click="addNewNightstand" class="btn-tool">
                <span>🗃️</span><span>Тумбочка</span>
              </button>
              <button @click="addNewDesk" class="btn-tool">
                <span>🖥️</span><span>Рабочий стол</span>
              </button>
            </div>
          </div>
          
          <!-- Кухня/Санузел -->
          <div class="panel-section" :class="{ 'section-collapsed': !sections.kitchen }">
            <button @click="sections.kitchen = !sections.kitchen" class="section-header">
              <span>🍳 Кухня / Санузел</span>
              <span class="section-arrow" :class="{ 'arrow-down': sections.kitchen }">‹</span>
            </button>
            <div v-show="sections.kitchen" class="section-content">
              <button @click="addNewFridge" class="btn-tool">
                <span>🧊</span><span>Холодильник</span>
              </button>
              <button @click="addNewStove" class="btn-tool">
                <span>🍳</span><span>Плита</span>
              </button>
              <button @click="addNewBath" class="btn-tool">
                <span>🛁</span><span>Ванна</span>
              </button>
              <button @click="addNewToilet" class="btn-tool">
                <span>🚽</span><span>Унитаз</span>
              </button>
            </div>
          </div>

          <!-- Управление камерой -->
          <div class="panel-section" :class="{ 'section-collapsed': !sections.camera }">
            <button @click="sections.camera = !sections.camera" class="section-header">
              <span>📷 Камера</span>
              <span class="section-arrow" :class="{ 'arrow-down': sections.camera }">‹</span>
            </button>
            <div v-show="sections.camera" class="section-content">
              <button
                @click="setCameraView('perspective')"
                :class="cameraMode === 'perspective' ? 'btn-tool-active' : ''"
                class="btn-tool"
                title="Перспектива"
              >
                <span>🎥</span><span>3D вид</span>
              </button>
              <button
                @click="setCameraView('top')"
                :class="cameraMode === 'top' ? 'btn-tool-active' : ''"
                class="btn-tool"
                title="Вид сверху"
              >
                <span>⬆️</span><span>Сверху</span>
              </button>
              <button
                @click="setCameraView('orthographic')"
                :class="cameraMode === 'orthographic' ? 'btn-tool-active' : ''"
                class="btn-tool"
                title="Ортогональная"
              >
                <span>📐</span><span>Орто</span>
              </button>
              <button
                @click="toggleCameraLock"
                :class="cameraLocked ? 'btn-tool-active' : ''"
                class="btn-tool"
                :title="cameraLocked ? 'Разблокировать (L)' : 'Заблокировать (L)'"
              >
                <span>{{ cameraLocked ? '🔒' : '🔓' }}</span><span>{{ cameraLocked ? 'Разблок.' : 'Заблок.' }}</span>
              </button>
              <button
                @click="toggleGrid"
                :class="showGrid ? 'btn-tool-active' : ''"
                class="btn-tool"
                title="Сетка (G)"
              >
                <span>#</span><span>Сетка</span>
              </button>
              <button
                @click="toggleFullscreen"
                class="btn-tool"
                title="Полный экран (F)"
              >
                <span>⛶</span><span>Полный экран</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Подсказка о горячих клавишах (сворачиваемая) -->
    <div class="absolute bottom-4 left-0 z-40">
      <!-- Ярлык когда свернуто -->
      <button 
        v-if="!hotkeysPanelOpen"
        @click="hotkeysPanelOpen = true"
        class="hotkeys-tab"
        title="Показать горячие клавиши"
      >
        ⌨️
      </button>
      
      <!-- Панель -->
      <div 
        class="hotkeys-panel"
        :class="hotkeysPanelOpen ? 'hotkeys-open' : 'hotkeys-closed'"
      >
        <button @click="hotkeysPanelOpen = false" class="hotkeys-close">×</button>
        <div class="font-medium text-gray-300 mb-1.5 text-xs">Горячие клавиши</div>
        <div class="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
          <div><kbd class="kbd">1</kbd> Стена</div>
          <div><kbd class="kbd">5</kbd> Дверь</div>
          <div><kbd class="kbd">2</kbd> Перегородка</div>
          <div><kbd class="kbd">6</kbd> Окно</div>
          <div><kbd class="kbd">3</kbd> Стол</div>
          <div><kbd class="kbd">7</kbd> Диван</div>
          <div><kbd class="kbd">4</kbd> Стул</div>
          <div><kbd class="kbd">8</kbd> Кровать</div>
          <div><kbd class="kbd">Del</kbd> Удалить</div>
          <div><kbd class="kbd">9</kbd> Шкаф</div>
          <div><kbd class="kbd">←→↑↓</kbd> Двигать</div>
          <div><kbd class="kbd">L</kbd> Камера</div>
        </div>
      </div>
    </div>
    
    <!-- Панель комнат (слева) -->
    <div class="absolute left-0 top-1/2 -translate-y-1/2 z-40">
      <!-- Ярлык когда свернуто -->
      <button 
        v-if="!showRoomPanel"
        @click="showRoomPanel = true"
        class="rooms-tab"
        title="Управление комнатами"
      >
        <span>🏠</span>
      </button>
      
      <!-- Панель комнат -->
      <div 
        class="rooms-panel"
        :class="showRoomPanel ? 'rooms-open' : 'rooms-closed'"
      >
        <button @click="showRoomPanel = false" class="rooms-close-btn">‹</button>
        
        <!-- Заголовок и статистика -->
        <div class="rooms-header">
          <div class="rooms-title">🏠 Комнаты</div>
          <div class="rooms-stats">
            <div class="stat">
              <span class="stat-value">{{ totalArea }}</span>
              <span class="stat-label">м² общая</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ livingArea }}</span>
              <span class="stat-label">м² жилая</span>
            </div>
          </div>
        </div>
        
        <!-- Список комнат -->
        <div class="rooms-list">
          <div 
            v-for="room in rooms" 
            :key="room.id"
            class="room-card"
            :class="{ 'room-selected': selectedRoom?.id === room.id }"
            @click="selectedRoom = room"
          >
            <div class="room-card-header">
              <span class="room-icon">{{ roomTypes[room.type]?.icon }}</span>
              <span class="room-name">{{ room.name }}</span>
              <span class="room-area">{{ room.area }} м²</span>
            </div>
            
            <!-- Расширенные опции при выборе -->
            <div v-if="selectedRoom?.id === room.id" class="room-options">
              <div class="room-type-select">
                <label class="text-[10px] text-gray-400 mb-1 block">Тип помещения:</label>
                <select 
                  :value="room.type"
                  @change="changeRoomType(room.id, $event.target.value)"
                  class="room-select"
                >
                  <option v-for="(type, key) in roomTypes" :key="key" :value="key">
                    {{ type.icon }} {{ type.name }}
                  </option>
                </select>
              </div>
              
              <div class="room-info">
                <div class="room-info-item">
                  <span>{{ room.hasWindow ? '🪟' : '🚫' }}</span>
                  <span>{{ room.hasWindow ? 'Есть окно' : 'Нет окна' }}</span>
                </div>
                <div v-if="room.type === 'kitchenGas'" class="room-info-item warning">
                  <span>🔥</span>
                  <span>Газовая плита</span>
                </div>
                <div v-if="roomTypes[room.type]?.wetZone" class="room-info-item info">
                  <span>💧</span>
                  <span>Мокрая зона</span>
                </div>
              </div>
              
              <!-- Кнопки действий -->
              <div class="room-actions">
                <button 
                  @click.stop="openMergeModal(room)"
                  class="room-action-btn"
                  title="Объединить с другой комнатой"
                >
                  🔗 Объединить
                </button>
                <button 
                  @click.stop="openSplitModal(room)"
                  class="room-action-btn"
                  title="Разделить комнату"
                >
                  ✂️ Разделить
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Проверка планировки -->
        <div class="rooms-footer">
          <button @click="runLayoutValidation" class="validate-btn">
            📋 Проверить планировку
          </button>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно объединения комнат -->
    <div v-if="showMergeModal" class="modal-overlay" @click.self="showMergeModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>🔗 Объединение комнат</h3>
          <button @click="showMergeModal = false" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p class="text-sm text-gray-400 mb-3">
            Выберите комнату для объединения с "{{ mergeSourceRoom?.name }}":
          </p>
          <div class="merge-rooms-list">
            <button 
              v-for="room in rooms.filter(r => r.id !== mergeSourceRoom?.id)"
              :key="room.id"
              @click="performMerge(room.id)"
              class="merge-room-btn"
            >
              <span>{{ roomTypes[room.type]?.icon }}</span>
              <span>{{ room.name }}</span>
              <span class="text-gray-500">({{ room.area }} м²)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно разделения комнаты -->
    <div v-if="showSplitModal" class="modal-overlay" @click.self="showSplitModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>✂️ Разделение комнаты</h3>
          <button @click="showSplitModal = false" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p class="text-sm text-gray-400 mb-3">
            Разделить "{{ splitSourceRoom?.name }}" ({{ splitSourceRoom?.area }} м²):
          </p>
          
          <div class="split-form">
            <div class="split-field">
              <label>Площадь новой комнаты (м²):</label>
              <input 
                type="number" 
                v-model.number="splitNewArea" 
                :max="splitSourceRoom?.area - 1"
                min="1"
                step="0.5"
                class="split-input"
              />
            </div>
            
            <div class="split-field">
              <label>Тип новой комнаты:</label>
              <select v-model="splitNewType" class="split-select">
                <option v-for="(type, key) in roomTypes" :key="key" :value="key">
                  {{ type.icon }} {{ type.name }}
                </option>
              </select>
            </div>
            
            <div class="split-preview">
              <div class="split-preview-item">
                <span>{{ splitSourceRoom?.name }}:</span>
                <span>{{ splitSourceRoom?.area - splitNewArea }} м²</span>
              </div>
              <div class="split-preview-item new">
                <span>{{ roomTypes[splitNewType]?.name }}:</span>
                <span>{{ splitNewArea }} м²</span>
              </div>
            </div>
            
            <button @click="performSplit" class="split-confirm-btn">
              ✂️ Разделить
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Модальное окно результатов проверки -->
    <div v-if="showValidationModal" class="modal-overlay" @click.self="showValidationModal = false">
      <div class="modal-content validation-modal">
        <div class="modal-header">
          <h3>📋 Результаты проверки</h3>
          <button @click="showValidationModal = false" class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div v-if="validationIssues.length === 0" class="validation-success">
            <div class="success-icon">✅</div>
            <div class="success-text">Планировка соответствует нормам РФ!</div>
          </div>
          
          <div v-else class="validation-issues">
            <div 
              v-for="(issue, index) in validationIssues" 
              :key="index"
              class="validation-issue"
              :class="issue.type"
            >
              <span class="issue-icon">{{ issue.type === 'error' ? '❌' : '⚠️' }}</span>
              <div class="issue-content">
                <div class="issue-room">{{ issue.room }}</div>
                <div class="issue-message">{{ issue.message }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- AI Чат снизу -->
    <div class="absolute bottom-0 left-0 right-0 z-50">
      <!-- Ярлык для открытия чата -->
      <button 
        v-if="!chatOpen"
        @click="chatOpen = true"
        class="chat-tab"
      >
        <span class="chat-tab-icon">🤖</span>
        <span class="chat-tab-text">AI Ассистент</span>
        <span v-if="unreadMessages > 0" class="chat-badge">{{ unreadMessages }}</span>
      </button>
      
      <!-- Панель чата -->
      <div 
        class="chat-container"
        :class="chatOpen ? 'chat-open' : 'chat-closed'"
      >
        <!-- Заголовок чата -->
        <div class="chat-header">
          <div class="chat-header-left">
            <div class="chat-avatar">
              <span>🤖</span>
            </div>
            <div>
              <div class="chat-title">AI Ассистент</div>
              <div class="chat-status">
                <span class="status-dot" :class="aiTyping ? 'typing' : 'online'"></span>
                {{ aiTyping ? 'Печатает...' : 'Онлайн' }}
              </div>
            </div>
          </div>
          <div class="chat-header-actions">
            <button @click="clearChat" class="chat-action-btn" title="Очистить чат">
              🗑️
            </button>
            <button @click="chatOpen = false" class="chat-action-btn chat-close" title="Свернуть">
              ▼
            </button>
          </div>
        </div>
        
        <!-- Быстрые действия -->
        <div class="chat-quick-actions">
          <button 
            v-for="action in quickActions" 
            :key="action.id"
            @click="sendQuickAction(action)"
            class="quick-action-btn"
          >
            <span>{{ action.icon }}</span>
            <span>{{ action.label }}</span>
          </button>
        </div>
        
        <!-- Сообщения -->
        <div ref="chatMessages" class="chat-messages">
          <!-- Приветственное сообщение -->
          <div v-if="messages.length === 0" class="chat-welcome">
            <div class="welcome-icon">🏠</div>
            <div class="welcome-title">Привет! Я ваш AI помощник</div>
            <div class="welcome-text">
              Спросите меня о планировке, нормах перепланировки или попросите 
              сгенерировать варианты расстановки мебели.
            </div>
            <div class="welcome-suggestions">
              <button 
                v-for="suggestion in suggestions" 
                :key="suggestion"
                @click="sendMessage(suggestion)"
                class="suggestion-btn"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
          
          <!-- Список сообщений -->
          <div 
            v-for="(msg, index) in messages" 
            :key="index"
            class="chat-message"
            :class="msg.role"
          >
            <div v-if="msg.role === 'assistant'" class="message-avatar">🤖</div>
            <div class="message-content">
              <div class="message-bubble" :class="msg.role">
                <!-- Скелетон для загрузки -->
                <div v-if="msg.loading" class="message-skeleton">
                  <div class="skeleton-line long"></div>
                  <div class="skeleton-line medium"></div>
                  <div class="skeleton-line short"></div>
                </div>
                <!-- Текст сообщения -->
                <div v-else class="message-text" v-html="formatMessage(msg.text)"></div>
              </div>
              <div class="message-time">{{ msg.time }}</div>
            </div>
            <div v-if="msg.role === 'user'" class="message-avatar user">👤</div>
          </div>
          
          <!-- Индикатор печатания -->
          <div v-if="aiTyping" class="chat-message assistant">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              <div class="message-bubble assistant">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Поле ввода -->
        <div class="chat-input-container">
          <div class="chat-input-wrapper">
            <input 
              v-model="chatInput"
              @keyup.enter="sendUserMessage"
              type="text"
              placeholder="Спросите про планировку..."
              class="chat-input"
              :disabled="aiTyping"
            />
            <button 
              @click="sendUserMessage"
              class="chat-send-btn"
              :disabled="!chatInput.trim() || aiTyping"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
          <div class="chat-input-hint">
            Powered by AI · Проверка норм в реальном времени
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

const container = ref(null)
const selectedObject = ref(null)
const tool = ref(null)
const cameraMode = ref('perspective')
const showGrid = ref(true)
const cameraLocked = ref(false)
const isFullscreen = ref(false)

// Управление панелями
const panelOpen = ref(true)
const hotkeysPanelOpen = ref(false)
const sections = ref({
  constructions: true,
  living: true,
  bedroom: false,
  kitchen: false,
  camera: true
})

// AI Чат
const chatOpen = ref(false)
const chatInput = ref('')
const aiTyping = ref(false)
const messages = ref([])
const unreadMessages = ref(0)
const chatMessages = ref(null)

// Система блокировки по нормам РФ
const blockNotification = ref(null)
const blockNotificationTimeout = ref(null)

// Проверка защищённости объекта (несущие стены, газовое оборудование и т.д.)
function isProtectedObject(object) {
  if (!object || !object.userData) return { blocked: false }
  
  const userData = object.userData
  
  // Несущие стены - нельзя перемещать/удалять
  if (userData.type === 'wall' && userData.isLoadBearing) {
    return {
      blocked: true,
      reason: 'Несущая стена',
      description: 'По СНиП 31-01-2003 и Жилищному кодексу РФ запрещено сносить, перемещать или изменять несущие конструкции без специального разрешения.',
      law: 'ст. 26 ЖК РФ, СП 54.13330.2016'
    }
  }
  
  // Внешние/периметр стены - категорически нельзя
  if (userData.type === 'wall' && (userData.isExterior || userData.isPerimeter)) {
    return {
      blocked: true,
      reason: 'Наружная стена',
      description: 'Наружные стены являются частью несущего каркаса здания. Любые изменения запрещены.',
      law: 'ст. 26 ЖК РФ'
    }
  }
  
  // Вентиляционные шахты - нельзя трогать
  if (userData.furnitureType === 'ventilation' || userData.name?.includes('Вентиляц')) {
    return {
      blocked: true,
      reason: 'Вентиляционная шахта',
      description: 'Вентиляционные каналы являются общедомовым имуществом. Их перенос или демонтаж запрещён.',
      law: 'ст. 36 ЖК РФ, СП 60.13330.2016'
    }
  }
  
  // Газовое оборудование - ограниченное перемещение
  if (userData.furnitureType === 'stove' && userData.hasGas) {
    return {
      blocked: true,
      reason: 'Газовое оборудование',
      description: 'Перенос газовой плиты требует согласования с газовой службой. Самостоятельное перемещение запрещено.',
      law: 'ПП РФ №410, СП 402.1325800.2018'
    }
  }
  
  // Мокрые зоны (ванная/туалет) - особые правила
  if (userData.room === 'bathroom' && userData.type === 'floor') {
    return {
      blocked: true,
      reason: 'Мокрая зона',
      description: 'Санузлы нельзя размещать над жилыми комнатами соседей снизу.',
      law: 'СП 54.13330.2016 п.9.22'
    }
  }
  
  return { blocked: false }
}

// Показать уведомление о блокировке
function showBlockNotification(protection) {
  if (blockNotificationTimeout.value) {
    clearTimeout(blockNotificationTimeout.value)
  }
  
  blockNotification.value = protection
  
  // Автоматически скрыть через 5 секунд
  blockNotificationTimeout.value = setTimeout(() => {
    blockNotification.value = null
  }, 5000)
}

// Скрыть уведомление
function hideBlockNotification() {
  if (blockNotificationTimeout.value) {
    clearTimeout(blockNotificationTimeout.value)
  }
  blockNotification.value = null
}

// ============================================
// СИСТЕМА КОМНАТ И ПРОВЕРКИ НОРМ РФ
// ============================================

// Типы комнат
const roomTypes = {
  living: { name: 'Жилая комната', icon: '🛋️', color: 0x4a5568, minArea: 14, requiresWindow: true },
  bedroom: { name: 'Спальня', icon: '🛏️', color: 0x5c4a6a, minArea: 8, requiresWindow: true },
  kitchen: { name: 'Кухня', icon: '🍳', color: 0x6b5b4f, minArea: 5, requiresWindow: true, hasGas: false },
  kitchenGas: { name: 'Кухня (газ)', icon: '🔥', color: 0x8b5a2b, minArea: 6, requiresWindow: true, hasGas: true },
  bathroom: { name: 'Ванная', icon: '🛁', color: 0x2d4a5a, minArea: 2.5, wetZone: true },
  toilet: { name: 'Туалет', icon: '🚽', color: 0x3d5a6a, minArea: 1.2, wetZone: true },
  combined: { name: 'Санузел', icon: '🚿', color: 0x2d5a5a, minArea: 3.8, wetZone: true },
  hallway: { name: 'Коридор', icon: '🚪', color: 0x4a4a4a, minArea: 0 },
  storage: { name: 'Кладовая', icon: '📦', color: 0x3d3d3d, minArea: 0 },
  balcony: { name: 'Балкон', icon: '🌤️', color: 0x5a6a5a, minArea: 0 },
  loggia: { name: 'Лоджия', icon: '🏠', color: 0x5a6a5a, minArea: 0 }
}

// Комнаты в квартире
const rooms = ref([])
const selectedRoom = ref(null)
const showRoomPanel = ref(false)
const roomChangeNotification = ref(null)

// Модальные окна
const showMergeModal = ref(false)
const showSplitModal = ref(false)
const showValidationModal = ref(false)
const mergeSourceRoom = ref(null)
const splitSourceRoom = ref(null)
const splitNewArea = ref(5)
const splitNewType = ref('storage')
const validationIssues = ref([])

// Открыть модальное окно объединения
function openMergeModal(room) {
  mergeSourceRoom.value = room
  showMergeModal.value = true
}

// Выполнить объединение
function performMerge(targetRoomId) {
  if (mergeRooms(mergeSourceRoom.value.id, targetRoomId)) {
    showMergeModal.value = false
    mergeSourceRoom.value = null
  }
}

// Открыть модальное окно разделения
function openSplitModal(room) {
  splitSourceRoom.value = room
  splitNewArea.value = Math.floor(room.area / 2)
  splitNewType.value = 'storage'
  showSplitModal.value = true
}

// Выполнить разделение
function performSplit() {
  if (splitRoom(splitSourceRoom.value.id, splitNewArea.value, splitNewType.value)) {
    showSplitModal.value = false
    splitSourceRoom.value = null
  }
}

// Запустить проверку планировки
function runLayoutValidation() {
  validationIssues.value = validateLayout()
  showValidationModal.value = true
}

// Инициализация комнат (Квартира №309)
function initRooms() {
  rooms.value = [
    { id: 'room11', type: 'bedroom', name: 'Комната 1', area: 14.0, hasWindow: true, floor: null, walls: [], bounds: null },
    { id: 'room21', type: 'living', name: 'Комната 2', area: 4.8, hasWindow: false, floor: null, walls: [], bounds: null },
    { id: 'living1', type: 'living', name: 'Большая комната', area: 17.52, hasWindow: true, floor: null, walls: [], bounds: null },
    { id: 'kitchen1', type: 'kitchenGas', name: 'Кухня', area: 9.2, hasWindow: false, hasGas: true, floor: null, walls: [], bounds: null },
    { id: 'bathroom1', type: 'combined', name: 'Санузел', area: 10.78, hasWindow: false, floor: null, walls: [], bounds: null },
    { id: 'hallway1', type: 'hallway', name: 'Коридор', area: 3.9, hasWindow: false, floor: null, walls: [], bounds: null }
  ]
}

// Проверка возможности смены типа комнаты по нормам РФ
function canChangeRoomType(room, newType) {
  const currentType = roomTypes[room.type]
  const targetType = roomTypes[newType]
  
  // Проверка: кухня с газом → жилая комната (ЗАПРЕЩЕНО)
  if (room.type === 'kitchenGas' && (newType === 'living' || newType === 'bedroom')) {
    return {
      allowed: false,
      reason: 'Запрещено по нормам РФ',
      description: 'Нельзя переоборудовать кухню с газовой плитой в жилую комнату. Необходимо сначала отключить газоснабжение и заменить на электрическую плиту.',
      law: 'ПП РФ №410, СП 402.1325800.2018'
    }
  }
  
  // Проверка: жилая → санузел (ЗАПРЕЩЕНО над жилыми соседей)
  if ((room.type === 'living' || room.type === 'bedroom') && targetType?.wetZone) {
    return {
      allowed: false,
      reason: 'Запрещено по нормам РФ',
      description: 'Санузел нельзя размещать над жилыми комнатами соседей снизу. Мокрые зоны должны располагаться только над нежилыми помещениями.',
      law: 'СП 54.13330.2016 п.9.22'
    }
  }
  
  // Проверка: санузел → жилая (над санузлом соседей — можно)
  if (currentType?.wetZone && (newType === 'living' || newType === 'bedroom')) {
    return {
      allowed: true,
      warning: true,
      reason: 'Требуется согласование',
      description: 'Перенос санузла возможен, но требует демонтажа сантехнического оборудования и гидроизоляции.',
      law: 'СП 54.13330.2016'
    }
  }
  
  // Проверка: минимальная площадь
  if (targetType?.minArea && room.area < targetType.minArea) {
    return {
      allowed: false,
      reason: 'Недостаточная площадь',
      description: `Минимальная площадь для ${targetType.name}: ${targetType.minArea} м². Текущая площадь: ${room.area} м².`,
      law: 'СП 54.13330.2016'
    }
  }
  
  // Проверка: наличие окна для жилых помещений
  if (targetType?.requiresWindow && !room.hasWindow) {
    return {
      allowed: false,
      reason: 'Отсутствует естественное освещение',
      description: `${targetType.name} обязательно должна иметь окно для естественного освещения.`,
      law: 'СП 54.13330.2016 п.9.12'
    }
  }
  
  return { allowed: true }
}

// Смена типа комнаты
function changeRoomType(roomId, newType) {
  const room = rooms.value.find(r => r.id === roomId)
  if (!room) return
  
  const check = canChangeRoomType(room, newType)
  
  if (!check.allowed) {
    showBlockNotification({
      blocked: true,
      reason: check.reason,
      description: check.description,
      law: check.law
    })
    return false
  }
  
  if (check.warning) {
    roomChangeNotification.value = {
      type: 'warning',
      reason: check.reason,
      description: check.description,
      law: check.law
    }
    setTimeout(() => { roomChangeNotification.value = null }, 4000)
  }
  
  // Меняем тип
  const oldType = room.type
  room.type = newType
  room.name = roomTypes[newType].name
  
  // Обновляем цвет пола если есть
  if (room.floor) {
    room.floor.material.color.setHex(roomTypes[newType].color)
  }
  
  return true
}

// Проверка возможности объединения комнат
function canMergeRooms(room1, room2) {
  const type1 = roomTypes[room1.type]
  const type2 = roomTypes[room2.type]
  
  // Кухня с газом + жилая комната — только с дверью
  if ((room1.type === 'kitchenGas' && (room2.type === 'living' || room2.type === 'bedroom')) ||
      (room2.type === 'kitchenGas' && (room1.type === 'living' || room1.type === 'bedroom'))) {
    return {
      allowed: false,
      reason: 'Запрещено без двери',
      description: 'Объединение кухни с газовой плитой и жилой комнаты запрещено. Между ними обязательно должна быть дверь или раздвижная перегородка.',
      law: 'ПП РФ №410, п.5.1'
    }
  }
  
  // Санузел + жилая — запрещено
  if ((type1?.wetZone && !type2?.wetZone) || (!type1?.wetZone && type2?.wetZone)) {
    if (room1.type !== 'hallway' && room1.type !== 'storage' && 
        room2.type !== 'hallway' && room2.type !== 'storage') {
      return {
        allowed: false,
        reason: 'Запрещено по нормам',
        description: 'Нельзя объединять санузел с жилым помещением напрямую.',
        law: 'СП 54.13330.2016'
      }
    }
  }
  
  return { allowed: true }
}

// Объединение комнат
function mergeRooms(room1Id, room2Id) {
  const room1 = rooms.value.find(r => r.id === room1Id)
  const room2 = rooms.value.find(r => r.id === room2Id)
  
  if (!room1 || !room2) return false
  
  const check = canMergeRooms(room1, room2)
  if (!check.allowed) {
    showBlockNotification({
      blocked: true,
      reason: check.reason,
      description: check.description,
      law: check.law
    })
    return false
  }
  
  // Объединяем: увеличиваем площадь первой, удаляем вторую
  room1.area = parseFloat((room1.area + room2.area).toFixed(1))
  room1.name = `${room1.name} + ${room2.name}`
  room1.hasWindow = room1.hasWindow || room2.hasWindow
  
  // Удаляем вторую комнату
  const index = rooms.value.findIndex(r => r.id === room2Id)
  if (index > -1) {
    rooms.value.splice(index, 1)
  }
  
  return true
}

// Разделение комнаты
function splitRoom(roomId, newArea, newType) {
  const room = rooms.value.find(r => r.id === roomId)
  if (!room) return false
  
  if (newArea >= room.area) {
    showBlockNotification({
      blocked: true,
      reason: 'Некорректная площадь',
      description: 'Площадь новой комнаты должна быть меньше исходной.',
      law: ''
    })
    return false
  }
  
  // Проверяем минимальные площади
  const remainingArea = room.area - newArea
  const currentTypeMin = roomTypes[room.type]?.minArea || 0
  const newTypeMin = roomTypes[newType]?.minArea || 0
  
  if (remainingArea < currentTypeMin) {
    showBlockNotification({
      blocked: true,
      reason: 'Недостаточная площадь',
      description: `После разделения ${roomTypes[room.type].name} будет иметь площадь ${remainingArea} м², что меньше минимума ${currentTypeMin} м².`,
      law: 'СП 54.13330.2016'
    })
    return false
  }
  
  if (newArea < newTypeMin) {
    showBlockNotification({
      blocked: true,
      reason: 'Недостаточная площадь',
      description: `Новая комната типа "${roomTypes[newType].name}" требует минимум ${newTypeMin} м². Указано: ${newArea} м².`,
      law: 'СП 54.13330.2016'
    })
    return false
  }
  
  // Уменьшаем площадь исходной комнаты
  room.area = parseFloat(remainingArea.toFixed(1))
  
  // Создаём новую комнату
  const newRoom = {
    id: `room_${Date.now()}`,
    type: newType,
    name: roomTypes[newType].name,
    area: newArea,
    hasWindow: false,
    floor: null,
    walls: []
  }
  
  rooms.value.push(newRoom)
  
  return newRoom
}

// Расчёт общей площади
const totalArea = computed(() => {
  return rooms.value.reduce((sum, room) => sum + room.area, 0).toFixed(1)
})

// Расчёт жилой площади
const livingArea = computed(() => {
  return rooms.value
    .filter(r => ['living', 'bedroom'].includes(r.type))
    .reduce((sum, room) => sum + room.area, 0)
    .toFixed(1)
})

// Проверка всей планировки на соответствие нормам
function validateLayout() {
  const issues = []
  
  rooms.value.forEach(room => {
    const type = roomTypes[room.type]
    
    // Проверка площади
    if (type?.minArea && room.area < type.minArea) {
      issues.push({
        room: room.name,
        type: 'error',
        message: `Площадь ${room.area} м² меньше минимума ${type.minArea} м²`
      })
    }
    
    // Проверка окон
    if (type?.requiresWindow && !room.hasWindow) {
      issues.push({
        room: room.name,
        type: 'error',
        message: 'Требуется естественное освещение (окно)'
      })
    }
  })
  
  // Проверка наличия обязательных помещений
  const hasKitchen = rooms.value.some(r => r.type === 'kitchen' || r.type === 'kitchenGas')
  const hasBathroom = rooms.value.some(r => ['bathroom', 'toilet', 'combined'].includes(r.type))
  
  if (!hasKitchen) {
    issues.push({ room: 'Квартира', type: 'warning', message: 'Отсутствует кухня' })
  }
  if (!hasBathroom) {
    issues.push({ room: 'Квартира', type: 'warning', message: 'Отсутствует санузел' })
  }
  
  return issues
}

const quickActions = [
  { id: 1, icon: '✨', label: 'Варианты', action: 'generate' },
  { id: 2, icon: '📐', label: 'Проверить', action: 'check' },
  { id: 3, icon: '🛋️', label: 'Мебель', action: 'furniture' },
  { id: 4, icon: '📏', label: 'Площадь', action: 'area' }
]

const suggestions = [
  'Можно ли снести эту стену?',
  'Предложи варианты планировки',
  'Какие нормы для кухни?',
  'Расставь мебель в гостиной'
]

const getCurrentTime = () => {
  return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

const formatMessage = (text) => {
  // Базовое форматирование: жирный, курсив, списки
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>')
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight
    }
  }, 100)
}

const sendMessage = (text) => {
  if (!text.trim()) return
  
  messages.value.push({
    role: 'user',
    text: text,
    time: getCurrentTime()
  })
  
  chatInput.value = ''
  scrollToBottom()
  
  // Имитация ответа AI (потом заменить на API)
  simulateAIResponse(text)
}

const sendUserMessage = () => {
  sendMessage(chatInput.value)
}

const sendQuickAction = (action) => {
  const actionTexts = {
    generate: 'Сгенерируй 3-5 вариантов планировки для этой квартиры',
    check: 'Проверь текущую планировку на соответствие нормам',
    furniture: 'Предложи оптимальную расстановку мебели',
    area: 'Рассчитай площадь всех помещений'
  }
  sendMessage(actionTexts[action.action])
}

const simulateAIResponse = (userMessage) => {
  aiTyping.value = true
  
  // Добавляем пустое сообщение со скелетоном
  const loadingIndex = messages.value.length
  messages.value.push({
    role: 'assistant',
    text: '',
    loading: true,
    time: getCurrentTime()
  })
  scrollToBottom()
  
  // Имитация задержки ответа
  setTimeout(() => {
    aiTyping.value = false
    
    // Генерируем ответ в зависимости от запроса
    let response = generateMockResponse(userMessage)
    
    messages.value[loadingIndex] = {
      role: 'assistant',
      text: response,
      loading: false,
      time: getCurrentTime()
    }
    
    if (!chatOpen.value) {
      unreadMessages.value++
    }
    
    scrollToBottom()
  }, 1500 + Math.random() * 1000)
}

const generateMockResponse = (userMessage) => {
  const lowerMsg = userMessage.toLowerCase()
  
  if (lowerMsg.includes('снести') || lowerMsg.includes('стен')) {
    return `**Анализ стены:**\n\n✅ Данная стена является **перегородкой** (толщина < 150мм)\n\n📋 По СНиП 31-01-2003 снос разрешён при условии:\n• Сохранения минимальной ширины прохода 70см\n• Отсутствия инженерных коммуникаций\n\n⚠️ *Рекомендация:* Перед сносом закажите техническое заключение.`
  }
  
  if (lowerMsg.includes('вариант') || lowerMsg.includes('планировк') || lowerMsg.includes('генер')) {
    return `**Генерация вариантов** 🏠\n\nАнализирую текущую планировку...\n\n🎯 Найдено **4 варианта**:\n\n1. **Открытая планировка** — объединение кухни и гостиной\n2. **Студия** — максимальное пространство\n3. **Классическая** — изолированные комнаты\n4. **Эргономичная** — оптимизация проходов\n\n💡 *Хотите применить один из вариантов?*`
  }
  
  if (lowerMsg.includes('мебел') || lowerMsg.includes('расстав')) {
    return `**Расстановка мебели** 🛋️\n\nРекомендации для вашей гостиной:\n\n• Диван: напротив окна, 80см от стены\n• ТВ-зона: на противоположной стене\n• Журнальный столик: центр зоны отдыха\n\n📐 Учтены нормы:\n✓ Проходы минимум 70см\n✓ Расстояние до ТВ = 2.5× диагональ\n\n*Применить расстановку?*`
  }
  
  if (lowerMsg.includes('площад') || lowerMsg.includes('рассчит')) {
    return `**Расчёт площадей** 📏\n\n| Помещение | Площадь |\n|-----------|--------|\n| Гостиная | 18.5 м² |\n| Спальня | 14.2 м² |\n| Кухня | 9.8 м² |\n| Ванная | 4.3 м² |\n| Прихожая | 5.7 м² |\n\n**Общая площадь:** 52.5 м²\n**Жилая площадь:** 32.7 м²`
  }
  
  if (lowerMsg.includes('норм') || lowerMsg.includes('кухн')) {
    return `**Нормы для кухни** 📋\n\nСогласно СП 54.13330.2016:\n\n• Минимальная площадь: **5 м²** (для 1-комн.) или **8 м²** (многокомн.)\n• Естественное освещение: **обязательно**\n• Вытяжка: мин. **60 м³/час**\n\n⚠️ **Запрещено:**\n• Размещать над жилыми комнатами\n• Объединять с газифицированной кухней без двери`
  }
  
  return `Понял ваш запрос! 🤖\n\nЯ анализирую планировку и подготовлю рекомендации.\n\n*Что я могу сделать:*\n• Проверить соответствие нормам\n• Сгенерировать варианты планировки\n• Рассчитать площади\n• Предложить расстановку мебели\n\n💡 Уточните ваш запрос для более детального ответа.`
}

const clearChat = () => {
  messages.value = []
  unreadMessages.value = 0
}

// Сбрасываем счётчик при открытии чата
watch(chatOpen, (isOpen) => {
  if (isOpen) {
    unreadMessages.value = 0
  }
})

// При выборе комнаты в панели - подсветить её в 3D
watch(selectedRoom, (room) => {
  if (!room) {
    clearRoomHighlight()
    return
  }
  
  clearRoomHighlight()
  
  // Находим roomId без цифры в конце
  const roomId = room.id.replace(/\d+$/, '')
  highlightRoom(roomId)
})

const editingDimensions = ref({ length: 0, width: 0, height: 0, thickness: 0 })
const editingPosition = ref({ x: 0, y: 0, z: 0 })
const editingRotation = ref({ y: 0 })

let scene, camera, renderer, controls, raycaster, mouse, orthographicCamera
let animationId = null
let handleResize = null
let allObjects = []
let selectedMesh = null
let clickHandler = null
let dragHandler = null
let isDragging = false
let dragPlane = null
let dragOffset = new THREE.Vector3()
let gridHelper = null
let apartmentGroup = null

// Отслеживание изменений selectedObject для обновления полей редактирования
watch(selectedObject, (newObj) => {
  if (newObj && selectedMesh) {
    editingDimensions.value = {
      length: newObj.length || 0,
      width: newObj.width || 0,
      height: newObj.height || 0,
      thickness: newObj.thickness || 0
    }
    editingPosition.value = {
      x: parseFloat(selectedMesh.position.x.toFixed(2)),
      y: parseFloat(selectedMesh.position.y.toFixed(2)),
      z: parseFloat(selectedMesh.position.z.toFixed(2))
    }
    editingRotation.value = {
      y: parseFloat((selectedMesh.rotation.y * (180 / Math.PI)).toFixed(1))
    }
  }
}, { deep: true })

onMounted(() => {
  if (!container.value) {
    setTimeout(() => onMounted(), 100)
    return
  }

  initializeScene()
  createApartment()
  setupControls()
  setupEventHandlers()
  startAnimation()
  initRooms()
  
  // Даем фокус контейнеру для работы горячих клавиш
  setTimeout(() => {
    if (container.value) {
      container.value.focus()
    }
  }, 200)

  // Resize handler
  handleResize = () => {
    if (!container.value || !camera || !renderer) return
    const width = container.value.clientWidth
    const height = container.value.clientHeight
    if (width === 0 || height === 0) return
    
    renderer.setSize(width, height)
    
    if (cameraMode.value === 'orthographic' && orthographicCamera) {
      orthographicCamera.left = -width / 50
      orthographicCamera.right = width / 50
      orthographicCamera.top = height / 50
      orthographicCamera.bottom = -height / 50
      orthographicCamera.updateProjectionMatrix()
    } else if (camera.isPerspectiveCamera) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
  }

  window.addEventListener('resize', handleResize)
  setTimeout(() => handleResize(), 100)
})

function initializeScene() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x09090b)

  const width = container.value.clientWidth || 800
  const height = container.value.clientHeight || 600

  // Перспективная камера
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
  camera.position.set(0, 15, 18)
  camera.lookAt(0, 0, 0)

  // Ортогональная камера
  orthographicCamera = new THREE.OrthographicCamera(
    -width / 50,
    width / 50,
    height / 50,
    -height / 50,
    0.1,
    1000
  )
  orthographicCamera.position.set(0, 15, 0)
  orthographicCamera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.appendChild(renderer.domElement)

  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  // Освещение
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 10, 5)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // Grid helper (увеличенная сетка для большей квартиры)
  gridHelper = new THREE.GridHelper(30, 30, 0x444444, 0x222222)
  scene.add(gridHelper)
}

function createApartment() {
  apartmentGroup = new THREE.Group()

  // === КВАРТИРА №309 по чертежу ===
  // Масштаб: 1 единица = 1 метр
  // Высота потолков: 3.00м
  
  // Размеры из чертежа:
  // Комната 1 (верхняя левая): ~14м² (3.19 x 4.4)
  // Комната 2 (нижняя левая): ~4.8м² 
  // Большая комната: ~17.52м² (4.49 x 3.83)
  // Кухня: ~9.2м² (4.48 x 2.10)
  // Санузел: ~10.78м²
  // Коридор: центральная часть

  const roomsData = [
    { 
      id: 'room1', name: 'Комната 1', type: 'bedroom',
      x: -4.4, z: 2.2, width: 3.19, depth: 4.4,
      color: 0x4a5a6a, hasWindow: true, area: 14.0
    },
    { 
      id: 'room2', name: 'Комната 2', type: 'living',
      x: -4.6, z: -1.6, width: 2.4, depth: 2.0,
      color: 0x5a4a5a, hasWindow: false, area: 4.8
    },
    { 
      id: 'living', name: 'Большая комната', type: 'living',
      x: 1.0, z: 0.5, width: 4.49, depth: 3.83,
      color: 0x3a4a5a, hasWindow: true, area: 17.52
    },
    { 
      id: 'kitchen', name: 'Кухня', type: 'kitchenGas',
      x: 1.0, z: -2.8, width: 4.48, depth: 2.10,
      color: 0x5a4a3a, hasWindow: false, hasGas: true, area: 9.2
    },
    { 
      id: 'bathroom', name: 'Санузел', type: 'combined',
      x: 5.5, z: -2.5, width: 2.7, depth: 3.94,
      color: 0x2a5a6a, hasWindow: false, area: 10.78
    },
    { 
      id: 'hallway', name: 'Коридор', type: 'hallway',
      x: -1.5, z: -2.8, width: 1.59, depth: 2.5,
      color: 0x3a3a3a, hasWindow: false, area: 3.9
    }
  ]

  // Границы квартиры (по чертежу ~8м x 7м)
  apartmentBounds = {
    minX: -6.0, maxX: 7.0,
    minZ: -4.5, maxZ: 4.5
  }

  // === СОЗДАНИЕ КОМНАТ ===
  roomsData.forEach(roomData => {
    const roomGroup = createRoomWithBorder(roomData)
    apartmentGroup.add(roomGroup)
    
    const roomRef = rooms.value.find(r => r.id === roomData.id + '1')
    if (roomRef) {
      roomRef.floor = roomGroup
      roomRef.area = roomData.area
      roomRef.bounds = {
        minX: roomData.x - roomData.width / 2,
        maxX: roomData.x + roomData.width / 2,
        minZ: roomData.z - roomData.depth / 2,
        maxZ: roomData.z + roomData.depth / 2
      }
    }
  })

  // === ВНЕШНИЕ НЕСУЩИЕ СТЕНЫ ===
  // Левая стена (вертикальная, несущая)
  addWallWithDimension([-5.9, 1.5, 0], [0.2, 3, 9], 'Левая стена', true, true, '5.50м', 'vertical')
  
  // Правая стена 
  addWallWithDimension([6.9, 1.5, -1], [0.2, 3, 7], 'Правая стена', true, true)
  
  // Задняя стена (нижняя на плане)
  addWallWithDimension([0.5, 1.5, -4.4], [12.6, 3, 0.2], 'Задняя стена', true, true, '4.87м + 2.70м', 'horizontal')
  
  // Передняя стена (верхняя на плане) - левая часть
  addWallWithDimension([-4.5, 1.5, 4.4], [2.8, 3, 0.2], 'Передняя стена (левая)', true, true)
  
  // Передняя стена - центр (над окном комнаты 1)
  addWallWithDimension([-4.4, 2.7, 4.4], [3.19, 0.6, 0.2], 'Перемычка окна 1', true, true, '3.19м')
  
  // Передняя стена - правая часть  
  addWallWithDimension([2.5, 1.5, 4.4], [5, 3, 0.2], 'Передняя стена (правая)', true, true)

  // === ВНУТРЕННИЕ ПЕРЕГОРОДКИ ===
  // Перегородка между комнатой 1 и комнатой 2 (горизонтальная)
  addPartitionWithLabel([-4.4, 1.5, 0], [3.19, 3, 0.12], 'Перегородка комната 1-2')
  
  // Перегородка между комнатой 2 и коридором
  addPartitionWithLabel([-3.3, 1.5, -1.6], [0.12, 3, 2.0], 'Перегородка коридор')
  
  // Перегородка между коридором и большой комнатой
  addPartitionWithLabel([-0.7, 1.5, 0.5], [0.12, 3, 3.83], 'Перегородка гостиная')
  
  // Перегородка между большой комнатой и кухней
  addPartitionWithLabel([1.0, 1.5, -1.3], [4.49, 3, 0.12], 'Перегородка кухня')
  
  // Перегородка между кухней и санузлом
  addPartitionWithLabel([4.1, 1.5, -2.8], [0.12, 3, 2.1], 'Перегородка санузел')
  
  // Перегородка внутри санузла (разделение ванна/туалет)
  addPartitionWithLabel([5.5, 1.5, -1.5], [2.7, 3, 0.12], 'Перегородка в санузле')

  // === ДВЕРИ ===
  // Входная дверь (из коридора на лестничную площадку)
  addDoorWithFrame([-2.5, 1, -4.4], 0.9, 2.1, 'Входная дверь', 0x5a4033)
  
  // Дверь в комнату 1 (из коридора)
  addDoorWithFrame([-3.3, 1, -0.5], 0.8, 2.1, 'Дверь в комнату 1', 0x8b7355)
  
  // Дверь в комнату 2
  addDoorWithFrame([-3.8, 1, 0], 0.8, 2.1, 'Дверь в комнату 2', 0x8b7355)
  
  // Дверь в большую комнату
  addDoorWithFrame([-0.7, 1, 1.5], 0.9, 2.1, 'Дверь в гостиную', 0x8b7355)
  
  // Дверь в кухню
  addDoorWithFrame([0.5, 1, -1.3], 0.8, 2.1, 'Дверь в кухню', 0x8b7355)
  
  // Дверь в санузел
  addDoorWithFrame([4.1, 1, -3.2], 0.7, 2.1, 'Дверь в санузел', 0xffffff)

  // === ОКНА ===
  // Окно комнаты 1 (на передней стене)
  addWindowWithFrame([-4.4, 1.5, 4.4], 1.78, 1.4, 'Окно комнаты 1')
  
  // Окно большой комнаты
  addWindowWithFrame([1.0, 1.5, 4.4], 2.0, 1.4, 'Окно гостиной')

  // === МЕБЕЛЬ ПО КОМНАТАМ ===
  
  // КОМНАТА 1 (спальня)
  addRoomFurniture('room1', [-4.4, 0.2, 3.2], [1.6, 0.4, 2.0], 'Кровать', 0x7a6a5a, 'bed')
  addRoomFurniture('room1', [-4.4, 0.4, 4.0], [1.6, 0.4, 0.1], 'Изголовье', 0x5a4a3a, 'bed')
  addRoomFurniture('room1', [-5.5, 0.25, 3.5], [0.4, 0.5, 0.35], 'Тумбочка', 0x6b5b4f, 'nightstand')
  addRoomFurniture('room1', [-3.2, 1, 1], [0.5, 2, 1.5], 'Шкаф', 0x4a3f35, 'wardrobe')
  
  // КОМНАТА 2 (кабинет/детская)
  addRoomFurniture('room2', [-5.2, 0.38, -1.6], [1.0, 0.76, 0.6], 'Рабочий стол', 0x6b5b4f, 'desk')
  addRoomFurniture('room2', [-5.2, 0.22, -1.6], [0.4, 0.44, 0.4], 'Стул', 0x5a6a7a, 'chair')
  addRoomFurniture('room2', [-4.0, 0.6, -2.3], [0.8, 1.2, 0.3], 'Стеллаж', 0x5c4a3a, 'shelf')

  // БОЛЬШАЯ КОМНАТА (гостиная)
  addRoomFurniture('living', [1.0, 0.2, 1.8], [2.0, 0.4, 0.9], 'Диван', 0x4a6fa5, 'sofa')
  addRoomFurniture('living', [1.0, 0.15, 0.5], [0.8, 0.3, 0.5], 'Журнальный столик', 0x6b5b4f, 'table')
  addRoomFurniture('living', [2.8, 0.25, 0.5], [0.4, 0.5, 0.4], 'Кресло', 0x4a6fa5, 'chair')
  addRoomFurniture('living', [1.0, 0.3, -0.8], [1.2, 0.6, 0.3], 'ТВ тумба', 0x2d2d2d, 'tvstand')

  // КУХНЯ
  addRoomFurniture('kitchen', [2.8, 0.45, -3.5], [2.5, 0.9, 0.6], 'Кухонный гарнитур', 0x5c6b7a, 'kitchen')
  addRoomFurniture('kitchen', [0.8, 0.45, -3.5], [0.6, 0.9, 0.6], 'Плита (газ)', 0x3d3d3d, 'stove', { hasGas: true })
  addRoomFurniture('kitchen', [-0.5, 0.9, -3.5], [0.65, 1.8, 0.6], 'Холодильник', 0xe8e8e8, 'fridge')
  addRoomFurniture('kitchen', [1.5, 0.38, -2.2], [0.8, 0.76, 0.6], 'Обеденный стол', 0x8b7355, 'table')
  addRoomFurniture('kitchen', [1.0, 0.22, -2.2], [0.35, 0.44, 0.35], 'Стул 1', 0x5a6a7a, 'chair')
  addRoomFurniture('kitchen', [2.0, 0.22, -2.2], [0.35, 0.44, 0.35], 'Стул 2', 0x5a6a7a, 'chair')
  addRoomFurniture('kitchen', [1.5, 0.22, -1.7], [0.35, 0.44, 0.35], 'Стул 3', 0x5a6a7a, 'chair')

  // САНУЗЕЛ
  addRoomFurniture('bathroom', [6.2, 0.3, -3.8], [1.7, 0.6, 0.7], 'Ванна', 0xf5f5f5, 'bath')
  addRoomFurniture('bathroom', [4.8, 0.4, -3.8], [0.5, 0.8, 0.4], 'Раковина', 0xf5f5f5, 'sink')
  addRoomFurniture('bathroom', [4.8, 1.2, -3.8], [0.4, 0.6, 0.05], 'Зеркало', 0xaaccee, 'mirror')
  addRoomFurniture('bathroom', [6.2, 0.2, -1.8], [0.4, 0.4, 0.6], 'Унитаз', 0xf5f5f5, 'toilet')
  addRoomFurniture('bathroom', [5.0, 0.2, -1.8], [0.35, 0.4, 0.35], 'Биде', 0xf5f5f5, 'toilet')
  addRoomFurniture('bathroom', [4.5, 1, -2.5], [0.3, 2, 0.8], 'Полотенцесушитель', 0xcccccc, 'radiator')

  // КОРИДОР
  addRoomFurniture('hallway', [-2.0, 0.8, -3.8], [0.4, 1.6, 1.2], 'Шкаф', 0x4a3f35, 'wardrobe')
  addRoomFurniture('hallway', [-1.0, 0.15, -3.8], [0.7, 0.3, 0.35], 'Обувница', 0x6b5b4f, 'shelf')
  addRoomFurniture('hallway', [-0.2, 1.0, -3.8], [0.4, 0.5, 0.05], 'Зеркало', 0xaaccee, 'mirror')

  // === РАЗМЕРЫ ===
  createDimensionLabels309()

  scene.add(apartmentGroup)
}

// Размерные линии для квартиры 309
function createDimensionLabels309() {
  // Размеры комнаты 1
  createDimensionLine([-5.9, 0.05, 0], [-5.9, 0.05, 4.4], '4.4м')
  createDimensionLine([-5.9, 0.05, 4.4], [-2.8, 0.05, 4.4], '3.19м')
  
  // Размеры большой комнаты  
  createDimensionLine([-0.7, 0.05, -1.3], [3.3, 0.05, -1.3], '4.49м')
  createDimensionLine([3.3, 0.05, -1.3], [3.3, 0.05, 2.5], '3.83м')
  
  // Размеры кухни
  createDimensionLine([-0.7, 0.05, -3.8], [3.3, 0.05, -3.8], '4.48м')
  createDimensionLine([3.3, 0.05, -3.8], [3.3, 0.05, -1.5], '2.10м')
  
  // Размеры санузла
  createDimensionLine([4.1, 0.05, -4.4], [6.8, 0.05, -4.4], '2.70м')
  createDimensionLine([6.8, 0.05, -4.4], [6.8, 0.05, -0.5], '3.94м')
  
  // Общие габариты
  createDimensionLine([-5.9, 0.05, 4.7], [6.8, 0.05, 4.7], '≈12.7м')
}

// Границы квартиры
let apartmentBounds = null

// Создание комнаты с рамкой и подсветкой
function createRoomWithBorder(roomData) {
  const group = new THREE.Group()
  group.userData = { 
    type: 'room', 
    roomId: roomData.id,
    name: roomData.name,
    bounds: {
      minX: roomData.x - roomData.width / 2,
      maxX: roomData.x + roomData.width / 2,
      minZ: roomData.z - roomData.depth / 2,
      maxZ: roomData.z + roomData.depth / 2
    }
  }
  
  // Пол комнаты
  const floorGeometry = new THREE.PlaneGeometry(roomData.width - 0.1, roomData.depth - 0.1)
  const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: roomData.color,
    side: THREE.DoubleSide,
    roughness: 0.8
  })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.position.set(roomData.x, 0.01, roomData.z)
  floor.userData = { 
    type: 'floor', 
    roomId: roomData.id,
    name: roomData.name,
    originalColor: roomData.color,
    selectable: true
  }
  group.add(floor)
  
  // Рамка комнаты (граница)
  const borderGeometry = new THREE.EdgesGeometry(
    new THREE.PlaneGeometry(roomData.width, roomData.depth)
  )
  const borderMaterial = new THREE.LineBasicMaterial({ color: 0x4a5568, linewidth: 2 })
  const border = new THREE.LineSegments(borderGeometry, borderMaterial)
  border.rotation.x = -Math.PI / 2
  border.position.set(roomData.x, 0.02, roomData.z)
  border.userData = { type: 'border', roomId: roomData.id }
  group.add(border)
  
  // Подпись комнаты
  createRoomLabel(group, roomData)
  
  // Вычисление площади
  const area = (roomData.width * roomData.depth).toFixed(1)
  group.userData.area = parseFloat(area)
  
  return group
}

// Подпись комнаты (canvas текстура)
function createRoomLabel(group, roomData) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
  ctx.roundRect(0, 0, 256, 64, 8)
  ctx.fill()
  
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 20px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(roomData.name, 128, 28)
  
  const area = (roomData.width * roomData.depth).toFixed(1)
  ctx.fillStyle = '#9ca3af'
  ctx.font = '16px Arial'
  ctx.fillText(`${area} м²`, 128, 50)
  
  const texture = new THREE.CanvasTexture(canvas)
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true })
  const sprite = new THREE.Sprite(spriteMaterial)
  sprite.position.set(roomData.x, 0.5, roomData.z)
  sprite.scale.set(2, 0.5, 1)
  sprite.userData = { type: 'label', roomId: roomData.id }
  group.add(sprite)
}

// Стена с размером
function addWallWithDimension(pos, size, name, loadBearing, perimeter, dimension, direction) {
  addWall(pos, size, name, loadBearing, perimeter)
  
  if (dimension) {
    createDimensionText(pos, dimension, direction)
  }
}

// Текст размера
function createDimensionText(pos, text, direction) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  
  ctx.fillStyle = 'rgba(37, 99, 235, 0.8)'
  ctx.roundRect(0, 0, 128, 32, 4)
  ctx.fill()
  
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 16px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(text, 64, 22)
  
  const texture = new THREE.CanvasTexture(canvas)
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true })
  const sprite = new THREE.Sprite(spriteMaterial)
  
  if (direction === 'vertical') {
    sprite.position.set(pos[0] + (pos[0] < 0 ? -0.5 : 0.5), 3.2, pos[2])
  } else {
    sprite.position.set(pos[0], 3.2, pos[2] + (pos[2] < 0 ? -0.5 : 0.5))
  }
  sprite.scale.set(1.2, 0.3, 1)
  sprite.userData = { type: 'dimension' }
  apartmentGroup.add(sprite)
}

// Перегородка с подписью
function addPartitionWithLabel(pos, size, name) {
  addPartition(pos, size, name)
}

// Дверь с рамой
function addDoorWithFrame(pos, width, height, name, color) {
  addDoor(pos, width, height, name, color)
}

// Окно с рамой
function addWindowWithFrame(pos, width, height, name) {
  addWindow(pos, width, height, name)
}

// Мебель привязанная к комнате
function addRoomFurniture(roomId, pos, size, name, color, furnitureType, extraData = {}) {
  const obj = createFurniture(pos, size, name, color)
  obj.userData.furnitureType = furnitureType
  obj.userData.roomId = roomId
  obj.userData = { ...obj.userData, ...extraData }
  apartmentGroup.add(obj)
  allObjects.push(obj)
}

// Создание всех размерных линий
function createDimensionLabels() {
  // Общие размеры квартиры
  createDimensionLine([-6.5, 0.05, 5.8], [7.5, 0.05, 5.8], '14 м')
  createDimensionLine([-6.8, 0.05, -5], [-6.8, 0.05, 5.3], '10.3 м')
}

// Размерная линия
function createDimensionLine(start, end, label) {
  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineDashedMaterial({ 
    color: 0x2563eb, 
    dashSize: 0.2, 
    gapSize: 0.1 
  })
  const line = new THREE.Line(geometry, material)
  line.computeLineDistances()
  line.userData = { type: 'dimension' }
  apartmentGroup.add(line)
  
  // Засечки на концах
  const tickSize = 0.15
  const tickGeom1 = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(start[0], start[1], start[2] - tickSize),
    new THREE.Vector3(start[0], start[1], start[2] + tickSize)
  ])
  const tickGeom2 = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(end[0], end[1], end[2] - tickSize),
    new THREE.Vector3(end[0], end[1], end[2] + tickSize)
  ])
  const tickMaterial = new THREE.LineBasicMaterial({ color: 0x2563eb })
  apartmentGroup.add(new THREE.Line(tickGeom1, tickMaterial))
  apartmentGroup.add(new THREE.Line(tickGeom2, tickMaterial))
  
  // Текст размера
  const midX = (start[0] + end[0]) / 2
  const midZ = (start[2] + end[2]) / 2
  
  const canvas = document.createElement('canvas')
  canvas.width = 96
  canvas.height = 28
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#2563eb'
  ctx.font = 'bold 18px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(label, 48, 20)
  
  const texture = new THREE.CanvasTexture(canvas)
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true })
  const sprite = new THREE.Sprite(spriteMaterial)
  sprite.position.set(midX, 0.3, midZ)
  sprite.scale.set(1, 0.3, 1)
  apartmentGroup.add(sprite)
}

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ СОЗДАНИЯ ===
function createFloor(position, size, color, roomName) {
  const geometry = new THREE.PlaneGeometry(size[0], size[1])
  const material = new THREE.MeshStandardMaterial({ 
    color: color,
    side: THREE.DoubleSide
  })
  const floor = new THREE.Mesh(geometry, material)
  floor.rotation.x = -Math.PI / 2
  floor.position.set(position[0], position[1], position[2])
  floor.userData = { type: 'floor', name: roomName, selectable: false }
  return floor
}

function addWall(pos, size, name, loadBearing, perimeter) {
  const material = new THREE.MeshStandardMaterial({ 
    color: loadBearing ? 0x6b7280 : 0x9ca3af
  })
  const wall = createWall(pos, size, {
    name: name,
    isLoadBearing: loadBearing,
    isPerimeter: perimeter,
    length: Math.max(size[0], size[2]),
    height: size[1],
    thickness: Math.min(size[0], size[2])
  }, material)
  apartmentGroup.add(wall)
  allObjects.push(wall)
}

function addPartition(pos, size, name) {
  const partition = createPartition(pos, size)
  partition.userData.name = name
  apartmentGroup.add(partition)
  allObjects.push(partition)
}

function addDoor(pos, width, height, name, color) {
  const door = createDoor(pos, width, height, name, color)
  apartmentGroup.add(door)
  allObjects.push(door)
}

function addWindow(pos, width, height, name) {
  const windowObj = createWindow(pos, width, height, name)
  apartmentGroup.add(windowObj)
  allObjects.push(windowObj)
}

function addFurniture(pos, size, name, color, furnitureType) {
  const obj = createFurniture(pos, size, name, color)
  obj.userData.furnitureType = furnitureType || name
  apartmentGroup.add(obj)
  allObjects.push(obj)
}

function createWall(position, size, userData, material) {
  const geometry = new THREE.BoxGeometry(...size)
  const wall = new THREE.Mesh(geometry, material)
  wall.position.set(...position)
  wall.userData = {
    type: 'wall',
    ...userData,
    originalColor: material.color.getHex(),
    selectable: true,
    originalSize: [...size]
  }
  return wall
}

function createPartition(position, size) {
  const geometry = new THREE.BoxGeometry(...size)
  const material = new THREE.MeshStandardMaterial({ color: 0xa0aec0 })
  const partition = new THREE.Mesh(geometry, material)
  partition.position.set(...position)
  partition.userData = {
    type: 'partition',
    name: 'Перегородка',
    length: size[0],
    height: size[1],
    thickness: size[2],
    originalColor: 0xa0aec0,
    selectable: true,
    originalSize: [...size]
  }
  return partition
}

function createDoor(position, width = 0.9, height = 2, name = 'Дверь', color = 0x8b7355) {
  const geometry = new THREE.BoxGeometry(width, height, 0.08)
  const material = new THREE.MeshStandardMaterial({ color: color })
  const door = new THREE.Mesh(geometry, material)
  door.position.set(...position)
  door.userData = {
    type: 'door',
    name: name,
    width: width,
    height: height,
    openSide: 'Правое',
    originalColor: color,
    selectable: true,
    originalSize: [width, height, 0.08]
  }
  return door
}

function createWindow(position, width = 1.5, height = 1.4, name = 'Окно') {
  // Рама окна
  const frameGroup = new THREE.Group()
  
  // Стекло
  const glassGeometry = new THREE.BoxGeometry(width, height, 0.05)
  const glassMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x87ceeb,
    transparent: true,
    opacity: 0.5
  })
  const glass = new THREE.Mesh(glassGeometry, glassMaterial)
  glass.position.set(...position)
  glass.userData = {
    type: 'window',
    name: name,
    width: width,
    height: height,
    originalColor: 0x87ceeb,
    selectable: true,
    originalSize: [width, height, 0.05]
  }
  return glass
}

function createFurniture(position, size, name, color) {
  const geometry = new THREE.BoxGeometry(...size)
  const material = new THREE.MeshStandardMaterial({ color })
  const furniture = new THREE.Mesh(geometry, material)
  furniture.position.set(...position)
  furniture.userData = {
    type: 'furniture',
    name,
    furnitureType: name,
    length: size[0],
    width: size[2],
    height: size[1],
    originalColor: color,
    selectable: true,
    originalSize: [...size]
  }
  return furniture
}

function setupControls() {
  import('three/examples/jsm/controls/OrbitControls.js').then((module) => {
    const OrbitControls = module.OrbitControls
    
    // Controls для перспективной камеры
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enablePan = true
    controls.enableZoom = true
    controls.enableRotate = true
    controls.target.set(0, 0, 0)
    controls.update()
  })
}

function setupEventHandlers() {
  // Клик для выбора объектов
  clickHandler = (event) => {
    // Предотвращаем клик если это было перетаскивание
    if (isDragging) {
      isDragging = false
      return
    }
    
    if (!container.value || !raycaster) return
    
    const rect = container.value.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    const activeCamera = cameraMode.value === 'orthographic' ? orthographicCamera : camera
    if (!activeCamera) return
    
    raycaster.setFromCamera(mouse, activeCamera)
    
    // Если выбран инструмент, сначала пытаемся добавить объект
    if (tool.value) {
      event.preventDefault()
      event.stopPropagation()
      
      console.log('Попытка добавить объект, инструмент:', tool.value)
      
      // Ищем пересечение с полом
      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      const intersectPoint = new THREE.Vector3()
      const hasIntersection = raycaster.ray.intersectPlane(floorPlane, intersectPoint)
      
      let finalPoint = null
      
      if (hasIntersection) {
        finalPoint = intersectPoint.clone()
        console.log('Пересечение с полом найдено:', finalPoint)
      } else {
        // Альтернативный метод - используем направление луча
        const distance = 10
        finalPoint = new THREE.Vector3()
        raycaster.ray.at(distance, finalPoint)
        finalPoint.y = 0 // Принудительно на уровень пола
        console.log('Используется альтернативный метод, точка:', finalPoint)
      }
      
      if (finalPoint) {
        addObjectAtPoint(tool.value, finalPoint)
      }
      return
    }
    
    // Ищем пересечение с объектами для выбора
    const intersects = raycaster.intersectObjects(allObjects, false)

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object
      if (clickedObject.userData && clickedObject.userData.selectable) {
        selectObject(clickedObject)
      } else {
        clearSelection()
      }
    } else {
      // Проверяем клик на пол комнаты
      if (apartmentGroup) {
        const roomFloors = []
        apartmentGroup.traverse((child) => {
          if (child.userData?.type === 'floor' && child.userData?.selectable) {
            roomFloors.push(child)
          }
        })
        
        const floorIntersects = raycaster.intersectObjects(roomFloors, false)
        if (floorIntersects.length > 0) {
          const floorObj = floorIntersects[0].object
          const roomId = floorObj.userData.roomId
          if (roomId) {
            clearRoomHighlight()
            highlightRoom(roomId)
            selectedRoom.value = rooms.value.find(r => r.id === roomId + '1')
          }
        } else {
          clearSelection()
        }
      } else {
        clearSelection()
      }
    }
  }

  // Перетаскивание объектов
  dragHandler = (event) => {
    if (!selectedMesh || !container.value || !isDragging) return
    
    const rect = container.value.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    const activeCamera = cameraMode.value === 'orthographic' ? orthographicCamera : camera
    raycaster.setFromCamera(mouse, activeCamera)
    
    // Пересечение с плоскостью пола на уровне объекта
    const objectY = selectedMesh.position.y
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -objectY)
    const intersectPoint = new THREE.Vector3()
    const hasIntersection = raycaster.ray.intersectPlane(plane, intersectPoint)
    
    if (hasIntersection) {
      // Ограничиваем позицию в пределах квартиры
      const newPos = clampPositionToBounds({
        x: Math.round(intersectPoint.x * 10) / 10,
        y: objectY,
        z: Math.round(intersectPoint.z * 10) / 10
      })
      
      selectedMesh.position.x = newPos.x
      selectedMesh.position.z = newPos.z
      
      // Обновляем UI
      editingPosition.value.x = parseFloat(newPos.x.toFixed(2))
      editingPosition.value.z = parseFloat(newPos.z.toFixed(2))
    }
  }

  container.value.addEventListener('click', clickHandler)
  container.value.addEventListener('mousedown', onMouseDown)
  container.value.addEventListener('mousemove', onMouseMove)
  container.value.addEventListener('mouseup', onMouseUp)
  
  // Управление с клавиатуры
  setupKeyboardControls()
}

function setupKeyboardControls() {
  // Добавляем обработчики на document для глобального доступа
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)
  
  // Отслеживание полноэкранного режима
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  document.addEventListener('MSFullscreenChange', handleFullscreenChange)
  
  console.log('Горячие клавиши инициализированы')
}

function handleFullscreenChange() {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  )
  
  if (handleResize) {
    setTimeout(() => handleResize(), 100)
  }
}

let keysPressed = {}
function handleKeyDown(event) {
  // Проверяем, что фокус не на input/textarea
  const target = event.target
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
    return
  }
  
  const key = event.key.toLowerCase()
  keysPressed[key] = true
  
  console.log('Нажата клавиша:', key)
  
  // F - полноэкранный режим
  if (key === 'f') {
    event.preventDefault()
    console.log('Переключение полноэкранного режима')
    toggleFullscreen()
    return
  }
  
  // G - переключение сетки
  if (key === 'g') {
    event.preventDefault()
    console.log('Переключение сетки')
    toggleGrid()
    return
  }
  
  // L - блокировка камеры
  if (key === 'l') {
    event.preventDefault()
    console.log('Переключение блокировки камеры')
    toggleCameraLock()
    return
  }
  
  // Delete/Backspace - удаление выбранного объекта
  if ((key === 'delete' || key === 'backspace') && selectedMesh) {
    event.preventDefault()
    console.log('Удаление объекта')
    deleteSelectedObject()
    return
  }
  
  // Escape - отмена выбора
  if (key === 'escape') {
    event.preventDefault()
    console.log('Отмена выбора')
    clearSelection()
    return
  }
  
  // 1-9 - быстрое добавление объектов
  if (key === '1') {
    event.preventDefault()
    addNewWall()
    return
  }
  if (key === '2') {
    event.preventDefault()
    addNewPartition()
    return
  }
  if (key === '3') {
    event.preventDefault()
    addNewTable()
    return
  }
  if (key === '4') {
    event.preventDefault()
    addNewChair()
    return
  }
  if (key === '5') {
    event.preventDefault()
    addNewDoor()
    return
  }
  if (key === '6') {
    event.preventDefault()
    addNewWindow()
    return
  }
  if (key === '7') {
    event.preventDefault()
    addNewSofa()
    return
  }
  if (key === '8') {
    event.preventDefault()
    addNewBed()
    return
  }
  if (key === '9') {
    event.preventDefault()
    addNewWardrobe()
    return
  }
  
  // Стрелки для перемещения объекта
  if (selectedMesh) {
    const moveStep = event.shiftKey ? 0.1 : 0.5
    if (key === 'arrowleft') {
      event.preventDefault()
      moveObject('x', -moveStep)
      return
    } else if (key === 'arrowright') {
      event.preventDefault()
      moveObject('x', moveStep)
      return
    } else if (key === 'arrowup') {
      event.preventDefault()
      if (event.ctrlKey || event.metaKey) {
        moveObject('y', moveStep)
      } else {
        moveObject('z', -moveStep)
      }
      return
    } else if (key === 'arrowdown') {
      event.preventDefault()
      if (event.ctrlKey || event.metaKey) {
        moveObject('y', -moveStep)
      } else {
        moveObject('z', moveStep)
      }
      return
    }
  }
}

function handleKeyUp(event) {
  keysPressed[event.key.toLowerCase()] = false
}

let isMouseDown = false
let dragStartTime = 0

function onMouseDown(event) {
  // Если камера заблокирована или есть выбранный объект, проверяем возможность перетаскивания
  if (selectedMesh || cameraLocked.value) {
    const rect = container.value.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    const activeCamera = cameraMode.value === 'orthographic' ? orthographicCamera : camera
    raycaster.setFromCamera(mouse, activeCamera)
    
    if (selectedMesh) {
      const intersects = raycaster.intersectObject(selectedMesh, false)
      if (intersects.length > 0) {
        isMouseDown = true
        dragStartTime = Date.now()
        isDragging = false
        // В заблокированном режиме сразу разрешаем перетаскивание
        if (cameraLocked.value) {
          isDragging = true
          if (controls) controls.enabled = false
        }
      }
    } else {
      // В заблокированном режиме при клике на пустое место проверяем объекты
      const intersects = raycaster.intersectObjects(allObjects, false)
      if (intersects.length > 0 && intersects[0].object.userData && intersects[0].object.userData.selectable) {
        selectObject(intersects[0].object)
      }
    }
  }
}

function onMouseMove(event) {
  if (isMouseDown && selectedMesh) {
    // Проверяем защищённость объекта перед перетаскиванием
    const protection = isProtectedObject(selectedMesh)
    if (protection.blocked) {
      if (!isDragging && Date.now() - dragStartTime > 150) {
        showBlockNotification(protection)
      }
      return
    }
    
    if (!isDragging && Date.now() - dragStartTime > 150) {
      isDragging = true
      // Отключаем управление камерой только если она не заблокирована и мы тащим объект
      if (controls && !cameraLocked.value) {
        controls.enabled = false
      }
    }
    if (isDragging) {
      dragHandler(event)
    }
  }
}

function onMouseUp(event) {
  if (isDragging) {
    // Восстанавливаем управление камерой только если она не заблокирована
    if (controls && !cameraLocked.value) {
      controls.enabled = true
    }
    // Обновляем данные объекта после перетаскивания
    if (selectedObject.value && selectedMesh) {
      selectedObject.value = { ...selectedMesh.userData }
    }
  }
  isMouseDown = false
  isDragging = false
  dragStartTime = 0
}

function selectObject(object) {
  // Сбрасываем предыдущее выделение
  if (selectedMesh && selectedMesh.userData && selectedMesh.userData.originalColor !== undefined) {
    selectedMesh.material.color.setHex(selectedMesh.userData.originalColor)
  }
  
  // Сбрасываем подсветку комнаты
  clearRoomHighlight()
  
  selectedMesh = object
  object.material.color.setHex(0x2563eb)
  selectedObject.value = { ...object.userData }
  tool.value = null
  
  // Подсвечиваем комнату если объект привязан к ней
  if (object.userData.roomId) {
    highlightRoom(object.userData.roomId)
    selectedRoom.value = rooms.value.find(r => r.id === object.userData.roomId + '1')
  }
  
  // Обновляем поля редактирования
  editingDimensions.value = {
    length: object.userData.length || 0,
    width: object.userData.width || 0,
    height: object.userData.height || 0,
    thickness: object.userData.thickness || 0
  }
  editingPosition.value = {
    x: parseFloat(object.position.x.toFixed(2)),
    y: parseFloat(object.position.y.toFixed(2)),
    z: parseFloat(object.position.z.toFixed(2))
  }
  editingRotation.value = {
    y: parseFloat((object.rotation.y * (180 / Math.PI)).toFixed(1))
  }
}

// Подсветка комнаты
function highlightRoom(roomId) {
  if (!apartmentGroup) return
  
  apartmentGroup.traverse((child) => {
    if (child.userData?.roomId === roomId && child.userData?.type === 'floor') {
      child.material.emissive = new THREE.Color(0x2563eb)
      child.material.emissiveIntensity = 0.15
    }
  })
}

// Сброс подсветки комнаты
function clearRoomHighlight() {
  if (!apartmentGroup) return
  
  apartmentGroup.traverse((child) => {
    if (child.userData?.type === 'floor' && child.material?.emissive) {
      child.material.emissiveIntensity = 0
    }
  })
}

function clearSelection() {
  if (selectedMesh && selectedMesh.userData && selectedMesh.userData.originalColor !== undefined) {
    selectedMesh.material.color.setHex(selectedMesh.userData.originalColor)
  }
  clearRoomHighlight()
  selectedMesh = null
  selectedObject.value = null
  selectedRoom.value = null
  tool.value = null
}

// Ограничение позиции объекта в пределах квартиры
function clampPositionToBounds(position) {
  if (!apartmentBounds) return position
  
  return {
    x: Math.max(apartmentBounds.minX + 0.5, Math.min(apartmentBounds.maxX - 0.5, position.x)),
    y: position.y,
    z: Math.max(apartmentBounds.minZ + 0.5, Math.min(apartmentBounds.maxZ - 0.5, position.z))
  }
}

// === ФУНКЦИИ ДОБАВЛЕНИЯ ОБЪЕКТОВ ===
function getRandomPosition() {
  return {
    x: (Math.random() - 0.5) * 8,
    y: 0,
    z: (Math.random() - 0.5) * 6
  }
}

// Конструкции
function addNewWall() {
  const pos = getRandomPosition()
  addObjectAtPoint('addWall', pos)
}

function addNewPartition() {
  const pos = getRandomPosition()
  addObjectAtPoint('addPartition', pos)
}

function addNewDoor() {
  const pos = getRandomPosition()
  addObjectAtPoint('addDoor', pos)
}

function addNewWindow() {
  const pos = getRandomPosition()
  addObjectAtPoint('addWindow', pos)
}

// Гостиная
function addNewTable() {
  const pos = getRandomPosition()
  addObjectAtPoint('addTable', pos)
}

function addNewChair() {
  const pos = getRandomPosition()
  addObjectAtPoint('addChair', pos)
}

function addNewSofa() {
  const pos = getRandomPosition()
  addObjectAtPoint('addSofa', pos)
}

function addNewTV() {
  const pos = getRandomPosition()
  addObjectAtPoint('addTV', pos)
}

// Спальня
function addNewBed() {
  const pos = getRandomPosition()
  addObjectAtPoint('addBed', pos)
}

function addNewWardrobe() {
  const pos = getRandomPosition()
  addObjectAtPoint('addWardrobe', pos)
}

function addNewNightstand() {
  const pos = getRandomPosition()
  addObjectAtPoint('addNightstand', pos)
}

function addNewDesk() {
  const pos = getRandomPosition()
  addObjectAtPoint('addDesk', pos)
}

// Кухня / Санузел
function addNewFridge() {
  const pos = getRandomPosition()
  addObjectAtPoint('addFridge', pos)
}

function addNewStove() {
  const pos = getRandomPosition()
  addObjectAtPoint('addStove', pos)
}

function addNewBath() {
  const pos = getRandomPosition()
  addObjectAtPoint('addBath', pos)
}

function addNewToilet() {
  const pos = getRandomPosition()
  addObjectAtPoint('addToilet', pos)
}

function deleteSelectedObject() {
  if (!selectedMesh) return
  
  // Проверяем защищённость объекта
  const protection = isProtectedObject(selectedMesh)
  if (protection.blocked) {
    showBlockNotification(protection)
    return
  }
  
  // Удаляем из массива
  const index = allObjects.indexOf(selectedMesh)
  if (index > -1) {
    allObjects.splice(index, 1)
  }
  
  // Удаляем из сцены
  apartmentGroup.remove(selectedMesh)
  
  // Очищаем геометрию и материал
  if (selectedMesh.geometry) selectedMesh.geometry.dispose()
  if (selectedMesh.material) {
    if (Array.isArray(selectedMesh.material)) {
      selectedMesh.material.forEach(mat => mat.dispose())
    } else {
      selectedMesh.material.dispose()
    }
  }
  
  clearSelection()
}

function updateObjectDimensions() {
  if (!selectedMesh) return
  
  // Проверяем защищённость объекта
  const protection = isProtectedObject(selectedMesh)
  if (protection.blocked) {
    showBlockNotification(protection)
    // Возвращаем предыдущие значения
    editingDimensions.value = {
      length: selectedMesh.userData.length || 0,
      width: selectedMesh.userData.width || 0,
      height: selectedMesh.userData.height || 0,
      thickness: selectedMesh.userData.thickness || 0
    }
    return
  }
  
  const userData = selectedMesh.userData
  
  if (userData.type === 'wall' || userData.type === 'partition') {
    const newLength = editingDimensions.value.length || userData.length || 1
    const newHeight = editingDimensions.value.height || userData.height || 3
    const newThickness = editingDimensions.value.thickness || userData.thickness || 0.2
    
    // Создаем новую геометрию
    selectedMesh.geometry.dispose()
    selectedMesh.geometry = new THREE.BoxGeometry(newLength, newHeight, newThickness)
    
    // Обновляем userData
    userData.length = newLength
    userData.height = newHeight
    userData.thickness = newThickness
  } else if (userData.type === 'furniture') {
    const newLength = editingDimensions.value.length || userData.length || 1
    const newWidth = editingDimensions.value.width || userData.width || 1
    const newHeight = editingDimensions.value.height || userData.height || 1
    
    selectedMesh.geometry.dispose()
    selectedMesh.geometry = new THREE.BoxGeometry(newLength, newHeight, newWidth)
    
    userData.length = newLength
    userData.width = newWidth
    userData.height = newHeight
  } else if (userData.type === 'door') {
    const newWidth = editingDimensions.value.width || userData.width || 1.5
    const newHeight = editingDimensions.value.height || userData.height || 2
    
    selectedMesh.geometry.dispose()
    selectedMesh.geometry = new THREE.BoxGeometry(newWidth, newHeight, 0.1)
    
    userData.width = newWidth
    userData.height = newHeight
  }
  
  selectedObject.value = { ...userData }
}

function updateObjectPosition() {
  if (!selectedMesh) return
  
  // Проверяем защищённость объекта
  const protection = isProtectedObject(selectedMesh)
  if (protection.blocked) {
    showBlockNotification(protection)
    // Возвращаем предыдущие значения
    editingPosition.value.x = parseFloat(selectedMesh.position.x.toFixed(2))
    editingPosition.value.y = parseFloat(selectedMesh.position.y.toFixed(2))
    editingPosition.value.z = parseFloat(selectedMesh.position.z.toFixed(2))
    return
  }
  
  selectedMesh.position.set(
    editingPosition.value.x,
    editingPosition.value.y,
    editingPosition.value.z
  )
}

function updateObjectRotation() {
  if (!selectedMesh) return
  
  selectedMesh.rotation.y = (editingRotation.value.y * Math.PI) / 180
}

function moveObject(axis, delta) {
  if (!selectedMesh) return
  
  // Проверяем защищённость объекта
  const protection = isProtectedObject(selectedMesh)
  if (protection.blocked) {
    showBlockNotification(protection)
    return
  }
  
  // Вычисляем новую позицию
  let newPos = {
    x: selectedMesh.position.x,
    y: selectedMesh.position.y,
    z: selectedMesh.position.z
  }
  
  if (axis === 'x') newPos.x += delta
  else if (axis === 'y') newPos.y += delta
  else if (axis === 'z') newPos.z += delta
  
  // Ограничиваем позицию в пределах квартиры
  const clampedPos = clampPositionToBounds(newPos)
  
  selectedMesh.position.x = clampedPos.x
  selectedMesh.position.y = clampedPos.y
  selectedMesh.position.z = clampedPos.z
  
  editingPosition.value.x = parseFloat(clampedPos.x.toFixed(2))
  editingPosition.value.y = parseFloat(clampedPos.y.toFixed(2))
  editingPosition.value.z = parseFloat(clampedPos.z.toFixed(2))
  
  // Обновляем информацию об объекте
  if (selectedObject.value) {
    selectedObject.value = { ...selectedMesh.userData }
  }
}

function addObjectAtPoint(type, point) {
  if (!apartmentGroup || !scene) {
    console.error('Scene or apartmentGroup not initialized')
    return
  }
  
  let newObject = null
  const count = (t) => allObjects.filter(o => o.userData?.furnitureType === t).length + 1
  
  try {
    // Конструкции
    if (type === 'addWall') {
      const wallCount = allObjects.filter(o => o.userData?.type === 'wall').length
      newObject = createWall(
        [point.x, 1.5, point.z],
        [3, 3, 0.2],
        {
          name: `Стена ${wallCount + 1}`,
          isLoadBearing: false,
          isPerimeter: false,
          length: 3,
          height: 3,
          thickness: 0.2
        },
        new THREE.MeshStandardMaterial({ color: 0x9ca3af })
      )
    } else if (type === 'addPartition') {
      newObject = createPartition([point.x, 1.5, point.z], [3, 3, 0.15])
      newObject.userData.name = `Перегородка ${count('partition')}`
    } else if (type === 'addDoor') {
      newObject = createDoor([point.x, 1, point.z], 0.9, 2, `Дверь ${count('door')}`, 0x8b7355)
    } else if (type === 'addWindow') {
      newObject = createWindow([point.x, 1.5, point.z], 1.5, 1.2, `Окно ${count('window')}`)
    }
    // Гостиная
    else if (type === 'addTable') {
      newObject = createFurniture([point.x, 0.38, point.z], [1.2, 0.76, 0.8], `Стол ${count('table')}`, 0x8b7355)
      newObject.userData.furnitureType = 'table'
    } else if (type === 'addChair') {
      newObject = createFurniture([point.x, 0.22, point.z], [0.4, 0.45, 0.4], `Стул ${count('chair')}`, 0x4a5568)
      newObject.userData.furnitureType = 'chair'
    } else if (type === 'addSofa') {
      newObject = createFurniture([point.x, 0.25, point.z], [2.2, 0.5, 0.9], `Диван ${count('sofa')}`, 0x4a6fa5)
      newObject.userData.furnitureType = 'sofa'
    } else if (type === 'addTV') {
      newObject = createFurniture([point.x, 0.3, point.z], [1.5, 0.6, 0.3], `ТВ тумба ${count('tvstand')}`, 0x2d2d2d)
      newObject.userData.furnitureType = 'tvstand'
    }
    // Спальня
    else if (type === 'addBed') {
      newObject = createFurniture([point.x, 0.25, point.z], [2, 0.5, 1.6], `Кровать ${count('bed')}`, 0x6b5b4f)
      newObject.userData.furnitureType = 'bed'
    } else if (type === 'addWardrobe') {
      newObject = createFurniture([point.x, 1, point.z], [2, 2, 0.6], `Шкаф ${count('wardrobe')}`, 0x4a3f35)
      newObject.userData.furnitureType = 'wardrobe'
    } else if (type === 'addNightstand') {
      newObject = createFurniture([point.x, 0.25, point.z], [0.5, 0.5, 0.4], `Тумбочка ${count('nightstand')}`, 0x5c4033)
      newObject.userData.furnitureType = 'nightstand'
    } else if (type === 'addDesk') {
      newObject = createFurniture([point.x, 0.38, point.z], [1.4, 0.76, 0.7], `Рабочий стол ${count('desk')}`, 0x5c4033)
      newObject.userData.furnitureType = 'desk'
    }
    // Кухня/Санузел
    else if (type === 'addFridge') {
      newObject = createFurniture([point.x, 0.9, point.z], [0.7, 1.8, 0.7], `Холодильник ${count('fridge')}`, 0xe0e0e0)
      newObject.userData.furnitureType = 'fridge'
    } else if (type === 'addStove') {
      newObject = createFurniture([point.x, 0.45, point.z], [0.6, 0.9, 0.6], `Плита ${count('stove')}`, 0x2d2d2d)
      newObject.userData.furnitureType = 'stove'
    } else if (type === 'addBath') {
      newObject = createFurniture([point.x, 0.35, point.z], [1.7, 0.7, 0.8], `Ванна ${count('bath')}`, 0xf0f0f0)
      newObject.userData.furnitureType = 'bath'
    } else if (type === 'addToilet') {
      newObject = createFurniture([point.x, 0.25, point.z], [0.4, 0.5, 0.6], `Унитаз ${count('toilet')}`, 0xf0f0f0)
      newObject.userData.furnitureType = 'toilet'
    }
    
    if (newObject) {
      apartmentGroup.add(newObject)
      allObjects.push(newObject)
      selectObject(newObject)
      tool.value = null
      console.log(`${type} добавлен в позицию:`, point)
    }
  } catch (error) {
    console.error('Ошибка при добавлении объекта:', error)
  }
}

function setCameraView(mode) {
  cameraMode.value = mode
  
  if (mode === 'perspective') {
    camera.position.set(0, 15, 18)
    camera.lookAt(0, 0, 0)
    if (controls) {
      controls.object = camera
      controls.enabled = !cameraLocked.value
      controls.update()
    }
  } else if (mode === 'top') {
    camera.position.set(0, 25, 0.1)
    camera.lookAt(0, 0, 0)
    if (controls) {
      controls.object = camera
      controls.enabled = !cameraLocked.value
      controls.update()
    }
  } else if (mode === 'orthographic') {
    orthographicCamera.position.set(0, 25, 0.1)
    orthographicCamera.lookAt(0, 0, 0)
    if (controls) {
      controls.object = orthographicCamera
      controls.enabled = !cameraLocked.value
      controls.update()
    }
  }
}

function toggleGrid() {
  showGrid.value = !showGrid.value
  if (gridHelper) {
    gridHelper.visible = showGrid.value
  }
}

function toggleCameraLock() {
  cameraLocked.value = !cameraLocked.value
  if (controls) {
    controls.enabled = !cameraLocked.value
  }
}

function toggleFullscreen() {
  const element = container.value
  
  if (!document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.mozFullScreenElement &&
      !document.msFullscreenElement) {
    // Входим в полноэкранный режим
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen()
    }
  } else {
    // Выходим из полноэкранного режима
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }
}

function startAnimation() {
  function animate() {
    animationId = requestAnimationFrame(animate)
    if (controls) controls.update()
    const activeCamera = cameraMode.value === 'orthographic' ? orthographicCamera : camera
    if (renderer && scene && activeCamera) {
      renderer.render(scene, activeCamera)
    }
  }
  animate()
}

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  if (handleResize) {
    window.removeEventListener('resize', handleResize)
  }

  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keyup', handleKeyUp)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
  document.removeEventListener('MSFullscreenChange', handleFullscreenChange)

  if (container.value && clickHandler) {
    container.value.removeEventListener('click', clickHandler)
    container.value.removeEventListener('mousedown', onMouseDown)
    container.value.removeEventListener('mousemove', onMouseMove)
    container.value.removeEventListener('mouseup', onMouseUp)
  }

  if (controls) {
    controls.dispose()
  }

  if (renderer && container.value && renderer.domElement) {
    renderer.dispose()
    if (container.value.contains(renderer.domElement)) {
      container.value.removeChild(renderer.domElement)
    }
  }

  if (scene) {
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(mat => mat.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
  }
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Панель инструментов */
.panel-container {
  background: #18181B;
  border: 1px solid #26272A;
  border-radius: 16px 0 0 16px;
  width: 180px;
  max-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  box-shadow: -4px 0 20px rgba(0,0,0,0.3);
  overflow: hidden;
}

.panel-open {
  transform: translateX(0);
  opacity: 1;
}

.panel-closed {
  transform: translateX(100%);
  opacity: 0;
  pointer-events: none;
}

.panel-tab {
  position: absolute;
  right: 0;
  top: 0;
  width: 36px;
  height: 80px;
  background: #18181B;
  border: 1px solid #26272A;
  border-right: none;
  border-radius: 12px 0 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #d1d5db;
  font-size: 18px;
}

.panel-tab:hover {
  background: #2563EB;
  color: white;
  width: 42px;
}

.panel-close-btn {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 24px;
  height: 24px;
  background: #26272A;
  border: none;
  border-radius: 6px;
  color: #9ca3af;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.panel-close-btn:hover {
  background: #ef4444;
  color: white;
}

.panel-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 40px 8px 8px 8px;
}

.panel-scroll::-webkit-scrollbar {
  width: 4px;
}

.panel-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.panel-scroll::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 2px;
}

.panel-scroll::-webkit-scrollbar-thumb:hover {
  background: #52525b;
}

/* Секции панели */
.panel-section {
  margin-bottom: 8px;
  background: #1f1f23;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #26272A;
}

.section-header {
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  color: #d1d5db;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.section-header:hover {
  background: #26272A;
  color: white;
}

.section-arrow {
  font-size: 14px;
  transition: transform 0.3s ease;
  transform: rotate(-90deg);
}

.arrow-down {
  transform: rotate(-270deg);
}

.section-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 0 8px 8px 8px;
}

.section-collapsed {
  border-color: transparent;
}

/* Стили для кнопок инструментов */
.btn-tool {
  padding: 8px 6px;
  border-radius: 8px;
  font-size: 11px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background-color: #26272A;
  color: #d1d5db;
  cursor: pointer;
  border: none;
  text-align: center;
}

.btn-tool:hover {
  background-color: #2563EB;
  color: white;
  transform: scale(1.05);
}

.btn-tool:active {
  transform: scale(0.95);
}

.btn-tool-active {
  background-color: #2563EB !important;
  color: white !important;
}

.btn-tool span:first-child {
  font-size: 16px;
}

.btn-tool span:last-child {
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Скроллбар для панели инструментов */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #52525b;
}

/* Стиль для клавиш */
.kbd {
  padding: 0.125rem 0.375rem;
  background-color: #26272A;
  border-radius: 0.25rem;
  font-size: 10px;
  font-family: ui-monospace, monospace;
}

/* ============================================= */
/* УВЕДОМЛЕНИЕ О БЛОКИРОВКЕ ПО НОРМАМ РФ */
/* ============================================= */

.block-notification {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 420px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%);
  border: 2px solid #fca5a5;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(185, 28, 28, 0.4), 0 0 0 4px rgba(252, 165, 165, 0.1);
  animation: shakeNotification 0.5s ease;
}

@keyframes shakeNotification {
  0%, 100% { transform: translate(-50%, -50%) rotate(0); }
  10%, 30%, 50%, 70%, 90% { transform: translate(-50%, -50%) rotate(-1deg); }
  20%, 40%, 60%, 80% { transform: translate(-50%, -50%) rotate(1deg); }
}

.block-notification-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: rgba(254, 202, 202, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fecaca;
}

.block-notification-content {
  flex: 1;
}

.block-notification-title {
  font-size: 15px;
  font-weight: 700;
  color: white;
  margin-bottom: 6px;
}

.block-notification-description {
  font-size: 12px;
  color: #fecaca;
  line-height: 1.5;
  margin-bottom: 8px;
}

.block-notification-law {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #fca5a5;
  background: rgba(0,0,0,0.2);
  padding: 6px 10px;
  border-radius: 8px;
}

.law-icon {
  font-size: 14px;
}

.block-notification-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 6px;
  color: #fecaca;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.block-notification-close:hover {
  background: rgba(255,255,255,0.2);
  color: white;
}

/* Предупреждение в панели информации */
.protection-warning {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  margin-bottom: 8px;
}

.protection-warning-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.protection-warning-text {
  color: #fca5a5;
  font-size: 11px;
  line-height: 1.4;
}

/* Панель горячих клавиш */
.hotkeys-panel {
  background: rgba(24, 24, 27, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid #26272A;
  border-left: none;
  border-radius: 0 12px 12px 0;
  padding: 10px 12px;
  color: #9ca3af;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
  position: relative;
}

.hotkeys-open {
  transform: translateX(0);
  opacity: 1;
}

.hotkeys-closed {
  transform: translateX(-100%);
  opacity: 0;
  pointer-events: none;
}

.hotkeys-tab {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 36px;
  height: 60px;
  background: #18181B;
  border: 1px solid #26272A;
  border-left: none;
  border-radius: 0 10px 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
}

.hotkeys-tab:hover {
  background: #2563EB;
  width: 42px;
}

.hotkeys-close {
  position: absolute;
  top: 4px;
  right: 6px;
  width: 18px;
  height: 18px;
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.hotkeys-close:hover {
  background: #ef4444;
  color: white;
}

/* ============================================= */
/* AI ЧАТ */
/* ============================================= */

.chat-tab {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%);
  border: none;
  border-radius: 16px 16px 0 0;
  color: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 -4px 20px rgba(37, 99, 235, 0.3);
  font-size: 14px;
  font-weight: 500;
}

.chat-tab:hover {
  padding: 12px 24px;
  box-shadow: 0 -6px 30px rgba(37, 99, 235, 0.4);
}

.chat-tab-icon {
  font-size: 18px;
}

.chat-tab-text {
  font-size: 13px;
}

.chat-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: #ef4444;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.chat-container {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  background: #18181B;
  border: 1px solid #26272A;
  border-bottom: none;
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 -8px 40px rgba(0,0,0,0.4);
  overflow: hidden;
}

.chat-open {
  max-height: 450px;
  opacity: 1;
}

.chat-closed {
  max-height: 0;
  opacity: 0;
  pointer-events: none;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, #1f1f23 0%, #18181B 100%);
  border-bottom: 1px solid #26272A;
}

.chat-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #2563EB 0%, #7c3aed 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.chat-title {
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.chat-status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #9ca3af;
  font-size: 11px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-dot.online {
  background: #22c55e;
  box-shadow: 0 0 8px #22c55e;
}

.status-dot.typing {
  background: #f59e0b;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.chat-header-actions {
  display: flex;
  gap: 4px;
}

.chat-action-btn {
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #9ca3af;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.chat-action-btn:hover {
  background: #26272A;
  color: white;
}

.chat-close:hover {
  background: #ef4444;
}

.chat-quick-actions {
  display: flex;
  gap: 6px;
  padding: 10px 12px;
  background: #1f1f23;
  border-bottom: 1px solid #26272A;
  overflow-x: auto;
}

.chat-quick-actions::-webkit-scrollbar {
  height: 0;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #26272A;
  border: 1px solid #3f3f46;
  border-radius: 20px;
  color: #d1d5db;
  font-size: 11px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-action-btn:hover {
  background: #2563EB;
  border-color: #2563EB;
  color: white;
  transform: translateY(-1px);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  min-height: 200px;
  max-height: 250px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 2px;
}

/* Приветственное сообщение */
.chat-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  height: 100%;
}

.welcome-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.welcome-title {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.welcome-text {
  color: #9ca3af;
  font-size: 12px;
  line-height: 1.5;
  max-width: 280px;
  margin-bottom: 16px;
}

.welcome-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.suggestion-btn {
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #3f3f46;
  border-radius: 16px;
  color: #9ca3af;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-btn:hover {
  border-color: #2563EB;
  color: #2563EB;
  background: rgba(37, 99, 235, 0.1);
}

/* Сообщения */
.chat-message {
  display: flex;
  gap: 8px;
  animation: messageIn 0.3s ease;
}

@keyframes messageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-message.user {
  justify-content: flex-end;
}

.message-avatar {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #2563EB 0%, #7c3aed 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.message-avatar.user {
  background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
}

.message-content {
  max-width: 75%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 13px;
  line-height: 1.5;
}

.message-bubble.assistant {
  background: #26272A;
  color: #e5e7eb;
  border-bottom-left-radius: 4px;
}

.message-bubble.user {
  background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-text {
  word-break: break-word;
}

.message-text strong {
  color: #60a5fa;
  font-weight: 600;
}

.message-text code {
  background: #1f1f23;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: ui-monospace, monospace;
  font-size: 12px;
}

.message-time {
  font-size: 10px;
  color: #6b7280;
  padding: 0 4px;
}

.chat-message.user .message-time {
  text-align: right;
}

/* Скелетон загрузки */
.message-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 12px;
  background: linear-gradient(90deg, #3f3f46 25%, #52525b 50%, #3f3f46 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

.skeleton-line.long { width: 100%; }
.skeleton-line.medium { width: 75%; }
.skeleton-line.short { width: 50%; }

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Индикатор печатания */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #6b7280;
  border-radius: 50%;
  animation: typing 1.4s infinite both;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
  30% { transform: translateY(-6px); opacity: 1; }
}

/* Поле ввода */
.chat-input-container {
  padding: 12px;
  background: #1f1f23;
  border-top: 1px solid #26272A;
}

.chat-input-wrapper {
  display: flex;
  gap: 8px;
  background: #26272A;
  border: 1px solid #3f3f46;
  border-radius: 12px;
  padding: 4px 4px 4px 14px;
  transition: all 0.2s ease;
}

.chat-input-wrapper:focus-within {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.chat-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 13px;
}

.chat-input::placeholder {
  color: #6b7280;
}

.chat-input:disabled {
  opacity: 0.5;
}

.chat-send-btn {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%);
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.chat-send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.chat-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-input-hint {
  text-align: center;
  font-size: 10px;
  color: #6b7280;
  margin-top: 8px;
}

/* ============================================= */
/* ПАНЕЛЬ КОМНАТ */
/* ============================================= */

.rooms-tab {
  width: 40px;
  height: 80px;
  background: linear-gradient(135deg, #18181B 0%, #1f1f23 100%);
  border: 1px solid #26272A;
  border-left: none;
  border-radius: 0 12px 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 20px;
}

.rooms-tab:hover {
  background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%);
  width: 48px;
}

.rooms-panel {
  width: 260px;
  max-height: calc(100vh - 200px);
  background: #18181B;
  border: 1px solid #26272A;
  border-left: none;
  border-radius: 0 16px 16px 0;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 20px rgba(0,0,0,0.3);
  overflow: hidden;
}

.rooms-open {
  transform: translateX(0);
  opacity: 1;
}

.rooms-closed {
  transform: translateX(-100%);
  opacity: 0;
  pointer-events: none;
}

.rooms-close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: #26272A;
  border: none;
  border-radius: 6px;
  color: #9ca3af;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.rooms-close-btn:hover {
  background: #ef4444;
  color: white;
}

.rooms-header {
  padding: 16px;
  background: linear-gradient(135deg, #1f1f23 0%, #18181B 100%);
  border-bottom: 1px solid #26272A;
}

.rooms-title {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 12px;
}

.rooms-stats {
  display: flex;
  gap: 16px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #2563EB;
}

.stat-label {
  font-size: 10px;
  color: #9ca3af;
}

.rooms-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.rooms-list::-webkit-scrollbar {
  width: 4px;
}

.rooms-list::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 2px;
}

.room-card {
  background: #1f1f23;
  border: 1px solid #26272A;
  border-radius: 10px;
  margin-bottom: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.room-card:hover {
  border-color: #3f3f46;
}

.room-card.room-selected {
  border-color: #2563EB;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, transparent 100%);
}

.room-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
}

.room-icon {
  font-size: 16px;
}

.room-name {
  flex: 1;
  font-size: 12px;
  color: #e5e7eb;
  font-weight: 500;
}

.room-area {
  font-size: 11px;
  color: #9ca3af;
  background: #26272A;
  padding: 2px 8px;
  border-radius: 10px;
}

.room-options {
  padding: 10px 12px;
  border-top: 1px solid #26272A;
  background: rgba(0,0,0,0.2);
}

.room-type-select {
  margin-bottom: 10px;
}

.room-select {
  width: 100%;
  padding: 6px 10px;
  background: #26272A;
  border: 1px solid #3f3f46;
  border-radius: 6px;
  color: white;
  font-size: 11px;
  cursor: pointer;
}

.room-select:focus {
  outline: none;
  border-color: #2563EB;
}

.room-info {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.room-info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #9ca3af;
  background: #26272A;
  padding: 4px 8px;
  border-radius: 6px;
}

.room-info-item.warning {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

.room-info-item.info {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.room-actions {
  display: flex;
  gap: 6px;
}

.room-action-btn {
  flex: 1;
  padding: 6px 8px;
  background: #26272A;
  border: 1px solid #3f3f46;
  border-radius: 6px;
  color: #d1d5db;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.room-action-btn:hover {
  background: #2563EB;
  border-color: #2563EB;
  color: white;
}

.rooms-footer {
  padding: 12px;
  border-top: 1px solid #26272A;
}

.validate-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.validate-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

/* ============================================= */
/* МОДАЛЬНЫЕ ОКНА */
/* ============================================= */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: #18181B;
  border: 1px solid #26272A;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #26272A;
  background: #1f1f23;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.modal-close {
  width: 28px;
  height: 28px;
  background: #26272A;
  border: none;
  border-radius: 6px;
  color: #9ca3af;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #ef4444;
  color: white;
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

/* Merge modal */
.merge-rooms-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.merge-room-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #1f1f23;
  border: 1px solid #26272A;
  border-radius: 10px;
  color: #e5e7eb;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.merge-room-btn:hover {
  border-color: #2563EB;
  background: rgba(37, 99, 235, 0.1);
}

/* Split modal */
.split-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.split-field label {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 6px;
}

.split-input,
.split-select {
  width: 100%;
  padding: 10px 14px;
  background: #1f1f23;
  border: 1px solid #3f3f46;
  border-radius: 8px;
  color: white;
  font-size: 13px;
}

.split-input:focus,
.split-select:focus {
  outline: none;
  border-color: #2563EB;
}

.split-preview {
  background: #1f1f23;
  border-radius: 10px;
  padding: 12px;
}

.split-preview-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 12px;
  color: #9ca3af;
}

.split-preview-item.new {
  color: #22c55e;
  border-top: 1px solid #26272A;
  margin-top: 6px;
  padding-top: 12px;
}

.split-confirm-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.split-confirm-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

/* Validation modal */
.validation-modal {
  max-width: 450px;
}

.validation-success {
  text-align: center;
  padding: 30px 20px;
}

.success-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.success-text {
  font-size: 16px;
  font-weight: 500;
  color: #22c55e;
}

.validation-issues {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.validation-issue {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
}

.validation-issue.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.validation-issue.warning {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.issue-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.issue-content {
  flex: 1;
}

.issue-room {
  font-size: 12px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.issue-message {
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.4;
}

/* Мобильная адаптация */
@media (max-width: 640px) {
  .panel-container {
    width: 150px;
    max-height: calc(100vh - 80px);
  }
  
  .section-content {
    grid-template-columns: 1fr;
  }
  
  .btn-tool {
    flex-direction: row;
    padding: 8px 10px;
    gap: 8px;
  }
  
  .btn-tool span:first-child {
    font-size: 14px;
  }
  
  .btn-tool span:last-child {
    font-size: 11px;
  }
  
  .hotkeys-panel {
    font-size: 9px;
    padding: 8px 10px;
  }
  
  /* Чат на мобильных */
  .chat-container {
    max-width: 100%;
    border-radius: 16px 16px 0 0;
  }
  
  .chat-tab {
    padding: 8px 16px;
  }
  
  .chat-tab-text {
    display: none;
  }
  
  .quick-action-btn span:last-child {
    display: none;
  }
  
  .chat-messages {
    min-height: 150px;
    max-height: 200px;
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .welcome-suggestions {
    flex-direction: column;
  }
  
  /* Панель комнат на мобильных */
  .rooms-panel {
    width: 220px;
    max-height: calc(100vh - 150px);
  }
  
  .rooms-stats {
    flex-direction: column;
    gap: 8px;
  }
  
  .room-actions {
    flex-direction: column;
  }
  
  /* Модальные окна на мобильных */
  .modal-content {
    width: 95%;
    max-height: 85vh;
  }
}
</style>
