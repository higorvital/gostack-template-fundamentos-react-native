import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  console.log(products);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE

      const storageCart = await AsyncStorage.getItem('@GoMarketplace:cart');

      if(storageCart){
        setProducts(JSON.parse(storageCart));

      }

    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {
    // TODO ADD A NEW ITEM TO THE CART

    const productExists = products.find(p => p.id === product.id);

    if(productExists){
      const productsIncreased = products.map(p => p.id === product.id ? {...p, quantity: p.quantity + 1}: p);
      setProducts([...productsIncreased]);

    }else{
      setProducts([...products, {...product, quantity: 1}]);
    }

    await AsyncStorage.setItem('@GoMarketplace:cart', JSON.stringify(products));

  }, [products]);

  const increment = useCallback(async id => {
    // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
    const productsIncreased = products.map(p => p.id === id ? {...p, quantity: p.quantity + 1}: p);
    setProducts([...productsIncreased]);    
    await AsyncStorage.setItem('@GoMarketplace:cart', JSON.stringify(products));


  }, [products]);

  const decrement = useCallback(async id => {
    // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART

    const productsIncreased = products.map(p => p.id === id ? {...p, quantity: p.quantity - 1}: p);
    setProducts([...productsIncreased]);    
    await AsyncStorage.setItem('@GoMarketplace:cart', JSON.stringify(products));

  }, [products]);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
