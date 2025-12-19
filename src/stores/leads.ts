import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Lead } from '@/types'
import { gasApi } from '@/services/api'

export const useLeadsStore = defineStore('leads', () => {
  // State
  const leads = ref<Lead[]>([])
  const loading = ref(false)
  const lastSyncTime = ref<number>(0)

  // Getters
  const totalLeads = computed(() => leads.value.length)
  const activeLeads = computed(() => leads.value.filter(lead => lead.status !== 'Closed'))
  const newLeadsThisWeek = computed(() => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return leads.value.filter(lead => new Date(lead.createdAt) > weekAgo)
  })

  const getLeadById = computed(() => (id: string) => {
    return leads.value.find(lead => lead.id === id)
  })

  // Actions
  async function fetchLeads() {
    loading.value = true
    try {
      const response = await gasApi.syncData(lastSyncTime.value)
      if (response.success && response.data) {
        leads.value = response.data.leads || []
        lastSyncTime.value = Date.now()
      }
      return { success: response.success, error: response.error }
    } catch (error) {
      console.error('Fetch leads error:', error)
      return { success: false, error: 'Failed to fetch leads' }
    } finally {
      loading.value = false
    }
  }

  async function createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    try {
      const response = await gasApi.execute('createLead', leadData)
      if (response.success && response.data) {
        leads.value.push(response.data)
        return { success: true, data: response.data }
      }
      return { success: false, error: response.error || 'Failed to create lead' }
    } catch (error) {
      console.error('Create lead error:', error)
      return { success: false, error: 'Failed to create lead' }
    } finally {
      loading.value = false
    }
  }

  async function updateLead(id: string, updates: Partial<Lead>) {
    loading.value = true
    try {
      const response = await gasApi.execute('updateLead', { id, ...updates })
      if (response.success && response.data) {
        const index = leads.value.findIndex(lead => lead.id === id)
        if (index !== -1) {
          leads.value[index] = { ...leads.value[index], ...response.data }
        }
        return { success: true, data: response.data }
      }
      return { success: false, error: response.error || 'Failed to update lead' }
    } catch (error) {
      console.error('Update lead error:', error)
      return { success: false, error: 'Failed to update lead' }
    } finally {
      loading.value = false
    }
  }

  async function deleteLead(id: string) {
    loading.value = true
    try {
      const response = await gasApi.execute('deleteLead', { id })
      if (response.success) {
        const index = leads.value.findIndex(lead => lead.id === id)
        if (index !== -1) {
          leads.value.splice(index, 1)
        }
        return { success: true }
      }
      return { success: false, error: response.error || 'Failed to delete lead' }
    } catch (error) {
      console.error('Delete lead error:', error)
      return { success: false, error: 'Failed to delete lead' }
    } finally {
      loading.value = false
    }
  }

  function addLead(lead: Lead) {
    leads.value.push(lead)
  }

  function removeLead(id: string) {
    const index = leads.value.findIndex(lead => lead.id === id)
    if (index !== -1) {
      leads.value.splice(index, 1)
    }
  }

  function clearLeads() {
    leads.value = []
    lastSyncTime.value = 0
  }

  return {
    // State
    leads,
    loading,
    lastSyncTime,
    
    // Getters
    totalLeads,
    activeLeads,
    newLeadsThisWeek,
    getLeadById,
    
    // Actions
    fetchLeads,
    createLead,
    updateLead,
    deleteLead,
    addLead,
    removeLead,
    clearLeads
  }
})