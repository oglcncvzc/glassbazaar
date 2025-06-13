import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import productsData from './Glass_Products.json';

export interface Product {
  Id: number;
  Name: string;
  Category: string;
  Price: number;
  Stock: number;
  InStock: boolean;
  Image: string;
  Rating: number;
  Brand: string;
  Description: string;
  CreatedDate: string;
}

interface ProductContextType {
  products: Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(productsData as Product[]);
  }, []);

  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
}; 