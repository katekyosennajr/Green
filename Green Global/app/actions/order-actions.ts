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

        // Optional: Reduce stock (handling concurrency in real app is harder, simple version here)
        for (const item of cartItems) {
            await prisma.product.update({
                where: { id: item.id },
                data: { stock: { decrement: item.quantity } }
            });
        }

        revalidatePath('/admin/orders');
        return { message: 'Order placed successfully!', success: true, orderId: order.id };

    } catch (error) {
        console.error("Order creation failed:", error);
        return { message: `Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`, success: false };
    }
}
