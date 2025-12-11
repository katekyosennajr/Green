'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateStock(productId: string, newStock: number) {
    try {
        const product = await prisma.product.update({
            where: { id: productId },
            data: { stock: newStock }
        });

        // Revalidate Admin
        revalidatePath('/admin/products');

        // Revalidate Frontend
        revalidatePath('/catalog');
        revalidatePath('/'); // Home page might show products
        if (product.slug) {
            revalidatePath(`/product/${product.slug}`);
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to update stock:", error);
        return { success: false, error: "Failed to update stock" };
    }
}
