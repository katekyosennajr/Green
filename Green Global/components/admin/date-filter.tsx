'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent } from 'react';

export function DateFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentFilter = searchParams.get('filter') || 'all';

    const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const params = new URLSearchParams(searchParams);
        if (value === 'all') {
            params.delete('filter');
        } else {
            params.set('filter', value);
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter Date:</span>
            <select
                value={currentFilter}
                onChange={handleFilterChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
            >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="this_year">This Year</option>
            </select>
        </div>
    );
}
