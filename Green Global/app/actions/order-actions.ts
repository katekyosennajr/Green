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
                guestEmail: email, // For now, we allow guest checkout
                // If logged in, we would attach userId here
                items: {
                    create: cartItems.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        priceUsd: item.price
                    }))
                }
            }
        });

        // Optional: Reduce stock
        for (const item of cartItems) {
            await prisma.product.update({
                where: { id: item.id },
                data: { stock: { decrement: item.quantity } }
            });
        }

        // --- Payment Integration ---
        // We only generate a token if the currency is IDR (Midtrans constraint usually) or if we strictly convert/handle USD.
        // For this demo, we assume the totalUsd is converted to IDR or directly used if supported.
        // Let's assume we want to charge in IDR approx (since Midtrans is Indo).
        // 1 USD approx 16,000 IDR.
        const rate = 16000;
        const amountIdr = totalUsd * rate;

        // Import dynamically to avoid require issues if any
        const { createPaymentToken } = await import('@/lib/payment');
        const paymentToken = await createPaymentToken(order.id, amountIdr, { email });

        revalidatePath('/admin/orders');
        return {
            message: 'Order placed successfully!',
            success: true,
            orderId: order.id,
            paymentToken // Return the token to client
        };

    } catch (error) {
        console.error("Order creation failed:", error);
        return { message: `Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`, success: false };
    }
}
