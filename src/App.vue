<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation will be added here -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize the app
  console.log('LeadFlow India LMS - Vue.js App Initialized')
  // Check for existing authentication
  authStore.checkAuth()
})
</script>

<style scoped>
/* App-specific styles will be added here */
</style>