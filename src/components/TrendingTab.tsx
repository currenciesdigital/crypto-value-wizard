
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { translations } from '@/lib/translations';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TrendingTabProps {
  language: string;
}

interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  price_btc: number;
  score: number;
  price_change_percentage_24h?: number;
}

const TrendingTab: React.FC<TrendingTabProps> = ({ language }) => {
  const t = translations[language];
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        setTrendingCoins(data.coins.map((coin: any) => coin.item));
        setError('');
      } catch (err) {
        console.error('Error fetching trending coins:', err);
        setError(t.errorFetchingTrending || 'Error fetching trending coins');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingCoins();
  }, [t]);

  if (loading) {
    return (
      <div className="p-6 bg-card rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {t.trendingTitle}
        </h3>
        <p className="text-muted-foreground" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {t.loading || 'Loading...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-card rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {t.trendingTitle}
        </h3>
        <p className="text-destructive" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {t.trendingTitle}
      </h3>
      
      <div className="space-y-4">
        {trendingCoins.slice(0, 5).map((coin) => (
          <Card key={coin.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">
                    {coin.market_cap_rank || '?'}.
                  </div>
                  <div>
                    <div className="font-medium">{coin.name} ({coin.symbol.toUpperCase()})</div>
                    <div className="text-sm text-muted-foreground">
                      {t.score}: {coin.score}
                    </div>
                  </div>
                </div>
                
                <div>
                  {coin.price_change_percentage_24h !== undefined && (
                    <div className={`flex items-center ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {coin.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrendingTab;
