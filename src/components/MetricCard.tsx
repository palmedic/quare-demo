import { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  color?: string
  icon?: ReactNode
}

export default function MetricCard({ title, value, subtitle, color, icon }: MetricCardProps) {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p
            className="text-2xl font-semibold mt-1 text-white"
            style={color ? { color } : undefined}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div>{icon}</div>
        )}
      </div>
    </div>
  )
}
