
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { translations } from '@/lib/translations';

interface PriceChartProps {
  priceData: {
    prices: number[][];
  };
  language: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ priceData, language }) => {
  const t = translations[language];
  
  if (!priceData || !priceData.prices || priceData.prices.length < 2) {
    return null;
  }

  const prices = priceData.prices;
  const chartData = prices.map(item => {
    const date = new Date(item[0]);
    return {
      date: date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      price: item[1]
    };
  });

  // Calculate if trend is positive
  const firstPrice = prices[0][1];
  const lastPrice = prices[prices.length - 1][1];
  const isPositive = lastPrice >= firstPrice;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg" dir={language === 'ar' ? 'rtl' : 'ltr'}>{t.priceChart}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              width={60}
            />
            <Tooltip
              formatter={(value) => [`${value}`, t.price]}
              labelFormatter={(label) => `${t.date}: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={isPositive ? "#10b981" : "#ef4444"} 
              strokeWidth={2}
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
