
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    
    // Update today's count
    const todayStats = stats[today] || 0;
    setTodayCount(todayStats);
    
    // Calculate total count across all days with proper type checking
    const total = Object.values(stats).reduce((acc: number, curr: unknown) => {
      const currentValue = typeof curr === 'number' ? curr : 0;
      return acc + currentValue;
    }, 0);
    
    setTotalCount(total);
  }, []);

  const updateStats = () => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get the stats from localStorage
    const storedStats = localStorage.getItem('cryptoConverterStats');
    let stats = storedStats ? JSON.parse(storedStats) : {};
    
    // If no stats for today, initialize to 0
    if (!stats[today]) {
      stats[today] = 0;
    }
    
    // Increment the counter
    stats[today]++;
    
    // Save back to localStorage
    localStorage.setItem('cryptoConverterStats', JSON.stringify(stats));
    
    // Update the state - using proper type assertion
    setTodayCount(stats[today] as number);
    
    // Calculate total count across all days with proper type checking
    const total = Object.values(stats).reduce((acc: number, curr: unknown) => {
      const currentValue = typeof curr === 'number' ? curr : 0;
      return acc + currentValue;
    }, 0);
    
    setTotalCount(total);
  };

  // Expose updateStats function to parent components
  React.useImperativeHandle(React.createRef(), () => ({
    updateStats
  }));

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {t.usageStatsTitle}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
            <span className="text-2xl font-bold">{todayCount}</span>
            <span className="text-sm text-muted-foreground text-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {t.todayConversions}
            </span>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-primary/10 rounded-md">
            <span className="text-2xl font-bold">{totalCount}</span>
            <span className="text-sm text-muted-foreground text-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {t.totalConversions}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageStats;
