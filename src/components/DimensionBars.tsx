'use client'

import { Vectors, VectorKey } from '@/store/customerTwinStore'

interface DimensionBarsProps {
  vectors: Vectors
  showLabels?: boolean
}

export default function DimensionBars({ vectors, showLabels = true }: DimensionBarsProps) {
  const vectorKeys = Object.keys(vectors) as VectorKey[]

  return (
    <div className="space-y-3">
      {vectorKeys.map((key) => {
        const vector = vectors[key]
        const percentage = Math.round((vector.value / vector.max) * 100)

        return (
          <div key={key} className="space-y-1">
            {showLabels && (
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: vector.color }}
                  />
                  <span className="text-slate-300">{vector.label}</span>
                </div>
                <span className="font-medium text-white">{percentage}%</span>
              </div>
            )}
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: vector.color
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
