import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Clock, Newspaper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchNews, NewsArticle } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface NewsPanelProps {
  symbol: string;
}

export function NewsPanel({ symbol }: NewsPanelProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['news', symbol],
    queryFn: () => fetchNews(symbol),
    enabled: !!symbol,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <Card className="glass h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Latest News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || data?.error) {
    return (
      <Card className="glass h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Latest News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Unable to load news at this time
          </p>
        </CardContent>
      </Card>
    );
  }

  const articles = data?.articles || [];

  return (
    <Card className="glass h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          <span>Latest News</span>
          <span className="text-muted-foreground font-normal">for {symbol}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="px-6 pb-6 space-y-4">
            {articles.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No news articles found
              </p>
            ) : (
              articles.map((article, index) => (
                <NewsArticleCard key={index} article={article} />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function NewsArticleCard({ article }: { article: NewsArticle }) {
  const timeAgo = article.publishedAt
    ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
    : 'Unknown';

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
    >
      <div className="flex gap-4">
        {article.urlToImage && (
          <img
            src={article.urlToImage}
            alt=""
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          {article.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {article.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo}
            </span>
            {article.source && (
              <span className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                {article.source}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
