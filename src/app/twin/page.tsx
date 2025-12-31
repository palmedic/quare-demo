'use client'

import { useCustomerTwinStore, VectorKey, Vectors } from '@/store/customerTwinStore'
import RadarChart from '@/components/RadarChart'
import DimensionBars from '@/components/DimensionBars'
import MetricCard from '@/components/MetricCard'
import { BrainIcon, ChatIcon, CloudIcon, TicketIcon, ChartIcon, FileIcon, RefreshIcon, ClockIcon, DatabaseIcon } from '@/components/Icons'

const sourceIcons: Record<string, React.ReactNode> = {
  'crm': <CloudIcon size={16} className="text-gray-500" />,
  'support': <TicketIcon size={16} className="text-gray-500" />,
  'analytics': <ChartIcon size={16} className="text-gray-500" />,
  'documents': <FileIcon size={16} className="text-gray-500" />,
  'code': <span className="text-gray-500 font-mono text-xs">{'</>'}</span>,
}

export default function CustomerTwinPage() {
  const {
    vectors,
    questionHistory,
    dataSources,
    resetTwin,
    selectedHistoryId,
    selectHistoryEntry,
    getVectorsForHistoryEntry
  } = useCustomerTwinStore()

  // Get vectors to display (either selected history entry or current)
  const displayVectors: Vectors = getVectorsForHistoryEntry(selectedHistoryId)
  const selectedEntry = questionHistory.find(h => h.id === selectedHistoryId)

  // Calculate overall understanding based on displayed vectors
  const vectorKeys = Object.keys(displayVectors) as VectorKey[]
  const totalValue = vectorKeys.reduce((sum, key) => sum + displayVectors[key].value, 0)
  const maxTotal = vectorKeys.reduce((sum, key) => sum + displayVectors[key].max, 0)
  const overallPercentage = Math.round((totalValue / maxTotal) * 100)

  // Find strongest and weakest dimensions
  const sorted = [...vectorKeys].sort((a, b) => displayVectors[b].value - displayVectors[a].value)
  const strongest = displayVectors[sorted[0]]
  const needsAttention = displayVectors[sorted[sorted.length - 1]]

  // Group data sources by type
  const connectedDataSources = dataSources.filter(ds => ds.connected)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Customer Twin</h1>
          <p className="text-gray-500 mt-1">
            {selectedHistoryId
              ? `Viewing state after: "${selectedEntry?.question.slice(0, 40)}..."`
              : 'Visualize your understanding of customers (current state)'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedHistoryId && (
            <button
              onClick={() => selectHistoryEntry(null)}
              className="text-sm text-primary hover:text-primary-600 px-3 py-1.5 border border-primary rounded-lg hover:bg-primary/5 transition-colors"
            >
              View Current State
            </button>
          )}
          <button
            onClick={resetTwin}
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshIcon size={14} />
            Reset Twin
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Radar Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Understanding Map</h2>
              {selectedHistoryId && (
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                  Historical View
                </span>
              )}
            </div>
            <div className="flex justify-center">
              <RadarChart vectors={displayVectors} size={400} />
            </div>
          </div>

          {/* Dimension Strength Bars */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Dimension Strength</h2>
            <DimensionBars vectors={displayVectors} />
          </div>

          {/* Question History Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6">
            <div className="flex items-center gap-2 mb-4">
              <ClockIcon size={20} className="text-gray-400" />
              <h2 className="text-lg font-medium text-gray-900">Question History</h2>
            </div>
            {questionHistory.length > 0 ? (
              <div className="space-y-3">
                {questionHistory.map((entry, index) => {
                  const isSelected = selectedHistoryId === entry.id
                  // Calculate total gain for this question
                  const totalGain = Object.values(entry.boosts).reduce((sum, val) => sum + (val || 0), 0)

                  return (
                    <button
                      key={entry.id}
                      onClick={() => selectHistoryEntry(isSelected ? null : entry.id)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-400">#{questionHistory.length - index}</span>
                            <span className="text-xs text-gray-400">{entry.timestamp}</span>
                          </div>
                          <p className={`text-sm truncate ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                            {entry.question}
                          </p>
                          {/* Show dimension boosts */}
                          <div className="flex gap-1.5 mt-2 flex-wrap">
                            {Object.entries(entry.boosts).map(([key, value]) => (
                              <span
                                key={key}
                                className="text-xs px-1.5 py-0.5 rounded"
                                style={{
                                  backgroundColor: displayVectors[key as VectorKey].color + '20',
                                  color: displayVectors[key as VectorKey].color
                                }}
                              >
                                +{value}%
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-sm font-medium text-green-600">+{totalGain}%</span>
                          <p className="text-xs text-gray-400">total gain</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <ChatIcon size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No questions asked yet</p>
                <p className="text-xs mt-1">Ask questions to build your Customer Twin</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Stats + History */}
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="Overall"
              value={`${overallPercentage}%`}
              icon={<BrainIcon size={20} className="text-gray-400" />}
            />
            <MetricCard
              title="Questions"
              value={questionHistory.length}
              icon={<ChatIcon size={20} className="text-gray-400" />}
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

          {/* Data Sources */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <DatabaseIcon size={16} className="text-gray-400" />
              <h3 className="text-sm font-medium text-gray-900">Data Sources</h3>
            </div>
            <div className="space-y-2">
              {connectedDataSources.map((source) => (
                <div
                  key={source.id}
                  className="flex items-center gap-2 text-sm"
                >
                  {sourceIcons[source.type] || <DatabaseIcon size={16} className="text-gray-500" />}
                  <span className="text-gray-700">{source.name}</span>
                  <span className="text-xs text-gray-400 ml-auto">{source.lastSync}</span>
                </div>
              ))}
              {connectedDataSources.length === 0 && (
                <p className="text-sm text-gray-400">No data sources connected</p>
              )}
            </div>
          </div>

          {/* Knowledge Sources */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FileIcon size={16} className="text-gray-400" />
              <h3 className="text-sm font-medium text-gray-900">Knowledge Sources</h3>
            </div>
            <div className="space-y-2">
              {connectedDataSources.filter(ds => ds.type === 'documents').length > 0 ? (
                connectedDataSources.filter(ds => ds.type === 'documents').map((source) => (
                  <div
                    key={source.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <FileIcon size={16} className="text-gray-500" />
                    <span className="text-gray-700">{source.name}</span>
                    <span className="text-xs text-gray-400 ml-auto">{source.lastSync}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">Connect knowledge sources in Settings</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
