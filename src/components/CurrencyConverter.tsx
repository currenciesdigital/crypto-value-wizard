
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { translations } from '@/lib/translations';
import { useFavorites } from '@/hooks/useFavorites';
import ConversionForm from '@/components/ConversionForm';
import ConversionResult from '@/components/ConversionResult';
import { useConversion } from '@/hooks/useConversion';

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
  
  // Effect to update from the props when they change
  useEffect(() => {
    if (conversion) {
      const { setFromCurrency, setToCurrency, setAmount } = conversion;
      setFromCurrency(initialFromCurrency);
      setToCurrency(initialToCurrency);
      setAmount(initialAmount);
    }
  }, [initialFromCurrency, initialToCurrency, initialAmount]);

  // Load from localStorage on initial render
  useEffect(() => {
    const loadSavedConversion = () => {
      const savedConversion = localStorage.getItem('lastConversion');
      if (savedConversion && conversion) {
        const { fromCurrency: savedFrom, toCurrency: savedTo, amount: savedAmount } = JSON.parse(savedConversion);
        const { setFromCurrency, setToCurrency, setAmount } = conversion;
        setFromCurrency(savedFrom || 'bitcoin');
        setToCurrency(savedTo || 'usd');
        setAmount(savedAmount || 1);
      }
    };
    
    loadSavedConversion();
  }, []);

  const conversion = useConversion({
    initialFromCurrency,
    initialToCurrency,
    initialAmount,
    language,
    translationError: t.errorFetchingPrice,
    translationErrorTitle: t.errorTitle
  });

  const handleSaveAsFavorite = () => {
    if (conversion) {
      const { fromCurrency, toCurrency, amount } = conversion;
      addFavorite({
        fromCurrency,
        toCurrency,
        amount
      });
      toast({
        title: t.successTitle,
        description: t.addedToFavorites,
      });
    }
  };

  return (
    <Card className="p-6 bg-card shadow-lg">
      {conversion && (
        <>
          <ConversionForm
            language={language}
            fromCurrency={conversion.fromCurrency}
            setFromCurrency={conversion.setFromCurrency}
            toCurrency={conversion.toCurrency}
            setToCurrency={conversion.setToCurrency}
            amount={conversion.amount}
            setAmount={conversion.setAmount}
            isFavorite={isFavorite(conversion.fromCurrency, conversion.toCurrency)}
            onSaveAsFavorite={handleSaveAsFavorite}
            onConvert={conversion.handleConvert}
            onSwap={conversion.handleSwap}
            loading={conversion.loading}
          />
          
          <ConversionResult
            language={language}
            convertedAmount={conversion.convertedAmount}
            toCurrency={conversion.toCurrency}
            lastUpdated={conversion.lastUpdated}
            priceData={conversion.priceData}
            error={conversion.error}
          />
        </>
      )}
    </Card>
  );
};

export default CurrencyConverter;
