
import React from 'react';
import { translations } from '@/lib/translations';
import PriceChart from '@/components/PriceChart';
import PriceHistory from '@/components/PriceHistory';

interface ConversionResultProps {
  language: string;
  convertedAmount: number | null;
  toCurrency: string;
  lastUpdated: string;
  priceData: any;
  error: string;
}

const ConversionResult: React.FC<ConversionResultProps> = ({
  language,
  convertedAmount,
  toCurrency,
  lastUpdated,
  priceData,
  error
}) => {
  const t = translations[language];

  const formattedResult = convertedAmount 
    ? new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
        style: 'currency',
        currency: toCurrency.toUpperCase(),
        minimumFractionDigits: convertedAmount < 1 ? 6 : 2,
        maximumFractionDigits: convertedAmount < 1 ? 6 : 2
      }).format(convertedAmount)
    : null;

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-3 rounded-md text-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {error}
      </div>
    );
  }

  if (convertedAmount === null) {
    return null;
  }

  return (
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
  );
};

export default ConversionResult;
