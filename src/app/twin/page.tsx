'use client'

import { useCustomerTwinStore, VectorKey } from '@/store/customerTwinStore'
import RadarChart from '@/components/RadarChart'
import DimensionBars from '@/components/DimensionBars'
import MetricCard from '@/components/MetricCard'

export default function CustomerTwinPage() {
  const { vectors, questionHistory, dataSources, resetTwin } = useCustomerTwinStore()

  // Calculate overall understanding
  const vectorKeys = Object.keys(vectors) as VectorKey[]
  const totalValue = vectorKeys.reduce((sum, key) => sum + vectors[key].value, 0)
  const maxTotal = vectorKeys.reduce((sum, key) => sum + vectors[key].max, 0)
  const overallPercentage = Math.round((totalValue / maxTotal) * 100)

  // Find strongest and weakest dimensions
  const sorted = [...vectorKeys].sort((a, b) => vectors[b].value - vectors[a].value)
  const strongest = vectors[sorted[0]]
  const needsAttention = vectors[sorted[sorted.length - 1]]

  // Group data sources by type
  const connectedSources = dataSources.filter(ds => ds.connected)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customer Twin</h1>
          <p className="text-gray-500 mt-1">Visualize your understanding of customers</p>
        </div>
        <button
          onClick={resetTwin}
          className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset Twin
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Radar Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Understanding Map</h2>
            <div className="flex justify-center">
              <RadarChart vectors={vectors} size={400} />
            </div>
          </div>

          {/* Dimension Strength Bars */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Dimension Strength</h2>
            <DimensionBars vectors={vectors} />
          </div>
        </div>

        {/* Right Column: Stats + History */}
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Overall"
              value={`${overallPercentage}%`}
              icon="🧠"
            />
            <MetricCard
              title="Questions"
              value={questionHistory.length}
              icon="💬"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Strongest Area</h3>
            <p className="text-lg font-semibold" style={{ color: strongest.color }}>
              {strongest.label}
            </p>
            <p className="text-sm text-gray-500">
              {Math.round((strongest.value / strongest.max) * 100)}% understanding
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Needs Attention</h3>
            <p className="text-lg font-semibold" style={{ color: needsAttention.color }}>
              {needsAttention.label}
            </p>
            <p className="text-sm text-gray-500">
              {Math.round((needsAttention.value / needsAttention.max) * 100)}% understanding
            </p>
          </div>

          {/* Question History */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Question History</h3>
            {questionHistory.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {questionHistory.slice(0, 8).map((q, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full truncate max-w-full"
                    title={q}
                  >
                    {q.slice(0, 30)}...
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No questions asked yet</p>
            )}
          </div>

          {/* Knowledge Sources */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Knowledge Sources</h3>
            <div className="space-y-2">
              {connectedSources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <span>{source.icon}</span>
                  <span className="text-gray-700">{source.name}</span>
                  <span className="text-xs text-gray-400 ml-auto">{source.lastSync}</span>
                </div>
              ))}
              {connectedSources.length === 0 && (
                <p className="text-sm text-gray-400">No sources connected</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
