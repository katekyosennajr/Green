'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { useCurrency } from '@/components/currency-provider';

export function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Use Global Currency State
    const { currency, setCurrency } = useCurrency();
    const RATE = 16000; // Ideally import this or expose from context, but safe for now to keep consistent

    // Helper: Format number with dots for IDR, or raw for USD
    const formatNumber = (val: string, curr: 'USD' | 'IDR') => {
        if (!val) return '';
        const clean = val.replace(/\D/g, ''); // Remove non-digits
        if (curr === 'USD') return clean; // USD usually raw in this simple filter
        return new Intl.NumberFormat('id-ID').format(Number(clean));
    };

    // Helper: Clean formatting to get raw number string
    const cleanNumber = (val: string) => {
        return val.replace(/\./g, '').replace(/,/g, '');
    };

    // Helper to format/parse (Updates to handle IDR conversion + Formatting)
    const toDisplay = (usdVal: string) => {
        if (!usdVal) return '';
        if (currency === 'USD') return usdVal;
        const idrVal = Math.round(Number(usdVal) * RATE);
        return new Intl.NumberFormat('id-ID').format(idrVal);
    };

    const toUsd = (displayVal: string) => {
        if (!displayVal) return '';
        const raw = cleanNumber(displayVal);
        if (currency === 'USD') return raw;
        return (Number(raw) / RATE).toString();
    };

    // -- State --
    // We initialize state from URL params
    const [query, setQuery] = useState(searchParams.get('query') || '');
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
    const [category, setCategory] = useState(searchParams.get('category') || '');

    // Local State for Price Inputs (Formatted strings)
    const [localMin, setLocalMin] = useState('');
    const [localMax, setLocalMax] = useState('');

    // Mobile Drawer State
    const [isOpen, setIsOpen] = useState(false);

    // Debounce Search Text (300ms)
    const [debouncedQuery] = useDebounce(query, 500);

    // Sync Local State when URL or Currency changes
    useEffect(() => {
        const urlMin = searchParams.get('minPrice') || '';
        const urlMax = searchParams.get('maxPrice') || '';
        setLocalMin(toDisplay(urlMin));
        setLocalMax(toDisplay(urlMax));
    }, [currency, searchParams]); // Re-run when currency changes to convert displayed values

    const [debouncedLocalMin] = useDebounce(localMin, 500);
    const [debouncedLocalMax] = useDebounce(localMax, 500);

    // -- Effect: Update URL when debounced values change --
    useEffect(() => {
        // Construct new URLSearchParams
        const params = new URLSearchParams(searchParams.toString());

        // Update Query
        if (debouncedQuery) params.set('query', debouncedQuery);
        else params.delete('query');

        // Update Price (Convert Local -> USD)
        const usdMin = toUsd(debouncedLocalMin);
        if (usdMin && Number(usdMin) > 0) params.set('minPrice', usdMin);
        else params.delete('minPrice');

        const usdMax = toUsd(debouncedLocalMax);
        if (usdMax && Number(usdMax) > 0) params.set('maxPrice', usdMax);
        else params.delete('maxPrice');

        // Update Sort
        if (sort && sort !== 'newest') params.set('sort', sort);
        else params.delete('sort');

        // Update Category
        if (category && category !== 'All') params.set('category', category);
        else params.delete('category');

        // Prevent infinite loop: Only update if params actually changed
        if (params.toString() !== searchParams.toString()) {
            router.replace(`/catalog?${params.toString()}`, { scroll: false });
        }
    }, [debouncedQuery, debouncedLocalMin, debouncedLocalMax, sort, category, router, searchParams]); // Removed direct dependency on currency/searchParams to avoid loops, relying on debounced values
    // Actually, we must be careful not to overwrite URL if we just switched currency.
    // The previous useEffect handles sync FROM URL. This handles Sync TO URL.

    // -- Handlers --
    const clearFilters = () => {
        setQuery('');
        setLocalMin('');
        setLocalMax('');
        setSort('newest');
        setCategory('');
        router.replace('/catalog');
    };

    const handlePriceChange = (val: string, setter: (v: string) => void) => {
        // Only allow digits (and dots which are added by formatter)
        // But for typing, we strip everything first then re-format
        const raw = val.replace(/\D/g, '');
        if (!raw) {
            setter('');
            return;
        }

        // Format immediately
        if (currency === 'IDR') {
            setter(new Intl.NumberFormat('id-ID').format(Number(raw)));
        } else {
            setter(raw);
        }
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-green-200 rounded-lg text-green-900 font-bold shadow-sm mb-6 w-full justify-center"
            >
                <SlidersHorizontal className="w-4 h-4" /> Filters & Search
            </button>

            {/* Sidebar Container */}
            <div className={`
                fixed inset-0 z-50 bg-white p-6 transform transition-transform duration-300 ease-in-out md:relative md:transform-none md:inset-auto md:bg-transparent md:p-0 md:block md:z-auto
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="flex justify-between items-center md:hidden mb-6">
                    <h2 className="font-serif text-2xl font-bold text-green-900">Filters</h2>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* 1. Search */}
                    <div>
                        <h3 className="font-bold text-green-900 mb-3 text-sm uppercase tracking-wider">Search</h3>
                        <div className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search plants..."
                                className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm text-green-900 placeholder:text-green-900/40"
                            />
                            <Search className="w-4 h-4 text-green-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    {/* 2. Categories */}
                    <div>
                        <h3 className="font-bold text-green-900 mb-3 text-sm uppercase tracking-wider">Categories</h3>
                        <div className="space-y-2">
                            {['All', 'Scindapsus', 'Monstera', 'Variegated'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat === 'All' ? '' : cat)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${(category === cat || (cat === 'All' && !category))
                                        ? 'bg-green-100 text-green-900 font-bold'
                                        : 'text-gray-600 hover:bg-green-50'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. Price Range */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-green-900 text-sm uppercase tracking-wider">Price ({currency})</h3>
                            <div className="flex bg-green-50 rounded p-0.5">
                                <button
                                    onClick={() => setCurrency('USD')}
                                    className={`px-2 py-0.5 text-xs rounded transition-all ${currency === 'USD' ? 'bg-white shadow text-green-800 font-bold' : 'text-green-600'}`}
                                >
                                    $
                                </button>
                                <button
                                    onClick={() => setCurrency('IDR')}
                                    className={`px-2 py-0.5 text-xs rounded transition-all ${currency === 'IDR' ? 'bg-white shadow text-green-800 font-bold' : 'text-green-600'}`}
                                >
                                    Rp
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{currency === 'IDR' ? 'Rp' : '$'}</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={localMin}
                                    onChange={(e) => handlePriceChange(e.target.value, setLocalMin)}
                                    placeholder="Min"
                                    className="w-full pl-8 pr-2 py-2 border border-green-200 rounded-lg text-sm outline-none focus:border-green-500"
                                />
                            </div>
                            <span className="text-gray-400">-</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{currency === 'IDR' ? 'Rp' : '$'}</span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={localMax}
                                    onChange={(e) => handlePriceChange(e.target.value, setLocalMax)}
                                    placeholder="Max"
                                    className="w-full pl-8 pr-2 py-2 border border-green-200 rounded-lg text-sm outline-none focus:border-green-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4. Sort */}
                    <div>
                        <h3 className="font-bold text-green-900 mb-3 text-sm uppercase tracking-wider">Sort By</h3>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full p-2 border border-green-200 rounded-lg text-sm outline-none focus:border-green-500 bg-white text-green-900"
                        >
                            <option value="newest">Newest Arrivals</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>

                    {/* Reset */}
                    <button
                        onClick={clearFilters}
                        className="w-full py-2 text-sm text-green-600 underline hover:text-green-800 transition-colors"
                    >
                        Clear All Filters
                    </button>
                </div>
            </div>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                ></div>
            )}
        </>
    );
}
