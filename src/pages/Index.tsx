import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/Header';
import { StockCard } from '@/components/StockCard';
import { StockChart } from '@/components/StockChart';
import { NewsPanel } from '@/components/NewsPanel';
import { PredictionPanel } from '@/components/PredictionPanel';
import { fetchStockData } from '@/lib/api';
import { Activity, TrendingUp } from 'lucide-react';

const Index = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');

  const { data: stockData, isLoading, error } = useQuery({
    queryKey: ['stock', selectedSymbol],
    queryFn: () => fetchStockData(selectedSymbol),
    enabled: !!selectedSymbol,
    refetchInterval: 60000, // Refresh every minute
  });

  return (
    <div className="min-h-screen bg-background">
      <Header onSelectStock={setSelectedSymbol} selectedSymbol={selectedSymbol} />

      <main className="container px-4 py-6">
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Unable to Load Data</h2>
            <p className="text-muted-foreground max-w-md">
              Failed to fetch data for {selectedSymbol}. Please try again or select a different stock.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stock Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StockCard stock={stockData} loading={isLoading} />
              <StockChart
                data={stockData?.chartData || []}
                symbol={selectedSymbol}
                loading={isLoading}
              />
            </div>

            {/* AI & News Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PredictionPanel symbol={selectedSymbol} />
              <NewsPanel symbol={selectedSymbol} />
            </div>

            {/* Quick Stats Footer */}
            {stockData && (
              <div className="flex items-center justify-center gap-8 py-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span>Real-time data from market APIs</span>
                </div>
                <div className="hidden md:block w-px h-4 bg-border" />
                <span className="hidden md:inline">
                  Last updated: {new Date(stockData.timestamp).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
