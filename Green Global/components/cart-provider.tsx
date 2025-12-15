'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    slug: string;
}

interface AddToCartInput {
    id: string;
    name: string;
    priceUsd: number;
    images: string;
    slug: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: AddToCartInput) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Muat data keranjang dari local storage
    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                // eslint-disable-next-line
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Gagal memparsing keranjang", e);
            }
        }
    }, []);

    // Simpan data keranjang ke local storage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product: AddToCartInput) => {
        setItems((current) => {
            const existing = current.find((item) => item.id === product.id);
            if (existing) {
                return current.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            const images = JSON.parse(product.images as string || '[]');
            return [...current, {
                id: product.id,
                name: product.name,
                price: product.priceUsd,
                quantity: 1,
                image: images[0] || '',
                slug: product.slug
            }];
        });
    };

    const removeItem = (id: string) => {
        setItems((current) => current.filter((item) => item.id !== id));
    };

    const clearCart = () => setItems([]);

    const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
