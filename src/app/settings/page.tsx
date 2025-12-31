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
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your data connections and integrations</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700 mb-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-400 hover:text-white'
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
        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-white">Connected Integrations</h2>
              <button className="text-sm text-primary hover:text-primary-400 font-medium flex items-center gap-1">
                <LinkIcon size={14} />
                Add Integration
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-700">
            {dataSources.map((source) => {
              const IconComponent = dataSourceIcons[source.type] || DatabaseIcon
              return (
                <div key={source.id} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                    <IconComponent size={20} className="text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white">{source.name}</h3>
                      <span className="text-xs text-slate-500 capitalize">{source.type}</span>
                    </div>
                    {source.connected && source.lastSync && (
                      <p className="text-sm text-slate-400">Last synced: {source.lastSync}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        source.connected
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {source.connected ? 'Connected' : 'Disconnected'}
                    </span>
                    <button
                      onClick={() => toggleDataSource(source.id)}
                      className={`text-sm font-medium ${
                        source.connected
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-primary hover:text-primary-400'
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
        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-white">Document Sources</h2>
              <button className="text-sm text-primary hover:text-primary-400 font-medium flex items-center gap-1">
                <LinkIcon size={14} />
                Add Source
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-700">
            {knowledgeSources.map((source) => (
              <div key={source.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                  <source.Icon size={20} className="text-slate-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{source.name}</h3>
                  </div>
                  {source.connected && (
                    <p className="text-sm text-slate-400">
                      {source.documents} documents • Updated {source.lastUpdate}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      source.connected
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {source.connected ? 'Connected' : 'Disconnected'}
                  </span>
                  <button
                    className={`text-sm font-medium ${
                      source.connected
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-primary hover:text-primary-400'
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
        <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-white">Code Repositories</h2>
              <button className="text-sm text-primary hover:text-primary-400 font-medium flex items-center gap-1">
                <LinkIcon size={14} />
                Add Repository
              </button>
            </div>
          </div>
          <div className="divide-y divide-slate-700">
            {codeRepos.map((repo) => (
              <div key={repo.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                  <CodeIcon size={20} className="text-slate-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white font-mono text-sm">{repo.name}</h3>
                  </div>
                  {repo.connected && (
                    <p className="text-sm text-slate-400">
                      {repo.rulesExtracted} business rules extracted • Last scan: {repo.lastScan}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      repo.connected
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {repo.connected ? 'Connected' : 'Disconnected'}
                  </span>
                  <button
                    className={`text-sm font-medium ${
                      repo.connected
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-primary hover:text-primary-400'
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
