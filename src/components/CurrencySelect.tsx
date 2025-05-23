
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cryptocurrencies, fiatCurrencies } from '@/lib/currencies';
import { translations } from '@/lib/translations';

interface CurrencySelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  isCrypto: boolean;
  language: string;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({ 
  id, 
  value, 
  onChange, 
  isCrypto,
  language 
}) => {
  const t = translations[language];
  const currencies = isCrypto ? cryptocurrencies : fiatCurrencies;
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <SelectValue placeholder={isCrypto ? t.selectCrypto : t.selectFiat} />
      </SelectTrigger>
      <SelectContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {currencies.map(currency => (
          <SelectItem 
            key={currency.id} 
            value={currency.id}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2">
              {currency.icon && (
                <span className="w-5 h-5 flex items-center justify-center">
                  {currency.icon}
                </span>
              )}
              {currency.name} ({currency.symbol.toUpperCase()})
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelect;
