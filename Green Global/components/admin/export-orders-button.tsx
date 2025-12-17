'use client';

import { ArrowDown } from 'lucide-react';

interface Order {
    id: string;
    createdAt: Date | string;
    guestEmail: string | null;
    status: string;
    paymentStatus: string;
    totalUsd: number;
    shippingCourier: string | null;
}

interface Props {
    orders: Order[];
}

export function ExportOrdersButton({ orders }: Props) {
    const downloadCSV = () => {
        const headers = ['Order ID', 'Date', 'Customer Email', 'Status', 'Payment Status', 'Total (USD)', 'Courier'];
        const rows = orders.map(order => [
            order.id,
            new Date(order.createdAt).toISOString().split('T')[0], // YYYY-MM-DD
            order.guestEmail || 'N/A',
            order.status,
            order.paymentStatus,
            order.totalUsd.toFixed(2),
            order.shippingCourier || '-'
        ]);

        // Escape CSV values (handle commas in data if any, though likely safe here)
        const processRow = (row: (string | number)[]) => row.map(val => `"${val}"`).join(',');

        const csvContent = [
            headers.join(','),
            ...rows.map(processRow)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition-colors text-sm font-bold shadow-sm"
        >
            <ArrowDown className="w-4 h-4" /> Export CSV
        </button>
    );
}
