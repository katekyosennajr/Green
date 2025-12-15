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

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc'); // Default to asc for new column? User said asc or desc. Usually text asc, numbers desc. 
            // Let's just toggle. But user asked for sort.
            // Logic: if clicking new, start asc? Or maybe context aware?
            // "total numbers" usually want DESC (highest first). "Email" usually ASC. 
            // I'll stick to simple toggle starting ASC for simplicity, or DESC if it was already active elsewhere.
            // Actually, let's stick to standard behavior: first click -> asc, second -> desc.
            // Except for logic where numbers usually imply "top" -> desc. 
            // I'll stick to standard: click -> asc (except maybe dates? default desc).
            // Let's implement generic toggle.
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

    return (
        <div>
            <table className="w-full text-left border-collapse">
                <thead className="bg-green-50 text-green-900 font-bold text-sm uppercase tracking-wider">
                    <tr>
                        <HeaderCell label="Customer (Email)" colKey="email" />
                        <HeaderCell label="Total Orders" colKey="totalOrders" />
                        <HeaderCell label="Total Spend (USD)" colKey="totalSpend" />
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
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cust.totalSpend)}
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
