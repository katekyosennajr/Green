'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StarRatingProps {
    rating: number; // Current rating (0-5)
    maxRating?: number;
    onRatingChange?: (rating: number) => void; // If provided, component is interactive
    className?: string;
    size?: number;
}

export function StarRating({ rating, maxRating = 5, onRatingChange, className, size = 16 }: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState(0);
    const isInteractive = !!onRatingChange;

    return (
        <div className={cn("flex items-center space-x-1", className)}>
            {Array.from({ length: maxRating }).map((_, index) => {
                const starValue = index + 1;
                const isActive = starValue <= (hoverRating || rating);

                return (
                    <button
                        key={index}
                        type={isInteractive ? "button" : undefined}
                        disabled={!isInteractive}
                        onClick={() => onRatingChange?.(starValue)}
                        onMouseEnter={() => isInteractive && setHoverRating(starValue)}
                        onMouseLeave={() => isInteractive && setHoverRating(0)}
                        className={cn(
                            "transition-colors focus:outline-none",
                            isInteractive ? "cursor-pointer" : "cursor-default"
                        )}
                    >
                        <Star
                            size={size}
                            className={cn(
                                isActive ? "fill-gold-400 text-gold-400" : "fill-transparent text-gray-300",
                                "transition-all duration-200"
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}
