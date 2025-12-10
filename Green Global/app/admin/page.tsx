import { PrismaClient } from '@prisma/client';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';

const prisma = new PrismaClient();

import { startOfDay, startOfMonth, startOfYear } from 'date-fns';

async function getStats() {
    const productCount = await prisma.product.count();
    const userCount = await prisma.user.count();
    const orderCount = await prisma.order.count();

    // Revenue calculations
    const today = startOfDay(new Date());
    const thisMonth = startOfMonth(new Date());
    const thisYear = startOfYear(new Date());

    const calcRevenue = async (dateFilter?: Date) => {
        const result = await prisma.order.aggregate({
            _sum: { totalUsd: true },
            where: {
                paymentStatus: 'PAID',
                createdAt: dateFilter ? { gte: dateFilter } : undefined
            }
        });
        return result._sum.totalUsd || 0;
    };

    const revenue = {
        today: await calcRevenue(today),
        month: await calcRevenue(thisMonth),
        year: await calcRevenue(thisYear),
        total: await calcRevenue()
    };

    return { productCount, userCount, orderCount, revenue };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            {/* Revenue Stats Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                        <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Revenue (Today)</p>
                        <h3 className="text-2xl font-bold text-gray-900">${stats.revenue.today.toFixed(2)}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-teal-50 rounded-lg">
                        <DollarSign className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Revenue (Month)</p>
                        <h3 className="text-2xl font-bold text-gray-900">${stats.revenue.month.toFixed(2)}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                        <DollarSign className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Revenue (Year)</p>
                        <h3 className="text-2xl font-bold text-gray-900">${stats.revenue.year.toFixed(2)}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <DollarSign className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">All Time</p>
                        <h3 className="text-2xl font-bold text-gray-900">${stats.revenue.total.toFixed(2)}</h3>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a href="/admin/orders" className="block p-6 bg-green-900 text-white rounded-xl shadow hover:bg-green-800 transition-colors">
                    <h3 className="font-bold text-lg mb-2">Manage Orders</h3>
                    <p className="text-green-300 text-sm">View payments, update status & shipping.</p>
                </a>
                <a href="/admin/products" className="block p-6 bg-white border border-green-200 text-green-900 rounded-xl shadow-sm hover:border-green-500 transition-colors">
                    <h3 className="font-bold text-lg mb-2">Manage Products</h3>
                    <p className="text-green-600 text-sm">Add new plants, update stock & prices.</p>
                </a>
                <a href="/admin/users" className="block p-6 bg-white border border-green-200 text-green-900 rounded-xl shadow-sm hover:border-green-500 transition-colors">
                    <h3 className="font-bold text-lg mb-2">Customer List</h3>
                    <p className="text-green-600 text-sm">View registered users and history.</p>
                </a>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Recent Orders</h3>
                    <a href="/admin/orders" className="text-sm text-blue-600 hover:underline">View All</a>
                </div>
                <div className="divide-y divide-gray-50">
                    {recentOrders.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">No recent orders.</div>
                    ) : (
                        recentOrders.map(order => (
                            <div key={order.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                <div>
                                    <p className="font-bold text-sm text-gray-900">Order #{order.id.slice(0, 8)}</p>
                                    <p className="text-xs text-gray-500">{order.guestEmail} • ${order.totalUsd}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                    {order.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div >
    );
}
