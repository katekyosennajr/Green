'use client';

import { useCart } from '@/components/cart-provider';
import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';

interface AddToCartButtonProps {
    product: {
        id: string;
        name: string;
        priceUsd: number;
        images: string;
        slug: string;
    };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addItem } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = () => {
        addItem(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAdd}
            className={`w-full text-lg font-bold py-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 ${isAdded
                    ? 'bg-gold-500 text-white'
                    : 'bg-green-800 hover:bg-green-900 text-white hover:shadow-xl'
                }`}
        >
            <ShoppingBag className="w-5 h-5" />
            {isAdded ? 'Added to Cart' : 'Add to Cart'}
        </button>
    );
}
