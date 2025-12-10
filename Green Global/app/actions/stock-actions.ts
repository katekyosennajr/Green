'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateStock(productId: string, newStock: number) {
    try {
        await prisma.product.update({
            where: { id: productId },
            data: { stock: newStock }
        });
        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        console.error("Failed to update stock:", error);
        return { success: false, error: "Failed to update stock" };
    }
}
