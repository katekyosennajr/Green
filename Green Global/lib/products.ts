import { PrismaClient } from '@prisma/client';
import { unstable_cache } from 'next/cache';

const prisma = new PrismaClient();

export const getFeaturedProducts = unstable_cache(
    async () => {
        try {
            const products = await prisma.product.findMany({
                where: {
                    isFeatured: true,
                    stock: { gt: 0 }
                },
                take: 4,
                orderBy: { createdAt: 'desc' }
            });
            console.log(`[DEBUG] Fetched ${products.length} featured products`);
            return products;
        } catch (error) {
            console.error("Failed to fetch featured products:", error);
            return [];
        }
    },
    ['featured-products-v5'],
    { revalidate: 3600, tags: ['products'] }
);

export const getProducts = unstable_cache(
    async () => {
        try {
            return await prisma.product.findMany({
                orderBy: { createdAt: 'desc' },
                where: { stock: { gt: 0 } }
            });
        } catch (error) {
            console.error("Failed to fetch products:", error);
            return [];
        }
    },
    ['all-products-v5'],
    { revalidate: 3600, tags: ['products'] }
);

export const getProduct = async (slug: string) => {
    const cachedFn = unstable_cache(
        async () => {
            try {
                return await prisma.product.findUnique({
                    where: { slug }
                });
            } catch (error) {
                console.error("Failed to fetch product:", error);
                return null;
            }
        },
        [`product-view-v5-${slug}`],
        { revalidate: 3600, tags: ['products'] }
    );
    return cachedFn();
};
