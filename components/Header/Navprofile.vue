<template>
    <div
      class="hs-dropdown [--strategy:fixed] lg:[--strategy:fixed] [--adaptive:none] [--is-collapse:true] border border-[#26272A] rounded-full lg:[--is-collapse:false] [--gpu-acceleration:false]">
  
      <button id="hs-header-profile-dropdown" type="button" aria-haspopup="menu" aria-expanded="false"
        aria-label="Dropdown"
        class="inline-flex items-center justify-center size-[36px] text-sm leading-none rounded-full bg-[#18181B] text-white hover:bg-[#27272A] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-user">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
      <div
        class="hs-dropdown-menu hs-dropdown-open:scale-100 border border-[#26272A] hs-dropdown-open:opacity-100 scale-95 opacity-0 z-10 ease-in-out transition-[transform,opacity] duration-200 min-w-56 bg-[#18181B] shadow-xl rounded-xl hidden"
        role="menu" aria-orientation="vertical" aria-labelledby="hs-header-profile-dropdown">

        <div class="p-1.5 space-y-1">
          <NuxtLink
            class="p-2.5 flex gap-x-3 hover:bg-[#27272A] focus:outline-none focus:bg-[#27272A] rounded-lg transition-colors text-sm text-gray-300 hover:text-white"
            to="/profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="text-[#717177]">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Профиль</span>
          </NuxtLink>
          <NuxtLink
            class="p-2.5 flex gap-x-3 hover:bg-[#27272A] focus:outline-none focus:bg-[#27272A] rounded-lg transition-colors text-sm text-gray-300 hover:text-white"
            to="/basket">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="text-[#717177]">
              <path d="m15 11-1 9" />
              <path d="m19 11-4-7" />
              <path d="M2 11h20" />
              <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
              <path d="M4.5 15.5h15" />
              <path d="m5 11 4-7" />
              <path d="m9 11 1 9" />
            </svg>
            <span>Корзина</span>
          </NuxtLink>
          
          <div class="border-t border-[#26272A] my-1"></div>
          
          <button @click="leaveAccount"
            class="w-full p-2.5 flex gap-x-3 hover:bg-red-500/10 cursor-pointer focus:outline-none focus:bg-red-500/10 rounded-lg transition-colors text-sm text-red-400 hover:text-red-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            <span>Выйти из аккаунта</span>
          </button>
        </div>
      </div>
    </div>
  </template>
  <script>
  export default {
    methods: {
      leaveAccount() {
        let accessToken = useCookie('access_token')
        let refreshToken = useCookie('refresh_token')
        refreshToken.value = null
        accessToken.value = null
        window.location.href = '/auth/login'
      }
    }
  }
  </script>
