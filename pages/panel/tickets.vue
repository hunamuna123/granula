<template>
    <div v-if="loading">
      <SkeletonProfile />
    </div>
  
    <div v-else-if="error" class="min-h-screen p-2">
      <div class="mx-auto">
        <div class="bg-[#18181B] border border-[#26272A] rounded-xl p-6">
          <h1 class="text-2xl font-bold text-white mb-6">Профиль</h1>
          <div class="bg-red-900/20 border border-red-500/20 rounded-lg p-4 mb-4">
            <p class="text-red-400">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>
  
    <div v-else-if="user" class="min-h-screen p-2">
      <div class="mx-auto ">
    
        <div class="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-xl p-6 mb-6">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold text-white">
                {{ user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase() }}
              </span>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">{{ user.full_name || 'Пользователь' }}</h1>
              <p class="text-white/80">{{ user.email }}</p>
            </div>
          </div>
        </div>
  
    
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div class="bg-[#18181B] border border-[#26272A] rounded-xl p-6">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-[#2563EB]/20 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-white">Основная информация</h2>
            </div>
  
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-[#26272A] rounded-lg">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-[#717177] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                    </path>
                  </svg>
                  <span class="text-gray-300">Email</span>
                </div>
                <span class="text-white font-medium">{{ user.email }}</span>
              </div>
  
              <div class="flex items-center justify-between p-3 bg-[#26272A] rounded-lg">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-[#717177] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span class="text-gray-300">Полное имя</span>
                </div>
                <span class="text-white font-medium">{{ user.full_name || 'Не указано' }}</span>
              </div>
  
              <div class="flex items-center justify-between p-3 bg-[#26272A] rounded-lg">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-[#717177] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-gray-300">Статус</span>
                </div>
                <span class="text-white font-medium" :class="user.is_active ? 'text-green-400' : 'text-red-400'">
                  {{ user.is_active ? 'Активен' : 'Неактивен' }}
                </span>
              </div>
            </div>
          </div>
  
  
          <div class="bg-[#18181B] border border-[#26272A] rounded-xl p-6">
            <div class="flex items-center mb-4">
                              <div class="w-10 h-10 bg-[#2563EB]/20 rounded-lg flex items-center justify-center mr-3">
                      <svg class="w-5 h-5 text-[#2563EB]" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-white">Telegram</h2>
            </div>
  
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-[#26272A] rounded-lg">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-[#717177] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z">
                    </path>
                  </svg>
                  <span class="text-gray-300">Telegram ID</span>
                </div>
                <span class="text-white font-medium">{{ user.tg_user_id || 'Не подключен' }}</span>
              </div>
  
              <div class="flex items-center justify-between p-3 bg-[#26272A] rounded-lg">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-[#717177] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span class="text-gray-300">Username</span>
                </div>
                <span class="text-white font-medium">{{ user.tg_user_name || 'Не указан' }}</span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Команда и активность -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Карточка команды -->
          <div class="bg-[#18181B] border border-[#26272A] rounded-xl p-6">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                  </path>
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-white">Команда</h2>
            </div>
  
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-[#26272A] rounded-lg">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-[#717177] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-gray-300">Статус</span>
                </div>
                <span class="text-white font-medium">{{ getTeamStatus(user.team_status) }}</span>
              </div>
  
              <div class="flex items-center justify-between p-3 bg-[#26272A] rounded-lg">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-[#717177] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                    </path>
                  </svg>
                  <span class="text-gray-300">ID команды</span>
                </div>
                <span class="text-white font-medium">{{ user.team_id || 'Не в команде' }}</span>
              </div>
            </div>
          </div>
  
          <div class="bg-[#18181B] border border-[#26272A] rounded-xl p-6">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 class="text-xl font-semibold text-white">Активность</h2>
            </div>
  
            <div class="space-y-4">
              <div class="flex items-center justify-between p-3 bg-[#26272A] rounded-lg">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-[#717177] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-gray-300">Последняя активность</span>
                </div>
                <span class="text-white font-medium">{{ formatDate(user.last_activity) }}</span>
              </div>
  
              <div class="flex items-center justify-between p-3 bg-[#26272A] rounded-lg">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-[#717177] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-gray-300">Статус</span>
                </div>
                <div class="flex items-center">
                  <div class="w-2 h-2 rounded-full mr-2" :class="user.is_active ? 'bg-green-400' : 'bg-red-400'"></div>
                  <span class="text-white font-medium">{{ user.is_active ? 'Онлайн' : 'Оффлайн' }}</span>
                </div>
              </div>
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
import { useAuth } from '@/utils/auth'

export default {
    data() {
      return {
        user: null,
        loading: true,
        error: null
      }
    },
    setup() {
      const { getUserData } = useAuth()
  
      return {
        getUserData
      }
    },
    async mounted() {
      await this.loadUserData()
    },
    methods: {
      async loadUserData() {
        try {
          this.loading = true
          this.error = null
  
          this.user = await this.getUserData()
        } catch (error) {
          this.error = error.message || 'Произошла ошибка при загрузке данных'
        } finally {
          this.loading = false
        }
      },
      getTeamStatus(status) {
        const statuses = {
          0: 'Не в команде',
          1: 'Участник',
          2: 'Администратор',
          3: 'Владелец'
        }
        return statuses[status] || 'Неизвестно'
      },
      formatDate(timestamp) {
        if (!timestamp) return 'Неизвестно'
        return new Date(timestamp * 1000).toLocaleString('ru-RU')
      }
    }
  }
  </script>