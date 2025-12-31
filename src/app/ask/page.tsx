'use client'

import { useState } from 'react'
import { useCustomerTwinStore, VectorKey } from '@/store/customerTwinStore'
import { sampleQuestions, getQuestionAnswer } from '@/data/sampleQuestions'
import { DatabaseIcon, UsersIcon, CodeIcon, CheckIcon, SparklesIcon, ArrowRightIcon } from '@/components/Icons'

export default function AskPage() {
  const { vectors, askQuestion, isProcessing, activeQuestion, recentGains } = useCustomerTwinStore()
  const [inputValue, setInputValue] = useState('')
  const [showGuidance, setShowGuidance] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState('')

  const handleAskQuestion = async (questionData: typeof sampleQuestions[0]) => {
    setShowGuidance(true)

    // Simulate needing more data
    await new Promise(resolve => setTimeout(resolve, 800))

    setShowGuidance(false)
    await askQuestion(questionData)
    setCurrentAnswer(getQuestionAnswer(questionData.question))
    setShowAnswer(true)
    setInputValue('')
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
    setCurrentAnswer('')
    setShowGuidance(false)
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
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your customer anything..."
            disabled={isProcessing}
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
          />
          <button
            type="submit"
            disabled={isProcessing || !inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Ask'}
          </button>
        </div>
      </form>

      {/* Guidance Panel */}
      {showGuidance && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 animate-pulse">
          <h3 className="text-lg font-medium text-amber-900 mb-4">
            To answer this question well, I need:
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-amber-800">
              <div className="w-5 h-5 border-2 border-amber-400 rounded flex items-center justify-center">
                <DatabaseIcon size={12} className="text-amber-400" />
              </div>
              <div>
                <p className="font-medium">Connect a data source</p>
                <p className="text-sm text-amber-600">"Connect Salesforce to see deal history"</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-amber-800">
              <div className="w-5 h-5 border-2 border-amber-400 rounded flex items-center justify-center">
                <UsersIcon size={12} className="text-amber-400" />
              </div>
              <div>
                <p className="font-medium">Interview an SME</p>
                <p className="text-sm text-amber-600">"Talk to your CS Lead about churn patterns"</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-amber-800">
              <div className="w-5 h-5 bg-amber-400 rounded flex items-center justify-center">
                <CheckIcon size={12} className="text-white" />
              </div>
              <div>
                <p className="font-medium">Extract from code</p>
                <p className="text-sm text-amber-600">"Using pricing repo to extract business rules"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && !showGuidance && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="font-medium text-gray-900">Analyzing your question...</p>
              <p className="text-sm text-gray-500">Synthesizing insights from connected sources</p>
            </div>
          </div>
          {activeQuestion && (
            <div className="mt-4 flex gap-2">
              {activeQuestion.sources.map((source) => (
                <span
                  key={source}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                >
                  {source}
                </span>
              ))}
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

      {/* Suggested Questions */}
      {!showAnswer && !isProcessing && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Suggested Questions</h3>
          <div className="space-y-2">
            {sampleQuestions.map((q, index) => (
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
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
