
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseConversionProps {
  initialFromCurrency: string;
  initialToCurrency: string;
  initialAmount: number;
  language: string;
  translationError: string;
  translationErrorTitle: string;
}

export const useConversion = ({
  initialFromCurrency,
  initialToCurrency,
  initialAmount,
  language,
  translationError,
  translationErrorTitle
}: UseConversionProps) => {
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState(initialToCurrency);
  const [amount, setAmount] = useState(initialAmount);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [priceData, setPriceData] = useState<any>(null);

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
      const lastUpdateTime = new Date(data[fromCurrency].last_updated_at * 1000);

      setConvertedAmount(amount * price);
      setLastUpdated(lastUpdateTime.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US'));

      // Fetch historical data for chart
      await fetchHistoricalData();
      
      // Update usage stats
      updateStats();
    } catch (err) {
      console.error('Error fetching price:', err);
      setError(translationError);
      toast({
        title: translationErrorTitle,
        description: translationError,
        variant: "destructive",
      });
      setConvertedAmount(null);
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency, amount, language, translationError, translationErrorTitle, updateStats]);

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

  // Effect to fetch price when currencies or amount change
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

  return {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    amount,
    setAmount,
    convertedAmount,
    loading,
    error,
    lastUpdated,
    priceData,
    handleConvert,
    handleSwap
  };
};
