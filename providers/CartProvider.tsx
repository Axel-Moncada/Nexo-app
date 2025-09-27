import React, { createContext, useContext, useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: string;
  rating: number;
  image: string;
  description?: string;
  category?: string;
  isFavorite: boolean;
};

type CartItem = Product & {
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  getCartTotal: () => 0,
  getCartItemsCount: () => 0,
  clearCart: () => {},
});

export const useCart = () => {
  return useContext(CartContext);
};

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        // Si ya existe, aumentar la cantidad
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si no existe, agregarlo con cantidad 1
        console.log(`Agregando ${product.name} al carrito`);
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => {
      console.log(`Removiendo producto con id ${id} del carrito`);
      return prev.filter(item => item.id !== id);
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartItemsCount = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
    console.log('Carrito limpiado');
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartItemsCount,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}