<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <router-link to="/dashboard" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Back to Dashboard
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Report Filters -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Generate Report</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Report Type</label>
            <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
              <option>Sales Report</option>
              <option>Lead Report</option>
              <option>Activity Report</option>
            </select>
          </div>
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Date Range</label>
            <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div class="flex items-end">
            <button class="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600 text-sm">Total Revenue</p>
          <p class="text-3xl font-bold text-gray-900">$0</p>
          <p class="text-green-600 text-sm mt-2">+0% from last month</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600 text-sm">Total Conversions</p>
          <p class="text-3xl font-bold text-gray-900">0</p>
          <p class="text-green-600 text-sm mt-2">+0% from last month</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600 text-sm">Avg Deal Size</p>
          <p class="text-3xl font-bold text-gray-900">$0</p>
          <p class="text-gray-600 text-sm mt-2">Same as last month</p>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <p class="text-gray-600 text-sm">Conversion Rate</p>
          <p class="text-3xl font-bold text-gray-900">0%</p>
          <p class="text-gray-600 text-sm mt-2">--</p>
        </div>
      </div>

      <!-- Charts Placeholder -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded border border-gray-200">
            <p class="text-gray-600">Chart data will appear here</p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Lead Source</h3>
          <div class="h-64 flex items-center justify-center bg-gray-50 rounded border border-gray-200">
            <p class="text-gray-600">Chart data will appear here</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Reports logic here
</script>
