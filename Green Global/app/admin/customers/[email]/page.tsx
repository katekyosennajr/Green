import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, User, ShoppingBag, CreditCard, Calendar, Package, TrendingUp, Tag } from 'lucide-react';
import { TransactionList } from '@/components/admin/transaction-list';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ email: string }>;
}

export default async function CustomerInsightPage(props: Props) {
    const params = await props.params;
    const decodedEmail = decodeURIComponent(params.email);

    // Fetch orders by email (Guest or User)
    const orders = await prisma.order.findMany({
        where: {
            AND: [
                {
                    OR: [
                        { guestEmail: decodedEmail },
                        { user: { email: decodedEmail } }
                    ]
                },
                {
                    // Filter stats to only include confirmed orders
                    OR: [
                        { paymentStatus: 'PAID' },
                        { status: 'SHIPPED' },
                        { status: 'DELIVERED' },
                        { status: 'PROCESSING' },
                        { status: 'PHYTO_IN_PROGRESS' }
                    ]
                }
            ]
        },
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                include: { product: true }
            },
            user: true
        }
    });

    if (orders.length === 0) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-red-600">Customer Not Found</h1>
                <p>No orders found for {decodedEmail}</p>
                <Link href="/admin/customers" className="text-blue-600 underline mt-4 block">Back</Link>
            </div>
        );
    }

    const registeredUser = orders.find(o => o.user)?.user || null;
    const customerName = registeredUser?.name || decodedEmail.split('@')[0];

    const totalSpent = orders.reduce((acc, o) => acc + o.totalUsd, 0);
    const totalOrders = orders.length;
    const lastOrderDate = orders[0].createdAt;

    // Detailed Item Analysis
    const itemMap = new Map<string, {
        name: string;
        totalQty: number;
        totalSpentOnItem: number;
        image: string;
        lastBought: Date;
    }>();

    orders.forEach(order => {
        order.items.forEach(item => {
            const current = itemMap.get(item.productId) || {
                name: item.product.name,
                totalQty: 0,
                totalSpentOnItem: 0,
                image: item.product.images,
                lastBought: new Date(0)
            };

            current.totalQty += item.quantity;
            current.totalSpentOnItem += item.priceUsd * item.quantity;
            if (new Date(order.createdAt) > current.lastBought) {
                current.lastBought = new Date(order.createdAt);
            }

            itemMap.set(item.productId, current);
        });
    });

    const topItems = Array.from(itemMap.values()).sort((a, b) => b.totalQty - a.totalQty);

    // Discount Logic
    const isWhale = totalSpent > 2000;
    const isLoyal = totalOrders > 3;

    return (
        <div>
            <div className="mb-6">
                <Link href="/admin/customers" className="inline-flex items-center text-xs text-green-600 hover:text-green-800 font-bold mb-3 uppercase tracking-wider">
                    <ArrowLeft className="w-3 h-3 mr-1" />
                    Back
                </Link>

                {/* Simplified Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-green-100 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-700 shadow-sm">
                            <User className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-serif font-bold text-green-900">{customerName}</h1>
                            <div className="flex items-center gap-2 text-sm text-green-600 mt-0.5">
                                <span>{decodedEmail}</span>
                                <span className="w-1 h-1 rounded-full bg-green-300"></span>
                                <span className={`font-medium ${registeredUser ? 'text-blue-600' : 'text-orange-600'}`}>
                                    {registeredUser ? 'Member' : 'Guest'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {(isWhale || isLoyal) && (
                        <div className="bg-gradient-to-r from-gold-50 to-white border border-gold-200 px-4 py-3 rounded-lg flex items-center gap-3 shadow-sm max-w-md">
                            <Tag className="w-5 h-5 text-gold-600" />
                            <div>
                                <h3 className="font-bold text-gold-800 text-xs uppercase">High Value Customer</h3>
                                <p className="text-xs text-gold-700 mt-0.5">
                                    Eligible for <strong>Wholesale Discount</strong>.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Overview - Compact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                    <p className="text-xs font-medium text-green-600 mb-1">Lifetime Spend</p>
                    <p className="text-xl font-bold text-green-900 flex items-center gap-1">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalSpent)}
                        <TrendingUp className="w-3 h-3 text-green-500" />
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                    <p className="text-xs font-medium text-green-600 mb-1">Total Orders</p>
                    <p className="text-xl font-bold text-green-900">{totalOrders}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                    <p className="text-xs font-medium text-green-600 mb-1">Unique Plants</p>
                    <p className="text-xl font-bold text-green-900">{itemMap.size}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                    <p className="text-xs font-medium text-green-600 mb-1">Last Active</p>
                    <p className="text-sm font-bold text-green-900 mt-1">
                        {new Date(lastOrderDate).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product Preferences */}
                <div className="lg:col-span-2">
                    <h2 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Purchased Items Breakdown
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-green-50 text-green-900 font-bold text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-3 border-b border-green-100">Plant Name</th>
                                    <th className="p-3 border-b border-green-100 text-center">Qty</th>
                                    <th className="p-3 border-b border-green-100 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-green-50 text-sm">
                                {topItems.map((item, idx) => {
                                    let img = '/images/placeholder.jpg';
                                    try {
                                        const parsed = JSON.parse(item.image);
                                        img = parsed[0] || img;
                                    } catch (e) { /* ignore */ }

                                    return (
                                        <tr key={idx} className="hover:bg-green-50/50">
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-green-100 overflow-hidden flex-shrink-0">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={img} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="font-medium text-green-900">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-center font-bold text-green-800">
                                                {item.totalQty}
                                            </td>
                                            <td className="p-3 text-right font-mono text-green-700">
                                                ${item.totalSpentOnItem.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Order History */}
                <div>
                    <h2 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Transactions
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                        {/* Use Client Component for Show More */}
                        <TransactionList orders={orders} />
                    </div>
                </div>
            </div>
        </div>
    );
}
