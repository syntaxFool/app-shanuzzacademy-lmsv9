import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types'

// Configuration for the API client
const isDev = import.meta.env.DEV
const API_CONFIG = {
  // Use Netlify Function proxy in dev, direct GAS URL in production
  baseURL: isDev 
    ? '/.netlify/functions/proxy'
    : (import.meta.env.VITE_API_BASE_URL as string) || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
}

// Create the main API client
export const apiClient: AxiosInstance = axios.create(API_CONFIG)

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = localStorage.getItem('lms_auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add timestamp for cache busting
    if (config.params) {
      config.params._t = Date.now()
    } else {
      config.params = { _t: Date.now() }
    }
    
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data || config.params)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('API Response Error:', error)
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('lms_auth_token')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      // Forbidden - show error message
      console.error('Access forbidden')
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error')
    }
    
    return Promise.reject(error)
  }
)

// Helper functions for different HTTP methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => 
    apiClient.get(url, config).then(response => response.data),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => 
    apiClient.post(url, data, config).then(response => response.data),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => 
    apiClient.put(url, data, config).then(response => response.data),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => 
    apiClient.delete(url, config).then(response => response.data),
}

// Google Apps Script specific API helpers
export const gasApi = {
  // Execute a specific function in Google Apps Script
  execute: async (functionName: string, parameters: any = {}): Promise<ApiResponse> => {
    try {
      const response = await apiClient.post('', {
        function: functionName,
        parameters: Array.isArray(parameters) ? parameters : [parameters]
      })
      
      return response.data
    } catch (error) {
      console.error('GAS API Execute Error:', error)
      return {
        success: false,
        error: 'Failed to execute Google Apps Script function'
      }
    }
  },

  // Sync data with Google Sheets
  syncData: async (lastSyncTime?: number): Promise<ApiResponse> => {
    try {
      const params = lastSyncTime ? { lastSyncTime } : {}
      const response = await apiClient.get('', { params })
      
      return response.data
    } catch (error) {
      console.error('GAS API Sync Error:', error)
      return {
        success: false,
        error: 'Failed to sync data with Google Sheets'
      }
    }
  }
}

export default apiClient