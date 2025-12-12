import { TrendingUp, TrendingDown, Activity, BarChart3, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StockData, formatPrice, formatLargeNumber, formatVolume } from '@/lib/api';
import { cn } from '@/lib/utils';

interface StockCardProps {
  stock: StockData;
  loading?: boolean;
}

export function StockCard({ stock, loading }: StockCardProps) {
  const isPositive = stock.change >= 0;

  if (loading) {
    return (
      <Card className="glass animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-8 bg-muted rounded w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="h-12 bg-muted rounded w-1/2 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="font-mono text-2xl font-bold">{stock.symbol}</span>
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}>
                {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{stock.name}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-4xl font-bold tracking-tight">
              {formatPrice(stock.currentPrice)}
            </span>
            <span className={cn(
              "font-mono text-lg font-semibold",
              isPositive ? "text-success" : "text-destructive"
            )}>
              {isPositive ? '+' : ''}{formatPrice(stock.change)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            icon={<Activity className="h-4 w-4" />}
            label="Day Range"
            value={`${formatPrice(stock.dayLow)} - ${formatPrice(stock.dayHigh)}`}
          />
          <MetricCard
            icon={<BarChart3 className="h-4 w-4" />}
            label="Volume"
            value={formatVolume(stock.volume)}
          />
          <MetricCard
            icon={<Calendar className="h-4 w-4" />}
            label="52W Range"
            value={`${formatPrice(stock.fiftyTwoWeekLow)} - ${formatPrice(stock.fiftyTwoWeekHigh)}`}
          />
          <MetricCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="Market Cap"
            value={formatLargeNumber(stock.marketCap)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-secondary/50">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-mono text-sm font-semibold truncate">{value}</div>
    </div>
  );
}
