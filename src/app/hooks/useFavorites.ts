import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'pausenknopf_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Persist to localStorage whenever favorites change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites]);

  const toggleFavorite = (cardId: string) => {
    setFavorites((prev) =>
      prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId]
    );
  };

  const isFavorite = (cardId: string) => favorites.includes(cardId);

  const getFavoriteCards = () => favorites;

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoriteCards,
  };
}
