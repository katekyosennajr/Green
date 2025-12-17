'use client';

import { useState } from 'react';
import { ArrowDown, Filter } from 'lucide-react';

interface Order {
    id: string;
    createdAt: Date | string;
    guestEmail: string | null;
    status: string;
    paymentStatus: string;
    totalUsd: number;
    shippingCourier: string | null;
    currency: string;
    paymentTotal: number;
}

interface Props {
    orders: Order[]; // Expect updated order object with currency fields
}

export function ExportOrdersButton({ orders }: Props) {
    const [filter, setFilter] = useState<'ALL' | 'IDR' | 'USD'>('ALL');
    const [isOpen, setIsOpen] = useState(false);

    const downloadCSV = () => {
        // 1. FILTER Logic
        let filteredOrders = orders;
        if (filter === 'IDR') {
            filteredOrders = orders.filter(o => o.currency === 'IDR');
        } else if (filter === 'USD') {
            filteredOrders = orders.filter(o => o.currency !== 'IDR'); // Assume anything not IDR is USD
        }

        // 2. CSV Generation
        const headers = ['Order ID', 'Date', 'Customer Email', 'Status', 'Payment', 'Currency', 'Total Amount', 'Courier'];

        const rows = filteredOrders.map(order => {
            // Determine display amount: prioritize paymentTotal/IDR, fallback to totalUsd
            const val = order.currency === 'IDR'
                ? (order.paymentTotal || order.totalUsd * 16000)
                : order.totalUsd;

            const formattedAmount = order.currency === 'IDR'
                ? `Rp. ${new Intl.NumberFormat('id-ID').format(val)}`
                : `$${val.toFixed(2)}`;

            return [
                order.id,
                new Date(order.createdAt).toISOString().split('T')[0],
                order.guestEmail || 'N/A',
                order.status,
                order.paymentStatus,
                order.currency || 'USD',
                formattedAmount,
                order.shippingCourier || '-'
            ];
        });

        const processRow = (row: (string | number)[]) => row.map(val => `"${val}"`).join(',');

        const csvContent = [
            headers.join(','),
            ...rows.map(processRow)
        ].join('\n');

        // 3. Download Trigger
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_${filter.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-sm font-bold shadow-sm"
            >
                <ArrowDown className="w-4 h-4" /> Export: {filter}
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white border border-green-100 rounded-xl shadow-lg p-2 z-10 w-48 flex flex-col gap-1">
                    <p className="px-2 py-1 text-xs font-bold text-gray-400 uppercase">Select Currency</p>
                    {['ALL', 'IDR', 'USD'].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setFilter(mode as any)}
                            className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${filter === mode ? 'bg-green-100 text-green-800 font-bold' : 'hover:bg-green-50 text-gray-600'}`}
                        >
                            {mode === 'ALL' ? 'All Currencies' : `${mode} Only`}
                        </button>
                    ))}
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button
                        onClick={downloadCSV}
                        className="w-full bg-green-900 text-white text-sm font-bold py-2 rounded-lg hover:bg-gold-600 transition-colors"
                    >
                        Download CSV
                    </button>
                </div>
            )}
        </div>
    );
}
