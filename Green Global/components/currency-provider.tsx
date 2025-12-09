'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'IDR';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    formatPrice: (priceUsd: number) => string;
    convertPrice: (priceUsd: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Fixed rate for MVP. 
// In a real app, this would be fetched from an API.
const EXCHANGE_RATE = 16000;

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('USD');

    // Persist preference
    useEffect(() => {
        const saved = localStorage.getItem('currency');
        if (saved === 'USD' || saved === 'IDR') {
            // eslint-disable-next-line
            setCurrency(saved);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    const convertPrice = (priceUsd: number) => {
        if (currency === 'IDR') {
            return priceUsd * EXCHANGE_RATE;
        }
        return priceUsd;
    };

    const formatPrice = (priceUsd: number) => {
        if (currency === 'IDR') {
            const priceIdr = convertPrice(priceUsd);
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(priceIdr);
        }

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(priceUsd);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
