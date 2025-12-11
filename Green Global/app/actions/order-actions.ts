'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

interface CartItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

export async function createOrder(prevState: unknown, formData: FormData) {
    try {
        const email = formData.get('email') as string;
        const cartItemsJson = formData.get('cartItems') as string;
        const totalUsd = parseFloat(formData.get('totalUsd') as string);

        if (!cartItemsJson) {
            return { message: 'Cart is empty', success: false };
        }

        const cartItems: CartItem[] = JSON.parse(cartItemsJson);

        // Create the order
        const order = await prisma.order.create({
            data: {
                totalUsd,
                status: 'PENDING',
                guestEmail: email, // Saat ini kita izinkan checkout tamu
                // Jika login, kita akan lampirkan userId di sini
                items: {
                    create: cartItems.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        priceUsd: item.price
                    }))
                }
            }
        });

        // Opsional: Kurangi stok
        for (const item of cartItems) {
            await prisma.product.update({
                where: { id: item.id },
                data: { stock: { decrement: item.quantity } }
            });
        }

        // --- Integrasi Pembayaran ---
        // Kita hanya generate token jika mata uang IDR (batasan Midtrans biasanya) atau jika kita konversi ketat.
        // Untuk demo ini, kita asumsikan totalUsd dikonversi ke IDR atau dipakai langsung jika didukung.
        // Asumsi: Konversi ke IDR (karena Midtrans basis Indo).
        // 1 USD kira-kira 16.000 IDR.
        const rate = 16000;
        const amountIdr = totalUsd * rate;

        // Import dinamis untuk menghindari masalah require jika ada
        const { createPaymentToken } = await import('@/lib/payment');
        const paymentToken = await createPaymentToken(order.id, amountIdr, { email });

        revalidatePath('/admin/orders');
        return {
            message: 'Order placed successfully!',
            success: true,
            orderId: order.id,
            paymentToken // Kembalikan token ke client untuk Snap Popup
        };

    } catch (error) {
        console.error("Order creation failed:", error);
        return { message: `Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`, success: false };
    }
}
