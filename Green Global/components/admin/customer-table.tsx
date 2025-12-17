'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, ArrowUp, ArrowDown } from 'lucide-react';

interface Customer {
    email: string;
    name: string;
    totalOrders: number;
    totalSpend: number;
    lastOrderDate: string; // Serialized date
}

interface Props {
    customers: Customer[];
}

type SortKey = 'email' | 'totalOrders' | 'totalSpend' | 'lastOrderDate';

export function CustomerTable({ customers: initialCustomers }: Props) {
    const [sortKey, setSortKey] = useState<SortKey>('lastOrderDate');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
    const [currency, setCurrency] = useState<'USD' | 'IDR'>('USD');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const sortedCustomers = [...initialCustomers].sort((a, b) => {
        const modifier = sortDir === 'asc' ? 1 : -1;

        switch (sortKey) {
            case 'email':
                return a.email.localeCompare(b.email) * modifier;
            case 'totalOrders':
                return (a.totalOrders - b.totalOrders) * modifier;
            case 'totalSpend':
                return (a.totalSpend - b.totalSpend) * modifier;
            case 'lastOrderDate':
                return (new Date(a.lastOrderDate).getTime() - new Date(b.lastOrderDate).getTime()) * modifier;
            default:
                return 0;
        }
    });

    const convert = (val: number) => currency === 'IDR' ? val * 16000 : val;
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat(currency === 'IDR' ? 'id-ID' : 'en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 2
        }).format(val);
    };

    const SortIcon = ({ colKey }: { colKey: SortKey }) => {
        if (sortKey !== colKey) return <div className="w-4 h-4" />; // Placeholder for layout stability or just hidden
        // User said: "muncul saat cursor di drag ke font ... baru dia muncul" (appear on hover)
        // AND "tanda panahnya ... dibuat muncul saat cursor di drag"
        // This implies conditional visibility on hover OR just showing active sort always, and others on hover?
        // Usually, ACTIVE sort direction should be visible. HOVER triggers potentiality.
        // But user request specific: "panah ... muncul saat cursor di drag ... baru dia muncul"
        // Meaning: headers shouldn't have arrows by default unless hovered? 
        // Wait, current active sort MUST be visible to know state.
        // Ill start with: Active sort visible. Inactive sort hidden until hover (group-hover).
        return sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
    };

    const HeaderCell = ({ label, colKey, align = 'left' }: { label: string, colKey: SortKey, align?: string }) => (
        <th
            className={`p-4 border-b border-green-100 cursor-pointer group select-none hover:bg-green-100/50 transition-colors text-${align}`}
            onClick={() => handleSort(colKey)}
        >
            <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
                {label}
                <span className={`text-green-600 transition-opacity duration-200 ${sortKey === colKey ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                    {/* Always render icon to prevent layout shift? Or just use flex gap */}
                    {sortKey === colKey ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUp className="w-3 h-3" />}
                </span>
            </div>
        </th>
    );

    if (sortedCustomers.length === 0) {
        return (
            <div className="p-12 text-center">
                <p className="text-green-800 font-bold">No purchase history found.</p>
                <p className="text-sm text-green-500 mt-1">Customers will appear here once orders are placed.</p>
            </div>
        );
    }

    const downloadCSV = () => {
        const headers = ['Email', 'Total Orders', `Total Spend (${currency})`, 'Last Active'];
        const rows = sortedCustomers.map(c => [
            c.email,
            c.totalOrders,
            convert(c.totalSpend).toFixed(2),
            new Date(c.lastOrderDate).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border-b border-green-50">
                {/* Currency Toggle */}
                <div className="flex bg-green-50 rounded-lg p-1 border border-green-100">
                    <button
                        onClick={() => setCurrency('USD')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${currency === 'USD'
                            ? 'bg-white text-green-800 shadow-sm ring-1 ring-green-200'
                            : 'text-green-600 hover:text-green-800'
                            }`}
                    >
                        USD ($)
                    </button>
                    <button
                        onClick={() => setCurrency('IDR')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${currency === 'IDR'
                            ? 'bg-white text-green-800 shadow-sm ring-1 ring-green-200'
                            : 'text-green-600 hover:text-green-800'
                            }`}
                    >
                        IDR (Rp)
                    </button>
                </div>

                <button
                    onClick={downloadCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs font-bold uppercase tracking-wider"
                >
                    <ArrowDown className="w-4 h-4" /> Export CSV ({currency})
                </button>
            </div>
            <table className="w-full text-left border-collapse">
                <thead className="bg-green-50 text-green-900 font-bold text-sm uppercase tracking-wider">
                    <tr>
                        <HeaderCell label="Customer (Email)" colKey="email" />
                        <HeaderCell label="Total Orders" colKey="totalOrders" />
                        <HeaderCell label={`Total Spend (${currency})`} colKey="totalSpend" />
                        <HeaderCell label="Last Active" colKey="lastOrderDate" />
                        <th className="p-4 border-b border-green-100">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-green-50">
                    {sortedCustomers.map((cust) => (
                        <tr key={cust.email} className="hover:bg-green-50/50 transition-colors">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-green-800">{cust.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 text-sm text-green-700 font-mono">
                                {cust.totalOrders}
                            </td>
                            <td className="p-4 text-sm font-bold text-green-900">
                                {formatCurrency(convert(cust.totalSpend))}
                            </td>
                            <td className="p-4 text-sm text-green-600">
                                {new Date(cust.lastOrderDate).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </td>
                            <td className="p-4">
                                <Link
                                    href={`/admin/customers/${encodeURIComponent(cust.email)}`}
                                    className="text-xs text-green-600 hover:text-green-800 font-bold hover:underline"
                                >
                                    View Insights
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
