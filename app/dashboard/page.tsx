"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Search, ArrowUpRight, ArrowDownRight, Loader2, AlertCircle } from "lucide-react"
import { StockChart } from "@/components/stock-chart"
import { StockRecommendation } from "@/components/stock-recommendation"
import { StockMetrics } from "@/components/stock-metrics"
import { StockNews } from "@/components/stock-news"
import { fetchStockData } from "@/lib/stock-data"
import { analyzeStock } from "@/lib/stock-analysis"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AVAILABLE_STOCKS } from "@/lib/available-stocks"

export default function Dashboard() {
  const [stockSymbol, setStockSymbol] = useState("")
  const [currentStock, setCurrentStock] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [availableStocks, setAvailableStocks] = useState<string[]>([])

  useEffect(() => {
    // Set available stocks from our predefined list
    setAvailableStocks(AVAILABLE_STOCKS)
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stockSymbol) return

    // Check if the stock is in our available list
    if (!availableStocks.includes(stockSymbol)) {
      setError(`Stock ${stockSymbol} is not available. Please choose from the available stocks.`)
      return
    }

    setLoading(true)
    setError("")

    try {
      // Fetch historical data for the stock
      const stockData = await fetchStockData(stockSymbol)

      // Analyze the stock data using our ML model
      const analysisResult = await analyzeStock(stockData)

      setCurrentStock(analysisResult)
    } catch (err) {
      console.error("Error fetching stock data:", err)
      setError("Failed to fetch stock data. Please try again later.")
      setCurrentStock(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-2 items-center">
            <TrendingUp className="h-6 w-6 text-primary" />
            <Link href="/" className="text-xl font-bold">
              StockSense AI
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/" className="text-sm font-medium">
                Home
              </Link>
              <Link href="/about" className="text-sm font-medium">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Stock Analysis Dashboard</h1>
            <form onSubmit={handleSearch} className="flex w-full max-w-lg gap-2">
              <Input
                type="text"
                placeholder="Enter stock symbol (e.g., AAPL, MSFT, GOOGL)"
                value={stockSymbol}
                onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                className="flex-1"
                list="stock-symbols"
              />
              <datalist id="stock-symbols">
                {availableStocks.map((stock) => (
                  <option key={stock} value={stock} />
                ))}
              </datalist>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                Analyze
              </Button>
            </form>

            <div className="mt-4 text-sm text-muted-foreground">
              Available stocks: {availableStocks.slice(0, 10).join(", ")}, and more...
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Analyzing stock data...</p>
            </div>
          )}

          {currentStock && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Card className="w-full md:w-2/3">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl">
                          {currentStock.name} ({currentStock.symbol})
                        </CardTitle>
                        <CardDescription>
                          {currentStock.exchange} • Last updated: {new Date().toLocaleString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold">${currentStock.currentPrice.toFixed(2)}</span>
                        <div
                          className={`ml-2 flex items-center ${currentStock.priceChange >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {currentStock.priceChange >= 0 ? (
                            <ArrowUpRight className="h-5 w-5" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5" />
                          )}
                          <span className="ml-1">
                            {Math.abs(currentStock.priceChange).toFixed(2)} (
                            {Math.abs(currentStock.priceChangePercent).toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <StockChart data={currentStock.historicalData} />
                  </CardContent>
                </Card>

                <StockRecommendation
                  recommendation={currentStock.recommendation}
                  confidence={currentStock.confidence}
                  targetPrice={currentStock.targetPrice}
                  factors={currentStock.factors}
                />
              </div>

              <Tabs defaultValue="metrics">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
                  <TabsTrigger value="analysis">Technical Analysis</TabsTrigger>
                  <TabsTrigger value="news">Recent News</TabsTrigger>
                </TabsList>
                <TabsContent value="metrics">
                  <StockMetrics metrics={currentStock.metrics} />
                </TabsContent>
                <TabsContent value="analysis">
                  <Card>
                    <CardHeader>
                      <CardTitle>Technical Analysis</CardTitle>
                      <CardDescription>Machine learning based technical indicators and patterns</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-2">Moving Averages</h3>
                        <div className="space-y-2">
                          {currentStock.technicalAnalysis.movingAverages.map((ma: any, index: number) => (
                            <div key={index} className="flex justify-between items-center">
                              <span>
                                {ma.period} {ma.type}
                              </span>
                              <span
                                className={
                                  ma.signal === "BUY"
                                    ? "text-green-500"
                                    : ma.signal === "SELL"
                                      ? "text-red-500"
                                      : "text-yellow-500"
                                }
                              >
                                {ma.signal}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Technical Indicators</h3>
                        <div className="space-y-2">
                          {currentStock.technicalAnalysis.indicators.map((indicator: any, index: number) => (
                            <div key={index} className="flex justify-between items-center">
                              <span>{indicator.name}</span>
                              <span
                                className={
                                  indicator.signal === "BUY"
                                    ? "text-green-500"
                                    : indicator.signal === "SELL"
                                      ? "text-red-500"
                                      : "text-yellow-500"
                                }
                              >
                                {indicator.signal}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="news">
                  <StockNews news={currentStock.news} />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {!currentStock && !loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted rounded-full p-4 mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-medium mb-2">Enter a stock symbol to begin</h2>
              <p className="text-muted-foreground max-w-md">
                Search for a stock by its symbol (e.g., AAPL for Apple, MSFT for Microsoft) to see analysis and
                recommendations.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
