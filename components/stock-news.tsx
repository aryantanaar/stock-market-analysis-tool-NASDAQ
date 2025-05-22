import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface NewsItem {
  title: string
  source: string
  date: string
  url: string
  sentiment: "positive" | "negative" | "neutral"
}

interface StockNewsProps {
  news: NewsItem[]
}

export function StockNews({ news }: StockNewsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent News</CardTitle>
        <CardDescription>Latest news and sentiment analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.map((item, index) => (
            <div key={index} className="flex flex-col space-y-2 pb-4 border-b last:border-0">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{item.title}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.sentiment === "positive"
                      ? "bg-green-100 text-green-800"
                      : item.sentiment === "negative"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.sentiment}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>
                  {item.source} • {item.date}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  Read <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
