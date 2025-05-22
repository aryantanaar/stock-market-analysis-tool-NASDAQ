"use client"

import { useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface HistoricalDataPoint {
  date: string
  close: number
  open: number
  high: number
  low: number
  volume: number
}

interface StockChartProps {
  data: HistoricalDataPoint[]
}

export function StockChart({ data }: StockChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dimensions
    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // Extract price data
    const prices = data.map((d) => d.close)
    const dates = data.map((d) => new Date(d.date))

    // Calculate min and max values
    const minPrice = Math.min(...prices) * 0.98
    const maxPrice = Math.max(...prices) * 1.02
    const priceRange = maxPrice - minPrice

    // Calculate scales
    const xScale = (width - padding * 2) / (dates.length - 1)
    const yScale = (height - padding * 2) / priceRange

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#e2e8f0"
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw price labels
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#64748b"
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    const numPriceLabels = 5
    for (let i = 0; i <= numPriceLabels; i++) {
      const price = minPrice + (priceRange * i) / numPriceLabels
      const y = height - padding - (price - minPrice) * yScale
      ctx.fillText(`$${price.toFixed(2)}`, padding - 10, y)

      // Draw horizontal grid line
      ctx.beginPath()
      ctx.strokeStyle = "#e2e8f0"
      ctx.setLineDash([5, 5])
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw date labels
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    const numDateLabels = Math.min(6, dates.length)
    for (let i = 0; i < numDateLabels; i++) {
      const index = Math.floor((dates.length - 1) * (i / (numDateLabels - 1)))
      const date = dates[index]
      const x = padding + index * xScale
      ctx.fillText(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }), x, height - padding + 10)
    }

    // Draw price line
    ctx.beginPath()
    ctx.strokeStyle = "#0ea5e9"
    ctx.lineWidth = 2

    // Calculate gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
    gradient.addColorStop(0, "rgba(14, 165, 233, 0.8)")
    gradient.addColorStop(1, "rgba(14, 165, 233, 0.2)")

    // Draw price line
    prices.forEach((price, i) => {
      const x = padding + i * xScale
      const y = height - padding - (price - minPrice) * yScale

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Fill area under the line
    ctx.lineTo(padding + (prices.length - 1) * xScale, height - padding)
    ctx.lineTo(padding, height - padding)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw data points
    prices.forEach((price, i) => {
      const x = padding + i * xScale
      const y = height - padding - (price - minPrice) * yScale

      // Only draw points for every nth data point to avoid clutter
      if (i % Math.ceil(prices.length / 15) === 0) {
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = "#0ea5e9"
        ctx.fill()
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 1
        ctx.stroke()
      }
    })
  }, [data])

  // Filter data for different time periods
  const getFilteredData = (period: string) => {
    if (!data || data.length === 0) return data

    const now = new Date()
    const cutoffDate = new Date()

    switch (period) {
      case "1w":
        cutoffDate.setDate(now.getDate() - 7)
        break
      case "1m":
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case "3m":
        cutoffDate.setMonth(now.getMonth() - 3)
        break
      case "1y":
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
      case "5y":
        cutoffDate.setFullYear(now.getFullYear() - 5)
        break
      default:
        return data
    }

    return data.filter((item) => new Date(item.date) >= cutoffDate)
  }

  return (
    <Tabs defaultValue="1m">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="1w">1W</TabsTrigger>
          <TabsTrigger value="1m">1M</TabsTrigger>
          <TabsTrigger value="3m">3M</TabsTrigger>
          <TabsTrigger value="1y">1Y</TabsTrigger>
          <TabsTrigger value="5y">5Y</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="1w">
        <canvas ref={canvasRef} width={800} height={400} className="w-full h-[400px]" />
      </TabsContent>
      <TabsContent value="1m">
        <canvas ref={canvasRef} width={800} height={400} className="w-full h-[400px]" />
      </TabsContent>
      <TabsContent value="3m">
        <canvas ref={canvasRef} width={800} height={400} className="w-full h-[400px]" />
      </TabsContent>
      <TabsContent value="1y">
        <canvas ref={canvasRef} width={800} height={400} className="w-full h-[400px]" />
      </TabsContent>
      <TabsContent value="5y">
        <canvas ref={canvasRef} width={800} height={400} className="w-full h-[400px]" />
      </TabsContent>
    </Tabs>
  )
}
