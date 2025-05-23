
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CurrencySelect from '@/components/CurrencySelect';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { ArrowDownUp } from 'lucide-react';
import { translations } from '@/lib/translations';
import PriceChart from '@/components/PriceChart';
import PriceHistory from '@/components/PriceHistory';
import FavoriteButton from '@/components/FavoriteButton';
import { useFavorites } from '@/hooks/useFavorites';

interface CurrencyConverterProps {
  language: string;
  initialFromCurrency?: string;
  initialToCurrency?: string;
  initialAmount?: number;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ 
  language,
  initialFromCurrency = 'bitcoin',
  initialToCurrency = 'usd',
  initialAmount = 1
}) => {
  const t = translations[language];
  const { addFavorite, isFavorite } = useFavorites();
  
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState(initialToCurrency);
  const [amount, setAmount] = useState(initialAmount);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [priceData, setPriceData] = useState<any>(null);

  // Effect to update from the props when they change
  useEffect(() => {
    setFromCurrency(initialFromCurrency);
    setToCurrency(initialToCurrency);
    setAmount(initialAmount);
  }, [initialFromCurrency, initialToCurrency, initialAmount]);

  // Update usage statistics
  const updateStats = useCallback(() => {
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
  }, []);

  const fetchPrice = useCallback(async () => {
    if (!fromCurrency || !toCurrency) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrency}&vs_currencies=${toCurrency}&include_24hr_change=true&include_last_updated_at=true`
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data[fromCurrency] || !data[fromCurrency][toCurrency]) {
        throw new Error(`Price data not available for ${fromCurrency} to ${toCurrency}`);
      }

      const price = data[fromCurrency][toCurrency];
      const change24h = data[fromCurrency][`${toCurrency}_24h_change`];
      const lastUpdateTime = new Date(data[fromCurrency].last_updated_at * 1000);

      setConvertedAmount(amount * price);
      setLastUpdated(lastUpdateTime.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US'));

      // Fetch historical data for chart
      await fetchHistoricalData();
      
      // Update usage stats
      updateStats();
    } catch (err) {
      console.error('Error fetching price:', err);
      setError(t.errorFetchingPrice);
      toast({
        title: t.errorTitle,
        description: t.errorFetchingPrice,
        variant: "destructive",
      });
      setConvertedAmount(null);
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency, amount, language, t, updateStats]);

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${fromCurrency}/market_chart?vs_currency=${toCurrency}&days=7&interval=daily`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch historical data');
      }

      const data = await response.json();
      setPriceData(data);
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setPriceData(null);
    }
  };

  // Effect to fetch price on component mount and when currencies change
  useEffect(() => {
    // Load from localStorage on initial render
    const loadSavedConversion = () => {
      const savedConversion = localStorage.getItem('lastConversion');
      if (savedConversion) {
        const { fromCurrency: savedFrom, toCurrency: savedTo, amount: savedAmount } = JSON.parse(savedConversion);
        setFromCurrency(savedFrom || 'bitcoin');
        setToCurrency(savedTo || 'usd');
        setAmount(savedAmount || 1);
      }
    };
    
    loadSavedConversion();
  }, []);

  // Debounced effect for fetching prices when input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPrice();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [fromCurrency, toCurrency, amount, fetchPrice]);

  const handleConvert = () => {
    fetchPrice();
    
    // Save current conversion to localStorage
    localStorage.setItem(
      'lastConversion',
      JSON.stringify({
        fromCurrency,
        toCurrency,
        amount
      })
    );
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleSaveAsFavorite = () => {
    addFavorite({
      fromCurrency,
      toCurrency,
      amount
    });
    toast({
      title: t.successTitle,
      description: t.addedToFavorites,
    });
  };

  const formattedResult = convertedAmount 
    ? new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
        style: 'currency',
        currency: toCurrency.toUpperCase(),
        minimumFractionDigits: convertedAmount < 1 ? 6 : 2,
        maximumFractionDigits: convertedAmount < 1 ? 6 : 2
      }).format(convertedAmount)
    : null;

  return (
    <Card className="p-6 bg-card shadow-lg">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1" htmlFor="amount" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {t.amount}
            </label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1" htmlFor="fromCurrency" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {t.from}
            </label>
            <CurrencySelect
              id="fromCurrency"
              value={fromCurrency}
              onChange={setFromCurrency}
              isCrypto={true}
              language={language}
            />
          </div>
          
          <div className="flex items-center justify-center py-4 md:py-0">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleSwap} 
              className="rounded-full"
              aria-label={t.swap}
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1" htmlFor="toCurrency" dir={language === 'ar' ? 'rtl' : 'ltr'}>
              {t.to}
            </label>
            <CurrencySelect
              id="toCurrency"
              value={toCurrency}
              onChange={setToCurrency}
              isCrypto={false}
              language={language}
            />
          </div>
        </div>
        
        <div className="flex justify-center gap-2">
          <Button 
            onClick={handleConvert} 
            className="px-8"
            disabled={loading}
          >
            {loading ? t.converting : t.convert}
          </Button>
          
          <FavoriteButton 
            isFavorite={isFavorite(fromCurrency, toCurrency)} 
            onClick={handleSaveAsFavorite} 
            title={t.addToFavorites}
          />
        </div>
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {error}
          </div>
        )}
        
        {convertedAmount !== null && !error && (
          <div className="mt-4 flex flex-col gap-4">
            <div className="bg-primary/10 p-4 rounded-md text-center">
              <div className="text-lg font-semibold" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                {t.resultLabel}
              </div>
              <div className="text-3xl font-bold my-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                {formattedResult}
              </div>
              <div className="text-sm text-muted-foreground" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                {t.lastUpdated}: {lastUpdated}
              </div>
            </div>
            
            {priceData && (
              <div className="flex flex-col gap-4 mt-4">
                <PriceHistory priceData={priceData} language={language} />
                <PriceChart priceData={priceData} language={language} />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CurrencyConverter;
