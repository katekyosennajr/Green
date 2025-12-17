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
        const name = formData.get('name') as string;
        const address = formData.get('address') as string;
        const country = formData.get('country') as string;
        const cartItemsJson = formData.get('cartItems') as string;
        const rawTotal = parseFloat(formData.get('totalAmount') as string);
        const currency = formData.get('currency') as string || 'USD';
        const shippingCourier = formData.get('courier') as string;
        const paymentPreference = formData.get('paymentPreference') as string;

        let totalUsd = 0;
        let paymentTotal = rawTotal;
        const rate = 16000;

        // Calculate Normalized USD and Payment Total
        if (currency === 'IDR') {
            totalUsd = rawTotal / rate;
            paymentTotal = rawTotal;
        } else {
            totalUsd = rawTotal;
            paymentTotal = rawTotal;
        }

        if (!cartItemsJson) {
            return { message: 'Cart is empty', success: false };
        }

        const cartItems: CartItem[] = JSON.parse(cartItemsJson);

        // Buat pesanan baru di database
        const order = await prisma.order.create({
            data: {
                totalUsd, // Normalized for stats
                paymentTotal, // Actual paid amount
                currency, // 'IDR' or 'USD'
                status: 'PENDING',
                guestEmail: email,
                name: name,
                shippingAddress: `${address}, ${country}`,
                shippingCourier: shippingCourier,
                paymentMethod: paymentPreference || 'Midtrans',
                items: {
                    create: cartItems.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        priceUsd: item.price // Cart always sends USD price, so no conversion needed here
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

        // Integrasi Pembayaran
        // Jika IDR, pakai langsung. Jika USD, konversi ke IDR untuk Midtrans.
        const amountIdr = currency === 'IDR' ? paymentTotal : (paymentTotal * rate);

        // Import dinamis untuk menghindari masalah require jika ada
        const { createPaymentToken } = await import('@/lib/payment');
        const paymentToken = await createPaymentToken(order.id, amountIdr, { email });

        revalidatePath('/admin/orders');
        // Revalidasi frontend agar stok terbaru tampil di katalog dan beranda
        revalidatePath('/catalog');


        revalidatePath('/');

        // Ambil slug produk untuk revalidasi halaman detail spesifik
        const productIds = cartItems.map(i => i.id);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { slug: true }
        });

        for (const p of products) {
            revalidatePath(`/product/${p.slug}`);
        }
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
