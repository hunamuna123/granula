<template>
  <nav class="bg-[#18181B]/95 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-[#26272A]">
    <div
      class="w-full mx-auto md:flex hidden md:flex-row sm:justify-between mt-2 md:items-center md:gap-x-3 py-2 px-4 md:px-6 lg:px-8">
      <div id="hs-nav-secondary"
        class="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block">
        <div class="py-2 sm:py-0 flex flex-col sm:flex-row sm:justify-start gap-y-2 sm:gap-y-0 sm:gap-x-6">
          <NuxtLink to="/company"
            class="text-sm text-gray-400 hover:text-white focus:outline-hidden focus:text-white transition-colors">
            Компания</NuxtLink>
          <NuxtLink to="/panel"
            class="text-sm text-gray-400 hover:text-white focus:outline-hidden focus:text-white transition-colors">
            Панель</NuxtLink>
          <NuxtLink to="/contacts"
            class="text-sm text-gray-400 hover:text-white focus:outline-hidden focus:text-white transition-colors">
            Контакты</NuxtLink>
          <NuxtLink to="/help/blog"
            class="text-sm text-gray-400 hover:text-white focus:outline-hidden focus:text-white transition-colors">
            Соглашения</NuxtLink>
        </div>
      </div>
    </div>
  </nav>
  <header
    class="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full bg-[#18181B]/95 backdrop-blur-md fixed top-0 md:top-[33px] left-0 right-0 border-b border-[#26272A]">
    <nav class="relative w-full mx-auto md:flex md:items-center md:justify-between md:gap-3 py-2 px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center gap-x-1">
        <NuxtLink to="/" class="flex-none focus:outline-hidden focus:opacity-80" aria-label="Brand">
          <IconsLogo class="h-8 w-auto fill-current text-white" />
        </NuxtLink>
        <button type="button"
          class="hs-collapse-toggle md:hidden relative size-9 flex justify-center items-center text-sm rounded-lg border border-[#26272A] text-white hover:bg-[#27272A] focus:outline-hidden focus:bg-[#27272A] disabled:opacity-50 disabled:pointer-events-none transition-colors"
          id="hs-header-base-collapse" aria-expanded="false" aria-controls="hs-header-base"
          aria-label="Toggle navigation" data-hs-collapse="#hs-header-base">
          <svg class="hs-collapse-open:hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <line x1="3" x2="21" y1="6" y2="6" />
            <line x1="3" x2="21" y1="12" y2="12" />
            <line x1="3" x2="21" y1="18" y2="18" />
          </svg>
          <svg class="hs-collapse-open:block shrink-0 hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24"
            height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          <span class="sr-only">Toggle navigation</span>
        </button>
      </div>

      <!-- Collapse -->
      <div id="hs-header-base"
        class="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block"
        aria-labelledby="hs-header-base-collapse">
        <div
          class="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-[#18181B] [&::-webkit-scrollbar-thumb]:bg-[#26272A]">
          <div class="py-2 md:py-0 flex flex-col md:flex-row md:items-center gap-0.5 md:gap-1">
            <div class="grow">
              <div class="flex flex-col md:flex-row md:justify-end md:items-center gap-0.5 md:gap-1">
                <div id="hs-nav-secondary"
                  class="hs-collapse block md:hidden overflow-hidden transition-all duration-300 basis-full grow">
                  <div class="py-2 md:py-0 flex flex-col md:flex-row md:justify-end gap-y-2 md:gap-y-0 md:gap-x-6">
                    <NuxtLink to="/company"
                      class="text-sm text-gray-400 hover:text-white focus:outline-hidden focus:text-white transition-colors">
                      Компания</NuxtLink>
                    <NuxtLink to="/help/delivery"
                      class="text-sm text-gray-400 hover:text-white focus:outline-hidden focus:text-white transition-colors">
                      Доставка</NuxtLink>
                    <NuxtLink to="/contacts"
                      class="text-sm text-gray-400 hover:text-white focus:outline-hidden focus:text-white transition-colors">
                      Контакты</NuxtLink>
                    <NuxtLink to="/help/blog"
                      class="text-sm text-gray-400 hover:text-white focus:outline-hidden focus:text-white transition-colors">
                      Полезные статьи</NuxtLink>
                  </div>
                </div>

                <NuxtLink to="/panel"
                  class="py-2 px-3 inline-flex items-center gap-1.5 text-sm rounded-lg bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:border-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-blue-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-layout-dashboard">
                    <rect width="7" height="9" x="3" y="3" rx="1" />
                    <rect width="7" height="5" x="14" y="3" rx="1" />
                    <rect width="7" height="9" x="14" y="12" rx="1" />
                    <rect width="7" height="5" x="3" y="16" rx="1" />
                  </svg>
                  <span>Панель</span>
                </NuxtLink>

              </div>
            </div>

            <div class="my-2 md:my-0 md:mx-2">
              <div class="w-full h-px md:w-px md:h-4 bg-[#26272A]"></div>
            </div>
            <div class="flex items-center gap-2">
              <div class="rounded-full border border-[#26272A]">
                <NuxtLink to="/basket">
                  <button type="button" aria-haspopup="menu" aria-expanded="false"
                    class="inline-flex items-center justify-center size-[36px] text-sm leading-none rounded-full bg-[#18181B] text-white hover:bg-[#27272A] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      class="lucide lucide-heart-icon lucide-heart">
                      <path
                        d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                    </svg>
                  </button>
                </NuxtLink>
              </div>
              <div class="flex flex-wrap items-center gap-x-1.5">
                <HeaderNavprofile v-if="accessToken" />
                <NuxtLink v-else to="/auth/login"
                  class="py-2 px-3 inline-flex items-center gap-1.5 text-sm rounded-lg bg-[#26272A] text-white border border-[#26272A] hover:bg-[#27272A] hover:border-[#3f3f46] disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-[#27272A] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-user">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Войти</span>
                </NuxtLink>
              </div>
            </div>

          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { api } from "@/store/api.js";

const apiStore = api();
const url = computed(() => apiStore.url);
const categories = ref([]);

const fetchCategories = async () => {
  try {
    const response = await fetch(`${url.value}api/v1/categories/parent/`);
    const data = await response.json();
    if (data.data) {
      categories.value = data.data;
    }
  } catch (err) {
    console.error('Ошибка при загрузке категорий:', err);
  }
};

onMounted(() => {
  fetchCategories();
  if (window.HSStaticMethods) {
    window.HSStaticMethods.autoInit();
  }
});

onUnmounted(() => {
  const collapses = document.querySelectorAll('.hs-collapse');
  collapses.forEach(collapse => {
    if (collapse.classList.contains('hs-collapse-open')) {
      collapse.classList.remove('hs-collapse-open');
    }
  });
});

let accessToken = useCookie("access_token").value;
</script>
