'use client'

import Link from 'next/link'
import { useCustomerTwinStore, VectorKey } from '@/store/customerTwinStore'
import RadarChart from '@/components/RadarChart'
import MetricCard from '@/components/MetricCard'
import { BrainIcon, ChatIcon, LightbulbIcon } from '@/components/Icons'

export default function Dashboard() {
  const { vectors, questionHistory, recentGains } = useCustomerTwinStore()

  // Calculate overall understanding
  const vectorKeys = Object.keys(vectors) as VectorKey[]
  const totalValue = vectorKeys.reduce((sum, key) => sum + vectors[key].value, 0)
  const maxTotal = vectorKeys.reduce((sum, key) => sum + vectors[key].max, 0)
  const overallPercentage = Math.round((totalValue / maxTotal) * 100)

  // Find strongest and weakest dimensions
  const sorted = vectorKeys.sort((a, b) => vectors[b].value - vectors[a].value)
  const strongest = vectors[sorted[0]]
  const needsAttention = vectors[sorted[sorted.length - 1]]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Your Customer Twin health at a glance</p>
      </div>

      {/* Top Section: Radar + Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Radar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Understanding Map</h2>
          <div className="flex justify-center">
            <RadarChart vectors={vectors} size={350} />
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="space-y-4">
          <MetricCard
            title="Overall Understanding"
            value={`${overallPercentage}%`}
            icon={<BrainIcon size={24} className="text-gray-400" />}
          />
          <MetricCard
            title="Questions Asked"
            value={questionHistory.length}
            icon={<ChatIcon size={24} className="text-gray-400" />}
          />
          <MetricCard
            title="Strongest Area"
            value={strongest.label}
            color={strongest.color}
            subtitle={`${Math.round((strongest.value / strongest.max) * 100)}% understanding`}
          />
          <MetricCard
            title="Needs Attention"
            value={needsAttention.label}
            color={needsAttention.color}
            subtitle={`${Math.round((needsAttention.value / needsAttention.max) * 100)}% understanding`}
          />
        </div>
      </div>

      {/* Recent Insights + Quick Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Insights */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Insights</h2>
          {questionHistory.length > 0 ? (
            <div className="space-y-3">
              {questionHistory.slice(0, 5).map((question, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <LightbulbIcon size={20} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">{question}</p>
                    {index === 0 && recentGains.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {recentGains.map((gain) => (
                          <span
                            key={gain.key}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: gain.color + '20',
                              color: gain.color
                            }}
                          >
                            {gain.label} +{gain.gain}%
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No questions asked yet.</p>
              <p className="text-sm text-gray-400 mt-1">
                Start asking questions to build your Customer Twin
              </p>
            </div>
          )}
        </div>

        {/* Quick Action */}
        <div className="bg-gradient-to-br from-primary to-primary-600 rounded-xl p-6 shadow-sm text-white">
          <h2 className="text-lg font-medium mb-2">Ready to learn more?</h2>
          <p className="text-primary-100 text-sm mb-6">
            Ask your Customer Twin a question to strengthen your understanding.
          </p>
          <Link
            href="/ask"
            className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2.5 rounded-lg font-medium hover:bg-primary-50 transition-colors"
          >
            <ChatIcon size={18} />
            Ask Your Customer
          </Link>
        </div>
      </div>
    </div>
  )
}
