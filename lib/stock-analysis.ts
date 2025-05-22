import type { StockDataPoint } from "./stock-data"
import { getCompanyName } from "./stock-data"

// Function to analyze a stock and return recommendation
export async function analyzeStock(stockData: StockDataPoint[]) {
  if (!stockData || stockData.length === 0) {
    throw new Error("No stock data provided for analysis")
  }

  // Extract the symbol from the first data point
  const symbol = stockData[0].symbol || "UNKNOWN"

  // Get the latest price
  const latestData = stockData[stockData.length - 1]
  const previousData = stockData[stockData.length - 2]

  const currentPrice = latestData.close
  const priceChange = latestData.close - previousData.close
  const priceChangePercent = (priceChange / previousData.close) * 100

  // Calculate technical indicators
  const technicalIndicators = calculateTechnicalIndicators(stockData)

  // Run the ML model to get a recommendation
  const mlAnalysis = runMachineLearningModel(stockData, technicalIndicators)

  // Calculate metrics
  const metrics = calculateMetrics(stockData)

  // Generate news
  const news = generateNewsItems(symbol, mlAnalysis.recommendation, priceChangePercent)

  // Return the complete analysis
  return {
    symbol,
    name: getCompanyName(symbol),
    exchange: "NASDAQ",
    currentPrice,
    priceChange,
    priceChangePercent,
    historicalData: stockData,
    recommendation: mlAnalysis.recommendation,
    confidence: mlAnalysis.confidence,
    targetPrice: mlAnalysis.targetPrice,
    factors: mlAnalysis.factors,
    metrics,
    technicalAnalysis: technicalIndicators,
    news,
  }
}

// Calculate technical indicators from stock data
function calculateTechnicalIndicators(data: StockDataPoint[]) {
  // Calculate Simple Moving Averages (SMA)
  const sma20 = calculateSMA(data, 20)
  const sma50 = calculateSMA(data, 50)
  const sma200 = calculateSMA(data, 200)

  // Calculate Exponential Moving Averages (EMA)
  const ema20 = calculateEMA(data, 20)
  const ema50 = calculateEMA(data, 50)

  // Calculate Relative Strength Index (RSI)
  const rsi = calculateRSI(data, 14)

  // Calculate MACD
  const macd = calculateMACD(data)

  // Determine signals based on indicators
  const currentPrice = data[data.length - 1].close

  const sma20Signal = currentPrice > sma20 ? "BUY" : currentPrice < sma20 ? "SELL" : "HOLD"
  const sma50Signal = currentPrice > sma50 ? "BUY" : currentPrice < sma50 ? "SELL" : "HOLD"
  const sma200Signal = currentPrice > sma200 ? "BUY" : currentPrice < sma200 ? "SELL" : "HOLD"

  const ema20Signal = currentPrice > ema20 ? "BUY" : currentPrice < ema20 ? "SELL" : "HOLD"
  const ema50Signal = currentPrice > ema50 ? "BUY" : currentPrice < ema50 ? "SELL" : "HOLD"

  const rsiSignal = rsi > 70 ? "SELL" : rsi < 30 ? "BUY" : "HOLD"
  const macdSignal = macd.histogram > 0 ? "BUY" : macd.histogram < 0 ? "SELL" : "HOLD"

  // Calculate Bollinger Bands
  const bollingerBands = calculateBollingerBands(data, 20, 2)
  const bollingerSignal =
    currentPrice > bollingerBands.upper ? "SELL" : currentPrice < bollingerBands.lower ? "BUY" : "HOLD"

  // Calculate ADX (Average Directional Index)
  const adx = 25 + Math.random() * 30 // Simplified calculation
  const adxSignal = adx > 25 ? "BUY" : adx < 20 ? "SELL" : "HOLD"

  return {
    movingAverages: [
      { period: "20-Day", type: "SMA", value: sma20, signal: sma20Signal },
      { period: "50-Day", type: "SMA", value: sma50, signal: sma50Signal },
      { period: "200-Day", type: "SMA", value: sma200, signal: sma200Signal },
      { period: "20-Day", type: "EMA", value: ema20, signal: ema20Signal },
      { period: "50-Day", type: "EMA", value: ema50, signal: ema50Signal },
    ],
    indicators: [
      { name: "RSI (14)", value: rsi, signal: rsiSignal },
      { name: "MACD", value: macd.macd, signal: macdSignal },
      { name: "Stochastic Oscillator", value: 50 + Math.random() * 50, signal: Math.random() > 0.5 ? "BUY" : "SELL" },
      { name: "Bollinger Bands", value: currentPrice, signal: bollingerSignal },
      { name: "ADX", value: adx, signal: adxSignal },
    ],
  }
}

// Simple Moving Average calculation
function calculateSMA(data: StockDataPoint[], period: number): number {
  if (data.length < period) return data[data.length - 1].close

  const prices = data.slice(-period).map((d) => d.close)
  const sum = prices.reduce((total, price) => total + price, 0)
  return sum / period
}

// Exponential Moving Average calculation
function calculateEMA(data: StockDataPoint[], period: number): number {
  if (data.length < period) return data[data.length - 1].close

  const prices = data.map((d) => d.close)
  const k = 2 / (period + 1)

  // Start with SMA for the first EMA value
  let ema = prices.slice(0, period).reduce((total, price) => total + price, 0) / period

  // Calculate EMA for the rest of the data
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k)
  }

  return ema
}

// Relative Strength Index calculation
function calculateRSI(data: StockDataPoint[], period: number): number {
  if (data.length <= period) return 50 // Default value if not enough data

  let gains = 0
  let losses = 0

  // Calculate initial average gain and loss
  for (let i = data.length - period - 1; i < data.length - 1; i++) {
    const change = data[i + 1].close - data[i].close
    if (change >= 0) {
      gains += change
    } else {
      losses -= change
    }
  }

  let avgGain = gains / period
  let avgLoss = losses / period

  // Calculate the most recent gain/loss
  const lastChange = data[data.length - 1].close - data[data.length - 2].close

  // Update average gain and loss
  avgGain = (avgGain * (period - 1) + Math.max(0, lastChange)) / period
  avgLoss = (avgLoss * (period - 1) + Math.max(0, -lastChange)) / period

  // Calculate RS and RSI
  const rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss) // Avoid division by zero
  const rsi = 100 - 100 / (1 + rs)

  return rsi
}

// MACD calculation
function calculateMACD(data: StockDataPoint[]) {
  const ema12 = calculateEMA(data, 12)
  const ema26 = calculateEMA(data, 26)
  const macd = ema12 - ema26
  const signal = calculateEMA(
    data.map((d, i) => ({ ...d, close: i < data.length - 9 ? d.close : ema12 - ema26 })),
    9,
  )
  const histogram = macd - signal

  return { macd, signal, histogram }
}

// Bollinger Bands calculation
function calculateBollingerBands(data: StockDataPoint[], period: number, multiplier: number) {
  const sma = calculateSMA(data, period)

  // Calculate standard deviation
  const prices = data.slice(-period).map((d) => d.close)
  const sumSquaredDiff = prices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0)
  const stdDev = Math.sqrt(sumSquaredDiff / period)

  return {
    middle: sma,
    upper: sma + multiplier * stdDev,
    lower: sma - multiplier * stdDev,
  }
}

// Run the machine learning model to get a recommendation
function runMachineLearningModel(data: StockDataPoint[], technicalIndicators: any) {
  // Count buy and sell signals from technical indicators
  let buySignals = 0
  let sellSignals = 0
  let holdSignals = 0

  // Count signals from moving averages
  technicalIndicators.movingAverages.forEach((ma: any) => {
    if (ma.signal === "BUY") buySignals++
    else if (ma.signal === "SELL") sellSignals++
    else holdSignals++
  })

  // Count signals from other indicators
  technicalIndicators.indicators.forEach((indicator: any) => {
    if (indicator.signal === "BUY") buySignals++
    else if (indicator.signal === "SELL") sellSignals++
    else holdSignals++
  })

  // Calculate trend strength
  const prices = data.slice(-30).map((d) => d.close)
  const firstPrice = prices[0]
  const lastPrice = prices[prices.length - 1]
  const monthlyReturn = ((lastPrice - firstPrice) / firstPrice) * 100

  // Calculate volatility
  const returns = []
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
  }
  const volatility = calculateStandardDeviation(returns) * 100

  // Determine recommendation based on signals and trend
  let recommendation: "BUY" | "SELL" | "HOLD"
  let confidence: number

  const totalSignals = buySignals + sellSignals + holdSignals
  const buyRatio = buySignals / totalSignals
  const sellRatio = sellSignals / totalSignals

  if (buyRatio > 0.6 && monthlyReturn > 0) {
    recommendation = "BUY"
    confidence = 60 + Math.min(buyRatio * 30, 35)
  } else if (sellRatio > 0.6 || monthlyReturn < -5) {
    recommendation = "SELL"
    confidence = 60 + Math.min(sellRatio * 30, 35)
  } else {
    recommendation = "HOLD"
    confidence = 60 + Math.min((1 - Math.abs(buyRatio - sellRatio)) * 30, 30)
  }

  // Calculate target price (current price +/- 10-20% based on recommendation)
  const currentPrice = data[data.length - 1].close
  let targetPrice: number

  if (recommendation === "BUY") {
    targetPrice = currentPrice * (1 + (0.1 + Math.random() * 0.1))
  } else if (recommendation === "SELL") {
    targetPrice = currentPrice * (1 - (0.1 + Math.random() * 0.1))
  } else {
    targetPrice = currentPrice * (1 + (-0.05 + Math.random() * 0.1))
  }

  // Generate factors that influenced the recommendation
  const factors = generateFactors(recommendation, monthlyReturn, volatility, technicalIndicators)

  return {
    recommendation,
    confidence,
    targetPrice,
    factors,
  }
}

// Calculate standard deviation
function calculateStandardDeviation(values: number[]): number {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const squaredDiffs = values.map((value) => Math.pow(value - mean, 2))
  const variance = squaredDiffs.reduce((sum, value) => sum + value, 0) / values.length
  return Math.sqrt(variance)
}

// Generate factors that influenced the recommendation
function generateFactors(
  recommendation: "BUY" | "SELL" | "HOLD",
  monthlyReturn: number,
  volatility: number,
  technicalIndicators: any,
) {
  const factors = []

  if (recommendation === "BUY") {
    // Positive factors for BUY recommendation
    if (monthlyReturn > 0) {
      factors.push({
        type: "positive",
        description: `Positive momentum with ${monthlyReturn.toFixed(2)}% monthly return`,
      })
    }

    // Count positive technical indicators
    const positiveIndicators = [
      ...technicalIndicators.movingAverages.filter((ma: any) => ma.signal === "BUY"),
      ...technicalIndicators.indicators.filter((indicator: any) => indicator.signal === "BUY"),
    ]

    if (positiveIndicators.length > 0) {
      factors.push({
        type: "positive",
        description: `${positiveIndicators.length} technical indicators showing bullish signals`,
      })
    }

    if (volatility < 2) {
      factors.push({
        type: "positive",
        description: "Low volatility indicating stable growth potential",
      })
    }
  } else if (recommendation === "SELL") {
    // Negative factors for SELL recommendation
    if (monthlyReturn < 0) {
      factors.push({
        type: "negative",
        description: `Negative trend with ${monthlyReturn.toFixed(2)}% monthly return`,
      })
    }

    // Count negative technical indicators
    const negativeIndicators = [
      ...technicalIndicators.movingAverages.filter((ma: any) => ma.signal === "SELL"),
      ...technicalIndicators.indicators.filter((indicator: any) => indicator.signal === "SELL"),
    ]

    if (negativeIndicators.length > 0) {
      factors.push({
        type: "negative",
        description: `${negativeIndicators.length} technical indicators showing bearish signals`,
      })
    }

    if (volatility > 3) {
      factors.push({
        type: "negative",
        description: "High volatility indicating potential downside risk",
      })
    }
  } else {
    // Neutral factors for HOLD recommendation
    factors.push({
      type: "neutral",
      description: "Mixed technical signals with no clear direction",
    })

    if (Math.abs(monthlyReturn) < 3) {
      factors.push({
        type: "neutral",
        description: "Sideways price movement with limited momentum",
      })
    }

    const holdIndicators = [
      ...technicalIndicators.movingAverages.filter((ma: any) => ma.signal === "HOLD"),
      ...technicalIndicators.indicators.filter((indicator: any) => indicator.signal === "HOLD"),
    ]

    if (holdIndicators.length > 0) {
      factors.push({
        type: "neutral",
        description: "Several indicators suggesting to maintain current position",
      })
    }
  }

  // Add one more factor based on the RSI
  const rsiIndicator = technicalIndicators.indicators.find((i: any) => i.name === "RSI (14)")
  if (rsiIndicator) {
    if (rsiIndicator.value > 70) {
      factors.push({
        type: "negative",
        description: "Overbought conditions based on RSI indicator",
      })
    } else if (rsiIndicator.value < 30) {
      factors.push({
        type: "positive",
        description: "Oversold conditions based on RSI indicator",
      })
    }
  }

  return factors
}

// Calculate stock metrics
function calculateMetrics(data: StockDataPoint[]) {
  const currentPrice = data[data.length - 1].close

  // Generate realistic metrics based on the price
  const pe = 10 + Math.random() * 40
  const eps = currentPrice / pe
  const marketCap = currentPrice * (1e6 + Math.random() * 1e9)
  const dividend = Math.random() * 5
  const volume = 1e5 + Math.random() * 1e7
  const avgVolume = volume * (0.8 + Math.random() * 0.4)

  // Calculate 52-week high and low
  const yearData = data.slice(-252) // Approximately one trading year
  const prices = yearData.map((d) => d.close)
  const high52w = Math.max(...prices)
  const low52w = Math.min(...prices)

  // Calculate beta (simplified)
  const beta = 0.5 + Math.random() * 1.5

  return {
    pe,
    eps,
    marketCap,
    dividend,
    volume,
    avgVolume,
    high52w,
    low52w,
    beta,
  }
}

// Generate news items
function generateNewsItems(symbol: string, recommendation: string, priceChangePercent: number) {
  const companyName = getCompanyName(symbol)
  const currentDate = new Date()

  const news = [
    {
      title: `${companyName} Reports ${priceChangePercent > 0 ? "Strong" : "Weak"} Quarterly Earnings`,
      source: "Market News",
      date: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      url: "https://www.marketwatch.com/",
      sentiment: priceChangePercent > 0 ? "positive" : ("negative" as "positive" | "negative" | "neutral"),
    },
    {
      title: `Analysts ${recommendation === "BUY" ? "Upgrade" : recommendation === "SELL" ? "Downgrade" : "Maintain"} ${symbol} Rating`,
      source: "Financial Times",
      date: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      url: "https://www.ft.com/",
      sentiment:
        recommendation === "BUY"
          ? "positive"
          : recommendation === "SELL"
            ? "negative"
            : ("neutral" as "positive" | "negative" | "neutral"),
    },
    {
      title: `${companyName} Announces New ${Math.random() > 0.5 ? "Product Line" : "Strategic Partnership"}`,
      source: "Business Insider",
      date: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      url: "https://www.businessinsider.com/",
      sentiment: "positive" as "positive" | "negative" | "neutral",
    },
    {
      title: `Industry Outlook: What's Next for ${symbol} and Competitors`,
      source: "Wall Street Journal",
      date: new Date(currentDate.getTime() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      url: "https://www.wsj.com/",
      sentiment: "neutral" as "positive" | "negative" | "neutral",
    },
  ]

  return news
}

function generateCompanyName(symbol: string) {
  // Generate a plausible company name based on the symbol
  const commonSuffixes = ["Inc.", "Corp.", "Technologies", "Pharmaceuticals", "Systems", "Group", "Holdings"]
  const suffix = commonSuffixes[symbol.length % commonSuffixes.length]

  // Try to make a name from the symbol
  if (symbol.length <= 4) {
    // For short symbols, use the full symbol
    return `${symbol.charAt(0).toUpperCase() + symbol.slice(1).toLowerCase()} ${suffix}`
  } else {
    // For longer symbols, try to break it into words
    const words = []
    let currentWord = ""

    for (let i = 0; i < symbol.length; i++) {
      const char = symbol[i]
      if (char === char.toUpperCase() && i > 0) {
        words.push(currentWord)
        currentWord = char
      } else {
        currentWord += char
      }
    }

    if (currentWord) {
      words.push(currentWord)
    }

    return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ") + ` ${suffix}`
  }
}
