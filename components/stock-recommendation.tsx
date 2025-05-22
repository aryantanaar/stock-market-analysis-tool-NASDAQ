import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, ArrowDownRight, MinusIcon } from "lucide-react"

interface StockRecommendationProps {
  recommendation: "BUY" | "SELL" | "HOLD"
  confidence: number
  targetPrice: number
  factors: {
    type: "positive" | "negative" | "neutral"
    description: string
  }[]
}

export function StockRecommendation({ recommendation, confidence, targetPrice, factors }: StockRecommendationProps) {
  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle>AI Recommendation</CardTitle>
        <CardDescription>Based on machine learning analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center">
          <div
            className={`text-4xl font-bold mb-2 ${
              recommendation === "BUY"
                ? "text-green-500"
                : recommendation === "SELL"
                  ? "text-red-500"
                  : "text-yellow-500"
            }`}
          >
            {recommendation}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {recommendation === "BUY" ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : recommendation === "SELL" ? (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            ) : (
              <MinusIcon className="h-4 w-4 text-yellow-500" />
            )}
            <span>Target Price: ${targetPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Confidence</span>
            <span className="font-medium">{confidence}%</span>
          </div>
          <Progress
            value={confidence}
            className={`h-2 ${
              recommendation === "BUY" ? "bg-green-100" : recommendation === "SELL" ? "bg-red-100" : "bg-yellow-100"
            }`}
          />
        </div>

        <div className="rounded-lg border p-4 space-y-3">
          <h4 className="font-medium">Key Factors</h4>
          <ul className="space-y-2 text-sm">
            {factors.map((factor, index) => (
              <li key={index} className="flex items-start gap-2">
                <div
                  className={`rounded-full p-1 mt-0.5 ${
                    factor.type === "positive"
                      ? "bg-green-500/20"
                      : factor.type === "negative"
                        ? "bg-red-500/20"
                        : "bg-yellow-500/20"
                  }`}
                >
                  {factor.type === "positive" ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                  ) : factor.type === "negative" ? (
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  ) : (
                    <MinusIcon className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
                <span>{factor.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
