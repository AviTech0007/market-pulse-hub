import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Brain, Sparkles, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchPrediction } from '@/lib/api';
import { cn } from '@/lib/utils';

interface PredictionPanelProps {
  symbol: string;
}

export function PredictionPanel({ symbol }: PredictionPanelProps) {
  const [riskProfile, setRiskProfile] = useState<string>('medium');

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['prediction', symbol, riskProfile],
    queryFn: () => fetchPrediction(symbol, riskProfile),
    enabled: false,
  });

  const handleGetPrediction = () => {
    refetch();
  };

  const parseRecommendation = (text: string | undefined): 'BUY' | 'HOLD' | 'SELL' | null => {
    if (!text) return null;
    const upperText = text.toUpperCase();
    if (upperText.includes('BUY')) return 'BUY';
    if (upperText.includes('SELL')) return 'SELL';
    if (upperText.includes('HOLD')) return 'HOLD';
    return null;
  };

  const recommendation = parseRecommendation(data?.prediction);

  return (
    <Card className="glass overflow-hidden">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <span>AI Prediction</span>
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Select value={riskProfile} onValueChange={setRiskProfile}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Risk Profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Conservative (Low Risk)</SelectItem>
                <SelectItem value="medium">Balanced (Medium Risk)</SelectItem>
                <SelectItem value="high">Aggressive (High Risk)</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleGetPrediction}
              disabled={isFetching || !symbol}
              className="glow-primary"
            >
              {isFetching ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Failed to generate prediction</span>
            </div>
          )}

          {data?.prediction && (
            <div className="space-y-4 animate-fade-in">
              {recommendation && (
                <div className={cn(
                  "p-4 rounded-lg flex items-center justify-center gap-3",
                  recommendation === 'BUY' && "bg-success/10",
                  recommendation === 'SELL' && "bg-destructive/10",
                  recommendation === 'HOLD' && "bg-warning/10"
                )}>
                  {recommendation === 'BUY' && <TrendingUp className="h-6 w-6 text-success" />}
                  {recommendation === 'SELL' && <TrendingDown className="h-6 w-6 text-destructive" />}
                  {recommendation === 'HOLD' && <Minus className="h-6 w-6 text-warning" />}
                  <span className={cn(
                    "text-2xl font-bold font-mono",
                    recommendation === 'BUY' && "text-success",
                    recommendation === 'SELL' && "text-destructive",
                    recommendation === 'HOLD' && "text-warning"
                  )}>
                    {recommendation}
                  </span>
                </div>
              )}

              <div className="p-4 rounded-lg bg-secondary/30">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">AI Analysis</h4>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {data.prediction}
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                AI predictions are for informational purposes only. Always do your own research.
              </p>
            </div>
          )}

          {!data?.prediction && !error && !isFetching && (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">
                Select your risk profile and click Analyze to get AI-powered insights for {symbol}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
