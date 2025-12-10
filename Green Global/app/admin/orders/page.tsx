import { PrismaClient } from '@prisma/client';
import { updateOrderStatus, updatePaymentStatus } from '@/app/actions/admin-actions';
import { BadgeCheck, Clock, XCircle, Truck, Package } from 'lucide-react';
import Link from 'next/link';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

import { DateFilter } from '@/components/admin/date-filter';
import { startOfDay, subDays, startOfWeek, startOfMonth, startOfYear, endOfDay } from 'date-fns';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminOrdersPage(props: Props) {
    const searchParams = await props.searchParams;
    const filter = typeof searchParams.filter === 'string' ? searchParams.filter : 'all';

    let where: any = {};
    const now = new Date();

    if (filter === 'today') {
        where.createdAt = { gte: startOfDay(now) };
    } else if (filter === 'yesterday') {
        where.createdAt = {
            gte: startOfDay(subDays(now, 1)),
            lt: startOfDay(now)
        };
    } else if (filter === 'this_week') {
        where.createdAt = { gte: startOfWeek(now) };
    } else if (filter === 'this_month') {
        where.createdAt = { gte: startOfMonth(now) };
    } else if (filter === 'this_year') {
        where.createdAt = { gte: startOfYear(now) };
    }

    const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { items: true }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-green-900">Order Management</h1>
                    <p className="text-green-600">Monitor and manage customer orders.</p>
                </div>
                <div className="flex items-center gap-4">
                    <DateFilter />
                    <div className="bg-white px-4 py-2 rounded-lg border border-green-100 shadow-sm">
                        <span className="text-sm font-bold text-green-900">Revenue: </span>
                        <span className="text-gold-600 font-mono">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
                                orders.reduce((acc, order) => order.paymentStatus === 'PAID' ? acc + order.totalUsd : acc, 0)
                            )}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-green-50 text-green-900 font-bold text-sm uppercase tracking-wider">
                        <tr>
                            <th className="p-4 border-b border-green-100">Order ID</th>
                            <th className="p-4 border-b border-green-100">Date</th>
                            <th className="p-4 border-b border-green-100">Customer</th>
                            <th className="p-4 border-b border-green-100">Items</th>
                            <th className="p-4 border-b border-green-100">Total</th>
                            <th className="p-4 border-b border-green-100">Payment</th>
                            <th className="p-4 border-b border-green-100">Status</th>
                            <th className="p-4 border-b border-green-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-green-50">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-green-50/50 transition-colors">
                                <td className="p-4 font-mono text-xs text-green-700">{order.id.slice(0, 8)}...</td>
                                <td className="p-4 text-sm text-green-800">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-sm text-green-900 font-medium">
                                    {order.guestEmail}<br />
                                    {/* Name and Address are in separate fields usually, assuming guestEmail for now */}
                                </td>
                                <td className="p-4 text-sm text-green-700">
                                    {order.items.length} items
                                </td>
                                <td className="p-4 text-sm font-bold text-green-900">
                                    ${order.totalUsd.toFixed(2)}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                                        order.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.paymentStatus === 'PAID' ? <BadgeCheck className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        {order.paymentStatus}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="p-4">
                                    <div className="space-y-1">
                                        <Link href={`/admin/orders/${order.id}`} className="text-xs text-green-600 hover:text-green-800 font-bold hover:underline block">
                                            View Details
                                        </Link>

                                        <form action={async () => {
                                            'use server';
                                            if (order.status !== 'SHIPPED') {
                                                await updateOrderStatus(order.id, 'SHIPPED');
                                            }
                                        }}>
                                            <button className="text-xs text-blue-600 hover:underline disabled:opacity-50" disabled={order.status === 'SHIPPED'}>
                                                Mark Shipped
                                            </button>
                                        </form>
                                    </div>
                                    {order.paymentStatus !== 'PAID' && (
                                        <form action={async () => {
                                            'use server';
                                            await updatePaymentStatus(order.id, 'PAID');
                                            await updateOrderStatus(order.id, 'SHIPPING_READY');
                                        }}>
                                            <button className="text-xs text-green-600 hover:underline mt-1 block">
                                                Mark Paid
                                            </button>
                                        </form>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="p-8 text-center text-green-600">No orders found.</div>
                )}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        PENDING: 'bg-gray-100 text-gray-800',
        SHIPPING_READY: 'bg-blue-100 text-blue-800',
        SHIPPED: 'bg-purple-100 text-purple-800',
        DELIVERED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-red-100 text-red-800'
    };

    // Fallback
    const style = styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
            {status}
        </span>
    );
}
