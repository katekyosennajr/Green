import { PrismaClient } from '@prisma/client';
import { RevenueAnalytics } from '@/components/admin/revenue-analytics';

const prisma = new PrismaClient();

import { startOfDay, startOfMonth, startOfYear, subDays, format } from 'date-fns';

async function getStats() {
    const productCount = await prisma.product.count();
    const userCount = await prisma.user.count();
    const orderCount = await prisma.order.count();

    // 1. Total (Lifetime)
    const totalResult = await prisma.order.aggregate({
        _sum: { totalUsd: true },
        where: { paymentStatus: 'PAID' }
    });
    const totalRevenue = totalResult._sum.totalUsd || 0;

    // 2. Daily Sales (Last 7 Days) for Chart
    const dailySales = [];
    for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const start = startOfDay(date);
        const end = startOfDay(subDays(date, -1)); // Next day start

        const result = await prisma.order.aggregate({
            _sum: { totalUsd: true },
            where: {
                paymentStatus: 'PAID',
                createdAt: {
                    gte: start,
                    lt: end
                }
            }
        });

        dailySales.push({
            date: format(date, 'dd MMM'), // e.g., "12 Dec"
            amount: result._sum.totalUsd || 0
        });
    }

    // 3. Monthly Sales (This Year)
    const monthlySales = [];
    const yearStart = startOfYear(new Date());
    // Simple implementation: Group by month manually or just fetch all this year and process in JS (easier for low volume)
    const yearOrders = await prisma.order.findMany({
        where: {
            paymentStatus: 'PAID',
            createdAt: { gte: yearStart }
        },
        select: { createdAt: true, totalUsd: true }
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Initialize map
    const salesByMonth = new Array(12).fill(0);

    yearOrders.forEach(order => {
        const monthIndex = order.createdAt.getMonth();
        salesByMonth[monthIndex] += order.totalUsd;
    });

    monthlySales.push(...months.map((m, i) => ({
        month: m,
        amount: salesByMonth[i]
    })));

    return { productCount, userCount, orderCount, revenue: { total: totalRevenue }, analytics: { dailySales, monthlySales } };
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

            {/* Analytics Widget (Replaces Old 4 Cards) */}
            <RevenueAnalytics
                dailySales={stats.analytics.dailySales}
                monthlySales={stats.analytics.monthlySales}
                totalRevenue={stats.revenue.total}
            />

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
            <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                <div className="p-6 border-b border-green-100 flex justify-between items-center">
                    <h3 className="font-bold text-green-900">Recent Orders</h3>
                    <a href="/admin/orders" className="text-sm text-blue-600 hover:underline">View All</a>
                </div>
                <div className="divide-y divide-green-50">
                    {recentOrders.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">No recent orders.</div>
                    ) : (
                        recentOrders.map(order => (
                            <div key={order.id} className="p-4 flex justify-between items-center hover:bg-green-50">
                                <div>
                                    <p className="font-bold text-sm text-green-900">Order #{order.id.slice(0, 8)}</p>
                                    <p className="text-xs text-green-600">{order.guestEmail} • ${order.totalUsd}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                    {order.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
