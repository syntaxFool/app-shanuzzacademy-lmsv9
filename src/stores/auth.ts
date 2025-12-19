import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AuthUser, AuthState } from '@/types'
import { authService } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(localStorage.getItem('lms_auth_token'))
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || 'guest')

  // Actions
  async function login(credentials: { uid: string; password: string }) {
    loading.value = true
    try {
      const response = await authService.login(credentials)
      if (response.success && response.data) {
        user.value = response.data.user
        token.value = response.data.token
        localStorage.setItem('lms_auth_token', token.value)
        return { success: true }
      }
      return { success: false, error: response.error || 'Login failed' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    } finally {
      loading.value = false
    }
  }

  // Google login removed: Only custom authentication is supported

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('lms_auth_token')
    // Redirect to login will be handled by router guard
  }

  async function checkAuth() {
    const savedToken = localStorage.getItem('lms_auth_token')
    if (savedToken) {
      token.value = savedToken
      try {
        const response = await authService.validateToken(savedToken)
        if (response.success && response.data) {
          user.value = response.data
        } else {
          // Token is invalid, clear it
          logout()
        }
      } catch (error) {
        console.error('Token validation error:', error)
        logout()
      }
    }
  }

  async function updateProfile(profileData: Partial<AuthUser>) {
    loading.value = true
    try {
      const response = await authService.updateProfile(profileData)
      if (response.success && response.data) {
        user.value = { ...user.value!, ...response.data }
        return { success: true }
      }
      return { success: false, error: response.error || 'Profile update failed' }
    } catch (error) {
      console.error('Profile update error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    } finally {
      loading.value = false
    }
  }

  // Export state
  const state = computed<AuthState>(() => ({
    user: user.value,
    isAuthenticated: isAuthenticated.value,
    token: token.value
  }))

  return {
    // State
    user,
    token,
    loading,
    state,
    
    // Getters
    isAuthenticated,
    userRole,
    
    // Actions
    login,
    logout,
    checkAuth,
    updateProfile
  }
})