<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white mb-2">Уведомления</h1>
        <p class="text-gray-400">
          {{ unreadCount > 0 ? `${unreadCount} непрочитанных` : 'Все уведомления прочитаны' }}
        </p>
      </div>
      <div class="flex gap-2">
        <Button 
          v-if="unreadCount > 0"
          label="Прочитать все" 
          icon="pi pi-check-circle"
          outlined
          size="small"
          class="border-[#26272A] text-white hover:bg-[#27272A]"
          @click="markAllRead"
        />
        <Button 
          v-if="notifications.length > 0"
          label="Очистить все" 
          icon="pi pi-trash"
          outlined
          severity="danger"
          size="small"
          class="border-[#26272A]"
          @click="confirmClearAll"
        />
      </div>
    </div>

    <!-- Фильтры -->
    <div class="flex gap-2 flex-wrap">
      <Button 
        :label="`Все (${notifications.length})`"
        :outlined="activeFilter !== 'all'"
        size="small"
        :class="activeFilter === 'all' ? 'bg-[#2563EB] border-[#2563EB]' : 'border-[#26272A] text-white hover:bg-[#27272A]'"
        @click="activeFilter = 'all'"
      />
      <Button 
        :label="`Непрочитанные (${unreadCount})`"
        :outlined="activeFilter !== 'unread'"
        size="small"
        :class="activeFilter === 'unread' ? 'bg-[#2563EB] border-[#2563EB]' : 'border-[#26272A] text-white hover:bg-[#27272A]'"
        @click="activeFilter = 'unread'"
      />
    </div>

    <!-- Список уведомлений -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="bg-[#26272A] rounded-xl p-4 animate-pulse">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-[#18181B] rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-[#18181B] rounded w-3/4"></div>
            <div class="h-3 bg-[#18181B] rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredNotifications.length === 0" class="bg-[#26272A] rounded-xl p-12 text-center">
      <div class="w-20 h-20 bg-[#2563EB]/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-bell-slash text-4xl text-[#2563EB]"></i>
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">Нет уведомлений</h3>
      <p class="text-gray-400 max-w-md mx-auto">
        {{ activeFilter === 'unread' ? 'Все уведомления прочитаны' : 'У вас пока нет уведомлений' }}
      </p>
    </div>

    <div v-else class="space-y-2">
        <div 
          v-for="notification in filteredNotifications" 
          :key="notification.id"
          :class="[
            'bg-[#26272A] rounded-xl p-4 border transition-colors cursor-pointer',
            notification.read ? 'border-[#26272A]' : 'border-[#2563EB]/30 bg-[#2563EB]/5'
          ]"
          @click="handleNotificationClick(notification)"
        >
          <div class="flex items-start gap-4">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
              getNotificationBgColor(notification.type)
            ]">
              <i :class="[getNotificationIcon(notification.type), getNotificationColor(notification.type)]"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h4 :class="['font-medium', notification.read ? 'text-gray-300' : 'text-white']">
                    {{ notification.title }}
                  </h4>
                  <p class="text-sm text-gray-400 mt-1">{{ notification.message }}</p>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span class="text-xs text-gray-500">
                    {{ formatNotificationTime(notification.created_at) }}
                  </span>
                  <Button 
                    icon="pi pi-times" 
                    text
                    rounded
                    size="small"
                    class="text-gray-500 hover:text-white"
                    @click.stop="deleteNotification(notification.id)"
                  />
                </div>
              </div>
              <div v-if="!notification.read" class="mt-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-[#2563EB]/20 text-[#2563EB]">
                  Новое
                </span>
              </div>
            </div>
          </div>
        </div>
    </div>

    <!-- Clear All Dialog -->
    <Dialog 
      v-model:visible="clearDialog" 
      modal 
      header="Удаление уведомлений"
      :style="{ width: '400px' }"
    >
      <p class="text-white mb-4">Вы уверены, что хотите удалить все уведомления?</p>
      <p class="text-gray-400 text-sm mb-6">Это действие нельзя отменить.</p>
      <div class="flex gap-3 justify-end">
        <Button label="Отмена" outlined class="border-[#26272A] text-white hover:bg-[#27272A]" @click="clearDialog = false" />
        <Button label="Удалить все" severity="danger" class="border-none" @click="clearAllNotifications" />
      </div>
    </Dialog>
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
      notifications: [],
      loading: false,
      activeFilter: 'all',
      clearDialog: false,
      apiStore: null
    }
  },
  created() {
    this.apiStore = useApiStore()
    this.accessTokenCookie = useCookie('access_token')
  },
  computed: {
    unreadCount() {
      return this.notifications.filter(n => !n.read).length
    },
    filteredNotifications() {
      if (this.activeFilter === 'unread') {
        return this.notifications.filter(n => !n.read)
      }
      return this.notifications
    }
  },
  async mounted() {
    await this.fetchNotifications()
  },
  methods: {
    async fetchNotifications() {
      this.loading = true
      try {
        // GET /notifications
        const result = await $fetch(`${this.apiStore.url}api/v1/notifications`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          }
        })
        // API может вернуть разные форматы
        const notifications = result.data?.items || result.data?.notifications || result.notifications || result.data || []
        this.notifications = Array.isArray(notifications) ? notifications : []
        
        // Также получаем количество непрочитанных
        await this.fetchUnreadCount()
      } catch (error) {
        console.error('Ошибка загрузки уведомлений:', error)
        this.notifications = []
      } finally {
        this.loading = false
      }
    },
    
    // GET /notifications/count - количество непрочитанных
    async fetchUnreadCount() {
      try {
        const result = await $fetch(`${this.apiStore.url}api/v1/notifications/count`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          }
        })
        const data = result.data || result
        // Используем значение из API если оно есть
        if (data.count !== undefined || data.unread !== undefined) {
          // Обновляем локальный список на основе этого
          console.log('Unread count from API:', data.count || data.unread)
        }
      } catch (error) {
        // Не критично, используем локальный подсчёт
      }
    },
    getNotificationBgColor(type) {
      const colors = {
        info: 'bg-blue-500/20',
        success: 'bg-green-500/20',
        warning: 'bg-yellow-500/20',
        error: 'bg-red-500/20',
        request_update: 'bg-purple-500/20',
        processing_complete: 'bg-green-500/20',
        compliance_alert: 'bg-orange-500/20'
      }
      return colors[type] || 'bg-gray-500/20'
    },
    getNotificationIcon(type) {
      const icons = {
        info: 'pi pi-info-circle',
        success: 'pi pi-check-circle',
        warning: 'pi pi-exclamation-triangle',
        error: 'pi pi-times-circle',
        request_update: 'pi pi-refresh',
        processing_complete: 'pi pi-check',
        compliance_alert: 'pi pi-shield'
      }
      return icons[type] || 'pi pi-bell'
    },
    getNotificationColor(type) {
      const colors = {
        info: 'text-blue-500',
        success: 'text-green-500',
        warning: 'text-yellow-500',
        error: 'text-red-500',
        request_update: 'text-purple-500',
        processing_complete: 'text-green-500',
        compliance_alert: 'text-orange-500'
      }
      return colors[type] || 'text-gray-500'
    },
    formatNotificationTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) return 'Только что'
      if (diff < 3600000) return `${Math.floor(diff / 60000)} мин. назад`
      if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч. назад`
      
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    },
    async handleNotificationClick(notification) {
      if (!notification.read) {
        await this.markAsRead(notification.id)
      }
      
      if (notification.data?.floor_plan_id) {
        this.$router.push(`/panel/plane/${notification.data.floor_plan_id}`)
      } else if (notification.data?.request_id) {
        this.$router.push(`/panel/requests/${notification.data.request_id}`)
      }
    },
    async markAsRead(id) {
      try {
        await $fetch(`${this.apiStore.url}api/v1/notifications/${id}/read`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          }
        })
        const notification = this.notifications.find(n => n.id === id)
        if (notification) {
          notification.read = true
        }
      } catch (error) {
        console.error('Ошибка:', error)
      }
    },
    async markAllRead() {
      try {
        await $fetch(`${this.apiStore.url}api/v1/notifications/read-all`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          }
        })
        this.notifications.forEach(n => n.read = true)
      } catch (error) {
        console.error('Ошибка:', error)
      }
    },
    async deleteNotification(id) {
      try {
        await $fetch(`${this.apiStore.url}api/v1/notifications/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          }
        })
        this.notifications = this.notifications.filter(n => n.id !== id)
      } catch (error) {
        console.error('Ошибка:', error)
      }
    },
    confirmClearAll() {
      this.clearDialog = true
    },
    async clearAllNotifications() {
      try {
        await $fetch(`${this.apiStore.url}api/v1/notifications`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.accessTokenCookie.value}`,
            'Content-Type': 'application/json'
          }
        })
        this.notifications = []
        this.clearDialog = false
      } catch (error) {
        console.error('Ошибка:', error)
      }
    }
  }
}
</script>
