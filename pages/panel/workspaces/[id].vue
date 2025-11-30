<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <NuxtLink to="/panel/workspaces">
          <Button 
            icon="pi pi-arrow-left" 
            outlined 
            size="small"
            class="border-[#26272A] text-white hover:bg-[#27272A]"
          />
        </NuxtLink>
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-white">{{ workspace?.name || 'Воркспейс' }}</h1>
            <span v-if="isCurrentWorkspace" class="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
              Активный
            </span>
          </div>
          <p class="text-gray-400">{{ workspace?.description || 'Рабочее пространство' }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <Button 
          v-if="!isCurrentWorkspace"
          label="Выбрать" 
          icon="pi pi-check"
          class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none"
          @click="selectWorkspace"
        />
        <Button 
          label="Редактировать" 
          icon="pi pi-pencil"
          outlined
          class="border-[#26272A] text-white hover:bg-[#27272A]"
          @click="showEditDialog = true"
        />
        <Button 
          icon="pi pi-trash" 
          outlined 
          severity="danger"
          class="border-[#26272A]"
          @click="showDeleteDialog = true"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-6">
      <div class="bg-[#26272A] rounded-xl p-6 animate-pulse">
        <div class="h-6 bg-[#18181B] rounded w-1/3 mb-4"></div>
        <div class="h-4 bg-[#18181B] rounded w-2/3"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-900/20 border border-red-500/20 rounded-xl p-6 text-center">
      <p class="text-red-400 mb-4">{{ error }}</p>
      <Button label="Повторить" icon="pi pi-refresh" @click="loadWorkspace" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none" />
    </div>

    <!-- Content -->
    <div v-else-if="workspace" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Левая колонка - Информация -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Статистика -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-[#26272A] rounded-xl p-4 border border-[#26272A]">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-[#2563EB]/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <div class="text-2xl font-bold text-white">{{ floorPlans.length }}</div>
                <div class="text-sm text-gray-400">Планировок</div>
              </div>
            </div>
          </div>
          <div class="bg-[#26272A] rounded-xl p-4 border border-[#26272A]">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <div class="text-2xl font-bold text-white">{{ workspace.member_count || members.length || 1 }}</div>
                <div class="text-sm text-gray-400">Участников</div>
              </div>
            </div>
          </div>
          <div class="bg-[#26272A] rounded-xl p-4 border border-[#26272A]">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div class="text-sm font-medium text-white">{{ formatDate(workspace.created_at) }}</div>
                <div class="text-sm text-gray-400">Создан</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Планировки воркспейса -->
        <div class="bg-[#26272A] rounded-xl border border-[#26272A]">
          <div class="p-4 border-b border-[#18181B] flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white">Планировки</h3>
            <NuxtLink :to="`/panel/plane/create?workspace=${workspaceId}`">
              <Button 
                label="Создать" 
                icon="pi pi-plus" 
                size="small"
                class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none"
              />
            </NuxtLink>
          </div>
          <div v-if="loadingFloorPlans" class="p-6">
            <div class="animate-pulse space-y-3">
              <div v-for="i in 3" :key="i" class="h-20 bg-[#18181B] rounded-lg"></div>
            </div>
          </div>
          <div v-else-if="floorPlans.length === 0" class="p-8 text-center">
            <div class="w-16 h-16 bg-[#18181B] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <p class="text-gray-400 mb-4">Нет планировок в этом воркспейсе</p>
            <NuxtLink :to="`/panel/plane/create?workspace=${workspaceId}`">
              <Button 
                label="Создать первую планировку" 
                icon="pi pi-plus" 
                class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none"
              />
            </NuxtLink>
          </div>
          <div v-else class="divide-y divide-[#18181B]">
            <div 
              v-for="plan in floorPlans" 
              :key="plan.id"
              class="p-4 hover:bg-[#18181B]/50 transition-colors cursor-pointer"
              @click="navigateToFloorPlan(plan.id)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-[#18181B] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-white">{{ plan.name }}</div>
                    <div class="text-sm text-gray-400">{{ formatDate(plan.updated_at || plan.created_at) }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <Button 
                    icon="pi pi-pencil" 
                    text
                    size="small"
                    class="text-gray-400 hover:text-white"
                    @click.stop="navigateToFloorPlan(plan.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Правая колонка - Участники -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Участники -->
        <div class="bg-[#26272A] rounded-xl border border-[#26272A]">
          <div class="p-4 border-b border-[#18181B] flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white">Участники</h3>
            <Button 
              icon="pi pi-plus" 
              size="small"
              class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none"
              @click="showAddMemberDialog = true"
            />
          </div>
          <div v-if="loadingMembers" class="p-4">
            <div class="animate-pulse space-y-3">
              <div v-for="i in 3" :key="i" class="flex items-center gap-3">
                <div class="w-10 h-10 bg-[#18181B] rounded-full"></div>
                <div class="flex-1">
                  <div class="h-4 bg-[#18181B] rounded w-3/4 mb-1"></div>
                  <div class="h-3 bg-[#18181B] rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="members.length === 0" class="p-4 text-center">
            <p class="text-gray-400 text-sm">Нет участников</p>
          </div>
          <div v-else class="divide-y divide-[#18181B]">
            <div 
              v-for="member in members" 
              :key="member.id"
              class="p-4 flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-[#2563EB]/20 rounded-full flex items-center justify-center">
                  <span class="text-[#2563EB] font-medium">
                    {{ (member.name || member.email || '?').charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <div class="text-white font-medium">{{ member.name || 'Без имени' }}</div>
                  <div class="text-sm text-gray-400">{{ member.email }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span v-if="member.role === 'owner'" class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                  Владелец
                </span>
                <Button 
                  v-if="member.role !== 'owner'"
                  icon="pi pi-times" 
                  text
                  size="small"
                  class="text-gray-400 hover:text-red-400"
                  @click="confirmRemoveMember(member)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Информация -->
        <div class="bg-[#26272A] rounded-xl p-4 border border-[#26272A]">
          <h4 class="text-sm font-medium text-gray-400 mb-3">Информация</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-400">ID</span>
              <span class="text-white font-mono text-xs">{{ workspace.id?.slice(0, 8) }}...</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Создан</span>
              <span class="text-white">{{ formatDate(workspace.created_at) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">Обновлён</span>
              <span class="text-white">{{ formatDate(workspace.updated_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Диалог редактирования -->
    <Dialog 
      v-model:visible="showEditDialog" 
      modal 
      header="Редактировать воркспейс"
      :style="{ width: '450px' }"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-white mb-2">Название</label>
          <InputText 
            v-model="editForm.name" 
            placeholder="Название воркспейса"
            class="w-full bg-[#18181B] border-[#26272A] text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-2">Описание</label>
          <Textarea 
            v-model="editForm.description" 
            placeholder="Описание воркспейса"
            rows="3"
            class="w-full bg-[#18181B] border-[#26272A] text-white"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button label="Отмена" outlined class="border-[#26272A] text-white hover:bg-[#27272A]" @click="showEditDialog = false" />
          <Button label="Сохранить" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none" :loading="saving" @click="updateWorkspace" />
        </div>
      </template>
    </Dialog>

    <!-- Диалог добавления участника -->
    <Dialog 
      v-model:visible="showAddMemberDialog" 
      modal 
      header="Добавить участника"
      :style="{ width: '450px' }"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-white mb-2">Email участника</label>
          <InputText 
            v-model="newMemberEmail" 
            type="email"
            placeholder="email@example.com"
            class="w-full bg-[#18181B] border-[#26272A] text-white"
          />
        </div>
        <p class="text-sm text-gray-400">
          Участник получит приглашение на указанный email
        </p>
      </div>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button label="Отмена" outlined class="border-[#26272A] text-white hover:bg-[#27272A]" @click="showAddMemberDialog = false" />
          <Button label="Добавить" class="bg-[#2563EB] hover:bg-[#1d4ed8] border-none" :loading="addingMember" :disabled="!newMemberEmail" @click="addMember" />
        </div>
      </template>
    </Dialog>

    <!-- Диалог удаления участника -->
    <Dialog 
      v-model:visible="showRemoveMemberDialog" 
      modal 
      header="Удалить участника"
      :style="{ width: '400px' }"
    >
      <p class="text-white mb-4">Вы уверены, что хотите удалить участника "{{ memberToRemove?.name || memberToRemove?.email }}"?</p>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button label="Отмена" outlined class="border-[#26272A] text-white hover:bg-[#27272A]" @click="showRemoveMemberDialog = false" />
          <Button label="Удалить" severity="danger" class="border-none" :loading="removingMember" @click="removeMember" />
        </div>
      </template>
    </Dialog>

    <!-- Диалог удаления воркспейса -->
    <Dialog 
      v-model:visible="showDeleteDialog" 
      modal 
      header="Удаление воркспейса"
      :style="{ width: '400px' }"
    >
      <p class="text-white mb-4">Вы уверены, что хотите удалить воркспейс "{{ workspace?.name }}"?</p>
      <p class="text-gray-400 text-sm mb-6">Это действие нельзя отменить. Все данные воркспейса будут удалены.</p>
      <template #footer>
        <div class="flex gap-3 justify-end">
          <Button label="Отмена" outlined class="border-[#26272A] text-white hover:bg-[#27272A]" @click="showDeleteDialog = false" />
          <Button label="Удалить" severity="danger" class="border-none" :loading="deleting" @click="deleteWorkspace" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'panel'
})

import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCookie } from '#app'
import { api as useApiStore } from '@/store/api'

const route = useRoute()
const router = useRouter()
const apiStore = useApiStore()

const workspaceId = route.params.id
const accessToken = useCookie('access_token')
const workspaceIdCookie = useCookie('workspace_id', { maxAge: 60 * 60 * 24 * 365 })

// State
const workspace = ref(null)
const members = ref([])
const scenes = ref([])
const floorPlans = ref([])
const loading = ref(true)
const loadingMembers = ref(false)
const loadingScenes = ref(false)
const loadingFloorPlans = ref(false)
const error = ref(null)

// Dialogs
const showEditDialog = ref(false)
const showAddMemberDialog = ref(false)
const showRemoveMemberDialog = ref(false)
const showDeleteDialog = ref(false)

// Form state
const editForm = ref({ name: '', description: '' })
const newMemberEmail = ref('')
const memberToRemove = ref(null)

// Loading states
const saving = ref(false)
const addingMember = ref(false)
const removingMember = ref(false)
const deleting = ref(false)

// Computed
const isCurrentWorkspace = computed(() => workspaceIdCookie.value === workspaceId)

// Status helpers
const statusClasses = {
  draft: 'bg-gray-500/20 text-gray-400',
  active: 'bg-green-500/20 text-green-400',
  archived: 'bg-yellow-500/20 text-yellow-400'
}

const statusLabels = {
  draft: 'Черновик',
  active: 'Активна',
  archived: 'В архиве'
}

function getStatusClass(status) {
  return statusClasses[status] || 'bg-gray-500/20 text-gray-400'
}

function getStatusLabel(status) {
  return statusLabels[status] || status
}

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ru-RU', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })
}

// API calls
async function loadWorkspace() {
  loading.value = true
  error.value = null
  
  try {
    const result = await $fetch(`${apiStore.url}api/v1/workspaces/${workspaceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    workspace.value = result.data || result
    editForm.value = {
      name: workspace.value.name || '',
      description: workspace.value.description || ''
    }
    
    // Load members, scenes and floor plans in parallel
    await Promise.all([loadMembers(), loadScenes(), loadFloorPlans()])
  } catch (err) {
    error.value = err.message || 'Ошибка загрузки воркспейса'
  } finally {
    loading.value = false
  }
}

async function loadMembers() {
  loadingMembers.value = true
  try {
    const result = await $fetch(`${apiStore.url}api/v1/workspaces/${workspaceId}/members`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    members.value = result.data?.members || result.members || []
  } catch (err) {
    console.error('Ошибка загрузки участников:', err)
  } finally {
    loadingMembers.value = false
  }
}

async function loadScenes() {
  loadingScenes.value = true
  try {
    const result = await $fetch(`${apiStore.url}api/v1/workspaces/${workspaceId}/scenes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    scenes.value = result.data?.items || result.data?.scenes || result.data || result.scenes || []
    if (!Array.isArray(scenes.value)) scenes.value = []
  } catch (err) {
    console.error('Ошибка загрузки сцен:', err)
  } finally {
    loadingScenes.value = false
  }
}

async function loadFloorPlans() {
  loadingFloorPlans.value = true
  try {
    const result = await $fetch(`${apiStore.url}api/v1/floor-plans?workspace_id=${workspaceId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    // API возвращает { data: { items: [...], total: N } }
    floorPlans.value = result.data?.items || result.floor_plans || result.data || []
    if (!Array.isArray(floorPlans.value)) floorPlans.value = []
  } catch (err) {
    console.error('Ошибка загрузки планировок:', err)
  } finally {
    loadingFloorPlans.value = false
  }
}

function navigateToFloorPlan(id) {
  router.push(`/panel/plane/${id}`)
}

async function updateWorkspace() {
  saving.value = true
  try {
    const result = await $fetch(`${apiStore.url}api/v1/workspaces/${workspaceId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: {
        name: editForm.value.name.trim(),
        description: editForm.value.description.trim() || undefined
      }
    })
    
    workspace.value = result.data || result
    showEditDialog.value = false
  } catch (err) {
    console.error('Ошибка обновления:', err)
  } finally {
    saving.value = false
  }
}

async function deleteWorkspace() {
  deleting.value = true
  try {
    await $fetch(`${apiStore.url}api/v1/workspaces/${workspaceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    // Если удалённый воркспейс был активным - очищаем куки
    if (workspaceIdCookie.value === workspaceId) {
      workspaceIdCookie.value = null
    }
    
    router.push('/panel/workspaces')
  } catch (err) {
    console.error('Ошибка удаления:', err)
  } finally {
    deleting.value = false
  }
}

async function addMember() {
  if (!newMemberEmail.value) return
  
  addingMember.value = true
  try {
    await $fetch(`${apiStore.url}api/v1/workspaces/${workspaceId}/members`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: {
        email: newMemberEmail.value.trim()
      }
    })
    
    showAddMemberDialog.value = false
    newMemberEmail.value = ''
    await loadMembers()
  } catch (err) {
    console.error('Ошибка добавления участника:', err)
  } finally {
    addingMember.value = false
  }
}

function confirmRemoveMember(member) {
  memberToRemove.value = member
  showRemoveMemberDialog.value = true
}

async function removeMember() {
  if (!memberToRemove.value) return
  
  removingMember.value = true
  try {
    await $fetch(`${apiStore.url}api/v1/workspaces/${workspaceId}/members/${memberToRemove.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    members.value = members.value.filter(m => m.id !== memberToRemove.value.id)
    showRemoveMemberDialog.value = false
    memberToRemove.value = null
  } catch (err) {
    console.error('Ошибка удаления участника:', err)
  } finally {
    removingMember.value = false
  }
}

function selectWorkspace() {
  workspaceIdCookie.value = workspaceId
  router.push('/panel/plane/list')
}

onMounted(() => {
  loadWorkspace()
})
</script>

<style scoped>
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

