<template>
  <div class="min-h-screen flex items-center justify-center bg-[#09090B] py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-6 sm:space-y-8">
      <div class="bg-[#18181B] border border-[#26272A] rounded-xl sm:rounded-2xl shadow-2xs">
        <div class="p-4 sm:p-6 md:p-7">
          <div class="text-center">
            <div class="pb-3 flex items-center justify-center">
              <NuxtLink to="/" class="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-hidden" aria-label="Гранула">
                <p class="text-white font-bold text-2xl flex">
                  <IconsLogo class="mx-1" />
                </p>
              </NuxtLink>
            </div>
            <h1 class="text-xl sm:text-2xl font-bold text-white mb-2">Добро пожаловать</h1>
            <p class="text-gray-400 text-sm">Войдите в свой аккаунт</p>
          </div>

          <div class="mt-5">
            <button type="button"
              class="w-full py-2.5 sm:py-3 px-3 sm:px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-[#26272A] bg-[#18181B] text-white shadow-2xs hover:bg-[#27272A] focus:outline-hidden focus:bg-[#27272A] disabled:opacity-50 disabled:pointer-events-none">
              <IconsTelegram class="w-5 h-5 sm:w-6 sm:h-6" />
              Войти при помощи Яндекс
            </button>

            <div
              class="py-3 flex items-center text-xs text-[#717177] uppercase before:flex-1 before:border-t before:border-[#26272A] before:me-6 after:flex-1 after:border-t after:border-[#26272A] after:ms-6">
              или</div>

            <form @submit.prevent="sendData" method="post">
              <div class="grid gap-y-4">
                <div>
                  <label for="email" class="block text-sm mb-2 text-white">Почта</label>
                  <input 
                    id="email" 
                    type="email"
                    v-model="email" 
                    placeholder="Введите вашу почту"
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#18181B] border border-[#26272A] rounded-lg text-white text-sm sm:text-base placeholder-[#717177] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-colors"
                    required
                  />
                  <p v-if="errorBoolen && errorField === 'email'" class="text-xs text-red-600 mt-2">{{ error }}</p>
                </div>

                <div>
                  <div class="flex flex-wrap justify-between items-center gap-2 mb-2">
                    <label for="password" class="block text-sm text-white">Пароль</label>
                  </div>
                  <div class="relative">
                    <input 
                      id="password" 
                      :type="showPassword ? 'text' : 'password'"
                      v-model="password" 
                      placeholder="Введите ваш пароль"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#18181B] border border-[#26272A] rounded-lg text-white text-sm sm:text-base placeholder-[#717177] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-colors pr-12"
                      required
                    />
                    <button 
                      type="button" 
                      @click="showPassword = !showPassword"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-[#717177] hover:text-white transition-colors"
                    >
                      <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </button>
                  </div>
                  <p v-if="errorBoolen && errorField === 'password'" class="text-xs text-red-600 mt-2">{{ error }}</p>
                </div>

                <p v-if="errorBoolen && errorField === 'auth'" class="text-xs text-red-600 mt-2">{{ error }}</p>

                <button 
                  type="submit" 
                  :disabled="loading"
                  class="w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm sm:text-base font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ loading ? 'Вход...' : 'Войти' }}
                </button>
              </div>
            </form>

            <div class="mt-6 text-center">
              <p class="text-sm text-gray-400">
                Нет аккаунта? 
                <NuxtLink to="/auth/register" class="text-[#2563EB] hover:underline font-medium">Зарегистрироваться</NuxtLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
  middleware: 'auth'
})
</script>

<script>
import { useCookie } from "#app"

const API_URL = 'https://api.granula.raitokyokai.tech/'

export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
      errorBoolen: false,
      errorField: "",
      loading: false,
      showPassword: false
    }
  },
  methods: {
    async sendData() {
      this.error = ""
      this.errorBoolen = false
      this.errorField = ""
      
      if (!this.email) {
        this.error = "Введите email"
        this.errorBoolen = true
        this.errorField = "email"
        return
      }
      
      if (!this.password || this.password.length < 8) {
        this.error = "Пароль должен быть не менее 8 символов"
        this.errorBoolen = true
        this.errorField = "password"
        return
      }
      
      this.loading = true
      
      try {
        const result = await $fetch(`${API_URL}api/v1/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            email: this.email,
            password: this.password
          }
        })
        
        const data = result.data || result
        
        // Access Token - 15 минут, Refresh Token - 7 дней
        let accessToken = useCookie("access_token", { maxAge: 60 * 15 })
        let refreshToken = useCookie("refresh_token", { maxAge: 60 * 60 * 24 * 7 })
        
        accessToken.value = data.access_token
        refreshToken.value = data.refresh_token
        
        this.$router.push("/panel")
      } catch (error) {
        this.errorBoolen = true
        this.errorField = "auth"
        this.error = error.data?.detail || error.data?.message || error.message || "Ошибка авторизации"
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
