
import React from 'react';
import { translations } from '@/lib/translations';

interface FooterProps {
  language: string;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language];
  
  return (
    <footer className="mt-12 py-6 border-t">
      <div className="container mx-auto text-center text-sm text-muted-foreground" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {t.footerText}
      </div>
    </footer>
  );
};

export default Footer;
