import type { ApiResponse, AuthUser } from '@/types'
import { gasApi } from './api'

interface LoginCredentials {
  uid: string
  password: string
}

interface LoginResponse {
  user: AuthUser
  token: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    try {
      // Use Google Apps Script for authentication
      const response = await gasApi.execute('authenticateUser', credentials)
      
      if (response.success && response.data) {
        // Store token and user info
        localStorage.setItem('lms_auth_token', response.data.token)
        localStorage.setItem('lms_user', JSON.stringify(response.data.user))
        
        return response
      }
      
      return {
        success: false,
        error: response.error || 'Authentication failed'
      }
    } catch (error) {
      console.error('Auth service login error:', error)
      return {
        success: false,
        error: 'Authentication failed'
      }
    }
  },

  async validateToken(token: string): Promise<ApiResponse<AuthUser>> {
    try {
      const response = await gasApi.execute('validateToken', { token })
      return response
    } catch (error) {
      console.error('Auth service token validation error:', error)
      return {
        success: false,
        error: 'Token validation failed'
      }
    }
  },

  async updateProfile(profileData: Partial<AuthUser>): Promise<ApiResponse<AuthUser>> {
    try {
      const response = await gasApi.execute('updateUserProfile', profileData)
      return response
    } catch (error) {
      console.error('Auth service profile update error:', error)
      return {
        success: false,
        error: 'Profile update failed'
      }
    }
  },

  async logout(): Promise<ApiResponse<void>> {
    try {
      // Perform logout on server side
      const response = await gasApi.execute('logoutUser')
      
      // Clear local storage
      localStorage.removeItem('lms_auth_token')
      localStorage.removeItem('lms_user')
      
      return response
    } catch (error) {
      console.error('Auth service logout error:', error)
      return {
        success: false,
        error: 'Logout failed'
      }
    }
  }
}