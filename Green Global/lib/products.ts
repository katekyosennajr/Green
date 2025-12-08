import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getFeaturedProducts() {
    try {
        const products = await prisma.product.findMany({
            where: {
                isFeatured: true,
                stock: { gt: 0 }
            },
            take: 4,
            orderBy: { createdAt: 'desc' }
        });
        return products;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}
