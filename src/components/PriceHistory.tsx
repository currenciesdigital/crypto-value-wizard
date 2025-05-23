
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { translations } from '@/lib/translations';

interface PriceHistoryProps {
  priceData: {
    prices: number[][];
  };
  language: string;
}

const PriceHistory: React.FC<PriceHistoryProps> = ({ priceData, language }) => {
  const t = translations[language];
  
  if (!priceData || !priceData.prices || priceData.prices.length < 2) {
    return null;
  }

  const prices = priceData.prices;
  const oldestPrice = prices[0][1];
  const latestPrice = prices[prices.length - 1][1];
  const priceChange = latestPrice - oldestPrice;
  const percentChange = (priceChange / oldestPrice) * 100;
  
  const isPositive = percentChange >= 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg" dir={language === 'ar' ? 'rtl' : 'ltr'}>{t.priceHistory}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <p className="text-sm text-muted-foreground">{t.last7Days}</p>
          </div>
          <Badge 
            variant={isPositive ? "default" : "destructive"}
            className={`flex items-center gap-1 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {isPositive ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            {percentChange.toFixed(2)}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceHistory;
