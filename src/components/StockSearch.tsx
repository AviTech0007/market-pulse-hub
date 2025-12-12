import { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchStocks, SearchResult } from '@/lib/api';
import { cn } from '@/lib/utils';

interface StockSearchProps {
  onSelect: (symbol: string) => void;
  selectedSymbol: string;
}

const popularStocks: SearchResult[] = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
];

export function StockSearch({ onSelect, selectedSymbol }: StockSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (query.length > 0) {
        setLoading(true);
        try {
          const data = await searchStocks(query);
          setResults(data);
        } catch {
          setResults([]);
        }
        setLoading(false);
      } else {
        setResults(popularStocks);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (symbol: string) => {
    onSelect(symbol);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search stocks (e.g., AAPL, TSLA)"
          value={query}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          onFocus={() => setIsOpen(true)}
          className="pl-10 h-12 bg-card border-border/50 focus:border-primary transition-colors"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              {query === '' && (
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
                  Popular Stocks
                </div>
              )}
              {(query === '' ? popularStocks : results).map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleSelect(stock.symbol)}
                  className={cn(
                    "w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary/50 transition-colors text-left",
                    selectedSymbol === stock.symbol && "bg-primary/10"
                  )}
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-mono font-semibold">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {stock.name}
                    </div>
                  </div>
                </button>
              ))}
              {results.length === 0 && query !== '' && (
                <div className="p-4 text-center text-muted-foreground">
                  No stocks found for "{query}"
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
