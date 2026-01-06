'use server';

import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

/**
 * Generates a CSV string from an array of objects.
 * Simple implementation to avoid dependencies.
 */
function generateCSV(data: Record<string, any>[]) {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','), // Header row
        ...data.map(row => {
            return headers.map(fieldName => {
                const value = row[fieldName];
                // Handle strings with commas or quotes
                const stringValue = value === null || value === undefined ? '' : String(value);
                const escaped = stringValue.replace(/"/g, '""');
                return `"${escaped}"`;
            }).join(',');
        })
    ];

    return csvRows.join('\n');
}

export async function exportOrdersCSV() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { email: true, name: true } },
                items: { include: { product: { select: { name: true } } } }
            }
        });

        const flatOrders = orders.map(o => ({
            'Order ID': o.id,
            'Date': format(o.createdAt, 'yyyy-MM-dd HH:mm'),
            'Customer Name': o.user?.name || o.name || 'Guest',
            'Customer Email': o.user?.email || o.guestEmail || '-',
            'Status': o.status,
            'Total (USD)': o.totalUsd.toFixed(2),
            'Payment Method': o.paymentMethod,
            'Courier': o.shippingCourier || 'Pending',
            'Tracking No': o.trackingNumber || '-',
            'Items': o.items.map(i => `${i.product.name} (x${i.quantity})`).join('; ')
        }));

        const csv = generateCSV(flatOrders);
        return { success: true, csv, filename: `orders-export-${format(new Date(), 'yyyyMMdd-HHmm')}.csv` };

    } catch (error) {
        console.error("Export Orders Error:", error);
        return { success: false, message: 'Failed to export orders' };
    }
}

export async function exportCustomersCSV() {
    try {
        const users = await prisma.user.findMany({
            where: { role: 'USER' },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { orders: true } }
            }
        });

        const flatUsers = users.map(u => ({
            'User ID': u.id,
            'Name': u.name || '-',
            'Email': u.email,
            'Registered At': format(u.createdAt, 'yyyy-MM-dd'),
            'Total Orders': u._count.orders,
            'Phone': u.phone || '-',
            'Country': u.country || '-'
        }));

        const csv = generateCSV(flatUsers);
        return { success: true, csv, filename: `customers-export-${format(new Date(), 'yyyyMMdd-HHmm')}.csv` };

    } catch (error) {
        console.error("Export Customers Error:", error);
        return { success: false, message: 'Failed to export customers' };
    }
}
