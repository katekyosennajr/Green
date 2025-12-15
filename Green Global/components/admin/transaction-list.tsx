'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TransactionListProps {
    orders: any[]; // Using loose type for simplicity in this specific component, matches aggregated type from page
}

export function TransactionList({ orders }: TransactionListProps) {
    const [showAll, setShowAll] = useState(false);
    const displayedOrders = showAll ? orders : orders.slice(0, 5);

    if (orders.length === 0) {
        return <div className="p-6 text-center text-green-500 text-sm">No transactions found.</div>;
    }

    return (
        <div>
            <div className="max-h-[500px] overflow-y-auto divide-y divide-green-50">
                {displayedOrders.map((order: any) => (
                    <Link href={`/admin/orders/${order.id}`} key={order.id} className="block p-4 hover:bg-green-50 transition-colors">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-mono text-green-500">#{order.id.slice(0, 8)}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                }`}>{order.status}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-green-900">${order.totalUsd.toFixed(2)}</span>
                            <span className="text-xs text-green-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{order.items.length} items</p>
                    </Link>
                ))}
            </div>
            {orders.length > 5 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full py-3 text-xs font-bold text-green-600 hover:bg-green-50 border-t border-green-50 flex items-center justify-center gap-1 transition-colors"
                >
                    {showAll ? (
                        <>Show Less <ChevronUp className="w-3 h-3" /></>
                    ) : (
                        <>View All Transactions ({orders.length}) <ChevronDown className="w-3 h-3" /></>
                    )}
                </button>
            )}
        </div>
    );
}
