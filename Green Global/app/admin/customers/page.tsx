import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { User, ShoppingBag, CreditCard } from 'lucide-react';
import { CustomerTable } from '@/components/admin/customer-table';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function CustomerListPage() {
    // Fetch all orders to derive customer data
    // Fetch confirmed orders only (PAID or SHIPPED)
    const orders = await prisma.order.findMany({
        where: {
            OR: [
                { paymentStatus: 'PAID' },
                { status: 'SHIPPED' },
                { status: 'DELIVERED' },
                { status: 'PROCESSING' },
                { status: 'PHYTO_IN_PROGRESS' } // Also count these as active/confirmed
            ]
        },
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

    // Aggregate by Email
    const customerMap = new Map<string, {
        email: string;
        name: string;
        totalOrders: number;
        totalSpend: number;
        lastOrderDate: Date;
    }>();

    orders.forEach(order => {
        // Use guestEmail or user.email as key
        const email = order.guestEmail || order.user?.email;
        if (!email) return;

        const current = customerMap.get(email) || {
            email,
            name: order.user?.name || email.split('@')[0], // Fallback name
            totalOrders: 0,
            totalSpend: 0,
            lastOrderDate: new Date(0)
        };

        current.totalOrders += 1;
        current.totalSpend += order.totalUsd;
        if (new Date(order.createdAt) > current.lastOrderDate) {
            current.lastOrderDate = new Date(order.createdAt);
        }

        customerMap.set(email, current);
    });

    // Convert dates to string for client component serialization
    const customers = Array.from(customerMap.values())
        .map(c => ({
            ...c,
            lastOrderDate: c.lastOrderDate.toISOString()
        }))
        .sort((a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime());

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-green-900">Customer Insights</h1>
                    <p className="text-green-600">Customers derived from order history (Guests & Registered).</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-green-100 shadow-sm">
                    <span className="text-sm font-bold text-green-900">Total Unique: </span>
                    <span className="text-gold-600 font-mono">{customers.length}</span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                <CustomerTable customers={customers} />
            </div>
        </div>
    );
}
