// Core data types based on Google Sheets structure
export interface Lead {
  id: string
  name: string
  phone: string
  email: string
  location: string
  interest: string
  source: string
  status: string
  assignedTo: string
  createdAt: string
  updatedAt: string
  notes?: string
}

export interface Activity {
  id: string
  leadId: string
  type: string
  description: string
  assignedTo: string
  createdAt: string
  updatedAt: string
  status: string
}

export interface Task {
  id: string
  leadId: string
  title: string
  description: string
  assignedTo: string
  dueDate: string
  status: string
  priority: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

export interface Log {
  id: string
  action: string
  details: string
  userId: string
  timestamp: string
}

export interface Interest {
  id: string
  name: string
  description?: string
}

export interface AppSettings {
  locations: string[]
  sources: string[]
  taskTitles: string[]
  scriptUrl: string
  appTitle: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface SyncData {
  leads: Lead[]
  activities: Activity[]
  tasks: Task[]
  users: User[]
  logs: Log[]
  interests: Interest[]
  settings: AppSettings
}

// Auth types
export interface AuthUser {
  id: string
  name: string
  email: string
  picture?: string
  role: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  token: string | null
}

// Chart data types
export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }[]
}

// UI State types
export interface UIState {
  loading: boolean
  sidebarOpen: boolean
  activeModal: string | null
  notifications: Notification[]
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}