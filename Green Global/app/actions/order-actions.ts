'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function createOrder(prevState: any, formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const address = formData.get('address') as string;
        const cartItemsJson = formData.get('cartItems') as string;
        const totalUsd = parseFloat(formData.get('total') as string);

        if (!cartItemsJson) {
            return { message: 'Cart is empty', success: false };
        }

        const cartItems = JSON.parse(cartItemsJson);

        // Create the order
        const order = await prisma.order.create({
            data: {
                totalUsd,
                status: 'PENDING',
                guestEmail: email, // For now, we allow guest checkout
                // If logged in, we would attach userId here
                items: {
                    create: cartItems.map((item: any) => ({
                        productName: item.name,
                        productId: item.id,
                        quantity: item.quantity,
                        priceAtTime: item.price
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
        return { message: 'Failed to create order', success: false };
    }
}
