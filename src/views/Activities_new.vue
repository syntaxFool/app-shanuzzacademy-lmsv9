<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Activities</h1>
          <router-link to="/dashboard" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Back to Dashboard
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Activity Feed -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Recent Activities</h3>
        </div>
        <div class="divide-y divide-gray-200">
          <div class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-lg">📝</span>
              </div>
              <div class="flex-1">
                <p class="text-gray-900 font-medium">No activities yet</p>
                <p class="text-gray-600 text-sm mt-1">Activities will appear here once you start working</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600 text-sm">Today's Activities</p>
          <p class="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600 text-sm">This Week</p>
          <p class="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600 text-sm">This Month</p>
          <p class="text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Activities logic here
</script>
