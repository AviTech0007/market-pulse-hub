import { Activity } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { StockSearch } from './StockSearch';

interface HeaderProps {
  onSelectStock: (symbol: string) => void;
  selectedSymbol: string;
}

export function Header({ onSelectStock, selectedSymbol }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass">
      <div className="container flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center glow-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-tight">MarketPulse</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Analysis</p>
          </div>
        </div>

        <StockSearch onSelect={onSelectStock} selectedSymbol={selectedSymbol} />

        <ThemeToggle />
      </div>
    </header>
  );
}
