
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CurrencySelect from '@/components/CurrencySelect';
import { ArrowDownUp } from 'lucide-react';
import { translations } from '@/lib/translations';
import FavoriteButton from '@/components/FavoriteButton';

interface ConversionFormProps {
  language: string;
  fromCurrency: string;
  setFromCurrency: (value: string) => void;
  toCurrency: string;
  setToCurrency: (value: string) => void;
  amount: number;
  setAmount: (amount: number) => void;
  isFavorite: boolean;
  onSaveAsFavorite: () => void;
  onConvert: () => void;
  onSwap: () => void;
  loading: boolean;
}

const ConversionForm: React.FC<ConversionFormProps> = ({
  language,
  fromCurrency,
  setFromCurrency,
  toCurrency,
  setToCurrency,
  amount,
  setAmount,
  isFavorite,
  onSaveAsFavorite,
  onConvert,
  onSwap,
  loading
}) => {
  const t = translations[language];

  return (
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
            onClick={onSwap} 
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
          onClick={onConvert} 
          className="px-8"
          disabled={loading}
        >
          {loading ? t.converting : t.convert}
        </Button>
        
        <FavoriteButton 
          isFavorite={isFavorite}
          onClick={onSaveAsFavorite} 
          title={t.addToFavorites}
        />
      </div>
    </div>
  );
};

export default ConversionForm;
