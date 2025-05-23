
import { useState, useEffect } from 'react';

interface Conversion {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Conversion[]>([]);

  useEffect(() => {
    // Load favorites from localStorage on component mount
    const storedFavorites = localStorage.getItem('cryptoFavorites');
    if (storedFavorites) {
      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
      } catch (error) {
        console.error('Error parsing favorites from localStorage', error);
        setFavorites([]);
      }
    }
  }, []);

  const addFavorite = (conversion: Conversion) => {
    setFavorites(prevFavorites => {
      // Check if already exists
      const exists = prevFavorites.some(
        item => 
          item.fromCurrency === conversion.fromCurrency && 
          item.toCurrency === conversion.toCurrency
      );

      if (exists) {
        return prevFavorites;
      }

      const newFavorites = [...prevFavorites, conversion];
      localStorage.setItem('cryptoFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const removeFavorite = (fromCurrency: string, toCurrency: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.filter(
        item => !(item.fromCurrency === fromCurrency && item.toCurrency === toCurrency)
      );
      localStorage.setItem('cryptoFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (fromCurrency: string, toCurrency: string) => {
    return favorites.some(
      item => 
        item.fromCurrency === fromCurrency && 
        item.toCurrency === toCurrency
    );
  };

  return { favorites, addFavorite, removeFavorite, isFavorite };
};
