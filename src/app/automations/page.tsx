'use client'

import { useCustomerTwinStore } from '@/store/customerTwinStore'
import { ShieldIcon, DollarIcon, RocketIcon, SparklesIcon, TrendingUpIcon, TargetIcon, ClockIcon, ArrowRightIcon } from '@/components/Icons'
import { ReactNode, CSSProperties } from 'react'

interface Agent {
  id: string
  name: string
  description: string
  metric: string
  status: string
  Icon: (props: { size?: number; className?: string; style?: CSSProperties }) => ReactNode
  color: string
}

const agents: Agent[] = [
  {
    id: 'churn',
    name: 'Churn Prevention Agent',
    description: 'Monitors at-risk customers and triggers retention actions',
    metric: '12 at-risk customers',
    status: 'active',
    Icon: ShieldIcon,
    color: '#EF4444'
  },
  {
    id: 'pricing',
    name: 'Pricing Optimization Agent',
    description: 'Adjusts proposals based on customer value signals',
    metric: '8 deals optimized this week',
    status: 'active',
    Icon: DollarIcon,
    color: '#F59E0B'
  },
  {
    id: 'onboarding',
    name: 'Onboarding Agent',
    description: 'Personalizes onboarding sequences for each customer',
    metric: '23 journeys personalized',
    status: 'active',
    Icon: RocketIcon,
    color: '#10B981'
  },
  {
    id: 'feature',
    name: 'Feature Adoption Agent',
    description: 'Recommends features based on usage patterns',
    metric: '156 recommendations sent',
    status: 'paused',
    Icon: SparklesIcon,
    color: '#8B5CF6'
  }
]

interface ImpactMetric {
  label: string
  value: string
  Icon: (props: { size?: number; className?: string }) => ReactNode
}

const impactMetrics: ImpactMetric[] = [
  { label: 'Prevented Churn (this quarter)', value: '$847,000', Icon: DollarIcon },
  { label: 'Onboarding Completion Improvement', value: '+34%', Icon: TrendingUpIcon },
  { label: 'Deals Optimized', value: '89', Icon: TargetIcon },
  { label: 'Hours Saved', value: '1,240', Icon: ClockIcon }
]

export default function AutomationsPage() {
  const { automationLogs } = useCustomerTwinStore()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Automations</h1>
        <p className="text-slate-400 mt-1">Autonomous agents powered by your Customer Twin</p>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {impactMetrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.Icon size={20} className="text-slate-500" />
            </div>
            <p className="text-2xl font-semibold text-white">{metric.value}</p>
            <p className="text-sm text-slate-400 mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Agents */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-sm">
            <h2 className="text-lg font-medium text-white mb-4">Active Agents</h2>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: agent.color + '15' }}
                  >
                    <agent.Icon size={20} className="text-current" style={{ color: agent.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white">{agent.name}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          agent.status === 'active'
                            ? 'bg-green-900/50 text-green-400'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-0.5">{agent.description}</p>
                    <p
                      className="text-sm font-medium mt-2"
                      style={{ color: agent.color }}
                    >
                      {agent.metric}
                    </p>
                  </div>
                  <button className="text-sm text-slate-500 hover:text-slate-300 flex items-center gap-1">
                    Configure
                    <ArrowRightIcon size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Logs */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-sm">
          <h2 className="text-lg font-medium text-white mb-4">Recent Actions</h2>
          <div className="space-y-4">
            {automationLogs.map((log) => (
              <div key={log.id} className="border-b border-slate-700 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-white">{log.customer}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{log.company}</span>
                </div>
                <p className="text-sm text-slate-300 mt-1">{log.action}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <span className="px-1.5 py-0.5 bg-slate-700 rounded">
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
