
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Trash2 } from 'lucide-react';
import { translations } from '@/lib/translations';
import { toast } from '@/hooks/use-toast';
import CurrencySelect from '@/components/CurrencySelect';

interface AlertsTabProps {
  language: string;
}

interface PriceAlert {
  id: string;
  cryptoCurrency: string;
  targetPrice: number;
  direction: 'above' | 'below';
  createdAt: number;
  triggered?: boolean;
}

const AlertsTab: React.FC<AlertsTabProps> = ({ language }) => {
  const t = translations[language];
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [cryptoCurrency, setCryptoCurrency] = useState('bitcoin');
  const [targetPrice, setTargetPrice] = useState('');
  const [direction, setDirection] = useState<'above' | 'below'>('above');

  // Load alerts from localStorage
  useEffect(() => {
    const storedAlerts = localStorage.getItem('cryptoPriceAlerts');
    if (storedAlerts) {
      try {
        setAlerts(JSON.parse(storedAlerts));
      } catch (error) {
        console.error('Error parsing alerts from localStorage', error);
      }
    }
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    localStorage.setItem('cryptoPriceAlerts', JSON.stringify(alerts));
  }, [alerts]);

  // Check alerts every minute
  useEffect(() => {
    const checkAlerts = async () => {
      if (alerts.length === 0) return;
      
      try {
        const cryptoIds = [...new Set(alerts.map(alert => alert.cryptoCurrency))].join(',');
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch prices');
        }
        
        const prices = await response.json();
        
        let updatedAlerts = [...alerts];
        let alertTriggered = false;
        
        updatedAlerts = updatedAlerts.map(alert => {
          if (alert.triggered) return alert;
          
          const currentPrice = prices[alert.cryptoCurrency]?.usd;
          if (!currentPrice) return alert;
          
          if (
            (alert.direction === 'above' && currentPrice >= alert.targetPrice) ||
            (alert.direction === 'below' && currentPrice <= alert.targetPrice)
          ) {
            alertTriggered = true;
            toast({
              title: t.alertTriggered || 'Price Alert Triggered!',
              description: `${alert.cryptoCurrency.toUpperCase()} price is now ${currentPrice} USD`,
            });
            return { ...alert, triggered: true };
          }
          
          return alert;
        });
        
        if (alertTriggered) {
          setAlerts(updatedAlerts);
        }
      } catch (error) {
        console.error('Error checking alerts:', error);
      }
    };
    
    const intervalId = setInterval(checkAlerts, 60000);
    return () => clearInterval(intervalId);
  }, [alerts, t]);

  const addAlert = () => {
    if (!targetPrice || isNaN(Number(targetPrice)) || Number(targetPrice) <= 0) {
      toast({
        title: t.errorTitle,
        description: t.invalidPrice || 'Please enter a valid price',
        variant: "destructive",
      });
      return;
    }
    
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      cryptoCurrency,
      targetPrice: Number(targetPrice),
      direction,
      createdAt: Date.now()
    };
    
    setAlerts([...alerts, newAlert]);
    setTargetPrice('');
    
    toast({
      title: t.successTitle,
      description: t.alertAdded || 'Price alert added',
    });
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast({
      title: t.successTitle,
      description: t.alertRemoved || 'Price alert removed',
    });
  };

  return (
    <div className="p-6 bg-card rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {t.alertsTitle}
      </h3>
      
      <div className="space-y-6">
        <Card className="p-4">
          <CardContent className="p-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  {t.selectCrypto}
                </label>
                <CurrencySelect
                  id="alertCrypto"
                  value={cryptoCurrency}
                  onChange={setCryptoCurrency}
                  isCrypto={true}
                  language={language}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  {t.targetPrice || 'Target Price (USD)'}
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="0.00"
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    checked={direction === 'above'}
                    onChange={() => setDirection('above')}
                  />
                  <span className="ml-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    {t.priceAbove || 'Price goes above'}
                  </span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    checked={direction === 'below'}
                    onChange={() => setDirection('below')}
                  />
                  <span className="ml-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    {t.priceBelow || 'Price goes below'}
                  </span>
                </label>
              </div>
              
              <Button className="sm:ml-auto" onClick={addAlert}>
                <Bell className="h-4 w-4 mr-2" />
                {t.addAlert || 'Add Alert'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <h4 className="font-medium mt-6 mb-2" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {t.yourAlerts || 'Your Alerts'}
        </h4>
        
        {alerts.length === 0 ? (
          <p className="text-muted-foreground" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {t.noAlerts || 'No alerts set'}
          </p>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => (
              <Card key={alert.id} className={`p-3 ${alert.triggered ? 'bg-primary/10' : ''}`}>
                <CardContent className="p-0 flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {alert.cryptoCurrency.toUpperCase()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {alert.direction === 'above' ? 
                        (t.alertAbove || 'Alert when above') : 
                        (t.alertBelow || 'Alert when below')} ${alert.targetPrice}
                    </div>
                    {alert.triggered && (
                      <div className="text-sm text-primary font-semibold mt-1">
                        {t.alertTriggered || 'Triggered!'}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => removeAlert(alert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsTab;
