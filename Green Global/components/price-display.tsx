'use client';

import { useCurrency } from '@/components/currency-provider';

export function PriceDisplay({ amountUsd, className }: { amountUsd: number, className?: string }) {
    const { formatPrice } = useCurrency();
    return <span className={className}>{formatPrice(amountUsd)}</span>;
}
