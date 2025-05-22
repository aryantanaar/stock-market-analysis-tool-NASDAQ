import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StockMetricsProps {
  metrics: {
    pe: number
    eps: number
    marketCap: number
    dividend: number
    volume: number
    avgVolume: number
    high52w: number
    low52w: number
    beta: number
  }
}

export function StockMetrics({ metrics }: StockMetricsProps) {
  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toFixed(2)}`
  }

  const formatVolume = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`
    return value.toString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Metrics</CardTitle>
        <CardDescription>Fundamental financial metrics and indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">P/E Ratio</p>
            <p className="text-2xl font-bold">{metrics.pe.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">EPS</p>
            <p className="text-2xl font-bold">${metrics.eps.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="text-2xl font-bold">{formatMarketCap(metrics.marketCap)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Dividend Yield</p>
            <p className="text-2xl font-bold">{metrics.dividend.toFixed(2)}%</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Volume</p>
            <p className="text-2xl font-bold">{formatVolume(metrics.volume)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Avg. Volume</p>
            <p className="text-2xl font-bold">{formatVolume(metrics.avgVolume)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">52W High</p>
            <p className="text-2xl font-bold">${metrics.high52w.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">52W Low</p>
            <p className="text-2xl font-bold">${metrics.low52w.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
