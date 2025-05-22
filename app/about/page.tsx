import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Brain, Database, LineChart, BarChart3 } from "lucide-react"

export default function About() {
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
              <Link href="/dashboard" className="text-sm font-medium">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About StockSense AI</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform uses advanced machine learning algorithms to analyze stock market data and provide
                  actionable insights.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Machine Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Our platform uses advanced machine learning algorithms to analyze historical stock data and predict
                    future trends with high accuracy.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Real Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We use real historical stock market data from reliable sources to ensure our analysis is based on
                    accurate information.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Comprehensive Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Our platform provides comprehensive analysis of stocks, including technical indicators, fundamental
                    metrics, and sentiment analysis.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">Our Technology</h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  StockSense AI uses a combination of machine learning models to analyze stock market data and provide
                  accurate predictions.
                </p>
                <ul className="grid gap-4">
                  <li className="flex items-start gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <LineChart className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Time Series Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Our models analyze historical price patterns to identify trends and predict future movements.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Brain className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Neural Networks</h3>
                      <p className="text-sm text-muted-foreground">
                        Deep learning models that can identify complex patterns in market data that traditional analysis
                        might miss.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Database className="h-4 w-4 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Big Data Processing</h3>
                      <p className="text-sm text-muted-foreground">
                        Our platform processes large volumes of market data to provide comprehensive analysis.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter">Data Sources</h2>
                  <p className="text-muted-foreground md:text-xl/relaxed">
                    We use real stock market data from various reliable sources to ensure our analysis is accurate and
                    up-to-date.
                  </p>
                </div>
                <div className="space-y-4">
                  <p>
                    Our platform sources data from public financial repositories on GitHub, including historical price
                    data, company financials, and market indicators.
                  </p>
                  <p>
                    The data is regularly updated to ensure that our analysis reflects the current market conditions.
                  </p>
                  <div>
                    <Link href="/dashboard">
                      <Button size="lg" className="mt-4">
                        Try It Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            © 2025 StockSense AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
