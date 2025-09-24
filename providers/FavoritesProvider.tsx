import React, { createContext, useContext, useState, useEffect } from 'react';

type Product = {
  id: number;
  name: string;
  price: string;
  rating: number;
  image: string;
  isFavorite: boolean;
};

type FavoritesContextType = {
  favorites: number[];
  products: Product[];
  toggleFavorite: (id: number) => void;
  setProducts: (products: Product[]) => void;
  getFavoriteProducts: () => Product[];
};

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  products: [],
  toggleFavorite: () => {},
  setProducts: () => {},
  getFavoriteProducts: () => [],
});

export const useFavorites = () => {
  return useContext(FavoritesContext);
};

export default function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        console.log(`Removiendo ${id} de favoritos`);
        return prev.filter(favId => favId !== id);
      } else {
        console.log(`Agregando ${id} a favoritos`);
        return [...prev, id];
      }
    });
  };

  const getFavoriteProducts = (): Product[] => {
    return products.filter(product => favorites.includes(product.id));
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      products,
      toggleFavorite,
      setProducts,
      getFavoriteProducts
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}