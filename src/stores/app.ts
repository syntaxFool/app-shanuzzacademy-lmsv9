import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppSettings, UIState, Notification } from '@/types'

export const useAppStore = defineStore('app', () => {
  // State
  const settings = ref<AppSettings>({
    locations: [],
    sources: [],
    taskTitles: [],
    scriptUrl: '',
    appTitle: 'LeadFlow India'
  })

  const ui = ref<UIState>({
    loading: false,
    sidebarOpen: false,
    activeModal: null,
    notifications: []
  })

  const syncStatus = ref({
    isOnline: navigator.onLine,
    lastSync: null as Date | null,
    syncInProgress: false,
    hasUnsyncedChanges: false
  })

  // Getters
  const isLoading = computed(() => ui.value.loading)
  const hasNotifications = computed(() => ui.value.notifications.length > 0)
  const latestNotification = computed(() => ui.value.notifications[0] || null)

  // Actions
  function setLoading(loading: boolean) {
    ui.value.loading = loading
  }

  function toggleSidebar() {
    ui.value.sidebarOpen = !ui.value.sidebarOpen
  }

  function setSidebar(open: boolean) {
    ui.value.sidebarOpen = open
  }

  function showModal(modalId: string) {
    ui.value.activeModal = modalId
  }

  function hideModal() {
    ui.value.activeModal = null
  }

  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = Date.now().toString()
    const newNotification: Notification = {
      id,
      duration: 5000, // Default 5 seconds
      ...notification
    }

    ui.value.notifications.unshift(newNotification)

    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
  }

  function removeNotification(id: string) {
    const index = ui.value.notifications.findIndex(n => n.id === id)
    if (index !== -1) {
      ui.value.notifications.splice(index, 1)
    }
  }

  function clearNotifications() {
    ui.value.notifications = []
  }

  function updateSettings(newSettings: Partial<AppSettings>) {
    settings.value = { ...settings.value, ...newSettings }
  }

  function setSyncStatus(status: Partial<typeof syncStatus.value>) {
    syncStatus.value = { ...syncStatus.value, ...status }
  }

  // Online/offline detection
  function handleOnlineStatus() {
    syncStatus.value.isOnline = navigator.onLine
    
    if (navigator.onLine) {
      addNotification({
        type: 'success',
        title: 'Back Online',
        message: 'Connection restored. Syncing data...'
      })
    } else {
      addNotification({
        type: 'warning',
        title: 'Offline',
        message: 'Working offline. Changes will sync when connection is restored.',
        duration: 0 // Persistent notification
      })
    }
  }

  // Initialize online/offline listeners
  function initializeApp() {
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)
    
    // Set initial online status
    syncStatus.value.isOnline = navigator.onLine
  }

  function destroy() {
    window.removeEventListener('online', handleOnlineStatus)
    window.removeEventListener('offline', handleOnlineStatus)
  }

  return {
    // State
    settings,
    ui,
    syncStatus,
    
    // Getters
    isLoading,
    hasNotifications,
    latestNotification,
    
    // Actions
    setLoading,
    toggleSidebar,
    setSidebar,
    showModal,
    hideModal,
    addNotification,
    removeNotification,
    clearNotifications,
    updateSettings,
    setSyncStatus,
    initializeApp,
    destroy
  }
})