<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Title -->
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-3">
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h24v20c0 0-2-3-4-3s-2 3-4 3-2-3-4-3-2 3-4 3-2-3-4-3-2 3-4 3V4z" fill="#FFD700"/>
                <circle cx="10" cy="12" r="2.5" fill="#000"/>
                <circle cx="22" cy="12" r="2.5" fill="#000"/>
                <circle cx="10" cy="11" r="1" fill="#fff"/>
                <circle cx="22" cy="11" r="1" fill="#fff"/>
              </svg>
              <h1 class="text-xl font-bold text-gray-900">LeadFlow India</h1>
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center gap-4">
            <div class="text-sm text-gray-600">
              Welcome, {{ authStore.user?.name || 'User' }}
            </div>
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Leads</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.totalLeads }}</p>
            </div>
            <div class="p-3 bg-blue-50 rounded-xl">
              <i class="ph-bold ph-users text-2xl text-blue-600"></i>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Active Tasks</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.activeTasks }}</p>
            </div>
            <div class="p-3 bg-green-50 rounded-xl">
              <i class="ph-bold ph-check-circle text-2xl text-green-600"></i>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">New This Week</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.newThisWeek }}</p>
            </div>
            <div class="p-3 bg-yellow-50 rounded-xl">
              <i class="ph-bold ph-trend-up text-2xl text-yellow-600"></i>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.conversionRate }}%</p>
            </div>
            <div class="p-3 bg-purple-50 rounded-xl">
              <i class="ph-bold ph-chart-line text-2xl text-purple-600"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-2 gap-4">
            <router-link
              to="/leads"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div class="flex flex-col items-center text-center">
                <i class="ph-bold ph-user-plus text-2xl text-primary group-hover:text-primary/80 mb-2"></i>
                <span class="text-sm font-medium text-gray-900">Manage Leads</span>
              </div>
            </router-link>

            <router-link
              to="/tasks"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div class="flex flex-col items-center text-center">
                <i class="ph-bold ph-list text-2xl text-primary group-hover:text-primary/80 mb-2"></i>
                <span class="text-sm font-medium text-gray-900">View Tasks</span>
              </div>
            </router-link>

            <router-link
              to="/activities"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div class="flex flex-col items-center text-center">
                <i class="ph-bold ph-activity text-2xl text-primary group-hover:text-primary/80 mb-2"></i>
                <span class="text-sm font-medium text-gray-900">Activities</span>
              </div>
            </router-link>

            <router-link
              to="/reports"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div class="flex flex-col items-center text-center">
                <i class="ph-bold ph-chart-bar text-2xl text-primary group-hover:text-primary/80 mb-2"></i>
                <span class="text-sm font-medium text-gray-900">Reports</span>
              </div>
            </router-link>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div class="space-y-4">
            <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start gap-3">
              <div class="p-2 bg-blue-50 rounded-lg">
                <i class="ph-bold ph-bell text-sm text-blue-600"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900">{{ activity.description }}</p>
                <p class="text-xs text-gray-500">{{ activity.timeAgo }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Mock data - replace with real data from your stores
const stats = ref({
  totalLeads: 245,
  activeTasks: 18,
  newThisWeek: 32,
  conversionRate: 12.5
})

const recentActivities = ref([
  {
    id: 1,
    description: 'New lead assigned: John Doe',
    timeAgo: '2 minutes ago'
  },
  {
    id: 2,
    description: 'Task completed: Follow up with Sarah',
    timeAgo: '1 hour ago'
  },
  {
    id: 3,
    description: 'Lead status updated to "Qualified"',
    timeAgo: '3 hours ago'
  }
])

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  // Load dashboard data
  console.log('Dashboard mounted')
})
</script>