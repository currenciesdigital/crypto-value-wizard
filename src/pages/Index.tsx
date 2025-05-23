
import React, { useState, useEffect } from 'react';
import CurrencyConverter from '@/components/CurrencyConverter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSelector } from '@/components/LanguageSelector';
import { translations } from '@/lib/translations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsageStats from '@/components/UsageStats';
import Footer from '@/components/Footer';
import TrendingTab from '@/components/TrendingTab';
import FavoritesTab from '@/components/FavoritesTab';
import AlertsTab from '@/components/AlertsTab';

const Index = () => {
  const [language, setLanguage] = useState('ar');
  const t = translations[language];
  const [fromCurrency, setFromCurrency] = useState('bitcoin');
  const [toCurrency, setToCurrency] = useState('usd');
  const [amount, setAmount] = useState(1);

  // Handler for selecting a favorite conversion
  const handleSelectConversion = (from: string, to: string, amt: number) => {
    setFromCurrency(from);
    setToCurrency(to);
    setAmount(amt);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-10">
      {/* Header section */}
      <header className="w-full py-6 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {t.appTitle}
          </h1>
          <p className="text-muted-foreground mt-2 text-center md:text-left" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {t.appDescription}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector language={language} setLanguage={setLanguage} />
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="converter" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="converter">{t.converter}</TabsTrigger>
              <TabsTrigger value="trending">{t.trending}</TabsTrigger>
              <TabsTrigger value="favorites">{t.favorites}</TabsTrigger>
              <TabsTrigger value="alerts">{t.alerts}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="converter" className="mt-6">
              <CurrencyConverter 
                language={language} 
                initialFromCurrency={fromCurrency}
                initialToCurrency={toCurrency}
                initialAmount={amount}
              />
            </TabsContent>
            
            <TabsContent value="trending" className="mt-6">
              <TrendingTab language={language} />
            </TabsContent>
            
            <TabsContent value="favorites" className="mt-6">
              <FavoritesTab 
                language={language} 
                onSelectConversion={handleSelectConversion}
              />
            </TabsContent>
            
            <TabsContent value="alerts" className="mt-6">
              <AlertsTab language={language} />
            </TabsContent>
          </Tabs>
          
          <UsageStats language={language} />
        </div>
      </main>
      
      <Footer language={language} />
    </div>
  );
};

export default Index;
