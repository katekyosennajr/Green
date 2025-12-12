'use client';

import { useCart } from '@/components/cart-provider';
import { ShoppingBag, Loader2, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface QuickAddToCartButtonProps {
    product: {
        id: string;
        name: string;
        priceUsd: number;
        images: string;
        slug: string;
        scientificName?: string;
    };
    className?: string;
}

export function QuickAddToCartButton({ product, className }: QuickAddToCartButtonProps) {
    const { addItem } = useCart();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to product page
        e.stopPropagation();

        setStatus('loading');

        // Simulate a small delay for better UX feel or if we eventually call API
        setTimeout(() => {
            addItem({
                id: product.id,
                name: product.name,
                priceUsd: product.priceUsd,
                images: product.images,
                slug: product.slug
            });
            setStatus('success');

            setTimeout(() => {
                setStatus('idle');
            }, 2000);
        }, 500);
    };

    return (
        <button
            onClick={handleAdd}
            disabled={status !== 'idle'}
            className={cn(
                "p-3 rounded-full shadow-lg transition-all duration-300 z-10 flex items-center justify-center",
                status === 'success' ? "bg-gold-500 text-white" : "bg-white/90 hover:bg-gold-500 hover:text-white text-green-900",
                className
            )}
            aria-label="Add to cart"
        >
            {status === 'idle' && <ShoppingBag className="w-5 h-5" />}
            {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
            {status === 'success' && <Check className="w-5 h-5" />}
        </button>
    );
}
