<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Tasks</h1>
          <router-link to="/dashboard" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Back to Dashboard
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Add Task Button -->
      <div class="mb-6">
        <button class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
          + Create New Task
        </button>
      </div>

      <!-- Task Tabs -->
      <div class="mb-6 flex gap-4 border-b border-gray-200">
        <button class="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium">
          Active Tasks
        </button>
        <button class="px-4 py-2 text-gray-600 hover:text-gray-900">
          Completed
        </button>
        <button class="px-4 py-2 text-gray-600 hover:text-gray-900">
          Overdue
        </button>
      </div>

      <!-- Tasks List -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="divide-y divide-gray-200">
          <div class="px-6 py-8 text-center text-gray-600">
            <p class="text-lg">No tasks yet</p>
            <p class="text-sm mt-1">Create your first task to get started</p>
          </div>
        </div>
      </div>

      <!-- Task Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600 text-sm">Total Tasks</p>
          <p class="text-3xl font-bold text-gray-900">0</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600 text-sm">Active</p>
          <p class="text-3xl font-bold text-blue-600">0</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600 text-sm">Completed</p>
          <p class="text-3xl font-bold text-green-600">0</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600 text-sm">Overdue</p>
          <p class="text-3xl font-bold text-red-600">0</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Tasks logic here
</script>
