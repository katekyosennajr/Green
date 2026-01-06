'use client';

import { useCart } from '@/components/cart-provider';
import { ShoppingBag, Loader2, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
        e.preventDefault();
        e.stopPropagation();

        setStatus('loading');

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
        <motion.button
            onClick={handleAdd}
            disabled={status !== 'idle'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
                "p-3 rounded-full shadow-lg z-10 flex items-center justify-center", // Removed transition-all to let motion handle it
                status === 'success' ? "bg-gold-500 text-white" : "bg-white/90 hover:bg-gold-500 hover:text-white text-green-900",
                className
            )}
            aria-label="Add to cart"
        >
            <AnimatePresence mode="wait">
                {status === 'idle' && (
                    <motion.div
                        key="idle"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ShoppingBag className="w-5 h-5" />
                    </motion.div>
                )}
                {status === 'loading' && (
                    <motion.div
                        key="loading"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </motion.div>
                )}
                {status === 'success' && (
                    <motion.div
                        key="success"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Check className="w-5 h-5" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
