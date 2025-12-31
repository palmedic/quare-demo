'use client'

import { useState } from 'react'
import { useCustomerTwinStore, VectorKey, QuestionPlan, PlanStep } from '@/store/customerTwinStore'
import { sampleQuestions, getQuestionAnswer } from '@/data/sampleQuestions'
import { DatabaseIcon, UsersIcon, CodeIcon, CheckIcon, SparklesIcon, ArrowRightIcon, BookIcon, CloudIcon, FileIcon, TicketIcon, ChartIcon } from '@/components/Icons'
import { ReactNode } from 'react'

type TabType = 'all' | 'data' | 'knowledge' | 'sme' | 'code'

interface Tab {
  id: TabType
  label: string
  description: string
  Icon: (props: { size?: number; className?: string }) => ReactNode
}

const tabs: Tab[] = [
  { id: 'all', label: 'All Questions', description: 'Browse all question types', Icon: SparklesIcon },
  { id: 'data', label: 'Data Sources', description: 'Questions answered via CRM, analytics, support data', Icon: DatabaseIcon },
  { id: 'knowledge', label: 'Knowledge', description: 'Questions from docs, wikis, and notes', Icon: BookIcon },
  { id: 'sme', label: 'SME Interviews', description: 'Questions requiring expert knowledge', Icon: UsersIcon },
  { id: 'code', label: 'Code Extraction', description: 'Questions extracting business rules from code', Icon: CodeIcon },
]

// Categorize sample questions by primary method
const categorizedQuestions: Record<TabType, typeof sampleQuestions> = {
  all: sampleQuestions,
  data: sampleQuestions.filter(q => q.boosts.churn || q.boosts.satisfaction),
  knowledge: sampleQuestions.filter(q => q.boosts.onboarding || q.boosts.support),
  sme: sampleQuestions.filter(q => q.boosts.pricing),
  code: sampleQuestions.filter(q => q.boosts.features || q.boosts.pricing),
}

export default function AskPage() {
  const { vectors, askQuestion, isProcessing, activeQuestion, recentGains, currentPlan } = useCustomerTwinStore()
  const [inputValue, setInputValue] = useState('')
  const [showPlan, setShowPlan] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [planProgress, setPlanProgress] = useState(0)

  const handleAskQuestion = async (questionData: typeof sampleQuestions[0]) => {
    setShowPlan(true)
    setPlanProgress(0)
    setShowAnswer(false)

    // Animate through plan steps
    const totalSteps = 8
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 250))
      setPlanProgress(Math.round((i / totalSteps) * 100))
    }

    await askQuestion(questionData)
    setCurrentAnswer(getQuestionAnswer(questionData.question))
    // Don't auto-dismiss the plan - wait for user click
    setInputValue('')
  }

  const showAnswerPanel = () => {
    setShowPlan(false)
    setShowAnswer(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Find matching sample question or use default
    const matchedQuestion = sampleQuestions.find(
      q => q.question.toLowerCase().includes(inputValue.toLowerCase().slice(0, 20))
    ) || {
      question: inputValue,
      boosts: { satisfaction: 8, features: 5 },
      sources: ['Connected Data Sources'],
      answer: "Based on analysis of your connected data sources, I've identified several patterns relevant to your question."
    }

    handleAskQuestion(matchedQuestion)
  }

  const resetState = () => {
    setShowAnswer(false)
    setShowPlan(false)
    setCurrentAnswer('')
    setPlanProgress(0)
  }

  const renderPlanSection = (title: string, steps: PlanStep[], Icon: (props: { size?: number; className?: string; style?: React.CSSProperties }) => ReactNode, color: string) => {
    if (steps.length === 0) return null
    return (
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
            <Icon size={14} className="text-current" style={{ color }} />
          </div>
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        <div className="space-y-2 pl-8">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                step.status === 'completed' ? 'bg-green-500' : step.status === 'in_progress' ? 'bg-amber-500 animate-pulse' : 'bg-gray-300'
              }`}>
                {step.status === 'completed' && <CheckIcon size={10} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{step.title}</p>
                <p className="text-xs text-gray-500">{step.description}</p>
                {step.source && (
                  <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded mt-1 inline-block">
                    {step.source}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Ask Your Customer</h1>
        <p className="text-gray-500 mt-1">
          Build your Customer Twin by asking questions. Each answer makes it smarter.
        </p>
      </div>

      {/* Question Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-2">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask your customer anything..."
              disabled={isProcessing}
              className="w-full px-5 py-4 text-lg bg-transparent border-0 focus:outline-none focus:ring-0 disabled:text-gray-400 placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={isProcessing || !inputValue.trim()}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isProcessing ? 'Processing...' : 'Ask'}
            </button>
          </div>
        </div>
      </form>

      {/* Planning Panel - Shows during and after processing */}
      {showPlan && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {planProgress < 100 || isProcessing ? (
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckIcon size={16} className="text-white" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {planProgress < 100 || isProcessing ? 'Building answer plan...' : 'Plan completed!'}
                </p>
                <p className="text-sm text-gray-500">
                  {planProgress < 100 || isProcessing
                    ? 'Identifying relevant sources and experts'
                    : 'All sources have been analyzed'}
                </p>
              </div>
            </div>
            <span className={`text-sm font-medium ${planProgress === 100 && !isProcessing ? 'text-green-600' : 'text-primary'}`}>
              {planProgress}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${planProgress === 100 && !isProcessing ? 'bg-green-500' : 'bg-primary'}`}
              style={{ width: `${planProgress}%` }}
            />
          </div>

          {/* Plan Details */}
          {currentPlan && (
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Execution Plan</h4>
              {renderPlanSection('Data Sources', currentPlan.dataSources, DatabaseIcon, '#3B82F6')}
              {renderPlanSection('Knowledge Sources', currentPlan.knowledgeSources, BookIcon, '#10B981')}
              {renderPlanSection('SME Interviews', currentPlan.smeInterviews, UsersIcon, '#8B5CF6')}
              {renderPlanSection('Code Extraction', currentPlan.codeExtraction, CodeIcon, '#F59E0B')}
            </div>
          )}

          {/* View Answer Button - shows when complete */}
          {planProgress === 100 && !isProcessing && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={showAnswerPanel}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
              >
                View Answer
                <ArrowRightIcon size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Answer Display */}
      {showAnswer && activeQuestion && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
              Q
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{activeQuestion.question}</p>
            </div>
          </div>

          <div className="pl-11">
            <p className="text-gray-700 leading-relaxed mb-4">{currentAnswer}</p>

            {/* Sources */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Sources used:</p>
              <div className="flex gap-2 flex-wrap">
                {activeQuestion.sources.map((source) => (
                  <span
                    key={source}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>

            {/* Understanding Gains */}
            {recentGains.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                  <SparklesIcon size={16} />
                  Understanding Improved
                </p>
                <div className="flex gap-2 flex-wrap">
                  {recentGains.map((gain) => (
                    <span
                      key={gain.key}
                      className="text-sm px-3 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: gain.color + '20',
                        color: gain.color
                      }}
                    >
                      {gain.label} +{gain.gain}%
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={resetState}
            className="mt-4 text-sm text-primary hover:text-primary-600 font-medium flex items-center gap-1"
          >
            Ask another question
            <ArrowRightIcon size={14} />
          </button>
        </div>
      )}

      {/* Suggested Questions with Tabs */}
      {!showAnswer && !showPlan && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 px-6 pt-4">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary border-b-2 border-primary -mb-px'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.Icon size={16} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Description */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-sm text-gray-600">
              {tabs.find(t => t.id === activeTab)?.description}
            </p>
          </div>

          {/* Questions List */}
          <div className="p-6">
            <div className="space-y-2">
              {categorizedQuestions[activeTab].length > 0 ? (
                categorizedQuestions[activeTab].map((q, index) => (
                  <button
                    key={index}
                    onClick={() => handleAskQuestion(q)}
                    className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 group-hover:text-gray-900">
                        {q.question}
                      </span>
                      <ArrowRightIcon size={16} className="text-gray-400 group-hover:text-primary" />
                    </div>
                    {/* Preview of dimension impacts */}
                    <div className="flex gap-2 mt-2">
                      {Object.entries(q.boosts).map(([key, value]) => (
                        <span
                          key={key}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: vectors[key as VectorKey].color + '15',
                            color: vectors[key as VectorKey].color
                          }}
                        >
                          {vectors[key as VectorKey].label.split(' ')[0]} +{value}%
                        </span>
                      ))}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No questions in this category yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
