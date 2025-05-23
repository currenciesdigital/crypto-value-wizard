
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { translations } from '@/lib/translations';

interface UsageStatsProps {
  language: string;
}

const UsageStats: React.FC<UsageStatsProps> = ({ language }) => {
  const t = translations[language];
  const [todayCount, setTodayCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get the stats from localStorage
    const storedStats = localStorage.getItem('cryptoConverterStats');
    const stats = storedStats ? JSON.parse(storedStats) : {};
    
    // Calculate today's count
    const todayStats = stats[today] || 0;
    setTodayCount(todayStats);
    
    // Calculate total count across all days - fixing the type issue
    const total = Object.values(stats).reduce((acc: number, curr: unknown) => {
      return acc + (typeof curr === 'number' ? curr : 0);
    }, 0);
    setTotalCount(total);
  }, []);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-lg" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {t.usageStats}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
            <span className="text-2xl font-bold">{todayCount}</span>
            <span className="text-sm text-muted-foreground" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {t.todayConversions}
            </span>
          </div>
          <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
            <span className="text-2xl font-bold">{totalCount}</span>
            <span className="text-sm text-muted-foreground" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {t.totalConversions}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageStats;
