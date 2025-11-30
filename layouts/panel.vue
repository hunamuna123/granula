<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, computed } from 'vue';
import { useAuth } from '@/utils/auth';
import { onMounted } from 'vue'

onMounted(() => {
    if (window.HSStaticMethods) {
        window.HSStaticMethods.autoInit()
    }
})
const route = useRoute();
const sidebar = ref<HTMLElement | null>(null);
const { logout } = useAuth();

// Computed для проверки активных пунктов меню
const isTicketsActive = computed(() => {
    return route.path === '/panel/tickets' || route.path.startsWith('/panel/tickets/')
})

const isCreatePlanActive = computed(() => {
    return route.path === '/panel/plane/create'
})

const isPlansListActive = computed(() => {
    return route.path === '/panel/plane/list' || 
           (route.path.startsWith('/panel/plane/') && route.path !== '/panel/plane/create' && /^\/panel\/plane\/[^\/]+$/.test(route.path))
})

const isWorkspacesActive = computed(() => {
    return route.path.startsWith('/panel/workspaces')
})

function closeSidebar() {
    if (window.innerWidth < 1024 && sidebar.value) {
        if (window.HSOverlay) {
            window.HSOverlay.close(sidebar.value);
        } else {
            sidebar.value.classList.remove('hs-overlay-open:translate-x-0');
            sidebar.value.classList.add('-translate-x-full');
            sidebar.value.classList.remove('show');
            sidebar.value.setAttribute('aria-hidden', 'true');
        }
    }
}
// закрывает ебучи сайдбар на мобиле при выборе страницы 
</script>

<template>
    <div class="sticky top-0 inset-x-0 z-20  border-y bg-[#09090B] border-[#26272A] px-4 sm:px-6 lg:px-8 lg:hidden">
        <div class="flex items-center py-2">
            <button type="button"
                class="size-9 flex justify-center items-center gap-x-2 border border-[#26272A] text-white hover:text-gray-500 rounded-lg focus:outline-hidden focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none"
                aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-application-sidebar"
                aria-label="Toggle navigation" data-hs-overlay="#hs-application-sidebar">
                <span class="sr-only">Toggle Navigation</span>
                <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M15 3v18" />
                    <path d="m8 9 3 3-3 3" />
                </svg>
            </button>
            <ol class="ms-3 flex items-center justify-center w-full whitespace-nowrap">
                <NuxtLink to="/" class="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-hidden "
                    aria-label="PWAtop">
                    <p class=" text-white font-bold text-2xl flex">
                        <IconsLogo class="mx-1 fill-current" />
                    </p>
                </NuxtLink>
            </ol>
        </div>
    </div>
    <div id="hs-application-sidebar" ref="sidebar" class="hs-overlay  [--auto-close:lg]
        hs-overlay-open:translate-x-0
        -translate-x-full transition-all duration-300 transform
        w-65 h-full
        hidden
        fixed inset-y-0 start-0 z-60
        bg-[#09090B] 
        lg:block lg:translate-x-0 lg:end-auto lg:bottom-0" role="dialog" tabindex="-1" aria-label="Sidebar">
        <div class="relative flex flex-col h-full max-h-full">
            <div class="px-6 pt-4 flex items-center justify-center ">
                <NuxtLink to="/" class="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-hidden "
                    aria-label="PWAtop">
                    <p class=" text-white font-bold text-2xl flex">
                        <IconsLogo class="mx-1 fill-current text-white" />
                    </p>
                </NuxtLink>
                <div class="hidden lg:block ms-2">
                </div>
            </div>
            <div
                class="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-[#09090B] [&::-webkit-scrollbar-thumb]:bg-[#09090B]">
                <nav class="hs-accordion-group  p-3 w-ful flex flex-col flex-wrap" data-hs-accordion-always-open>
                    <ul class="flex flex-col space-y-2 mt-3 ">
                        <div
                            class="mb-3 ml-2  shrink-0 text-xs font-medium text-[#717177] uppercase whitespace-nowrap truncate transition-[margin,opacity,transform] duration-100 ease-linear [&>svg]:size-4 [&>svg]:shrink-0">
                            Панель
                        </div>
                        <li>
                            <NuxtLink to="/panel"
                                class="group  w-full flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all border-l-4 border-transparent"
                                :class="route.path === '/panel' ? 'bg-[#2563EB] text-white' : 'hover:bg-[#27272A] text-[#717177]'"
                                @click="closeSidebar">
                                <IconsHome class="w-5 h-5 text-inherit group-hover:text-primary transition" />
                                <span>Главная</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/panel/notifications"
                                class="group  w-full flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all border-l-4 border-transparent"
                                :class="route.path === '/panel/notifications' ? 'bg-[#2563EB] text-white' : 'hover:bg-[#27272A] text-[#717177]'"
                                @click="closeSidebar">
                                <svg class="w-5 h-5 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                </svg>
                                <span>Уведомления</span>
                            </NuxtLink>
                        </li>
                        <div
                            class="mb-3 ml-2  shrink-0 text-xs font-medium text-[#717177] uppercase whitespace-nowrap truncate transition-[margin,opacity,transform] duration-100 ease-linear [&>svg]:size-4 [&>svg]:shrink-0">
                            Конструктор
                        </div>
                        <li>
                            <NuxtLink to="/panel/workspaces"
                                class="group  w-full flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all border-l-4 border-transparent"
                                :class="isWorkspacesActive ? 'bg-[#2563EB] text-white' : 'hover:bg-[#27272A] text-[#717177]'"
                                @click="closeSidebar">
                                <svg class="w-5 h-5 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                </svg>
                                <span>Воркспейсы</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/panel/plane/create"
                                class="group  w-full flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all border-l-4 border-transparent"
                                :class="isCreatePlanActive ? 'bg-[#2563EB] text-white' : 'hover:bg-[#27272A] text-[#717177]'"
                                @click="closeSidebar">
                                <svg class="w-5 h-5 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                <span>Создать планировку</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/panel/plane/list"
                                class="group  w-full flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all border-l-4 border-transparent"
                                :class="isPlansListActive ? 'bg-[#2563EB] text-white' : 'hover:bg-[#27272A] text-[#717177]'"
                                @click="closeSidebar">
                                <svg class="w-5 h-5 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </svg>
                                <span>Планировки</span>
                            </NuxtLink>
                        </li>
                        <div
                            class="mb-3 ml-2 mt-4 shrink-0 text-xs font-medium text-[#717177] uppercase whitespace-nowrap truncate transition-[margin,opacity,transform] duration-100 ease-linear [&>svg]:size-4 [&>svg]:shrink-0">
                            AI Инструменты
                        </div>
                        <li>
                            <NuxtLink to="/panel/ai-chat"
                                class="group  w-full flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all border-l-4 border-transparent"
                                :class="route.path === '/panel/ai-chat' ? 'bg-[#2563EB] text-white' : 'hover:bg-[#27272A] text-[#717177]'"
                                @click="closeSidebar">
                                <svg class="w-5 h-5 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                </svg>
                                <span>AI Ассистент</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/panel/compliance"
                                class="group  w-full flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all border-l-4 border-transparent"
                                :class="route.path === '/panel/compliance' ? 'bg-[#2563EB] text-white' : 'hover:bg-[#27272A] text-[#717177]'"
                                @click="closeSidebar">
                                <svg class="w-5 h-5 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                </svg>
                                <span>Проверка норм</span>
                            </NuxtLink>
                        </li>
                        <div
                            class="mb-3 ml-2 mt-4 shrink-0 text-xs font-medium text-[#717177] uppercase whitespace-nowrap truncate transition-[margin,opacity,transform] duration-100 ease-linear [&>svg]:size-4 [&>svg]:shrink-0">
                            Услуги
                        </div>
                        <li>
                            <NuxtLink to="/panel/requests"
                                class="group  w-full flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all border-l-4 border-transparent"
                                :class="route.path.startsWith('/panel/requests') ? 'bg-[#2563EB] text-white' : 'hover:bg-[#27272A] text-[#717177]'"
                                @click="closeSidebar">
                                <svg class="w-5 h-5 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                                <span>Заявки экспертам</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/panel/tickets"
                                class="group  w-full flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all border-l-4 border-transparent"
                                :class="isTicketsActive ? 'bg-[#2563EB] text-white' : 'hover:bg-[#27272A] text-[#717177]'"
                                @click="closeSidebar">
                                <svg class="w-5 h-5 text-inherit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                                </svg>
                                <span>Поддержка</span>
                            </NuxtLink>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="mt-7 p-3 flex">
                <NuxtLink to="/panel/profile"
                    class="group w-full flex items-center gap-3 px-4 py-2 rounded-full font-medium transition-all border-l-4 border-transparent"
                    :class="route.path === '/panel/profile' ? 'bg-[#2563EB] text-white' : 'hover:bg-[#27272A] text-[#717177]'"
                    @click="closeSidebar">
                    <IconsProfile class="w-5 h-5 text-inherit group-hover:text-primary transition" />
                    <span>Профиль</span>
                </NuxtLink>
                <Button aria-label="eXIT" severity="danger" variant="text" rounded class="text-red-500" @click="logout">
                    <IconsExit />
                </Button>
            </div>
        </div>
    </div>
    <div class="w-full min-h-screen  p-2   lg:ps-65 flex flex-col">
        <div class="bg-[#18181B] flex-1 rounded-4xl flex flex-col border border-[#26272A]">
            <div class="p-4 md:p-6">
                <slot />
            </div>
        </div>
    </div>
</template>