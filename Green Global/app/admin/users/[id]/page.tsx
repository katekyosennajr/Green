import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { ArrowLeft, User, ShoppingBag, CreditCard, Calendar, Package } from 'lucide-react';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function UserDetailsPage(props: Props) {
    const params = await props.params; // Next.js 15+ param unwrapping
    const user = await prisma.user.findUnique({
        where: { id: params.id }
    });

    if (!user) {
        notFound();
    }

    // Find orders by email to include guest checkouts by this user
    const orders = await prisma.order.findMany({
        where: {
            OR: [
                { userId: user.id },
                { guestEmail: user.email }
            ]
        },
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                include: { product: true }
            }
        }
    });

    // Calculate Stats
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((acc, order) => {
        // Only count PAID orders for revenue, or all? Usually verified revenue.
        // Let's count all for "Potential LTV" but maybe distinguish.
        // For simplicity: Total Value of all orders placed.
        return acc + order.totalUsd;
    }, 0);
    const lastOrderDate = orders.length > 0 ? orders[0].createdAt : null;

    // Item aggregation
    const distinctItems = new Map<string, { name: string, quantity: number, image: string }>();
    orders.forEach(order => {
        order.items.forEach(item => {
            const existing = distinctItems.get(item.productId) || { name: item.product.name, quantity: 0, image: item.product.images };
            existing.quantity += item.quantity;
            distinctItems.set(item.productId, existing);
        });
    });

    return (
        <div>
            <div className="mb-8">
                <Link href="/admin/users" className="inline-flex items-center text-sm text-green-600 hover:text-green-800 font-bold mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Users
                </Link>
                <h1 className="text-3xl font-serif font-bold text-green-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                        <User className="w-5 h-5" />
                    </div>
                    {user.name || 'Anonymous User'}
                </h1>
                <p className="text-green-600 ml-14">{user.email} • Joined {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gold-100 text-gold-700 rounded-lg">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-green-600">Total Spend</p>
                            <p className="text-2xl font-bold text-green-900">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalSpent)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-green-600">Total Orders</p>
                            <p className="text-2xl font-bold text-green-900">{totalOrders}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-700 rounded-lg">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-green-600">Last Purchase</p>
                            <p className="text-lg font-bold text-green-900">
                                {lastOrderDate ? new Date(lastOrderDate).toLocaleDateString() : 'Never'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order History */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Order History
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-green-50 text-green-900 font-bold text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 border-b border-green-100">Order ID</th>
                                    <th className="p-4 border-b border-green-100">Date</th>
                                    <th className="p-4 border-b border-green-100">Total</th>
                                    <th className="p-4 border-b border-green-100">Status</th>
                                    <th className="p-4 border-b border-green-100">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-green-50">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-green-50/50 transition-colors">
                                        <td className="p-4 font-mono text-xs text-green-700">{order.id.slice(0, 8)}...</td>
                                        <td className="p-4 text-sm text-green-800">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-sm font-bold text-green-900">
                                            ${order.totalUsd.toFixed(2)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <Link href={`/admin/orders/${order.id}`} className="text-xs text-blue-600 hover:underline font-bold">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-6 text-center text-green-500">No orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Products Purchased */}
                <div>
                    <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Purchased Items
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden p-0">
                        {distinctItems.size > 0 ? (
                            <ul className="divide-y divide-green-50">
                                {Array.from(distinctItems.entries()).map(([id, item]) => {
                                    let img = '/images/placeholder.jpg';
                                    try {
                                        const parsed = JSON.parse(item.image);
                                        img = parsed[0] || img;
                                    } catch (e) { /* ignore */ }

                                    return (
                                        <li key={id} className="p-4 flex items-center gap-4 hover:bg-green-50/30">
                                            <div className="w-12 h-12 bg-green-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={img} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-green-900 truncate">{item.name}</p>
                                                <p className="text-xs text-green-500">Purchased {item.quantity} times</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="p-6 text-center text-green-500 text-sm">
                                No items purchased yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
