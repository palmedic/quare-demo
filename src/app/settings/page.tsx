'use client'

import { useState } from 'react'
import { useCustomerTwinStore } from '@/store/customerTwinStore'
import { CloudIcon, BookIcon, CodeIcon, FileIcon, FolderIcon, EditIcon, DatabaseIcon, TicketIcon, ChartIcon, MessageIcon, LinkIcon } from '@/components/Icons'
import { ReactNode } from 'react'

const knowledgeSources = [
  { id: '1', name: 'Confluence', documents: 234, lastUpdate: '1 day ago', connected: true, Icon: FileIcon },
  { id: '2', name: 'Google Drive', documents: 89, lastUpdate: '3 hours ago', connected: true, Icon: FolderIcon },
  { id: '3', name: 'Notion', documents: 0, lastUpdate: null, connected: false, Icon: EditIcon },
]

const codeRepos = [
  { id: '1', name: 'pricing-engine', rulesExtracted: 47, lastScan: '2 hours ago', connected: true },
  { id: '2', name: 'subscription-service', rulesExtracted: 23, lastScan: '1 day ago', connected: true },
  { id: '3', name: 'billing-api', rulesExtracted: 0, lastScan: null, connected: false },
]

const dataSourceIcons: Record<string, (props: { size?: number; className?: string }) => ReactNode> = {
  'crm': CloudIcon,
  'support': TicketIcon,
  'analytics': ChartIcon,
  'documents': FileIcon,
  'code': CodeIcon,
}

type TabType = 'data' | 'knowledge' | 'code'

interface Tab {
  id: TabType
  label: string
  Icon: (props: { size?: number; className?: string }) => ReactNode
}

export default function SettingsPage() {
  const { dataSources, toggleDataSource } = useCustomerTwinStore()
  const [activeTab, setActiveTab] = useState<TabType>('data')

  const tabs: Tab[] = [
    { id: 'data', label: 'Data Sources', Icon: DatabaseIcon },
    { id: 'knowledge', label: 'Knowledge Sources', Icon: BookIcon },
    { id: 'code', label: 'Code Repositories', Icon: CodeIcon },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your data connections and integrations</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.Icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Sources Tab */}
      {activeTab === 'data' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-900">Connected Integrations</h2>
              <button className="text-sm text-primary hover:text-primary-600 font-medium flex items-center gap-1">
                <LinkIcon size={14} />
                Add Integration
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {dataSources.map((source) => {
              const IconComponent = dataSourceIcons[source.type] || DatabaseIcon
              return (
                <div key={source.id} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <IconComponent size={20} className="text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{source.name}</h3>
                      <span className="text-xs text-gray-400 capitalize">{source.type}</span>
                    </div>
                    {source.connected && source.lastSync && (
                      <p className="text-sm text-gray-500">Last synced: {source.lastSync}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        source.connected
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {source.connected ? 'Connected' : 'Disconnected'}
                    </span>
                    <button
                      onClick={() => toggleDataSource(source.id)}
                      className={`text-sm font-medium ${
                        source.connected
                          ? 'text-red-500 hover:text-red-600'
                          : 'text-primary hover:text-primary-600'
                      }`}
                    >
                      {source.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Knowledge Sources Tab */}
      {activeTab === 'knowledge' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-900">Document Sources</h2>
              <button className="text-sm text-primary hover:text-primary-600 font-medium flex items-center gap-1">
                <LinkIcon size={14} />
                Add Source
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {knowledgeSources.map((source) => (
              <div key={source.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <source.Icon size={20} className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{source.name}</h3>
                  </div>
                  {source.connected && (
                    <p className="text-sm text-gray-500">
                      {source.documents} documents • Updated {source.lastUpdate}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      source.connected
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {source.connected ? 'Connected' : 'Disconnected'}
                  </span>
                  <button
                    className={`text-sm font-medium ${
                      source.connected
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-primary hover:text-primary-600'
                    }`}
                  >
                    {source.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Repositories Tab */}
      {activeTab === 'code' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-900">Code Repositories</h2>
              <button className="text-sm text-primary hover:text-primary-600 font-medium flex items-center gap-1">
                <LinkIcon size={14} />
                Add Repository
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {codeRepos.map((repo) => (
              <div key={repo.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CodeIcon size={20} className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 font-mono text-sm">{repo.name}</h3>
                  </div>
                  {repo.connected && (
                    <p className="text-sm text-gray-500">
                      {repo.rulesExtracted} business rules extracted • Last scan: {repo.lastScan}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      repo.connected
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {repo.connected ? 'Connected' : 'Disconnected'}
                  </span>
                  <button
                    className={`text-sm font-medium ${
                      repo.connected
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-primary hover:text-primary-600'
                    }`}
                  >
                    {repo.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
