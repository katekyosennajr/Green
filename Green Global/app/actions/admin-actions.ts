'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus }
        });
        revalidatePath('/admin/orders');
        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false, message: 'Failed to update status' };
    }
}

export async function updatePaymentStatus(orderId: string, newStatus: string) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: newStatus }
        });
        revalidatePath('/admin/orders');
        revalidatePath('/admin'); // Update dashboard too
        return { success: true };
    } catch (error) {
        console.error("Failed to update payment status:", error);
        return { success: false, message: 'Failed to update payment status' };
    }
}
