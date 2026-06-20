import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPriceInfo } from '@/lib/utils';

const CartContext = createContext(null);

const CART_KEY = 'ayurved_cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, type = 'product') => {
    setItems(prev => {
      const key = type === 'combo' ? `combo-${product.id}` : `product-${product.id}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + 1 } : i);
      }
      const priceInfo = getPriceInfo(product);
      return [...prev, {
        key,
        id: product.id,
        type,
        name: product.name,
        image: type === 'combo'
          ? product.image_url
          : (product.images?.[0] ? (product.images[0].startsWith('/') ? product.images[0] : `/images/${product.images[0]}`) : ''),
        price: priceInfo.price,
        originalPrice: priceInfo.original_price,
        quantity: 1,
      }];
    });
    setIsOpen(true);
  };

  const removeItem = (key) => {
    setItems(prev => prev.filter(i => i.key !== key));
  };

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) { removeItem(key); return; }
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, total, isOpen, setIsOpen, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
