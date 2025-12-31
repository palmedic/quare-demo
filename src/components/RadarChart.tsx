'use client'

import { useEffect, useRef } from 'react'
import { Vectors, VectorKey } from '@/store/customerTwinStore'

interface RadarChartProps {
  vectors: Vectors
  size?: number
}

export default function RadarChart({ vectors, size = 320 }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = size / 2
    const centerY = size / 2
    const maxRadius = (size / 2) - 30

    const drawRadar = () => {
      ctx.clearRect(0, 0, size, size)

      const vectorKeys = Object.keys(vectors) as VectorKey[]
      const numVectors = vectorKeys.length
      const angleStep = (Math.PI * 2) / numVectors

      // Draw background rings (dark mode)
      for (let ring = 1; ring <= 4; ring++) {
        ctx.beginPath()
        const ringRadius = (maxRadius / 4) * ring
        for (let i = 0; i <= numVectors; i++) {
          const angle = i * angleStep - Math.PI / 2
          const x = centerX + Math.cos(angle) * ringRadius
          const y = centerY + Math.sin(angle) * ringRadius
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.1)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw axis lines (dark mode)
      vectorKeys.forEach((key, i) => {
        const angle = i * angleStep - Math.PI / 2
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(
          centerX + Math.cos(angle) * maxRadius,
          centerY + Math.sin(angle) * maxRadius
        )
        ctx.strokeStyle = 'rgba(255,255,255,0.15)'
        ctx.stroke()
      })

      // Draw filled area with gradient
      ctx.beginPath()
      vectorKeys.forEach((key, i) => {
        const angle = i * angleStep - Math.PI / 2
        const value = vectors[key].value / vectors[key].max
        const radius = value * maxRadius
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.closePath()
      ctx.fillStyle = 'rgba(13, 148, 136, 0.2)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(13, 148, 136, 0.6)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw colored segment fills
      vectorKeys.forEach((key, i) => {
        const angle = i * angleStep - Math.PI / 2
        const nextAngle = ((i + 1) % numVectors) * angleStep - Math.PI / 2
        const value = vectors[key].value / vectors[key].max
        const nextKey = vectorKeys[(i + 1) % numVectors]
        const nextValue = vectors[nextKey].value / vectors[nextKey].max

        const radius = value * maxRadius
        const nextRadius = nextValue * maxRadius

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius
        )
        ctx.lineTo(
          centerX + Math.cos(nextAngle) * nextRadius,
          centerY + Math.sin(nextAngle) * nextRadius
        )
        ctx.closePath()
        ctx.fillStyle = vectors[key].color + '30'
        ctx.fill()
      })

      // Draw points
      vectorKeys.forEach((key, i) => {
        const angle = i * angleStep - Math.PI / 2
        const value = vectors[key].value / vectors[key].max
        const radius = value * maxRadius
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        // Outer glow
        ctx.beginPath()
        ctx.arc(x, y, 10, 0, Math.PI * 2)
        ctx.fillStyle = vectors[key].color + '50'
        ctx.fill()

        // Inner point
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fillStyle = vectors[key].color
        ctx.fill()
      })

      // Draw labels
      ctx.font = '11px system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      vectorKeys.forEach((key, i) => {
        const angle = i * angleStep - Math.PI / 2
        const labelRadius = maxRadius + 20
        const x = centerX + Math.cos(angle) * labelRadius
        const y = centerY + Math.sin(angle) * labelRadius

        ctx.fillStyle = vectors[key].color
        ctx.fillText(vectors[key].label, x, y)
      })
    }

    drawRadar()
  }, [vectors, size])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="mx-auto"
    />
  )
}
