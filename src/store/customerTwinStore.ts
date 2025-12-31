import { create } from 'zustand'

export interface VectorData {
  value: number
  max: number
  label: string
  color: string
}

export interface Vectors {
  pricing: VectorData
  churn: VectorData
  onboarding: VectorData
  features: VectorData
  support: VectorData
  satisfaction: VectorData
}

export type VectorKey = keyof Vectors

export interface QuestionData {
  question: string
  boosts: Partial<Record<VectorKey, number>>
  sources: string[]
  answer?: string
}

export interface RecentGain {
  key: VectorKey
  gain: number
  label: string
  color: string
}

export interface DataSource {
  id: string
  name: string
  type: 'crm' | 'support' | 'analytics' | 'documents' | 'code'
  connected: boolean
  lastSync?: string
  icon: string
}

export interface AutomationLog {
  id: string
  customer: string
  company: string
  action: string
  timestamp: string
  agent: string
}

interface CustomerTwinState {
  vectors: Vectors
  questionHistory: string[]
  recentGains: RecentGain[]
  activeQuestion: QuestionData | null
  isProcessing: boolean
  dataSources: DataSource[]
  automationLogs: AutomationLog[]

  // Actions
  askQuestion: (questionData: QuestionData) => Promise<void>
  resetTwin: () => void
  toggleDataSource: (id: string) => void
}

const initialVectors: Vectors = {
  pricing: { value: 15, max: 100, label: 'Pricing Decisions', color: '#F59E0B' },
  churn: { value: 10, max: 100, label: 'Churn Signals', color: '#EF4444' },
  onboarding: { value: 20, max: 100, label: 'Onboarding Journey', color: '#10B981' },
  features: { value: 12, max: 100, label: 'Feature Adoption', color: '#8B5CF6' },
  support: { value: 8, max: 100, label: 'Support Patterns', color: '#3B82F6' },
  satisfaction: { value: 18, max: 100, label: 'Satisfaction Drivers', color: '#EC4899' },
}

const initialDataSources: DataSource[] = [
  { id: '1', name: 'Salesforce', type: 'crm', connected: true, lastSync: '2 hours ago', icon: '☁️' },
  { id: '2', name: 'Zendesk', type: 'support', connected: true, lastSync: '30 mins ago', icon: '🎫' },
  { id: '3', name: 'Mixpanel', type: 'analytics', connected: true, lastSync: '1 hour ago', icon: '📊' },
  { id: '4', name: 'Confluence', type: 'documents', connected: true, lastSync: '1 day ago', icon: '📄' },
  { id: '5', name: 'GitHub', type: 'code', connected: false, icon: '💻' },
  { id: '6', name: 'Intercom', type: 'support', connected: false, icon: '💬' },
]

const initialAutomationLogs: AutomationLog[] = [
  { id: '1', customer: 'Sarah Chen', company: 'Acme Corp', action: 'Sent personalized retention offer', timestamp: '2 mins ago', agent: 'Churn Prevention' },
  { id: '2', customer: 'Mike Johnson', company: 'TechStart', action: 'Adjusted pricing proposal based on usage patterns', timestamp: '15 mins ago', agent: 'Pricing Optimization' },
  { id: '3', customer: 'Emily Davis', company: 'DataFlow Inc', action: 'Personalized onboarding sequence activated', timestamp: '1 hour ago', agent: 'Onboarding' },
  { id: '4', customer: 'James Wilson', company: 'CloudBase', action: 'Proactive support ticket created for potential issue', timestamp: '2 hours ago', agent: 'Churn Prevention' },
  { id: '5', customer: 'Lisa Park', company: 'Innovate AI', action: 'Feature recommendation sent based on usage', timestamp: '3 hours ago', agent: 'Feature Adoption' },
]

export const useCustomerTwinStore = create<CustomerTwinState>((set, get) => ({
  vectors: initialVectors,
  questionHistory: [],
  recentGains: [],
  activeQuestion: null,
  isProcessing: false,
  dataSources: initialDataSources,
  automationLogs: initialAutomationLogs,

  askQuestion: async (questionData: QuestionData) => {
    set({ activeQuestion: questionData, isProcessing: true })

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const { vectors } = get()
    const gains: RecentGain[] = []
    const newVectors = { ...vectors }

    Object.entries(questionData.boosts).forEach(([key, boost]) => {
      const vectorKey = key as VectorKey
      if (boost && newVectors[vectorKey]) {
        const newValue = Math.min(newVectors[vectorKey].value + boost, newVectors[vectorKey].max)
        const actualGain = newValue - newVectors[vectorKey].value
        if (actualGain > 0) {
          gains.push({
            key: vectorKey,
            gain: actualGain,
            label: newVectors[vectorKey].label,
            color: newVectors[vectorKey].color
          })
          newVectors[vectorKey] = { ...newVectors[vectorKey], value: newValue }
        }
      }
    })

    set(state => ({
      vectors: newVectors,
      recentGains: gains,
      questionHistory: [questionData.question, ...state.questionHistory].slice(0, 10),
      isProcessing: false
    }))
  },

  resetTwin: () => {
    set({
      vectors: initialVectors,
      recentGains: [],
      activeQuestion: null,
      questionHistory: []
    })
  },

  toggleDataSource: (id: string) => {
    set(state => ({
      dataSources: state.dataSources.map(ds =>
        ds.id === id ? { ...ds, connected: !ds.connected, lastSync: ds.connected ? undefined : 'Just now' } : ds
      )
    }))
  }
}))
