const API_BASE_URL = 'https://marketpullse-ai.onrender.com';

export interface StockData {
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  marketCap: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  chartData: ChartDataPoint[];
  timestamp: string;
}

export interface ChartDataPoint {
  time: string;
  price: number;
  volume: number;
}

export interface SearchResult {
  symbol: string;
  name: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage: string | null;
}

export interface NewsResponse {
  symbol: string;
  articles: NewsArticle[];
  error?: string;
}

export interface PredictionResponse {
  symbol: string;
  prediction: string;
  timestamp: string;
  error?: string;
}

export async function fetchStockData(symbol: string): Promise<StockData> {
  const response = await fetch(`${API_BASE_URL}/api/stock/${symbol}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch stock data for ${symbol}`);
  }
  return response.json();
}

export async function searchStocks(query: string): Promise<SearchResult[]> {
  const response = await fetch(`${API_BASE_URL}/api/stocks/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search stocks');
  }
  return response.json();
}

export async function fetchNews(symbol: string): Promise<NewsResponse> {
  const response = await fetch(`${API_BASE_URL}/api/news/${symbol}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch news for ${symbol}`);
  }
  return response.json();
}

export async function fetchPrediction(symbol: string, riskProfile: string = 'medium'): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ symbol, riskProfile }),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch prediction for ${symbol}`);
  }
  return response.json();
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatLargeNumber(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

export function formatVolume(volume: number): string {
  if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
  return volume.toString();
}
