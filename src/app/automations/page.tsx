'use client'

import { useCustomerTwinStore } from '@/store/customerTwinStore'

const agents = [
  {
    id: 'churn',
    name: 'Churn Prevention Agent',
    description: 'Monitors at-risk customers and triggers retention actions',
    metric: '12 at-risk customers',
    status: 'active',
    icon: '🛡️',
    color: '#EF4444'
  },
  {
    id: 'pricing',
    name: 'Pricing Optimization Agent',
    description: 'Adjusts proposals based on customer value signals',
    metric: '8 deals optimized this week',
    status: 'active',
    icon: '💰',
    color: '#F59E0B'
  },
  {
    id: 'onboarding',
    name: 'Onboarding Agent',
    description: 'Personalizes onboarding sequences for each customer',
    metric: '23 journeys personalized',
    status: 'active',
    icon: '🚀',
    color: '#10B981'
  },
  {
    id: 'feature',
    name: 'Feature Adoption Agent',
    description: 'Recommends features based on usage patterns',
    metric: '156 recommendations sent',
    status: 'paused',
    icon: '✨',
    color: '#8B5CF6'
  }
]

const impactMetrics = [
  { label: 'Prevented Churn (this quarter)', value: '$847,000', icon: '💵' },
  { label: 'Onboarding Completion Improvement', value: '+34%', icon: '📈' },
  { label: 'Deals Optimized', value: '89', icon: '🎯' },
  { label: 'Hours Saved', value: '1,240', icon: '⏱️' }
]

export default function AutomationsPage() {
  const { automationLogs } = useCustomerTwinStore()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Automations</h1>
        <p className="text-gray-500 mt-1">Autonomous agents powered by your Customer Twin</p>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {impactMetrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{metric.icon}</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
            <p className="text-sm text-gray-500 mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Agents */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Active Agents</h2>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: agent.color + '15' }}
                  >
                    {agent.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{agent.name}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          agent.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{agent.description}</p>
                    <p
                      className="text-sm font-medium mt-2"
                      style={{ color: agent.color }}
                    >
                      {agent.metric}
                    </p>
                  </div>
                  <button className="text-sm text-gray-400 hover:text-gray-600">
                    Configure →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Logs */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Actions</h2>
          <div className="space-y-4">
            {automationLogs.map((log) => (
              <div key={log.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-900">{log.customer}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{log.company}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{log.action}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded">
                    {log.agent}
                  </span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
