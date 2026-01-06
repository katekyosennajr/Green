'use client';

import { Heart } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toggleWishlist } from '@/app/actions/wishlist-actions';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
    productId: string;
    isWishlistedInitially: boolean;
    className?: string;
}

export function WishlistButton({ productId, isWishlistedInitially, className }: WishlistButtonProps) {
    const [isWishlisted, setIsWishlisted] = useState(isWishlistedInitially);
    const [isPending, startTransition] = useTransition();
    const { data: session } = useSession();
    const router = useRouter();

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating if inside a Link card
        e.stopPropagation();

        if (!session) {
            if (confirm("You need to be logged in to save items. Go to login?")) {
                router.push('/login');
            }
            return;
        }

        // Optimistic Update
        const previousState = isWishlisted;
        setIsWishlisted(!previousState);

        startTransition(async () => {
            try {
                await toggleWishlist(productId);
            } catch (error) {
                // Revert on error
                setIsWishlisted(previousState);
                console.error("Failed to update wishlist", error);
                alert("Something went wrong. Please try again.");
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={cn(
                "group p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-500/50",
                isWishlisted
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-white/80 backdrop-blur-sm text-green-700 hover:text-red-500 hover:bg-white",
                className
            )}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart
                className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isWishlisted ? "fill-current" : "fill-none"
                )}
            />
        </button>
    );
}
