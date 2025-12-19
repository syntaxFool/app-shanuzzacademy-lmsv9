<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-6">
    <div class="bg-white w-full max-w-sm rounded-2xl p-8 shadow-2xl">
      <div class="text-center mb-8">
        <div class="inline-flex bg-primary/10 p-4 rounded-xl mb-4">
          <svg width="48" height="48" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4h24v20c0 0-2-3-4-3s-2 3-4 3-2-3-4-3-2 3-4 3-2-3-4-3-2 3-4 3V4z" fill="#FFD700"/>
            <circle cx="10" cy="12" r="2.5" fill="#000"/>
            <circle cx="22" cy="12" r="2.5" fill="#000"/>
            <circle cx="10" cy="11" r="1" fill="#fff"/>
            <circle cx="22" cy="11" r="1" fill="#fff"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-slate-900 mb-2">LeadFlow India</h1>
        <p class="text-slate-600">Sign in to access your dashboard</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="uid" class="block text-sm font-medium text-slate-700 mb-2">
            User ID
          </label>
          <input
            id="uid"
            v-model="credentials.uid"
            type="text"
            required
            class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="your_user_id"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            required
            class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <template v-if="loading">
            <div class="flex items-center justify-center gap-2">
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Signing In...
            </div>
          </template>
          <template v-else>
            Sign In
          </template>
        </button>
      </form>

      <div class="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
        <p class="font-bold text-blue-900 mb-1">Superuser Credentials:</p>
        <p class="text-blue-800">UID: <code>nox1</code></p>
        <p class="text-blue-800">Password: <code>1233</code></p>
      </div>

      <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
        <div class="flex items-center gap-2">
          <i class="ph-bold ph-warning-circle text-red-500"></i>
          <span class="text-red-700 text-sm">{{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')

const credentials = reactive({
  uid: '',
  password: ''
})

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    const result = await authStore.login(credentials)
    if (result.success) {
      router.push('/')
    } else {
      error.value = result.error || 'Login failed'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Login error:', err)
  } finally {
    loading.value = false
  }
}


</script>