<template>
  <div class="flex flex-col h-[calc(100vh-8rem)]">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h1 class="text-2xl font-bold text-white mb-1">AI Ассистент</h1>
        <p class="text-gray-400 text-sm">Задайте вопрос о планировке или получите рекомендации</p>
      </div>
      <div class="flex items-center gap-2">
        <Button 
          v-if="chatHistory.length > 0"
          label="Очистить чат" 
          icon="pi pi-trash" 
          outlined
          size="small"
          class="border-[#26272A] text-white hover:bg-[#27272A]"
          @click="clearChat"
        />
      </div>
    </div>

    <!-- Выбор контекста -->
    <div class="bg-[#26272A] rounded-xl p-4 mb-4">
      <div class="flex items-center gap-4 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-400">Контекст:</span>
          <Dropdown
            v-model="selectedFloorPlan"
            :options="floorPlans"
            optionLabel="name"
            optionValue="id"
            placeholder="Выберите планировку"
            class="w-[250px] bg-[#18181B] border-[#26272A] text-white"
          />
        </div>
        <div class="flex items-center gap-2 text-sm text-gray-400">
          <i class="pi pi-info-circle"></i>
          <span>AI учитывает выбранную планировку при ответах</span>
        </div>
      </div>
    </div>

    <!-- Chat Messages -->
    <div ref="chatContainer" class="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
      <!-- Welcome message -->
      <div v-if="chatHistory.length === 0" class="flex flex-col items-center justify-center h-full text-center">
        <div class="w-20 h-20 bg-[#2563EB]/20 rounded-full flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-white mb-2">Чем могу помочь?</h2>
        <p class="text-gray-400 max-w-md mb-6">Я могу помочь с планировкой, дать рекомендации по перепланировке, объяснить нормы СНиП и ответить на вопросы</p>
        
        <!-- Quick suggestions -->
        <div class="flex flex-wrap gap-2 justify-center max-w-2xl">
          <button 
            v-for="suggestion in quickSuggestions" 
            :key="suggestion"
            class="px-4 py-2 bg-[#26272A] hover:bg-[#2563EB]/20 text-gray-300 hover:text-white rounded-full text-sm transition-colors"
            @click="sendQuickMessage(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>

      <!-- Messages -->
      <template v-else>
        <div 
          v-for="(message, index) in chatHistory" 
          :key="index"
          :class="[
            'flex',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div 
            :class="[
              'max-w-[80%] rounded-2xl px-4 py-3',
              message.role === 'user' 
                ? 'bg-[#2563EB] text-white rounded-br-md' 
                : 'bg-[#26272A] text-gray-100 rounded-bl-md'
            ]"
          >
            <div class="flex items-start gap-3">
              <div v-if="message.role === 'assistant'" class="w-8 h-8 bg-[#2563EB]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p class="whitespace-pre-wrap">{{ message.content }}</p>
                <span class="text-xs opacity-60 mt-1 block">
                  {{ formatTime(message.timestamp) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="isTyping" class="flex justify-start">
          <div class="bg-[#26272A] rounded-2xl rounded-bl-md px-4 py-3">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Input area -->
    <div class="bg-[#26272A] rounded-xl p-4">
      <form @submit.prevent="sendMessage" class="flex gap-3">
        <div class="flex-1 relative">
          <Textarea
            v-model="messageInput"
            placeholder="Введите сообщение..."
            rows="1"
            autoResize
            :maxLength="2000"
            class="w-full bg-[#18181B] border-[#26272A] text-white resize-none"
            @keydown.enter.exact.prevent="sendMessage"
          />
          <span class="absolute right-3 bottom-2 text-xs text-gray-500">
            {{ messageInput.length }}/2000
          </span>
        </div>
        <Button 
          type="submit"
          icon="pi pi-send"
          :disabled="!messageInput.trim() || loading"
          :loading="loading"
          class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none self-end"
        />
      </form>

      <!-- AI Suggestions -->
      <div v-if="suggestions.length > 0" class="mt-3 flex flex-wrap gap-2">
        <span class="text-xs text-gray-500">Предложения:</span>
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          class="px-3 py-1 bg-[#18181B] hover:bg-[#2563EB]/20 text-gray-300 hover:text-white rounded-full text-xs transition-colors"
          @click="sendQuickMessage(suggestion)"
        >
          {{ suggestion }}
        </button>
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
      chatHistory: [],
      messageInput: '',
      selectedFloorPlan: null,
      floorPlans: [],
      suggestions: [],
      loading: false,
      isTyping: false,
      apiStore: null,
      quickSuggestions: [
        'Как объединить кухню с гостиной?',
        'Какие нормы нужно соблюдать при перепланировке?',
        'Можно ли перенести санузел?',
        'Как увеличить площадь комнаты?',
        'Что такое несущая стена?'
      ]
    }
  },
  created() {
    this.apiStore = useApiStore()
    this.accessTokenCookie = useCookie('access_token')
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
    async sendMessage() {
      if (!this.messageInput.trim() || this.loading) return

      const message = this.messageInput.trim()
      this.messageInput = ''
      this.suggestions = []

      // Добавляем сообщение пользователя
      this.chatHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      })

      this.loading = true
      this.isTyping = true
      this.scrollToBottom()

      try {
        const result = await $fetch(`${this.apiStore.url}api/v1/ai/chat`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          },
          body: {
            message: message,
            floor_plan_id: this.selectedFloorPlan || undefined
          }
        })

        const data = result.data || result

        // Добавляем ответ AI
        this.chatHistory.push({
          role: 'assistant',
          content: data.response || data.message || 'Не удалось получить ответ',
          timestamp: new Date().toISOString()
        })

        if (data.suggestions) {
          this.suggestions = data.suggestions
        }
      } catch (error) {
        this.chatHistory.push({
          role: 'assistant',
          content: 'Произошла ошибка при получении ответа. Попробуйте позже.',
          timestamp: new Date().toISOString()
        })
        console.error('Ошибка AI чата:', error)
      } finally {
        this.loading = false
        this.isTyping = false
        this.$nextTick(() => this.scrollToBottom())
      }
    },
    sendQuickMessage(message) {
      this.messageInput = message
      this.sendMessage()
    },
    clearChat() {
      this.chatHistory = []
      this.suggestions = []
    },
    scrollToBottom() {
      if (this.$refs.chatContainer) {
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight
      }
    },
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    }
  },
  watch: {
    chatHistory: {
      handler() {
        this.$nextTick(() => this.scrollToBottom())
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #18181B;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #26272A;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #3f3f46;
}

:deep(.p-dropdown) {
  background-color: #18181B !important;
  border-color: #26272A !important;
}

:deep(.p-dropdown .p-dropdown-label) {
  color: white !important;
}

:deep(.p-inputtextarea) {
  background-color: #18181B !important;
  border-color: #26272A !important;
  color: white !important;
}

:deep(.p-inputtextarea::placeholder) {
  color: #717177 !important;
}

:deep(.p-inputtextarea:focus) {
  border-color: #2563EB !important;
  box-shadow: none !important;
}
</style>
