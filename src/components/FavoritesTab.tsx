
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { translations } from '@/lib/translations';
import { Trash2 } from 'lucide-react';
import CurrencySelect from '@/components/CurrencySelect';
import { toast } from '@/hooks/use-toast';

interface FavoritesTabProps {
  language: string;
  onSelectConversion: (fromCurrency: string, toCurrency: string, amount: number) => void;
}

const FavoritesTab: React.FC<FavoritesTabProps> = ({ language, onSelectConversion }) => {
  const t = translations[language];
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="p-6 bg-card rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {t.favoritesTitle}
        </h3>
        <p className="text-muted-foreground" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {t.noFavorites || 'You have no saved favorites yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {t.favoritesTitle}
      </h3>
      
      <div className="space-y-4">
        {favorites.map((favorite, index) => (
          <Card key={index} className="p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{favorite.amount}</span>
                    <span className="text-muted-foreground">{favorite.fromCurrency.toUpperCase()} → {favorite.toCurrency.toUpperCase()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onSelectConversion(favorite.fromCurrency, favorite.toCurrency, favorite.amount)}
                  >
                    {t.selectConversion || 'Use'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => {
                      removeFavorite(favorite.fromCurrency, favorite.toCurrency);
                      toast({
                        title: t.successTitle,
                        description: t.removedFromFavorites || 'Removed from favorites',
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoritesTab;
