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
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p
            className="text-2xl font-semibold mt-1"
            style={color ? { color } : undefined}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div>{icon}</div>
        )}
      </div>
    </div>
  )
}
