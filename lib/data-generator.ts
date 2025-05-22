// This file contains functions to generate realistic-looking stock data

interface DataPoint {
  date: string
  close: number
  open: number
  high: number
  low: number
  volume: number
}

// Generate historical stock data with realistic patterns
export function generateHistoricalData(basePrice: number, days: number, seed: number): DataPoint[] {
  const data: DataPoint[] = []
  let currentPrice = basePrice
  let trend = 0
  let trendDuration = 0
  const volatility = 0.01 + (seed % 0.04)

  // Start date (days ago)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - days)

  for (let i = 0; i < days; i++) {
    // Calculate date
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)

    // Skip weekends
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      continue
    }

    // Update trend if needed
    if (trendDuration <= 0) {
      // Change trend direction
      trend = -0.5 + ((seed * (i + 1)) % 1)
      trendDuration = 5 + Math.floor((seed * (i + 1)) % 15)
    }
    trendDuration--

    // Calculate daily change with trend and volatility
    const dailyChange = trend * 0.005 + volatility * (-0.5 + ((seed * (i + 1)) % 1))

    // Update price
    currentPrice = currentPrice * (1 + dailyChange)

    // Generate intraday range
    const dayVolatility = volatility * (0.5 + ((seed * (i + 1)) % 1))
    const open = currentPrice * (1 - dayVolatility / 2 + ((seed * (i + 1)) % dayVolatility))
    const high = Math.max(open, currentPrice) * (1 + ((seed * (i + 1)) % (dayVolatility * 2)))
    const low = Math.min(open, currentPrice) * (1 - ((seed * (i + 1)) % (dayVolatility * 2)))

    // Generate volume
    const baseVolume = 100000 + ((seed * 900000) % 900000)
    const volumeMultiplier = 0.5 + ((seed * (i + 1)) % 1.5)
    const volume = Math.floor(baseVolume * volumeMultiplier)

    // Add data point
    data.push({
      date: currentDate.toISOString().split("T")[0],
      close: currentPrice,
      open,
      high,
      low,
      volume,
    })
  }

  return data
}
