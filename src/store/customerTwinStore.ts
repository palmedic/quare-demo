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
}

export interface KnowledgeSource {
  id: string
  name: string
  type: 'wiki' | 'docs' | 'notes'
  documents: number
  connected: boolean
  lastUpdate?: string
}

export interface CodeRepo {
  id: string
  name: string
  rulesExtracted: number
  connected: boolean
  lastScan?: string
}

export interface AutomationLog {
  id: string
  customer: string
  company: string
  action: string
  timestamp: string
  agent: string
}

// New: Question history entry with radar snapshot
export interface QuestionHistoryEntry {
  id: string
  question: string
  answer: string
  sources: string[]
  boosts: Partial<Record<VectorKey, number>>
  vectorsBeforeQuestion: Vectors
  vectorsAfterQuestion: Vectors
  timestamp: string
  plan: QuestionPlan
}

// New: Detailed plan for answering a question
export interface QuestionPlan {
  dataSources: PlanStep[]
  knowledgeSources: PlanStep[]
  smeInterviews: PlanStep[]
  codeExtraction: PlanStep[]
}

export interface PlanStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'needs_input'
  source?: string
  actionRequired?: string
}

interface CustomerTwinState {
  vectors: Vectors
  questionHistory: QuestionHistoryEntry[]
  recentGains: RecentGain[]
  activeQuestion: QuestionData | null
  isProcessing: boolean
  currentPlan: QuestionPlan | null
  selectedHistoryId: string | null
  dataSources: DataSource[]
  knowledgeSources: KnowledgeSource[]
  codeRepos: CodeRepo[]
  automationLogs: AutomationLog[]

  // Actions
  askQuestion: (questionData: QuestionData) => Promise<void>
  resetTwin: () => void
  toggleDataSource: (id: string) => void
  toggleKnowledgeSource: (id: string) => void
  toggleCodeRepo: (id: string) => void
  selectHistoryEntry: (id: string | null) => void
  getVectorsForHistoryEntry: (id: string | null) => Vectors
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
  { id: '1', name: 'Salesforce', type: 'crm', connected: true, lastSync: '2 hours ago' },
  { id: '2', name: 'Zendesk', type: 'support', connected: true, lastSync: '30 mins ago' },
  { id: '3', name: 'Mixpanel', type: 'analytics', connected: true, lastSync: '1 hour ago' },
  { id: '4', name: 'HubSpot', type: 'crm', connected: false },
  { id: '5', name: 'Intercom', type: 'support', connected: false },
]

const initialKnowledgeSources: KnowledgeSource[] = [
  { id: '1', name: 'Confluence', type: 'wiki', documents: 234, connected: true, lastUpdate: '1 day ago' },
  { id: '2', name: 'Google Drive', type: 'docs', documents: 89, connected: true, lastUpdate: '3 hours ago' },
  { id: '3', name: 'Notion', type: 'notes', documents: 0, connected: false },
]

const initialCodeRepos: CodeRepo[] = [
  { id: '1', name: 'pricing-engine', rulesExtracted: 47, connected: true, lastScan: '2 hours ago' },
  { id: '2', name: 'subscription-service', rulesExtracted: 23, connected: true, lastScan: '1 day ago' },
  { id: '3', name: 'onboarding-flow', rulesExtracted: 31, connected: true, lastScan: '6 hours ago' },
  { id: '4', name: 'billing-api', rulesExtracted: 0, connected: false },
]

const initialAutomationLogs: AutomationLog[] = [
  { id: '1', customer: 'Sarah Chen', company: 'Acme Corp', action: 'Sent personalized retention offer', timestamp: '2 mins ago', agent: 'Churn Prevention' },
  { id: '2', customer: 'Mike Johnson', company: 'TechStart', action: 'Adjusted pricing proposal based on usage patterns', timestamp: '15 mins ago', agent: 'Pricing Optimization' },
  { id: '3', customer: 'Emily Davis', company: 'DataFlow Inc', action: 'Personalized onboarding sequence activated', timestamp: '1 hour ago', agent: 'Onboarding' },
  { id: '4', customer: 'James Wilson', company: 'CloudBase', action: 'Proactive support ticket created for potential issue', timestamp: '2 hours ago', agent: 'Churn Prevention' },
  { id: '5', customer: 'Lisa Park', company: 'Innovate AI', action: 'Feature recommendation sent based on usage', timestamp: '3 hours ago', agent: 'Feature Adoption' },
]

// Helper to generate a plan based on the question
function generatePlan(question: string, boosts: Partial<Record<VectorKey, number>>): QuestionPlan {
  const plan: QuestionPlan = {
    dataSources: [],
    knowledgeSources: [],
    smeInterviews: [],
    codeExtraction: []
  }

  // Generate relevant plan steps based on which dimensions are boosted
  // Some steps will show as "needs_input" to demonstrate that building a Customer Twin
  // requires collaboration between Quare and the organization

  if (boosts.pricing) {
    plan.dataSources.push({
      id: 'ds1',
      title: 'Query CRM deal history',
      description: 'Fetch pricing negotiations and discount patterns from Salesforce',
      status: 'completed',
      source: 'Salesforce'
    })
    plan.dataSources.push({
      id: 'ds1b',
      title: 'Import competitor pricing data',
      description: 'No competitor analysis data source connected',
      status: 'needs_input',
      actionRequired: 'Connect competitor intelligence tool or upload pricing research'
    })
    plan.codeExtraction.push({
      id: 'ce1',
      title: 'Extract pricing rules',
      description: 'Analyze pricing-engine repo for discount logic and tier definitions',
      status: 'completed',
      source: 'pricing-engine'
    })
    plan.smeInterviews.push({
      id: 'sme1',
      title: 'Interview Sales Director',
      description: 'Ask John Smith about common pricing objections and win/loss patterns',
      status: 'completed',
      source: 'John Smith, Sales Director'
    })
    plan.smeInterviews.push({
      id: 'sme1b',
      title: 'Interview Finance Lead',
      description: 'Need input on margin requirements and discount approval thresholds',
      status: 'needs_input',
      actionRequired: 'Schedule interview with CFO or Finance Director'
    })
  }

  if (boosts.churn) {
    plan.dataSources.push({
      id: 'ds2',
      title: 'Analyze support ticket patterns',
      description: 'Query Zendesk for escalation trends and unresolved issues',
      status: 'completed',
      source: 'Zendesk'
    })
    plan.dataSources.push({
      id: 'ds2b',
      title: 'Fetch product usage decline data',
      description: 'HubSpot integration not connected - missing engagement signals',
      status: 'needs_input',
      actionRequired: 'Connect HubSpot or upload usage decline reports'
    })
    plan.knowledgeSources.push({
      id: 'ks1',
      title: 'Review churn analysis docs',
      description: 'Fetch customer health documentation from Confluence',
      status: 'completed',
      source: 'Confluence'
    })
    plan.smeInterviews.push({
      id: 'sme2',
      title: 'Consult CS Lead',
      description: 'Interview Maria Garcia about at-risk customer indicators',
      status: 'completed',
      source: 'Maria Garcia, CS Lead'
    })
  }

  if (boosts.onboarding) {
    plan.dataSources.push({
      id: 'ds3',
      title: 'Fetch onboarding metrics',
      description: 'Get activation funnel data and drop-off points from Mixpanel',
      status: 'completed',
      source: 'Mixpanel'
    })
    plan.codeExtraction.push({
      id: 'ce2',
      title: 'Map onboarding flow',
      description: 'Extract step definitions and validation rules from onboarding-flow repo',
      status: 'completed',
      source: 'onboarding-flow'
    })
    plan.knowledgeSources.push({
      id: 'ks2',
      title: 'Review onboarding playbook',
      description: 'Fetch best practices documentation from Google Drive',
      status: 'completed',
      source: 'Google Drive'
    })
    plan.knowledgeSources.push({
      id: 'ks2b',
      title: 'Import customer success stories',
      description: 'Missing documentation on successful onboarding patterns',
      status: 'needs_input',
      actionRequired: 'Upload case studies or connect to customer testimonials'
    })
  }

  if (boosts.features) {
    plan.dataSources.push({
      id: 'ds4',
      title: 'Query feature usage data',
      description: 'Analyze feature adoption metrics and power user patterns from Mixpanel',
      status: 'completed',
      source: 'Mixpanel'
    })
    plan.smeInterviews.push({
      id: 'sme3',
      title: 'Interview Product Manager',
      description: 'Ask David Lee about feature prioritization and user feedback themes',
      status: 'completed',
      source: 'David Lee, Product Manager'
    })
    plan.codeExtraction.push({
      id: 'ce3',
      title: 'Extract feature flag configurations',
      description: 'billing-api repo not connected - missing feature entitlement rules',
      status: 'needs_input',
      actionRequired: 'Connect billing-api repository in Settings'
    })
  }

  if (boosts.support) {
    plan.dataSources.push({
      id: 'ds5',
      title: 'Analyze support patterns',
      description: 'Query ticket categories, resolution times, and escalation paths from Zendesk',
      status: 'completed',
      source: 'Zendesk'
    })
    plan.dataSources.push({
      id: 'ds5b',
      title: 'Import chat transcript analysis',
      description: 'Intercom not connected - missing real-time support insights',
      status: 'needs_input',
      actionRequired: 'Connect Intercom integration in Settings'
    })
    plan.knowledgeSources.push({
      id: 'ks3',
      title: 'Review support runbooks',
      description: 'Fetch troubleshooting guides and FAQ documents from Confluence',
      status: 'completed',
      source: 'Confluence'
    })
  }

  if (boosts.satisfaction) {
    plan.dataSources.push({
      id: 'ds6',
      title: 'Fetch NPS survey data',
      description: 'Get satisfaction scores and verbatim feedback from Salesforce',
      status: 'completed',
      source: 'Salesforce'
    })
    plan.smeInterviews.push({
      id: 'sme4',
      title: 'Interview Customer Success Manager',
      description: 'Ask Lisa Wong about common satisfaction drivers and detractors',
      status: 'completed',
      source: 'Lisa Wong, CSM'
    })
    plan.knowledgeSources.push({
      id: 'ks4',
      title: 'Review customer feedback themes',
      description: 'No product feedback documentation found in Notion',
      status: 'needs_input',
      actionRequired: 'Connect Notion workspace or upload feedback summaries'
    })
  }

  return plan
}

export const useCustomerTwinStore = create<CustomerTwinState>((set, get) => ({
  vectors: initialVectors,
  questionHistory: [],
  recentGains: [],
  activeQuestion: null,
  isProcessing: false,
  currentPlan: null,
  selectedHistoryId: null,
  dataSources: initialDataSources,
  knowledgeSources: initialKnowledgeSources,
  codeRepos: initialCodeRepos,
  automationLogs: initialAutomationLogs,

  askQuestion: async (questionData: QuestionData) => {
    const { vectors } = get()
    const vectorsBeforeQuestion = JSON.parse(JSON.stringify(vectors)) as Vectors

    // Generate and set the plan
    const plan = generatePlan(questionData.question, questionData.boosts)
    set({ activeQuestion: questionData, isProcessing: true, currentPlan: plan })

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

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

    // Create history entry
    const historyEntry: QuestionHistoryEntry = {
      id: Date.now().toString(),
      question: questionData.question,
      answer: questionData.answer || '',
      sources: questionData.sources,
      boosts: questionData.boosts,
      vectorsBeforeQuestion,
      vectorsAfterQuestion: JSON.parse(JSON.stringify(newVectors)) as Vectors,
      timestamp: new Date().toLocaleTimeString(),
      plan
    }

    set(state => ({
      vectors: newVectors,
      recentGains: gains,
      questionHistory: [historyEntry, ...state.questionHistory].slice(0, 20),
      isProcessing: false
    }))
  },

  resetTwin: () => {
    set({
      vectors: initialVectors,
      recentGains: [],
      activeQuestion: null,
      questionHistory: [],
      currentPlan: null,
      selectedHistoryId: null
    })
  },

  toggleDataSource: (id: string) => {
    set(state => ({
      dataSources: state.dataSources.map(ds =>
        ds.id === id ? { ...ds, connected: !ds.connected, lastSync: ds.connected ? undefined : 'Just now' } : ds
      )
    }))
  },

  toggleKnowledgeSource: (id: string) => {
    set(state => ({
      knowledgeSources: state.knowledgeSources.map(ks =>
        ks.id === id ? { ...ks, connected: !ks.connected, lastUpdate: ks.connected ? undefined : 'Just now', documents: ks.connected ? 0 : 50 } : ks
      )
    }))
  },

  toggleCodeRepo: (id: string) => {
    set(state => ({
      codeRepos: state.codeRepos.map(cr =>
        cr.id === id ? { ...cr, connected: !cr.connected, lastScan: cr.connected ? undefined : 'Just now', rulesExtracted: cr.connected ? 0 : 15 } : cr
      )
    }))
  },

  selectHistoryEntry: (id: string | null) => {
    set({ selectedHistoryId: id })
  },

  getVectorsForHistoryEntry: (id: string | null) => {
    const { questionHistory, vectors } = get()
    if (!id) return vectors
    const entry = questionHistory.find(h => h.id === id)
    return entry ? entry.vectorsAfterQuestion : vectors
  }
}))
